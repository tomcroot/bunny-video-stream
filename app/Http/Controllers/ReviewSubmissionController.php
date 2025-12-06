<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ReviewSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'content' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Create review with is_approved = false (pending admin approval)
        $review = Review::create([
            'name' => $request->name,
            'email' => $request->email,
            'content' => $request->content,
            'rating' => $request->rating,
            'is_approved' => false, // Requires admin approval
        ]);

        // Notify admin about new review submission
        try {
            Mail::send([], [], function ($message) use ($review) {
                $stars = str_repeat('⭐', $review->rating);
                $message->to(config('mail.admin_email', 'info@promiselandfilms.com'))
                    ->subject('New Review Submitted - Pending Approval')
                    ->html("
                        <h2>New Review Awaiting Approval</h2>
                        <p><strong>Name:</strong> {$review->name}</p>
                        <p><strong>Email:</strong> {$review->email}</p>
                        <p><strong>Rating:</strong> {$stars} ({$review->rating}/5)</p>
                        <p><strong>Review:</strong></p>
                        <p>".nl2br(e($review->content))."</p>
                        <hr>
                        <p><small>Submitted at: {$review->created_at->format('F j, Y, g:i a')}</small></p>
                        <p><a href=\"".route('admin.reviews.index').'">View in Admin Panel</a></p>
                    ');
            });

            // Send confirmation to reviewer
            Mail::send([], [], function ($message) use ($review) {
                $message->to($review->email)
                    ->subject('Thank you for your review!')
                    ->html("
                        <h2>Thank you for your review!</h2>
                        <p>Dear {$review->name},</p>
                        <p>Thank you for taking the time to share your thoughts about \"A Crazy Day in Accra\".</p>
                        <p>Your review is currently pending approval and will be published on our website soon.</p>
                        <p><strong>Your review:</strong></p>
                        <p>".nl2br(e($review->content)).'</p>
                        <br>
                        <p>Best regards,<br>Promise Land Films Team</p>
                    ');
            });
        } catch (\Exception $e) {
            \Log::error('Review notification email error: '.$e->getMessage());
        }

        return back()->with('success', 'Thank you for your review! It will be published after approval.');
    }
}
