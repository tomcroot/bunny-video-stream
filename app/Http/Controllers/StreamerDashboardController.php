<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StreamerDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Redirect admins to admin dashboard
        if ($user->hasRole('admin')) {
            return redirect('/admin');
        }

        // Get featured content (banners/movies)
        $featured = Banner::where('is_active', true)
            ->orderBy('display_order')
            ->limit(6)
            ->get()
            ->map(fn ($banner) => [
                'id' => $banner->id,
                'title' => $banner->title,
                'description' => $banner->description,
                'image_url' => $banner->image_url,
            ]);

        return Inertia::render('Streamer/Dashboard', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'created_at' => $user->created_at,
            ],
            'featured' => $featured,
        ]);
    }
}
