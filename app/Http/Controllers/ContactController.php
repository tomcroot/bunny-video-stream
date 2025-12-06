<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Store the contact submission
        $contact = Contact::create($validator->validated());

        // Send email notification using Brevo
        try {
            Mail::send([], [], function ($message) use ($contact) {
                $message->to(config('mail.admin_email', 'info@promiselandfilms.com'))
                    ->subject('New Contact Form Submission: '.($contact->subject ?: 'No Subject'))
                    ->html("
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> {$contact->name}</p>
                        <p><strong>Email:</strong> {$contact->email}</p>
                        <p><strong>Phone:</strong> ".($contact->phone ?: 'Not provided').'</p>
                        <p><strong>Subject:</strong> '.($contact->subject ?: 'No subject').'</p>
                        <p><strong>Message:</strong></p>
                        <p>'.nl2br(e($contact->message))."</p>
                        <hr>
                        <p><small>Submitted at: {$contact->created_at->format('F j, Y, g:i a')}</small></p>
                    ");
            });

            // Send auto-reply to submitter
            Mail::send([], [], function ($message) use ($contact) {
                $message->to($contact->email)
                    ->subject('Thank you for contacting Promise Land Films')
                    ->html("
                        <h2>Thank you for contacting us!</h2>
                        <p>Dear {$contact->name},</p>
                        <p>We have received your message and will get back to you as soon as possible.</p>
                        <p><strong>Your message:</strong></p>
                        <p>".nl2br(e($contact->message)).'</p>
                        <br>
                        <p>Best regards,<br>Promise Land Films Team</p>
                    ');
            });
        } catch (\Exception $e) {
            \Log::error('Contact form email error: '.$e->getMessage());
            // Continue even if email fails - we've saved the contact
        }

        return back()->with('success', 'Thank you for your message! We will get back to you soon.');
    }
}
