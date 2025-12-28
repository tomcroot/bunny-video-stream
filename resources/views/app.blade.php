<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @php
        $appUrl = rtrim(config('app.url') ?: 'https://acrazydayinaccra.com', '/');
        $ogTitle = 'A Crazy Day in Accra - Official Film';
        $ogDescription = "Stream the award-winning short film 'A Crazy Day in Accra' now.";
        $ogImage = $appUrl . '/movie_poster.jpg';
        $twitterDomain = parse_url($appUrl, PHP_URL_HOST) ?? 'acrazydayinaccra.com';
    @endphp

    <!-- HTML Meta Tags -->
    <title>{{ $ogTitle }}</title>
    <meta name="description" content="{{ $ogDescription }}">
    <meta name="keywords" content="A Crazy Day in Accra, short film, streaming, promise land films, movie">
    <meta name="author" content="Promise Land Films">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="{{ $appUrl }}">

    <!-- Facebook Meta Tags -->
    <meta property="og:url" content="{{ $appUrl }}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="{{ $ogTitle }}">
    <meta property="og:description" content="{{ $ogDescription }}">
    <meta property="og:image" content="{{ $ogImage }}">
    <meta property="og:site_name" content="Promise Land Films">

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="{{ $twitterDomain }}">
    <meta property="twitter:url" content="{{ $appUrl }}">
    <meta name="twitter:title" content="{{ $ogTitle }}">
    <meta name="twitter:description" content="{{ $ogDescription }}">
    <meta name="twitter:image" content="{{ $ogImage }}">

    <!-- LinkedIn -->
    <meta property="linkedin:title" content="{{ $ogTitle }}">
    <meta property="linkedin:description" content="{{ $ogDescription }}">

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {!! json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'CreativeWork',
        'name' => 'A Crazy Day in Accra',
        'description' => 'A thrilling short film set in Accra with compelling storytelling and outstanding cinematography.',
        'genre' => ['Thriller', 'Drama'],
        'image' => $ogImage,
        'url' => $appUrl,
        'author' => [
            '@type' => 'Organization',
            'name' => 'Promise Land Films'
        ],
        'datePublished' => '2024-01-01'
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
    </script>

    @php
        $gaMeasurementId = config('services.analytics.ga_measurement_id');
        $googleTagId = config('services.analytics.google_tag_id');
        $googleAdsId = config('services.analytics.google_ads_id');
        $metaPixelId = config('services.analytics.meta_pixel_id');
    @endphp

    @if ($googleTagId)
        <!-- Google Tag Manager -->
        <script>
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','{{ $googleTagId }}');
        </script>
        <!-- End Google Tag Manager -->
    @endif

    <!-- Google Analytics & Google Ads Conversion Tracking -->
    @if ($gaMeasurementId || $googleAdsId)
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ $gaMeasurementId ?: $googleAdsId }}"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            @if ($gaMeasurementId)
                gtag('config', '{{ $gaMeasurementId }}', { send_page_view: false });
            @endif

            @if ($googleAdsId)
                gtag('config', '{{ $googleAdsId }}');
            @endif
        </script>
    @endif

    <!-- Favicon and Web App Icons -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="alternate icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#000000">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @if ($metaPixelId)
        <script>
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{ $metaPixelId }}');
        </script>
        <noscript>
            <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id={{ $metaPixelId }}&ev=PageView&noscript=1" />
        </noscript>
    @endif

    <script>
        window.__APP_ANALYTICS__ = @js([
            'gaMeasurementId' => $gaMeasurementId,
            'googleTagId' => $googleTagId,
            'googleAdsId' => $googleAdsId,
            'metaPixelId' => $metaPixelId,
        ]);
    </script>

    @routes
    @vite(['resources/js/app.js'])
    @inertiaHead
</head>
<body class="antialiased">
    @if ($googleTagId)
        <!-- Google Tag Manager (noscript) -->
        <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id={{ $googleTagId }}" height="0" width="0" style="display:none;visibility:hidden"></iframe>
        </noscript>
        <!-- End Google Tag Manager (noscript) -->
    @endif
    @inertia
</body>
</html>

