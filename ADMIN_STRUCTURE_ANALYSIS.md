# Admin Panel Structure Analysis

## Overview

The admin panel is built with Laravel controllers and Inertia Vue components. All admin routes are protected with the `admin` middleware and use the `admin.` route name prefix.

---

## 1. ROUTE STRUCTURE

**Base Route:** `/admin` (prefix: `admin.`, middleware: `admin`)

### Main Admin Routes

```
GET    /admin                      → DashboardController@index          (admin.dashboard)
GET    /admin/analytics            → AnalyticsController@index          (admin.analytics)
```

### Resource Routes (RESTful)

```
// Banners Management
GET    /admin/banners              → BannerController@index             (admin.banners.index)
GET    /admin/banners/create       → BannerController@create            (admin.banners.create)
POST   /admin/banners              → BannerController@store             (admin.banners.store)
GET    /admin/banners/{banner}     → BannerController@show              (admin.banners.show)
GET    /admin/banners/{banner}/edit → BannerController@edit             (admin.banners.edit)
PUT    /admin/banners/{banner}     → BannerController@update            (admin.banners.update)
DELETE /admin/banners/{banner}     → BannerController@destroy           (admin.banners.destroy)

// Gallery Management
GET    /admin/gallery              → GalleryController@index            (admin.gallery.index)
GET    /admin/gallery/create       → GalleryController@create           (admin.gallery.create)
POST   /admin/gallery              → GalleryController@store            (admin.gallery.store)
GET    /admin/gallery/{gallery}    → GalleryController@show             (admin.gallery.show)
GET    /admin/gallery/{gallery}/edit → GalleryController@edit           (admin.gallery.edit)
PUT    /admin/gallery/{gallery}    → GalleryController@update           (admin.gallery.update)
DELETE /admin/gallery/{gallery}    → GalleryController@destroy          (admin.gallery.destroy)

// Cast & Crew Management
GET    /admin/cast-crew            → CastCrewController@index           (admin.cast-crew.index)
GET    /admin/cast-crew/create     → CastCrewController@create          (admin.cast-crew.create)
POST   /admin/cast-crew            → CastCrewController@store           (admin.cast-crew.store)
GET    /admin/cast-crew/{castCrew} → CastCrewController@show            (admin.cast-crew.show)
GET    /admin/cast-crew/{castCrew}/edit → CastCrewController@edit       (admin.cast-crew.edit)
PUT    /admin/cast-crew/{castCrew} → CastCrewController@update          (admin.cast-crew.update)
DELETE /admin/cast-crew/{castCrew} → CastCrewController@destroy         (admin.cast-crew.destroy)

// Page Content Management
GET    /admin/page-content         → PageContentController@index        (admin.page-content.index)
GET    /admin/page-content/create  → PageContentController@create       (admin.page-content.create)
POST   /admin/page-content         → PageContentController@store        (admin.page-content.store)
GET    /admin/page-content/{pageContent} → PageContentController@show   (admin.page-content.show)
GET    /admin/page-content/{pageContent}/edit → PageContentController@edit (admin.page-content.edit)
PUT    /admin/page-content/{pageContent} → PageContentController@update (admin.page-content.update)
DELETE /admin/page-content/{pageContent} → PageContentController@destroy (admin.page-content.destroy)

// Reviews Management
GET    /admin/reviews              → ReviewController@index             (admin.reviews.index)
GET    /admin/reviews/create       → ReviewController@create            (admin.reviews.create)
POST   /admin/reviews              → ReviewController@store             (admin.reviews.store)
GET    /admin/reviews/{review}     → ReviewController@show              (admin.reviews.show)
GET    /admin/reviews/{review}/edit → ReviewController@edit             (admin.reviews.edit)
PUT    /admin/reviews/{review}     → ReviewController@update            (admin.reviews.update)
DELETE /admin/reviews/{review}     → ReviewController@destroy           (admin.reviews.destroy)
PATCH  /admin/reviews/{review}/approve → ReviewController@approve      (admin.reviews.approve)

// Referral Code Management
GET    /admin/referral-codes              → ReferralCodeController@index     (admin.referral-codes.index)
POST   /admin/referral-codes              → ReferralCodeController@store     (admin.referral-codes.store)
GET    /admin/referral-codes/{code}/stats → ReferralCodeController@stats    (admin.referral-codes.stats)
PATCH  /admin/referral-codes/{code}/activate → ReferralCodeController@activate (admin.referral-codes.activate)
PATCH  /admin/referral-codes/{code}/deactivate → ReferralCodeController@deactivate (admin.referral-codes.deactivate)
```

