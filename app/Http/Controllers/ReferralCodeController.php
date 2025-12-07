<?php

namespace App\Http\Controllers;

use App\Models\ReferralCode;
use App\Services\ReferralService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReferralCodeController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly ReferralService $referralService
    ) {}

    /**
     * Public page: Show all active referral codes (optional UI page)
     */
    public function index(): Response
    {
        $codes = $this->referralService->getActiveCodesList();

        return Inertia::render('Referrals/Index', [
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
     * Validate code + calculate discount (Checkout use case)
     */
    public function calculateDiscount(Request $request)
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

            return redirect()->back()->with([
                'discount' => $discount,
            ]);
        } catch (ModelNotFoundException) {
            return redirect()->back()
                ->withErrors(['code' => 'Invalid or inactive referral code'])
                ->withInput();
        }
    }

    /**
     * Admin page: Show referral stats
     */
    public function stats(string $code): Response
    {
        $referralCode = ReferralCode::whereCode($code)->firstOrFail();
        $this->authorize('viewAdmin', $referralCode);

        $stats = $this->referralService->getCodeStats($code);

        return Inertia::render('Admin/Referrals/Stats', [
            'code' => $referralCode->code,
            'stats' => $stats,
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
