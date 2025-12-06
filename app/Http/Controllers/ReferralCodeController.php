<?php

namespace App\Http\Controllers;

use App\Models\ReferralCode;
use App\Services\ReferralService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReferralCodeController extends Controller
{
    public function __construct(private ReferralService $referralService) {}

    /**
     * Get all active referral codes (public endpoint).
     * GET /api/referral-codes
     */
    public function index(): JsonResponse
    {
        $codes = $this->referralService->getActiveCodesList();

        return response()->json([
            'success' => true,
            'data' => $codes->map(function ($code) {
                return [
                    'code' => $code->code,
                    'description' => $code->description,
                    'discount_percentage' => (float) $code->discount_percentage,
                ];
            }),
        ]);
    }

    /**
     * Validate a referral code and get discount percentage.
     * POST /api/referral-codes/validate
     *
     * Request body:
     * {
     *   "code": "SAVE20"
     * }
     */
    public function validate(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|max:50',
        ]);

        try {
            $discountPercentage = $this->referralService->validateCode($request->input('code'));

            return response()->json([
                'success' => true,
                'discount_percentage' => $discountPercentage,
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or inactive referral code',
            ], 404);
        }
    }

    /**
     * Calculate discount for a given price and code.
     * POST /api/referral-codes/calculate-discount
     *
     * Request body:
     * {
     *   "price": 50.00,
     *   "code": "SAVE20"
     * }
     */
    public function calculateDiscount(Request $request): JsonResponse
    {
        $request->validate([
            'price' => 'required|numeric|min:0.01',
            'code' => 'required|string|max:50',
        ]);

        $discount = $this->referralService->calculateDiscount(
            (float) $request->input('price'),
            $request->input('code')
        );

        return response()->json([
            'success' => true,
            'data' => $discount,
        ]);
    }

    /**
     * Validate referral code and calculate discount (for Inertia/Vue form or AJAX).
     * POST /referral/validate-discount
     */
    public function validateDiscount(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50',
            'price' => 'required|numeric|min:0.01',
        ]);

        $discount = $this->referralService->calculateDiscount(
            (float) $request->input('price'),
            $request->input('code')
        );

        // If AJAX, return JSON
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'data' => $discount,
            ]);
        }

        // Otherwise, redirect back with flash data (for Inertia form)
        return redirect()->back()->with('discount', $discount);
    }

    /**
     * Get statistics for a referral code (admin only).
     * GET /api/referral-codes/{code}/stats
     */
    public function stats(string $code): JsonResponse
    {
        // Authorization check (admin only)
        $this->authorize('viewAdmin', ReferralCode::class);

        try {
            $stats = $this->referralService->getCodeStats($code);

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Referral code not found',
            ], 404);
        }
    }

    /**
     * Create a new referral code (admin only).
     * POST /api/referral-codes
     *
     * Request body:
     * {
     *   "code": "SAVE20",
     *   "discount_percentage": 20,
     *   "description": "20% off for early supporters"
     * }
     */
    public function store(Request $request): JsonResponse
    {
        // Authorization check (admin only)
        $this->authorize('create', ReferralCode::class);

        $validated = $request->validate([
            'code' => 'required|string|unique:referral_codes,code|max:50',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        try {
            $code = $this->referralService->createCode(
                $validated['code'],
                $validated['discount_percentage'],
                auth()->user(),
                $validated['description'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Referral code created successfully',
                'data' => [
                    'id' => $code->id,
                    'code' => $code->code,
                    'discount_percentage' => (float) $code->discount_percentage,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create referral code',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Deactivate a referral code (admin only).
     * PATCH /api/referral-codes/{code}/deactivate
     */
    public function deactivate(string $code): JsonResponse
    {
        // Authorization check (admin only)
        $this->authorize('update', ReferralCode::class);

        try {
            $this->referralService->deactivateCode($code);

            return response()->json([
                'success' => true,
                'message' => 'Referral code deactivated',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Referral code not found',
            ], 404);
        }
    }

    /**
     * Activate a referral code (admin only).
     * PATCH /api/referral-codes/{code}/activate
     */
    public function activate(string $code): JsonResponse
    {
        // Authorization check (admin only)
        $this->authorize('update', ReferralCode::class);

        try {
            $this->referralService->activateCode($code);

            return response()->json([
                'success' => true,
                'message' => 'Referral code activated',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Referral code not found',
            ], 404);
        }
    }
}
