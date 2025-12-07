<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
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

        return Inertia::render('Admin/Settings', [
            'settings' => $formattedSettings,
            'settingsList' => $settings,
            'availableSettings' => [
                [
                    'key' => 'premiere_date',
                    'label' => 'Premiere Date & Time',
                    'description' => 'When the film premieres (ISO 8601 format)',
                    'data_type' => 'string',
                    'example' => '2025-12-10T06:00:00Z',
                ],
                [
                    'key' => 'site_title',
                    'label' => 'Site Title',
                    'description' => 'Main site title displayed in header',
                    'data_type' => 'string',
                    'example' => 'A Crazy Day in Accra',
                ],
                [
                    'key' => 'site_description',
                    'label' => 'Site Description',
                    'description' => 'SEO meta description',
                    'data_type' => 'string',
                    'example' => 'A gripping thriller set in Accra...',
                ],
                [
                    'key' => 'contact_email',
                    'label' => 'Contact Email',
                    'description' => 'Email for contact form submissions',
                    'data_type' => 'string',
                    'example' => 'contact@acrazydayinaccra.com',
                ],
                [
                    'key' => 'enable_contact_form',
                    'label' => 'Enable Contact Form',
                    'description' => 'Allow visitors to submit contact requests',
                    'data_type' => 'boolean',
                    'example' => 'true',
                ],
                [
                    'key' => 'enable_reviews',
                    'label' => 'Enable Reviews',
                    'description' => 'Allow visitors to submit reviews',
                    'data_type' => 'boolean',
                    'example' => 'true',
                ],
                [
                    'key' => 'reviews_require_approval',
                    'label' => 'Reviews Require Approval',
                    'description' => 'Moderate reviews before publishing',
                    'data_type' => 'boolean',
                    'example' => 'true',
                ],
                [
                    'key' => 'maintenance_mode',
                    'label' => 'Maintenance Mode',
                    'description' => 'Enable maintenance mode (show maintenance page)',
                    'data_type' => 'boolean',
                    'example' => 'false',
                ],
                [
                    'key' => 'max_file_upload_mb',
                    'label' => 'Max File Upload Size (MB)',
                    'description' => 'Maximum file size for uploads',
                    'data_type' => 'integer',
                    'example' => '50',
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
}
