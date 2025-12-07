import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function Index({ usersWithPhones, stats }) {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const customSmsForm = useForm({
        user_ids: [],
        message: ''
    });

    const paymentForm = useForm({
        movie_title: '',
        amount: ''
    });

    const renewalForm = useForm({
        movie_title: '',
        days_remaining: ''
    });

    const handleUserSelect = (userId, checked) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedUsers(usersWithPhones.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const submitCustomSms = (e) => {
        e.preventDefault();
        customSmsForm.setData('user_ids', selectedUsers);
        customSmsForm.post(route('admin.sms.custom'), {
            onSuccess: () => {
                toast.success('SMS sent successfully!');
                customSmsForm.reset();
                setSelectedUsers([]);
            },
            onError: () => {
                toast.error('Failed to send SMS');
            }
        });
    };

    const submitPaymentNotifications = (e) => {
        e.preventDefault();
        paymentForm.post(route('admin.sms.payment-notifications'), {
            onSuccess: () => {
                toast.success('Payment notifications sent!');
                paymentForm.reset();
            },
            onError: () => {
                toast.error('Failed to send payment notifications');
            }
        });
    };

    const submitRenewalReminders = (e) => {
        e.preventDefault();
        renewalForm.post(route('admin.sms.renewal-reminders'), {
            onSuccess: () => {
                toast.success('Renewal reminders sent!');
                renewalForm.reset();
            },
            onError: () => {
                toast.error('Failed to send renewal reminders');
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="SMS Management" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">SMS Management</h1>
                    <p className="text-muted-foreground">
                        Send bulk SMS notifications to your users
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Users with Phones
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users_with_phones}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Custom SMS */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Send Custom SMS</CardTitle>
                            <CardDescription>
                                Send a custom message to selected users
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitCustomSms} className="space-y-4">
                                {/* User Selection */}
                                <div className="space-y-2">
                                    <Label>Select Recipients ({selectedUsers.length} selected)</Label>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="select-all"
                                            checked={selectedUsers.length === usersWithPhones.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                        <Label htmlFor="select-all">Select All Users</Label>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
                                        {usersWithPhones.map((user) => (
                                            <div key={user.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`user-${user.id}`}
                                                    checked={selectedUsers.includes(user.id)}
                                                    onCheckedChange={(checked) => handleUserSelect(user.id, checked)}
                                                />
                                                <Label htmlFor={`user-${user.id}`} className="text-sm">
                                                    {user.name} ({user.phone_number})
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message (max 160 characters)</Label>
                                    <Textarea
                                        id="message"
                                        value={customSmsForm.data.message}
                                        onChange={e => customSmsForm.setData('message', e.target.value)}
                                        placeholder="Enter your SMS message..."
                                        maxLength={160}
                                        rows={3}
                                    />
                                    <div className="text-sm text-muted-foreground">
                                        {customSmsForm.data.message.length}/160 characters
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={selectedUsers.length === 0 || customSmsForm.processing}
                                    className="w-full"
                                >
                                    {customSmsForm.processing ? 'Sending...' : 'Send SMS'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Payment Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Notifications</CardTitle>
                            <CardDescription>
                                Send payment confirmation to all users with phones
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitPaymentNotifications} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="movie_title">Movie Title</Label>
                                    <Input
                                        id="movie_title"
                                        value={paymentForm.data.movie_title}
                                        onChange={e => paymentForm.setData('movie_title', e.target.value)}
                                        placeholder="Enter movie title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount (₵)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        value={paymentForm.data.amount}
                                        onChange={e => paymentForm.setData('amount', e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={paymentForm.processing}
                                    className="w-full"
                                >
                                    {paymentForm.processing ? 'Sending...' : 'Send Payment Notifications'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Renewal Reminders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Renewal Reminders</CardTitle>
                        <CardDescription>
                            Send renewal reminders to users (available when subscription system is implemented)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitRenewalReminders} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="renewal_movie_title">Movie Title</Label>
                                    <Input
                                        id="renewal_movie_title"
                                        value={renewalForm.data.movie_title}
                                        onChange={e => renewalForm.setData('movie_title', e.target.value)}
                                        placeholder="Enter movie title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="days_remaining">Days Remaining</Label>
                                    <Input
                                        id="days_remaining"
                                        type="number"
                                        value={renewalForm.data.days_remaining}
                                        onChange={e => renewalForm.setData('days_remaining', e.target.value)}
                                        placeholder="7"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={renewalForm.processing}
                                variant="outline"
                                className="w-full"
                            >
                                {renewalForm.processing ? 'Sending...' : 'Send Renewal Reminders (Coming Soon)'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
