<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class EnvSettingsController extends Controller
{
    /**
     * Display environment settings
     */
    public function index()
    {
        $envSettings = $this->parseEnvFile();
        $envExample = $this->parseEnvExampleFile();

        return Inertia::render('Admin/EnvSettings', [
            'envSettings' => $envSettings,
            'envStructure' => $envExample,
        ]);
    }

    /**
     * Update environment settings
     */
    public function update(Request $request)
    {
        try {
            $settings = $request->input('settings', []);

            $envPath = base_path('.env');
            $envContent = File::get($envPath);

            foreach ($settings as $key => $value) {
                // Skip empty values for optional settings
                if ($value === '' || $value === null) {
                    continue;
                }

                // Escape special characters in value
                $escapedValue = $this->escapeEnvValue($value);

                // Check if key exists in .env
                if (preg_match("/^{$key}=.*/m", $envContent)) {
                    // Update existing key
                    $envContent = preg_replace(
                        "/^{$key}=.*/m",
                        "{$key}={$escapedValue}",
                        $envContent
                    );
                } else {
                    // Add new key at the end
                    $envContent .= "\n{$key}={$escapedValue}";
                }
            }

            // Write back to .env file
            File::put($envPath, $envContent);

            // Clear config cache
            \Artisan::call('config:clear');

            return redirect()->back()->with('success', 'Environment settings updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update settings: '.$e->getMessage());
        }
    }

    /**
     * Parse .env file into sections
     */
    private function parseEnvFile()
    {
        $envPath = base_path('.env');

        if (! File::exists($envPath)) {
            return [];
        }

        $content = File::get($envPath);
        $lines = explode("\n", $content);
        $settings = [];

        foreach ($lines as $line) {
            $line = trim($line);

            // Skip comments and empty lines
            if (empty($line) || str_starts_with($line, '#')) {
                continue;
            }

            // Parse key=value
            if (str_contains($line, '=')) {
                [$key, $value] = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);

                // Remove quotes if present
                $value = trim($value, '"\'');

                $settings[$key] = $value;
            }
        }

        return $settings;
    }

    /**
     * Parse .env.example file to get structure and descriptions
     */
    private function parseEnvExampleFile()
    {
        $envExamplePath = base_path('.env.example');

        if (! File::exists($envExamplePath)) {
            return [];
        }

        $content = File::get($envExamplePath);
        $lines = explode("\n", $content);

        $structure = [];
        $currentSection = 'General';
        $currentDescription = '';

        foreach ($lines as $line) {
            $trimmedLine = trim($line);

            // Detect section headers (comments that look like headers)
            if (str_starts_with($trimmedLine, '#') && strlen($trimmedLine) > 3) {
                $potentialSection = trim(substr($trimmedLine, 1));

                // If it's all uppercase or contains "Configuration", treat as section
                if (strtoupper($potentialSection) === $potentialSection ||
                    str_contains($potentialSection, 'Configuration') ||
                    str_contains($potentialSection, 'Settings') ||
                    str_ends_with($potentialSection, ':')) {
                    $currentSection = rtrim($potentialSection, ':');

                    continue;
                }

                // Otherwise, it's a description for the next variable
                $currentDescription = $potentialSection;

                continue;
            }

            // Parse key=value
            if (str_contains($trimmedLine, '=')) {
                [$key, $value] = explode('=', $trimmedLine, 2);
                $key = trim($key);
                $value = trim($value);

                if (! isset($structure[$currentSection])) {
                    $structure[$currentSection] = [];
                }

                $structure[$currentSection][] = [
                    'key' => $key,
                    'example' => $value,
                    'description' => $currentDescription,
                    'is_sensitive' => $this->isSensitiveKey($key),
                ];

                $currentDescription = '';
            }
        }

        return $structure;
    }

    /**
     * Escape value for .env file
     */
    private function escapeEnvValue($value)
    {
        // If value contains spaces, quotes, or special characters, wrap in quotes
        if (preg_match('/\s/', $value) || preg_match('/[#"\'\\\\$]/', $value)) {
            return '"'.addslashes($value).'"';
        }

        return $value;
    }

    /**
     * Check if a key is sensitive (password, secret, key, etc.)
     */
    private function isSensitiveKey($key)
    {
        $sensitivePatterns = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN', 'API_KEY', 'ACCESS_KEY', 'SIGNING'];

        foreach ($sensitivePatterns as $pattern) {
            if (str_contains(strtoupper($key), $pattern)) {
                return true;
            }
        }

        return false;
    }
}
