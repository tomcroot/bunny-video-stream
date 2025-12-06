<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;

class RateLimitSensitiveEndpoints
{
    protected RateLimiter $limiter;

    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Rate limit login attempts: 5 per minute per IP
        if ($request->is('login') && $request->isMethod('post')) {
            if ($this->limiter->tooManyAttempts('login:'.$request->ip(), 5)) {
                return response()->json(['message' => 'Too many login attempts. Please try again later.'], 429);
            }
            $this->limiter->hit('login:'.$request->ip(), 60);
        }

        // Rate limit contact form: 3 per hour per IP
        if ($request->is('api/contact') && $request->isMethod('post')) {
            if ($this->limiter->tooManyAttempts('contact:'.$request->ip(), 3)) {
                return response()->json(['message' => 'Too many contact submissions. Please try again later.'], 429);
            }
            $this->limiter->hit('contact:'.$request->ip(), 3600);
        }

        // Rate limit review submissions: 5 per hour per user
        if ($request->is('api/reviews') && $request->isMethod('post')) {
            if ($request->user()) {
                $key = 'review:'.$request->user()->id;
                if ($this->limiter->tooManyAttempts($key, 5)) {
                    return response()->json(['message' => 'Too many review submissions. Please try again later.'], 429);
                }
                $this->limiter->hit($key, 3600);
            }
        }

        // Rate limit payment initialization: 10 per minute per user
        if ($request->is('payments/init') && $request->isMethod('post')) {
            if ($request->user()) {
                $key = 'payment:'.$request->user()->id;
                if ($this->limiter->tooManyAttempts($key, 10)) {
                    return response()->json(['message' => 'Too many payment attempts. Please try again later.'], 429);
                }
                $this->limiter->hit($key, 60);
            }
        }

        // Rate limit OTP requests: 3 per 15 minutes per phone/email
        if ($request->is('otp/send') && $request->isMethod('post')) {
            $identifier = $request->input('phone') ?? $request->input('email') ?? $request->ip();
            $key = 'otp:'.$identifier;
            if ($this->limiter->tooManyAttempts($key, 3)) {
                return response()->json(['message' => 'Too many OTP requests. Please try again in 15 minutes.'], 429);
            }
            $this->limiter->hit($key, 900);
        }

        // Rate limit password reset: 5 per hour per email
        if ($request->is('forgot-password') && $request->isMethod('post')) {
            $email = $request->input('email') ?? $request->ip();
            $key = 'password-reset:'.$email;
            if ($this->limiter->tooManyAttempts($key, 5)) {
                return response()->json(['message' => 'Too many password reset requests. Please try again later.'], 429);
            }
            $this->limiter->hit($key, 3600);
        }

        return $next($request);
    }
}
