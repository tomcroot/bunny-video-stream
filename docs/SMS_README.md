# Bulk SMS Integration with mNotify

This document describes the bulk SMS capabilities implemented for the Promise video streaming platform using the arhinful/laravel-mnotify package.

## Setup

### 1. Environment Configuration

Add your mNotify credentials to your `.env` file:

```env
MNOTIFY_API_KEY=your_api_key_here
MNOTIFY_USERNAME=your_mnotify_username_here
```

### 2. Database Migration

The `phone_number` column has been added to the users table. Run migrations if not already done:

```bash
php artisan migrate
```

## Features

### 1. Notification Classes

-   **PaymentSuccessfulNotification**: Sends payment confirmation SMS
-   **RenewalReminderNotification**: Sends subscription renewal reminders

### 2. BulkSmsService

A service class that handles bulk SMS operations:

-   Send payment notifications to multiple users
-   Send renewal reminders to multiple users
-   Send custom SMS messages to selected users
-   Get users with valid phone numbers

### 3. BulkSmsController

API endpoints for admin bulk SMS operations:

-   `POST /admin/sms/custom` - Send custom SMS to selected users
-   `POST /admin/sms/payment-notifications` - Send payment notifications to all users
-   `POST /admin/sms/renewal-reminders` - Send renewal reminders
-   `GET /admin/sms/users-with-phones` - Get users with phone numbers

## Usage Examples

### Using the Service Directly

```php
use App\Services\BulkSmsService;

$bulkSmsService = app(BulkSmsService::class);

// Send payment notification to a user
$user = User::find(1);
$bulkSmsService->sendPaymentNotification($user, 'Movie Title', 50.00);

// Send custom bulk SMS
$phoneNumbers = ['+233501234567', '+233507654321'];
$result = $bulkSmsService->sendCustomBulkSms($phoneNumbers, 'Hello from Promise!');
```

### Using Notifications

```php
use App\Notifications\PaymentSuccessfulNotification;

$user = User::find(1);
$user->notify(new PaymentSuccessfulNotification('Movie Title', 50.00));
```

### Using API Endpoints

```bash
# Send custom SMS to specific users
curl -X POST /admin/sms/custom \
  -H "Content-Type: application/json" \
  -d '{
    "user_ids": [1, 2, 3],
    "message": "Your custom message here"
  }'

# Send payment notifications to all users
curl -X POST /admin/sms/payment-notifications \
  -H "Content-Type: application/json" \
  -d '{
    "movie_title": "Amazing Movie",
    "amount": 15.00
  }'
```

### Testing with Artisan Command

```bash
# List users with phone numbers
php artisan sms:test list-users

# Send payment notification to specific user
php artisan sms:test send-payment --user-id=1

# Send custom SMS to all users with phones
php artisan sms:test send-custom
```

## SMS Templates

### Payment Success Template

```
Payment successful! Your access to '{movie_title}' has been activated. Amount: ₵{amount}
```

### Renewal Reminder Template

```
Reminder: Your access to '{movie_title}' expires in {days_remaining} days. Renew now to continue watching!
```

## Phone Number Format

Phone numbers should be stored in international format:

-   Ghana: +233XXXXXXXXX
-   Example: +233501234567

## Error Handling

The system includes comprehensive error handling:

-   Invalid phone numbers are filtered out
-   Failed SMS attempts are logged
-   API responses include success/failure counts
-   Queue-based processing for reliability

## Security Considerations

-   Phone numbers are validated before sending
-   Rate limiting is handled by the mNotify service
-   Sensitive data is not logged in SMS content
-   Admin-only access to bulk SMS endpoints

## Future Enhancements

-   SMS delivery status tracking
-   SMS analytics and reporting
-   Scheduled SMS campaigns
-   SMS template management interface
-   Integration with user subscription/access models
