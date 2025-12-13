<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Upload image to local storage
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max
            'folder' => 'nullable|string|in:gallery,cast,banners,posters'
        ]);

        $folder = $request->input('folder', 'uploads');
        $file = $request->file('file');

        // Generate unique filename
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        // Store in public disk
        $path = $file->storeAs("images/{$folder}", $filename, 'public');

        // Return public URL
        $url = Storage::disk('public')->url($path);

        return response()->json([
            'success' => true,
            'url' => $url,
            'path' => $path,
            'filename' => $filename
        ]);
    }

    /**
     * Delete uploaded image
     */
    public function deleteImage(Request $request)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        $path = $request->input('path');

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Image not found'
        ], 404);
    }
}
