<?php

// List all Vue files in Pages/Admin
$adminPagesDir = '/Users/tomc/Herd/crazyday/resources/js/Pages/Admin';

function listDirectoryRecursive($dir, $prefix = '')
{
    if (! is_dir($dir)) {
        return;
    }

    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }

        $path = $dir.'/'.$file;
        if (is_dir($path)) {
            echo $prefix.'📁 '.$file."/\n";
            listDirectoryRecursive($path, $prefix.'  ');
        } else {
            echo $prefix.'📄 '.$file."\n";
        }
    }
}

echo "=== ADMIN PAGES STRUCTURE ===\n";
listDirectoryRecursive($adminPagesDir);

// Also check general Pages
echo "\n=== ALL PAGES STRUCTURE ===\n";
$pagesDir = '/Users/tomc/Herd/crazyday/resources/js/Pages';
$files = scandir($pagesDir);
sort($files);
foreach ($files as $file) {
    if ($file !== '.' && $file !== '..') {
        $path = $pagesDir.'/'.$file;
        if (is_dir($path)) {
            echo '📁 '.$file."/\n";
        } else {
            echo '📄 '.$file."\n";
        }
    }
}
