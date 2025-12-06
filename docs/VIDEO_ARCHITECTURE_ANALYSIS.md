# Video URL Architecture Review - Complete Analysis

**Date**: December 5, 2025  
**Project**: A Crazy Day in Accra (Hybrid Laravel + Supabase)  
**Status**: Transitioning from Supabase to Laravel-native video management

---

## 📊 Current Architecture Overview

### Two Separate Systems

The project currently has:

1. **Laravel Backend** (`/Users/tomc/Herd/crazyday`) - Authentication, Payments, OTP
2. **React/Supabase Frontend** (`/Users/tomc/Herd/crazyday/promise`) - Video streaming, Admin, Analytics

### Two Entry Points for Videos

#### Entry Point 1: Banner/Trailer (Laravel)

```
Location: /resources/js/Pages/Watch.vue
Source: /app/Http/Controllers/WatchController.php
Flow:
  1. User visits /watch route (authenticated)
  2. WatchController retrieves active banner
  3. Banner contains video_url (currently hardcoded or from seeder)
  4. Vue component loads video via HLS.js if .m3u8 format
  5. Video plays with controls, no download option (controlsList="nodownload")
```

**Current Implementation**:

```php
// WatchController.php - Line 12-29
$banner = Banner::where('is_active', true)
    ->whereNotNull('video_url')
    ->orderBy('display_order')
    ->first();

return Inertia::render('Watch', [
    'videoUrl' => $banner?->video_url,
    'videoTitle' => $banner?->title ?? 'Promise Land',
]);
```

**Video Player** (`Watch.vue`):

-   Uses HLS.js for .m3u8 streams
-   Detects HLS format: `const useHls = computed(() => props.videoUrl?.includes('.m3u8'));`
-   Configured with backbuffer, fragment loading, error recovery
-   **No URL encryption or obfuscation currently**
-   Video URL visible in network inspector

---

#### Entry Point 2: Main Movie (React/Supabase)

```
Location: /promise/src/pages/Watch.tsx
Source: Supabase Auth + Edge Function
Flow:
  1. User authenticates via Supabase
  2. User purchases movie (Paystack payment)
  3. Subscription created in subscriptions table
  4. User visits /watch?movieId={id}
  5. Frontend calls Supabase Edge Function: 'get-bunny-video-url'
  6. Edge function verifies subscription via RLS policies
  7. Function retrieves Bunny video GUID from movies.metadata
  8. Function returns secured streaming URL
  9. Video plays with HLS player (VideoPlayer component)
```

**Key Check**:

```typescript
// Watch.tsx - Line 45-53
const { data: subData, error: subError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("movie_id", movieId)
    .eq("payment_status", "completed")
    .single();

if (subError || !subData) {
    navigate(`/payment?movieId=${movieId}`);
    return;
}
```

**Edge Function Security** (`get-bunny-video-url/index.ts`):

```typescript
// Authenticates user from JWT
// Checks subscription status
// Retrieves Bunny video GUID from movies.metadata
// Calls Bunny API to get signed/temporary streaming URL
// Returns: { playbackUrl, thumbnailUrl, previewUrl }
```

---

## 🎯 Current Video Sources

### Trailer Video (Banner - Laravel)

```
Current URL: https://vz-6024b712-a89.b-cdn.net/643d70e3-19ee-4ae9-a2c9-ec20bf5742d9/playlist.m3u8
Location: Banner model
Visibility: Public (any authenticated user can access via /watch)
Protection: None - URL visible in browser inspector
Update: database/seeders/DatabaseSeeder.php
```

### Main Movie Video (React/Supabase)

```
Current URL: https://vz-6024b712-a89.b-cdn.net/41d7b1aa-fca0-49dd-bb64-ad881d0a4ff6/playlist.m3u8
Location: movies table (Supabase) → stored in metadata.bunny_video_guid
Visibility: Only to subscribers (via subscription check + edge function)
Protection: Subscription verification + possible Bunny token signing
Update: Admin panel (promise/src/pages/admin/HomeContent.tsx)
```

### Thumbnail

```
Current URL: https://vz-6024b712-a89.b-cdn.net/643d70e3-19ee-4ae9-a2c9-ec20bf5742d9/thumbnail_d5a0c8c0.jpg
Location: Banner.image_url
Visibility: Public
Protection: None
```

---

## 🔐 Security Issues & Gaps

### Current Vulnerabilities

1. **Unencrypted URLs in Network Tab**

    - Video URL visible when user opens DevTools → Network tab
    - URL can be copied and shared without payment
    - Works across browsers and platforms

2. **No URL Expiration**

    - Bunny CDN URLs are permanent
    - No time-based access control
    - No per-session token validation

3. **Direct File Access**

    - HLS playlist (.m3u8) directly accessible
    - Segment files (.ts) directly accessible
    - No intermediate proxy or token validation

4. **No Device/Session Binding**

    - URL can be used on multiple devices simultaneously
    - No restriction to authenticated user
    - Can be downloaded and shared

5. **Public Trailer**
    - Any authenticated user sees trailer URL
    - Not restricted to subscribers
    - Visible in page source code

---

## 📋 Architecture Comparison

| Aspect             | Laravel Banner          | Supabase Movie                            |
| ------------------ | ----------------------- | ----------------------------------------- |
| **Auth Check**     | Via Laravel middleware  | Via Supabase RLS + Edge Function          |
| **URL Source**     | Database (Banner model) | Database (movies table) via Edge Function |
| **URL Format**     | Direct HLS playlist     | Bunny API signed URL (presumed)           |
| **Encryption**     | None                    | None visible                              |
| **Expiration**     | Permanent               | Unknown (in edge function)                |
| **Visibility**     | Network inspector       | Network inspector                         |
| **Access Control** | Auth required           | Subscription required                     |
| **Update Method**  | Seeder / Database       | Admin panel                               |

