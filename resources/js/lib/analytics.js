const isBrowser = typeof window !== 'undefined';
const isDev = typeof window !== 'undefined' && (window.location?.hostname === 'localhost' || window.location?.hostname === '127.0.0.1' || window.location?.hostname?.endsWith('.test'));

const getAnalyticsConfig = () => {
    if (!isBrowser) {
        return {};
    }

    return window.__APP_ANALYTICS__ ?? {};
};

const trackGaPageView = (config, { url, title }) => {
    if (!config.gaMeasurementId || typeof window.gtag !== 'function') {
        if (isDev) console.warn('[Analytics] GA measurement ID not configured or gtag unavailable');
        return;
    }

    if (isDev) console.debug('[Analytics] Tracking GA page view:', { url, title });
    window.gtag('event', 'page_view', {
        page_path: url,
        page_location: `${window.location.origin}${url}`,
        page_title: title,
    });
};

const trackMetaEvent = (config, eventName, params = {}) => {
    if (!config.metaPixelId || typeof window.fbq !== 'function') {
        if (isDev) console.warn(`[Analytics] Meta Pixel ID not configured or fbq unavailable for event: ${eventName}`);
        return;
    }

    if (isDev) console.debug(`[Analytics] Tracking Meta event: ${eventName}`, params);
    window.fbq('track', eventName, params);
};

const trackMetaCustomEvent = (config, eventName, params = {}) => {
    if (!config.metaPixelId || typeof window.fbq !== 'function') {
        if (isDev) console.warn(`[Analytics] Meta Pixel ID not configured or fbq unavailable for custom event: ${eventName}`);
        return;
    }

    if (isDev) console.debug(`[Analytics] Tracking Meta custom event: ${eventName}`, params);
    window.fbq('trackCustom', eventName, params);
};

const trackGaEvent = (config, eventName, params = {}) => {
    if (!config.gaMeasurementId || typeof window.gtag !== 'function') {
        if (isDev) console.warn(`[Analytics] GA measurement ID not configured or gtag unavailable for event: ${eventName}`);
        return;
    }

    if (isDev) console.debug(`[Analytics] Tracking GA event: ${eventName}`, params);
    window.gtag('event', eventName, params);
};

// Google Ads conversion tracking helpers
const trackGoogleAdsPurchase = (config, purchaseData = {}) => {
    if (!config.googleAdsId || typeof window.gtag !== 'function') {
        if (isDev) console.warn('[Analytics] Google Ads ID not configured or gtag unavailable for purchase event');
        return;
    }

    const { value, currency = 'GHS' } = purchaseData;
    if (isDev) console.debug('[Analytics] Tracking Google Ads purchase:', { value, currency, ...purchaseData });

    window.gtag('event', 'purchase', {
        value,
        currency,
        transaction_id: purchaseData.transaction_id || '',
    });
};

const trackGoogleAdsLead = (config, leadData = {}) => {
    if (!config.googleAdsId || typeof window.gtag !== 'function') {
        if (isDev) console.warn('[Analytics] Google Ads ID not configured or gtag unavailable for lead event');
        return;
    }

    if (isDev) console.debug('[Analytics] Tracking Google Ads lead:', leadData);
    window.gtag('event', 'generate_lead', {
        currency: leadData.currency || 'GHS',
        value: leadData.value || 0,
    });
};

const trackGoogleAdsEvent = (config, eventName, params = {}) => {
    if (!config.googleAdsId || typeof window.gtag !== 'function') {
        if (isDev) console.warn(`[Analytics] Google Ads ID not configured or gtag unavailable for event: ${eventName}`);
        return;
    }

    if (isDev) console.debug(`[Analytics] Tracking Google Ads event: ${eventName}`, params);
    window.gtag('event', eventName, params);
};

// Meta Pixel conversion tracking helpers
const trackMetaPurchase = (config, purchaseData = {}) => {
    if (!config.metaPixelId || typeof window.fbq !== 'function') {
        if (isDev) console.warn('[Analytics] Meta Pixel ID not configured or fbq unavailable for purchase event');
        return;
    }

    const { value, currency = 'GHS', content_name, content_id, content_type = 'product' } = purchaseData;
    if (isDev) console.debug('[Analytics] Tracking Meta purchase:', purchaseData);

    window.fbq('track', 'Purchase', {
        value,
        currency,
        content_name,
        content_id,
        content_type,
    });
};

