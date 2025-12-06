# 🔄 Supabase to Laravel Migration Plan - APPROVAL REQUIRED

**Date**: December 5, 2025  
**Project**: A Crazy Day in Accra  
**Status**: ⚠️ **AWAITING YOUR APPROVAL BEFORE PROCEEDING**

---

## 📊 Executive Summary

Currently, the project runs with **TWO separate systems**:

-   **Laravel Backend** (`/crazyday`) - Handles auth, payments via Laravel
-   **React/Supabase Frontend** (`/promise`) - Handles video streaming, subscriptions, admin panel

**GOAL**: Consolidate to **single Laravel-based architecture** while maintaining existing functionality.

---

## 🗂️ WHAT'S CURRENTLY IN SUPABASE (Needs Migration)

### 1. **Authentication System**

**Current**: Supabase Auth (separate from Laravel Fortify)

```
Location: /promise (React app)
Users store:
  - Email
  - Full Name (from auth.users.user_metadata)
  - Profiles table linking to auth.users.id

Migration Path:
  □ Keep Laravel Fortify (already configured)
  □ Migrate Supabase users to Laravel users table
  □ Maintain user IDs (UUID format)
  □ Transfer full_name and phone data
```

---

### 2. **Movie Management**

**Current**: Stored in Supabase `movies` table

```sql
movies table contains:
├── id (uuid)
├── title
├── description
├── domain ("acrazydayinaccra.com")
├── video_url (direct Bunny HLS URL)
├── poster_url (direct image URL)
├── price (numeric)
├── metadata (JSON)
│   ├── hero_tagline
│   ├── synopsis_title, synopsis_paragraph_1,2,3
│   ├── about_title, about_paragraph_1,2
│   ├── bunny_video_guid (Bunny video ID)
│   └── other content fields
├── is_active (boolean)
├── created_at, updated_at (timestamp)
```

**Migration Path**:

```
Current Laravel status:
  ✓ Banner model exists (stores single video per domain)
  ✓ PageContent model exists

Need to:
  □ Create Movie model and table
  □ Migrate movie data from Supabase
  □ Transfer all metadata JSON to Laravel tables
  □ Update admin pages to use Laravel Movie model instead of Supabase
```

---

### 3. **Subscriptions & Payments**

**Current**: Supabase `subscriptions` table

```sql
subscriptions table contains:
├── id (uuid)
├── user_id (FK → auth.users)
├── movie_id (FK → movies)
├── amount (numeric)
├── discount_applied (numeric)
├── referral_code (text)
├── payment_status ('pending' | 'completed')
├── paystack_reference (text)
├── paid_at, expires_at (timestamp)
├── created_at (timestamp)
```

**Migration Path**:

```
Current Laravel status:
  ✓ Payment tracking exists in Paystack integration
  ✓ .env has PAYSTACK_PUBLIC_KEY and PAYSTACK_SECRET_KEY

Need to:
  □ Create Subscription model and table
  □ Migrate all subscription records from Supabase
  □ Create PaymentController for Paystack webhook handling
  □ Ensure payment_status tracking matches existing Paystack integration
  □ Link subscriptions to new Movie model
```

---

### 4. **Streaming Logs (Analytics)**

**Current**: Supabase `streaming_logs` table

```sql
streaming_logs table contains:
├── id (uuid)
├── user_id (FK → auth.users)
├── movie_id (FK → movies)
├── subscription_id (FK → subscriptions)
├── watch_duration (integer, seconds)
├── completed (boolean)
├── created_at, updated_at (timestamp)
```

**Migration Path**:

```
Need to:
  □ Create StreamingLog model and table
  □ Migrate all existing logs from Supabase
  □ Add log creation in Watch.vue → WatchController
  □ Track watch duration on video completion
  □ Create analytics endpoints for admin dashboard
```

---

### 5. **Referral System**

**Current**: Supabase `referral_codes` and `referral_usage` tables

```sql
referral_codes table contains:
├── id (uuid)
├── referral_code (text, unique)
├── is_active (boolean)
├── created_at (timestamp)

referral_usage table contains:
├── id (uuid)
├── referral_code_id (FK → referral_codes)
├── user_id (FK → profiles)
├── subscription_id (FK → subscriptions)
├── used_at (timestamp)
```

