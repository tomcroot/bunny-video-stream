<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';

    protected $description = 'Generate sitemap.xml automatically';

    public function handle()
    {
        $sitemap = Sitemap::create();

        // 1️⃣ Define public routes explicitly (avoid Fortify/internal routes)
        $publicRoutes = [
            ['url' => url('/'), 'priority' => 1.0, 'changefreq' => 'daily'],
            ['url' => url('/information'), 'priority' => 0.9, 'changefreq' => 'weekly'],
            ['url' => url('/gallery'), 'priority' => 0.8, 'changefreq' => 'weekly'],
            ['url' => url('/credits'), 'priority' => 0.8, 'changefreq' => 'monthly'],
            ['url' => url('/contact'), 'priority' => 0.7, 'changefreq' => 'yearly'],
            ['url' => url('/terms'), 'priority' => 0.5, 'changefreq' => 'yearly'],
            ['url' => url('/privacy'), 'priority' => 0.5, 'changefreq' => 'yearly'],
        ];

        foreach ($publicRoutes as $route) {
            $sitemap->add(
                Url::create($route['url'])
                    ->setLastModificationDate(now())
                    ->setPriority($route['priority'])
                    ->setChangeFrequency($route['changefreq'])
            );
        }

        // 2️⃣ Dynamic Film pages (if model exists)
        // Add dynamic film URLs if model exists; skip otherwise
        if (class_exists(\App\Models\Film::class)) {
            foreach (\App\Models\Film::all() as $film) {
                $sitemap->add(
                    Url::create(url('/film/'.$film->slug))
                        ->setLastModificationDate(
                            $film->updated_at ? Carbon::parse($film->updated_at) : now()
                        )
                        ->setPriority(0.9)
                        ->setChangeFrequency('weekly')
                );
            }
        }

        // 3️⃣ Output sitemap file
        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('✔ sitemap.xml generated successfully!');
    }
}
