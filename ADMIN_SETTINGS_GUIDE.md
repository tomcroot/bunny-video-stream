# Admin Panel Improvements - Complete Setup Guide

## Overview

A comprehensive admin settings system has been implemented to allow administrators to manage key site features and the premiere countdown timer without touching code.

## What Was Added

### 1. **SiteSettings Model** (`app/Models/SiteSettings.php`)

-   Flexible key-value store for site configuration
-   Supports multiple data types: string, boolean, integer, float, JSON
-   Helper methods:
    -   `SiteSettings::getSetting($key, $default)` - Get a setting
    -   `SiteSettings::setSetting($key, $value, $dataType, $description)` - Set a setting

### 2. **Database Migration** (`database/migrations/2025_12_07_000001_create_site_settings_table.php`)

-   Creates `site_settings` table with indexed `key` column for fast lookups
-   Stores value, data_type, and description for each setting

### 3. **SettingsController** (`app/Http/Controllers/Admin/SettingsController.php`)

-   `index()` - Display all settings with available options
-   `update()` - Batch update multiple settings
-   `updateSingle()` - Update individual setting via API

### 4. **Settings Vue Component** (`resources/js/Pages/Admin/Settings.vue`)

Clean, intuitive interface with sections for:

-   **Premiere Settings**: Manage premiere date/time
-   **Feature Controls**: Toggle-based controls for:
    -   Contact Form (enable/disable)
    -   Reviews (enable/disable)
    -   Review Approval (require moderation)
    -   Maintenance Mode (show maintenance page)
-   **Additional Settings**:
    -   Contact Email
    -   Max File Upload Size

### 5. **SiteSettingsSeeder** (`database/seeders/SiteSettingsSeeder.php`)

Pre-populates default settings:

-   `premiere_date` - Default: 2025-12-10T06:00:00Z
-   `site_title` - Default: A Crazy Day in Accra
-   `site_description` - SEO meta description
-   `contact_email` - Default: info@acrazydayinaccra.com
-   `enable_contact_form` - Default: true
-   `enable_reviews` - Default: true
-   `reviews_require_approval` - Default: true
-   `maintenance_mode` - Default: false
-   `max_file_upload_mb` - Default: 50

### 6. **Updated Components**

-   **PageController**: Now passes `premiereDate` from settings to Index.vue
-   **Index.vue**: Now accepts `premiereDate` prop and uses it for countdown
-   **web.php**: Added settings routes under admin middleware

## How to Use

### For Administrators:

1. **Access Settings**: Navigate to `/admin/settings`

2. **Update Premiere Date**:

    - Change the date/time in "Premiere Date & Time" field
    - Click "Save Settings"
    - The countdown on homepage updates automatically

3. **Toggle Features**:

    - Click toggle buttons to enable/disable features
    - Changes take effect immediately after saving

4. **Update Contact Email**:
    - Change the email address for contact submissions
    - Affects where contact form submissions are sent

### For Developers:

1. **Access Settings in Code**:

    ```php
    use App\Models\SiteSettings;

    // Get a setting
    $premiereDate = SiteSettings::getSetting('premiere_date', '2025-12-10T06:00:00Z');
    $maintenanceMode = SiteSettings::getSetting('maintenance_mode', false);

    // Set a setting
    SiteSettings::setSetting('premiere_date', '2025-12-25T00:00:00Z', 'string');
    SiteSettings::setSetting('maintenance_mode', true, 'boolean');
    ```

2. **Add New Settings**:
    - Add to `SiteSettingsSeeder` defaults
    - Add form fields to Settings.vue
    - Access via `SiteSettings::getSetting()`

## Setup Instructions

1. **Run Migration**:

    ```bash
    php artisan migrate
    ```

2. **Seed Default Settings**:

    ```bash
    php artisan db:seed --class=SiteSettingsSeeder
    ```

    Or include in `DatabaseSeeder`:

    ```php
    $this->call(SiteSettingsSeeder::class);
    ```

3. **Test Access**:
    - Log in as admin
    - Navigate to `/admin/settings`
    - Update a setting and verify it saves

## Admin Navigation

The settings page should be added to admin navigation:

-   Recommended placement: Dashboard → Settings (last item in sidebar)
-   Permission: Admin only (protected by admin middleware)

## Video URLs Configuration

As requested, video URLs are **NOT** managed through settings:

-   **Trailer URL**: Set in Index.vue default prop
-   **Movie Videos**: Managed via Banner model entries
-   Can be updated via Banner admin CRUD interface

## Current Manageable Features

✅ Premiere countdown timer date/time  
✅ Contact form on/off  
✅ Reviews submission on/off  
✅ Review approval requirement on/off  
✅ Maintenance mode toggle  
✅ Contact email address  
✅ Max file upload size

## Future Enhancements

Consider adding:

-   Email notification settings
-   Featured banner rotation duration
-   Cache clear button
-   Database backup trigger
-   Email template editor
-   SMS notification settings (if using SMS)

## Database Queries

All settings are cached-able. For high-traffic sites, consider:

```php
// In a service provider or helper
Cache::rememberForever('site_settings', function() {
    return SiteSettings::all()->keyBy('key');
});
```

---

**Last Updated**: December 7, 2025
**Status**: Production Ready
