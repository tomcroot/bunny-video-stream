# Image Upload & Sponsors Implementation - Status Report

## Date: December 13, 2025

## Current Project Review

### ✅ ALREADY IMPLEMENTED

1. **ImageUpload Component** - `/resources/js/components/ImageUpload.vue`
    - Fully functional drag-and-drop uploader
    - Supports file upload + URL input
    - Includes preview, validation, error handling
2. **Upload Controller** - `/app/Http/Controllers/Admin/UploadController.php`

    - Handles image uploads to `storage/app/public/images/{folder}/`
    - Supports: jpeg, png, jpg, gif, webp, svg
    - Max file size: 10MB
    - Folders: gallery, cast, banners, posters, sponsors, avatars

3. **Gallery CRUD** - COMPLETE
    - ✅ Uses ImageUpload component
    - ✅ File upload working
    - ✅ URL input working

### ❌ NEEDS UPDATING

#### 1. Cast/Crew CRUD (Priority: HIGH)

**Files:**

-   `/resources/js/Pages/Admin/CastCrew/Create.vue` - Line 118-130
-   `/resources/js/Pages/Admin/CastCrew/Edit.vue` - Similar section

**Current:** Text input for `image_url`
**Needed:** Replace with ImageUpload component (folder='cast')

#### 2. PageContent CRUD (Priority: HIGH)

**Files:**

-   Check `/resources/js/Pages/Admin/PageContent/Create.vue`
-   Check `/resources/js/Pages/Admin/PageContent/Edit.vue`

**Current:** Unknown - needs investigation
**Needed:** ImageUpload for `poster` and `backdrop` fields (folder='posters')

#### 3. Banner CRUD (Priority: MEDIUM)

**Files:**

-   Check `/resources/js/Pages/Admin/Banner/Create.vue`
-   Check `/resources/js/Pages/Admin/Banner/Edit.vue`

**Current:** Unknown - needs investigation  
**Needed:** ImageUpload for `thumbnail_url` field (folder='banners')

#### 4. Sponsors Feature (Priority: HIGH)

**Status:** NEW FEATURE

**Already Created:**

-   ✅ Migration: `/database/migrations/2025_12_13_140534_create_sponsors_table.php`
-   ✅ Model: `/app/Models/Sponsor.php`
-   ✅ Controller: `/app/Http/Controllers/Admin/SponsorController.php`

**Needs Creation:**

-   ❌ Admin CRUD Views (4 files):
    -   `/resources/js/Pages/Admin/Sponsors/Index.vue`
    -   `/resources/js/Pages/Admin/Sponsors/Create.vue`
    -   `/resources/js/Pages/Admin/Sponsors/Edit.vue`
    -   `/resources/js/Pages/Admin/Sponsors/Show.vue`
-   ❌ Routes in `/routes/web.php`:

    ```php
    Route::resource('sponsors', SponsorController::class);
    ```

-   ❌ Seeder data in `/database/seeders/DatabaseSeeder.php`

-   ❌ Homepage sponsors section in `/resources/js/Pages/Index.vue`:

    -   Location: BEFORE footer (no FAQs section found)
    -   Display: Animated logo carousel
    -   Responsive: 4 logos (mobile), 6 (tablet), 8/12 (desktop)

-   ❌ Update PageController to pass sponsors:
    ```php
    $sponsors = Sponsor::where('is_active', true)
        ->orderBy('display_order')
        ->get();
    ```

## Database Schema

### Sponsors Table (Ready)

```php
id                  - bigint
name                - string
logo_url            - string  (upload with folder='sponsors')
website_url         - string nullable
display_order       - integer default 0
is_active           - boolean default true
timestamps
```

### Existing Tables with Image Fields

```
gallery.image_url       → Uses ImageUpload ✅
cast_crew.image_url     → Needs ImageUpload ❌
page_content.poster     → Needs ImageUpload ❌
page_content.backdrop   → Needs ImageUpload ❌
banners.thumbnail_url   → Needs ImageUpload ❌
```

## Implementation Priority

### Phase 1: Fix Existing CRUDs (30 min)

1. Update Cast/Crew Create & Edit with ImageUpload
2. Update PageContent Create & Edit with ImageUpload
3. Update Banner Create & Edit with ImageUpload

### Phase 2: Sponsors Feature (45 min)

1. Implement SponsorController CRUD methods
2. Create 4 admin views for Sponsors
3. Add routes
4. Create seeder data

### Phase 3: Homepage Integration (20 min)

1. Update PageController to fetch sponsors
2. Add sponsors carousel section to Index.vue
3. Style with Tailwind animations

### Phase 4: Testing (15 min)

1. Run migrations
2. Test image uploads in each CRUD
3. Test sponsors display on homepage
4. Build frontend

## Video/Trailer URLs - NO CHANGES

As requested, these remain as text inputs:

-   ✅ `banners.trailer_url` - Keep as text input
-   ✅ `page_content.movie_url` - Keep as text input
-   ✅ Video IDs in BunnyVideoService - Keep as text/config

## Next Steps

1. Run migrations: `php artisan migrate`
2. Implement Phase 1 updates
3. Create Sponsors CRUD
4. Add homepage section
5. Seed and test
6. `npm run build`

## Storage Configuration

-   Disk: public
-   Path: `/storage/app/public/images/{folder}/`
-   Public symlink: `/public/storage` → `/storage/app/public`
-   Run if needed: `php artisan storage:link`
