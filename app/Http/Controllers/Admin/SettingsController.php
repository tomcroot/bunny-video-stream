<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SettingsController extends Controller
{
    private const REFERRAL_DEFAULTS = [
        'referral_system_enabled' => 'true',
        'referral_default_discount_percentage' => '5',
        'referral_max_discount_percentage' => '100',
        'referral_min_code_length' => '6',
        'referral_max_code_length' => '10',
        'referral_default_code_active' => 'true',
        'referral_link_path' => '/ref',
    ];

    private const REFERRAL_DATA_TYPES = [
        'referral_system_enabled' => 'boolean',
        'referral_default_discount_percentage' => 'float',
        'referral_max_discount_percentage' => 'float',
        'referral_min_code_length' => 'integer',
        'referral_max_code_length' => 'integer',
        'referral_default_code_active' => 'boolean',
        'referral_link_path' => 'string',
    ];

    /**
     * Show settings form
     */
    public function index()
    {
        $settings = SiteSettings::all();

        // Format settings for the frontend
        $formattedSettings = $settings->reduce(function ($carry, $setting) {
            $carry[$setting->key] = [
                'value' => $setting->value,
                'data_type' => $setting->data_type,
                'description' => $setting->description,
            ];

            return $carry;
        }, []);

        // Provide defaults from .env where applicable
        $defaults = [
            'site_title' => config('app.name', 'A Crazy Day in Accra'),
            'contact_email' => config('mail.from.address', 'contact@example.com'),
            'enable_contact_form' => 'true',
            'enable_reviews' => 'true',
            'reviews_require_approval' => 'true',
            'maintenance_mode' => 'false',
            'max_file_upload_mb' => '50',
            'premiere_date' => '2025-12-10T06:00:00Z',
            'referral_system_enabled' => 'true',
            'referral_default_discount_percentage' => '5',
            'referral_max_discount_percentage' => '100',
            'referral_min_code_length' => '6',
            'referral_max_code_length' => '10',
            'referral_default_code_active' => 'true',
            'referral_link_path' => '/ref',
        ];

        // Merge defaults with existing settings
        foreach ($defaults as $key => $value) {
            if (! isset($formattedSettings[$key])) {
                $formattedSettings[$key] = [
                    'value' => $value,
                    'data_type' => is_numeric($value) ? 'integer' : (in_array($value, ['true', 'false']) ? 'boolean' : 'string'),
                    'description' => '',
                ];
            }
        }

        return Inertia::render('Admin/Settings', [
            'settings' => $formattedSettings,
            'settingsList' => $settings,
            'envInfo' => [
                'app_name' => config('app.name'),
                'app_env' => config('app.env'),
                'app_url' => config('app.url'),
                'mail_from' => config('mail.from.address'),
                'mail_mailer' => config('mail.default'),
            ],
            'availableSettings' => [
                [
                    'key' => 'premiere_date',
                    'label' => 'Premiere Date & Time',
                    'description' => 'When the film premieres (ISO 8601 format)',
                    'data_type' => 'string',
                    'example' => '2025-12-10T06:00:00Z',
                    'env_source' => null,
                ],
                [
                    'key' => 'site_title',
                    'label' => 'Site Title',
                    'description' => 'Main site title displayed in header',
                    'data_type' => 'string',
                    'example' => 'A Crazy Day in Accra',
                    'env_source' => 'APP_NAME in .env',
                ],
                [
                    'key' => 'site_description',
                    'label' => 'Site Description',
                    'description' => 'SEO meta description',
                    'data_type' => 'string',
                    'example' => 'A gripping thriller set in Accra...',
                    'env_source' => null,
                ],
                [
                    'key' => 'contact_email',
                    'label' => 'Contact Email',
                    'description' => 'Email for contact form submissions',
                    'data_type' => 'string',
                    'example' => 'contact@acrazydayinaccra.com',
                    'env_source' => 'MAIL_FROM_ADDRESS in .env',
                ],
                [
                    'key' => 'enable_contact_form',
                    'label' => 'Enable Contact Form',
                    'description' => 'Allow visitors to submit contact requests',
                    'data_type' => 'boolean',
                    'example' => 'true',
                    'env_source' => null,
                ],
                [
                    'key' => 'enable_reviews',
                    'label' => 'Enable Reviews',
                    'description' => 'Allow visitors to submit reviews',
                    'data_type' => 'boolean',
                    'example' => 'true',
                    'env_source' => null,
                ],
                [
                    'key' => 'reviews_require_approval',
                    'label' => 'Reviews Require Approval',
                    'description' => 'Moderate reviews before publishing',
                    'data_type' => 'boolean',
                    'example' => 'true',
                    'env_source' => null,
                ],
                [
                    'key' => 'maintenance_mode',
                    'label' => 'Maintenance Mode',
                    'description' => 'Enable maintenance mode (show maintenance page)',
                    'data_type' => 'boolean',
                    'example' => 'false',
                    'env_source' => null,
                ],
                [
                    'key' => 'max_file_upload_mb',
                    'label' => 'Max File Upload Size (MB)',
                    'description' => 'Maximum file size for uploads',
                    'data_type' => 'integer',
                    'example' => '50',
                    'env_source' => null,
                ],
                [
                    'key' => 'referral_system_enabled',
                    'label' => 'Enable Referral System',
                    'description' => 'Globally enable or disable referrals',
                    'data_type' => 'boolean',
                    'example' => 'true',
                    'env_source' => null,
                ],
                [
                    'key' => 'referral_default_discount_percentage',
                    'label' => 'Default Referral Discount (%)',
                    'description' => 'Default discount for auto-generated user referral codes',
                    'data_type' => 'float',
                    'example' => '5',
                    'env_source' => null,
                ],
                [
                    'key' => 'referral_max_discount_percentage',
                    'label' => 'Maximum Discount Percentage',
                    'description' => 'Maximum discount allowed when creating referral codes',
                    'data_type' => 'float',
                    'example' => '100',
                    'env_source' => null,
                ],
                [
                    'key' => 'referral_min_code_length',
                    'label' => 'Referral Min Code Length',
                    'description' => 'Minimum length for auto-generated numeric referral codes',
                    'data_type' => 'integer',
                    'example' => '6',
                    'env_source' => null,
                ],
                [
                    'key' => 'referral_max_code_length',
                    'label' => 'Referral Max Code Length',
                    'description' => 'Maximum length for auto-generated numeric referral codes',
                    'data_type' => 'integer',
                    'example' => '10',
                    'env_source' => null,
                ],
                [
                    'key' => 'referral_default_code_active',
                    'label' => 'Auto-Created Codes Active',
                    'description' => 'Whether newly auto-generated user codes are active by default',
                    'data_type' => 'boolean',
                    'example' => 'true',
                    'env_source' => null,
                ],
                [
                    'key' => 'referral_link_path',
                    'label' => 'Referral Link Path',
                    'description' => 'Path used when generating referral links (e.g. /ref)',
                    'data_type' => 'string',
                    'example' => '/ref',
                    'env_source' => null,
                ],
            ],
        ]);
    }

    /**
     * Update settings
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'required',
            'settings.*.data_type' => 'required|in:string,boolean,integer,float,json',
            'settings.*.description' => 'nullable|string',
        ]);

        $settingsByKey = collect($validated['settings'])
            ->keyBy('key')
            ->map(fn ($item) => [
                'value' => $item['value'],
                'data_type' => $item['data_type'],
            ])
            ->all();

        $this->validateReferralSettingsPayload($settingsByKey);

        foreach ($validated['settings'] as $setting) {
            SiteSettings::setSetting(
                $setting['key'],
                $setting['value'],
                $setting['data_type'],
                $setting['description'] ?? null
            );
        }

        return redirect()->back()->with('message', 'Settings updated successfully!');
    }

    /**
     * Update a single setting
     */
    public function updateSingle(Request $request, $key)
    {
        $validated = $request->validate([
            'value' => 'required',
            'data_type' => 'required|in:string,boolean,integer,float,json',
            'description' => 'nullable|string',
        ]);

        if (array_key_exists($key, self::REFERRAL_DATA_TYPES)) {
            $expectedType = self::REFERRAL_DATA_TYPES[$key];
            if ($validated['data_type'] !== $expectedType) {
                throw ValidationException::withMessages([
                    'data_type' => ["Invalid data_type for {$key}. Expected {$expectedType}."],
                ]);
            }

            $snapshot = $this->getReferralSettingsSnapshot();
            $snapshot[$key] = (string) $validated['value'];

            $this->validateReferralSnapshot($snapshot);
        }

        SiteSettings::setSetting(
            $key,
            $validated['value'],
            $validated['data_type'],
            $validated['description'] ?? null
        );

        return response()->json([
            'message' => 'Setting updated successfully!',
            'setting' => [
                'key' => $key,
                'value' => $validated['value'],
                'data_type' => $validated['data_type'],
            ],
        ]);
    }

    /**
     * @param  array<string, array{value:mixed,data_type:string}>  $settingsByKey
     */
    private function validateReferralSettingsPayload(array $settingsByKey): void
    {
        $snapshot = $this->getReferralSettingsSnapshot();

        foreach (self::REFERRAL_DATA_TYPES as $key => $expectedType) {
            if (! array_key_exists($key, $settingsByKey)) {
                continue;
            }

            $incoming = $settingsByKey[$key];
            if (($incoming['data_type'] ?? null) !== $expectedType) {
                throw ValidationException::withMessages([
                    "settings.{$key}.data_type" => ["Invalid data_type for {$key}. Expected {$expectedType}."],
                ]);
            }

            $snapshot[$key] = (string) $incoming['value'];
        }

        $this->validateReferralSnapshot($snapshot);
    }

    /**
     * @return array<string, string>
     */
    private function getReferralSettingsSnapshot(): array
    {
        $snapshot = self::REFERRAL_DEFAULTS;

        foreach (array_keys(self::REFERRAL_DEFAULTS) as $key) {
            $current = SiteSettings::getSetting($key, $snapshot[$key]);
            $snapshot[$key] = (string) $current;
        }

        return $snapshot;
    }

    /**
     * @param  array<string, string>  $snapshot
     */
    private function validateReferralSnapshot(array $snapshot): void
    {
        $validator = Validator::make($snapshot, [
            'referral_system_enabled' => ['required', 'in:true,false,1,0'],
            'referral_default_discount_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'referral_max_discount_percentage' => ['required', 'numeric', 'min:1', 'max:100'],
            'referral_min_code_length' => ['required', 'integer', 'min:4', 'max:12'],
            'referral_max_code_length' => ['required', 'integer', 'min:4', 'max:12'],
            'referral_default_code_active' => ['required', 'in:true,false,1,0'],
            'referral_link_path' => ['required', 'string', 'max:50', 'regex:/^\/[A-Za-z0-9_\/-]*$/'],
        ]);

        $validator->after(function ($validator) use ($snapshot) {
            $defaultDiscount = (float) $snapshot['referral_default_discount_percentage'];
            $maxDiscount = (float) $snapshot['referral_max_discount_percentage'];
            $minLength = (int) $snapshot['referral_min_code_length'];
            $maxLength = (int) $snapshot['referral_max_code_length'];

            if ($defaultDiscount > $maxDiscount) {
                $validator->errors()->add(
                    'referral_default_discount_percentage',
                    'Default discount must be less than or equal to maximum discount.'
                );
            }

            if ($minLength > $maxLength) {
                $validator->errors()->add(
                    'referral_min_code_length',
                    'Minimum code length must be less than or equal to maximum code length.'
                );
            }
        });

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}
