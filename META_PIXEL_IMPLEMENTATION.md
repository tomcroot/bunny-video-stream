# Meta Pixel Implementation Guide

## Overview

Meta Pixel has been successfully integrated into your "A Crazy Day in Accra" application. The implementation includes automatic page view tracking and conversion tracking for key user actions.

**Pixel ID:** `761156186997685`

## Architecture

### Configuration

The Meta Pixel ID is configured through environment variables:

```bash
# .env file
META_PIXEL_ID=761156186997685
```

This is passed to the application through `resources/views/app.blade.php` and made available globally via `window.__APP_ANALYTICS__`.

### Core Implementation Files

1. **[resources/views/app.blade.php](resources/views/app.blade.php)** - Main template

    - Loads Meta Pixel script tag
    - Initializes fbq with pixel ID
    - Includes noscript fallback for users without JavaScript
    - Passes config to frontend via `window.__APP_ANALYTICS__`

2. **[resources/js/lib/analytics.js](resources/js/lib/analytics.js)** - Analytics module

    - Registers analytics on page mount
    - Handles page view tracking
    - Provides conversion tracking methods
    - Exposes API via `window.appAnalytics`

3. **[resources/js/app.js](resources/js/app.js)** - Main app entry point
    - Calls `registerAnalytics(router)` to initialize tracking

## Tracked Events

### Automatic Events

**PageView** - Tracked automatically on:

-   Initial page load
-   Every Inertia.js page navigation

Data included:

-   `page_path` - URL path
-   `page_title` - Page title

### Conversion Events

The following conversion events are manually tracked by components:

#### 1. ViewContent (Payment Page)

**Triggered:** When user navigates to the payment page

```javascript
window.appAnalytics.trackMetaViewContent({
    content_name: "A Crazy Day in Accra",
    content_id: "a-crazy-day-in-accra",
    value: 15.0,
    currency: "GHS",
});
```

