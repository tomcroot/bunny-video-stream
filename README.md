<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

-   [Simple, fast routing engine](https://laravel.com/docs/routing).
-   [Powerful dependency injection container](https://laravel.com/docs/container).
-   Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
-   Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
-   Database agnostic [schema migrations](https://laravel.com/docs/migrations).
-   [Robust background job processing](https://laravel.com/docs/queues).
-   [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

-   **[Vehikl](https://vehikl.com)**
-   **[Tighten Co.](https://tighten.co)**
-   **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
-   **[64 Robots](https://64robots.com)**
-   **[Curotec](https://www.curotec.com/services/technologies/laravel)**
-   **[DevSquad](https://devsquad.com/hire-laravel-developers)**
-   **[Redberry](https://redberry.international/laravel-development)**
-   **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## 🎬 CrazyDay Project - A Crazy Day in Accra Film Platform

### Project Status: ✅ PRODUCTION-READY

A modern film streaming platform built with Laravel 12, Vue 3, and Inertia.js featuring video streaming, payment processing, admin dashboard, and comprehensive security hardening.

### Quick Start

```bash
# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Build frontend
npm run build

# Run migrations
php artisan migrate

# Start development
php artisan serve
```

### Core Features

-   🎥 **Video Streaming** - HLS.js adaptive bitrate streaming
-   💳 **Payment System** - Paystack integration with webhook verification
-   📧 **Email Notifications** - Brevo for transactional emails
-   🔐 **Authentication** - Email/password + OTP verification
-   👥 **User Profiles** - Payment history, profile management
-   📊 **Admin Dashboard** - Metrics, analytics, content management
-   🌍 **SEO Optimized** - Meta tags, schema.org, sitemap
-   🛡️ **Security Hardened** - Security headers, rate limiting, CSRF protection
-   📱 **Responsive Design** - Tailwind CSS v4.0 with dark/light mode
-   🎨 **Modern UI** - Reka UI components (Shadcn/ui for Vue)

### Technology Stack

-   **Backend**: Laravel 12 (LTS) with SQLite
-   **Frontend**: Vue 3.5.25 (Composition API) + Inertia.js 2.x
-   **Styling**: Tailwind CSS v4.0
-   **Build**: Vite 7.2.4
-   **Database**: 21 tables with full relationships
-   **Authentication**: Laravel Fortify + mNotify OTP
-   **Permissions**: Spatie Laravel Permission
-   **Payments**: Paystack with HMAC-SHA512 verification
-   **Email**: Brevo (hofmannsven/laravel-brevo v2.1)

### Documentation

Complete documentation available in `/docs` directory:

-   **[docs/00_PROJECT_COMPLETE.md](docs/00_PROJECT_COMPLETE.md)** - Project completion overview
-   **[docs/SECURITY.md](docs/SECURITY.md)** - Security implementation guide
-   **[docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md)** - Complete feature inventory
-   **[docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)** - Deployment procedures
-   **[docs/SECURITY_TESTING_GUIDE.md](docs/SECURITY_TESTING_GUIDE.md)** - Testing procedures
-   **[docs/PROJECT_DASHBOARD.md](docs/PROJECT_DASHBOARD.md)** - Visual status dashboard
-   **[docs/FINAL_STATUS.md](docs/FINAL_STATUS.md)** - Deployment guide
-   **[docs/SECURITY_VERIFICATION_REPORT.md](docs/SECURITY_VERIFICATION_REPORT.md)** - Verification results
-   **[docs/SESSION_10_ACCOMPLISHMENTS.md](docs/SESSION_10_ACCOMPLISHMENTS.md)** - Latest session details

### Project Statistics

| Metric                | Value              |
| --------------------- | ------------------ |
| **Total Features**    | 38 (100% complete) |
| **Security Measures** | 11 implemented     |
| **Database Tables**   | 21                 |
| **API Routes**        | 50+                |
| **Vue Components**    | 30+                |
| **Build Modules**     | 3052               |
| **Build Time**        | 3.44 seconds       |
| **Build Errors**      | 0                  |

### Development

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Run tests
php artisan test

# Clear caches
php artisan cache:clear

# View routes
php artisan route:list
```

### Security Features

-   ✅ 6 HTTP security headers (CSP, X-Frame-Options, etc.)
-   ✅ Rate limiting on authentication endpoints
-   ✅ Email verification requirement
-   ✅ Admin role-based access control
-   ✅ Paid content access control
-   ✅ HMAC webhook verification
-   ✅ Password reset tokens
-   ✅ Session management
-   ✅ Input validation & output escaping
-   ✅ CSRF protection

### Support

For issues, questions, or contributions, refer to the documentation in `/docs` directory or contact the development team.

**Status**: ✅ Ready for Production Deployment
