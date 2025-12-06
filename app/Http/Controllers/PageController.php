<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\CastCrew;
use App\Models\Gallery;
use App\Models\PageContent;
use App\Models\Review;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('sort_order')->get();
        $castCrew = CastCrew::orderBy('sort_order')->get();
        $gallery = Gallery::orderBy('sort_order')->get();
        $reviews = Review::orderBy('sort_order')->get();
        $pageContent = PageContent::where('page', 'home')->first();
        $paid = auth()->check() ? auth()->user()->hasSuccessfulPayment() : false;

        return Inertia::render('Index', [
            'banners' => $banners,
            'castCrew' => $castCrew,
            'gallery' => $gallery,
            'reviews' => $reviews,
            'pageContent' => $pageContent,
            'paid' => $paid,
        ]);
    }

    public function information()
    {
        $pageContent = PageContent::where('page', 'information')->first();
        $reviews = Review::where('is_approved', true)
            ->latest()
            ->get();

        return Inertia::render('Information', [
            'pageContent' => $pageContent,
            'reviews' => $reviews,
        ]);
    }

    public function contact()
    {
        $pageContent = PageContent::where('page', 'contact')->first();

        return Inertia::render('Contact', [
            'pageContent' => $pageContent,
        ]);
    }

    public function gallery()
    {
        $gallery = Gallery::orderBy('sort_order')->get();
        $pageContent = PageContent::where('page', 'gallery')->first();

        return Inertia::render('Gallery', [
            'gallery' => $gallery,
            'pageContent' => $pageContent,
        ]);
    }

    public function credits()
    {
        $castCrew = CastCrew::orderBy('sort_order')->get();
        $pageContent = PageContent::where('page', 'credits')->first();

        return Inertia::render('Credits', [
            'castCrew' => $castCrew,
            'pageContent' => $pageContent,
        ]);
    }

    public function terms()
    {
        $pageContent = PageContent::where('page', 'terms')->first();

        return Inertia::render('Terms', [
            'pageContent' => $pageContent,
        ]);
    }
}