**File:** [resources/js/Pages/Payment.vue](resources/js/Pages/Payment.vue#L50)

#### 2. Purchase (Payment Page)

**Triggered:** When user clicks "Pay Securely with Paystack"

```javascript
window.appAnalytics.trackMetaPurchase({
    value: 15.0,
    currency: "GHS",
    content_name: "A Crazy Day in Accra",
    content_id: "a-crazy-day-in-accra",
    content_type: "product",
});
```

**File:** [resources/js/Pages/Payment.vue](resources/js/Pages/Payment.vue#L110)

#### 3. Contact (Contact Page)

**Triggered:** When user successfully submits contact form

```javascript
window.appAnalytics.trackMetaContact();
```

**File:** [resources/js/Pages/Contact.vue](resources/js/Pages/Contact.vue#L190)

#### 4. ViewContent (Watch Page)

**Triggered:** When user navigates to the watch/streaming page

```javascript
window.appAnalytics.trackMetaViewContent({
    content_name: "A Crazy Day in Accra",
    content_id: "a-crazy-day-in-accra-watch",
    content_type: "video",
});
```

**File:** [resources/js/Pages/Watch.vue](resources/js/Pages/Watch.vue#L840)

## Available API Methods

The `window.appAnalytics` object exposes the following methods:

### Page View Tracking

```javascript
// Automatically handled by registerAnalytics
// No manual call needed
```

### Event Tracking

```javascript
// Track standard Meta Pixel events
window.appAnalytics.trackMetaEvent("PageView", {
    page_path: "/path",
    page_title: "Title",
});

// Track custom events
window.appAnalytics.trackMetaCustomEvent("CustomEvent", {
    custom_param: "value",
});
```

### Conversion Tracking

```javascript
// Purchase conversion
window.appAnalytics.trackMetaPurchase({
    value: 15.0,
    currency: "GHS",
    content_name: "Product Name",
    content_id: "product-123",
    content_type: "product",
});

// Lead conversion
window.appAnalytics.trackMetaLead({
    value: 0,
    currency: "GHS",
    content_name: "Lead Form",
});

// Contact
window.appAnalytics.trackMetaContact();

// View content
window.appAnalytics.trackMetaViewContent({
    content_name: "Content Name",
    content_id: "content-123",
    value: 15.0,
    currency: "GHS",
});

// Add to cart
window.appAnalytics.trackMetaAddToCart({
    value: 15.0,
    currency: "GHS",
    content_name: "Product",
    content_id: "product-123",
    content_type: "product",
});
```

### Google Analytics Integration

```javascript
// Track events in Google Analytics
window.appAnalytics.trackGaEvent("EventName", {
    param: "value",
});
```

## How to Add Tracking to New Pages

### Step 1: Import necessary modules in your Vue component

```javascript
<script setup>import {onMounted} from 'vue'</script>
```

### Step 2: Add tracking to component lifecycle

For **page views:**

```javascript
// Your component automatically gets PageView event from registerAnalytics
```

For **ViewContent events:**

```javascript
onMounted(() => {
    if (window.appAnalytics?.trackMetaViewContent) {
        window.appAnalytics.trackMetaViewContent({
            content_name: "Your Content",
            content_id: "content-id",
            value: 0,
            currency: "GHS",
        });
    }
});
```

For **conversion events:**

```javascript
const handleConversion = () => {
    // Track the conversion
    if (window.appAnalytics?.trackMetaPurchase) {
        window.appAnalytics.trackMetaPurchase({
            value: 100.0,
            currency: "GHS",
            content_name: "Product",
            content_id: "product-123",
        });
    }

    // Then proceed with your action
    // e.g., submit form, navigate, etc.
};
```

## Noscript Fallback

Users without JavaScript enabled will still be tracked via the `<noscript>` tag in [resources/views/app.blade.php](resources/views/app.blade.php#L126). This provides a 1x1 pixel tracking fallback.

## Testing Meta Pixel

### 1. Verify Installation

-   Open browser DevTools Console
-   Check that `window.fbq` is defined
-   Check that `window.appAnalytics` is defined

### 2. Check Events in Meta Business Suite

1. Go to Meta Business Suite > Events Manager
2. Select your pixel (ID: 761156186997685)
3. View real-time events as you interact with the site

### 3. Monitor Console Logs

Events are logged for debugging purposes. You can trace event tracking by:

-   Navigating between pages
-   Filling out forms
-   Making purchases

### 4. Use Meta's Test Events

In Events Manager, you can send test events to verify tracking:

-   Go to Events Manager > Test Events
-   Manually trigger events to verify they appear in real-time

## Best Practices

1. **Always check if API exists before calling:**

    ```javascript
    if (window.appAnalytics?.trackMetaPurchase) {
      window.appAnalytics.trackMetaPurchase({...})
    }
    ```

2. **Track conversions at the right moment:**

    - Track `Purchase` when payment is initiated, not when form is filled
    - Track `Contact` after successful form submission, not on form load
    - Track `Lead` when lead information is captured

3. **Include relevant data:**

    - Always include `value` and `currency` for financial conversions
    - Use consistent `content_id` values across your site
    - Set appropriate `content_type` ('product', 'video', 'article', etc.)

4. **Monitor pixel health:**
    - Regularly check Events Manager for correct event firing
    - Verify values are accurate
    - Check for data quality issues

## Environment Configuration

### Production

```bash
META_PIXEL_ID=761156186997685
```

### Development

Keep the same ID to test, or use a test pixel ID if you have one set up in Meta Business Suite.

### Disable Pixel

To disable the pixel temporarily, set:

```bash
META_PIXEL_ID=
```

## Troubleshooting

### Pixel not firing

1. Verify `META_PIXEL_ID` is set in `.env`
2. Check that `resources/views/app.blade.php` has the pixel script
3. Verify `fbq` is loaded by checking `window.fbq` in console
4. Check browser console for errors

### Events not showing in Events Manager

1. Allow 15-30 minutes for events to appear
2. Verify the correct pixel ID is set
3. Check that `window.appAnalytics` methods are being called
4. Verify network requests to `facebook.com/tr` in DevTools

### Incorrect data in events

1. Verify the data being passed to tracking functions
2. Check that `value` and `currency` are correct
3. Ensure `content_id` is consistent across pages
4. Review the conversion funnel in Events Manager

## Additional Resources

-   [Meta Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel)
-   [Meta Events Manager](https://business.facebook.com/events_manager/)
-   [Standard Events Reference](https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking)
-   [Advanced Matching](https://developers.facebook.com/docs/facebook-pixel/implementation/advanced-matching)

## Summary of Changes

### Modified Files

1. ✅ `.env` - Added `META_PIXEL_ID=761156186997685`
2. ✅ `.env.example` - Updated with pixel ID for reference
3. ✅ `resources/js/lib/analytics.js` - Enhanced with conversion tracking methods
4. ✅ `resources/js/Pages/Payment.vue` - Added ViewContent and Purchase tracking
5. ✅ `resources/js/Pages/Contact.vue` - Added Contact conversion tracking
6. ✅ `resources/js/Pages/Watch.vue` - Added ViewContent tracking

### Already Implemented

-   ✅ `resources/views/app.blade.php` - Pixel script and noscript fallback
-   ✅ `config/services.php` - Analytics configuration
-   ✅ `resources/js/app.js` - Analytics registration

## Next Steps

1. **Verify everything is working:**

    - Test on all main pages
    - Check Events Manager for data
    - Verify conversion funnels

2. **Create conversion funnels in Meta Business Suite:**

    - ViewContent → Purchase
    - Contact form submissions
    - Video watching behavior

3. **Set up audiences for retargeting:**

    - Users who viewed content but didn't purchase
    - Users who viewed watch page
    - Engaged users

4. **Optimize ads based on data:**
    - Test different audiences
    - A/B test messaging
    - Track ROI

---

**Implementation Date:** December 26, 2025
**Pixel ID:** 761156186997685
**Status:** ✅ Complete and ready for testing
