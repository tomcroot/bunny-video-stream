<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Support\PhoneNumber;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $input['phone_number'] = PhoneNumber::normalize($input['phone_number'] ?? null);
        $input['email'] = isset($input['email']) && $input['email'] !== ''
            ? strtolower($input['email'])
            : null;

        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'nullable',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'phone_number' => [
                'required',
                'string',
                'max:32',
                Rule::unique(User::class, 'phone_number'),
            ],
        ])->validate();

        $email = $input['email'] ?: PhoneNumber::placeholderEmail($input['phone_number']);

        $user = User::create([
            'name' => $input['name'],
            'email' => $email,
            'password' => Hash::make($input['password']),
            'phone_number' => $input['phone_number'],
        ]);

        if ($input['email']) {
            $user->sendEmailVerificationNotification();
        }

        return $user;
    }
}
