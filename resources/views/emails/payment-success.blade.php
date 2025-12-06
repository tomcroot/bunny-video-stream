<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Payment Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #27ae60; margin-bottom: 20px;">Payment Successful! 🎉</h2>

        <p>Hi {{ $user->name }},</p>

        <p>Thank you for your payment! Your video access has been successfully activated.</p>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Access Details</h3>
            <p><strong>Movie:</strong> {{ $movie->title }}</p>
            <p><strong>Amount Paid:</strong> ₦{{ number_format($amount / 100, 2) }}</p>
            <p><strong>Transaction Reference:</strong> {{ $transactionRef }}</p>
            <p><strong>Access Valid Until:</strong> {{ $expiresAt->format('F j, Y \a\t g:i A') }}</p>
            <p style="margin-bottom: 0;"><strong>Duration:</strong> 365 days</p>
        </div>

        <p>
            <a href="{{ url('/watch/' . $movie->id) }}" style="display: inline-block; background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Watch Now</a>
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <p style="font-size: 12px; color: #666;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
        </p>

        <p style="font-size: 12px; color: #666; margin-bottom: 0;">
            Best regards,<br>
            The CrazyDay Team
        </p>
    </div>
</body>
</html>
