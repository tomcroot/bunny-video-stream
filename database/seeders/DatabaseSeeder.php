<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\CastCrew;
use App\Models\Gallery;
use App\Models\PageContent;
use App\Models\ReferralCode;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Video URLs (Bunny CDN):
     * - Trailer: https://vz-6024b712-a89.b-cdn.net/643d70e3-19ee-4ae9-a2c9-ec20bf5742d9/playlist.m3u8
     * - Main Movie: https://vz-6024b712-a89.b-cdn.net/41d7b1aa-fca0-49dd-bb64-ad881d0a4ff6/playlist.m3u8
     * - Thumbnail: https://vz-6024b712-a89.b-cdn.net/643d70e3-19ee-4ae9-a2c9-ec20bf5742d9/thumbnail_d5a0c8c0.jpg
     */
    public function run(): void
    {
        // Ensure roles exist (Spatie Permissions)
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        // Create admin account if it doesn't exist
        $admin = User::firstOrCreate(
            ['email' => 'info@acrazydayinaccra.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('0538872908'),
                'phone_number' => '+233538872908',
                'email_verified_at' => now(),
            ]
        );

        // Attach admin role
        if (! $admin->hasRole($adminRole)) {
            $admin->assignRole($adminRole);
        }

        // Create test user if it doesn't exist (only in non-production)
        if (app()->environment('local', 'testing')) {
            $testUser = User::firstOrCreate(
                ['email' => 'test@example.com'],
                [
                    'name' => 'Test User',
                    'password' => bcrypt('password'),
                ]
            );

            if (! $testUser->hasRole($userRole)) {
                $testUser->assignRole($userRole);
            }
        }

        // Create sample banner
        Banner::create([
            'title' => 'A Crazy Day in Accra',
            'message' => 'Experience the chaos and excitement! Stream this amazing thriller now.',
            'cta_text' => 'Watch Now',
            'cta_url' => '/watch',
            'image_url' => 'https://vz-6024b712-a89.b-cdn.net/643d70e3-19ee-4ae9-a2c9-ec20bf5742d9/thumbnail_d5a0c8c0.jpg', // Bunny CDN thumbnail
            'video_url' => '643d70e3-19ee-4ae9-a2c9-ec20bf5742d9', // Bunny CDN video GUID (HLS)
            'target_date' => now()->addDays(30),
            'display_order' => 1,
            'is_active' => true,
        ]);

        // Create sample cast members
        $castMembers = [
            [
                'stage_name' => 'Jason Adebayo',
                'real_name' => 'Jason Adebayo',
                'role_type' => 'cast',
                'job_title' => 'Lead Actor',
                'image_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                'bio' => 'Jason Adebayo is a talented actor known for his powerful performances in Ghanaian cinema.',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'stage_name' => 'Amara Nwosu',
                'real_name' => 'Amara Nwosu',
                'role_type' => 'cast',
                'job_title' => 'Supporting Actress',
                'image_url' => 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
                'bio' => 'Amara brings depth and emotion to every role she plays.',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'stage_name' => 'Kofi Mensah',
                'real_name' => 'Kofi Mensah',
                'role_type' => 'cast',
                'job_title' => 'Supporting Actor',
                'image_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
                'bio' => 'Kofi Mensah is an emerging talent in Ghanaian film industry.',
                'display_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($castMembers as $member) {
            CastCrew::create($member);
        }

        // Create sample crew members
        $crewMembers = [
            [
                'stage_name' => 'Director Name',
                'real_name' => 'Director Name',
                'role_type' => 'crew',
                'job_title' => 'Director',
                'image_url' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
                'bio' => 'Award-winning director with over 15 years of experience.',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'stage_name' => 'Producer Name',
                'real_name' => 'Producer Name',
                'role_type' => 'crew',
                'job_title' => 'Producer',
                'image_url' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
                'bio' => 'Experienced producer known for bringing unique stories to life.',
                'display_order' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($crewMembers as $member) {
            CastCrew::create($member);
        }

        // Create sample gallery images
        $galleryImages = [
            [
                'title' => 'Behind the Scenes',
                'description' => 'Filming on location in Accra',
                'image_url' => 'https://images.unsplash.com/photo-1489599735734-79b4d4c4b3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'category' => 'behind-the-scenes',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Cast Rehearsal',
                'description' => 'Actors preparing for intense scenes',
                'image_url' => 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'category' => 'behind-the-scenes',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Location Scouting',
                'description' => 'Finding the perfect spots in Accra',
                'image_url' => 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'category' => 'behind-the-scenes',
                'display_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($galleryImages as $image) {
            Gallery::create($image);
        }

        // Create sample page content
        $pageContents = [
            [
                'page' => 'home',
                'section' => 'hero',
                'key' => 'tagline',
                'value' => 'A gripping thriller set in the vibrant streets of Accra, where one man\'s desperate quest for survival uncovers the dark underbelly of corruption and justice.',
                'is_active' => true,
            ],
            [
                'page' => 'details',
                'section' => 'main',
                'key' => 'content',
                'value' => '<h1>About the Film</h1><p>A Crazy Day in Accra is a thrilling cinematic experience that captures the essence of modern Ghanaian storytelling.</p>',
                'is_active' => true,
            ],
            [
                'page' => 'contact',
                'section' => 'main',
                'key' => 'content',
                'value' => '<h1>Contact Us</h1><p>Get in touch with the production team.</p>',
                'is_active' => true,
            ],
            [
                'page' => 'gallery',
                'section' => 'main',
                'key' => 'content',
                'value' => '<h1>Gallery</h1><p>Explore behind-the-scenes photos and production stills.</p>',
                'is_active' => true,
            ],
            [
                'page' => 'credits',
                'section' => 'main',
                'key' => 'content',
                'value' => '<h1>Credits</h1><p>Meet the talented cast and crew who brought this story to life.</p>',
                'is_active' => true,
            ],
            [
                'page' => 'terms',
                'section' => 'main',
                'key' => 'content',
                'value' => '<h1>Terms of Service</h1><p>Please read our terms and conditions carefully.</p>',
                'is_active' => true,
            ],
        ];

        foreach ($pageContents as $content) {
            PageContent::create($content);
        }

        // Create sample reviews
        $reviews = [
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@example.com',
                'content' => 'An absolutely gripping thriller! The cinematography and acting are top-notch. Can\'t wait to see more from this director.',
                'rating' => 5,
                'is_approved' => true,
            ],
            [
                'name' => 'Michael Brown',
                'email' => 'michael@example.com',
                'content' => 'A fresh take on the thriller genre. The Accra setting adds so much authenticity to the story. Highly recommended!',
                'rating' => 5,
                'is_approved' => true,
            ],
            [
                'name' => 'Emma Davis',
                'email' => 'emma@example.com',
                'content' => 'The pacing is perfect and the plot twists kept me on the edge of my seat. A must-watch for thriller fans.',
                'rating' => 4,
                'is_approved' => true,
            ],
        ];

        foreach ($reviews as $review) {
            Review::create($review);
        }

        // Create sample referral codes (migrated from Supabase)
        ReferralCode::create([
            'code' => 'SAVE20',
            'description' => '20% discount for early supporters',
            'discount_percentage' => 20,
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        ReferralCode::create([
            'code' => 'EARLYBIRD',
            'description' => '15% off for first 100 users',
            'discount_percentage' => 15,
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        ReferralCode::create([
            'code' => 'WELCOME10',
            'description' => '10% welcome discount for new subscribers',
            'discount_percentage' => 10,
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        ReferralCode::create([
            'code' => 'FRIEND25',
            'description' => '25% referral bonus - share with friends',
            'discount_percentage' => 25,
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        ReferralCode::create([
            'code' => 'VIP50',
            'description' => '50% off for VIP members',
            'discount_percentage' => 50,
            'is_active' => false, // Inactive - only for special events
            'created_by' => $admin->id,
        ]);
    }
}
