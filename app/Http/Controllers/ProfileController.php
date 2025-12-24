<?php

namespace App\Http\Controllers;

use App\Support\PhoneNumber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('Profile/Edit', [
            'user' => Auth::user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $payload = $request->all();
        $payload['email'] = isset($payload['email']) && $payload['email'] !== ''
            ? strtolower($payload['email'])
            : null;
        $payload['phone_number'] = PhoneNumber::normalize($payload['phone_number'] ?? null);

        $validated = Validator::make($payload, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone_number' => ['required', 'string', 'max:32', Rule::unique('users', 'phone_number')->ignore($user->id)],
        ])->validate();

        $emailInput = $validated['email'] ?? null;
        $email = $emailInput ?: PhoneNumber::placeholderEmail($validated['phone_number']);
        $emailChanged = $email !== $user->email;

        $user->forceFill([
            'name' => $validated['name'],
            'email' => $email,
            'phone_number' => $validated['phone_number'],
        ]);

        if ($emailChanged) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($emailChanged && $emailInput) {
            $user->sendEmailVerificationNotification();
        }

        $message = 'Profile updated successfully!';

        if ($emailChanged && $emailInput) {
            $message .= ' Please check your inbox to verify your new email address.';
        }

        return back()->with('success', $message);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully!');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => 'required|current_password',
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