---

## 2. CONTROLLERS & ACTIONS

### DashboardController

**Location:** `app/Http/Controllers/Admin/DashboardController.php`
**Manages:** Dashboard overview and analytics metrics

| Action    | Method | Returns                   | Purpose                                                        |
| --------- | ------ | ------------------------- | -------------------------------------------------------------- |
| `index()` | GET    | Inertia `Admin/Dashboard` | Displays dashboard with key metrics (users, revenue, payments) |

**Data Passed:**

-   `metrics[]`: totalUsers, totalRevenue, completedPayments, pendingPayments, failedPayments
-   `recentPayments[]`: Last 10 payments with user info

---

### BannerController

**Location:** `app/Http/Controllers/Admin/BannerController.php`
**Manages:** `Banner` model - Hero banners and promotional content

| Action      | Method | Returns                        | Purpose               |
| ----------- | ------ | ------------------------------ | --------------------- |
| `index()`   | GET    | Inertia `Admin/Banners/Index`  | List all banners      |
| `create()`  | GET    | Inertia `Admin/Banners/Create` | Show create form      |
| `store()`   | POST   | Redirect                       | Save new banner       |
| `show()`    | GET    | Inertia `Admin/Banners/Show`   | Display single banner |
| `edit()`    | GET    | Inertia `Admin/Banners/Edit`   | Show edit form        |
| `update()`  | PUT    | Redirect                       | Save changes          |
| `destroy()` | DELETE | Redirect                       | Delete banner         |

**Validation Rules:**

```
title          - required|string|max:255
message        - nullable|string
cta_text       - nullable|string|max:255
cta_url        - nullable|url
image_url      - nullable|url
video_url      - nullable|url
trailer_url    - nullable|url
main_movie_url - nullable|url
thumbnail_url  - nullable|url
target_date    - required|date
display_order  - integer
is_active      - boolean
```

**Model Fields:**

-   `id`, `title`, `message`, `cta_text`, `cta_url`, `image_url`, `video_url`, `trailer_url`, `main_movie_url`, `thumbnail_url`, `target_date`, `display_order`, `is_active`, `timestamps`

---

### GalleryController

**Location:** `app/Http/Controllers/Admin/GalleryController.php`
**Manages:** `Gallery` model - Gallery images

| Action      | Method | Returns                        | Purpose                 |
| ----------- | ------ | ------------------------------ | ----------------------- |
| `index()`   | GET    | Inertia `Admin/Gallery/Index`  | List all gallery images |
| `create()`  | GET    | Inertia `Admin/Gallery/Create` | Show create form        |
| `store()`   | POST   | Redirect                       | Save new gallery image  |
| `show()`    | GET    | Inertia `Admin/Gallery/Show`   | Display single image    |
| `edit()`    | GET    | Inertia `Admin/Gallery/Edit`   | Show edit form          |
| `update()`  | PUT    | Redirect                       | Save changes            |
| `destroy()` | DELETE | Redirect                       | Delete image            |

**Validation Rules:**

```
title        - required|string|max:255
description  - nullable|string
image_url    - required|url
category     - required|string
display_order - integer
is_active    - boolean
```

**Model Fields:**

-   `id`, `title`, `description`, `image_url`, `category`, `display_order`, `is_active`, `timestamps`

---

### CastCrewController

**Location:** `app/Http/Controllers/Admin/CastCrewController.php`
**Manages:** `CastCrew` model - Cast members and crew information

