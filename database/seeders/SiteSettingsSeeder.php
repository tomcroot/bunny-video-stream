<?php

namespace Database\Seeders;

use App\Models\SiteSettings;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = [
            [
                'key' => 'premiere_date',
                'value' => '2025-12-10T06:00:00Z',
                'data_type' => 'string',
                'description' => 'Premiere date and time for the film',
            ],
            [
                'key' => 'site_title',
                'value' => 'A Crazy Day in Accra',
                'data_type' => 'string',
                'description' => 'Main site title',
            ],
            [
                'key' => 'site_description',
                'value' => 'A gripping thriller set in the vibrant streets of Accra, where one man\'s desperate quest for survival uncovers the dark underbelly of corruption and justice.',
                'data_type' => 'string',
                'description' => 'SEO meta description',
            ],
            [
                'key' => 'contact_email',
                'value' => 'info@acrazydayinaccra.com',
                'data_type' => 'string',
                'description' => 'Contact email for form submissions',
            ],
            [
                'key' => 'enable_contact_form',
                'value' => 'true',
                'data_type' => 'boolean',
                'description' => 'Enable contact form on the site',
            ],
            [
                'key' => 'enable_reviews',
                'value' => 'true',
                'data_type' => 'boolean',
                'description' => 'Enable review submissions',
            ],
            [
                'key' => 'reviews_require_approval',
                'value' => 'true',
                'data_type' => 'boolean',
                'description' => 'Require admin approval for reviews',
            ],
            [
                'key' => 'maintenance_mode',
                'value' => 'false',
                'data_type' => 'boolean',
                'description' => 'Enable maintenance mode',
            ],
            [
                'key' => 'max_file_upload_mb',
                'value' => '50',
                'data_type' => 'integer',
                'description' => 'Maximum file upload size in MB',
            ],
        ];

        foreach ($defaults as $setting) {
            SiteSettings::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
