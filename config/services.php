<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'bunny' => [
        'access_key' => env('BUNNY_ACCESS_KEY'),
        'library_id' => env('BUNNY_LIBRARY_ID'),
        'pull_zone' => env('BUNNY_PULL_ZONE'),
        'storage_zone' => env('BUNNY_STORAGE_ZONE'),
        'signing_key' => env('BUNNY_SIGNING_KEY'), // required for signed/expiring playback URLs and iframe embeds
    ],

    'analytics' => [
        'ga_measurement_id' => env('GOOGLE_ANALYTICS_MEASUREMENT_ID'),
        'google_tag_id' => env('GOOGLE_TAG_ID'),
        'meta_pixel_id' => env('META_PIXEL_ID'),
    ],

];
