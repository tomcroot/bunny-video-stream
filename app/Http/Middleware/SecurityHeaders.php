<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Prevent clickjacking attacks - DENY is stronger than SAMEORIGIN
        $response->headers->set('X-Frame-Options', 'DENY');

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Enable XSS protection
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Content Security Policy - tightened but allows Paystack + Bunny
        $csp = "default-src 'self'; ";
        $csp .= "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://js.paystack.co; ";
        $csp .= "style-src 'self' 'unsafe-inline' https://fonts.bunny.net; ";
        $csp .= "font-src 'self' https://fonts.bunny.net; ";
        $csp .= "img-src 'self' https: data: blob:; ";
        $csp .= "media-src 'self' blob: https://vz-6024b712-a89.b-cdn.net https://iframe.mediadelivery.net; ";
        $csp .= "frame-src 'self' https://iframe.mediadelivery.net https://checkout.paystack.com; ";
        $csp .= "connect-src 'self' https: wss: https://api.paystack.co; ";
        $csp .= "frame-ancestors 'none'; ";
        $csp .= "base-uri 'self'; ";
        $csp .= "form-action 'self';";

        $response->headers->set('Content-Security-Policy', $csp);

        // Permissions Policy (formerly Feature Policy) - allow necessary features for video embed
        // Allow self and Bunny iframe origin for video playback features
        $response->headers->set('Permissions-Policy', 'accelerometer=(self "https://iframe.mediadelivery.net"), autoplay=(self "https://iframe.mediadelivery.net"), camera=(), display-capture=(), encrypted-media=(self "https://iframe.mediadelivery.net"), fullscreen=(self "https://iframe.mediadelivery.net"), geolocation=(), gyroscope=(self "https://iframe.mediadelivery.net"), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(self "https://iframe.mediadelivery.net"), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()');

        // Strict Transport Security - force HTTPS (only in production)
        if (config('app.env') === 'production') {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        return $response;
    }
}
