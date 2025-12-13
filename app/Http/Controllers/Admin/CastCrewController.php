<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CastCrew;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CastCrewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $members = CastCrew::orderBy('role_type')
            ->orderBy('display_order')
            ->get();

        return Inertia::render('Admin/CastCrew/Index', [
            'members' => $members,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/CastCrew/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'stage_name' => 'required|string|max:255',
            'real_name' => 'nullable|string|max:255',
            'role_type' => 'required|in:cast,crew',
            'job_title' => 'required|string|max:255',
            'image_url' => 'nullable|string',
            'bio' => 'nullable|string',
            'referral_code' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        // Set defaults
        $validated['real_name'] = $validated['real_name'] ?? $validated['stage_name'];
        $validated['display_order'] = $validated['display_order'] ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? true;

        CastCrew::create($validated);

        return redirect()->route('admin.cast-crew.index')->with('success', 'Cast/Crew member added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CastCrew $castCrew)
    {
        return Inertia::render('Admin/CastCrew/Show', [
            'member' => $castCrew,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CastCrew $castCrew)
    {
        return Inertia::render('Admin/CastCrew/Edit', [
            'member' => $castCrew,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CastCrew $castCrew)
    {
        $validated = $request->validate([
            'stage_name' => 'required|string|max:255',
            'real_name' => 'nullable|string|max:255',
            'role_type' => 'required|in:cast,crew',
            'job_title' => 'required|string|max:255',
            'image_url' => 'nullable|string',
            'bio' => 'nullable|string',
            'referral_code' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        // Set defaults
        $validated['real_name'] = $validated['real_name'] ?? $validated['stage_name'];
        $validated['display_order'] = $validated['display_order'] ?? $castCrew->display_order ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? $castCrew->is_active ?? true;

        $castCrew->update($validated);

        return redirect()->route('admin.cast-crew.index')->with('success', 'Cast/Crew member updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CastCrew $castCrew)
    {
        $castCrew->delete();

        return redirect()->route('admin.cast-crew.index')->with('success', 'Cast/Crew member deleted successfully.');
    }
}