**Migration Path**:

```
Need to:
  □ Create ReferralCode model and table
  □ Create ReferralUsage model and table
  □ Migrate all existing codes and usage records
  □ Add referral discount logic to payment flow
  □ Update Payment.tsx to work with Laravel backend
```

---

### 6. **Video Security & Streaming**

**Current**: Supabase Edge Function `get-bunny-video-url`

```typescript
Location: /promise/supabase/functions/get-bunny-video-url/index.ts
Purpose:
  1. Authenticate user
  2. Verify subscription
  3. Call Bunny API
  4. Return signed/temporary video URL

Migration Path:
  □ Create Laravel VideoProxyController
  □ Create VideoUrlService (Bunny API integration)
  □ Implement URL encryption/tokenization
  □ Add token expiration (24 hours)
  □ Add IP validation (optional)
  □ Replace React edge function with Laravel endpoint
```

---

### 7. **User Roles & Permissions**

**Current**: Supabase `user_roles` table

```sql
user_roles table contains:
├── id (uuid)
├── user_id (FK → auth.users)
├── role ('user' | 'admin')
├── created_at (timestamp)
```

**Migration Path**:

```
Current Laravel status:
  ✓ User model exists

Need to:
  □ Create roles table or add role column to users table
  □ Migrate admin roles from Supabase
  □ Create AdminMiddleware
  □ Add role checking to admin pages
```

---

### 8. **Reviews System**

**Current**: Supabase `reviews` table

```sql
reviews table contains:
├── id (uuid)
├── user_id (FK → auth.users)
├── movie_id (FK → movies)
├── rating (integer)
├── review_text (text)
├── is_approved (boolean)
├── created_at, updated_at (timestamp)
```

**Migration Path**:

```
Need to:
  □ Create Review model and table
  □ Migrate all reviews from Supabase
  □ Add Review creation endpoint
  □ Add moderation (is_approved) workflow
  □ Display reviews in Watch page and Index page
```

---

### 9. **Cast & Crew Management**

**Current**: Supabase `cast_crew` table

```sql
cast_crew table contains:
├── id (uuid)
├── user_id (FK → profiles, nullable)
├── stage_name (text)
├── real_name (text)
├── role_type ('cast' | 'crew')
├── role_title (text)
├── bio (text)
├── image_url (text)
├── referral_code (text)
├── permissions (jsonb)
├── is_active (boolean)
├── created_at, updated_at (timestamp)
```

**Migration Path**:

```
Current Laravel status:
  ✓ CastCrew model exists
  ✓ Table exists in Laravel

Need to:
  □ Check if Laravel table schema matches Supabase schema
  □ Migrate cast/crew records from Supabase
  □ Verify display_order field (if needed)
  □ Update admin interface for cast/crew management
```

---

### 10. **Gallery Management**

**Current**: Supabase implicitly (data in JSON or separate table)
**Laravel Status**: Gallery model and table exist

**Migration Path**:

```
Need to:
  □ Check if Gallery data exists in Supabase
  □ Migrate gallery images from Supabase if needed
  □ Ensure image URLs point to valid CDN/storage
```

---

## 📋 Migration Task Checklist

### Phase 1: Core Data Migration (Foundation)

```
Priority: CRITICAL - Block other work until complete

□ Create Movie model and migrations
□ Create Subscription model and migrations
□ Create StreamingLog model and migrations
□ Migrate Movie data from Supabase
□ Migrate Subscription data from Supabase
□ Migrate StreamingLog data from Supabase
□ Verify data integrity post-migration
```

### Phase 2: Authentication & Users

```
Priority: HIGH - Required for functionality

□ Create User roles system (if not exists)
□ Migrate Supabase users to Laravel users table
□ Migrate user metadata (full_name, phone)
□ Create admin authorization middleware
□ Migrate user_roles from Supabase
□ Verify user authentication still works
```

### Phase 3: Video Delivery & Security

