# CrazyDay

Film streaming and payment platform for "A Crazy Day in Accra", built with Laravel, Vue 3, and Inertia.

[![Changelog](https://img.shields.io/badge/changelog-updated-brightgreen)](CHANGELOG.md)

## Changelog

Project release notes are maintained in [CHANGELOG.md](CHANGELOG.md) and are intended to be read directly on GitHub.

## Tech Stack

- Backend: Laravel 12, PHP 8.2+
- Frontend: Vue 3, Inertia.js
- Build: Vite
- Styling: Tailwind CSS v4
- Payments: Paystack
- Queue/Jobs: Laravel queue workers + scheduler

## Core Features

- Secure payment initialization, callback, and webhook verification
- Subscription-based watch access control
- Payment reconciliation command and scheduler failsafe
- Admin dashboard for content and platform operations
- Email notifications on successful payment

## Local Setup

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run build
php artisan serve
```

## Development Commands

```bash
# Frontend dev
npm run dev

# Production build (client + SSR)
npm run build

# Tests
php artisan test

# Migrations
php artisan migrate:status

# Queue worker (example)
php artisan queue:work --queue=payments,emails,default

# Scheduler
php artisan schedule:work
```

## Deployment Notes

- Ensure queue workers are running for `payments`, `emails`, and `default` queues.
- Ensure scheduler is running for periodic reconciliation and maintenance tasks.
- Confirm Paystack callback/webhook URLs are correctly configured.

## Project Structure (Key Areas)

- `app/Http/Controllers` - Payment, watch, admin, and profile flows
- `resources/js/Pages` - Public and admin Vue pages
- `routes/web.php` - Web routes
- `routes/console.php` - Scheduler definitions
- `scripts/queue-workers.sh` - Supervisor worker/scheduler setup template

## Maintenance

- Keep `CHANGELOG.md` current for every grouped change.
- Remove temporary audit/docs artifacts once fixes are merged.
- Prefer source-of-truth docs over ad-hoc session notes.
