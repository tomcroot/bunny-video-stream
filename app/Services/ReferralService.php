<?php

namespace App\Services;

use App\Models\ReferralCode;
use App\Models\ReferralUsage;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\URL;

/**
 * Service for handling referral code and discount logic.
 */
class ReferralService
{
    /**
     * Default discount percentage for auto-generated user referral codes.
     */
    private const DEFAULT_USER_REFERRAL_DISCOUNT = 5;

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
     * Ensure a user has an auto-generated numeric referral code.
     */
    public function getOrCreateUserReferralCode(User $user): ReferralCode
    {
        $existing = ReferralCode::where('created_by', $user->id)
            ->orderByDesc('id')
            ->first();

        if ($existing) {
            return $existing;
        }

        $code = $this->generateUniqueNumericCode(6, 10);

        return ReferralCode::create([
            'code' => $code,
            'description' => 'Personal referral code for '.$user->name,
            'discount_percentage' => self::DEFAULT_USER_REFERRAL_DISCOUNT,
            'is_active' => true,
            'created_by' => $user->id,
        ]);
    }

    /**
     * Build a shareable referral link.
     */
    public function getReferralLink(string $code): string
    {
        return URL::to('/ref/'.strtoupper($code));
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

        if ((string) $referralCode->created_by === (string) $userId) {
            throw new ModelNotFoundException('Self-referral is not allowed.');
        }

        return ReferralUsage::firstOrCreate([
            'referral_code_id' => $referralCode->id,
            'user_id' => $userId,
            'subscription_id' => $subscriptionId,
        ], [
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
        $referralCode = ReferralCode::byCode($code)
            ->with('creator')
            ->firstOrFail();

        $usages = $referralCode->usages()
            ->with('user')
            ->orderByDesc('used_at')
            ->get();

        $usageByDay = $usages
            ->where('used_at', '>=', Carbon::now()->subDays(30))
            ->groupBy(fn ($usage) => $usage->used_at->format('Y-m-d'))
            ->map(fn ($group) => [
                'count' => $group->count(),
                'discount' => (float) $group->sum('discount_applied'),
            ])
            ->sortKeys()
            ->all();

        $creator = $referralCode->creator;

        return [
            'scope' => 'admin',
            'code' => $referralCode->code,
            'description' => $referralCode->description,
            'discount_percentage' => (float) $referralCode->discount_percentage,
            'is_active' => $referralCode->is_active,
            'creator' => $creator ? [
                'id' => $creator->id,
                'name' => $creator->name,
                'email' => $creator->email,
            ] : null,
            'total_uses' => $usages->count(),
            'unique_users' => $usages->unique('user_id')->count(),
            'total_discount_given' => (float) $usages->sum('discount_applied'),
            'average_discount_per_use' => $usages->count() > 0
                ? round((float) $usages->sum('discount_applied') / $usages->count(), 2)
                : 0,
            'usage_by_day_last_30_days' => $usageByDay,
            'recent_uses' => $usages
                ->take(20)
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
     * Get minimal referral stats for the current user referral code.
     *
     * @return array<string, mixed>
     */
    public function getMyReferralStats(User $user): array
    {
        $referralCode = $this->getOrCreateUserReferralCode($user);

        $usages = $referralCode->usages()
            ->with('user')
            ->orderByDesc('used_at')
            ->get();

        return [
            'scope' => 'user',
            'code' => $referralCode->code,
            'discount_percentage' => (float) $referralCode->discount_percentage,
            'link' => $this->getReferralLink($referralCode->code),
            'total_uses' => $usages->count(),
            'total_discount_given' => (float) $usages->sum('discount_applied'),
            'recent_uses' => $usages->take(5)->map(function ($usage) {
                return [
                    'user_name' => $usage->user->name,
                    'discount_applied' => (float) $usage->discount_applied,
                    'used_at' => $usage->used_at->toIso8601String(),
                ];
            })->values()->all(),
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

    /**
     * Generate a unique numeric referral code between the given lengths.
     */
    private function generateUniqueNumericCode(int $minLength = 6, int $maxLength = 10): string
    {
        for ($length = $minLength; $length <= $maxLength; $length++) {
            for ($attempt = 0; $attempt < 20; $attempt++) {
                $min = 10 ** ($length - 1);
                $max = (10 ** $length) - 1;
                $candidate = (string) random_int($min, $max);

                if (! ReferralCode::where('code', $candidate)->exists()) {
                    return $candidate;
                }
            }
        }

        throw new \RuntimeException('Unable to generate a unique referral code.');
    }
}