const trackMetaLead = (config, leadData = {}) => {
    if (!config.metaPixelId || typeof window.fbq !== 'function') {
        if (isDev) console.warn('[Analytics] Meta Pixel ID not configured or fbq unavailable for lead event');
        return;
    }

    const { value, currency = 'GHS', content_name } = leadData;
    if (isDev) console.debug('[Analytics] Tracking Meta lead:', leadData);

    window.fbq('track', 'Lead', {
        value,
        currency,
        content_name,
    });
};

const trackMetaContact = (config) => {
    if (!config.metaPixelId || typeof window.fbq !== 'function') {
        if (isDev) console.warn('[Analytics] Meta Pixel ID not configured or fbq unavailable for contact event');
        return;
    }

    if (isDev) console.debug('[Analytics] Tracking Meta contact');
    window.fbq('track', 'Contact');
};

const trackMetaViewContent = (config, contentData = {}) => {
    if (!config.metaPixelId || typeof window.fbq !== 'function') {
        if (isDev) console.warn('[Analytics] Meta Pixel ID not configured or fbq unavailable for ViewContent event');
        return;
    }

    const { content_name, content_id, value, currency = 'GHS' } = contentData;
    if (isDev) console.debug('[Analytics] Tracking Meta ViewContent:', contentData);

    window.fbq('track', 'ViewContent', {
        content_name,
        content_id,
        value,
        currency,
    });
};

const trackMetaAddToCart = (config, cartData = {}) => {
    if (!config.metaPixelId || typeof window.fbq !== 'function') {
        if (isDev) console.warn('[Analytics] Meta Pixel ID not configured or fbq unavailable for AddToCart event');
        return;
    }

    const { value, currency = 'GHS', content_name, content_id, content_type = 'product' } = cartData;
    if (isDev) console.debug('[Analytics] Tracking Meta AddToCart:', cartData);

    window.fbq('track', 'AddToCart', {
        value,
        currency,
        content_name,
        content_id,
        content_type,
    });
};

export const registerAnalytics = (router) => {
    if (!isBrowser || !router) {
        return;
    }

    const config = getAnalyticsConfig();

    if (!config.gaMeasurementId && !config.metaPixelId) {
        return;
    }

    const emitPageView = (url, title) => {
        trackGaPageView(config, { url, title });
        trackMetaEvent(config, 'PageView', {
            page_path: url,
            page_title: title,
        });
    };

    const initialPath = window.location.pathname + window.location.search;
    emitPageView(initialPath, document.title);

    router.on('success', (event) => {
        const page = event?.detail?.page;

        if (!page) {
            return;
        }

        const pageTitle = page.props?.title ?? document.title;
        emitPageView(page.url, pageTitle);
    });

    window.appAnalytics = {
        trackGaEvent: (eventName, params = {}) => trackGaEvent(config, eventName, params),
        trackMetaEvent: (eventName, params = {}) => trackMetaEvent(config, eventName, params),
        trackMetaCustomEvent: (eventName, params = {}) => trackMetaCustomEvent(config, eventName, params),
        trackMetaPurchase: (purchaseData = {}) => trackMetaPurchase(config, purchaseData),
        trackMetaLead: (leadData = {}) => trackMetaLead(config, leadData),
        trackMetaContact: () => trackMetaContact(config),
        trackMetaViewContent: (contentData = {}) => trackMetaViewContent(config, contentData),
        trackMetaAddToCart: (cartData = {}) => trackMetaAddToCart(config, cartData),
        trackGoogleAdsPurchase: (purchaseData = {}) => trackGoogleAdsPurchase(config, purchaseData),
        trackGoogleAdsLead: (leadData = {}) => trackGoogleAdsLead(config, leadData),
        trackGoogleAdsEvent: (eventName, params = {}) => trackGoogleAdsEvent(config, eventName, params),
    };
};