| Action      | Method | Returns                         | Purpose                    |
| ----------- | ------ | ------------------------------- | -------------------------- |
| `index()`   | GET    | Inertia `Admin/CastCrew/Index`  | List all cast/crew members |
| `create()`  | GET    | Inertia `Admin/CastCrew/Create` | Show create form           |
| `store()`   | POST   | Redirect                        | Save new member            |
| `show()`    | GET    | Inertia `Admin/CastCrew/Show`   | Display single member      |
| `edit()`    | GET    | Inertia `Admin/CastCrew/Edit`   | Show edit form             |
| `update()`  | PUT    | Redirect                        | Save changes               |
| `destroy()` | DELETE | Redirect                        | Delete member              |

**Validation Rules:**

```
stage_name    - required|string|max:255
real_name     - required|string|max:255
role_type     - required|in:cast,crew
job_title     - nullable|string|max:255
image_url     - nullable|url
bio           - nullable|string
referral_code - nullable|string|max:255
display_order - integer
is_active     - boolean
```

**Model Fields:**

-   `id`, `stage_name`, `real_name`, `role_type` (cast/crew), `job_title`, `image_url`, `bio`, `referral_code`, `display_order`, `is_active`, `timestamps`

---

### PageContentController

**Location:** `app/Http/Controllers/Admin/PageContentController.php`
**Manages:** `PageContent` model - Page sections and content blocks

| Action      | Method | Returns                            | Purpose                                  |
| ----------- | ------ | ---------------------------------- | ---------------------------------------- |
| `index()`   | GET    | Inertia `Admin/PageContent/Index`  | List all content grouped by page/section |
| `create()`  | GET    | Inertia `Admin/PageContent/Create` | Show create form                         |
| `store()`   | POST   | Redirect                           | Save new content                         |
| `show()`    | GET    | Inertia `Admin/PageContent/Show`   | Display single content                   |
| `edit()`    | GET    | Inertia `Admin/PageContent/Edit`   | Show edit form                           |
| `update()`  | PUT    | Redirect                           | Save changes                             |
| `destroy()` | DELETE | Redirect                           | Delete content                           |

**Validation Rules:**

```
page      - required|string|max:255
section   - required|string|max:255
key       - required|string|max:255
value     - nullable|string
metadata  - nullable|array
is_active - boolean
```

**Model Fields:**

-   `id`, `page`, `section`, `key`, `value`, `metadata` (JSON), `is_active`, `timestamps`

**Organization:**

-   Content is grouped by `page` → `section` → `key`
-   Useful for managing content across different pages (home, about, contact, etc.)

---

### ReviewController

**Location:** `app/Http/Controllers/Admin/ReviewController.php`
**Manages:** `Review` model - User reviews and testimonials

| Action      | Method | Returns                        | Purpose                                   |
| ----------- | ------ | ------------------------------ | ----------------------------------------- |
| `index()`   | GET    | Inertia `Admin/Reviews/Index`  | List all reviews (sorted by newest first) |
| `create()`  | GET    | Inertia `Admin/Reviews/Create` | Show create form                          |
| `store()`   | POST   | Redirect                       | Save new review                           |
| `show()`    | GET    | Inertia `Admin/Reviews/Show`   | Display single review                     |
| `edit()`    | GET    | Inertia `Admin/Reviews/Edit`   | Show edit form                            |
| `update()`  | PUT    | Redirect                       | Save changes                              |
| `destroy()` | DELETE | Redirect                       | Delete review                             |
| `approve()` | PATCH  | Redirect                       | Approve a review for display              |

**Validation Rules:**

```
name       - required|string|max:255
email      - nullable|email|max:255
content    - required|string
rating     - required|integer|min:1|max:5
is_approved - boolean
```

**Model Fields:**

-   `id`, `name`, `email`, `content`, `rating` (1-5), `is_approved`, `timestamps`

---

### AnalyticsController

**Location:** `app/Http/Controllers/Admin/AnalyticsController.php`
**Manages:** Analytics and watch statistics

| Action    | Method | Returns                   | Purpose                           |
| --------- | ------ | ------------------------- | --------------------------------- |
| `index()` | GET    | Inertia `Admin/Analytics` | Display video analytics dashboard |

**Features:**

-   Combines **local statistics** (from `WatchProgress` table) and **Bunny CDN statistics**
-   Per-video metrics: sessions, watch time, completion rate
-   Summary stats: unique viewers, total watch time, completion rates

