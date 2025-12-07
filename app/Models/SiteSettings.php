<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSettings extends Model
{
    protected $table = 'site_settings';

    protected $fillable = [
        'key',
        'value',
        'data_type',
        'description',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get a setting by key
     */
    public static function getSetting($key, $default = null)
    {
        $setting = self::where('key', $key)->first();

        return $setting ? self::castValue($setting->value, $setting->data_type) : $default;
    }

    /**
     * Set a setting by key
     */
    public static function setSetting($key, $value, $dataType = 'string', $description = null)
    {
        return self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'data_type' => $dataType,
                'description' => $description,
            ]
        );
    }

    /**
     * Cast value based on data type
     */
    private static function castValue($value, $dataType)
    {
        return match ($dataType) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'float' => (float) $value,
            'json' => json_decode($value, true),
            default => $value,
        };
    }
}