---

## 🛠️ Recommendations for URL Security

### 1. **Server-Side URL Proxying** (Best Practice)

```
Frontend → Backend Endpoint → Verify Auth → Proxy Bunny URL → Stream to Client
Benefits:
  - URL never exposed to client
  - Can rotate/refresh tokens per request
  - Session binding possible
  - Device fingerprinting feasible
```

### 2. **URL Signing with Expiration** (Medium Security)

```
Generate signed URL with:
  - User ID
  - Timestamp
  - Expiration (e.g., 24 hours)
  - HMAC signature
  - One-time token per session
```

### 3. **Bunny CDN Token Authentication** (If Available)

```
Use Bunny's built-in security:
  - Token-based URL signing
  - IP whitelisting
  - Geo-blocking
  - Bandwidth limiting
```

### 4. **Content Security Policy (CSP)**

```
Prevent URL extraction:
  - Disable developer tools on video page
  - Block right-click context menu
  - Prevent source inspection
  - Disable screenshot capabilities
```

---

## 🎬 Video Flow Diagram

```
TRAILER (Public Banner)
═══════════════════════════════════════════════════════════════════
Public User
    ↓
/watch (GET)
    ↓
Laravel: WatchController@index
    ├─ Check: Authenticated? ✓
    ├─ Get: Active Banner with video_url ✓
    ├─ Render: Watch.vue component
    └─ Pass: video_url directly to Vue
           ↓
       Watch.vue
       ├─ Receive: videoUrl prop
       ├─ Detect: .m3u8 format?
       ├─ Init: HLS.js
       └─ Play: Video (URL visible in Network tab) ❌


MAIN MOVIE (Protected Subscription)
═══════════════════════════════════════════════════════════════════
Authenticated User with Subscription
    ↓
/watch?movieId={id} (GET)
    ↓
React: Watch.tsx
    ├─ Check: Authenticated? ✓
    ├─ Fetch: movies table
    ├─ Check: Active subscription for movieId? ✓
    └─ Call: Supabase Edge Function 'get-bunny-video-url'
              ├─ Verify: User auth token
              ├─ Verify: Active subscription (RLS)
              ├─ Fetch: movies.metadata.bunny_video_guid
              ├─ Call: Bunny API → get signed playback URL
              └─ Return: { playbackUrl, thumbnailUrl, previewUrl }
           ↓
       VideoPlayer.tsx
       ├─ Receive: videoUrl (signed URL from edge function)
       ├─ Init: HLS.js
       └─ Play: Video (URL potentially signed/temporary) ⚠️
```

---

## 📁 Files Involved

### Laravel Backend

-   `/app/Http/Controllers/WatchController.php` - Main video fetch logic
-   `/app/Models/Banner.php` - Video URL storage
-   `/database/seeders/DatabaseSeeder.php` - Video URL seeding
-   `/resources/js/Pages/Watch.vue` - Video player component
-   `/routes/web.php` - Watch route definition

### React/Supabase Frontend

-   `/promise/src/pages/Watch.tsx` - Main watch page
-   `/promise/src/pages/Index.tsx` - Trailer display (hero section)
-   `/promise/src/components/VideoPlayer.tsx` - HLS player
-   `/promise/supabase/functions/get-bunny-video-url/index.ts` - URL security edge function
-   `/promise/src/pages/admin/HomeContent.tsx` - Admin video management

### Database

-   `banners` table (Laravel)

    -   `video_url` - Direct video URL
    -   `trailer_url` (proposed)
    -   `main_movie_url` (proposed)
    -   `thumbnail_url` (proposed)

-   `movies` table (Supabase)
    -   `video_url` - Direct video URL
    -   `metadata.bunny_video_guid` - Bunny video identifier
    -   `poster_url` - Thumbnail

---

## 🔄 Data Flow Summary

```
CURRENT STATE
─────────────
Trailer:      Banner.video_url → Watch.vue → Direct HLS URL ❌ No security
Main Movie:   movies.video_url → Edge Fn → Signed URL ✓ Possible security

PROPOSED STATE (After Migration to Laravel)
───────────────────────────────────────────
Trailer:      Banner.trailer_url → WatchController → Signed proxy URL ✓
Main Movie:   Banner.main_movie_url → WatchController → Signed proxy URL ✓
Thumbnail:    Banner.thumbnail_url → Static or proxy ✓
```

---

## ✅ Next Steps for Implementation

1. **Create Laravel Video Service**

    - Handle Bunny CDN API calls
    - Generate signed URLs with expiration
    - Implement token rotation

2. **Create Video Proxy Endpoint**

    - `/api/video/{movieId}` returns signed Bunny URL
    - Verify user subscription
    - Track video access logs

3. **Update WatchController**

    - Pass signed URLs instead of direct URLs
    - Implement refresh logic for expired tokens
    - Add rate limiting to proxy endpoint

4. **Update Watch.vue**

    - Fetch video URL from proxy endpoint
    - Implement token refresh mechanism
    - Handle URL expiration gracefully

5. **Security Enhancements**
    - IP validation
    - Device fingerprinting
    - Session binding
    - Download prevention

---

**Document Generated**: Comprehensive Architecture Review  
**Status**: Ready for implementation planning
