<?php

namespace App\Services;

use App\Models\Banner;
use App\Models\ReferralCode;
use App\Models\ReferralUsage;
use App\Models\SiteSettings;
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
        if (! $this->isReferralSystemEnabled()) {
            throw new ModelNotFoundException('Referral system is disabled.');
        }

        $referralCode = ReferralCode::byCode($code)
            ->active()
            ->firstOrFail();

        return (float) $referralCode->discount_percentage;
    }

    /**
     * Get a referral code by code string.
     */
    public function getCodeByString(string $code, ?int $movieId = null): ?ReferralCode
    {
        if (! $this->isReferralSystemEnabled()) {
            return null;
        }

        $referralCode = ReferralCode::byCode($code)
            ->with('movie:id,title')
            ->first();

        if (! $referralCode) {
            return null;
        }

        if ($referralCode->movie_id !== null && $movieId !== null && (int) $referralCode->movie_id !== (int) $movieId) {
            return null;
        }

        return $referralCode;
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

        if (! $this->isReferralSystemEnabled()) {
            throw new ModelNotFoundException('Referral system is disabled.');
        }

        $length = $this->getConfiguredCodeLengths();
        $code = $this->generateUniqueNumericCode($length['min'], $length['max']);

        return ReferralCode::create([
            'code' => $code,
            'description' => 'Personal referral code for '.$user->name,
            'discount_percentage' => $this->getDefaultUserReferralDiscount(),
            'is_active' => $this->isDefaultReferralCodeActive(),
            'created_by' => $user->id,
        ]);
    }

    /**
     * Build a shareable referral link.
     */
    public function getReferralLink(string $code, ?int $movieId = null): string
    {
        $path = (string) $this->getReferralSetting('referral_link_path', '/ref');
        if ($path !== '/ref') {
            $path = '/ref';
        }

        $link = URL::to($path.'/'.strtoupper($code));

        if ($movieId !== null) {
            $link .= '?movieId='.$movieId;
        }

        return $link;
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
            ->with(['creator', 'movie'])
            ->firstOrFail();

        return [
            'scope' => 'admin',
            ...$this->buildReferralStatsPayload($referralCode, 20),
        ];
    }

    /**
     * Get minimal referral stats for the current user referral code.
     *
     * @return array<string, mixed>
     */
    public function getMyReferralStats(User $user): array
    {
        if (! $this->isReferralSystemEnabled()) {
            return [
                'scope' => 'user',
                'code' => null,
                'description' => null,
                'discount_percentage' => 0,
                'link' => null,
                'total_uses' => 0,
                'total_signups' => 0,
                'total_revenue' => 0,
                'total_discount_given' => 0,
                'recent_uses' => [],
            ];
        }

        $referralCode = $this->getOrCreateUserReferralCode($user);

        $stats = $this->buildReferralStatsPayload($referralCode, 5, null);

        return [
            'scope' => 'user',
            'code' => $stats['code'],
            'description' => $stats['description'],
            'discount_percentage' => $stats['discount_percentage'],
            'link' => $this->getReferralLink($referralCode->code),
            'total_uses' => $stats['total_uses'],
            'total_signups' => $stats['total_uses'],
            'total_revenue' => $stats['total_revenue'],
            'total_discount_given' => $stats['total_discount_given'],
            'recent_uses' => $stats['recent_uses'],
        ];
    }

    /**
     * Shared referral analytics engine used by both admin and user referral responses.
     *
     * @return array<string, mixed>
     */
    private function buildReferralStatsPayload(ReferralCode $referralCode, int $recentLimit = 20, ?int $movieId = null): array
    {
        $movieId = $referralCode->movie_id ?? $movieId;

        $usageQuery = $referralCode->usages()
            ->with(['user', 'subscription.payment']);

        if ($movieId !== null) {
            $usageQuery->whereHas('subscription', function ($query) use ($movieId) {
                $query->where('movie_id', $movieId);
            });
        }

        $usages = $usageQuery
            ->orderByDesc('used_at')
            ->get();

        $totalUses = $usages->count();
        $totalDiscountGiven = (float) $usages->sum('discount_applied');
        $totalRevenue = (float) $usages->sum(function ($usage) {
            return ((int) ($usage->subscription?->payment?->amount ?? 0)) / 100;
        });

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
            'movie_id' => $movieId,
            'code' => $referralCode->code,
            'description' => $referralCode->description,
            'discount_percentage' => (float) $referralCode->discount_percentage,
            'is_active' => $referralCode->is_active,
            'movie' => $referralCode->movie ? [
                'id' => $referralCode->movie->id,
                'title' => $referralCode->movie->title,
            ] : null,
            'link' => $this->getReferralLink($referralCode->code, $movieId),
            'creator' => $creator ? [
                'id' => $creator->id,
                'name' => $creator->name,
                'email' => $creator->email,
            ] : null,
            'total_uses' => $totalUses,
            'unique_users' => $usages->unique('user_id')->count(),
            'total_discount_given' => $totalDiscountGiven,
            'total_revenue' => round($totalRevenue, 2),
            'average_discount_per_use' => $totalUses > 0
                ? round($totalDiscountGiven / $totalUses, 2)
                : 0,
            'usage_by_day_last_30_days' => $usageByDay,
            'recent_uses' => $usages
                ->take($recentLimit)
                ->map(function ($usage) {
                    $usedAt = $usage->used_at?->toIso8601String();

                    return [
                        'id' => $usage->id,
                        'user_name' => $usage->user->name ?? null,
                        'user_email' => $usage->user->email ?? null,
                        'referred_email' => $usage->user->email ?? null,
                        'discount_applied' => (float) $usage->discount_applied,
                        'movie_id' => $usage->subscription?->movie_id,
                        'payment_amount' => round(((int) ($usage->subscription?->payment?->amount ?? 0)) / 100, 2),
                        'used_at' => $usedAt,
                        'created_at' => $usedAt,
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
        ?string $description = null,
        ?int $movieId = null
    ): ReferralCode {
        $userId = $createdBy instanceof User ? $createdBy->id : $createdBy;

        $maxDiscount = $this->getMaximumAllowedDiscountPercentage();
        $normalizedDiscount = max(0, min($maxDiscount, $discountPercentage));

        return ReferralCode::create([
            'code' => strtoupper($code),
            'description' => $description,
            'discount_percentage' => $normalizedDiscount,
            'created_by' => $userId,
            'movie_id' => $movieId,
        ]);
    }

    public function getAdminReferralMovies()
    {
        return Banner::query()
            ->select('id', 'title', 'is_active', 'target_date')
            ->orderBy('display_order')
            ->orderBy('title')
            ->get();
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

    private function getReferralSetting(string $key, mixed $default = null): mixed
    {
        return SiteSettings::getSetting($key, $default);
    }

    private function isReferralSystemEnabled(): bool
    {
        return (bool) $this->getReferralSetting('referral_system_enabled', true);
    }

    public function shouldAutoProvisionUserCode(): bool
    {
        return $this->isReferralSystemEnabled();
    }

    private function isDefaultReferralCodeActive(): bool
    {
        return (bool) $this->getReferralSetting('referral_default_code_active', true);
    }

    private function getDefaultUserReferralDiscount(): float
    {
        $default = (float) $this->getReferralSetting(
            'referral_default_discount_percentage',
            self::DEFAULT_USER_REFERRAL_DISCOUNT
        );

        return max(0, min($this->getMaximumAllowedDiscountPercentage(), $default));
    }

    private function getMaximumAllowedDiscountPercentage(): float
    {
        $value = (float) $this->getReferralSetting('referral_max_discount_percentage', 100);

        return max(1, min(100, $value));
    }

    /**
     * @return array{min: int, max: int}
     */
    private function getConfiguredCodeLengths(): array
    {
        $min = (int) $this->getReferralSetting('referral_min_code_length', 6);
        $max = (int) $this->getReferralSetting('referral_max_code_length', 10);

        $min = max(4, min(12, $min));
        $max = max($min, min(12, $max));

        return ['min' => $min, 'max' => $max];
    }
}