```
Priority: CRITICAL - Core feature

□ Create VideoProxyController
□ Create VideoUrlService (Bunny API)
□ Implement URL token generation
□ Implement token expiration (24 hours)
□ Create endpoint: GET /api/video/{movieId}
□ Replace Supabase edge function with Laravel endpoint
□ Update Watch.vue to fetch from /api/video endpoint
□ Add subscription verification before returning URL
□ Implement video URL encryption/obfuscation
```

### Phase 4: Payment Integration

```
Priority: HIGH - Revenue critical

□ Create PaymentController
□ Implement Paystack callback handling
□ Create subscription creation workflow
□ Verify payment webhook → subscription creation
□ Test payment flow (card, mobile money)
□ Update Payment.tsx to work with Laravel backend
```

### Phase 5: Referral System

```
Priority: MEDIUM - Marketing feature

□ Create ReferralCode model and migrations
□ Create ReferralUsage model and migrations
□ Migrate referral codes from Supabase
□ Migrate referral usage from Supabase
□ Add referral discount calculation
□ Add referral tracking to payment flow
```

### Phase 6: Reviews & Analytics

```
Priority: MEDIUM - Community feature

□ Create Review model (if not exists)
□ Migrate reviews from Supabase
□ Create review submission endpoint
□ Create admin review moderation
□ Create analytics dashboard
□ Display reviews on Watch page
```

### Phase 7: Admin Panel Migration

```
Priority: MEDIUM - Internal tool

□ Migrate admin pages from React/Supabase to Laravel/Inertia
□ Create Admin/MoviesController
□ Create Admin/SubscriptionsController
□ Create Admin/AnalyticsController
□ Create Admin/CastCrewController
□ Add admin routes with middleware
□ Update Laravel resources/views/admin pages
```

### Phase 8: Frontend Integration

```
Priority: HIGH - User experience

□ Update Watch.vue to use /api/video endpoint
□ Update Watch.vue to handle encrypted URLs
□ Update Index.tsx to fetch from Laravel backend (or keep React)
□ Update Payment.tsx to work with Laravel
□ Add token refresh mechanism for long videos
□ Implement fallback for URL expiration
```

### Phase 9: Testing & Cleanup

```
Priority: CRITICAL - Quality assurance

□ End-to-end test video streaming
□ End-to-end test payment flow
□ End-to-end test user registration
□ Test admin functionality
□ Verify all data migrated correctly
□ Performance testing
□ Security audit
□ Remove/deprecate Supabase code
□ Deploy to production
```

---

## 🗄️ Database Schema Summary

### Tables That Need to be Created/Updated in Laravel

| Table            | Status | Source           | Notes                             |
| ---------------- | ------ | ---------------- | --------------------------------- |
| `movies`         | CREATE | Supabase         | Video catalog                     |
| `subscriptions`  | CREATE | Supabase         | Purchase records                  |
| `streaming_logs` | CREATE | Supabase         | Watch analytics                   |
| `referral_codes` | CREATE | Supabase         | Referral tracking                 |
| `referral_usage` | CREATE | Supabase         | Referral usage                    |
| `reviews`        | EXISTS | Supabase         | Need to migrate data              |
| `user_roles`     | CREATE | Supabase         | Admin permissions                 |
| `users`          | EXISTS | Laravel          | Link to auth                      |
| `banners`        | EXISTS | Laravel          | ✓ Already updated with Bunny URLs |
| `cast_crew`      | EXISTS | Laravel/Supabase | Need to verify & migrate          |
| `gallery`        | EXISTS | Laravel          | Need to verify & migrate          |
| `page_content`   | EXISTS | Laravel          | Already exists                    |

---

## 🔐 Security Considerations

### Video URL Protection (NEW)

```
Current Issue: URLs exposed in browser DevTools
Proposed Solution: Token-based signed URLs

Implementation:
  1. User requests /api/video/{movieId}
  2. Server verifies subscription
  3. Server generates time-limited token (24 hours)
  4. Server returns encrypted/signed URL
  5. Frontend uses URL from token (expires after 24h)
  6. Token cannot be reused on different device/IP (optional)
```

### URL Encryption Options

