<template>
    <Head title="Verify Access - Environment Settings" />

    <AdminLayout>
        <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
            <!-- Header -->
            <div class="mb-8 text-center">
                <div
                    class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
                >
                    <svg
                        class="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </div>
                <h1 class="text-3xl font-bold text-foreground">
                    Developer Access Required
                </h1>
                <p class="mt-2 text-muted-foreground">
                    Environment settings require developer verification to
                    access.
                </p>
            </div>

            <!-- Verification Card -->
            <div class="bg-card rounded-lg shadow-md overflow-hidden">
                <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                    <h2 class="text-xl font-semibold text-white">
                        Verify Your Identity
                    </h2>
                </div>

                <div class="p-6">
                    <!-- Error Message -->
                    <div
                        v-if="errorMessage"
                        class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
                    >
                        {{ errorMessage }}
                    </div>

                    <!-- Success Message -->
                    <div
                        v-if="successMessage"
                        class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md"
                    >
                        {{ successMessage }}
                    </div>

                    <!-- Step 1: Password Verification -->
                    <div v-if="step === 'password'" class="space-y-4">
                        <div>
                            <label
                                class="block text-sm font-medium text-foreground mb-1"
                                >Developer Password</label
                            >
                            <input
                                v-model="password"
                                type="password"
                                placeholder="Enter developer password"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground"
                                @keyup.enter="verifyPassword"
                            />
                        </div>

                        <div class="flex flex-col gap-3">
                            <button
                                @click="verifyPassword"
                                :disabled="isLoading || !password"
                                class="w-full px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span v-if="isLoading">Verifying...</span>
                                <span v-else>Verify Password</span>
                            </button>

                            <div class="relative">
                                <div class="absolute inset-0 flex items-center">
                                    <div
                                        class="w-full border-t border-gray-300"
                                    ></div>
                                </div>
                                <div
                                    class="relative flex justify-center text-sm"
                                >
                                    <span
                                        class="px-2 bg-card text-muted-foreground"
                                        >OTP Disabled</span
                                    >
                                </div>
                            </div>

                            <!-- OTP Button Disabled -->
                            <button
                                disabled
                                class="w-full px-6 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed font-medium transition-colors"
                            >
                                <span>Request OTP via SMS (Disabled)</span>
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: OTP Verification DISABLED -->
                    <!-- <div v-if="step === 'otp'" class="space-y-4">
                        <div class="text-center mb-4">
                            <p class="text-sm text-muted-foreground">
                                An OTP has been sent to
                                <strong>{{ props.devPhone }}</strong>
                            </p>
                            <p class="text-xs text-muted-foreground mt-1">
                                Code expires in 10 minutes
                            </p>
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium text-foreground mb-1"
                                >Enter OTP Code</label
                            >
                            <input
                                v-model="otp"
                                type="text"
                                maxlength="6"
                                placeholder="Enter 6-digit code"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground text-center text-2xl tracking-widest"
                                @keyup.enter="verifyOtp"
                            />
                        </div>

                        <div class="flex flex-col gap-3">
                            <button
                                @click="verifyOtp"
                                :disabled="isLoading || otp.length < 6"
                                class="w-full px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span v-if="isLoading">Verifying...</span>
                                <span v-else>Verify OTP</span>
                            </button>

                            <button
                                @click="step = 'password'"
                                class="w-full px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium transition-colors"
                            >
                                Back to Password
                            </button>

                            <button
                                @click="requestOtp"
                                :disabled="isLoading || cooldown > 0"
                                class="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span v-if="cooldown > 0"
                                    >Resend OTP in {{ cooldown }}s</span
                                >
                                <span v-else>Resend OTP</span>
                            </button>
                        </div>
                    </div>
                    -->
                </div>
            </div>

            <!-- Back Link -->
            <div class="mt-6 text-center">
                <Link
                    href="/admin"
                    class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← Back to Admin Dashboard
                </Link>
            </div>

            <!-- Security Notice -->
            <div
                class="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded"
            >
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg
                            class="h-5 w-5 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-yellow-800">
                            Security Notice
                        </h3>
                        <div class="mt-2 text-sm text-yellow-700">
                            <p>
                                Environment settings contain sensitive
                                application configuration including API keys,
                                database credentials, and service secrets.
                                Access is restricted to authorized developers
                                only.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import { Head, Link, router } from "@inertiajs/vue3";
import AdminLayout from "@/Layouts/AdminLayout.vue";

const props = defineProps({
    devPhone: {
        type: String,
        default: "+233****0000",
    },
});

const step = ref("password");
const password = ref("");
const otp = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const cooldown = ref(0);

let cooldownInterval = null;

const verifyPassword = async () => {
    if (!password.value) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
        await router.post(
            "/admin/env-settings/verify-password",
            {
                password: password.value,
            },
            {
                preserveState: true,
                onSuccess: () => {
                    // If successful, Inertia will redirect to the env-settings page
                },
                onError: (errors) => {
                    errorMessage.value =
                        errors.password || "Verification failed";
                },
                onFinish: () => {
                    isLoading.value = false;
                },
            }
        );
    } catch (e) {
        errorMessage.value = "An error occurred. Please try again.";
        isLoading.value = false;
    }
};

const requestOtp = async () => {
    // OTP DISABLED
    errorMessage.value = "OTP verification has been disabled. Please use password verification only.";
};

/*
const requestOtpOriginal = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    successMessage.value = "";

    try {
        await router.post(
            "/admin/env-settings/send-otp",
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    step.value = "otp";
                    successMessage.value = "OTP sent successfully!";
                    startCooldown();
                },
                onError: (errors) => {
                    errorMessage.value = errors.otp || "Failed to send OTP";
                },
                onFinish: () => {
                    isLoading.value = false;
                },
            }
        );
    } catch (e) {
        errorMessage.value = "An error occurred. Please try again.";
        isLoading.value = false;
    }
};
*/

const verifyOtp = async () => {
    // OTP DISABLED
    errorMessage.value = "OTP verification has been disabled. Please use password verification only.";
};

/*
const verifyOtpOriginal = async () => {
    if (otp.value.length < 6) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
        await router.post(
            "/admin/env-settings/verify-otp",
            {
                otp: otp.value,
            },
            {
                preserveState: true,
                onSuccess: () => {
                    // If successful, Inertia will redirect to the env-settings page
                },
                onError: (errors) => {
                    errorMessage.value = errors.otp || "Invalid or expired OTP";
                },
                onFinish: () => {
                    isLoading.value = false;
                },
            }
        );
    } catch (e) {
        errorMessage.value = "An error occurred. Please try again.";
        isLoading.value = false;
    }
};
*/

const startCooldown = () => {
    cooldown.value = 60;
    if (cooldownInterval) clearInterval(cooldownInterval);
    cooldownInterval = setInterval(() => {
        cooldown.value--;
        if (cooldown.value <= 0) {
            clearInterval(cooldownInterval);
        }
    }, 1000);
};
</script>
