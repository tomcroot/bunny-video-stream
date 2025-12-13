<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\CastCrew;
use App\Models\Gallery;
use App\Models\PageContent;
use App\Models\Review;
use App\Models\SiteSettings;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('display_order')->get();
        $heroBanner = $banners->firstWhere('is_active', true);
        $castCrew = CastCrew::orderBy('display_order')->get();
        $gallery = Gallery::orderBy('display_order')->get();
        $reviews = Review::orderBy('display_order')->get();

        // Try to get page content, but don't fail if column doesn't exist
        try {
            $pageContent = PageContent::where('is_active', true)->latest()->first();
        } catch (\Exception $e) {
            $pageContent = null;
        }

        // Extract sponsors from page content
        $sponsors = $pageContent?->sponsors ?? [];

        $paid = Auth::check() ? Auth::user()->hasSuccessfulPayment() : false;
        $premiereDate = SiteSettings::getSetting('premiere_date', '2025-12-10T06:00:00Z');

        return Inertia::render('Index', [
            'banners' => $banners,
            'heroBanner' => $heroBanner,
            'castCrew' => $castCrew,
            'gallery' => $gallery,
            'reviews' => $reviews,
            'pageContent' => $pageContent,
            'sponsors' => $sponsors,
            'paid' => $paid,
            'premiereDate' => $premiereDate,
            'trailerUrl' => $heroBanner?->trailer_url,
        ]);
    }

    public function information()
    {
        // Fetch the latest movie details from PageContent
        $pageContent = PageContent::where('is_active', true)
            ->latest()
            ->first();

        $reviews = Review::where('is_approved', true)
            ->latest()
            ->get();

        $castCrew = CastCrew::orderBy('display_order')->get();
        $sponsors = $pageContent?->sponsors ?? [];

        return Inertia::render('Information', [
            'pageContent' => $pageContent,
            'reviews' => $reviews,
            'castCrew' => $castCrew,
            'sponsors' => $sponsors,
        ]);
    }

    public function contact()
    {
        return Inertia::render('Contact');
    }

    public function gallery()
    {
        $gallery = Gallery::orderBy('display_order')->get();

        return Inertia::render('Gallery', [
            'gallery' => $gallery,
        ]);
    }

    public function terms()
    {
        return Inertia::render('Terms');
    }
}
