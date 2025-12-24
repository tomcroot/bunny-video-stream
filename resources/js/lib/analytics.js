const isBrowser = typeof window !== 'undefined';

const getAnalyticsConfig = () => {
    if (!isBrowser) {
        return {};
    }

    return window.__APP_ANALYTICS__ ?? {};
};

const trackGaPageView = (config, { url, title }) => {
    if (!config.gaMeasurementId || typeof window.gtag !== 'function') {
        return;
    }

    window.gtag('event', 'page_view', {
        page_path: url,
        page_location: `${window.location.origin}${url}`,
        page_title: title,
    });
};

const trackMetaEvent = (config, eventName, params = {}) => {
    if (!config.metaPixelId || typeof window.fbq !== 'function') {
        return;
    }

    window.fbq('track', eventName, params);
};

const trackMetaCustomEvent = (config, eventName, params = {}) => {
    if (!config.metaPixelId || typeof window.fbq !== 'function') {
        return;
    }

    window.fbq('trackCustom', eventName, params);
};

const trackGaEvent = (config, eventName, params = {}) => {
    if (!config.gaMeasurementId || typeof window.gtag !== 'function') {
        return;
    }

    window.gtag('event', eventName, params);
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
    };
};
