<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use App\Services\PaystackService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterAndPayController extends Controller
{
    public function registerAndPay(Request $request, PaystackService $paystack)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        // Check if user already exists
        $user = User::where('phone_number', $validated['phone_number'])
            ->orWhere('email', $validated['email'])
            ->first();

        if (! $user) {
            $user = User::create([
                'name' => $validated['name'],
                'phone_number' => $validated['phone_number'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
        }

        // Create a payment record (minimal, you may want to expand this)
        $reference = $paystack->generateReference();
        $payment = Payment::create([
            'user_id' => $user->id,
            'reference' => $reference,
            'amount' => 1000, // Set your default/required amount here
            'currency' => 'GHS',
            'status' => 'initialized',
            'meta' => [
                'name' => $user->name,
                'phone_number' => $user->phone_number,
                'email' => $user->email,
                'password' => $validated['password'],
            ],
        ]);

        $payload = [
            'email' => $user->email ?? ($user->phone_number.'@acrazydayinaccra.com'),
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'reference' => $payment->reference,
            'callback_url' => config('paystack.callback_url'),
            'metadata' => [
                'user_id' => $user->id,
                'payment_id' => $payment->id,
            ],
        ];

        $resp = $paystack->initialize($payload);

        if (! $resp['ok']) {
            $payment->update(['status' => 'failed']);

            return back()->with('error', 'Paystack init failed');
        }

        // Redirect to Paystack payment page
        return redirect()->away($resp['body']['data']['authorization_url']);
    }
}
