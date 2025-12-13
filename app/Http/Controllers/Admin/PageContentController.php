<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $content = PageContent::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/PageContent/Index', [
            'content' => $content,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/PageContent/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'poster' => 'nullable|string',
            'backdrop' => 'nullable|string',
            'synopsis' => 'nullable|string',
            'logline' => 'nullable|string',
            'rating' => 'nullable|string|max:255',
            'runtime' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:4',
            'genres' => 'nullable|array',
            'metadata' => 'nullable|array',
            'sponsors' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        PageContent::create($validated);

        return redirect()->route('admin.page-content.index')->with('success', 'Movie details created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PageContent $pageContent)
    {
        return Inertia::render('Admin/PageContent/Show', [
            'content' => $pageContent,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PageContent $pageContent)
    {
        return Inertia::render('Admin/PageContent/Edit', [
            'content' => $pageContent,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PageContent $pageContent)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'poster' => 'nullable|string',
            'backdrop' => 'nullable|string',
            'synopsis' => 'nullable|string',
            'logline' => 'nullable|string',
            'rating' => 'nullable|string|max:255',
            'runtime' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:4',
            'genres' => 'nullable|array',
            'metadata' => 'nullable|array',
            'sponsors' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $pageContent->update($validated);

        return redirect()->route('admin.page-content.index')->with('success', 'Movie details updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PageContent $pageContent)
    {
        $pageContent->delete();

        return redirect()->route('admin.page-content.index')->with('success', 'Movie details deleted successfully.');
    }
}
