<?php

namespace App\Services;

use App\Models\ReferralCode;
use App\Models\ReferralUsage;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Service for handling referral code and discount logic.
 */
class ReferralService
{
    /**
     * Validate a referral code and return discount percentage.
     *
     * @param  string  $code  The referral/coupon code
     * @return float The discount percentage (0-100)
     *
     * @throws ModelNotFoundException If code is invalid or inactive
     */
    public function validateCode(string $code): float
    {
        $referralCode = ReferralCode::byCode($code)
            ->active()
            ->firstOrFail();

        return (float) $referralCode->discount_percentage;
    }

    /**
     * Get a referral code by code string.
     */
    public function getCodeByString(string $code): ?ReferralCode
    {
        return ReferralCode::byCode($code)->first();
    }

    /**
     * Calculate discount amount based on original price and code.
     *
     * @param  float  $originalPrice  The original price
     * @param  string  $code  The referral/coupon code
     * @return array<string, float> ['original_price' => float, 'discount_percentage' => float, 'discount_amount' => float, 'final_price' => float]
     */
    public function calculateDiscount(float $originalPrice, string $code): array
    {
        $discountPercentage = 0;

        try {
            $discountPercentage = $this->validateCode($code);
        } catch (ModelNotFoundException) {
            // Code is invalid or inactive, use 0% discount
        }

        $discountAmount = ($originalPrice * $discountPercentage) / 100;
        $finalPrice = $originalPrice - $discountAmount;

        return [
            'original_price' => $originalPrice,
            'discount_percentage' => $discountPercentage,
            'discount_amount' => round($discountAmount, 2),
            'final_price' => round($finalPrice, 2),
        ];
    }

    /**
     * Record usage of a referral code.
     *
     * @param  string  $code  The referral/coupon code
     * @param  User|string  $user  The user who used the code (User model or user ID)
     * @param  string|null  $subscriptionId  The subscription ID if applicable
     * @param  float  $discountAmount  The discount amount applied
     *
     * @throws ModelNotFoundException If code is invalid
     */
    public function recordUsage(
        string $code,
        User|string $user,
        ?string $subscriptionId = null,
        float $discountAmount = 0
    ): ReferralUsage {
        $referralCode = ReferralCode::byCode($code)->firstOrFail();
        $userId = $user instanceof User ? $user->id : $user;

        return ReferralUsage::create([
            'referral_code_id' => $referralCode->id,
            'user_id' => $userId,
            'subscription_id' => $subscriptionId,
            'discount_applied' => $discountAmount,
        ]);
    }

    /**
     * Get usage statistics for a referral code.
     *
     * @return array<string, mixed>
     */
    public function getCodeStats(string $code): array
    {
        $referralCode = ReferralCode::byCode($code)->firstOrFail();

        $usages = $referralCode->usages()->get();

        return [
            'code' => $referralCode->code,
            'description' => $referralCode->description,
            'discount_percentage' => (float) $referralCode->discount_percentage,
            'is_active' => $referralCode->is_active,
            'total_uses' => $usages->count(),
            'total_discount_given' => (float) $usages->sum('discount_applied'),
            'recent_uses' => $usages
                ->sortByDesc('used_at')
                ->take(10)
                ->map(function ($usage) {
                    return [
                        'user_name' => $usage->user->name,
                        'user_email' => $usage->user->email,
                        'discount_applied' => (float) $usage->discount_applied,
                        'used_at' => $usage->used_at->toIso8601String(),
                    ];
                })
                ->values()
                ->all(),
        ];
    }

    /**
     * Get all active referral codes.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveCodesList()
    {
        return ReferralCode::active()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Create a new referral code.
     */
    public function createCode(
        string $code,
        float $discountPercentage,
        User|string $createdBy,
        ?string $description = null
    ): ReferralCode {
        $userId = $createdBy instanceof User ? $createdBy->id : $createdBy;

        return ReferralCode::create([
            'code' => strtoupper($code),
            'description' => $description,
            'discount_percentage' => $discountPercentage,
            'created_by' => $userId,
        ]);
    }

    /**
     * Deactivate a referral code.
     */
    public function deactivateCode(string $code): bool
    {
        return ReferralCode::byCode($code)->update(['is_active' => false]);
    }

    /**
     * Activate a referral code.
     */
    public function activateCode(string $code): bool
    {
        return ReferralCode::byCode($code)->update(['is_active' => true]);
    }
}
