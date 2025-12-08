<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReferralCode extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'referral_codes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'description',
        'discount_percentage',
        'is_active',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the creator of this referral code.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all usages of this referral code.
     */
    public function usages(): HasMany
    {
        return $this->hasMany(ReferralUsage::class, 'referral_code_id');
    }

    /**
     * Get active codes only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Find code by code string (case-insensitive).
     */
    public function scopeByCode($query, string $code)
    {
        return $query->where('code', strtoupper($code));
    }

    /**
     * Get total discount amount given by this code.
     */
    public function getTotalDiscountGivenAttribute(): float
    {
        return (float) $this->usages()->sum('discount_applied');
    }

    /**
     * Get number of times this code has been used.
     */
    public function getUsageCountAttribute(): int
    {
        return $this->usages()->count();
    }
}
