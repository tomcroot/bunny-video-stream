import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Checkbox } from '@/Components/ui/checkbox';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';

export default function Index({ recipients, stats }) {
    const [selected, setSelected] = useState([]);

    const bulkForm = useForm({
        user_ids: [],
        subject: '',
        html_content: '',
        text_content: '',
    });

    const promoForm = useForm({
        subject: '',
        html_content: '',
        text_content: '',
    });

    const testForm = useForm({
        email: '',
        subject: '',
        html_content: '',
        text_content: '',
    });

    const toggleRecipient = (id, checked) => {
        setSelected(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
    };

    const toggleAll = (checked) => {
        setSelected(checked ? recipients.map(r => r.id) : []);
    };

    const submitBulk = (e) => {
        e.preventDefault();
        bulkForm.setData('user_ids', selected);
        bulkForm.post(route('admin.email.bulk'), {
            onSuccess: () => {
                toast.success('Bulk email sent');
                bulkForm.reset();
                setSelected([]);
            },
            onError: () => toast.error('Failed to send bulk email'),
        });
    };

    const submitPromo = (e) => {
        e.preventDefault();
        promoForm.post(route('admin.email.promotional-campaign'), {
            onSuccess: () => {
                toast.success('Promotional campaign sent');
                promoForm.reset();
            },
            onError: () => toast.error('Failed to send campaign'),
        });
    };

    const submitTest = (e) => {
        e.preventDefault();
        testForm.post(route('admin.email.test'), {
            onSuccess: () => {
                toast.success('Test email sent');
                testForm.reset();
            },
            onError: () => toast.error('Failed to send test email'),
        });
    };

    return (
        <AdminLayout>
            <Head title="Email Management" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Email Management</h1>
                    <p className="text-muted-foreground">Send bulk, campaign, and test emails via Brevo/SMTP.</p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total recipients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_recipients ?? 0}</div>
                            <p className="text-xs text-muted-foreground">Users with valid email addresses</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Bulk Email */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Bulk Email</CardTitle>
                            <CardDescription>Send to selected users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitBulk} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Select Recipients ({selected.length} selected)</Label>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="select-all"
                                            checked={selected.length === recipients.length && recipients.length > 0}
                                            onCheckedChange={toggleAll}
                                        />
                                        <Label htmlFor="select-all">Select All</Label>
                                        <Badge variant="secondary">{recipients.length} available</Badge>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto border rounded p-2 space-y-2">
                                        {recipients.map((user) => (
                                            <div key={user.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`user-${user.id}`}
                                                    checked={selected.includes(user.id)}
                                                    onCheckedChange={(checked) => toggleRecipient(user.id, checked)}
                                                />
                                                <Label htmlFor={`user-${user.id}`} className="text-sm">
                                                    {user.name} ({user.email})
                                                </Label>
                                            </div>
                                        ))}
                                        {recipients.length === 0 && (
                                            <p className="text-sm text-muted-foreground">No recipients available.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bulk-subject">Subject</Label>
                                    <Input
                                        id="bulk-subject"
                                        value={bulkForm.data.subject}
                                        onChange={(e) => bulkForm.setData('subject', e.target.value)}
                                        placeholder="Enter subject"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bulk-html">HTML Content</Label>
                                    <Textarea
                                        id="bulk-html"
                                        value={bulkForm.data.html_content}
                                        onChange={(e) => bulkForm.setData('html_content', e.target.value)}
                                        rows={5}
                                        required
                                        placeholder="<p>Your message...</p>"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bulk-text">Plain Text (optional)</Label>
                                    <Textarea
                                        id="bulk-text"
                                        value={bulkForm.data.text_content}
                                        onChange={(e) => bulkForm.setData('text_content', e.target.value)}
                                        rows={3}
                                        placeholder="Optional plain text version"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={selected.length === 0 || bulkForm.processing}
                                    className="w-full"
                                >
                                    {bulkForm.processing ? 'Sending...' : 'Send Bulk Email'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Promotional Campaign */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Promotional Campaign</CardTitle>
                            <CardDescription>Send to all recipients</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitPromo} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="promo-subject">Subject</Label>
                                    <Input
                                        id="promo-subject"
                                        value={promoForm.data.subject}
                                        onChange={(e) => promoForm.setData('subject', e.target.value)}
                                        placeholder="Enter subject"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="promo-html">HTML Content</Label>
                                    <Textarea
                                        id="promo-html"
                                        value={promoForm.data.html_content}
                                        onChange={(e) => promoForm.setData('html_content', e.target.value)}
                                        rows={5}
                                        required
                                        placeholder="<p>Your campaign message...</p>"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="promo-text">Plain Text (optional)</Label>
                                    <Textarea
                                        id="promo-text"
                                        value={promoForm.data.text_content}
                                        onChange={(e) => promoForm.setData('text_content', e.target.value)}
                                        rows={3}
                                        placeholder="Optional plain text version"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={promoForm.processing}
                                    className="w-full"
                                >
                                    {promoForm.processing ? 'Sending...' : 'Send Campaign to All'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Test Email */}
                <Card>
                    <CardHeader>
                        <CardTitle>Send Test Email</CardTitle>
                        <CardDescription>Send a single test to verify delivery</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitTest} className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="test-email">Email</Label>
                                <Input
                                    id="test-email"
                                    type="email"
                                    value={testForm.data.email}
                                    onChange={(e) => testForm.setData('email', e.target.value)}
                                    required
                                    placeholder="recipient@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="test-subject">Subject</Label>
                                <Input
                                    id="test-subject"
                                    value={testForm.data.subject}
                                    onChange={(e) => testForm.setData('subject', e.target.value)}
                                    required
                                    placeholder="Test subject"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="test-html">HTML Content</Label>
                                <Textarea
                                    id="test-html"
                                    value={testForm.data.html_content}
                                    onChange={(e) => testForm.setData('html_content', e.target.value)}
                                    rows={4}
                                    required
                                    placeholder="<p>Hello!</p>"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="test-text">Plain Text (optional)</Label>
                                <Textarea
                                    id="test-text"
                                    value={testForm.data.text_content}
                                    onChange={(e) => testForm.setData('text_content', e.target.value)}
                                    rows={3}
                                    placeholder="Optional plain text version"
                                />
                            </div>
                            <Button type="submit" disabled={testForm.processing} className="md:col-span-2">
                                {testForm.processing ? 'Sending...' : 'Send Test Email'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