```
Option 1: Signed URLs with HMAC
  - Generate HMAC signature with expiration
  - Include signature in URL as query parameter
  - Validate signature before returning video

Option 2: Server-Side Proxy
  - Frontend requests /proxy/video/{token}
  - Server proxies to Bunny CDN
  - Token mapped to actual Bunny URL
  - More control but higher bandwidth

Option 3: JWT Tokens
  - Create JWT with user ID, movie ID, expiration
  - Include JWT in Authorization header
  - Server validates JWT before returning URL
```

**Recommendation**: Signed URLs with HMAC (balance of security & performance)

---

## ⚠️ RISKS & DEPENDENCIES

### Critical Risks

1. **Data Loss**: Migrating Supabase data without proper backup
2. **Payment Interruption**: Breaking Paystack webhook during migration
3. **User Session Loss**: Users logged out during migration
4. **Video Availability**: Users unable to watch during cutover

### Mitigation Strategy

1. ✓ Export all Supabase data before deletion
2. ✓ Maintain parallel systems during transition
3. ✓ Test migration in staging environment first
4. ✓ Scheduled downtime for final cutover (2-hour window)
5. ✓ Rollback plan: Revert to Supabase if issues occur

### Dependencies

-   Bunny CDN API keys (already configured)
-   Paystack API keys (already configured)
-   Database backups
-   Laravel migrations
-   React component updates

---

## 💾 Data Volume Estimates

Based on current project:

```
Users (Supabase): ~10-50 test users
Movies: 1 (A Crazy Day in Accra)
Subscriptions: ~10-50 test records
Streaming Logs: ~100-500 entries
Reviews: ~10-20 entries
Cast/Crew: ~20-30 entries
Referral Codes: ~5-10 codes
```

**Total Records**: ~200-700 (small dataset, safe to migrate)

---

## 📅 Estimated Timeline

| Phase     | Tasks                | Estimated Time  |
| --------- | -------------------- | --------------- |
| Phase 1   | Database setup       | 1-2 hours       |
| Phase 2   | User migration       | 1 hour          |
| Phase 3   | Video delivery       | 2-3 hours       |
| Phase 4   | Payment integration  | 1-2 hours       |
| Phase 5   | Referral system      | 1 hour          |
| Phase 6   | Reviews & analytics  | 1 hour          |
| Phase 7   | Admin panel          | 2-3 hours       |
| Phase 8   | Frontend integration | 2-3 hours       |
| Phase 9   | Testing & cleanup    | 2-4 hours       |
| **TOTAL** | **Full Migration**   | **14-21 hours** |

**Parallel Work**: Some phases can be done simultaneously (est. 8-12 hours if optimized)

---

## 🎯 APPROVAL CHECKLIST

**Before proceeding with migration, please confirm:**

-   [ ] **Agree to migrate all Supabase data to Laravel?**
-   [ ] **Accept 2-4 hour maintenance window for cutover?**
-   [ ] **Want to implement video URL protection (signed tokens)?**
-   [ ] **Confirm backup of all production data will be taken first?**
-   [ ] **Proceed with Phase 1 (Core data migration) first?**
-   [ ] **Additional requirements or modifications needed?**

---

## 📝 Next Steps (Upon Approval)

1. **Backup Supabase Data**

    - Export all tables to JSON/CSV
    - Store in `/database/exports/supabase_backup_[date].json`

2. **Create Laravel Migrations**

    - Movie, Subscription, StreamingLog, etc.
    - Run migrations in development first

3. **Develop Data Importer**

    - Create Laravel command: `php artisan migrate:import-supabase`
    - Test data integrity

4. **Implement Video Security**

    - Create VideoProxyController
    - Create token generation logic
    - Test signed URLs

5. **Update Frontend Components**

    - Modify Watch.vue
    - Modify Payment.tsx (if keeping React)
    - Test full workflow

6. **Stage & Test**

    - Deploy to staging environment
    - Full end-to-end testing
    - Performance validation

7. **Production Cutover**
    - Final backup
    - Run migration
    - Verify all systems working
    - Monitor for issues

---

**Document Status**: ✋ **AWAITING YOUR APPROVAL**

Please review the migration plan above and confirm:

1. Whether to proceed with complete migration to Laravel
2. Any specific phase you'd like to prioritize
3. Any modifications to the plan
4. Timeline preferences

Once approved, I'll begin implementation starting with Phase 1.
