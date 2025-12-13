<?php

namespace App\Http\Controllers;

use App\Models\CastCrew;
use App\Models\PageContent;
use App\Models\Review;
use App\Services\BunnyVideoService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class HomeController extends Controller
{
    protected $bunnyService;

    public function __construct(BunnyVideoService $bunnyService)
    {
        $this->bunnyService = $bunnyService;
    }

    public function index()
    {
        // Trailer video ID from Bunny CDN
        $trailerId = '643d70e3-19ee-4ae9-a2c9-ec20bf5742d9';

        // Generate signed playback URL for trailer
        try {
            $trailerUrl = $this->bunnyService->getSignedPlaybackUrl($trailerId);
        } catch (\Throwable $e) {
            Log::error('Failed to get trailer URL', ['error' => $e->getMessage()]);
            $trailerUrl = null;
        }

        // Fetch real cast/crew from database
        $castCrew = CastCrew::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->stage_name,
                    'role' => $member->role_title,
                    'photo' => $member->image_url,
                ];
            });

        // Fetch approved reviews from database
        $reviews = Review::where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'author_name' => $review->author_name,
                    'rating' => $review->rating,
                    'content' => $review->content,
                ];
            });

        // Fetch sponsors from page_content (home page)
        $homeContent = PageContent::where('page', 'home')->first();
        $sponsors = $homeContent && $homeContent->sponsors ? $homeContent->sponsors : [];

        return Inertia::render('Index', [
            'trailerUrl' => $trailerUrl,
            'castCrew' => $castCrew,
            'reviews' => $reviews,
            'sponsors' => $sponsors,
            'paid' => Auth::check() ? Auth::user()->hasSuccessfulPayment() : false,
        ]);
    }
}
