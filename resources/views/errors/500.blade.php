<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Error - A Crazy Day in Accra</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            text-align: center;
            max-width: 600px;
        }

        .error-code {
            font-size: 120px;
            font-weight: bold;
            background: linear-gradient(135deg, #d62828 0%, #f77f00 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
        }

        h1 {
            font-size: 32px;
            margin-bottom: 16px;
            color: #fff;
        }

        p {
            font-size: 16px;
            color: #b0b0b0;
            margin-bottom: 32px;
            line-height: 1.6;
        }

        .actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }

        a {
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 16px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #d62828 0%, #f77f00 100%);
            color: #fff;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(214, 40, 40, 0.3);
        }

        .btn-secondary {
            border: 2px solid #b0b0b0;
            color: #b0b0b0;
        }

        .btn-secondary:hover {
            border-color: #fff;
            color: #fff;
        }

        .illustration {
            font-size: 80px;
            margin-bottom: 20px;
            opacity: 0.8;
            animation: shake 0.5s infinite;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="illustration">⚠️</div>
        <div class="error-code">500</div>
        <h1>Production Error</h1>
        <p>Something went wrong during production. Our team has been notified and is working to fix the issue. Please try again later.</p>
        <div class="actions">
            <a href="/" class="btn-primary">Back to Home</a>
            <a href="/contact" class="btn-secondary">Contact Support</a>
        </div>
    </div>
</body>
</html>
