# Changelog

All notable changes to this project are documented in this file.

The format is inspired by Keep a Changelog and uses calendar dates.

## [Unreleased]

### Docs

- Cleaned up markdown documentation set by removing obsolete audit/runbook files.
- Rewrote `README.md` to be project-first and GitHub-friendly.
- Added explicit changelog visibility in `README.md` with direct link and badge.

## [2026-03-14]

### Added

- Payment success page fallback CTA so users can manually continue to watch if redirect timing fails.
- Scheduler worker process configuration in `scripts/queue-workers.sh` (`schedule:work`).

### Changed

- Hardened payment callback/webhook flow to make success-email dispatch resilient with after-response path and synchronous fallback.
- Scheduled payment reconciliation cadence in `routes/console.php` and removed duplicate scheduling configuration.
- Consolidated admin navigation into shared layout and simplified top-level nav grouping.
- Refactored admin referral experience into compact table workflow with modal create flow and improved filtering/sorting behavior.

### Fixed

- Applied referral code movie scoping and duplicate prevention path with migration-backed support.
- Removed unused React admin pages from Vue codebase.
- Updated Tailwind utility usage in admin views for current lint/style expectations.
- Updated smoke feature test to use stable health endpoint (`/up`) rather than DB-seeded homepage assumptions.

## [2025-12-08]

### Added

- Promise Land Films branding assets and poster assets integrated into the UI.
- Remember-me session behavior and password-reset OTP support groundwork.

### Changed

- Authentication UX simplified to a single login path and streamlined registration verification flow.
- UI and component import consistency improvements across public pages.

### Fixed

- Build stability and runtime safeguards for optional service providers and integrations.

## [2025-12-07]

### Added

- Admin settings management and dynamic premiere/date feature toggles.
- Watch progress tracking and analytics foundations.

### Changed

- Public information route moved to `/details`.

### Fixed

- Component import path consistency and frontend build reliability improvements.