**Data Passed:**

-   `videos[]`: Array of videos with local and Bunny stats
-   `summary[]`: Overall analytics metrics

---

### ReferralCodeController

**Location:** `app/Http/Controllers/ReferralCodeController.php`
**Manages:** `ReferralCode` model - Discount codes and referral programs

| Action                | Method | Returns                         | Purpose                               |
| --------------------- | ------ | ------------------------------- | ------------------------------------- |
| `index()`             | GET    | Inertia `Referrals/Index`       | List public active codes (optional)   |
| `validateCode()`      | POST   | Redirect                        | Validate a code (form submission)     |
| `calculateDiscount()` | POST   | Redirect                        | Validate code + calculate discount    |
| `stats()`             | GET    | Inertia `Admin/Referrals/Stats` | Display code usage statistics         |
| `store()`             | POST   | Redirect                        | Create new referral code (admin only) |
| `activate()`          | PATCH  | Redirect                        | Activate a code                       |
| `deactivate()`        | PATCH  | Redirect                        | Deactivate a code                     |

**Validation Rules:**

```
code                  - required|string|unique:referral_codes,code|max:50
discount_percentage   - required|numeric|min:0|max:100
description          - nullable|string|max:255
```

**Model Fields:**

-   `id` (UUID), `code`, `description`, `discount_percentage` (decimal:2), `is_active`, `created_by` (FK→User), `timestamps`

**Relations:**

-   `creator()` → User who created the code
-   `usages()` → ReferralUsage records (how many times used and discount applied)

---

## 3. VUE COMPONENTS & PAGES

### Admin Pages Directory Structure

```
resources/js/Pages/Admin/
├── Dashboard.vue
├── Analytics.vue
├── Banners/
│   ├── Index.vue
│   ├── Create.vue
│   ├── Edit.vue
│   └── Show.vue
├── Gallery/
│   ├── Index.vue
│   ├── Create.vue
│   ├── Edit.vue
│   └── Show.vue
├── CastCrew/
│   ├── Index.vue
│   ├── Create.vue
│   ├── Edit.vue
│   └── Show.vue
├── PageContent/
│   ├── Index.vue
│   ├── Create.vue
│   ├── Edit.vue
│   └── Show.vue
├── Reviews/
│   ├── Index.vue
│   ├── Create.vue
│   ├── Edit.vue
│   └── Show.vue
└── Referrals/
    └── Stats.vue
```

### Dashboard.vue

**Purpose:** Admin dashboard overview
**Features:**

-   4-column metric cards (Users, Revenue, Completed/Pending Payments)
-   Recent transactions table (last 5 payments)
-   Payment status breakdown
-   Quick access cards to all admin sections

**Props:** `metrics`, `recentPayments`

### Banners/Index.vue

**Purpose:** List all banners
**Features:**

-   Image preview thumbnail
-   Status badge (Active/Inactive)
-   Display order indicator
-   View/Edit/Delete actions

**Props:** `banners`

### Gallery/Index.vue

**Purpose:** List all gallery images
**Features:**

-   Grid layout with image preview
-   Category and description
-   Status badge
-   View/Edit/Delete actions

**Props:** `gallery`

### CastCrew/Index.vue

**Purpose:** List cast and crew members
**Features:**

-   Grid layout with member photos
-   Filter tabs: All / Cast / Crew
-   Role type badge
-   Active status indicator
-   View/Edit/Delete actions

**Props:** `castCrew`

### PageContent/Index.vue

**Purpose:** List page content blocks
**Features:**

-   Organized by page and section
-   Status indicator
-   View/Edit/Delete actions

**Props:** `pageContent`

### Reviews/Index.vue

**Purpose:** List and moderate reviews
**Features:**

-   Review preview with rating stars
-   Approval status badge (Approved/Pending)
-   Approve button (for pending reviews)
-   View/Edit/Delete actions

**Props:** `reviews`

### Analytics.vue

**Purpose:** Display video performance analytics
**Features:**

-   Combines local and Bunny CDN statistics
-   Per-video metrics
-   Summary statistics dashboard

**Props:** `videos`, `summary`

---

## 4. MODELS OVERVIEW

