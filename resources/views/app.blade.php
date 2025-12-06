<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="Stream A Crazy Day in Accra - A thrilling short film featuring compelling storytelling and outstanding cinematography.">
    <meta name="keywords" content="A Crazy Day in Accra, short film, streaming, promise land films, movie">
    <meta name="author" content="Promise Land Films">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="{{ config('app.url') }}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ config('app.url') }}">
    <meta property="og:title" content="A Crazy Day in Accra - Official Film">
    <meta property="og:description" content="Stream the award-winning short film 'A Crazy Day in Accra' now.">
    <meta property="og:image" content="{{ config('app.url') }}/og-image.jpg">
    <meta property="og:site_name" content="Promise Land Films">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ config('app.url') }}">
    <meta property="twitter:title" content="A Crazy Day in Accra - Official Film">
    <meta property="twitter:description" content="Stream the award-winning short film 'A Crazy Day in Accra' now.">
    <meta property="twitter:image" content="{{ config('app.url') }}/og-image.jpg">

    <!-- LinkedIn -->
    <meta property="linkedin:title" content="A Crazy Day in Accra">
    <meta property="linkedin:description" content="Stream the award-winning short film 'A Crazy Day in Accra' on Promise Land Films.">

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {!! json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'CreativeWork',
        'name' => 'A Crazy Day in Accra',
        'description' => 'A thrilling short film set in Accra with compelling storytelling and outstanding cinematography.',
        'genre' => ['Thriller', 'Drama'],
        'image' => config('app.url') . '/og-image.jpg',
        'url' => config('app.url'),
        'author' => [
            '@type' => 'Organization',
            'name' => 'Promise Land Films'
        ],
        'datePublished' => '2024-01-01'
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
    </script>




    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/favicon.svg">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @vite(['resources/js/app.js'])
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>

