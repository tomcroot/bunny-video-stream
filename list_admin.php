<?php

// Temporary test file to list directory contents
$adminDir = '/Users/tomc/Herd/crazyday/app/Http/Controllers/Admin';
if (is_dir($adminDir)) {
    echo "Admin Controllers:\n";
    foreach (scandir($adminDir) as $file) {
        if ($file !== '.' && $file !== '..' && strpos($file, '.php') !== false) {
            echo '  - '.$file."\n";
        }
    }
} else {
    echo "Admin controllers directory not found\n";
}

// Check Views
$viewsDir = '/Users/tomc/Herd/crazyday/resources/views/admin';
if (is_dir($viewsDir)) {
    echo "\nAdmin Views:\n";
    foreach (scandir($viewsDir) as $file) {
        if ($file !== '.' && $file !== '..') {
            echo '  - '.$file."\n";
        }
    }
} else {
    echo "Admin views directory not found\n";
}

// Check Vue Pages
$pagesDir = '/Users/tomc/Herd/crazyday/resources/js/Pages';
if (is_dir($pagesDir)) {
    echo "\nPages Directory:\n";
    foreach (scandir($pagesDir) as $file) {
        if ($file !== '.' && $file !== '..') {
            echo '  - '.$file."\n";
        }
    }
}