### Banner

-   **Table:** `banners`
-   **Purpose:** Promotional content and hero banners
-   **Key Fields:** title, message, cta_text, cta_url, image_url, video_url, trailer_url, main_movie_url, thumbnail_url, target_date, display_order, is_active

### Gallery

-   **Table:** `gallery`
-   **Purpose:** Gallery images and media
-   **Key Fields:** title, description, image_url, category, display_order, is_active

### CastCrew

-   **Table:** `cast_crew`
-   **Purpose:** Cast members and crew information
-   **Key Fields:** stage_name, real_name, role_type (cast|crew), job_title, image_url, bio, referral_code, display_order, is_active

### PageContent

-   **Table:** `page_content`
-   **Purpose:** Dynamic page content management
-   **Key Fields:** page, section, key, value, metadata (JSON), is_active
-   **Organization:** Hierarchical (page → section → key)

### Review

-   **Table:** `reviews`
-   **Purpose:** User reviews and testimonials
-   **Key Fields:** name, email, content, rating (1-5), is_approved

### ReferralCode

-   **Table:** `referral_codes`
-   **Purpose:** Referral discount codes
-   **Key Fields:** code, description, discount_percentage, is_active, created_by (FK)
-   **Relations:** creator (User), usages (ReferralUsage[])

---

## 5. ADMIN NAVIGATION STRUCTURE

The admin navbar is hardcoded in `Admin/Dashboard.vue` and visible on all admin pages:

```
Dashboard
Banners
Cast & Crew
Gallery
Reviews
Analytics (link: /admin/analytics)
Page Content
Logout
```

---

## 6. COMMON PATTERNS

### All Resource Controllers Share:

1. **Consistent CRUD pattern** (index, create, store, show, edit, update, destroy)
2. **Inertia rendering** with model data
3. **Validation** on store/update methods
4. **Redirect with success messages** after create/update/delete
5. **Ordering by display_order** in index queries

### All Vue Components Share:

1. **Layout with card borders** and consistent styling
2. **Add button** in header to create new items
3. **Action buttons** (View, Edit, Delete)
4. **Status badges** (Active/Inactive)
5. **Empty state messages**
6. **Confirmation dialogs** for delete operations

---

## 7. PROTECTION & MIDDLEWARE

All admin routes are protected by the `admin` middleware which ensures:

-   User must be authenticated
-   User must have admin privileges

---

## SUMMARY TABLE

| Component        | Model                 | Routes | CRUD         | Features                  |
| ---------------- | --------------------- | ------ | ------------ | ------------------------- |
| **Dashboard**    | Payment, User         | 1      | R            | Metrics, transactions     |
| **Banners**      | Banner                | 7      | CRUD         | Images, CTAs, ordering    |
| **Gallery**      | Gallery               | 7      | CRUD         | Images, categories        |
| **Cast & Crew**  | CastCrew              | 7      | CRUD         | Filters, roles, images    |
| **Page Content** | PageContent           | 7      | CRUD         | Hierarchical organization |
| **Reviews**      | Review                | 7      | CRUD+Approve | Rating, approval status   |
| **Referrals**    | ReferralCode          | 5      | CR+Stats     | Code management, usage    |
| **Analytics**    | WatchProgress, Banner | 1      | R            | Video stats, completion   |

---

## RECOMMENDATIONS FOR SIMPLIFICATION & MANAGEMENT

Based on this structure, here are potential improvements:

1. **Admin Navbar Component:** Extract hardcoded nav to a reusable component
2. **Base Admin Layout:** Create a shared layout for all admin pages with consistent header/nav
3. **Bulk Operations:** Add checkboxes for bulk delete/activate/deactivate
4. **Advanced Filtering:** Add search, sort, and filter capabilities to list pages
5. **Pagination:** Add pagination to list pages with many items
6. **Audit Trail:** Track who created/modified each record
7. **Admin Roles:** Implement role-based access (e.g., some admins can only edit content)
8. **Form Reusability:** Create a base form component for create/edit pages
9. **Image Upload:** Replace URL inputs with direct image upload for gallery and banners
10. **Search/Global Search:** Add admin-wide search functionality
