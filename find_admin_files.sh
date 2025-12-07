#!/bin/bash

echo "=== ADMIN CONTROLLER FILES ==="
find /Users/tomc/Herd/crazyday/app/Http/Controllers/Admin -type f -name "*.php" 2>/dev/null | sort

echo -e "\n=== ADMIN VIEW FILES (Blade) ==="
find /Users/tomc/Herd/crazyday/resources/views/admin -type f -name "*.blade.php" 2>/dev/null | sort

echo -e "\n=== ADMIN VUE COMPONENTS ==="
find /Users/tomc/Herd/crazyday/resources/js -type f \( -name "*Admin*" -o -path "*/Admin/*" \) -name "*.vue" 2>/dev/null | sort

echo -e "\n=== ALL VUE PAGES ==="
ls -la /Users/tomc/Herd/crazyday/resources/js/Pages/ 2>/dev/null
