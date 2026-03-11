<?php

namespace App\Http\Controllers;

use App\Models\ReferralCode;
use App\Services\ReferralService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ReferralCodeController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly ReferralService $referralService
    ) {}

    /**
     * Public page: Show all active referral codes (optional UI page)
     */
    public function index(): JsonResponse
    {
        $codes = $this->referralService->getActiveCodesList();

        return response()->json([
            'codes' => $codes->map(fn ($code) => [
                'code' => $code->code,
                'description' => $code->description,
                'discount_percentage' => (float) $code->discount_percentage,
            ]),
        ]);
    }

    /**
     * Validate a referral code (FORM POST from Vue)
     */
    public function validateCode(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
        ]);

        try {
            $discountPercentage = $this->referralService
                ->validateCode($validated['code']);

            return redirect()->back()->with([
                'success' => true,
                'discount_percentage' => $discountPercentage,
            ]);
        } catch (ModelNotFoundException) {
            return redirect()->back()
                ->withErrors(['code' => 'Invalid or inactive referral code'])
                ->withInput();
        }
    }

    /**
     * Alias route compatibility for /api/referral/validate.
     */
    public function validate(Request $request): JsonResponse
    {
        return $this->validateDiscount($request);
    }

    /**
     * Validate a referral code and return JSON for checkout AJAX.
     */
    public function validateDiscount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
        ]);

        try {
            $referralCode = $this->referralService->getCodeByString($validated['code']);

            if (! $referralCode || ! $referralCode->is_active) {
                throw new ModelNotFoundException;
            }

            if (Auth::check() && (int) $referralCode->created_by === (int) Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot use your own referral code.',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            return response()->json([
                'success' => true,
                'code' => $referralCode->code,
                'discount_percentage' => (float) $referralCode->discount_percentage,
                'message' => 'Referral code applied successfully.',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or inactive referral code.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Validate code + calculate discount (Checkout use case)
     */
    public function calculateDiscount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'price' => 'required|numeric|min:0.01',
            'code' => 'required|string|max:50',
        ]);

        try {
            $discount = $this->referralService->calculateDiscount(
                (float) $validated['price'],
                $validated['code']
            );

            return response()->json([
                'discount' => $discount,
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Invalid or inactive referral code',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Admin page: Show referral stats
     */
    public function stats(string $code): JsonResponse
    {
        $referralCode = ReferralCode::whereCode($code)->firstOrFail();
        $this->authorize('viewAdmin', $referralCode);

        $stats = $this->referralService->getCodeStats($code);

        return response()->json([
            'meta' => [
                'analytics_label' => 'admin_referral_analytics',
                'scope' => 'admin',
            ],
            'code' => $referralCode->code,
            'stats' => $stats,
        ]);
    }

    /**
     * Referral link landing endpoint, stores referral code and redirects to checkout.
     */
    public function captureLink(Request $request, string $code)
    {
        $referralCode = $this->referralService->getCodeByString($code);

        if (! $referralCode || ! $referralCode->is_active) {
            return redirect()->route('payment.checkout')
                ->with('error', 'Invalid referral link.');
        }

        if (Auth::check() && (int) $referralCode->created_by === (int) Auth::id()) {
            return redirect()->route('payment.checkout')
                ->with('error', 'You cannot use your own referral link.');
        }

        $request->session()->put('referral_code', $referralCode->code);

        return redirect()->route('payment.checkout', [
            'ref' => $referralCode->code,
            'movieId' => $request->query('movieId', 1),
        ]);
    }

    /**
     * Return current user's referral code and link.
     */
    public function myReferral(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $stats = $this->referralService->getMyReferralStats($user);

        return response()->json([
            'meta' => [
                'analytics_label' => 'user_referral_summary',
                'scope' => 'user',
            ],
            'stats' => $stats,
            ...$stats,
        ]);
    }

    /**
     * Admin: Create referral code
     */
    public function store(Request $request)
    {
        $this->authorize('create', ReferralCode::class);

        $validated = $request->validate([
            'code' => 'required|string|unique:referral_codes,code|max:50',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'description' => 'nullable|string|max:255',
        ]);

        $this->referralService->createCode(
            $validated['code'],
            $validated['discount_percentage'],
            Auth::user(),
            $validated['description'] ?? null
        );

        return redirect()->back()->with('success', 'Referral code created successfully.');
    }

    /**
     * Admin: Deactivate referral code
     */
    public function deactivate(string $code)
    {
        $referralCode = ReferralCode::whereCode($code)->firstOrFail();
        $this->authorize('update', $referralCode);

        $this->referralService->deactivateCode($code);

        return redirect()->back()->with('success', 'Referral code deactivated.');
    }

    /**
     * Admin: Activate referral code
     */
    public function activate(string $code)
    {
        $referralCode = ReferralCode::whereCode($code)->firstOrFail();
        $this->authorize('update', $referralCode);

        $this->referralService->activateCode($code);

        return redirect()->back()->with('success', 'Referral code activated.');
    }
}
