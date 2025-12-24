import { ref, mergeProps, useSSRContext, unref, withCtx, createVNode, createTextVNode, computed, createBlock, openBlock, Fragment, renderList, createCommentVNode, toDisplayString, withModifiers, withDirectives, vModelText, vModelSelect, vModelCheckbox, reactive, vModelDynamic, withKeys, watch, onMounted, onUnmounted, nextTick, defineComponent, renderSlot, resolveComponent, createSSRApp, h as h$1 } from "vue";
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrLooseContain, ssrRenderClass, ssrRenderStyle, ssrRenderSlot, ssrLooseEqual, ssrRenderDynamicModel, ssrGetDynamicModelProps } from "vue/server-renderer";
import { useForm, Link, router, Head, usePage, createInertiaApp } from "@inertiajs/vue3";
import { ArrowLeft, X, Upload, Plus, Edit, BarChart3, Star, Download, Users, CheckCircle, Clock, DollarSign, Search, TrendingUp, Play, Mail, Phone, MapPin } from "lucide-vue-next";
import { cva } from "class-variance-authority";
import { Primitive, Label, useForwardPropsEmits, TabsRoot, TabsContent, TabsList, useForwardProps, TabsTrigger, DialogRoot, DialogClose, DialogOverlay, DialogPortal, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "reka-ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useVModel, reactiveOmit } from "@vueuse/core";
import Hls from "hls.js";
import { renderToString } from "@vue/server-renderer";
import createServer from "@inertiajs/vue3/server";
const _sfc_main$1d = {
  __name: "TwoFactorSettings",
  __ssrInlineRender: true,
  props: {
    userTwoFactorEnabled: Boolean,
    recoveryCodes: Array
  },
  setup(__props) {
    ref(false);
    const showQrCode = ref(false);
    const showConfirmDisable = ref(false);
    const enabling = ref(false);
    const confirming = ref(false);
    const disabling = ref(false);
    const qrCode = ref("");
    const secretKey = ref("");
    const confirmCode = ref("");
    const error = ref("");
    const copiedRecovery = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border px-6 py-8"><div class="max-w-2xl mx-auto"><h1 class="text-3xl font-bold text-foreground">Account Security</h1><p class="text-muted-foreground mt-2">Manage two-factor authentication</p></div></div><div class="max-w-2xl mx-auto px-6 py-8"><div class="bg-card border border-border rounded-lg p-6 mb-6"><div class="flex items-start justify-between"><div><h2 class="text-xl font-semibold text-foreground mb-2">Two-Factor Authentication</h2>`);
      if (!__props.userTwoFactorEnabled) {
        _push(`<p class="text-sm text-muted-foreground"> Add an extra layer of security to your account by enabling two-factor authentication. </p>`);
      } else {
        _push(`<p class="text-sm text-green-600 font-medium"> ✓ Two-factor authentication is enabled on your account. </p>`);
      }
      _push(`</div></div><div class="mt-6">`);
      if (!__props.userTwoFactorEnabled) {
        _push(`<button${ssrIncludeBooleanAttr(enabling.value) ? " disabled" : ""} class="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors">`);
        if (enabling.value) {
          _push(`<span>Setting up...</span>`);
        } else {
          _push(`<span>Enable Two-Factor Auth</span>`);
        }
        _push(`</button>`);
      } else {
        _push(`<button${ssrIncludeBooleanAttr(disabling.value) ? " disabled" : ""} class="px-6 py-3 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 font-medium transition-colors">`);
        if (disabling.value) {
          _push(`<span>Disabling...</span>`);
        } else {
          _push(`<span>Disable Two-Factor Auth</span>`);
        }
        _push(`</button>`);
      }
      _push(`</div></div>`);
      if (showQrCode.value && !__props.userTwoFactorEnabled) {
        _push(`<div class="bg-card border border-border rounded-lg p-6 mb-6"><h3 class="text-lg font-semibold text-foreground mb-4">Set up authenticator app</h3><div class="space-y-4"><p class="text-sm text-muted-foreground"> Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.) </p><div class="flex justify-center p-4 bg-background rounded-lg border border-border">`);
        if (qrCode.value) {
          _push(`<div class="">${qrCode.value ?? ""}</div>`);
        } else {
          _push(`<div class="text-muted-foreground">Loading QR code...</div>`);
        }
        _push(`</div><div><label class="block text-sm font-medium text-foreground mb-2">Or enter this code manually:</label><input${ssrRenderAttr("value", secretKey.value)} readonly class="w-full px-4 py-2 rounded-md bg-background border border-input text-foreground font-mono text-sm"></div><div><label class="block text-sm font-medium text-foreground mb-2">Enter 6-digit code to confirm:</label><input${ssrRenderAttr("value", confirmCode.value)} type="text" inputmode="numeric" maxlength="6" placeholder="000000" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center text-lg tracking-widest">`);
        if (error.value) {
          _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(error.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex gap-3"><button${ssrIncludeBooleanAttr(confirming.value || confirmCode.value.length < 6) ? " disabled" : ""} class="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors">`);
        if (confirming.value) {
          _push(`<span>Confirming...</span>`);
        } else {
          _push(`<span>Confirm &amp; Enable</span>`);
        }
        _push(`</button><button class="flex-1 px-4 py-3 border border-border bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 font-medium transition-colors"> Cancel </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.userTwoFactorEnabled) {
        _push(`<div class="bg-card border border-border rounded-lg p-6"><h3 class="text-lg font-semibold text-foreground mb-4">Recovery Codes</h3><p class="text-sm text-muted-foreground mb-4"> Save these recovery codes in a safe place. Use them if you lose access to your authenticator app. </p><div class="bg-background border border-border rounded-lg p-4 mb-4 font-mono text-sm space-y-2"><!--[-->`);
        ssrRenderList(__props.recoveryCodes, (code, idx) => {
          _push(`<div class="text-foreground">${ssrInterpolate(code)}</div>`);
        });
        _push(`<!--]--></div><button class="px-4 py-2 border border-border rounded-md hover:bg-background text-sm font-medium transition-colors">${ssrInterpolate(copiedRecovery.value ? "✓ Copied" : "Copy Codes")}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showConfirmDisable.value) {
        _push(`<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div class="bg-card border border-border rounded-lg p-6 max-w-sm mx-4"><h3 class="text-lg font-semibold text-foreground mb-2">Disable Two-Factor Auth?</h3><p class="text-sm text-muted-foreground mb-6"> This will reduce your account security. Are you sure? </p><div class="flex gap-3"><button${ssrIncludeBooleanAttr(disabling.value) ? " disabled" : ""} class="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 font-medium transition-colors">`);
        if (disabling.value) {
          _push(`<span>Disabling...</span>`);
        } else {
          _push(`<span>Disable</span>`);
        }
        _push(`</button><button class="flex-1 px-4 py-2 border border-border rounded-md hover:bg-background font-medium transition-colors"> Cancel </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$1d = _sfc_main$1d.setup;
_sfc_main$1d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Account/TwoFactorSettings.vue");
  return _sfc_setup$1d ? _sfc_setup$1d(props, ctx) : void 0;
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1c = {
  __name: "Create",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      title: "",
      message: "",
      trailer_url: "",
      thumbnail_url: "",
      cta_text: "",
      cta_url: "",
      target_date: "",
      display_order: 0,
      is_active: true
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Create Banner</h1><p class="text-muted-foreground">Add a new banner to the homepage</p></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/banners",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Banners `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Banners ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow p-6"><form><div class="space-y-6"><div><label for="title" class="block text-sm font-medium text-foreground mb-2"> Title * </label><input id="title"${ssrRenderAttr("value", unref(form).title)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>`);
      if (unref(form).errors.title) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.title)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="message" class="block text-sm font-medium text-foreground mb-2"> Message </label><textarea id="message" rows="3" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Short copy shown on the hero">${ssrInterpolate(unref(form).message)}</textarea>`);
      if (unref(form).errors.message) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.message)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="trailer_url" class="block text-sm font-medium text-foreground mb-2"> Trailer HLS URL </label><input id="trailer_url"${ssrRenderAttr("value", unref(form).trailer_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://.../playlist.m3u8"><p class="mt-1 text-xs text-muted-foreground">Bunny CDN HLS playlist for the trailer video.</p>`);
      if (unref(form).errors.trailer_url) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.trailer_url)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="thumbnail_url" class="block text-sm font-medium text-foreground mb-2"> Thumbnail Image URL </label><input id="thumbnail_url"${ssrRenderAttr("value", unref(form).thumbnail_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://.../thumb.jpg"><p class="mt-1 text-xs text-muted-foreground">Shown when trailer ends or as fallback.</p>`);
      if (unref(form).errors.thumbnail_url) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.thumbnail_url)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="cta_text" class="block text-sm font-medium text-foreground mb-2"> Button Text </label><input id="cta_text"${ssrRenderAttr("value", unref(form).cta_text)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Watch Now">`);
      if (unref(form).errors.cta_text) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.cta_text)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="cta_url" class="block text-sm font-medium text-foreground mb-2"> Button URL </label><input id="cta_url"${ssrRenderAttr("value", unref(form).cta_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://example.com">`);
      if (unref(form).errors.cta_url) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.cta_url)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="target_date" class="block text-sm font-medium text-foreground mb-2"> Target Date </label><input id="target_date"${ssrRenderAttr("value", unref(form).target_date)} type="datetime-local" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">`);
      if (unref(form).errors.target_date) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.target_date)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="display_order" class="block text-sm font-medium text-foreground mb-2"> Display Order </label><input id="display_order"${ssrRenderAttr("value", unref(form).display_order)} type="number" min="0" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">`);
      if (unref(form).errors.display_order) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.display_order)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center"><input id="is_active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-border rounded"><label for="is_active" class="ml-2 block text-sm text-foreground"> Active </label></div><div class="flex justify-end space-x-4">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/banners",
        class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancel `);
          } else {
            return [
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50">`);
      if (unref(form).processing) {
        _push(`<span>Creating...</span>`);
      } else {
        _push(`<span>Create Banner</span>`);
      }
      _push(`</button></div></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$1c = _sfc_main$1c.setup;
_sfc_main$1c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Banners/Create.vue");
  return _sfc_setup$1c ? _sfc_setup$1c(props, ctx) : void 0;
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1c
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1b = {
  __name: "ImageUpload",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: String, default: "" },
    folder: { type: String, default: "uploads" },
    accept: { type: String, default: "image/jpeg,image/png,image/jpg,image/gif,image/webp" },
    maxSize: { type: Number, default: 10240 },
    // KB
    alt: { type: String, default: "Preview" },
    aspectClass: { type: String, default: "aspect-video" },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "upload-success", "upload-error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(null);
    const previewUrl = ref("");
    const isDragging = ref(false);
    const isUploading = ref(false);
    const uploadProgress = ref(0);
    const error = ref("");
    const maxSizeMB = computed(() => Math.round(props.maxSize / 1024));
    const acceptedFormats = computed(() => {
      const formats = props.accept.split(",").map((f2) => f2.split("/")[1].toUpperCase());
      return formats.join(", ");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
      if (previewUrl.value || __props.modelValue) {
        _push(`<div class="relative"><img${ssrRenderAttr("src", previewUrl.value || __props.modelValue)}${ssrRenderAttr("alt", __props.alt)} class="${ssrRenderClass([__props.aspectClass, "w-full max-w-md rounded-lg border border-border object-cover"])}">`);
        if (previewUrl.value || __props.modelValue && !__props.disabled) {
          _push(`<button type="button" class="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors" title="Remove image">`);
          _push(ssrRenderComponent(unref(X), { class: "h-4 w-4" }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (!previewUrl.value && !__props.modelValue) {
        _push(`<div class="${ssrRenderClass([
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging.value ? "border-primary bg-primary/5" : "border-border hover:border-primary",
          __props.disabled ? "opacity-50 cursor-not-allowed" : ""
        ])}">`);
        _push(ssrRenderComponent(unref(Upload), { class: "h-12 w-12 mx-auto text-muted-foreground mb-4" }, null, _parent));
        _push(`<p class="text-sm text-foreground font-medium mb-1"> Click to upload or drag and drop </p><p class="text-xs text-muted-foreground">${ssrInterpolate(acceptedFormats.value)} (Max ${ssrInterpolate(maxSizeMB.value)}MB) </p><input type="file"${ssrRenderAttr("accept", __props.accept)} class="hidden"${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.modelValue && !previewUrl.value && !__props.disabled) {
        _push(`<div class="flex gap-2"><button type="button" class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm"> Change Image </button><input type="file"${ssrRenderAttr("accept", __props.accept)} class="hidden"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (error.value) {
        _push(`<p class="text-sm text-red-600">${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (isUploading.value) {
        _push(`<div class="space-y-2"><div class="flex items-center justify-between text-sm"><span class="text-muted-foreground">Uploading...</span><span class="text-foreground font-medium">${ssrInterpolate(uploadProgress.value)}%</span></div><div class="w-full bg-secondary rounded-full h-2"><div class="bg-primary h-2 rounded-full transition-all duration-300" style="${ssrRenderStyle({ width: `${uploadProgress.value}%` })}"></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1b = _sfc_main$1b.setup;
_sfc_main$1b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ImageUpload.vue");
  return _sfc_setup$1b ? _sfc_setup$1b(props, ctx) : void 0;
};
const _sfc_main$1a = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    banner: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      title: props.banner.title || "",
      message: props.banner.message || "",
      trailer_url: props.banner.trailer_url || "",
      thumbnail_url: props.banner.thumbnail_url || "",
      cta_text: props.banner.cta_text || "",
      cta_url: props.banner.cta_url || "",
      target_date: props.banner.target_date ? props.banner.target_date.replace(" ", "T") : "",
      display_order: props.banner.display_order || 0,
      is_active: props.banner.is_active ?? true
    });
    const handleUploadSuccess = (data) => {
      form.thumbnail_url = data.url;
    };
    const handleUploadError = (error) => {
      console.error("Upload failed:", error);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Edit Banner</h1><p class="text-muted-foreground">Update banner details</p></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/banners",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Banners `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Banners ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow p-6"><form><div class="space-y-6"><div><label for="title" class="block text-sm font-medium text-foreground mb-2"> Title * </label><input id="title"${ssrRenderAttr("value", unref(form).title)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>`);
      if (unref(form).errors.title) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.title)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="message" class="block text-sm font-medium text-foreground mb-2"> Message </label><textarea id="message" rows="3" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Short copy shown on the hero">${ssrInterpolate(unref(form).message)}</textarea>`);
      if (unref(form).errors.message) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.message)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="trailer_url" class="block text-sm font-medium text-foreground mb-2"> Trailer HLS URL </label><input id="trailer_url"${ssrRenderAttr("value", unref(form).trailer_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://.../playlist.m3u8"><p class="mt-1 text-xs text-muted-foreground">Bunny CDN HLS playlist for the trailer video.</p>`);
      if (unref(form).errors.trailer_url) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.trailer_url)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-foreground mb-2"> Thumbnail Image </label>`);
      _push(ssrRenderComponent(_sfc_main$1b, {
        modelValue: unref(form).thumbnail_url,
        "onUpdate:modelValue": ($event) => unref(form).thumbnail_url = $event,
        folder: "banners",
        alt: "Banner thumbnail",
        onUploadSuccess: handleUploadSuccess,
        onUploadError: handleUploadError
      }, null, _parent));
      _push(`<p class="mt-1 text-xs text-muted-foreground">Shown when trailer ends or as fallback.</p>`);
      if (unref(form).errors.thumbnail_url) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.thumbnail_url)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-1 text-sm text-muted-foreground"> Upload a thumbnail or enter URL manually below. </p><input${ssrRenderAttr("value", unref(form).thumbnail_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2" placeholder="Or paste image URL..."></div><div><label for="cta_text" class="block text-sm font-medium text-foreground mb-2"> Button Text </label><input id="cta_text"${ssrRenderAttr("value", unref(form).cta_text)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Watch Now">`);
      if (unref(form).errors.cta_text) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.cta_text)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="cta_url" class="block text-sm font-medium text-foreground mb-2"> Button URL </label><input id="cta_url"${ssrRenderAttr("value", unref(form).cta_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://example.com">`);
      if (unref(form).errors.cta_url) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.cta_url)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="target_date" class="block text-sm font-medium text-foreground mb-2"> Target Date </label><input id="target_date"${ssrRenderAttr("value", unref(form).target_date)} type="datetime-local" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">`);
      if (unref(form).errors.target_date) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.target_date)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="display_order" class="block text-sm font-medium text-foreground mb-2"> Display Order </label><input id="display_order"${ssrRenderAttr("value", unref(form).display_order)} type="number" min="0" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">`);
      if (unref(form).errors.display_order) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.display_order)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center"><input id="is_active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-border rounded"><label for="is_active" class="ml-2 block text-sm text-foreground"> Active </label></div><div class="flex justify-end space-x-4">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/banners",
        class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancel `);
          } else {
            return [
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50">`);
      if (unref(form).processing) {
        _push(`<span>Updating...</span>`);
      } else {
        _push(`<span>Update Banner</span>`);
      }
      _push(`</button></div></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$1a = _sfc_main$1a.setup;
_sfc_main$1a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Banners/Edit.vue");
  return _sfc_setup$1a ? _sfc_setup$1a(props, ctx) : void 0;
};
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$19 = {
  __name: "AdminLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div class="text-xl font-bold text-foreground">Admin Dashboard</div><nav class="flex items-center space-x-6">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin",
        class: "text-muted-foreground hover:text-foreground font-semibold transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Dashboard`);
          } else {
            return [
              createTextVNode("Dashboard")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/banners",
        class: "text-muted-foreground hover:text-foreground transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Banners`);
          } else {
            return [
              createTextVNode("Banners")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/cast-crew",
        class: "text-muted-foreground hover:text-foreground transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Cast &amp; Crew`);
          } else {
            return [
              createTextVNode("Cast & Crew")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/gallery",
        class: "text-muted-foreground hover:text-foreground transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Gallery`);
          } else {
            return [
              createTextVNode("Gallery")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/reviews",
        class: "text-muted-foreground hover:text-foreground transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Reviews`);
          } else {
            return [
              createTextVNode("Reviews")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/page-content",
        class: "text-muted-foreground hover:text-foreground transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Details`);
          } else {
            return [
              createTextVNode("Details")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/subscribers",
        class: "text-muted-foreground hover:text-foreground transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Subscribers`);
          } else {
            return [
              createTextVNode("Subscribers")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/settings",
        class: "text-muted-foreground hover:text-foreground transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Settings`);
          } else {
            return [
              createTextVNode("Settings")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/logout",
        method: "post",
        as: "button",
        class: "text-red-500 hover:text-red-600 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Logout`);
          } else {
            return [
              createTextVNode("Logout")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div></div></div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
};
const _sfc_setup$19 = _sfc_main$19.setup;
_sfc_main$19.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AdminLayout.vue");
  return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
const _sfc_main$18 = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    banners: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const banners = computed(() => props.banners ?? []);
    const deleteBanner = (id) => {
      if (confirm("Are you sure you want to delete this banner?")) {
        router.delete(`/admin/banners/${id}`);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$19, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-card border-b border-border shadow-sm"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex justify-between items-center py-4"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-foreground"${_scopeId}>Manage Banners</h1><p class="text-muted-foreground"${_scopeId}>Hero banners for the homepage</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/banners/create",
              class: "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Plus), { class: "h-4 w-4 mr-2" }, null, _parent3, _scopeId2));
                  _push3(` Add Banner `);
                } else {
                  return [
                    createVNode(unref(Plus), { class: "h-4 w-4 mr-2" }),
                    createTextVNode(" Add Banner ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"${_scopeId}><div class="bg-card rounded-lg shadow"${_scopeId}><div class="px-6 py-4 border-b border-border"${_scopeId}><h2 class="text-lg font-semibold text-foreground"${_scopeId}>All Banners</h2></div><div class="p-6"${_scopeId}>`);
            if (banners.value.length === 0) {
              _push2(`<div class="text-center py-8"${_scopeId}><p class="text-muted-foreground"${_scopeId}>No banners found. Create your first banner to get started.</p></div>`);
            } else {
              _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
              ssrRenderList(banners.value, (banner) => {
                _push2(`<div class="flex items-center justify-between p-4 border border-border rounded-lg"${_scopeId}><div class="flex items-center space-x-4"${_scopeId}>`);
                if (banner.thumbnail_url) {
                  _push2(`<div class="w-16 h-16 bg-muted rounded overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", banner.thumbnail_url)}${ssrRenderAttr("alt", banner.title)} class="w-full h-full object-cover"${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div${_scopeId}><h3 class="font-medium text-foreground"${_scopeId}>${ssrInterpolate(banner.title)}</h3><p class="text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(banner.message)}</p><div class="flex items-center space-x-2 mt-1"${_scopeId}><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", banner.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"])}"${_scopeId}>${ssrInterpolate(banner.is_active ? "Active" : "Inactive")}</span><span class="text-xs text-muted-foreground"${_scopeId}> Order: ${ssrInterpolate(banner.display_order)}</span>`);
                if (banner.trailer_url) {
                  _push2(`<span class="text-xs text-blue-600"${_scopeId}>Trailer set</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div></div><div class="flex items-center space-x-2"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/admin/banners/${banner.id}`,
                  class: "px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` View `);
                    } else {
                      return [
                        createTextVNode(" View ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/admin/banners/${banner.id}/edit`,
                  class: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Edit `);
                    } else {
                      return [
                        createTextVNode(" Edit ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<button class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"${_scopeId}> Delete </button></div></div>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-card border-b border-border shadow-sm" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex justify-between items-center py-4" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-foreground" }, "Manage Banners"),
                      createVNode("p", { class: "text-muted-foreground" }, "Hero banners for the homepage")
                    ]),
                    createVNode(unref(Link), {
                      href: "/admin/banners/create",
                      class: "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Plus), { class: "h-4 w-4 mr-2" }),
                        createTextVNode(" Add Banner ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }, [
                createVNode("div", { class: "bg-card rounded-lg shadow" }, [
                  createVNode("div", { class: "px-6 py-4 border-b border-border" }, [
                    createVNode("h2", { class: "text-lg font-semibold text-foreground" }, "All Banners")
                  ]),
                  createVNode("div", { class: "p-6" }, [
                    banners.value.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-center py-8"
                    }, [
                      createVNode("p", { class: "text-muted-foreground" }, "No banners found. Create your first banner to get started.")
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "space-y-4"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(banners.value, (banner) => {
                        return openBlock(), createBlock("div", {
                          key: banner.id,
                          class: "flex items-center justify-between p-4 border border-border rounded-lg"
                        }, [
                          createVNode("div", { class: "flex items-center space-x-4" }, [
                            banner.thumbnail_url ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "w-16 h-16 bg-muted rounded overflow-hidden"
                            }, [
                              createVNode("img", {
                                src: banner.thumbnail_url,
                                alt: banner.title,
                                class: "w-full h-full object-cover"
                              }, null, 8, ["src", "alt"])
                            ])) : createCommentVNode("", true),
                            createVNode("div", null, [
                              createVNode("h3", { class: "font-medium text-foreground" }, toDisplayString(banner.title), 1),
                              createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(banner.message), 1),
                              createVNode("div", { class: "flex items-center space-x-2 mt-1" }, [
                                createVNode("span", {
                                  class: ["px-2 py-1 text-xs rounded-full", banner.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"]
                                }, toDisplayString(banner.is_active ? "Active" : "Inactive"), 3),
                                createVNode("span", { class: "text-xs text-muted-foreground" }, " Order: " + toDisplayString(banner.display_order), 1),
                                banner.trailer_url ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "text-xs text-blue-600"
                                }, "Trailer set")) : createCommentVNode("", true)
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "flex items-center space-x-2" }, [
                            createVNode(unref(Link), {
                              href: `/admin/banners/${banner.id}`,
                              class: "px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" View ")
                              ]),
                              _: 1
                            }, 8, ["href"]),
                            createVNode(unref(Link), {
                              href: `/admin/banners/${banner.id}/edit`,
                              class: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Edit ")
                              ]),
                              _: 1
                            }, 8, ["href"]),
                            createVNode("button", {
                              onClick: ($event) => deleteBanner(banner.id),
                              class: "px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            }, " Delete ", 8, ["onClick"])
                          ])
                        ]);
                      }), 128))
                    ]))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$18 = _sfc_main$18.setup;
_sfc_main$18.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Banners/Index.vue");
  return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$18
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$17 = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    banner: Object
  },
  setup(__props) {
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Banner Details</h1><p class="text-muted-foreground">View banner information</p></div><div class="flex space-x-2">`);
      _push(ssrRenderComponent(unref(Link), {
        href: `/admin/banners/${__props.banner.id}/edit`,
        class: "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Edit), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Edit `);
          } else {
            return [
              createVNode(unref(Edit), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Edit ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/banners",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Banners `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Banners ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow overflow-hidden">`);
      if (__props.banner.thumbnail_url) {
        _push(`<div class="w-full h-64 bg-muted"><img${ssrRenderAttr("src", __props.banner.thumbnail_url)}${ssrRenderAttr("alt", __props.banner.title)} class="w-full h-full object-cover"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="p-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h3 class="text-lg font-semibold text-foreground mb-4">Basic Information</h3><dl class="space-y-3"><div><dt class="text-sm font-medium text-muted-foreground">Title</dt><dd class="text-foreground">${ssrInterpolate(__props.banner.title)}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Message</dt><dd class="text-foreground">${ssrInterpolate(__props.banner.message || "No message")}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Status</dt><dd><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", __props.banner.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"])}">${ssrInterpolate(__props.banner.is_active ? "Active" : "Inactive")}</span></dd></div><div><dt class="text-sm font-medium text-muted-foreground">Display Order</dt><dd class="text-foreground">${ssrInterpolate(__props.banner.display_order)}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Target Date</dt><dd class="text-foreground">${ssrInterpolate(__props.banner.target_date || "Not set")}</dd></div></dl></div><div><h3 class="text-lg font-semibold text-foreground mb-4">Call to Action</h3><dl class="space-y-3"><div><dt class="text-sm font-medium text-muted-foreground">Button Text</dt><dd class="text-foreground">${ssrInterpolate(__props.banner.cta_text || "No button text")}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Button URL</dt><dd class="text-foreground">`);
      if (__props.banner.cta_url) {
        _push(`<a${ssrRenderAttr("href", __props.banner.cta_url)} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${ssrInterpolate(__props.banner.cta_url)}</a>`);
      } else {
        _push(`<span>No button URL</span>`);
      }
      _push(`</dd></div></dl></div></div><div class="mt-8 pt-6 border-t border-border"><h3 class="text-lg font-semibold text-foreground mb-4">Media Links</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><dt class="text-sm font-medium text-muted-foreground">Trailer HLS URL</dt><dd class="text-foreground break-words">${ssrInterpolate(__props.banner.trailer_url || "Not set")}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Thumbnail URL</dt><dd class="text-foreground break-words">${ssrInterpolate(__props.banner.thumbnail_url || "Not set")}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Video URL</dt><dd class="text-foreground break-words">${ssrInterpolate(__props.banner.video_url || "Not set")}</dd></div></div></div><div class="mt-8 pt-6 border-t border-border"><h3 class="text-lg font-semibold text-foreground mb-4">Timestamps</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><dt class="text-sm font-medium text-muted-foreground">Created</dt><dd class="text-foreground">${ssrInterpolate(formatDate(__props.banner.created_at))}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Last Updated</dt><dd class="text-foreground">${ssrInterpolate(formatDate(__props.banner.updated_at))}</dd></div></div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup$17 = _sfc_main$17.setup;
_sfc_main$17.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Banners/Show.vue");
  return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$17
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$16 = {
  __name: "Create",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      stage_name: "",
      real_name: "",
      role_type: "",
      job_title: "",
      bio: "",
      image_url: "",
      referral_code: "",
      display_order: 0,
      is_active: true
    });
    const handleUploadSuccess = (data) => {
      form.image_url = data.url;
    };
    const handleUploadError = (error) => {
      console.error("Upload failed:", error);
    };
    const submit = () => {
      form.post("/admin/cast-crew", {
        onSuccess: () => {
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Add Cast/Crew Member" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$19, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-card border-b border-border shadow-sm"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex justify-between items-center py-4"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-foreground"${_scopeId}>Add Cast/Crew Member</h1><p class="text-muted-foreground"${_scopeId}>Add a new cast or crew member</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/cast-crew",
              class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent3, _scopeId2));
                  _push3(` Back to Cast &amp; Crew `);
                } else {
                  return [
                    createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
                    createTextVNode(" Back to Cast & Crew ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"${_scopeId}><div class="bg-card rounded-lg shadow p-6"${_scopeId}><form${_scopeId}><div class="space-y-6"${_scopeId}><div${_scopeId}><label for="stage_name" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Stage Name * </label><input id="stage_name"${ssrRenderAttr("value", unref(form).stage_name)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required${_scopeId}>`);
            if (unref(form).errors.stage_name) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.stage_name)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="real_name" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Real Name </label><input id="real_name"${ssrRenderAttr("value", unref(form).real_name)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Optional - defaults to stage name"${_scopeId}>`);
            if (unref(form).errors.real_name) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.real_name)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="role_type" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Role Type * </label><select id="role_type" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).role_type) ? ssrLooseContain(unref(form).role_type, "") : ssrLooseEqual(unref(form).role_type, "")) ? " selected" : ""}${_scopeId}>Select role type</option><option value="cast"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role_type) ? ssrLooseContain(unref(form).role_type, "cast") : ssrLooseEqual(unref(form).role_type, "cast")) ? " selected" : ""}${_scopeId}>Cast</option><option value="crew"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role_type) ? ssrLooseContain(unref(form).role_type, "crew") : ssrLooseEqual(unref(form).role_type, "crew")) ? " selected" : ""}${_scopeId}>Crew</option></select>`);
            if (unref(form).errors.role_type) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.role_type)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="job_title" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Job Title/Role * </label><input id="job_title"${ssrRenderAttr("value", unref(form).job_title)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., Lead Actor, Director, Producer" required${_scopeId}>`);
            if (unref(form).errors.job_title) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.job_title)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="bio" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Bio </label><textarea id="bio" rows="4" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Brief biography or description"${_scopeId}>${ssrInterpolate(unref(form).bio)}</textarea>`);
            if (unref(form).errors.bio) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.bio)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Profile Photo </label>`);
            _push2(ssrRenderComponent(_sfc_main$1b, {
              modelValue: unref(form).image_url,
              "onUpdate:modelValue": ($event) => unref(form).image_url = $event,
              folder: "cast",
              alt: "Cast/Crew member photo",
              onUploadSuccess: handleUploadSuccess,
              onUploadError: handleUploadError
            }, null, _parent2, _scopeId));
            if (unref(form).errors.image_url) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.image_url)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="mt-1 text-sm text-muted-foreground"${_scopeId}> Upload a photo or enter URL manually below. If left empty, a placeholder will be used. </p><input${ssrRenderAttr("value", unref(form).image_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2" placeholder="Or paste image URL..."${_scopeId}></div><div${_scopeId}><label for="display_order" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Display Order </label><input id="display_order"${ssrRenderAttr("value", unref(form).display_order)} type="number" min="0" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}>`);
            if (unref(form).errors.display_order) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.display_order)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="mt-1 text-sm text-muted-foreground"${_scopeId}> Lower numbers appear first. Leave empty for auto-ordering. </p></div><div class="flex items-center"${_scopeId}><input id="is_active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-border rounded"${_scopeId}><label for="is_active" class="ml-2 block text-sm text-foreground"${_scopeId}> Active (visible on the website) </label></div><div class="flex justify-end space-x-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/cast-crew",
              class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span${_scopeId}>Adding...</span>`);
            } else {
              _push2(`<span${_scopeId}>Add Member</span>`);
            }
            _push2(`</button></div></div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-card border-b border-border shadow-sm" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex justify-between items-center py-4" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-foreground" }, "Add Cast/Crew Member"),
                      createVNode("p", { class: "text-muted-foreground" }, "Add a new cast or crew member")
                    ]),
                    createVNode(unref(Link), {
                      href: "/admin/cast-crew",
                      class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
                        createTextVNode(" Back to Cast & Crew ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }, [
                createVNode("div", { class: "bg-card rounded-lg shadow p-6" }, [
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode("div", { class: "space-y-6" }, [
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "stage_name",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Stage Name * "),
                        withDirectives(createVNode("input", {
                          id: "stage_name",
                          "onUpdate:modelValue": ($event) => unref(form).stage_name = $event,
                          type: "text",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).stage_name]
                        ]),
                        unref(form).errors.stage_name ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.stage_name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "real_name",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Real Name "),
                        withDirectives(createVNode("input", {
                          id: "real_name",
                          "onUpdate:modelValue": ($event) => unref(form).real_name = $event,
                          type: "text",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          placeholder: "Optional - defaults to stage name"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).real_name]
                        ]),
                        unref(form).errors.real_name ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.real_name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "role_type",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Role Type * "),
                        withDirectives(createVNode("select", {
                          id: "role_type",
                          "onUpdate:modelValue": ($event) => unref(form).role_type = $event,
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          required: ""
                        }, [
                          createVNode("option", { value: "" }, "Select role type"),
                          createVNode("option", { value: "cast" }, "Cast"),
                          createVNode("option", { value: "crew" }, "Crew")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, unref(form).role_type]
                        ]),
                        unref(form).errors.role_type ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.role_type), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "job_title",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Job Title/Role * "),
                        withDirectives(createVNode("input", {
                          id: "job_title",
                          "onUpdate:modelValue": ($event) => unref(form).job_title = $event,
                          type: "text",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          placeholder: "e.g., Lead Actor, Director, Producer",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).job_title]
                        ]),
                        unref(form).errors.job_title ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.job_title), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "bio",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Bio "),
                        withDirectives(createVNode("textarea", {
                          id: "bio",
                          "onUpdate:modelValue": ($event) => unref(form).bio = $event,
                          rows: "4",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          placeholder: "Brief biography or description"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).bio]
                        ]),
                        unref(form).errors.bio ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.bio), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-foreground mb-2" }, " Profile Photo "),
                        createVNode(_sfc_main$1b, {
                          modelValue: unref(form).image_url,
                          "onUpdate:modelValue": ($event) => unref(form).image_url = $event,
                          folder: "cast",
                          alt: "Cast/Crew member photo",
                          onUploadSuccess: handleUploadSuccess,
                          onUploadError: handleUploadError
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(form).errors.image_url ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.image_url), 1)) : createCommentVNode("", true),
                        createVNode("p", { class: "mt-1 text-sm text-muted-foreground" }, " Upload a photo or enter URL manually below. If left empty, a placeholder will be used. "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).image_url = $event,
                          type: "url",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2",
                          placeholder: "Or paste image URL..."
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).image_url]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "display_order",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Display Order "),
                        withDirectives(createVNode("input", {
                          id: "display_order",
                          "onUpdate:modelValue": ($event) => unref(form).display_order = $event,
                          type: "number",
                          min: "0",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [
                            vModelText,
                            unref(form).display_order,
                            void 0,
                            { number: true }
                          ]
                        ]),
                        unref(form).errors.display_order ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.display_order), 1)) : createCommentVNode("", true),
                        createVNode("p", { class: "mt-1 text-sm text-muted-foreground" }, " Lower numbers appear first. Leave empty for auto-ordering. ")
                      ]),
                      createVNode("div", { class: "flex items-center" }, [
                        withDirectives(createVNode("input", {
                          id: "is_active",
                          "onUpdate:modelValue": ($event) => unref(form).is_active = $event,
                          type: "checkbox",
                          class: "h-4 w-4 text-primary focus:ring-primary border-border rounded"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).is_active]
                        ]),
                        createVNode("label", {
                          for: "is_active",
                          class: "ml-2 block text-sm text-foreground"
                        }, " Active (visible on the website) ")
                      ]),
                      createVNode("div", { class: "flex justify-end space-x-4" }, [
                        createVNode(unref(Link), {
                          href: "/admin/cast-crew",
                          class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }),
                        createVNode("button", {
                          type: "submit",
                          disabled: unref(form).processing,
                          class: "px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        }, [
                          unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, "Adding...")) : (openBlock(), createBlock("span", { key: 1 }, "Add Member"))
                        ], 8, ["disabled"])
                      ])
                    ])
                  ], 32)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$16 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/CastCrew/Create.vue");
  return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$16
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$15 = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    member: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      stage_name: props.member.stage_name || "",
      real_name: props.member.real_name || "",
      role_type: props.member.role_type || "",
      job_title: props.member.job_title || "",
      bio: props.member.bio || "",
      image_url: props.member.image_url || "",
      referral_code: props.member.referral_code || "",
      display_order: props.member.display_order || 0,
      is_active: props.member.is_active ?? true
    });
    const handleUploadSuccess = (data) => {
      form.image_url = data.url;
    };
    const handleUploadError = (error) => {
      console.error("Upload failed:", error);
    };
    const submit = () => {
      if (!props.member?.id) return;
      form.put(`/admin/cast-crew/${props.member.id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Edit Cast/Crew Member" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$19, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-card border-b border-border shadow-sm"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex justify-between items-center py-4"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-foreground"${_scopeId}>Edit Cast/Crew Member</h1><p class="text-muted-foreground"${_scopeId}>Update member details</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/cast-crew",
              class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent3, _scopeId2));
                  _push3(` Back to Cast &amp; Crew `);
                } else {
                  return [
                    createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
                    createTextVNode(" Back to Cast & Crew ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"${_scopeId}><div class="bg-card rounded-lg shadow p-6"${_scopeId}><form${_scopeId}><div class="space-y-6"${_scopeId}><div${_scopeId}><label for="stage_name" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Stage Name * </label><input id="stage_name"${ssrRenderAttr("value", unref(form).stage_name)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required${_scopeId}>`);
            if (unref(form).errors.stage_name) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.stage_name)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="real_name" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Real Name </label><input id="real_name"${ssrRenderAttr("value", unref(form).real_name)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Optional - defaults to stage name"${_scopeId}>`);
            if (unref(form).errors.real_name) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.real_name)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="role_type" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Role Type * </label><select id="role_type" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).role_type) ? ssrLooseContain(unref(form).role_type, "") : ssrLooseEqual(unref(form).role_type, "")) ? " selected" : ""}${_scopeId}>Select role type</option><option value="cast"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role_type) ? ssrLooseContain(unref(form).role_type, "cast") : ssrLooseEqual(unref(form).role_type, "cast")) ? " selected" : ""}${_scopeId}>Cast</option><option value="crew"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role_type) ? ssrLooseContain(unref(form).role_type, "crew") : ssrLooseEqual(unref(form).role_type, "crew")) ? " selected" : ""}${_scopeId}>Crew</option></select>`);
            if (unref(form).errors.role_type) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.role_type)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="job_title" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Job Title/Role * </label><input id="job_title"${ssrRenderAttr("value", unref(form).job_title)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., Lead Actor, Director, Producer" required${_scopeId}>`);
            if (unref(form).errors.job_title) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.job_title)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="bio" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Bio </label><textarea id="bio" rows="4" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Brief biography or description"${_scopeId}>${ssrInterpolate(unref(form).bio)}</textarea>`);
            if (unref(form).errors.bio) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.bio)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Profile Photo </label>`);
            _push2(ssrRenderComponent(_sfc_main$1b, {
              modelValue: unref(form).image_url,
              "onUpdate:modelValue": ($event) => unref(form).image_url = $event,
              folder: "cast",
              alt: "Cast/Crew member photo",
              onUploadSuccess: handleUploadSuccess,
              onUploadError: handleUploadError
            }, null, _parent2, _scopeId));
            if (unref(form).errors.image_url) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.image_url)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="mt-1 text-sm text-muted-foreground"${_scopeId}> Upload a photo or enter URL manually below. If left empty, a placeholder will be used. </p><input${ssrRenderAttr("value", unref(form).image_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2" placeholder="Or paste image URL..."${_scopeId}></div><div${_scopeId}><label for="display_order" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Display Order </label><input id="display_order"${ssrRenderAttr("value", unref(form).display_order)} type="number" min="0" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}>`);
            if (unref(form).errors.display_order) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.display_order)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="mt-1 text-sm text-muted-foreground"${_scopeId}> Lower numbers appear first. </p></div><div class="flex items-center"${_scopeId}><input id="is_active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-border rounded"${_scopeId}><label for="is_active" class="ml-2 block text-sm text-foreground"${_scopeId}> Active (visible on the website) </label></div><div class="flex justify-end space-x-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/cast-crew",
              class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span${_scopeId}>Updating...</span>`);
            } else {
              _push2(`<span${_scopeId}>Update Member</span>`);
            }
            _push2(`</button></div></div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-card border-b border-border shadow-sm" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex justify-between items-center py-4" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-foreground" }, "Edit Cast/Crew Member"),
                      createVNode("p", { class: "text-muted-foreground" }, "Update member details")
                    ]),
                    createVNode(unref(Link), {
                      href: "/admin/cast-crew",
                      class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
                        createTextVNode(" Back to Cast & Crew ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }, [
                createVNode("div", { class: "bg-card rounded-lg shadow p-6" }, [
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode("div", { class: "space-y-6" }, [
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "stage_name",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Stage Name * "),
                        withDirectives(createVNode("input", {
                          id: "stage_name",
                          "onUpdate:modelValue": ($event) => unref(form).stage_name = $event,
                          type: "text",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).stage_name]
                        ]),
                        unref(form).errors.stage_name ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.stage_name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "real_name",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Real Name "),
                        withDirectives(createVNode("input", {
                          id: "real_name",
                          "onUpdate:modelValue": ($event) => unref(form).real_name = $event,
                          type: "text",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          placeholder: "Optional - defaults to stage name"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).real_name]
                        ]),
                        unref(form).errors.real_name ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.real_name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "role_type",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Role Type * "),
                        withDirectives(createVNode("select", {
                          id: "role_type",
                          "onUpdate:modelValue": ($event) => unref(form).role_type = $event,
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          required: ""
                        }, [
                          createVNode("option", { value: "" }, "Select role type"),
                          createVNode("option", { value: "cast" }, "Cast"),
                          createVNode("option", { value: "crew" }, "Crew")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, unref(form).role_type]
                        ]),
                        unref(form).errors.role_type ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.role_type), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "job_title",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Job Title/Role * "),
                        withDirectives(createVNode("input", {
                          id: "job_title",
                          "onUpdate:modelValue": ($event) => unref(form).job_title = $event,
                          type: "text",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          placeholder: "e.g., Lead Actor, Director, Producer",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).job_title]
                        ]),
                        unref(form).errors.job_title ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.job_title), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "bio",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Bio "),
                        withDirectives(createVNode("textarea", {
                          id: "bio",
                          "onUpdate:modelValue": ($event) => unref(form).bio = $event,
                          rows: "4",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          placeholder: "Brief biography or description"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).bio]
                        ]),
                        unref(form).errors.bio ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.bio), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-foreground mb-2" }, " Profile Photo "),
                        createVNode(_sfc_main$1b, {
                          modelValue: unref(form).image_url,
                          "onUpdate:modelValue": ($event) => unref(form).image_url = $event,
                          folder: "cast",
                          alt: "Cast/Crew member photo",
                          onUploadSuccess: handleUploadSuccess,
                          onUploadError: handleUploadError
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(form).errors.image_url ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.image_url), 1)) : createCommentVNode("", true),
                        createVNode("p", { class: "mt-1 text-sm text-muted-foreground" }, " Upload a photo or enter URL manually below. If left empty, a placeholder will be used. "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).image_url = $event,
                          type: "url",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2",
                          placeholder: "Or paste image URL..."
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).image_url]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "display_order",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Display Order "),
                        withDirectives(createVNode("input", {
                          id: "display_order",
                          "onUpdate:modelValue": ($event) => unref(form).display_order = $event,
                          type: "number",
                          min: "0",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [
                            vModelText,
                            unref(form).display_order,
                            void 0,
                            { number: true }
                          ]
                        ]),
                        unref(form).errors.display_order ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.display_order), 1)) : createCommentVNode("", true),
                        createVNode("p", { class: "mt-1 text-sm text-muted-foreground" }, " Lower numbers appear first. ")
                      ]),
                      createVNode("div", { class: "flex items-center" }, [
                        withDirectives(createVNode("input", {
                          id: "is_active",
                          "onUpdate:modelValue": ($event) => unref(form).is_active = $event,
                          type: "checkbox",
                          class: "h-4 w-4 text-primary focus:ring-primary border-border rounded"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).is_active]
                        ]),
                        createVNode("label", {
                          for: "is_active",
                          class: "ml-2 block text-sm text-foreground"
                        }, " Active (visible on the website) ")
                      ]),
                      createVNode("div", { class: "flex justify-end space-x-4" }, [
                        createVNode(unref(Link), {
                          href: "/admin/cast-crew",
                          class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }),
                        createVNode("button", {
                          type: "submit",
                          disabled: unref(form).processing,
                          class: "px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        }, [
                          unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, "Updating...")) : (openBlock(), createBlock("span", { key: 1 }, "Update Member"))
                        ], 8, ["disabled"])
                      ])
                    ])
                  ], 32)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$15 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/CastCrew/Edit.vue");
  return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$15
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$14 = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    members: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const castCrew = computed(() => props.members ?? []);
    const activeFilter = ref("all");
    const castCount = computed(() => castCrew.value.filter((member) => member.role_type === "cast").length);
    const crewCount = computed(() => castCrew.value.filter((member) => member.role_type === "crew").length);
    const filteredMembers = computed(() => {
      if (activeFilter.value === "all") {
        return castCrew.value;
      }
      return castCrew.value.filter((member) => member.role_type === activeFilter.value);
    });
    const deleteMember = (id) => {
      if (confirm("Are you sure you want to delete this cast/crew member?")) {
        router.delete(`/admin/cast-crew/${id}`);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$19, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-card border-b border-border shadow-sm"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex justify-between items-center py-4"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-foreground"${_scopeId}>Manage Cast &amp; Crew</h1><p class="text-muted-foreground"${_scopeId}>All cast and crew members</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/cast-crew/create",
              class: "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Plus), { class: "h-4 w-4 mr-2" }, null, _parent3, _scopeId2));
                  _push3(` Add Member `);
                } else {
                  return [
                    createVNode(unref(Plus), { class: "h-4 w-4 mr-2" }),
                    createTextVNode(" Add Member ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"${_scopeId}><div class="bg-card rounded-lg shadow"${_scopeId}><div class="px-6 py-4 border-b border-border"${_scopeId}><h2 class="text-lg font-semibold text-foreground"${_scopeId}>Cast &amp; Crew Members</h2></div><div class="p-6"${_scopeId}>`);
            if (castCrew.value.length === 0) {
              _push2(`<div class="text-center py-8"${_scopeId}><p class="text-muted-foreground"${_scopeId}>No cast or crew members found. Add your first member to get started.</p></div>`);
            } else {
              _push2(`<div class="space-y-4"${_scopeId}><div class="flex space-x-4 mb-6"${_scopeId}><button class="${ssrRenderClass(["px-4 py-2 rounded-md text-sm font-medium", activeFilter.value === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"])}"${_scopeId}> All (${ssrInterpolate(castCrew.value.length)}) </button><button class="${ssrRenderClass(["px-4 py-2 rounded-md text-sm font-medium", activeFilter.value === "cast" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"])}"${_scopeId}> Cast (${ssrInterpolate(castCount.value)}) </button><button class="${ssrRenderClass(["px-4 py-2 rounded-md text-sm font-medium", activeFilter.value === "crew" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"])}"${_scopeId}> Crew (${ssrInterpolate(crewCount.value)}) </button></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"${_scopeId}><!--[-->`);
              ssrRenderList(filteredMembers.value, (member) => {
                _push2(`<div class="bg-card border border-border rounded-lg overflow-hidden shadow-sm"${_scopeId}><div class="aspect-square bg-muted"${_scopeId}><img${ssrRenderAttr("src", member.image_url || "/placeholder-avatar.jpg")}${ssrRenderAttr("alt", member.stage_name)} class="w-full h-full object-cover"${_scopeId}></div><div class="p-4"${_scopeId}><div class="flex items-center justify-between mb-2"${_scopeId}><h3 class="font-medium text-foreground"${_scopeId}>${ssrInterpolate(member.stage_name)}</h3><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", member.role_type === "cast" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"])}"${_scopeId}>${ssrInterpolate(member.role_type === "cast" ? "Cast" : "Crew")}</span></div><p class="text-sm text-muted-foreground mb-2"${_scopeId}>${ssrInterpolate(member.job_title)}</p><p class="text-sm text-muted-foreground mb-3 line-clamp-2"${_scopeId}>${ssrInterpolate(member.bio)}</p><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center space-x-2"${_scopeId}><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", member.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"])}"${_scopeId}>${ssrInterpolate(member.is_active ? "Active" : "Inactive")}</span><span class="text-xs text-muted-foreground"${_scopeId}> Order: ${ssrInterpolate(member.display_order)}</span></div></div><div class="flex space-x-2 mt-3"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/admin/cast-crew/${member.id}`,
                  class: "flex-1 px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded text-center hover:bg-secondary/80 transition-colors"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` View `);
                    } else {
                      return [
                        createTextVNode(" View ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/admin/cast-crew/${member.id}/edit`,
                  class: "flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition-colors"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Edit `);
                    } else {
                      return [
                        createTextVNode(" Edit ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div><div class="mt-2"${_scopeId}><button class="w-full px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"${_scopeId}> Delete </button></div></div></div>`);
              });
              _push2(`<!--]--></div></div>`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-card border-b border-border shadow-sm" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex justify-between items-center py-4" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-foreground" }, "Manage Cast & Crew"),
                      createVNode("p", { class: "text-muted-foreground" }, "All cast and crew members")
                    ]),
                    createVNode(unref(Link), {
                      href: "/admin/cast-crew/create",
                      class: "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Plus), { class: "h-4 w-4 mr-2" }),
                        createTextVNode(" Add Member ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }, [
                createVNode("div", { class: "bg-card rounded-lg shadow" }, [
                  createVNode("div", { class: "px-6 py-4 border-b border-border" }, [
                    createVNode("h2", { class: "text-lg font-semibold text-foreground" }, "Cast & Crew Members")
                  ]),
                  createVNode("div", { class: "p-6" }, [
                    castCrew.value.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-center py-8"
                    }, [
                      createVNode("p", { class: "text-muted-foreground" }, "No cast or crew members found. Add your first member to get started.")
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "space-y-4"
                    }, [
                      createVNode("div", { class: "flex space-x-4 mb-6" }, [
                        createVNode("button", {
                          onClick: ($event) => activeFilter.value = "all",
                          class: ["px-4 py-2 rounded-md text-sm font-medium", activeFilter.value === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"]
                        }, " All (" + toDisplayString(castCrew.value.length) + ") ", 11, ["onClick"]),
                        createVNode("button", {
                          onClick: ($event) => activeFilter.value = "cast",
                          class: ["px-4 py-2 rounded-md text-sm font-medium", activeFilter.value === "cast" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"]
                        }, " Cast (" + toDisplayString(castCount.value) + ") ", 11, ["onClick"]),
                        createVNode("button", {
                          onClick: ($event) => activeFilter.value = "crew",
                          class: ["px-4 py-2 rounded-md text-sm font-medium", activeFilter.value === "crew" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"]
                        }, " Crew (" + toDisplayString(crewCount.value) + ") ", 11, ["onClick"])
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(filteredMembers.value, (member) => {
                          return openBlock(), createBlock("div", {
                            key: member.id,
                            class: "bg-card border border-border rounded-lg overflow-hidden shadow-sm"
                          }, [
                            createVNode("div", { class: "aspect-square bg-muted" }, [
                              createVNode("img", {
                                src: member.image_url || "/placeholder-avatar.jpg",
                                alt: member.stage_name,
                                class: "w-full h-full object-cover"
                              }, null, 8, ["src", "alt"])
                            ]),
                            createVNode("div", { class: "p-4" }, [
                              createVNode("div", { class: "flex items-center justify-between mb-2" }, [
                                createVNode("h3", { class: "font-medium text-foreground" }, toDisplayString(member.stage_name), 1),
                                createVNode("span", {
                                  class: ["px-2 py-1 text-xs rounded-full", member.role_type === "cast" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"]
                                }, toDisplayString(member.role_type === "cast" ? "Cast" : "Crew"), 3)
                              ]),
                              createVNode("p", { class: "text-sm text-muted-foreground mb-2" }, toDisplayString(member.job_title), 1),
                              createVNode("p", { class: "text-sm text-muted-foreground mb-3 line-clamp-2" }, toDisplayString(member.bio), 1),
                              createVNode("div", { class: "flex items-center justify-between" }, [
                                createVNode("div", { class: "flex items-center space-x-2" }, [
                                  createVNode("span", {
                                    class: ["px-2 py-1 text-xs rounded-full", member.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"]
                                  }, toDisplayString(member.is_active ? "Active" : "Inactive"), 3),
                                  createVNode("span", { class: "text-xs text-muted-foreground" }, " Order: " + toDisplayString(member.display_order), 1)
                                ])
                              ]),
                              createVNode("div", { class: "flex space-x-2 mt-3" }, [
                                createVNode(unref(Link), {
                                  href: `/admin/cast-crew/${member.id}`,
                                  class: "flex-1 px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded text-center hover:bg-secondary/80 transition-colors"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" View ")
                                  ]),
                                  _: 1
                                }, 8, ["href"]),
                                createVNode(unref(Link), {
                                  href: `/admin/cast-crew/${member.id}/edit`,
                                  class: "flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition-colors"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Edit ")
                                  ]),
                                  _: 1
                                }, 8, ["href"])
                              ]),
                              createVNode("div", { class: "mt-2" }, [
                                createVNode("button", {
                                  onClick: ($event) => deleteMember(member.id),
                                  class: "w-full px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                }, " Delete ", 8, ["onClick"])
                              ])
                            ])
                          ]);
                        }), 128))
                      ])
                    ]))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$14 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/CastCrew/Index.vue");
  return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$14
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$13 = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    member: Object
  },
  setup(__props) {
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Cast/Crew Member Details</h1><p class="text-muted-foreground">View member information</p></div><div class="flex space-x-2">`);
      _push(ssrRenderComponent(unref(Link), {
        href: `/admin/cast-crew/${__props.member.id}/edit`,
        class: "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Edit), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Edit `);
          } else {
            return [
              createVNode(unref(Edit), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Edit ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/cast-crew",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Cast &amp; Crew `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Cast & Crew ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow overflow-hidden"><div class="w-full h-96 bg-muted"><img${ssrRenderAttr("src", __props.member.photo_url || "/placeholder-avatar.jpg")}${ssrRenderAttr("alt", __props.member.name)} class="w-full h-full object-cover"></div><div class="p-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h3 class="text-lg font-semibold text-foreground mb-4">Member Information</h3><dl class="space-y-3"><div><dt class="text-sm font-medium text-muted-foreground">Name</dt><dd class="text-foreground">${ssrInterpolate(_ctx.castCrew.name)}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Role Type</dt><dd><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", _ctx.castCrew.role_type === "cast" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"])}">${ssrInterpolate(_ctx.castCrew.role_type === "cast" ? "Cast" : "Crew")}</span></dd></div><div><dt class="text-sm font-medium text-muted-foreground">Role/Position</dt><dd class="text-foreground">${ssrInterpolate(_ctx.castCrew.role)}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Bio</dt><dd class="text-foreground">${ssrInterpolate(_ctx.castCrew.bio || "No bio available")}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Status</dt><dd><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", _ctx.castCrew.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"])}">${ssrInterpolate(_ctx.castCrew.is_active ? "Active" : "Inactive")}</span></dd></div><div><dt class="text-sm font-medium text-muted-foreground">Display Order</dt><dd class="text-foreground">${ssrInterpolate(_ctx.castCrew.display_order)}</dd></div></dl></div><div><h3 class="text-lg font-semibold text-foreground mb-4">Photo Details</h3><dl class="space-y-3"><div><dt class="text-sm font-medium text-muted-foreground">Photo URL</dt><dd class="text-foreground break-all">`);
      if (_ctx.castCrew.photo_url) {
        _push(`<a${ssrRenderAttr("href", _ctx.castCrew.photo_url)} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${ssrInterpolate(_ctx.castCrew.photo_url)}</a>`);
      } else {
        _push(`<span class="text-muted-foreground">No photo URL</span>`);
      }
      _push(`</dd></div></dl></div></div><div class="mt-8 pt-6 border-t border-border"><h3 class="text-lg font-semibold text-foreground mb-4">Timestamps</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><dt class="text-sm font-medium text-muted-foreground">Created</dt><dd class="text-foreground">${ssrInterpolate(formatDate(_ctx.castCrew.created_at))}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Last Updated</dt><dd class="text-foreground">${ssrInterpolate(formatDate(_ctx.castCrew.updated_at))}</dd></div></div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup$13 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/CastCrew/Show.vue");
  return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$13
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$12 = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: {
    metrics: {
      type: Object,
      default: () => ({
        totalUsers: 0,
        totalRevenue: "0",
        completedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0
      })
    },
    recentPayments: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const metrics = computed(() => props.metrics ?? {
      totalUsers: 0,
      totalRevenue: "0",
      completedPayments: 0,
      pendingPayments: 0,
      failedPayments: 0
    });
    const recentPayments = computed(() => props.recentPayments ?? []);
    const getStatusClass = (status) => {
      const classes = {
        "completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        "pending": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        "failed": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        "initialized": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      };
      return classes[status] || classes["initialized"];
    };
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div class="text-xl font-bold text-foreground">Admin Dashboard</div><nav class="flex items-center space-x-6"><a href="/admin" class="text-muted-foreground hover:text-foreground font-semibold transition-colors">Dashboard</a><a href="/admin/banners" class="text-muted-foreground hover:text-foreground transition-colors">Banners</a><a href="/admin/cast-crew" class="text-muted-foreground hover:text-foreground transition-colors">Cast &amp; Crew</a><a href="/admin/gallery" class="text-muted-foreground hover:text-foreground transition-colors">Gallery</a><a href="/admin/reviews" class="text-muted-foreground hover:text-foreground transition-colors">Reviews</a><a href="/admin/page-content" class="text-muted-foreground hover:text-foreground transition-colors">Content</a><form method="POST" action="/logout" class="inline"><button type="submit" class="text-red-500 hover:text-red-600 transition-colors">Logout</button></form></nav></div></div></div><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="mb-12"><h1 class="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1><p class="text-muted-foreground">Overview of key metrics and analytics</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"><div class="bg-card border border-border rounded-lg p-6 shadow-lg"><p class="text-sm text-muted-foreground mb-2">Total Users</p><p class="text-3xl font-bold text-foreground">${ssrInterpolate(metrics.value.totalUsers)}</p></div><div class="bg-card border border-border rounded-lg p-6 shadow-lg"><p class="text-sm text-muted-foreground mb-2">Total Revenue</p><p class="text-3xl font-bold text-foreground">₵${ssrInterpolate(metrics.value.totalRevenue)}</p></div><div class="bg-card border border-border rounded-lg p-6 shadow-lg"><p class="text-sm text-muted-foreground mb-2">Completed Payments</p><p class="text-3xl font-bold text-green-500">${ssrInterpolate(metrics.value.completedPayments)}</p></div><div class="bg-card border border-border rounded-lg p-6 shadow-lg"><p class="text-sm text-muted-foreground mb-2">Pending Payments</p><p class="text-3xl font-bold text-yellow-500">${ssrInterpolate(metrics.value.pendingPayments)}</p></div></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"><div class="lg:col-span-2 bg-card border border-border rounded-lg p-6 shadow-lg"><h2 class="text-xl font-semibold text-foreground mb-6">Recent Transactions</h2>`);
      if (recentPayments.value.length === 0) {
        _push(`<div class="py-8 text-center text-muted-foreground"><p>No transactions yet.</p></div>`);
      } else {
        _push(`<div class="overflow-x-auto"><table class="w-full text-sm"><thead class="border-b border-border"><tr><th class="px-4 py-3 text-left font-semibold">User</th><th class="px-4 py-3 text-left font-semibold">Amount</th><th class="px-4 py-3 text-left font-semibold">Status</th><th class="px-4 py-3 text-left font-semibold">Date</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(recentPayments.value.slice(0, 5), (payment) => {
          _push(`<tr class="border-b border-border hover:bg-muted/50 transition-colors"><td class="px-4 py-3">${ssrInterpolate(payment.user?.name || "User #" + payment.user_id)}</td><td class="px-4 py-3 font-semibold">₵${ssrInterpolate((payment.amount / 100).toFixed(2))}</td><td class="px-4 py-3"><span class="${ssrRenderClass([getStatusClass(payment.status), "px-2 py-1 rounded text-xs font-medium"])}">${ssrInterpolate(payment.status)}</span></td><td class="px-4 py-3 text-xs text-muted-foreground">${ssrInterpolate(formatDate(payment.created_at))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(`</div><div class="bg-card border border-border rounded-lg p-6 shadow-lg"><h2 class="text-lg font-semibold text-foreground mb-4">Payment Status</h2><div class="space-y-4"><div class="flex items-center justify-between pb-3 border-b border-border"><span class="text-sm text-muted-foreground">Completed</span><span class="font-semibold text-green-500">${ssrInterpolate(metrics.value.completedPayments)}</span></div><div class="flex items-center justify-between pb-3 border-b border-border"><span class="text-sm text-muted-foreground">Pending</span><span class="font-semibold text-yellow-500">${ssrInterpolate(metrics.value.pendingPayments)}</span></div><div class="flex items-center justify-between"><span class="text-sm text-muted-foreground">Failed</span><span class="font-semibold text-red-500">${ssrInterpolate(metrics.value.failedPayments)}</span></div></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><a href="/admin/banners" class="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow"><h2 class="text-2xl font-semibold text-foreground mb-2">Banners</h2><p class="text-muted-foreground">Manage hero banners and promotional content</p></a><a href="/admin/cast-crew" class="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow"><h2 class="text-2xl font-semibold text-foreground mb-2">Cast &amp; Crew</h2><p class="text-muted-foreground">Manage cast members and crew information</p></a><a href="/admin/gallery" class="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow"><h2 class="text-2xl font-semibold text-foreground mb-2">Gallery</h2><p class="text-muted-foreground">Upload and manage gallery images</p></a><a href="/admin/reviews" class="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow"><h2 class="text-2xl font-semibold text-foreground mb-2">Reviews</h2><p class="text-muted-foreground">Moderate and approve user reviews</p></a><a href="/admin/page-content" class="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow"><h2 class="text-2xl font-semibold text-foreground mb-2">Page Content</h2><p class="text-muted-foreground">Edit page sections and content</p></a></div></div></div>`);
    };
  }
};
const _sfc_setup$12 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Dashboard.vue");
  return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$12
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$11 = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    recipients: { type: Array, default: () => [] },
    stats: { type: Object, default: () => ({ total_recipients: 0 }) }
  },
  setup(__props) {
    const props = __props;
    const selected = ref([]);
    const bulkForm = useForm({
      user_ids: [],
      subject: "",
      html_content: "",
      text_content: ""
    });
    const promoForm = useForm({
      subject: "",
      html_content: "",
      text_content: ""
    });
    const testForm = useForm({
      email: "",
      subject: "",
      html_content: "",
      text_content: ""
    });
    const allSelected = computed(() => props.recipients.length > 0 && selected.value.length === props.recipients.length);
    const toggleAll = (checked) => {
      selected.value = checked ? props.recipients.map((r2) => r2.id) : [];
    };
    const toggleRecipient = (id, checked) => {
      if (checked) {
        if (!selected.value.includes(id)) selected.value.push(id);
      } else {
        selected.value = selected.value.filter((x) => x !== id);
      }
    };
    const submitBulk = () => {
      bulkForm.user_ids = selected.value;
      bulkForm.post(route("admin.email.bulk"), {
        onSuccess: () => {
          selected.value = [];
          bulkForm.reset();
        }
      });
    };
    const submitPromo = () => {
      promoForm.post(route("admin.email.promotional-campaign"), {
        onSuccess: () => promoForm.reset()
      });
    };
    const submitTest = () => {
      testForm.post(route("admin.email.test"), {
        onSuccess: () => testForm.reset()
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$19, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-6xl mx-auto py-10 space-y-8"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Head), { title: "Email Management" }, null, _parent2, _scopeId));
            _push2(`<header${_scopeId}><h1 class="text-3xl font-bold"${_scopeId}>Email Management</h1><p class="text-muted-foreground"${_scopeId}>Send bulk, campaign, and test emails.</p></header><section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"${_scopeId}><div class="bg-card border border-border rounded-lg p-4"${_scopeId}><p class="text-sm text-muted-foreground"${_scopeId}>Total recipients</p><p class="text-3xl font-bold"${_scopeId}>${ssrInterpolate(__props.stats.total_recipients ?? 0)}</p></div></section><section class="grid gap-6 lg:grid-cols-2"${_scopeId}><div class="bg-card border border-border rounded-lg p-6 space-y-4"${_scopeId}><div${_scopeId}><h2 class="text-xl font-semibold"${_scopeId}>Bulk Email</h2><p class="text-muted-foreground text-sm"${_scopeId}>Send to selected users</p></div><div class="space-y-2"${_scopeId}><div class="flex items-center space-x-2"${_scopeId}><input id="select-all" type="checkbox"${ssrIncludeBooleanAttr(allSelected.value) ? " checked" : ""}${_scopeId}><label for="select-all" class="text-sm"${_scopeId}>Select all (${ssrInterpolate(__props.recipients.length)})</label><span class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(selected.value.length)} selected</span></div><div class="max-h-48 overflow-y-auto border rounded p-2 space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.recipients, (user) => {
              _push2(`<div class="flex items-center space-x-2"${_scopeId}><input${ssrRenderAttr("id", `user-${user.id}`)} type="checkbox"${ssrIncludeBooleanAttr(selected.value.includes(user.id)) ? " checked" : ""}${_scopeId}><label${ssrRenderAttr("for", `user-${user.id}`)} class="text-sm"${_scopeId}>${ssrInterpolate(user.name)} (${ssrInterpolate(user.email)})</label></div>`);
            });
            _push2(`<!--]-->`);
            if (__props.recipients.length === 0) {
              _push2(`<p class="text-sm text-muted-foreground"${_scopeId}>No recipients available.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><form class="space-y-3"${_scopeId}><div${_scopeId}><label class="text-sm font-medium" for="bulk-subject"${_scopeId}>Subject</label><input id="bulk-subject"${ssrRenderAttr("value", unref(bulkForm).subject)} class="w-full border rounded px-3 py-2" required${_scopeId}></div><div${_scopeId}><label class="text-sm font-medium" for="bulk-html"${_scopeId}>HTML Content</label><textarea id="bulk-html" rows="4" class="w-full border rounded px-3 py-2" required${_scopeId}>${ssrInterpolate(unref(bulkForm).html_content)}</textarea></div><div${_scopeId}><label class="text-sm font-medium" for="bulk-text"${_scopeId}>Plain Text (optional)</label><textarea id="bulk-text" rows="3" class="w-full border rounded px-3 py-2"${_scopeId}>${ssrInterpolate(unref(bulkForm).text_content)}</textarea></div><button type="submit" class="w-full bg-primary text-primary-foreground rounded px-4 py-2"${ssrIncludeBooleanAttr(selected.value.length === 0 || unref(bulkForm).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(bulkForm).processing ? "Sending…" : "Send Bulk Email")}</button></form></div><div class="bg-card border border-border rounded-lg p-6 space-y-4"${_scopeId}><div${_scopeId}><h2 class="text-xl font-semibold"${_scopeId}>Promotional Campaign</h2><p class="text-muted-foreground text-sm"${_scopeId}>Send to all recipients</p></div><form class="space-y-3"${_scopeId}><div${_scopeId}><label class="text-sm font-medium" for="promo-subject"${_scopeId}>Subject</label><input id="promo-subject"${ssrRenderAttr("value", unref(promoForm).subject)} class="w-full border rounded px-3 py-2" required${_scopeId}></div><div${_scopeId}><label class="text-sm font-medium" for="promo-html"${_scopeId}>HTML Content</label><textarea id="promo-html" rows="5" class="w-full border rounded px-3 py-2" required${_scopeId}>${ssrInterpolate(unref(promoForm).html_content)}</textarea></div><div${_scopeId}><label class="text-sm font-medium" for="promo-text"${_scopeId}>Plain Text (optional)</label><textarea id="promo-text" rows="3" class="w-full border rounded px-3 py-2"${_scopeId}>${ssrInterpolate(unref(promoForm).text_content)}</textarea></div><button type="submit" class="w-full bg-primary text-primary-foreground rounded px-4 py-2"${ssrIncludeBooleanAttr(unref(promoForm).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(promoForm).processing ? "Sending…" : "Send Campaign to All")}</button></form></div></section><section class="bg-card border border-border rounded-lg p-6 space-y-4"${_scopeId}><div${_scopeId}><h2 class="text-xl font-semibold"${_scopeId}>Send Test Email</h2><p class="text-muted-foreground text-sm"${_scopeId}>Send a single test to verify delivery</p></div><form class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-sm font-medium" for="test-email"${_scopeId}>Email</label><input id="test-email" type="email"${ssrRenderAttr("value", unref(testForm).email)} class="w-full border rounded px-3 py-2" required${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-sm font-medium" for="test-subject"${_scopeId}>Subject</label><input id="test-subject"${ssrRenderAttr("value", unref(testForm).subject)} class="w-full border rounded px-3 py-2" required${_scopeId}></div><div class="space-y-2 md:col-span-2"${_scopeId}><label class="text-sm font-medium" for="test-html"${_scopeId}>HTML Content</label><textarea id="test-html" rows="4" class="w-full border rounded px-3 py-2" required${_scopeId}>${ssrInterpolate(unref(testForm).html_content)}</textarea></div><div class="space-y-2 md:col-span-2"${_scopeId}><label class="text-sm font-medium" for="test-text"${_scopeId}>Plain Text (optional)</label><textarea id="test-text" rows="3" class="w-full border rounded px-3 py-2"${_scopeId}>${ssrInterpolate(unref(testForm).text_content)}</textarea></div><button type="submit" class="bg-primary text-primary-foreground rounded px-4 py-2 md:col-span-2"${ssrIncludeBooleanAttr(unref(testForm).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(testForm).processing ? "Sending…" : "Send Test Email")}</button></form></section></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-6xl mx-auto py-10 space-y-8" }, [
                createVNode(unref(Head), { title: "Email Management" }),
                createVNode("header", null, [
                  createVNode("h1", { class: "text-3xl font-bold" }, "Email Management"),
                  createVNode("p", { class: "text-muted-foreground" }, "Send bulk, campaign, and test emails.")
                ]),
                createVNode("section", { class: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" }, [
                  createVNode("div", { class: "bg-card border border-border rounded-lg p-4" }, [
                    createVNode("p", { class: "text-sm text-muted-foreground" }, "Total recipients"),
                    createVNode("p", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_recipients ?? 0), 1)
                  ])
                ]),
                createVNode("section", { class: "grid gap-6 lg:grid-cols-2" }, [
                  createVNode("div", { class: "bg-card border border-border rounded-lg p-6 space-y-4" }, [
                    createVNode("div", null, [
                      createVNode("h2", { class: "text-xl font-semibold" }, "Bulk Email"),
                      createVNode("p", { class: "text-muted-foreground text-sm" }, "Send to selected users")
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode("div", { class: "flex items-center space-x-2" }, [
                        createVNode("input", {
                          id: "select-all",
                          type: "checkbox",
                          checked: allSelected.value,
                          onChange: (e2) => toggleAll(e2.target.checked)
                        }, null, 40, ["checked", "onChange"]),
                        createVNode("label", {
                          for: "select-all",
                          class: "text-sm"
                        }, "Select all (" + toDisplayString(__props.recipients.length) + ")", 1),
                        createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(selected.value.length) + " selected", 1)
                      ]),
                      createVNode("div", { class: "max-h-48 overflow-y-auto border rounded p-2 space-y-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.recipients, (user) => {
                          return openBlock(), createBlock("div", {
                            key: user.id,
                            class: "flex items-center space-x-2"
                          }, [
                            createVNode("input", {
                              id: `user-${user.id}`,
                              type: "checkbox",
                              checked: selected.value.includes(user.id),
                              onChange: (e2) => toggleRecipient(user.id, e2.target.checked)
                            }, null, 40, ["id", "checked", "onChange"]),
                            createVNode("label", {
                              for: `user-${user.id}`,
                              class: "text-sm"
                            }, toDisplayString(user.name) + " (" + toDisplayString(user.email) + ")", 9, ["for"])
                          ]);
                        }), 128)),
                        __props.recipients.length === 0 ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-muted-foreground"
                        }, "No recipients available.")) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("form", {
                      class: "space-y-3",
                      onSubmit: withModifiers(submitBulk, ["prevent"])
                    }, [
                      createVNode("div", null, [
                        createVNode("label", {
                          class: "text-sm font-medium",
                          for: "bulk-subject"
                        }, "Subject"),
                        withDirectives(createVNode("input", {
                          id: "bulk-subject",
                          "onUpdate:modelValue": ($event) => unref(bulkForm).subject = $event,
                          class: "w-full border rounded px-3 py-2",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(bulkForm).subject]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          class: "text-sm font-medium",
                          for: "bulk-html"
                        }, "HTML Content"),
                        withDirectives(createVNode("textarea", {
                          id: "bulk-html",
                          "onUpdate:modelValue": ($event) => unref(bulkForm).html_content = $event,
                          rows: "4",
                          class: "w-full border rounded px-3 py-2",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(bulkForm).html_content]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          class: "text-sm font-medium",
                          for: "bulk-text"
                        }, "Plain Text (optional)"),
                        withDirectives(createVNode("textarea", {
                          id: "bulk-text",
                          "onUpdate:modelValue": ($event) => unref(bulkForm).text_content = $event,
                          rows: "3",
                          class: "w-full border rounded px-3 py-2"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(bulkForm).text_content]
                        ])
                      ]),
                      createVNode("button", {
                        type: "submit",
                        class: "w-full bg-primary text-primary-foreground rounded px-4 py-2",
                        disabled: selected.value.length === 0 || unref(bulkForm).processing
                      }, toDisplayString(unref(bulkForm).processing ? "Sending…" : "Send Bulk Email"), 9, ["disabled"])
                    ], 32)
                  ]),
                  createVNode("div", { class: "bg-card border border-border rounded-lg p-6 space-y-4" }, [
                    createVNode("div", null, [
                      createVNode("h2", { class: "text-xl font-semibold" }, "Promotional Campaign"),
                      createVNode("p", { class: "text-muted-foreground text-sm" }, "Send to all recipients")
                    ]),
                    createVNode("form", {
                      class: "space-y-3",
                      onSubmit: withModifiers(submitPromo, ["prevent"])
                    }, [
                      createVNode("div", null, [
                        createVNode("label", {
                          class: "text-sm font-medium",
                          for: "promo-subject"
                        }, "Subject"),
                        withDirectives(createVNode("input", {
                          id: "promo-subject",
                          "onUpdate:modelValue": ($event) => unref(promoForm).subject = $event,
                          class: "w-full border rounded px-3 py-2",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(promoForm).subject]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          class: "text-sm font-medium",
                          for: "promo-html"
                        }, "HTML Content"),
                        withDirectives(createVNode("textarea", {
                          id: "promo-html",
                          "onUpdate:modelValue": ($event) => unref(promoForm).html_content = $event,
                          rows: "5",
                          class: "w-full border rounded px-3 py-2",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(promoForm).html_content]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          class: "text-sm font-medium",
                          for: "promo-text"
                        }, "Plain Text (optional)"),
                        withDirectives(createVNode("textarea", {
                          id: "promo-text",
                          "onUpdate:modelValue": ($event) => unref(promoForm).text_content = $event,
                          rows: "3",
                          class: "w-full border rounded px-3 py-2"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(promoForm).text_content]
                        ])
                      ]),
                      createVNode("button", {
                        type: "submit",
                        class: "w-full bg-primary text-primary-foreground rounded px-4 py-2",
                        disabled: unref(promoForm).processing
                      }, toDisplayString(unref(promoForm).processing ? "Sending…" : "Send Campaign to All"), 9, ["disabled"])
                    ], 32)
                  ])
                ]),
                createVNode("section", { class: "bg-card border border-border rounded-lg p-6 space-y-4" }, [
                  createVNode("div", null, [
                    createVNode("h2", { class: "text-xl font-semibold" }, "Send Test Email"),
                    createVNode("p", { class: "text-muted-foreground text-sm" }, "Send a single test to verify delivery")
                  ]),
                  createVNode("form", {
                    class: "grid gap-4 md:grid-cols-2",
                    onSubmit: withModifiers(submitTest, ["prevent"])
                  }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode("label", {
                        class: "text-sm font-medium",
                        for: "test-email"
                      }, "Email"),
                      withDirectives(createVNode("input", {
                        id: "test-email",
                        type: "email",
                        "onUpdate:modelValue": ($event) => unref(testForm).email = $event,
                        class: "w-full border rounded px-3 py-2",
                        required: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(testForm).email]
                      ])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode("label", {
                        class: "text-sm font-medium",
                        for: "test-subject"
                      }, "Subject"),
                      withDirectives(createVNode("input", {
                        id: "test-subject",
                        "onUpdate:modelValue": ($event) => unref(testForm).subject = $event,
                        class: "w-full border rounded px-3 py-2",
                        required: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(testForm).subject]
                      ])
                    ]),
                    createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                      createVNode("label", {
                        class: "text-sm font-medium",
                        for: "test-html"
                      }, "HTML Content"),
                      withDirectives(createVNode("textarea", {
                        id: "test-html",
                        "onUpdate:modelValue": ($event) => unref(testForm).html_content = $event,
                        rows: "4",
                        class: "w-full border rounded px-3 py-2",
                        required: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(testForm).html_content]
                      ])
                    ]),
                    createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                      createVNode("label", {
                        class: "text-sm font-medium",
                        for: "test-text"
                      }, "Plain Text (optional)"),
                      withDirectives(createVNode("textarea", {
                        id: "test-text",
                        "onUpdate:modelValue": ($event) => unref(testForm).text_content = $event,
                        rows: "3",
                        class: "w-full border rounded px-3 py-2"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(testForm).text_content]
                      ])
                    ]),
                    createVNode("button", {
                      type: "submit",
                      class: "bg-primary text-primary-foreground rounded px-4 py-2 md:col-span-2",
                      disabled: unref(testForm).processing
                    }, toDisplayString(unref(testForm).processing ? "Sending…" : "Send Test Email"), 9, ["disabled"])
                  ], 32)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$11 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Email/Index.vue");
  return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$11
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$10 = {
  __name: "EnvSettings",
  __ssrInlineRender: true,
  props: {
    envSettings: Object,
    envStructure: Object
  },
  setup(__props) {
    const props = __props;
    const showSuccess = ref(false);
    const formData = reactive({});
    Object.keys(props.envSettings).forEach((key) => {
      formData[key] = props.envSettings[key];
    });
    Object.values(props.envStructure).forEach((section) => {
      section.forEach((setting) => {
        if (!(setting.key in formData)) {
          formData[setting.key] = "";
        }
      });
    });
    const handleSubmit = () => {
      router.post(
        "/admin/env-settings",
        { settings: formData },
        {
          onSuccess: () => {
            showSuccess.value = true;
            setTimeout(() => {
              showSuccess.value = false;
            }, 5e3);
          },
          preserveScroll: true
        }
      );
    };
    const lockSettings = () => {
      router.post(
        "/admin/env-settings/lock",
        {},
        {
          preserveScroll: false
        }
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Environment Settings" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$19, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"${_scopeId}><div class="mb-8"${_scopeId}><h1 class="text-3xl font-bold text-foreground"${_scopeId}> Environment Settings </h1><p class="mt-2 text-muted-foreground"${_scopeId}> Configure your application environment variables. Changes require application restart. </p></div>`);
            if (showSuccess.value) {
              _push2(`<div class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md"${_scopeId}> Settings updated successfully! Please restart your application for changes to take effect. </div>`);
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.$page.props.flash?.error) {
              _push2(`<div class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"${_scopeId}>${ssrInterpolate(_ctx.$page.props.flash.error)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form${_scopeId}><!--[-->`);
            ssrRenderList(__props.envStructure, (settings, sectionName) => {
              _push2(`<div class="mb-8"${_scopeId}><div class="bg-card rounded-lg shadow-md overflow-hidden"${_scopeId}><div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4"${_scopeId}><h2 class="text-xl font-semibold text-white"${_scopeId}>${ssrInterpolate(sectionName)}</h2></div><div class="p-6 space-y-6"${_scopeId}><!--[-->`);
              ssrRenderList(settings, (setting) => {
                _push2(`<div class="space-y-2"${_scopeId}><label class="block"${_scopeId}><div class="flex items-center justify-between mb-1"${_scopeId}><span class="text-sm font-medium text-foreground"${_scopeId}>${ssrInterpolate(setting.key)} `);
                if (setting.is_sensitive) {
                  _push2(`<span class="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded"${_scopeId}> Sensitive </span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</span></div><input${ssrRenderDynamicModel(
                  setting.is_sensitive ? "password" : "text",
                  formData[setting.key],
                  null
                )}${ssrRenderAttr(
                  "type",
                  setting.is_sensitive ? "password" : "text"
                )}${ssrRenderAttr(
                  "placeholder",
                  setting.example || `Enter ${setting.key}`
                )} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground"${_scopeId}>`);
                if (setting.description) {
                  _push2(`<p class="mt-1 text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(setting.description)}</p>`);
                } else if (setting.example) {
                  _push2(`<p class="mt-1 text-xs text-muted-foreground"${_scopeId}> Example: ${ssrInterpolate(setting.example)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</label></div>`);
              });
              _push2(`<!--]--></div></div></div>`);
            });
            _push2(`<!--]--><div class="flex flex-wrap gap-3 sticky bottom-4 bg-background p-4 rounded-lg shadow-lg border border-border"${_scopeId}><button type="submit" class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"${_scopeId}> Save Environment Settings </button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/settings",
              class: "px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Back to Database Settings `);
                } else {
                  return [
                    createTextVNode(" Back to Database Settings ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin",
              class: "px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Dashboard `);
                } else {
                  return [
                    createTextVNode(" Dashboard ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="button" class="ml-auto px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 font-medium transition-colors flex items-center gap-2"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"${_scopeId}></path></svg> Lock Settings </button></div></form><div class="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded"${_scopeId}><div class="flex"${_scopeId}><div class="flex-shrink-0"${_scopeId}><svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"${_scopeId}><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"${_scopeId}></path></svg></div><div class="ml-3"${_scopeId}><h3 class="text-sm font-medium text-yellow-800"${_scopeId}> Important Notes </h3><div class="mt-2 text-sm text-yellow-700"${_scopeId}><ul class="list-disc list-inside space-y-1"${_scopeId}><li${_scopeId}> Changes to environment variables require restarting your application </li><li${_scopeId}> Sensitive values (passwords, keys, secrets) are masked for security </li><li${_scopeId}> Make sure to backup your .env file before making changes </li><li${_scopeId}> Invalid configurations may cause your application to fail </li><li${_scopeId}> Database settings: Use the Database Settings page for runtime settings </li></ul></div></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" }, [
                createVNode("div", { class: "mb-8" }, [
                  createVNode("h1", { class: "text-3xl font-bold text-foreground" }, " Environment Settings "),
                  createVNode("p", { class: "mt-2 text-muted-foreground" }, " Configure your application environment variables. Changes require application restart. ")
                ]),
                showSuccess.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md"
                }, " Settings updated successfully! Please restart your application for changes to take effect. ")) : createCommentVNode("", true),
                _ctx.$page.props.flash?.error ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
                }, toDisplayString(_ctx.$page.props.flash.error), 1)) : createCommentVNode("", true),
                createVNode("form", {
                  onSubmit: withModifiers(handleSubmit, ["prevent"])
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.envStructure, (settings, sectionName) => {
                    return openBlock(), createBlock("div", {
                      key: sectionName,
                      class: "mb-8"
                    }, [
                      createVNode("div", { class: "bg-card rounded-lg shadow-md overflow-hidden" }, [
                        createVNode("div", { class: "bg-gradient-to-r from-red-600 to-red-700 px-6 py-4" }, [
                          createVNode("h2", { class: "text-xl font-semibold text-white" }, toDisplayString(sectionName), 1)
                        ]),
                        createVNode("div", { class: "p-6 space-y-6" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(settings, (setting) => {
                            return openBlock(), createBlock("div", {
                              key: setting.key,
                              class: "space-y-2"
                            }, [
                              createVNode("label", { class: "block" }, [
                                createVNode("div", { class: "flex items-center justify-between mb-1" }, [
                                  createVNode("span", { class: "text-sm font-medium text-foreground" }, [
                                    createTextVNode(toDisplayString(setting.key) + " ", 1),
                                    setting.is_sensitive ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded"
                                    }, " Sensitive ")) : createCommentVNode("", true)
                                  ])
                                ]),
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => formData[setting.key] = $event,
                                  type: setting.is_sensitive ? "password" : "text",
                                  placeholder: setting.example || `Enter ${setting.key}`,
                                  class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground"
                                }, null, 8, ["onUpdate:modelValue", "type", "placeholder"]), [
                                  [vModelDynamic, formData[setting.key]]
                                ]),
                                setting.description ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "mt-1 text-xs text-muted-foreground"
                                }, toDisplayString(setting.description), 1)) : setting.example ? (openBlock(), createBlock("p", {
                                  key: 1,
                                  class: "mt-1 text-xs text-muted-foreground"
                                }, " Example: " + toDisplayString(setting.example), 1)) : createCommentVNode("", true)
                              ])
                            ]);
                          }), 128))
                        ])
                      ])
                    ]);
                  }), 128)),
                  createVNode("div", { class: "flex flex-wrap gap-3 sticky bottom-4 bg-background p-4 rounded-lg shadow-lg border border-border" }, [
                    createVNode("button", {
                      type: "submit",
                      class: "px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
                    }, " Save Environment Settings "),
                    createVNode(unref(Link), {
                      href: "/admin/settings",
                      class: "px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium transition-colors"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Back to Database Settings ")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Link), {
                      href: "/admin",
                      class: "px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium transition-colors"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Dashboard ")
                      ]),
                      _: 1
                    }),
                    createVNode("button", {
                      type: "button",
                      onClick: lockSettings,
                      class: "ml-auto px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 font-medium transition-colors flex items-center gap-2"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        })
                      ])),
                      createTextVNode(" Lock Settings ")
                    ])
                  ])
                ], 32),
                createVNode("div", { class: "mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded" }, [
                  createVNode("div", { class: "flex" }, [
                    createVNode("div", { class: "flex-shrink-0" }, [
                      (openBlock(), createBlock("svg", {
                        class: "h-5 w-5 text-yellow-400",
                        viewBox: "0 0 20 20",
                        fill: "currentColor"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
                          "clip-rule": "evenodd"
                        })
                      ]))
                    ]),
                    createVNode("div", { class: "ml-3" }, [
                      createVNode("h3", { class: "text-sm font-medium text-yellow-800" }, " Important Notes "),
                      createVNode("div", { class: "mt-2 text-sm text-yellow-700" }, [
                        createVNode("ul", { class: "list-disc list-inside space-y-1" }, [
                          createVNode("li", null, " Changes to environment variables require restarting your application "),
                          createVNode("li", null, " Sensitive values (passwords, keys, secrets) are masked for security "),
                          createVNode("li", null, " Make sure to backup your .env file before making changes "),
                          createVNode("li", null, " Invalid configurations may cause your application to fail "),
                          createVNode("li", null, " Database settings: Use the Database Settings page for runtime settings ")
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$10 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/EnvSettings.vue");
  return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$10
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$$ = {
  __name: "EnvSettingsLocked",
  __ssrInlineRender: true,
  props: {
    devPhone: {
      type: String,
      default: "+233****0000"
    }
  },
  setup(__props) {
    const step = ref("password");
    const password = ref("");
    ref("");
    const isLoading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");
    ref(0);
    const verifyPassword = async () => {
      if (!password.value) return;
      isLoading.value = true;
      errorMessage.value = "";
      try {
        await router.post(
          "/admin/env-settings/verify-password",
          {
            password: password.value
          },
          {
            preserveState: true,
            onSuccess: () => {
            },
            onError: (errors) => {
              errorMessage.value = errors.password || "Verification failed";
            },
            onFinish: () => {
              isLoading.value = false;
            }
          }
        );
      } catch (e2) {
        errorMessage.value = "An error occurred. Please try again.";
        isLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Verify Access - Environment Settings" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$19, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto"${_scopeId}><div class="mb-8 text-center"${_scopeId}><div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"${_scopeId}><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"${_scopeId}></path></svg></div><h1 class="text-3xl font-bold text-foreground"${_scopeId}> Developer Access Required </h1><p class="mt-2 text-muted-foreground"${_scopeId}> Environment settings require developer verification to access. </p></div><div class="bg-card rounded-lg shadow-md overflow-hidden"${_scopeId}><div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4"${_scopeId}><h2 class="text-xl font-semibold text-white"${_scopeId}> Verify Your Identity </h2></div><div class="p-6"${_scopeId}>`);
            if (errorMessage.value) {
              _push2(`<div class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"${_scopeId}>${ssrInterpolate(errorMessage.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (successMessage.value) {
              _push2(`<div class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md"${_scopeId}>${ssrInterpolate(successMessage.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (step.value === "password") {
              _push2(`<div class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-foreground mb-1"${_scopeId}>Developer Password</label><input${ssrRenderAttr("value", password.value)} type="password" placeholder="Enter developer password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground"${_scopeId}></div><div class="flex flex-col gap-3"${_scopeId}><button${ssrIncludeBooleanAttr(isLoading.value || !password.value) ? " disabled" : ""} class="w-full px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId}>`);
              if (isLoading.value) {
                _push2(`<span${_scopeId}>Verifying...</span>`);
              } else {
                _push2(`<span${_scopeId}>Verify Password</span>`);
              }
              _push2(`</button><div class="relative"${_scopeId}><div class="absolute inset-0 flex items-center"${_scopeId}><div class="w-full border-t border-gray-300"${_scopeId}></div></div><div class="relative flex justify-center text-sm"${_scopeId}><span class="px-2 bg-card text-muted-foreground"${_scopeId}>OTP Disabled</span></div></div><button disabled class="w-full px-6 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed font-medium transition-colors"${_scopeId}><span${_scopeId}>Request OTP via SMS (Disabled)</span></button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="mt-6 text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin",
              class: "text-sm text-muted-foreground hover:text-foreground transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` ← Back to Admin Dashboard `);
                } else {
                  return [
                    createTextVNode(" ← Back to Admin Dashboard ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded"${_scopeId}><div class="flex"${_scopeId}><div class="flex-shrink-0"${_scopeId}><svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"${_scopeId}><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"${_scopeId}></path></svg></div><div class="ml-3"${_scopeId}><h3 class="text-sm font-medium text-yellow-800"${_scopeId}> Security Notice </h3><div class="mt-2 text-sm text-yellow-700"${_scopeId}><p${_scopeId}> Environment settings contain sensitive application configuration including API keys, database credentials, and service secrets. Access is restricted to authorized developers only. </p></div></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto" }, [
                createVNode("div", { class: "mb-8 text-center" }, [
                  createVNode("div", { class: "mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-8 h-8 text-red-600",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      })
                    ]))
                  ]),
                  createVNode("h1", { class: "text-3xl font-bold text-foreground" }, " Developer Access Required "),
                  createVNode("p", { class: "mt-2 text-muted-foreground" }, " Environment settings require developer verification to access. ")
                ]),
                createVNode("div", { class: "bg-card rounded-lg shadow-md overflow-hidden" }, [
                  createVNode("div", { class: "bg-gradient-to-r from-red-600 to-red-700 px-6 py-4" }, [
                    createVNode("h2", { class: "text-xl font-semibold text-white" }, " Verify Your Identity ")
                  ]),
                  createVNode("div", { class: "p-6" }, [
                    errorMessage.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
                    }, toDisplayString(errorMessage.value), 1)) : createCommentVNode("", true),
                    successMessage.value ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md"
                    }, toDisplayString(successMessage.value), 1)) : createCommentVNode("", true),
                    step.value === "password" ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "space-y-4"
                    }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-foreground mb-1" }, "Developer Password"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => password.value = $event,
                          type: "password",
                          placeholder: "Enter developer password",
                          class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground",
                          onKeyup: withKeys(verifyPassword, ["enter"])
                        }, null, 40, ["onUpdate:modelValue"]), [
                          [vModelText, password.value]
                        ])
                      ]),
                      createVNode("div", { class: "flex flex-col gap-3" }, [
                        createVNode("button", {
                          onClick: verifyPassword,
                          disabled: isLoading.value || !password.value,
                          class: "w-full px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        }, [
                          isLoading.value ? (openBlock(), createBlock("span", { key: 0 }, "Verifying...")) : (openBlock(), createBlock("span", { key: 1 }, "Verify Password"))
                        ], 8, ["disabled"]),
                        createVNode("div", { class: "relative" }, [
                          createVNode("div", { class: "absolute inset-0 flex items-center" }, [
                            createVNode("div", { class: "w-full border-t border-gray-300" })
                          ]),
                          createVNode("div", { class: "relative flex justify-center text-sm" }, [
                            createVNode("span", { class: "px-2 bg-card text-muted-foreground" }, "OTP Disabled")
                          ])
                        ]),
                        createVNode("button", {
                          disabled: "",
                          class: "w-full px-6 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed font-medium transition-colors"
                        }, [
                          createVNode("span", null, "Request OTP via SMS (Disabled)")
                        ])
                      ])
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "mt-6 text-center" }, [
                  createVNode(unref(Link), {
                    href: "/admin",
                    class: "text-sm text-muted-foreground hover:text-foreground transition-colors"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" ← Back to Admin Dashboard ")
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded" }, [
                  createVNode("div", { class: "flex" }, [
                    createVNode("div", { class: "flex-shrink-0" }, [
                      (openBlock(), createBlock("svg", {
                        class: "h-5 w-5 text-yellow-400",
                        viewBox: "0 0 20 20",
                        fill: "currentColor"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
                          "clip-rule": "evenodd"
                        })
                      ]))
                    ]),
                    createVNode("div", { class: "ml-3" }, [
                      createVNode("h3", { class: "text-sm font-medium text-yellow-800" }, " Security Notice "),
                      createVNode("div", { class: "mt-2 text-sm text-yellow-700" }, [
                        createVNode("p", null, " Environment settings contain sensitive application configuration including API keys, database credentials, and service secrets. Access is restricted to authorized developers only. ")
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$$ = _sfc_main$$.setup;
_sfc_main$$.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/EnvSettingsLocked.vue");
  return _sfc_setup$$ ? _sfc_setup$$(props, ctx) : void 0;
};
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$$
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$_ = {
  __name: "Create",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      title: "",
      description: "",
      image_url: "",
      category: "behind-the-scenes",
      display_order: 0,
      is_active: true
    });
    const handleUploadSuccess = (data) => {
      console.log("Upload successful:", data);
    };
    const handleUploadError = (error) => {
      console.error("Upload failed:", error);
    };
    const submit = () => {
      form.post("/admin/gallery", {
        onSuccess: () => {
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Add Gallery Image" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$19, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-card border-b border-border shadow-sm"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex justify-between items-center py-4"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-foreground"${_scopeId}>Add Gallery Image</h1><p class="text-muted-foreground"${_scopeId}>Add a new image to the gallery</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/gallery",
              class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent3, _scopeId2));
                  _push3(` Back to Gallery `);
                } else {
                  return [
                    createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
                    createTextVNode(" Back to Gallery ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"${_scopeId}><div class="bg-card rounded-lg shadow p-6"${_scopeId}><form${_scopeId}><div class="space-y-6"${_scopeId}><div${_scopeId}><label for="title" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Title * </label><input id="title"${ssrRenderAttr("value", unref(form).title)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required${_scopeId}>`);
            if (unref(form).errors.title) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.title)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label for="description" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Description </label><textarea id="description" rows="3" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}>${ssrInterpolate(unref(form).description)}</textarea>`);
            if (unref(form).errors.description) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.description)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Image * </label>`);
            _push2(ssrRenderComponent(_sfc_main$1b, {
              modelValue: unref(form).image_url,
              "onUpdate:modelValue": ($event) => unref(form).image_url = $event,
              folder: "gallery",
              alt: "Gallery image preview",
              onUploadSuccess: handleUploadSuccess,
              onUploadError: handleUploadError
            }, null, _parent2, _scopeId));
            if (unref(form).errors.image_url) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.image_url)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="mt-1 text-sm text-muted-foreground"${_scopeId}> Upload an image or enter URL manually below. </p></div><div${_scopeId}><label for="image_url" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Or Enter Image URL </label><input id="image_url"${ssrRenderAttr("value", unref(form).image_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://example.com/image.jpg"${_scopeId}></div><div${_scopeId}><label for="display_order" class="block text-sm font-medium text-foreground mb-2"${_scopeId}> Display Order </label><input id="display_order"${ssrRenderAttr("value", unref(form).display_order)} type="number" min="0" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}>`);
            if (unref(form).errors.display_order) {
              _push2(`<div class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.display_order)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="mt-1 text-sm text-muted-foreground"${_scopeId}> Lower numbers appear first. Leave empty for auto-ordering. </p></div><div class="flex items-center"${_scopeId}><input id="is_active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-border rounded"${_scopeId}><label for="is_active" class="ml-2 block text-sm text-foreground"${_scopeId}> Active (visible on the website) </label></div><div class="flex justify-end space-x-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/gallery",
              class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span${_scopeId}>Adding...</span>`);
            } else {
              _push2(`<span${_scopeId}>Add Image</span>`);
            }
            _push2(`</button></div></div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-card border-b border-border shadow-sm" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex justify-between items-center py-4" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-foreground" }, "Add Gallery Image"),
                      createVNode("p", { class: "text-muted-foreground" }, "Add a new image to the gallery")
                    ]),
                    createVNode(unref(Link), {
                      href: "/admin/gallery",
                      class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
                        createTextVNode(" Back to Gallery ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }, [
                createVNode("div", { class: "bg-card rounded-lg shadow p-6" }, [
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode("div", { class: "space-y-6" }, [
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "title",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Title * "),
                        withDirectives(createVNode("input", {
                          id: "title",
                          "onUpdate:modelValue": ($event) => unref(form).title = $event,
                          type: "text",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).title]
                        ]),
                        unref(form).errors.title ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.title), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "description",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Description "),
                        withDirectives(createVNode("textarea", {
                          id: "description",
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          rows: "3",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).description]
                        ]),
                        unref(form).errors.description ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-foreground mb-2" }, " Image * "),
                        createVNode(_sfc_main$1b, {
                          modelValue: unref(form).image_url,
                          "onUpdate:modelValue": ($event) => unref(form).image_url = $event,
                          folder: "gallery",
                          alt: "Gallery image preview",
                          onUploadSuccess: handleUploadSuccess,
                          onUploadError: handleUploadError
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(form).errors.image_url ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.image_url), 1)) : createCommentVNode("", true),
                        createVNode("p", { class: "mt-1 text-sm text-muted-foreground" }, " Upload an image or enter URL manually below. ")
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "image_url",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Or Enter Image URL "),
                        withDirectives(createVNode("input", {
                          id: "image_url",
                          "onUpdate:modelValue": ($event) => unref(form).image_url = $event,
                          type: "url",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          placeholder: "https://example.com/image.jpg"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).image_url]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          for: "display_order",
                          class: "block text-sm font-medium text-foreground mb-2"
                        }, " Display Order "),
                        withDirectives(createVNode("input", {
                          id: "display_order",
                          "onUpdate:modelValue": ($event) => unref(form).display_order = $event,
                          type: "number",
                          min: "0",
                          class: "w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [
                            vModelText,
                            unref(form).display_order,
                            void 0,
                            { number: true }
                          ]
                        ]),
                        unref(form).errors.display_order ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(form).errors.display_order), 1)) : createCommentVNode("", true),
                        createVNode("p", { class: "mt-1 text-sm text-muted-foreground" }, " Lower numbers appear first. Leave empty for auto-ordering. ")
                      ]),
                      createVNode("div", { class: "flex items-center" }, [
                        withDirectives(createVNode("input", {
                          id: "is_active",
                          "onUpdate:modelValue": ($event) => unref(form).is_active = $event,
                          type: "checkbox",
                          class: "h-4 w-4 text-primary focus:ring-primary border-border rounded"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).is_active]
                        ]),
                        createVNode("label", {
                          for: "is_active",
                          class: "ml-2 block text-sm text-foreground"
                        }, " Active (visible on the website) ")
                      ]),
                      createVNode("div", { class: "flex justify-end space-x-4" }, [
                        createVNode(unref(Link), {
                          href: "/admin/gallery",
                          class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }),
                        createVNode("button", {
                          type: "submit",
                          disabled: unref(form).processing,
                          class: "px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        }, [
                          unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, "Adding...")) : (openBlock(), createBlock("span", { key: 1 }, "Add Image"))
                        ], 8, ["disabled"])
                      ])
                    ])
                  ], 32)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$_ = _sfc_main$_.setup;
_sfc_main$_.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Gallery/Create.vue");
  return _sfc_setup$_ ? _sfc_setup$_(props, ctx) : void 0;
};
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$_
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$Z = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    image: { type: Object, required: true }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      title: props.image.title ?? "",
      description: props.image.description ?? "",
      image_url: props.image.image_url ?? "",
      display_order: props.image.display_order ?? 0,
      is_active: props.image.is_active ?? false
    });
    const handleUploadSuccess = (data) => {
    };
    const handleUploadError = (error) => {
      console.error("Upload failed:", error);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Edit Gallery Image</h1><p class="text-muted-foreground">Update gallery image details</p></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/gallery",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Gallery `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Gallery ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow p-6"><form><div class="space-y-6"><div><label for="title" class="block text-sm font-medium text-foreground mb-2"> Title * </label><input id="title"${ssrRenderAttr("value", unref(form).title)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>`);
      if (unref(form).errors.title) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.title)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="description" class="block text-sm font-medium text-foreground mb-2"> Description </label><textarea id="description" rows="3" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">${ssrInterpolate(unref(form).description)}</textarea>`);
      if (unref(form).errors.description) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.description)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-foreground mb-2"> Gallery Image * </label>`);
      _push(ssrRenderComponent(_sfc_main$1b, {
        modelValue: unref(form).image_url,
        "onUpdate:modelValue": ($event) => unref(form).image_url = $event,
        folder: "gallery",
        alt: "Gallery image preview",
        onUploadSuccess: handleUploadSuccess,
        onUploadError: handleUploadError
      }, null, _parent));
      if (unref(form).errors.image_url) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.image_url)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-1 text-sm text-muted-foreground"> Upload an image or enter URL manually below. </p><input${ssrRenderAttr("value", unref(form).image_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2" placeholder="Or paste image URL..."></div><div><label for="display_order" class="block text-sm font-medium text-foreground mb-2"> Display Order </label><input id="display_order"${ssrRenderAttr("value", unref(form).display_order)} type="number" min="0" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">`);
      if (unref(form).errors.display_order) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.display_order)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-1 text-sm text-muted-foreground"> Lower numbers appear first. </p></div><div class="flex items-center"><input id="is_active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-border rounded"><label for="is_active" class="ml-2 block text-sm text-foreground"> Active (visible on the website) </label></div><div class="flex justify-end space-x-4">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/gallery",
        class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancel `);
          } else {
            return [
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50">`);
      if (unref(form).processing) {
        _push(`<span>Updating...</span>`);
      } else {
        _push(`<span>Update Image</span>`);
      }
      _push(`</button></div></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$Z = _sfc_main$Z.setup;
_sfc_main$Z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Gallery/Edit.vue");
  return _sfc_setup$Z ? _sfc_setup$Z(props, ctx) : void 0;
};
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$Z
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$Y = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    images: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    computed(() => props.images ?? []);
    const deleteImage = (id) => {
      if (confirm("Are you sure you want to delete this gallery image?")) {
        router.delete(`/admin/gallery/${id}`);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$19, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-card border-b border-border shadow-sm"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex justify-between items-center py-4"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-foreground"${_scopeId}>Manage Gallery</h1><p class="text-muted-foreground"${_scopeId}>Behind the scenes photos</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/gallery/create",
              class: "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Plus), { class: "h-4 w-4 mr-2" }, null, _parent3, _scopeId2));
                  _push3(` Add Image `);
                } else {
                  return [
                    createVNode(unref(Plus), { class: "h-4 w-4 mr-2" }),
                    createTextVNode(" Add Image ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"${_scopeId}><div class="bg-card rounded-lg shadow"${_scopeId}><div class="px-6 py-4 border-b border-border"${_scopeId}><h2 class="text-lg font-semibold text-foreground"${_scopeId}>Gallery Images</h2></div><div class="p-6"${_scopeId}>`);
            if (__props.images.length === 0) {
              _push2(`<div class="text-center py-8"${_scopeId}><p class="text-muted-foreground"${_scopeId}>No gallery images found. Add your first image to get started.</p></div>`);
            } else {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"${_scopeId}><!--[-->`);
              ssrRenderList(__props.images, (image) => {
                _push2(`<div class="bg-card border border-border rounded-lg overflow-hidden shadow-sm"${_scopeId}><div class="aspect-video bg-muted"${_scopeId}><img${ssrRenderAttr("src", image.image_url)}${ssrRenderAttr("alt", image.title)} class="w-full h-full object-cover"${_scopeId}></div><div class="p-4"${_scopeId}><h3 class="font-medium text-foreground mb-2"${_scopeId}>${ssrInterpolate(image.title)}</h3><p class="text-sm text-muted-foreground mb-3"${_scopeId}>${ssrInterpolate(image.description)}</p><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center space-x-2"${_scopeId}><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", image.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"])}"${_scopeId}>${ssrInterpolate(image.is_active ? "Active" : "Inactive")}</span><span class="text-xs text-muted-foreground"${_scopeId}> Order: ${ssrInterpolate(image.display_order)}</span></div><div class="flex space-x-2"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/admin/gallery/${image.id}`,
                  class: "px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` View `);
                    } else {
                      return [
                        createTextVNode(" View ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/admin/gallery/${image.id}/edit`,
                  class: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Edit `);
                    } else {
                      return [
                        createTextVNode(" Edit ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></div><div class="mt-3"${_scopeId}><button class="w-full px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"${_scopeId}> Delete </button></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-card border-b border-border shadow-sm" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex justify-between items-center py-4" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-foreground" }, "Manage Gallery"),
                      createVNode("p", { class: "text-muted-foreground" }, "Behind the scenes photos")
                    ]),
                    createVNode(unref(Link), {
                      href: "/admin/gallery/create",
                      class: "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Plus), { class: "h-4 w-4 mr-2" }),
                        createTextVNode(" Add Image ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }, [
                createVNode("div", { class: "bg-card rounded-lg shadow" }, [
                  createVNode("div", { class: "px-6 py-4 border-b border-border" }, [
                    createVNode("h2", { class: "text-lg font-semibold text-foreground" }, "Gallery Images")
                  ]),
                  createVNode("div", { class: "p-6" }, [
                    __props.images.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-center py-8"
                    }, [
                      createVNode("p", { class: "text-muted-foreground" }, "No gallery images found. Add your first image to get started.")
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.images, (image) => {
                        return openBlock(), createBlock("div", {
                          key: image.id,
                          class: "bg-card border border-border rounded-lg overflow-hidden shadow-sm"
                        }, [
                          createVNode("div", { class: "aspect-video bg-muted" }, [
                            createVNode("img", {
                              src: image.image_url,
                              alt: image.title,
                              class: "w-full h-full object-cover"
                            }, null, 8, ["src", "alt"])
                          ]),
                          createVNode("div", { class: "p-4" }, [
                            createVNode("h3", { class: "font-medium text-foreground mb-2" }, toDisplayString(image.title), 1),
                            createVNode("p", { class: "text-sm text-muted-foreground mb-3" }, toDisplayString(image.description), 1),
                            createVNode("div", { class: "flex items-center justify-between" }, [
                              createVNode("div", { class: "flex items-center space-x-2" }, [
                                createVNode("span", {
                                  class: ["px-2 py-1 text-xs rounded-full", image.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"]
                                }, toDisplayString(image.is_active ? "Active" : "Inactive"), 3),
                                createVNode("span", { class: "text-xs text-muted-foreground" }, " Order: " + toDisplayString(image.display_order), 1)
                              ]),
                              createVNode("div", { class: "flex space-x-2" }, [
                                createVNode(unref(Link), {
                                  href: `/admin/gallery/${image.id}`,
                                  class: "px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" View ")
                                  ]),
                                  _: 1
                                }, 8, ["href"]),
                                createVNode(unref(Link), {
                                  href: `/admin/gallery/${image.id}/edit`,
                                  class: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Edit ")
                                  ]),
                                  _: 1
                                }, 8, ["href"])
                              ])
                            ]),
                            createVNode("div", { class: "mt-3" }, [
                              createVNode("button", {
                                onClick: ($event) => deleteImage(image.id),
                                class: "w-full px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              }, " Delete ", 8, ["onClick"])
                            ])
                          ])
                        ]);
                      }), 128))
                    ]))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$Y = _sfc_main$Y.setup;
_sfc_main$Y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Gallery/Index.vue");
  return _sfc_setup$Y ? _sfc_setup$Y(props, ctx) : void 0;
};
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$Y
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$X = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    image: Object
  },
  setup(__props) {
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Gallery Image Details</h1><p class="text-muted-foreground">View gallery image information</p></div><div class="flex space-x-2">`);
      _push(ssrRenderComponent(unref(Link), {
        href: `/admin/gallery/${__props.image.id}/edit`,
        class: "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Edit), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Edit `);
          } else {
            return [
              createVNode(unref(Edit), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Edit ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/gallery",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Gallery `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Gallery ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow overflow-hidden"><div class="w-full h-96 bg-muted"><img${ssrRenderAttr("src", __props.image.image_url)}${ssrRenderAttr("alt", __props.image.title)} class="w-full h-full object-cover"></div><div class="p-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h3 class="text-lg font-semibold text-foreground mb-4">Image Information</h3><dl class="space-y-3"><div><dt class="text-sm font-medium text-muted-foreground">Title</dt><dd class="text-foreground">${ssrInterpolate(__props.image.title)}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Description</dt><dd class="text-foreground">${ssrInterpolate(__props.image.description || "No description")}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Status</dt><dd><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", __props.image.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"])}">${ssrInterpolate(__props.image.is_active ? "Active" : "Inactive")}</span></dd></div><div><dt class="text-sm font-medium text-muted-foreground">Display Order</dt><dd class="text-foreground">${ssrInterpolate(__props.image.display_order)}</dd></div></dl></div><div><h3 class="text-lg font-semibold text-foreground mb-4">Image Details</h3><dl class="space-y-3"><div><dt class="text-sm font-medium text-muted-foreground">Image URL</dt><dd class="text-foreground break-all"><a${ssrRenderAttr("href", __props.image.image_url)} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${ssrInterpolate(__props.image.image_url)}</a></dd></div></dl></div></div><div class="mt-8 pt-6 border-t border-border"><h3 class="text-lg font-semibold text-foreground mb-4">Timestamps</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><dt class="text-sm font-medium text-muted-foreground">Created</dt><dd class="text-foreground">${ssrInterpolate(formatDate(__props.image.created_at))}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Last Updated</dt><dd class="text-foreground">${ssrInterpolate(formatDate(__props.image.updated_at))}</dd></div></div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup$X = _sfc_main$X.setup;
_sfc_main$X.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Gallery/Show.vue");
  return _sfc_setup$X ? _sfc_setup$X(props, ctx) : void 0;
};
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$X
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$W = {
  __name: "Create",
  __ssrInlineRender: true,
  setup(__props) {
    const genresInput = ref("");
    const form = useForm({
      page: "watch",
      title: "",
      poster: "",
      backdrop: "",
      synopsis: "",
      logline: "",
      rating: "",
      runtime: "",
      year: "",
      genres: [],
      movie_url: "",
      is_active: true
    });
    watch(genresInput, (newVal) => {
      form.genres = newVal.split(",").map((g2) => g2.trim()).filter((g2) => g2);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Add Movie Details</h1><p class="text-muted-foreground">Add movie information that appears on the information page</p></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/page-content",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Movie Details `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Movie Details ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow p-6"><form><div class="space-y-6"><div><label for="page" class="block text-sm font-medium text-foreground mb-2"> Page Identifier * </label><input id="page"${ssrRenderAttr("value", unref(form).page)} type="text" list="page-options" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="watch" required><datalist id="page-options"><option value="watch"></option><option value="home"></option><option value="details"></option><option value="information"></option></datalist>`);
      if (unref(form).errors.page) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.page)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-1 text-sm text-muted-foreground"> Use <strong>watch</strong> for the streaming page or specify another unique key. </p></div><div><label for="title" class="block text-sm font-medium text-foreground mb-2"> Movie Title * </label><input id="title"${ssrRenderAttr("value", unref(form).title)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., A Crazy Day in Accra" required>`);
      if (unref(form).errors.title) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.title)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="poster" class="block text-sm font-medium text-foreground mb-2"> Poster URL </label><input id="poster"${ssrRenderAttr("value", unref(form).poster)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="/movie_poster.jpg">`);
      if (unref(form).errors.poster) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.poster)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="backdrop" class="block text-sm font-medium text-foreground mb-2"> Backdrop URL </label><input id="backdrop"${ssrRenderAttr("value", unref(form).backdrop)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="/movie_poster_2.jpg">`);
      if (unref(form).errors.backdrop) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.backdrop)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="movie_url" class="block text-sm font-medium text-foreground mb-2"> Movie Stream URL </label><input id="movie_url"${ssrRenderAttr("value", unref(form).movie_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://vz-.../playlist.m3u8">`);
      if (unref(form).errors.movie_url) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.movie_url)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-1 text-sm text-muted-foreground"> Provide the secure HLS playlist URL for the full feature. Required for the watch page. </p></div><div><label for="logline" class="block text-sm font-medium text-foreground mb-2"> Logline </label><textarea id="logline" rows="2" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="A one-line summary of the film">${ssrInterpolate(unref(form).logline)}</textarea>`);
      if (unref(form).errors.logline) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.logline)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="synopsis" class="block text-sm font-medium text-foreground mb-2"> Synopsis </label><textarea id="synopsis" rows="5" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Full description of the film">${ssrInterpolate(unref(form).synopsis)}</textarea>`);
      if (unref(form).errors.synopsis) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.synopsis)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="rating" class="block text-sm font-medium text-foreground mb-2"> Rating </label><select id="rating" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "") : ssrLooseEqual(unref(form).rating, "")) ? " selected" : ""}>Select rating</option><option value="G"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "G") : ssrLooseEqual(unref(form).rating, "G")) ? " selected" : ""}>G</option><option value="PG"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "PG") : ssrLooseEqual(unref(form).rating, "PG")) ? " selected" : ""}>PG</option><option value="PG-13"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "PG-13") : ssrLooseEqual(unref(form).rating, "PG-13")) ? " selected" : ""}>PG-13</option><option value="16+"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "16+") : ssrLooseEqual(unref(form).rating, "16+")) ? " selected" : ""}>16+</option><option value="18+"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "18+") : ssrLooseEqual(unref(form).rating, "18+")) ? " selected" : ""}>18+</option></select>`);
      if (unref(form).errors.rating) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.rating)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="runtime" class="block text-sm font-medium text-foreground mb-2"> Runtime </label><input id="runtime"${ssrRenderAttr("value", unref(form).runtime)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., 1h 45m">`);
      if (unref(form).errors.runtime) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.runtime)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="year" class="block text-sm font-medium text-foreground mb-2"> Release Year </label><input id="year"${ssrRenderAttr("value", unref(form).year)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="2025">`);
      if (unref(form).errors.year) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.year)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="genres" class="block text-sm font-medium text-foreground mb-2"> Genres (comma-separated) </label><input id="genres"${ssrRenderAttr("value", genresInput.value)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., Thriller, Drama, Comedy">`);
      if (unref(form).errors.genres) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.genres)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center"><input id="is_active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-border rounded"><label for="is_active" class="ml-2 block text-sm text-foreground"> Active (visible on the information page) </label></div><div class="flex justify-end space-x-4">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/page-content",
        class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancel `);
          } else {
            return [
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50">`);
      if (unref(form).processing) {
        _push(`<span>Adding...</span>`);
      } else {
        _push(`<span>Add Movie Details</span>`);
      }
      _push(`</button></div></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$W = _sfc_main$W.setup;
_sfc_main$W.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/PageContent/Create.vue");
  return _sfc_setup$W ? _sfc_setup$W(props, ctx) : void 0;
};
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$W
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$V = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    content: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const genresInput = ref((props.content.genres || []).join(", "));
    const form = useForm({
      page: props.content.page || "watch",
      title: props.content.title || "",
      poster: props.content.poster || "",
      backdrop: props.content.backdrop || "",
      synopsis: props.content.synopsis || "",
      logline: props.content.logline || "",
      rating: props.content.rating || "",
      runtime: props.content.runtime || "",
      year: props.content.year || "",
      genres: props.content.genres || [],
      movie_url: props.content.movie_url || "",
      sponsors: props.content.sponsors || [],
      is_active: props.content.is_active ?? true
    });
    watch(genresInput, (newVal) => {
      form.genres = newVal.split(",").map((g2) => g2.trim()).filter((g2) => g2);
    });
    const handleUploadSuccess = (field, url) => {
      form[field] = url;
    };
    const handleUploadError = (error) => {
      console.error("Upload failed:", error);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Edit Movie Details</h1><p class="text-muted-foreground">Update movie information</p></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/page-content",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Movie Details `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Movie Details ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow p-6"><form><div class="space-y-6"><div><label for="page" class="block text-sm font-medium text-foreground mb-2"> Page Identifier * </label><input id="page"${ssrRenderAttr("value", unref(form).page)} type="text" list="page-options" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="watch" required><datalist id="page-options"><option value="watch"></option><option value="home"></option><option value="details"></option><option value="information"></option></datalist>`);
      if (unref(form).errors.page) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.page)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-1 text-sm text-muted-foreground"> This key must stay unique and should be <strong>watch</strong> for the streaming page content. </p></div><div><label for="title" class="block text-sm font-medium text-foreground mb-2"> Movie Title * </label><input id="title"${ssrRenderAttr("value", unref(form).title)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., A Crazy Day in Accra" required>`);
      if (unref(form).errors.title) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.title)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-foreground mb-2"> Poster Image </label>`);
      _push(ssrRenderComponent(_sfc_main$1b, {
        modelValue: unref(form).poster,
        "onUpdate:modelValue": ($event) => unref(form).poster = $event,
        folder: "posters",
        alt: "Movie poster",
        onUploadSuccess: (data) => handleUploadSuccess("poster", data.url),
        onUploadError: handleUploadError
      }, null, _parent));
      if (unref(form).errors.poster) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.poster)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-1 text-sm text-muted-foreground"> Upload a poster image or enter URL manually below. </p><input${ssrRenderAttr("value", unref(form).poster)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2" placeholder="Or paste image URL..."></div><div><label class="block text-sm font-medium text-foreground mb-2"> Backdrop Image </label>`);
      _push(ssrRenderComponent(_sfc_main$1b, {
        modelValue: unref(form).backdrop,
        "onUpdate:modelValue": ($event) => unref(form).backdrop = $event,
        folder: "posters",
        alt: "Movie backdrop",
        onUploadSuccess: (data) => handleUploadSuccess("backdrop", data.url),
        onUploadError: handleUploadError
      }, null, _parent));
      if (unref(form).errors.backdrop) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.backdrop)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-1 text-sm text-muted-foreground"> Upload a backdrop image or enter URL manually below. </p><input${ssrRenderAttr("value", unref(form).backdrop)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2" placeholder="Or paste image URL..."></div><div><label for="movie_url" class="block text-sm font-medium text-foreground mb-2"> Movie Stream URL </label><input id="movie_url"${ssrRenderAttr("value", unref(form).movie_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://vz-.../playlist.m3u8">`);
      if (unref(form).errors.movie_url) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.movie_url)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-1 text-sm text-muted-foreground"> Provide the secure HLS playlist URL for playback. Required for the watch page to stream the film. </p></div><div><label for="logline" class="block text-sm font-medium text-foreground mb-2"> Logline </label><textarea id="logline" rows="2" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="A one-line summary of the film">${ssrInterpolate(unref(form).logline)}</textarea>`);
      if (unref(form).errors.logline) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.logline)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="synopsis" class="block text-sm font-medium text-foreground mb-2"> Synopsis </label><textarea id="synopsis" rows="5" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Full description of the film">${ssrInterpolate(unref(form).synopsis)}</textarea>`);
      if (unref(form).errors.synopsis) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.synopsis)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="rating" class="block text-sm font-medium text-foreground mb-2"> Rating </label><select id="rating" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "") : ssrLooseEqual(unref(form).rating, "")) ? " selected" : ""}>Select rating</option><option value="G"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "G") : ssrLooseEqual(unref(form).rating, "G")) ? " selected" : ""}>G</option><option value="PG"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "PG") : ssrLooseEqual(unref(form).rating, "PG")) ? " selected" : ""}>PG</option><option value="PG-13"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "PG-13") : ssrLooseEqual(unref(form).rating, "PG-13")) ? " selected" : ""}>PG-13</option><option value="16+"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "16+") : ssrLooseEqual(unref(form).rating, "16+")) ? " selected" : ""}>16+</option><option value="18+"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "18+") : ssrLooseEqual(unref(form).rating, "18+")) ? " selected" : ""}>18+</option></select>`);
      if (unref(form).errors.rating) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.rating)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="runtime" class="block text-sm font-medium text-foreground mb-2"> Runtime </label><input id="runtime"${ssrRenderAttr("value", unref(form).runtime)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., 1h 45m">`);
      if (unref(form).errors.runtime) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.runtime)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="year" class="block text-sm font-medium text-foreground mb-2"> Release Year </label><input id="year"${ssrRenderAttr("value", unref(form).year)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="2025">`);
      if (unref(form).errors.year) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.year)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="genres" class="block text-sm font-medium text-foreground mb-2"> Genres (comma-separated) </label><input id="genres"${ssrRenderAttr("value", genresInput.value)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., Thriller, Drama, Comedy">`);
      if (unref(form).errors.genres) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.genres)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="border-t border-border pt-6"><h3 class="text-lg font-semibold text-foreground mb-4">Sponsors</h3><div class="space-y-4"><!--[-->`);
      ssrRenderList(unref(form).sponsors, (sponsor, index) => {
        _push(`<div class="p-4 border border-border rounded-md bg-muted/20"><div class="flex justify-between items-start mb-3"><span class="text-sm font-medium text-foreground">Sponsor ${ssrInterpolate(index + 1)}</span><button type="button" class="text-red-600 hover:text-red-700 text-sm"> Remove </button></div><div class="space-y-3"><div><label class="block text-sm font-medium text-foreground mb-1"> Sponsor Name * </label><input${ssrRenderAttr("value", sponsor.name)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., ABC Company" required></div><div><label class="block text-sm font-medium text-foreground mb-1"> Logo </label>`);
        _push(ssrRenderComponent(_sfc_main$1b, {
          modelValue: sponsor.logo_url,
          "onUpdate:modelValue": ($event) => sponsor.logo_url = $event,
          folder: "sponsors",
          alt: "Sponsor logo",
          onUploadSuccess: (data) => sponsor.logo_url = data.url,
          onUploadError: handleUploadError
        }, null, _parent));
        _push(`<input${ssrRenderAttr("value", sponsor.logo_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2" placeholder="Or paste logo URL..."></div><div><label class="block text-sm font-medium text-foreground mb-1"> Website URL </label><input${ssrRenderAttr("value", sponsor.website_url)} type="url" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://example.com"></div></div></div>`);
      });
      _push(`<!--]--><button type="button" class="w-full px-4 py-2 border-2 border-dashed border-border rounded-md text-muted-foreground hover:border-primary hover:text-primary transition-colors"> + Add Sponsor </button></div></div><div class="flex items-center"><input id="is_active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-border rounded"><label for="is_active" class="ml-2 block text-sm text-foreground"> Active (visible on the information page) </label></div><div class="flex justify-end space-x-4">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/page-content",
        class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancel `);
          } else {
            return [
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50">`);
      if (unref(form).processing) {
        _push(`<span>Updating...</span>`);
      } else {
        _push(`<span>Update Movie Details</span>`);
      }
      _push(`</button></div></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$V = _sfc_main$V.setup;
_sfc_main$V.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/PageContent/Edit.vue");
  return _sfc_setup$V ? _sfc_setup$V(props, ctx) : void 0;
};
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$V
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$U = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    content: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const movies = computed(() => props.content ?? []);
    const truncate = (text, length) => {
      if (!text) return "";
      return text.length > length ? text.substring(0, length) + "..." : text;
    };
    const deleteMovie = (id) => {
      if (confirm("Are you sure you want to delete this movie?")) {
        router.delete(`/admin/page-content/${id}`);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$19, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-card border-b border-border shadow-sm"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex justify-between items-center py-4"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-foreground"${_scopeId}>Movie Details</h1><p class="text-muted-foreground"${_scopeId}>Manage movie information for the information page</p></div><div class="flex gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/watch-analytics",
              class: "inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(BarChart3), { class: "h-4 w-4 mr-2" }, null, _parent3, _scopeId2));
                  _push3(` View Analytics `);
                } else {
                  return [
                    createVNode(unref(BarChart3), { class: "h-4 w-4 mr-2" }),
                    createTextVNode(" View Analytics ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/page-content/create",
              class: "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Plus), { class: "h-4 w-4 mr-2" }, null, _parent3, _scopeId2));
                  _push3(` Add Movie `);
                } else {
                  return [
                    createVNode(unref(Plus), { class: "h-4 w-4 mr-2" }),
                    createTextVNode(" Add Movie ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div></div><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"${_scopeId}>`);
            if (movies.value.length === 0) {
              _push2(`<div class="text-center py-8"${_scopeId}><p class="text-muted-foreground"${_scopeId}>No movie details found. Add your first movie to get started.</p></div>`);
            } else {
              _push2(`<div class="grid gap-6"${_scopeId}><!--[-->`);
              ssrRenderList(movies.value, (movie) => {
                _push2(`<div class="bg-card rounded-lg shadow border border-border overflow-hidden"${_scopeId}><div class="grid md:grid-cols-4 gap-4 p-6"${_scopeId}><div class="md:col-span-1"${_scopeId}>`);
                if (movie.poster) {
                  _push2(`<img${ssrRenderAttr("src", movie.poster)}${ssrRenderAttr("alt", movie.title)} class="w-full h-auto rounded object-cover"${_scopeId}>`);
                } else {
                  _push2(`<div class="w-full h-40 bg-muted rounded flex items-center justify-center"${_scopeId}><p class="text-muted-foreground text-sm"${_scopeId}>No poster</p></div>`);
                }
                _push2(`</div><div class="md:col-span-2"${_scopeId}><h3 class="font-bold text-lg text-foreground mb-2"${_scopeId}>${ssrInterpolate(movie.title)}</h3><div class="flex flex-wrap gap-2 mb-3"${_scopeId}><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", movie.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"])}"${_scopeId}>${ssrInterpolate(movie.is_active ? "Active" : "Inactive")}</span>`);
                if (movie.page) {
                  _push2(`<span class="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full uppercase tracking-wide"${_scopeId}>${ssrInterpolate(movie.page)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (movie.rating) {
                  _push2(`<span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"${_scopeId}>${ssrInterpolate(movie.rating)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (movie.year) {
                  _push2(`<span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"${_scopeId}>${ssrInterpolate(movie.year)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                if (movie.logline) {
                  _push2(`<p class="text-sm text-muted-foreground mb-3"${_scopeId}>${ssrInterpolate(truncate(movie.logline, 120))}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                if (movie.genres && movie.genres.length) {
                  _push2(`<div class="text-xs text-muted-foreground"${_scopeId}><strong${_scopeId}>Genres:</strong> ${ssrInterpolate(movie.genres.join(", "))}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2"${_scopeId}>`);
                if (movie.runtime) {
                  _push2(`<span${_scopeId}>⏱ ${ssrInterpolate(movie.runtime)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (movie.movie_url) {
                  _push2(`<span class="flex items-center gap-1"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 text-blue-500"${_scopeId}><path d="M4 4a2 2 0 012-2h4a2 2 0 012 2v1h1a2 2 0 012 2v2h-2V7H5v8h4v2H6a2 2 0 01-2-2V4zm7 2V4H6v2h5z"${_scopeId}></path><path d="M13 11a1 1 0 011-1h3a1 1 0 011 1v5a1 1 0 01-1 1h-3a1 1 0 01-1-1v-5zm2 4h1v-3h-1v3z"${_scopeId}></path></svg> Stream URL set </span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div><div class="md:col-span-1 flex flex-col items-end justify-center space-y-2"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/admin/page-content/${movie.id}`,
                  class: "w-full px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors text-center"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` View `);
                    } else {
                      return [
                        createTextVNode(" View ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/admin/page-content/${movie.id}/edit`,
                  class: "w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Edit `);
                    } else {
                      return [
                        createTextVNode(" Edit ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<button class="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"${_scopeId}> Delete </button></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "bg-card border-b border-border shadow-sm" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex justify-between items-center py-4" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-foreground" }, "Movie Details"),
                      createVNode("p", { class: "text-muted-foreground" }, "Manage movie information for the information page")
                    ]),
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode(unref(Link), {
                        href: "/admin/watch-analytics",
                        class: "inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(BarChart3), { class: "h-4 w-4 mr-2" }),
                          createTextVNode(" View Analytics ")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Link), {
                        href: "/admin/page-content/create",
                        class: "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Plus), { class: "h-4 w-4 mr-2" }),
                          createTextVNode(" Add Movie ")
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }, [
                movies.value.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-8"
                }, [
                  createVNode("p", { class: "text-muted-foreground" }, "No movie details found. Add your first movie to get started.")
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "grid gap-6"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(movies.value, (movie) => {
                    return openBlock(), createBlock("div", {
                      key: movie.id,
                      class: "bg-card rounded-lg shadow border border-border overflow-hidden"
                    }, [
                      createVNode("div", { class: "grid md:grid-cols-4 gap-4 p-6" }, [
                        createVNode("div", { class: "md:col-span-1" }, [
                          movie.poster ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: movie.poster,
                            alt: movie.title,
                            class: "w-full h-auto rounded object-cover"
                          }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "w-full h-40 bg-muted rounded flex items-center justify-center"
                          }, [
                            createVNode("p", { class: "text-muted-foreground text-sm" }, "No poster")
                          ]))
                        ]),
                        createVNode("div", { class: "md:col-span-2" }, [
                          createVNode("h3", { class: "font-bold text-lg text-foreground mb-2" }, toDisplayString(movie.title), 1),
                          createVNode("div", { class: "flex flex-wrap gap-2 mb-3" }, [
                            createVNode("span", {
                              class: ["px-2 py-1 text-xs rounded-full", movie.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"]
                            }, toDisplayString(movie.is_active ? "Active" : "Inactive"), 3),
                            movie.page ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full uppercase tracking-wide"
                            }, toDisplayString(movie.page), 1)) : createCommentVNode("", true),
                            movie.rating ? (openBlock(), createBlock("span", {
                              key: 1,
                              class: "px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                            }, toDisplayString(movie.rating), 1)) : createCommentVNode("", true),
                            movie.year ? (openBlock(), createBlock("span", {
                              key: 2,
                              class: "px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                            }, toDisplayString(movie.year), 1)) : createCommentVNode("", true)
                          ]),
                          movie.logline ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-muted-foreground mb-3"
                          }, toDisplayString(truncate(movie.logline, 120)), 1)) : createCommentVNode("", true),
                          movie.genres && movie.genres.length ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "text-xs text-muted-foreground"
                          }, [
                            createVNode("strong", null, "Genres:"),
                            createTextVNode(" " + toDisplayString(movie.genres.join(", ")), 1)
                          ])) : createCommentVNode("", true),
                          createVNode("div", { class: "flex flex-wrap gap-2 text-xs text-muted-foreground mt-2" }, [
                            movie.runtime ? (openBlock(), createBlock("span", { key: 0 }, "⏱ " + toDisplayString(movie.runtime), 1)) : createCommentVNode("", true),
                            movie.movie_url ? (openBlock(), createBlock("span", {
                              key: 1,
                              class: "flex items-center gap-1"
                            }, [
                              (openBlock(), createBlock("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                viewBox: "0 0 20 20",
                                fill: "currentColor",
                                class: "w-3 h-3 text-blue-500"
                              }, [
                                createVNode("path", { d: "M4 4a2 2 0 012-2h4a2 2 0 012 2v1h1a2 2 0 012 2v2h-2V7H5v8h4v2H6a2 2 0 01-2-2V4zm7 2V4H6v2h5z" }),
                                createVNode("path", { d: "M13 11a1 1 0 011-1h3a1 1 0 011 1v5a1 1 0 01-1 1h-3a1 1 0 01-1-1v-5zm2 4h1v-3h-1v3z" })
                              ])),
                              createTextVNode(" Stream URL set ")
                            ])) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", { class: "md:col-span-1 flex flex-col items-end justify-center space-y-2" }, [
                          createVNode(unref(Link), {
                            href: `/admin/page-content/${movie.id}`,
                            class: "w-full px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors text-center"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" View ")
                            ]),
                            _: 1
                          }, 8, ["href"]),
                          createVNode(unref(Link), {
                            href: `/admin/page-content/${movie.id}/edit`,
                            class: "w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Edit ")
                            ]),
                            _: 1
                          }, 8, ["href"]),
                          createVNode("button", {
                            onClick: ($event) => deleteMovie(movie.id),
                            class: "w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          }, " Delete ", 8, ["onClick"])
                        ])
                      ])
                    ]);
                  }), 128))
                ]))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$U = _sfc_main$U.setup;
_sfc_main$U.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/PageContent/Index.vue");
  return _sfc_setup$U ? _sfc_setup$U(props, ctx) : void 0;
};
const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$U
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$T = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    content: Object
  },
  setup(__props) {
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">${ssrInterpolate(__props.content.title)}</h1><p class="text-muted-foreground">Movie details</p></div><div class="flex space-x-2">`);
      _push(ssrRenderComponent(unref(Link), {
        href: `/admin/page-content/${__props.content.id}/edit`,
        class: "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Edit), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Edit `);
          } else {
            return [
              createVNode(unref(Edit), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Edit ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/page-content",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Movies `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Movies ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow p-6"><div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"><div class="md:col-span-1"><h3 class="text-lg font-semibold text-foreground mb-4">Poster</h3>`);
      if (__props.content.poster) {
        _push(`<img${ssrRenderAttr("src", __props.content.poster)}${ssrRenderAttr("alt", __props.content.title)} class="w-full h-auto rounded-lg shadow-lg">`);
      } else {
        _push(`<div class="w-full h-96 bg-muted rounded-lg flex items-center justify-center"><p class="text-muted-foreground">No poster image</p></div>`);
      }
      _push(`</div><div class="md:col-span-2"><h3 class="text-lg font-semibold text-foreground mb-4">Basic Information</h3><dl class="space-y-4"><div><dt class="text-sm font-medium text-muted-foreground">Title</dt><dd class="text-foreground text-lg font-semibold">${ssrInterpolate(__props.content.title)}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Page Identifier</dt><dd class="text-foreground">${ssrInterpolate(__props.content.page || "N/A")}</dd></div><div class="grid grid-cols-2 gap-4"><div><dt class="text-sm font-medium text-muted-foreground">Release Year</dt><dd class="text-foreground">${ssrInterpolate(__props.content.year || "N/A")}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Rating</dt><dd class="text-foreground">${ssrInterpolate(__props.content.rating || "N/A")}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Runtime</dt><dd class="text-foreground">${ssrInterpolate(__props.content.runtime || "N/A")}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Status</dt><dd><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", __props.content.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"])}">${ssrInterpolate(__props.content.is_active ? "Active" : "Inactive")}</span></dd></div><div class="col-span-2"><dt class="text-sm font-medium text-muted-foreground">Movie Stream URL</dt><dd class="text-foreground break-all">`);
      if (__props.content.movie_url) {
        _push(`<a${ssrRenderAttr("href", __props.content.movie_url)} target="_blank" rel="noopener" class="text-blue-500 hover:underline">${ssrInterpolate(__props.content.movie_url)}</a>`);
      } else {
        _push(`<!--[--> Not set <!--]-->`);
      }
      _push(`</dd></div></div>`);
      if (__props.content.genres && __props.content.genres.length) {
        _push(`<div><dt class="text-sm font-medium text-muted-foreground mb-2">Genres</dt><dd class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(__props.content.genres, (genre) => {
          _push(`<span class="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">${ssrInterpolate(genre)}</span>`);
        });
        _push(`<!--]--></dd></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</dl></div></div>`);
      if (__props.content.backdrop) {
        _push(`<div class="mb-8"><h3 class="text-lg font-semibold text-foreground mb-4">Backdrop</h3><div class="rounded-lg overflow-hidden"><img${ssrRenderAttr("src", __props.content.backdrop)}${ssrRenderAttr("alt", __props.content.title + " backdrop")} class="w-full h-auto"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.content.logline) {
        _push(`<div class="mb-8"><h3 class="text-lg font-semibold text-foreground mb-4">Logline</h3><div class="bg-muted p-4 rounded-lg"><p class="text-foreground">${ssrInterpolate(__props.content.logline)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.content.synopsis) {
        _push(`<div class="mb-8"><h3 class="text-lg font-semibold text-foreground mb-4">Synopsis</h3><div class="bg-muted p-4 rounded-lg"><p class="text-foreground whitespace-pre-wrap">${ssrInterpolate(__props.content.synopsis)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="pt-6 border-t border-border"><h3 class="text-lg font-semibold text-foreground mb-4">Timestamps</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><dt class="text-sm font-medium text-muted-foreground">Created</dt><dd class="text-foreground">${ssrInterpolate(formatDate(__props.content.created_at))}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Last Updated</dt><dd class="text-foreground">${ssrInterpolate(formatDate(__props.content.updated_at))}</dd></div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup$T = _sfc_main$T.setup;
_sfc_main$T.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/PageContent/Show.vue");
  return _sfc_setup$T ? _sfc_setup$T(props, ctx) : void 0;
};
const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$T
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$S = {
  __name: "Create",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      name: "",
      email: "",
      content: "",
      rating: "",
      is_approved: false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Add Review</h1><p class="text-muted-foreground">Add a new review</p></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/reviews",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Reviews `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Reviews ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow p-6"><form><div class="space-y-6"><div><label for="name" class="block text-sm font-medium text-foreground mb-2"> Name * </label><input id="name"${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>`);
      if (unref(form).errors.name) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.name)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="email" class="block text-sm font-medium text-foreground mb-2"> Email </label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">`);
      if (unref(form).errors.email) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="content" class="block text-sm font-medium text-foreground mb-2"> Review Content * </label><textarea id="content" rows="4" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter the review content" required>${ssrInterpolate(unref(form).content)}</textarea>`);
      if (unref(form).errors.content) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.content)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="rating" class="block text-sm font-medium text-foreground mb-2"> Rating * </label><select id="rating" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "") : ssrLooseEqual(unref(form).rating, "")) ? " selected" : ""}>Select rating</option><option value="5"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "5") : ssrLooseEqual(unref(form).rating, "5")) ? " selected" : ""}>5 Stars - Excellent</option><option value="4"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "4") : ssrLooseEqual(unref(form).rating, "4")) ? " selected" : ""}>4 Stars - Very Good</option><option value="3"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "3") : ssrLooseEqual(unref(form).rating, "3")) ? " selected" : ""}>3 Stars - Good</option><option value="2"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "2") : ssrLooseEqual(unref(form).rating, "2")) ? " selected" : ""}>2 Stars - Fair</option><option value="1"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "1") : ssrLooseEqual(unref(form).rating, "1")) ? " selected" : ""}>1 Star - Poor</option></select>`);
      if (unref(form).errors.rating) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.rating)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center"><input id="is_approved"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_approved) ? ssrLooseContain(unref(form).is_approved, null) : unref(form).is_approved) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-border rounded"><label for="is_approved" class="ml-2 block text-sm text-foreground"> Approved (visible on the website) </label></div><div class="flex justify-end space-x-4">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/reviews",
        class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancel `);
          } else {
            return [
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50">`);
      if (unref(form).processing) {
        _push(`<span>Adding...</span>`);
      } else {
        _push(`<span>Add Review</span>`);
      }
      _push(`</button></div></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Reviews/Create.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$S
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$R = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    review: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      name: props.review?.name ?? "",
      email: props.review?.email ?? "",
      content: props.review?.content ?? "",
      rating: props.review?.rating ?? "",
      is_approved: props.review?.is_approved ?? false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Edit Review</h1><p class="text-muted-foreground">Update review details</p></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/reviews",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Reviews `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Reviews ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow p-6"><form><div class="space-y-6"><div><label for="name" class="block text-sm font-medium text-foreground mb-2"> Name * </label><input id="name"${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>`);
      if (unref(form).errors.name) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.name)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="email" class="block text-sm font-medium text-foreground mb-2"> Email </label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">`);
      if (unref(form).errors.email) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="content" class="block text-sm font-medium text-foreground mb-2"> Review Content * </label><textarea id="content" rows="4" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter the review content" required>${ssrInterpolate(unref(form).content)}</textarea>`);
      if (unref(form).errors.content) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.content)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="rating" class="block text-sm font-medium text-foreground mb-2"> Rating * </label><select id="rating" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "") : ssrLooseEqual(unref(form).rating, "")) ? " selected" : ""}>Select rating</option><option value="5"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "5") : ssrLooseEqual(unref(form).rating, "5")) ? " selected" : ""}>5 Stars - Excellent</option><option value="4"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "4") : ssrLooseEqual(unref(form).rating, "4")) ? " selected" : ""}>4 Stars - Very Good</option><option value="3"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "3") : ssrLooseEqual(unref(form).rating, "3")) ? " selected" : ""}>3 Stars - Good</option><option value="2"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "2") : ssrLooseEqual(unref(form).rating, "2")) ? " selected" : ""}>2 Stars - Fair</option><option value="1"${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, "1") : ssrLooseEqual(unref(form).rating, "1")) ? " selected" : ""}>1 Star - Poor</option></select>`);
      if (unref(form).errors.rating) {
        _push(`<div class="mt-1 text-sm text-red-600">${ssrInterpolate(unref(form).errors.rating)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center"><input id="is_approved"${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_approved) ? ssrLooseContain(unref(form).is_approved, null) : unref(form).is_approved) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-border rounded"><label for="is_approved" class="ml-2 block text-sm text-foreground"> Approved (visible on the website) </label></div><div class="flex justify-end space-x-4">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/reviews",
        class: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancel `);
          } else {
            return [
              createTextVNode(" Cancel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50">`);
      if (unref(form).processing) {
        _push(`<span>Updating...</span>`);
      } else {
        _push(`<span>Update Review</span>`);
      }
      _push(`</button></div></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Reviews/Edit.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
const __vite_glob_0_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$R
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$Q = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    reviews: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const reviewItems = computed(() => props.reviews ?? []);
    const approveReview = (id) => {
      if (confirm("Are you sure you want to approve this review?")) {
        router.patch(`/admin/reviews/${id}/approve`);
      }
    };
    const deleteReview = (id) => {
      if (confirm("Are you sure you want to delete this review?")) {
        router.delete(`/admin/reviews/${id}`);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$19, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-card border-b border-border shadow-sm"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex justify-between items-center py-4"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-foreground"${_scopeId}>Manage Reviews</h1><p class="text-muted-foreground"${_scopeId}>Customer reviews and ratings</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/reviews/create",
              class: "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Plus), { class: "h-4 w-4 mr-2" }, null, _parent3, _scopeId2));
                  _push3(` Add Review `);
                } else {
                  return [
                    createVNode(unref(Plus), { class: "h-4 w-4 mr-2" }),
                    createTextVNode(" Add Review ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"${_scopeId}><div class="bg-card rounded-lg shadow"${_scopeId}><div class="px-6 py-4 border-b border-border"${_scopeId}><h2 class="text-lg font-semibold text-foreground"${_scopeId}>All Reviews</h2></div><div class="p-6"${_scopeId}>`);
            if (reviewItems.value.length === 0) {
              _push2(`<div class="text-center py-8"${_scopeId}><p class="text-muted-foreground"${_scopeId}>No reviews found. Add your first review to get started.</p></div>`);
            } else {
              _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
              ssrRenderList(reviewItems.value, (review) => {
                _push2(`<div class="flex items-center justify-between p-4 border border-border rounded-lg"${_scopeId}><div class="flex items-center space-x-4"${_scopeId}><div${_scopeId}><h3 class="font-medium text-foreground"${_scopeId}>${ssrInterpolate(review.name)}</h3><p class="text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(review.content.substring(0, 100))}...</p><div class="flex items-center space-x-2 mt-1"${_scopeId}><div class="flex items-center"${_scopeId}><!--[-->`);
                ssrRenderList(5, (i2) => {
                  _push2(`<span class="text-yellow-400"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Star), {
                    class: [i2 <= review.rating ? "fill-current" : "", "h-4 w-4"]
                  }, null, _parent2, _scopeId));
                  _push2(`</span>`);
                });
                _push2(`<!--]--></div><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", review.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"])}"${_scopeId}>${ssrInterpolate(review.is_approved ? "Approved" : "Pending")}</span></div></div></div><div class="flex items-center space-x-2"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/admin/reviews/${review.id}`,
                  class: "px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` View `);
                    } else {
                      return [
                        createTextVNode(" View ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/admin/reviews/${review.id}/edit`,
                  class: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Edit `);
                    } else {
                      return [
                        createTextVNode(" Edit ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                if (!review.is_approved) {
                  _push2(`<button class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"${_scopeId}> Approve </button>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<button class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"${_scopeId}> Delete </button></div></div>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-card border-b border-border shadow-sm" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex justify-between items-center py-4" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-foreground" }, "Manage Reviews"),
                      createVNode("p", { class: "text-muted-foreground" }, "Customer reviews and ratings")
                    ]),
                    createVNode(unref(Link), {
                      href: "/admin/reviews/create",
                      class: "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Plus), { class: "h-4 w-4 mr-2" }),
                        createTextVNode(" Add Review ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }, [
                createVNode("div", { class: "bg-card rounded-lg shadow" }, [
                  createVNode("div", { class: "px-6 py-4 border-b border-border" }, [
                    createVNode("h2", { class: "text-lg font-semibold text-foreground" }, "All Reviews")
                  ]),
                  createVNode("div", { class: "p-6" }, [
                    reviewItems.value.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-center py-8"
                    }, [
                      createVNode("p", { class: "text-muted-foreground" }, "No reviews found. Add your first review to get started.")
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "space-y-4"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(reviewItems.value, (review) => {
                        return openBlock(), createBlock("div", {
                          key: review.id,
                          class: "flex items-center justify-between p-4 border border-border rounded-lg"
                        }, [
                          createVNode("div", { class: "flex items-center space-x-4" }, [
                            createVNode("div", null, [
                              createVNode("h3", { class: "font-medium text-foreground" }, toDisplayString(review.name), 1),
                              createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(review.content.substring(0, 100)) + "...", 1),
                              createVNode("div", { class: "flex items-center space-x-2 mt-1" }, [
                                createVNode("div", { class: "flex items-center" }, [
                                  (openBlock(), createBlock(Fragment, null, renderList(5, (i2) => {
                                    return createVNode("span", {
                                      key: i2,
                                      class: "text-yellow-400"
                                    }, [
                                      createVNode(unref(Star), {
                                        class: [i2 <= review.rating ? "fill-current" : "", "h-4 w-4"]
                                      }, null, 8, ["class"])
                                    ]);
                                  }), 64))
                                ]),
                                createVNode("span", {
                                  class: ["px-2 py-1 text-xs rounded-full", review.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"]
                                }, toDisplayString(review.is_approved ? "Approved" : "Pending"), 3)
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "flex items-center space-x-2" }, [
                            createVNode(unref(Link), {
                              href: `/admin/reviews/${review.id}`,
                              class: "px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" View ")
                              ]),
                              _: 1
                            }, 8, ["href"]),
                            createVNode(unref(Link), {
                              href: `/admin/reviews/${review.id}/edit`,
                              class: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Edit ")
                              ]),
                              _: 1
                            }, 8, ["href"]),
                            !review.is_approved ? (openBlock(), createBlock("button", {
                              key: 0,
                              onClick: ($event) => approveReview(review.id),
                              class: "px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            }, " Approve ", 8, ["onClick"])) : createCommentVNode("", true),
                            createVNode("button", {
                              onClick: ($event) => deleteReview(review.id),
                              class: "px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            }, " Delete ", 8, ["onClick"])
                          ])
                        ]);
                      }), 128))
                    ]))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Reviews/Index.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const __vite_glob_0_23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$Q
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$P = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    review: Object
  },
  setup(__props) {
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Review Details</h1><p class="text-muted-foreground">View review information</p></div><div class="flex space-x-2">`);
      _push(ssrRenderComponent(unref(Link), {
        href: `/admin/reviews/${__props.review.id}/edit`,
        class: "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Edit), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Edit `);
          } else {
            return [
              createVNode(unref(Edit), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Edit ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/admin/reviews",
        class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Reviews `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
              createTextVNode(" Back to Reviews ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-card rounded-lg shadow p-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h3 class="text-lg font-semibold text-foreground mb-4">Review Information</h3><dl class="space-y-3"><div><dt class="text-sm font-medium text-muted-foreground">Name</dt><dd class="text-foreground">${ssrInterpolate(__props.review.name)}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Email</dt><dd class="text-foreground">${ssrInterpolate(__props.review.email || "No email provided")}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Rating</dt><dd class="text-foreground"><div class="flex items-center"><!--[-->`);
      ssrRenderList(5, (i2) => {
        _push(`<span class="text-yellow-400">`);
        _push(ssrRenderComponent(unref(Star), {
          class: [i2 <= __props.review.rating ? "fill-current" : "", "h-4 w-4"]
        }, null, _parent));
        _push(`</span>`);
      });
      _push(`<!--]--><span class="ml-2">${ssrInterpolate(__props.review.rating)}/5</span></div></dd></div><div><dt class="text-sm font-medium text-muted-foreground">Status</dt><dd><span class="${ssrRenderClass(["px-2 py-1 text-xs rounded-full", __props.review.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"])}">${ssrInterpolate(__props.review.is_approved ? "Approved" : "Pending Approval")}</span></dd></div></dl></div><div><h3 class="text-lg font-semibold text-foreground mb-4">Review Content</h3><div class="bg-muted p-4 rounded-md"><p class="text-foreground">${ssrInterpolate(__props.review.content)}</p></div></div></div><div class="mt-8 pt-6 border-t border-border"><h3 class="text-lg font-semibold text-foreground mb-4">Timestamps</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><dt class="text-sm font-medium text-muted-foreground">Created</dt><dd class="text-foreground">${ssrInterpolate(formatDate(__props.review.created_at))}</dd></div><div><dt class="text-sm font-medium text-muted-foreground">Last Updated</dt><dd class="text-foreground">${ssrInterpolate(formatDate(__props.review.updated_at))}</dd></div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Reviews/Show.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const __vite_glob_0_24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$P
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$O = {
  __name: "Settings",
  __ssrInlineRender: true,
  props: {
    settings: {
      type: Object,
      default: () => ({})
    },
    settingsList: {
      type: Array,
      default: () => []
    },
    availableSettings: {
      type: Array,
      default: () => []
    },
    envInfo: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    const props = __props;
    const showSuccess = ref(false);
    const formData = reactive({
      premiere_date: "",
      site_title: "",
      site_description: "",
      contact_email: "",
      enable_contact_form: false,
      enable_reviews: false,
      reviews_require_approval: false,
      maintenance_mode: false,
      max_file_upload_mb: 50
    });
    const initializeFormData = () => {
      Object.keys(formData).forEach((key) => {
        if (props.settings && props.settings[key]) {
          const settingValue = props.settings[key].value;
          if (typeof formData[key] === "boolean") {
            formData[key] = settingValue === "true" || settingValue === true;
          } else if (typeof formData[key] === "number") {
            formData[key] = parseInt(settingValue);
          } else {
            formData[key] = settingValue;
          }
        }
      });
    };
    onMounted(() => {
      initializeFormData();
    });
    const toggleSetting = (key) => {
      formData[key] = !formData[key];
    };
    const handleSubmit = () => {
      const settingsArray = Object.entries(formData).map(([key, value]) => {
        let dataType = "string";
        if (typeof value === "boolean") dataType = "boolean";
        if (typeof value === "number") dataType = key.includes("date") ? "string" : "integer";
        return {
          key,
          value: String(value),
          data_type: dataType,
          description: props.availableSettings.find((s2) => s2.key === key)?.description
        };
      });
      router.post("/admin/settings", { settings: settingsArray }, {
        onSuccess: () => {
          showSuccess.value = true;
          setTimeout(() => {
            showSuccess.value = false;
          }, 3e3);
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Settings" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$19, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-white shadow"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"${_scopeId}><h1 class="text-3xl font-bold text-gray-900"${_scopeId}>Database Settings</h1><p class="mt-1 text-gray-600"${_scopeId}>Manage key site features and configurations</p><div class="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><svg class="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><div class="flex-1"${_scopeId}><p class="text-sm font-semibold text-blue-900 mb-2"${_scopeId}>Current Environment Configuration</p><div class="grid grid-cols-2 gap-3 text-xs"${_scopeId}><div${_scopeId}><span class="text-blue-700 font-medium"${_scopeId}>Environment:</span><span class="ml-2 text-blue-900"${_scopeId}>${ssrInterpolate(__props.envInfo?.app_env || "N/A")}</span></div><div${_scopeId}><span class="text-blue-700 font-medium"${_scopeId}>App Name:</span><span class="ml-2 text-blue-900"${_scopeId}>${ssrInterpolate(__props.envInfo?.app_name || "N/A")}</span></div><div${_scopeId}><span class="text-blue-700 font-medium"${_scopeId}>App URL:</span><span class="ml-2 text-blue-900"${_scopeId}>${ssrInterpolate(__props.envInfo?.app_url || "N/A")}</span></div><div${_scopeId}><span class="text-blue-700 font-medium"${_scopeId}>Mail From:</span><span class="ml-2 text-blue-900"${_scopeId}>${ssrInterpolate(__props.envInfo?.mail_from || "N/A")}</span></div></div><p class="text-xs text-blue-700 mt-3"${_scopeId}> Some settings below use values from your .env file as defaults. Database settings override these defaults when saved. </p></div></div></div><div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"${_scopeId}><p class="text-sm text-yellow-800 mb-2"${_scopeId}><strong${_scopeId}>Need to Edit API Keys or Database Credentials?</strong></p><p class="text-xs text-yellow-700 mb-3"${_scopeId}> These are runtime database settings. For .env configuration (API keys, database credentials, email/SMS settings, payment keys, etc.), use the Environment Settings page. </p>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/env-settings",
              class: "inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"${_scopeId2}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId2}></path></svg> Configure Environment Variables (.env) `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4 mr-2",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      }),
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      })
                    ])),
                    createTextVNode(" Configure Environment Variables (.env) ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"${_scopeId}><form class="space-y-8"${_scopeId}>`);
            if (showSuccess.value) {
              _push2(`<div class="rounded-md bg-green-50 p-4"${_scopeId}><p class="text-sm font-medium text-green-800"${_scopeId}>Settings saved successfully!</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="bg-white rounded-lg shadow p-6"${_scopeId}><h2 class="text-xl font-semibold text-gray-900 mb-6"${_scopeId}>Premiere Settings</h2><div class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}> Premiere Date &amp; Time </label><input${ssrRenderAttr("value", formData.premiere_date)} type="datetime-local" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"${_scopeId}><p class="mt-1 text-xs text-gray-500"${_scopeId}> Format: ISO 8601 (e.g., 2025-12-10T06:00:00Z) </p></div></div></div><div class="bg-white rounded-lg shadow p-6"${_scopeId}><h2 class="text-xl font-semibold text-gray-900 mb-6"${_scopeId}>Feature Controls</h2><div class="space-y-4"${_scopeId}><div class="flex items-center justify-between py-3 border-b border-gray-200"${_scopeId}><div${_scopeId}><p class="font-medium text-gray-900"${_scopeId}>Contact Form</p><p class="text-sm text-gray-500"${_scopeId}>Allow visitors to submit contact requests</p></div><button type="button" class="${ssrRenderClass([
              formData.enable_contact_form ? "bg-red-600" : "bg-gray-300",
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            ])}"${_scopeId}><span class="${ssrRenderClass([
              formData.enable_contact_form ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200"
            ])}"${_scopeId}></span></button></div><div class="flex items-center justify-between py-3 border-b border-gray-200"${_scopeId}><div${_scopeId}><p class="font-medium text-gray-900"${_scopeId}>Reviews</p><p class="text-sm text-gray-500"${_scopeId}>Allow visitors to submit reviews</p></div><button type="button" class="${ssrRenderClass([
              formData.enable_reviews ? "bg-red-600" : "bg-gray-300",
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            ])}"${_scopeId}><span class="${ssrRenderClass([
              formData.enable_reviews ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200"
            ])}"${_scopeId}></span></button></div><div class="flex items-center justify-between py-3 border-b border-gray-200"${_scopeId}><div${_scopeId}><p class="font-medium text-gray-900"${_scopeId}>Require Review Approval</p><p class="text-sm text-gray-500"${_scopeId}>Moderate reviews before publishing</p></div><button type="button" class="${ssrRenderClass([
              formData.reviews_require_approval ? "bg-red-600" : "bg-gray-300",
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            ])}"${_scopeId}><span class="${ssrRenderClass([
              formData.reviews_require_approval ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200"
            ])}"${_scopeId}></span></button></div><div class="flex items-center justify-between py-3"${_scopeId}><div${_scopeId}><p class="font-medium text-gray-900"${_scopeId}>Maintenance Mode</p><p class="text-sm text-gray-500"${_scopeId}>Show maintenance page to visitors</p></div><button type="button" class="${ssrRenderClass([
              formData.maintenance_mode ? "bg-yellow-600" : "bg-gray-300",
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            ])}"${_scopeId}><span class="${ssrRenderClass([
              formData.maintenance_mode ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200"
            ])}"${_scopeId}></span></button></div></div></div><div class="bg-white rounded-lg shadow p-6"${_scopeId}><h2 class="text-xl font-semibold text-gray-900 mb-6"${_scopeId}>Additional Settings</h2><div class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}> Site Title `);
            if (!formData.site_title) {
              _push2(`<span class="ml-2 text-xs text-gray-500"${_scopeId}> (Using .env: ${ssrInterpolate(__props.envInfo?.app_name)}) </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</label><input${ssrRenderAttr("value", formData.site_title)} type="text"${ssrRenderAttr("placeholder", __props.envInfo?.app_name || "A Crazy Day in Accra")} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"${_scopeId}><p class="mt-1 text-xs text-gray-500"${_scopeId}> Leave empty to use APP_NAME from .env </p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}> Site Description </label><textarea rows="3" placeholder="A gripping thriller set in Accra..." class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"${_scopeId}>${ssrInterpolate(formData.site_description)}</textarea><p class="mt-1 text-xs text-gray-500"${_scopeId}> SEO meta description for your site </p></div></div></div><div class="bg-white rounded-lg shadow p-6"${_scopeId}><h2 class="text-xl font-semibold text-gray-900 mb-6"${_scopeId}>Contact Settings</h2><div class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}> Contact Email Address `);
            if (!formData.contact_email) {
              _push2(`<span class="ml-2 text-xs text-gray-500"${_scopeId}> (Using .env: ${ssrInterpolate(__props.envInfo?.mail_from)}) </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</label><input${ssrRenderAttr("value", formData.contact_email)} type="email"${ssrRenderAttr("placeholder", __props.envInfo?.mail_from || "contact@example.com")} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"${_scopeId}><p class="mt-1 text-xs text-gray-500"${_scopeId}> Email to receive contact form submissions (defaults to MAIL_FROM_ADDRESS) </p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}> Max File Upload Size (MB) </label><input${ssrRenderAttr("value", formData.max_file_upload_mb)} type="number" min="1" max="500" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"${_scopeId}><p class="mt-1 text-xs text-gray-500"${_scopeId}> Maximum file size allowed for uploads </p></div></div></div><div class="flex gap-3"${_scopeId}><button type="submit" class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"${_scopeId}> Save Settings </button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin",
              class: "px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Back to Dashboard `);
                } else {
                  return [
                    createTextVNode(" Back to Dashboard ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-white shadow" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" }, [
                  createVNode("h1", { class: "text-3xl font-bold text-gray-900" }, "Database Settings"),
                  createVNode("p", { class: "mt-1 text-gray-600" }, "Manage key site features and configurations"),
                  createVNode("div", { class: "mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg" }, [
                    createVNode("div", { class: "flex items-start gap-3" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        })
                      ])),
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("p", { class: "text-sm font-semibold text-blue-900 mb-2" }, "Current Environment Configuration"),
                        createVNode("div", { class: "grid grid-cols-2 gap-3 text-xs" }, [
                          createVNode("div", null, [
                            createVNode("span", { class: "text-blue-700 font-medium" }, "Environment:"),
                            createVNode("span", { class: "ml-2 text-blue-900" }, toDisplayString(__props.envInfo?.app_env || "N/A"), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode("span", { class: "text-blue-700 font-medium" }, "App Name:"),
                            createVNode("span", { class: "ml-2 text-blue-900" }, toDisplayString(__props.envInfo?.app_name || "N/A"), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode("span", { class: "text-blue-700 font-medium" }, "App URL:"),
                            createVNode("span", { class: "ml-2 text-blue-900" }, toDisplayString(__props.envInfo?.app_url || "N/A"), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode("span", { class: "text-blue-700 font-medium" }, "Mail From:"),
                            createVNode("span", { class: "ml-2 text-blue-900" }, toDisplayString(__props.envInfo?.mail_from || "N/A"), 1)
                          ])
                        ]),
                        createVNode("p", { class: "text-xs text-blue-700 mt-3" }, " Some settings below use values from your .env file as defaults. Database settings override these defaults when saved. ")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg" }, [
                    createVNode("p", { class: "text-sm text-yellow-800 mb-2" }, [
                      createVNode("strong", null, "Need to Edit API Keys or Database Credentials?")
                    ]),
                    createVNode("p", { class: "text-xs text-yellow-700 mb-3" }, " These are runtime database settings. For .env configuration (API keys, database credentials, email/SMS settings, payment keys, etc.), use the Environment Settings page. "),
                    createVNode(unref(Link), {
                      href: "/admin/env-settings",
                      class: "inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium transition-colors"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4 mr-2",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          }),
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          })
                        ])),
                        createTextVNode(" Configure Environment Variables (.env) ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }, [
                createVNode("form", {
                  onSubmit: withModifiers(handleSubmit, ["prevent"]),
                  class: "space-y-8"
                }, [
                  showSuccess.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "rounded-md bg-green-50 p-4"
                  }, [
                    createVNode("p", { class: "text-sm font-medium text-green-800" }, "Settings saved successfully!")
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "bg-white rounded-lg shadow p-6" }, [
                    createVNode("h2", { class: "text-xl font-semibold text-gray-900 mb-6" }, "Premiere Settings"),
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Premiere Date & Time "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => formData.premiere_date = $event,
                          type: "datetime-local",
                          class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, formData.premiere_date]
                        ]),
                        createVNode("p", { class: "mt-1 text-xs text-gray-500" }, " Format: ISO 8601 (e.g., 2025-12-10T06:00:00Z) ")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-white rounded-lg shadow p-6" }, [
                    createVNode("h2", { class: "text-xl font-semibold text-gray-900 mb-6" }, "Feature Controls"),
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "flex items-center justify-between py-3 border-b border-gray-200" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "font-medium text-gray-900" }, "Contact Form"),
                          createVNode("p", { class: "text-sm text-gray-500" }, "Allow visitors to submit contact requests")
                        ]),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => toggleSetting("enable_contact_form"),
                          class: [
                            formData.enable_contact_form ? "bg-red-600" : "bg-gray-300",
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          ]
                        }, [
                          createVNode("span", {
                            class: [
                              formData.enable_contact_form ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200"
                            ]
                          }, null, 2)
                        ], 10, ["onClick"])
                      ]),
                      createVNode("div", { class: "flex items-center justify-between py-3 border-b border-gray-200" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "font-medium text-gray-900" }, "Reviews"),
                          createVNode("p", { class: "text-sm text-gray-500" }, "Allow visitors to submit reviews")
                        ]),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => toggleSetting("enable_reviews"),
                          class: [
                            formData.enable_reviews ? "bg-red-600" : "bg-gray-300",
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          ]
                        }, [
                          createVNode("span", {
                            class: [
                              formData.enable_reviews ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200"
                            ]
                          }, null, 2)
                        ], 10, ["onClick"])
                      ]),
                      createVNode("div", { class: "flex items-center justify-between py-3 border-b border-gray-200" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "font-medium text-gray-900" }, "Require Review Approval"),
                          createVNode("p", { class: "text-sm text-gray-500" }, "Moderate reviews before publishing")
                        ]),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => toggleSetting("reviews_require_approval"),
                          class: [
                            formData.reviews_require_approval ? "bg-red-600" : "bg-gray-300",
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          ]
                        }, [
                          createVNode("span", {
                            class: [
                              formData.reviews_require_approval ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200"
                            ]
                          }, null, 2)
                        ], 10, ["onClick"])
                      ]),
                      createVNode("div", { class: "flex items-center justify-between py-3" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "font-medium text-gray-900" }, "Maintenance Mode"),
                          createVNode("p", { class: "text-sm text-gray-500" }, "Show maintenance page to visitors")
                        ]),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => toggleSetting("maintenance_mode"),
                          class: [
                            formData.maintenance_mode ? "bg-yellow-600" : "bg-gray-300",
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          ]
                        }, [
                          createVNode("span", {
                            class: [
                              formData.maintenance_mode ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ease-in-out duration-200"
                            ]
                          }, null, 2)
                        ], 10, ["onClick"])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-white rounded-lg shadow p-6" }, [
                    createVNode("h2", { class: "text-xl font-semibold text-gray-900 mb-6" }, "Additional Settings"),
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, [
                          createTextVNode(" Site Title "),
                          !formData.site_title ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "ml-2 text-xs text-gray-500"
                          }, " (Using .env: " + toDisplayString(__props.envInfo?.app_name) + ") ", 1)) : createCommentVNode("", true)
                        ]),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => formData.site_title = $event,
                          type: "text",
                          placeholder: __props.envInfo?.app_name || "A Crazy Day in Accra",
                          class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                          [vModelText, formData.site_title]
                        ]),
                        createVNode("p", { class: "mt-1 text-xs text-gray-500" }, " Leave empty to use APP_NAME from .env ")
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Site Description "),
                        withDirectives(createVNode("textarea", {
                          "onUpdate:modelValue": ($event) => formData.site_description = $event,
                          rows: "3",
                          placeholder: "A gripping thriller set in Accra...",
                          class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, formData.site_description]
                        ]),
                        createVNode("p", { class: "mt-1 text-xs text-gray-500" }, " SEO meta description for your site ")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-white rounded-lg shadow p-6" }, [
                    createVNode("h2", { class: "text-xl font-semibold text-gray-900 mb-6" }, "Contact Settings"),
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, [
                          createTextVNode(" Contact Email Address "),
                          !formData.contact_email ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "ml-2 text-xs text-gray-500"
                          }, " (Using .env: " + toDisplayString(__props.envInfo?.mail_from) + ") ", 1)) : createCommentVNode("", true)
                        ]),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => formData.contact_email = $event,
                          type: "email",
                          placeholder: __props.envInfo?.mail_from || "contact@example.com",
                          class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                          [vModelText, formData.contact_email]
                        ]),
                        createVNode("p", { class: "mt-1 text-xs text-gray-500" }, " Email to receive contact form submissions (defaults to MAIL_FROM_ADDRESS) ")
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Max File Upload Size (MB) "),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => formData.max_file_upload_mb = $event,
                          type: "number",
                          min: "1",
                          max: "500",
                          class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [
                            vModelText,
                            formData.max_file_upload_mb,
                            void 0,
                            { number: true }
                          ]
                        ]),
                        createVNode("p", { class: "mt-1 text-xs text-gray-500" }, " Maximum file size allowed for uploads ")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "flex gap-3" }, [
                    createVNode("button", {
                      type: "submit",
                      class: "px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                    }, " Save Settings "),
                    createVNode(unref(Link), {
                      href: "/admin",
                      class: "px-6 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 font-medium"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Back to Dashboard ")
                      ]),
                      _: 1
                    })
                  ])
                ], 32)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Settings.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const __vite_glob_0_25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$O
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$N = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    usersWithPhones: { type: Array, default: () => [] },
    stats: { type: Object, default: () => ({ total_users_with_phones: 0 }) }
  },
  setup(__props) {
    const props = __props;
    const selected = ref([]);
    const customForm = useForm({
      user_ids: [],
      message: ""
    });
    const paymentForm = useForm({
      movie_title: "",
      amount: ""
    });
    const renewalForm = useForm({
      movie_title: "",
      days_remaining: ""
    });
    const toggleAll = (checked) => {
      selected.value = checked ? props.usersWithPhones.map((u2) => u2.id) : [];
    };
    const toggleUser = (id, checked) => {
      if (checked) {
        if (!selected.value.includes(id)) selected.value.push(id);
      } else {
        selected.value = selected.value.filter((x) => x !== id);
      }
    };
    const submitCustom = () => {
      customForm.user_ids = selected.value;
      customForm.post(route("admin.sms.custom"), {
        onSuccess: () => {
          selected.value = [];
          customForm.reset();
        }
      });
    };
    const submitPayment = () => {
      paymentForm.post(route("admin.sms.payment-notifications"), {
        onSuccess: () => paymentForm.reset()
      });
    };
    const submitRenewal = () => {
      renewalForm.post(route("admin.sms.renewal-reminders"), {
        onSuccess: () => renewalForm.reset()
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$19, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-6xl mx-auto py-10 space-y-8"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Head), { title: "SMS Management" }, null, _parent2, _scopeId));
            _push2(`<header${_scopeId}><h1 class="text-3xl font-bold"${_scopeId}>SMS Management</h1><p class="text-muted-foreground"${_scopeId}>Send bulk SMS notifications to your users.</p></header><section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4"${_scopeId}><div class="bg-card border border-border rounded-lg p-4"${_scopeId}><p class="text-sm text-muted-foreground"${_scopeId}>Users with phones</p><p class="text-3xl font-bold"${_scopeId}>${ssrInterpolate(__props.stats.total_users_with_phones ?? 0)}</p></div></section><section class="grid gap-6 md:grid-cols-2"${_scopeId}><div class="bg-card border border-border rounded-lg p-6 space-y-4"${_scopeId}><div${_scopeId}><h2 class="text-xl font-semibold"${_scopeId}>Send Custom SMS</h2><p class="text-sm text-muted-foreground"${_scopeId}>Send a custom message to selected users</p></div><div class="space-y-2"${_scopeId}><div class="flex items-center space-x-2"${_scopeId}><input id="select-all" type="checkbox"${ssrIncludeBooleanAttr(selected.value.length === __props.usersWithPhones.length && __props.usersWithPhones.length > 0) ? " checked" : ""}${_scopeId}><label for="select-all" class="text-sm"${_scopeId}>Select all (${ssrInterpolate(__props.usersWithPhones.length)})</label><span class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(selected.value.length)} selected</span></div><div class="max-h-48 overflow-y-auto border rounded p-2 space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.usersWithPhones, (user) => {
              _push2(`<div class="flex items-center space-x-2"${_scopeId}><input${ssrRenderAttr("id", `user-${user.id}`)} type="checkbox"${ssrIncludeBooleanAttr(selected.value.includes(user.id)) ? " checked" : ""}${_scopeId}><label${ssrRenderAttr("for", `user-${user.id}`)} class="text-sm"${_scopeId}>${ssrInterpolate(user.name)} (${ssrInterpolate(user.phone_number)})</label></div>`);
            });
            _push2(`<!--]-->`);
            if (__props.usersWithPhones.length === 0) {
              _push2(`<p class="text-sm text-muted-foreground"${_scopeId}>No users with phone numbers.</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><form class="space-y-3"${_scopeId}><div${_scopeId}><label class="text-sm font-medium" for="message"${_scopeId}>Message (max 160 chars)</label><textarea id="message" rows="3" maxlength="160" class="w-full border rounded px-3 py-2" required${_scopeId}>${ssrInterpolate(unref(customForm).message)}</textarea><p class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(unref(customForm).message.length)}/160</p></div><button type="submit" class="w-full bg-primary text-primary-foreground rounded px-4 py-2"${ssrIncludeBooleanAttr(selected.value.length === 0 || unref(customForm).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(customForm).processing ? "Sending…" : "Send SMS")}</button></form></div><div class="bg-card border border-border rounded-lg p-6 space-y-6"${_scopeId}><div${_scopeId}><h2 class="text-xl font-semibold"${_scopeId}>Payment Notifications</h2><p class="text-sm text-muted-foreground"${_scopeId}>Send payment confirmation to all users with phones</p></div><form class="space-y-3"${_scopeId}><div${_scopeId}><label class="text-sm font-medium" for="movie_title"${_scopeId}>Movie title</label><input id="movie_title"${ssrRenderAttr("value", unref(paymentForm).movie_title)} class="w-full border rounded px-3 py-2" required${_scopeId}></div><div${_scopeId}><label class="text-sm font-medium" for="amount"${_scopeId}>Amount</label><input id="amount"${ssrRenderAttr("value", unref(paymentForm).amount)} type="number" min="0" step="0.01" class="w-full border rounded px-3 py-2" required${_scopeId}></div><button type="submit" class="w-full bg-primary text-primary-foreground rounded px-4 py-2"${ssrIncludeBooleanAttr(unref(paymentForm).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(paymentForm).processing ? "Sending…" : "Send Payment Notifications")}</button></form><div class="border-t border-border pt-4 space-y-2"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h3 class="font-semibold"${_scopeId}>Renewal Reminders</h3><p class="text-sm text-muted-foreground"${_scopeId}>Placeholder until subscription logic exists</p></div></div><form class="space-y-3"${_scopeId}><div${_scopeId}><label class="text-sm font-medium" for="renewal-movie-title"${_scopeId}>Movie title</label><input id="renewal-movie-title"${ssrRenderAttr("value", unref(renewalForm).movie_title)} class="w-full border rounded px-3 py-2" required${_scopeId}></div><div${_scopeId}><label class="text-sm font-medium" for="days_remaining"${_scopeId}>Days remaining</label><input id="days_remaining"${ssrRenderAttr("value", unref(renewalForm).days_remaining)} type="number" min="1" max="365" class="w-full border rounded px-3 py-2" required${_scopeId}></div><button type="submit" class="w-full bg-muted text-foreground rounded px-4 py-2"${ssrIncludeBooleanAttr(unref(renewalForm).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(renewalForm).processing ? "Submitting…" : "Send Renewal Reminder")}</button></form></div></div></section></div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-6xl mx-auto py-10 space-y-8" }, [
                createVNode(unref(Head), { title: "SMS Management" }),
                createVNode("header", null, [
                  createVNode("h1", { class: "text-3xl font-bold" }, "SMS Management"),
                  createVNode("p", { class: "text-muted-foreground" }, "Send bulk SMS notifications to your users.")
                ]),
                createVNode("section", { class: "grid gap-4 md:grid-cols-2 lg:grid-cols-4" }, [
                  createVNode("div", { class: "bg-card border border-border rounded-lg p-4" }, [
                    createVNode("p", { class: "text-sm text-muted-foreground" }, "Users with phones"),
                    createVNode("p", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_users_with_phones ?? 0), 1)
                  ])
                ]),
                createVNode("section", { class: "grid gap-6 md:grid-cols-2" }, [
                  createVNode("div", { class: "bg-card border border-border rounded-lg p-6 space-y-4" }, [
                    createVNode("div", null, [
                      createVNode("h2", { class: "text-xl font-semibold" }, "Send Custom SMS"),
                      createVNode("p", { class: "text-sm text-muted-foreground" }, "Send a custom message to selected users")
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode("div", { class: "flex items-center space-x-2" }, [
                        createVNode("input", {
                          id: "select-all",
                          type: "checkbox",
                          checked: selected.value.length === __props.usersWithPhones.length && __props.usersWithPhones.length > 0,
                          onChange: (e2) => toggleAll(e2.target.checked)
                        }, null, 40, ["checked", "onChange"]),
                        createVNode("label", {
                          for: "select-all",
                          class: "text-sm"
                        }, "Select all (" + toDisplayString(__props.usersWithPhones.length) + ")", 1),
                        createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(selected.value.length) + " selected", 1)
                      ]),
                      createVNode("div", { class: "max-h-48 overflow-y-auto border rounded p-2 space-y-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.usersWithPhones, (user) => {
                          return openBlock(), createBlock("div", {
                            key: user.id,
                            class: "flex items-center space-x-2"
                          }, [
                            createVNode("input", {
                              id: `user-${user.id}`,
                              type: "checkbox",
                              checked: selected.value.includes(user.id),
                              onChange: (e2) => toggleUser(user.id, e2.target.checked)
                            }, null, 40, ["id", "checked", "onChange"]),
                            createVNode("label", {
                              for: `user-${user.id}`,
                              class: "text-sm"
                            }, toDisplayString(user.name) + " (" + toDisplayString(user.phone_number) + ")", 9, ["for"])
                          ]);
                        }), 128)),
                        __props.usersWithPhones.length === 0 ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-muted-foreground"
                        }, "No users with phone numbers.")) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("form", {
                      class: "space-y-3",
                      onSubmit: withModifiers(submitCustom, ["prevent"])
                    }, [
                      createVNode("div", null, [
                        createVNode("label", {
                          class: "text-sm font-medium",
                          for: "message"
                        }, "Message (max 160 chars)"),
                        withDirectives(createVNode("textarea", {
                          id: "message",
                          "onUpdate:modelValue": ($event) => unref(customForm).message = $event,
                          rows: "3",
                          maxlength: "160",
                          class: "w-full border rounded px-3 py-2",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(customForm).message]
                        ]),
                        createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(customForm).message.length) + "/160", 1)
                      ]),
                      createVNode("button", {
                        type: "submit",
                        class: "w-full bg-primary text-primary-foreground rounded px-4 py-2",
                        disabled: selected.value.length === 0 || unref(customForm).processing
                      }, toDisplayString(unref(customForm).processing ? "Sending…" : "Send SMS"), 9, ["disabled"])
                    ], 32)
                  ]),
                  createVNode("div", { class: "bg-card border border-border rounded-lg p-6 space-y-6" }, [
                    createVNode("div", null, [
                      createVNode("h2", { class: "text-xl font-semibold" }, "Payment Notifications"),
                      createVNode("p", { class: "text-sm text-muted-foreground" }, "Send payment confirmation to all users with phones")
                    ]),
                    createVNode("form", {
                      class: "space-y-3",
                      onSubmit: withModifiers(submitPayment, ["prevent"])
                    }, [
                      createVNode("div", null, [
                        createVNode("label", {
                          class: "text-sm font-medium",
                          for: "movie_title"
                        }, "Movie title"),
                        withDirectives(createVNode("input", {
                          id: "movie_title",
                          "onUpdate:modelValue": ($event) => unref(paymentForm).movie_title = $event,
                          class: "w-full border rounded px-3 py-2",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(paymentForm).movie_title]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", {
                          class: "text-sm font-medium",
                          for: "amount"
                        }, "Amount"),
                        withDirectives(createVNode("input", {
                          id: "amount",
                          "onUpdate:modelValue": ($event) => unref(paymentForm).amount = $event,
                          type: "number",
                          min: "0",
                          step: "0.01",
                          class: "w-full border rounded px-3 py-2",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(paymentForm).amount]
                        ])
                      ]),
                      createVNode("button", {
                        type: "submit",
                        class: "w-full bg-primary text-primary-foreground rounded px-4 py-2",
                        disabled: unref(paymentForm).processing
                      }, toDisplayString(unref(paymentForm).processing ? "Sending…" : "Send Payment Notifications"), 9, ["disabled"])
                    ], 32),
                    createVNode("div", { class: "border-t border-border pt-4 space-y-2" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("div", null, [
                          createVNode("h3", { class: "font-semibold" }, "Renewal Reminders"),
                          createVNode("p", { class: "text-sm text-muted-foreground" }, "Placeholder until subscription logic exists")
                        ])
                      ]),
                      createVNode("form", {
                        class: "space-y-3",
                        onSubmit: withModifiers(submitRenewal, ["prevent"])
                      }, [
                        createVNode("div", null, [
                          createVNode("label", {
                            class: "text-sm font-medium",
                            for: "renewal-movie-title"
                          }, "Movie title"),
                          withDirectives(createVNode("input", {
                            id: "renewal-movie-title",
                            "onUpdate:modelValue": ($event) => unref(renewalForm).movie_title = $event,
                            class: "w-full border rounded px-3 py-2",
                            required: ""
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(renewalForm).movie_title]
                          ])
                        ]),
                        createVNode("div", null, [
                          createVNode("label", {
                            class: "text-sm font-medium",
                            for: "days_remaining"
                          }, "Days remaining"),
                          withDirectives(createVNode("input", {
                            id: "days_remaining",
                            "onUpdate:modelValue": ($event) => unref(renewalForm).days_remaining = $event,
                            type: "number",
                            min: "1",
                            max: "365",
                            class: "w-full border rounded px-3 py-2",
                            required: ""
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(renewalForm).days_remaining]
                          ])
                        ]),
                        createVNode("button", {
                          type: "submit",
                          class: "w-full bg-muted text-foreground rounded px-4 py-2",
                          disabled: unref(renewalForm).processing
                        }, toDisplayString(unref(renewalForm).processing ? "Submitting…" : "Send Renewal Reminder"), 9, ["disabled"])
                      ], 32)
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Sms/Index.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const __vite_glob_0_26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$N
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$M = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    users: { type: Object, required: true },
    stats: { type: Object, required: true },
    filters: { type: Object, default: () => ({ search: "", filter: "all" }) }
  },
  setup(__props) {
    const props = __props;
    const searchQuery = ref(props.filters.search || "");
    const formatAmount = (amount) => {
      if (!amount) return "0.00";
      return (amount / 100).toFixed(2);
    };
    const formatDate = (value) => {
      if (!value) return "—";
      return new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    };
    const getInitials = (name) => {
      if (!name) return "?";
      return name.split(" ").map((n2) => n2[0]).join("").toUpperCase().slice(0, 2);
    };
    const setFilter = (filter) => {
      router.get(route("admin.subscribers.index"), {
        filter,
        search: searchQuery.value
      }, {
        preserveState: true,
        preserveScroll: true
      });
    };
    const applyFilters = () => {
      router.get(route("admin.subscribers.index"), {
        filter: props.filters.filter,
        search: searchQuery.value
      }, {
        preserveState: true,
        preserveScroll: true
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$19, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-card border-b border-border shadow-sm"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex justify-between items-center py-4"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-foreground"${_scopeId}>Users &amp; Subscribers</h1><p class="text-muted-foreground"${_scopeId}>All registered users and their payment status</p></div><a${ssrRenderAttr("href", _ctx.route("admin.subscribers.export"))} class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Download), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Export CSV </a></div></div></div><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"${_scopeId}><div class="bg-card rounded-lg shadow border border-border p-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Users), { class: "w-5 h-5 text-blue-600" }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><p class="text-sm text-muted-foreground"${_scopeId}>Total Users</p><p class="text-2xl font-bold text-foreground"${_scopeId}>${ssrInterpolate(__props.stats.total_users)}</p></div></div></div><div class="bg-card rounded-lg shadow border border-border p-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-5 h-5 text-green-600" }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><p class="text-sm text-muted-foreground"${_scopeId}>Paid Users</p><p class="text-2xl font-bold text-green-600"${_scopeId}>${ssrInterpolate(__props.stats.paid_users)}</p></div></div></div><div class="bg-card rounded-lg shadow border border-border p-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Clock), { class: "w-5 h-5 text-amber-600" }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><p class="text-sm text-muted-foreground"${_scopeId}>Waiting / Unpaid</p><p class="text-2xl font-bold text-amber-600"${_scopeId}>${ssrInterpolate(__props.stats.unpaid_users)}</p></div></div></div><div class="bg-card rounded-lg shadow border border-border p-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DollarSign), { class: "w-5 h-5 text-purple-600" }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><p class="text-sm text-muted-foreground"${_scopeId}>Total Revenue</p><p class="text-2xl font-bold text-purple-600"${_scopeId}>₵${ssrInterpolate(formatAmount(__props.stats.total_revenue))}</p></div></div></div></div><div class="bg-card rounded-lg shadow border border-border p-4 mb-6"${_scopeId}><div class="flex flex-col md:flex-row gap-4"${_scopeId}><div class="flex-1"${_scopeId}><div class="relative"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }, null, _parent2, _scopeId));
            _push2(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Search by name, email, or phone..." class="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}></div></div><div class="flex gap-2"${_scopeId}><button class="${ssrRenderClass([
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              __props.filters.filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
            ])}"${_scopeId}> All Users </button><button class="${ssrRenderClass([
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              __props.filters.filter === "paid" ? "bg-green-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"
            ])}"${_scopeId}> Paid </button><button class="${ssrRenderClass([
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              __props.filters.filter === "unpaid" ? "bg-amber-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"
            ])}"${_scopeId}> Waiting / Unpaid </button></div></div></div><div class="bg-card rounded-lg shadow border border-border"${_scopeId}><div class="px-6 py-4 border-b border-border flex items-center justify-between"${_scopeId}><h2 class="text-lg font-semibold text-foreground"${_scopeId}>Registered Users</h2><p class="text-sm text-muted-foreground"${_scopeId}> Showing ${ssrInterpolate(__props.users.data.length)} of ${ssrInterpolate(__props.users.total)} users </p></div><div class="overflow-x-auto"${_scopeId}><table class="min-w-full text-sm"${_scopeId}><thead class="bg-muted/50 border-b border-border"${_scopeId}><tr${_scopeId}><th class="px-4 py-3 text-left font-semibold"${_scopeId}>User</th><th class="px-4 py-3 text-left font-semibold"${_scopeId}>Phone</th><th class="px-4 py-3 text-left font-semibold"${_scopeId}>Payment Status</th><th class="px-4 py-3 text-left font-semibold"${_scopeId}>Latest Payment</th><th class="px-4 py-3 text-left font-semibold"${_scopeId}>Subscription</th><th class="px-4 py-3 text-left font-semibold"${_scopeId}>Registered</th></tr></thead><tbody${_scopeId}>`);
            if (__props.users.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="6" class="px-4 py-8 text-center text-muted-foreground"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Users), { class: "w-12 h-12 mx-auto mb-2 opacity-50" }, null, _parent2, _scopeId));
              _push2(`<p${_scopeId}>No users found matching your criteria.</p></td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(__props.users.data, (user) => {
              _push2(`<tr class="border-b border-border hover:bg-muted/30 transition-colors"${_scopeId}><td class="px-4 py-3"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"${_scopeId}><span class="text-sm font-medium text-primary"${_scopeId}>${ssrInterpolate(getInitials(user.name))}</span></div><div${_scopeId}><p class="font-medium text-foreground"${_scopeId}>${ssrInterpolate(user.name || "No Name")}</p><p class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(user.email || "No email")}</p></div></div></td><td class="px-4 py-3"${_scopeId}>`);
              if (user.phone_number) {
                _push2(`<span class="text-foreground"${_scopeId}>${ssrInterpolate(user.phone_number)}</span>`);
              } else {
                _push2(`<span class="text-muted-foreground"${_scopeId}>—</span>`);
              }
              _push2(`</td><td class="px-4 py-3"${_scopeId}><span class="${ssrRenderClass([
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                user.has_paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              ])}"${_scopeId}>`);
              if (user.has_paid) {
                _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-3 h-3" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(Clock), { class: "w-3 h-3" }, null, _parent2, _scopeId));
              }
              _push2(` ${ssrInterpolate(user.has_paid ? `Paid (${user.payment_count}x)` : "Waiting")}</span></td><td class="px-4 py-3"${_scopeId}>`);
              if (user.latest_payment) {
                _push2(`<div${_scopeId}><p class="font-medium text-foreground"${_scopeId}>₵${ssrInterpolate(formatAmount(user.latest_payment.amount))}</p><p class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(user.latest_payment.reference)}</p></div>`);
              } else {
                _push2(`<span class="text-muted-foreground"${_scopeId}>—</span>`);
              }
              _push2(`</td><td class="px-4 py-3"${_scopeId}>`);
              if (user.subscription) {
                _push2(`<div${_scopeId}><span class="${ssrRenderClass([
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  user.subscription.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                ])}"${_scopeId}>${ssrInterpolate(user.subscription.is_active ? "Active" : "Expired")}</span><p class="text-xs text-muted-foreground mt-1"${_scopeId}>${ssrInterpolate(user.subscription.is_active ? "Expires" : "Expired")}: ${ssrInterpolate(formatDate(user.subscription.expires_at))}</p></div>`);
              } else {
                _push2(`<span class="text-muted-foreground"${_scopeId}>—</span>`);
              }
              _push2(`</td><td class="px-4 py-3"${_scopeId}><p class="text-sm text-foreground"${_scopeId}>${ssrInterpolate(formatDate(user.created_at))}</p>`);
              if (user.email_verified) {
                _push2(`<p class="text-xs text-green-600"${_scopeId}>✓ Verified</p>`);
              } else {
                _push2(`<p class="text-xs text-amber-600"${_scopeId}>⚠ Unverified</p>`);
              }
              _push2(`</td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div>`);
            if (__props.users.links?.length > 3) {
              _push2(`<div class="flex items-center justify-between px-6 py-4 border-t border-border"${_scopeId}><div class="text-sm text-muted-foreground"${_scopeId}> Page ${ssrInterpolate(__props.users.current_page)} of ${ssrInterpolate(__props.users.last_page)}</div><div class="flex items-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.users.links, (link) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: link.label,
                  href: link.url || "#",
                  class: ["px-3 py-1 rounded border border-border text-sm", {
                    "bg-primary text-primary-foreground border-primary": link.active,
                    "text-muted-foreground cursor-not-allowed opacity-50": !link.url,
                    "hover:bg-muted": link.url && !link.active
                  }],
                  "preserve-scroll": true
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-card border-b border-border shadow-sm" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex justify-between items-center py-4" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-foreground" }, "Users & Subscribers"),
                      createVNode("p", { class: "text-muted-foreground" }, "All registered users and their payment status")
                    ]),
                    createVNode("a", {
                      href: _ctx.route("admin.subscribers.export"),
                      class: "inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    }, [
                      createVNode(unref(Download), { class: "h-4 w-4 mr-2" }),
                      createTextVNode(" Export CSV ")
                    ], 8, ["href"])
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" }, [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" }, [
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-4" }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center" }, [
                        createVNode(unref(Users), { class: "w-5 h-5 text-blue-600" })
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "Total Users"),
                        createVNode("p", { class: "text-2xl font-bold text-foreground" }, toDisplayString(__props.stats.total_users), 1)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-4" }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "w-10 h-10 bg-green-100 rounded-full flex items-center justify-center" }, [
                        createVNode(unref(CheckCircle), { class: "w-5 h-5 text-green-600" })
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "Paid Users"),
                        createVNode("p", { class: "text-2xl font-bold text-green-600" }, toDisplayString(__props.stats.paid_users), 1)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-4" }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center" }, [
                        createVNode(unref(Clock), { class: "w-5 h-5 text-amber-600" })
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "Waiting / Unpaid"),
                        createVNode("p", { class: "text-2xl font-bold text-amber-600" }, toDisplayString(__props.stats.unpaid_users), 1)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-4" }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center" }, [
                        createVNode(unref(DollarSign), { class: "w-5 h-5 text-purple-600" })
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "Total Revenue"),
                        createVNode("p", { class: "text-2xl font-bold text-purple-600" }, "₵" + toDisplayString(formatAmount(__props.stats.total_revenue)), 1)
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-4 mb-6" }, [
                  createVNode("div", { class: "flex flex-col md:flex-row gap-4" }, [
                    createVNode("div", { class: "flex-1" }, [
                      createVNode("div", { class: "relative" }, [
                        createVNode(unref(Search), { class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                          type: "text",
                          placeholder: "Search by name, email, or phone...",
                          class: "w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                          onKeyup: withKeys(applyFilters, ["enter"])
                        }, null, 40, ["onUpdate:modelValue"]), [
                          [vModelText, searchQuery.value]
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode("button", {
                        onClick: ($event) => setFilter("all"),
                        class: [
                          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                          __props.filters.filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                        ]
                      }, " All Users ", 10, ["onClick"]),
                      createVNode("button", {
                        onClick: ($event) => setFilter("paid"),
                        class: [
                          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                          __props.filters.filter === "paid" ? "bg-green-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"
                        ]
                      }, " Paid ", 10, ["onClick"]),
                      createVNode("button", {
                        onClick: ($event) => setFilter("unpaid"),
                        class: [
                          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                          __props.filters.filter === "unpaid" ? "bg-amber-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"
                        ]
                      }, " Waiting / Unpaid ", 10, ["onClick"])
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-card rounded-lg shadow border border-border" }, [
                  createVNode("div", { class: "px-6 py-4 border-b border-border flex items-center justify-between" }, [
                    createVNode("h2", { class: "text-lg font-semibold text-foreground" }, "Registered Users"),
                    createVNode("p", { class: "text-sm text-muted-foreground" }, " Showing " + toDisplayString(__props.users.data.length) + " of " + toDisplayString(__props.users.total) + " users ", 1)
                  ]),
                  createVNode("div", { class: "overflow-x-auto" }, [
                    createVNode("table", { class: "min-w-full text-sm" }, [
                      createVNode("thead", { class: "bg-muted/50 border-b border-border" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-4 py-3 text-left font-semibold" }, "User"),
                          createVNode("th", { class: "px-4 py-3 text-left font-semibold" }, "Phone"),
                          createVNode("th", { class: "px-4 py-3 text-left font-semibold" }, "Payment Status"),
                          createVNode("th", { class: "px-4 py-3 text-left font-semibold" }, "Latest Payment"),
                          createVNode("th", { class: "px-4 py-3 text-left font-semibold" }, "Subscription"),
                          createVNode("th", { class: "px-4 py-3 text-left font-semibold" }, "Registered")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        __props.users.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                          createVNode("td", {
                            colspan: "6",
                            class: "px-4 py-8 text-center text-muted-foreground"
                          }, [
                            createVNode(unref(Users), { class: "w-12 h-12 mx-auto mb-2 opacity-50" }),
                            createVNode("p", null, "No users found matching your criteria.")
                          ])
                        ])) : createCommentVNode("", true),
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.users.data, (user) => {
                          return openBlock(), createBlock("tr", {
                            key: user.id,
                            class: "border-b border-border hover:bg-muted/30 transition-colors"
                          }, [
                            createVNode("td", { class: "px-4 py-3" }, [
                              createVNode("div", { class: "flex items-center gap-3" }, [
                                createVNode("div", { class: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0" }, [
                                  createVNode("span", { class: "text-sm font-medium text-primary" }, toDisplayString(getInitials(user.name)), 1)
                                ]),
                                createVNode("div", null, [
                                  createVNode("p", { class: "font-medium text-foreground" }, toDisplayString(user.name || "No Name"), 1),
                                  createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(user.email || "No email"), 1)
                                ])
                              ])
                            ]),
                            createVNode("td", { class: "px-4 py-3" }, [
                              user.phone_number ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "text-foreground"
                              }, toDisplayString(user.phone_number), 1)) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-muted-foreground"
                              }, "—"))
                            ]),
                            createVNode("td", { class: "px-4 py-3" }, [
                              createVNode("span", {
                                class: [
                                  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                  user.has_paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                ]
                              }, [
                                user.has_paid ? (openBlock(), createBlock(unref(CheckCircle), {
                                  key: 0,
                                  class: "w-3 h-3"
                                })) : (openBlock(), createBlock(unref(Clock), {
                                  key: 1,
                                  class: "w-3 h-3"
                                })),
                                createTextVNode(" " + toDisplayString(user.has_paid ? `Paid (${user.payment_count}x)` : "Waiting"), 1)
                              ], 2)
                            ]),
                            createVNode("td", { class: "px-4 py-3" }, [
                              user.latest_payment ? (openBlock(), createBlock("div", { key: 0 }, [
                                createVNode("p", { class: "font-medium text-foreground" }, "₵" + toDisplayString(formatAmount(user.latest_payment.amount)), 1),
                                createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(user.latest_payment.reference), 1)
                              ])) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-muted-foreground"
                              }, "—"))
                            ]),
                            createVNode("td", { class: "px-4 py-3" }, [
                              user.subscription ? (openBlock(), createBlock("div", { key: 0 }, [
                                createVNode("span", {
                                  class: [
                                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                    user.subscription.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                  ]
                                }, toDisplayString(user.subscription.is_active ? "Active" : "Expired"), 3),
                                createVNode("p", { class: "text-xs text-muted-foreground mt-1" }, toDisplayString(user.subscription.is_active ? "Expires" : "Expired") + ": " + toDisplayString(formatDate(user.subscription.expires_at)), 1)
                              ])) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-muted-foreground"
                              }, "—"))
                            ]),
                            createVNode("td", { class: "px-4 py-3" }, [
                              createVNode("p", { class: "text-sm text-foreground" }, toDisplayString(formatDate(user.created_at)), 1),
                              user.email_verified ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-xs text-green-600"
                              }, "✓ Verified")) : (openBlock(), createBlock("p", {
                                key: 1,
                                class: "text-xs text-amber-600"
                              }, "⚠ Unverified"))
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ]),
                  __props.users.links?.length > 3 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex items-center justify-between px-6 py-4 border-t border-border"
                  }, [
                    createVNode("div", { class: "text-sm text-muted-foreground" }, " Page " + toDisplayString(__props.users.current_page) + " of " + toDisplayString(__props.users.last_page), 1),
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.users.links, (link) => {
                        return openBlock(), createBlock(unref(Link), {
                          key: link.label,
                          href: link.url || "#",
                          class: ["px-3 py-1 rounded border border-border text-sm", {
                            "bg-primary text-primary-foreground border-primary": link.active,
                            "text-muted-foreground cursor-not-allowed opacity-50": !link.url,
                            "hover:bg-muted": link.url && !link.active
                          }],
                          innerHTML: link.label,
                          "preserve-scroll": true
                        }, null, 8, ["href", "class", "innerHTML"]);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Subscribers/Index.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const __vite_glob_0_27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$M
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$L = {
  __name: "WatchAnalytics",
  __ssrInlineRender: true,
  props: {
    stats: { type: Object, default: () => ({}) },
    viewersByDay: { type: Array, default: () => [] },
    watchDistribution: { type: Array, default: () => [] },
    topViewers: { type: Array, default: () => [] },
    recentActivity: { type: Array, default: () => [] },
    hourlyPattern: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const maxViewers = computed(() => Math.max(...props.viewersByDay.map((d2) => d2.viewers), 1));
    const maxHourlyViews = computed(() => Math.max(...props.hourlyPattern.map((h2) => h2.views), 1));
    const maxDistribution = computed(() => Math.max(...props.watchDistribution.map((d2) => d2.count), 1));
    const getBarHeight = (value, max) => {
      if (max === 0) return 0;
      return Math.max(value / max * 100, 2);
    };
    const getDistributionWidth = (count) => {
      if (maxDistribution.value === 0) return 0;
      return Math.max(count / maxDistribution.value * 100, 2);
    };
    const getDistributionColor = (index) => {
      const colors = [
        "bg-red-400",
        "bg-orange-400",
        "bg-yellow-400",
        "bg-lime-400",
        "bg-green-400",
        "bg-emerald-500"
      ];
      return colors[index] || "bg-blue-400";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$19, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-card border-b border-border shadow-sm"${_scopeId}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="flex justify-between items-center py-4"${_scopeId}><div${_scopeId}><h1 class="text-2xl font-bold text-foreground"${_scopeId}>Watch Analytics</h1><p class="text-muted-foreground"${_scopeId}>View streaming statistics and viewer engagement</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/page-content",
              class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent3, _scopeId2));
                  _push3(` Back to Movies `);
                } else {
                  return [
                    createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
                    createTextVNode(" Back to Movies ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"${_scopeId}><div class="bg-card rounded-lg shadow border border-border p-6"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-sm text-muted-foreground"${_scopeId}>Total Viewers</p><p class="text-3xl font-bold text-foreground"${_scopeId}>${ssrInterpolate(__props.stats.totalViewers)}</p></div><div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Users), { class: "w-6 h-6 text-blue-600" }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div class="bg-card rounded-lg shadow border border-border p-6"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-sm text-muted-foreground"${_scopeId}>Total Watch Time</p><p class="text-3xl font-bold text-foreground"${_scopeId}>${ssrInterpolate(__props.stats.totalWatchTimeHours)}h</p></div><div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Clock), { class: "w-6 h-6 text-green-600" }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div class="bg-card rounded-lg shadow border border-border p-6"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-sm text-muted-foreground"${_scopeId}>Avg Watch Progress</p><p class="text-3xl font-bold text-foreground"${_scopeId}>${ssrInterpolate(__props.stats.avgWatchPercentage)}%</p></div><div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(TrendingUp), { class: "w-6 h-6 text-purple-600" }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div class="bg-card rounded-lg shadow border border-border p-6"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-sm text-muted-foreground"${_scopeId}>Completion Rate</p><p class="text-3xl font-bold text-foreground"${_scopeId}>${ssrInterpolate(__props.stats.completionRate)}%</p><p class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(__props.stats.completedViewers)} viewers</p></div><div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-6 h-6 text-amber-600" }, null, _parent2, _scopeId));
            _push2(`</div></div></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"${_scopeId}><div class="bg-card rounded-lg shadow border border-border p-6"${_scopeId}><h3 class="text-lg font-semibold text-foreground mb-4"${_scopeId}>Viewers (Last 30 Days)</h3>`);
            if (__props.viewersByDay.length > 0) {
              _push2(`<div class="h-64"${_scopeId}><div class="flex items-end h-48 gap-1"${_scopeId}><!--[-->`);
              ssrRenderList(__props.viewersByDay, (day, index) => {
                _push2(`<div class="flex-1 flex flex-col items-center"${_scopeId}><div class="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600" style="${ssrRenderStyle({ height: `${getBarHeight(day.viewers, maxViewers.value)}%` })}"${ssrRenderAttr("title", `${day.date}: ${day.viewers} viewers`)}${_scopeId}></div></div>`);
              });
              _push2(`<!--]--></div><div class="flex justify-between text-xs text-muted-foreground mt-2"${_scopeId}><span${_scopeId}>${ssrInterpolate(__props.viewersByDay[0]?.date)}</span><span${_scopeId}>${ssrInterpolate(__props.viewersByDay[__props.viewersByDay.length - 1]?.date)}</span></div></div>`);
            } else {
              _push2(`<div class="h-64 flex items-center justify-center text-muted-foreground"${_scopeId}> No data available </div>`);
            }
            _push2(`</div><div class="bg-card rounded-lg shadow border border-border p-6"${_scopeId}><h3 class="text-lg font-semibold text-foreground mb-4"${_scopeId}>Watch Progress Distribution</h3><div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(__props.watchDistribution, (item, index) => {
              _push2(`<div class="flex items-center gap-3"${_scopeId}><span class="text-sm text-muted-foreground w-20"${_scopeId}>${ssrInterpolate(item.range)}</span><div class="flex-1 h-6 bg-muted rounded overflow-hidden"${_scopeId}><div class="${ssrRenderClass([getDistributionColor(index), "h-full rounded transition-all"])}" style="${ssrRenderStyle({ width: `${getDistributionWidth(item.count)}%` })}"${_scopeId}></div></div><span class="text-sm font-medium text-foreground w-12 text-right"${_scopeId}>${ssrInterpolate(item.count)}</span></div>`);
            });
            _push2(`<!--]--></div></div></div><div class="bg-card rounded-lg shadow border border-border p-6 mb-8"${_scopeId}><h3 class="text-lg font-semibold text-foreground mb-4"${_scopeId}>Viewing Pattern by Hour</h3><div class="h-32 flex items-end gap-1"${_scopeId}><!--[-->`);
            ssrRenderList(__props.hourlyPattern, (hour, index) => {
              _push2(`<div class="flex-1 flex flex-col items-center"${_scopeId}><div class="w-full bg-purple-500 rounded-t transition-all hover:bg-purple-600" style="${ssrRenderStyle({ height: `${getBarHeight(hour.views, maxHourlyViews.value)}%` })}"${ssrRenderAttr("title", `${hour.hour}: ${hour.views} views`)}${_scopeId}></div></div>`);
            });
            _push2(`<!--]--></div><div class="flex justify-between text-xs text-muted-foreground mt-2"${_scopeId}><span${_scopeId}>00:00</span><span${_scopeId}>06:00</span><span${_scopeId}>12:00</span><span${_scopeId}>18:00</span><span${_scopeId}>23:00</span></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"${_scopeId}><div class="bg-card rounded-lg shadow border border-border p-6"${_scopeId}><h3 class="text-lg font-semibold text-foreground mb-4"${_scopeId}>Top Viewers</h3><div class="overflow-x-auto"${_scopeId}><table class="w-full"${_scopeId}><thead${_scopeId}><tr class="border-b border-border"${_scopeId}><th class="text-left text-sm font-medium text-muted-foreground py-2"${_scopeId}>User</th><th class="text-left text-sm font-medium text-muted-foreground py-2"${_scopeId}>Watch Time</th><th class="text-left text-sm font-medium text-muted-foreground py-2"${_scopeId}>Last Active</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(__props.topViewers, (viewer) => {
              _push2(`<tr class="border-b border-border/50"${_scopeId}><td class="py-3"${_scopeId}><div class="text-sm font-medium text-foreground"${_scopeId}>${ssrInterpolate(viewer.user)}</div><div class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(viewer.email)}</div></td><td class="py-3 text-sm text-foreground"${_scopeId}>${ssrInterpolate(viewer.total_time)}</td><td class="py-3 text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(viewer.last_watched)}</td></tr>`);
            });
            _push2(`<!--]--></tbody></table>`);
            if (__props.topViewers.length === 0) {
              _push2(`<div class="text-center py-4 text-muted-foreground"${_scopeId}> No viewers yet </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="bg-card rounded-lg shadow border border-border p-6"${_scopeId}><h3 class="text-lg font-semibold text-foreground mb-4"${_scopeId}>Recent Activity</h3><div class="space-y-3 max-h-96 overflow-y-auto"${_scopeId}><!--[-->`);
            ssrRenderList(__props.recentActivity, (activity, index) => {
              _push2(`<div class="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"${_scopeId}><div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Play), { class: "w-4 h-4 text-primary" }, null, _parent2, _scopeId));
              _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><p class="text-sm font-medium text-foreground truncate"${_scopeId}>${ssrInterpolate(activity.user)}</p><p class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(activity.current_time)} watched</p></div><div class="text-right flex-shrink-0"${_scopeId}><div class="w-16 h-2 bg-muted rounded-full overflow-hidden"${_scopeId}><div class="h-full bg-green-500 rounded-full" style="${ssrRenderStyle({ width: `${activity.progress}%` })}"${_scopeId}></div></div><p class="text-xs text-muted-foreground mt-1"${_scopeId}>${ssrInterpolate(activity.progress)}%</p></div></div>`);
            });
            _push2(`<!--]-->`);
            if (__props.recentActivity.length === 0) {
              _push2(`<div class="text-center py-4 text-muted-foreground"${_scopeId}> No recent activity </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-card border-b border-border shadow-sm" }, [
                createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "flex justify-between items-center py-4" }, [
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-2xl font-bold text-foreground" }, "Watch Analytics"),
                      createVNode("p", { class: "text-muted-foreground" }, "View streaming statistics and viewer engagement")
                    ]),
                    createVNode(unref(Link), {
                      href: "/admin/page-content",
                      class: "inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }),
                        createTextVNode(" Back to Movies ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" }, [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" }, [
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-6" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "Total Viewers"),
                        createVNode("p", { class: "text-3xl font-bold text-foreground" }, toDisplayString(__props.stats.totalViewers), 1)
                      ]),
                      createVNode("div", { class: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center" }, [
                        createVNode(unref(Users), { class: "w-6 h-6 text-blue-600" })
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-6" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "Total Watch Time"),
                        createVNode("p", { class: "text-3xl font-bold text-foreground" }, toDisplayString(__props.stats.totalWatchTimeHours) + "h", 1)
                      ]),
                      createVNode("div", { class: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center" }, [
                        createVNode(unref(Clock), { class: "w-6 h-6 text-green-600" })
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-6" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "Avg Watch Progress"),
                        createVNode("p", { class: "text-3xl font-bold text-foreground" }, toDisplayString(__props.stats.avgWatchPercentage) + "%", 1)
                      ]),
                      createVNode("div", { class: "w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center" }, [
                        createVNode(unref(TrendingUp), { class: "w-6 h-6 text-purple-600" })
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-6" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "Completion Rate"),
                        createVNode("p", { class: "text-3xl font-bold text-foreground" }, toDisplayString(__props.stats.completionRate) + "%", 1),
                        createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(__props.stats.completedViewers) + " viewers", 1)
                      ]),
                      createVNode("div", { class: "w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center" }, [
                        createVNode(unref(CheckCircle), { class: "w-6 h-6 text-amber-600" })
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" }, [
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-6" }, [
                    createVNode("h3", { class: "text-lg font-semibold text-foreground mb-4" }, "Viewers (Last 30 Days)"),
                    __props.viewersByDay.length > 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "h-64"
                    }, [
                      createVNode("div", { class: "flex items-end h-48 gap-1" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.viewersByDay, (day, index) => {
                          return openBlock(), createBlock("div", {
                            key: index,
                            class: "flex-1 flex flex-col items-center"
                          }, [
                            createVNode("div", {
                              class: "w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600",
                              style: { height: `${getBarHeight(day.viewers, maxViewers.value)}%` },
                              title: `${day.date}: ${day.viewers} viewers`
                            }, null, 12, ["title"])
                          ]);
                        }), 128))
                      ]),
                      createVNode("div", { class: "flex justify-between text-xs text-muted-foreground mt-2" }, [
                        createVNode("span", null, toDisplayString(__props.viewersByDay[0]?.date), 1),
                        createVNode("span", null, toDisplayString(__props.viewersByDay[__props.viewersByDay.length - 1]?.date), 1)
                      ])
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "h-64 flex items-center justify-center text-muted-foreground"
                    }, " No data available "))
                  ]),
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-6" }, [
                    createVNode("h3", { class: "text-lg font-semibold text-foreground mb-4" }, "Watch Progress Distribution"),
                    createVNode("div", { class: "space-y-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.watchDistribution, (item, index) => {
                        return openBlock(), createBlock("div", {
                          key: index,
                          class: "flex items-center gap-3"
                        }, [
                          createVNode("span", { class: "text-sm text-muted-foreground w-20" }, toDisplayString(item.range), 1),
                          createVNode("div", { class: "flex-1 h-6 bg-muted rounded overflow-hidden" }, [
                            createVNode("div", {
                              class: ["h-full rounded transition-all", getDistributionColor(index)],
                              style: { width: `${getDistributionWidth(item.count)}%` }
                            }, null, 6)
                          ]),
                          createVNode("span", { class: "text-sm font-medium text-foreground w-12 text-right" }, toDisplayString(item.count), 1)
                        ]);
                      }), 128))
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-6 mb-8" }, [
                  createVNode("h3", { class: "text-lg font-semibold text-foreground mb-4" }, "Viewing Pattern by Hour"),
                  createVNode("div", { class: "h-32 flex items-end gap-1" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.hourlyPattern, (hour, index) => {
                      return openBlock(), createBlock("div", {
                        key: index,
                        class: "flex-1 flex flex-col items-center"
                      }, [
                        createVNode("div", {
                          class: "w-full bg-purple-500 rounded-t transition-all hover:bg-purple-600",
                          style: { height: `${getBarHeight(hour.views, maxHourlyViews.value)}%` },
                          title: `${hour.hour}: ${hour.views} views`
                        }, null, 12, ["title"])
                      ]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "flex justify-between text-xs text-muted-foreground mt-2" }, [
                    createVNode("span", null, "00:00"),
                    createVNode("span", null, "06:00"),
                    createVNode("span", null, "12:00"),
                    createVNode("span", null, "18:00"),
                    createVNode("span", null, "23:00")
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-6" }, [
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-6" }, [
                    createVNode("h3", { class: "text-lg font-semibold text-foreground mb-4" }, "Top Viewers"),
                    createVNode("div", { class: "overflow-x-auto" }, [
                      createVNode("table", { class: "w-full" }, [
                        createVNode("thead", null, [
                          createVNode("tr", { class: "border-b border-border" }, [
                            createVNode("th", { class: "text-left text-sm font-medium text-muted-foreground py-2" }, "User"),
                            createVNode("th", { class: "text-left text-sm font-medium text-muted-foreground py-2" }, "Watch Time"),
                            createVNode("th", { class: "text-left text-sm font-medium text-muted-foreground py-2" }, "Last Active")
                          ])
                        ]),
                        createVNode("tbody", null, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.topViewers, (viewer) => {
                            return openBlock(), createBlock("tr", {
                              key: viewer.email,
                              class: "border-b border-border/50"
                            }, [
                              createVNode("td", { class: "py-3" }, [
                                createVNode("div", { class: "text-sm font-medium text-foreground" }, toDisplayString(viewer.user), 1),
                                createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(viewer.email), 1)
                              ]),
                              createVNode("td", { class: "py-3 text-sm text-foreground" }, toDisplayString(viewer.total_time), 1),
                              createVNode("td", { class: "py-3 text-sm text-muted-foreground" }, toDisplayString(viewer.last_watched), 1)
                            ]);
                          }), 128))
                        ])
                      ]),
                      __props.topViewers.length === 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-center py-4 text-muted-foreground"
                      }, " No viewers yet ")) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "bg-card rounded-lg shadow border border-border p-6" }, [
                    createVNode("h3", { class: "text-lg font-semibold text-foreground mb-4" }, "Recent Activity"),
                    createVNode("div", { class: "space-y-3 max-h-96 overflow-y-auto" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.recentActivity, (activity, index) => {
                        return openBlock(), createBlock("div", {
                          key: index,
                          class: "flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                        }, [
                          createVNode("div", { class: "w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0" }, [
                            createVNode(unref(Play), { class: "w-4 h-4 text-primary" })
                          ]),
                          createVNode("div", { class: "flex-1 min-w-0" }, [
                            createVNode("p", { class: "text-sm font-medium text-foreground truncate" }, toDisplayString(activity.user), 1),
                            createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(activity.current_time) + " watched", 1)
                          ]),
                          createVNode("div", { class: "text-right flex-shrink-0" }, [
                            createVNode("div", { class: "w-16 h-2 bg-muted rounded-full overflow-hidden" }, [
                              createVNode("div", {
                                class: "h-full bg-green-500 rounded-full",
                                style: { width: `${activity.progress}%` }
                              }, null, 4)
                            ]),
                            createVNode("p", { class: "text-xs text-muted-foreground mt-1" }, toDisplayString(activity.progress) + "%", 1)
                          ])
                        ]);
                      }), 128)),
                      __props.recentActivity.length === 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-center py-4 text-muted-foreground"
                      }, " No recent activity ")) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/WatchAnalytics.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const __vite_glob_0_28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$L
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$K = {
  __name: "ConfirmPassword",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      password: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background" }, _attrs))}><div class="w-full sm:max-w-md mt-6 overflow-hidden rounded-lg shadow-xl"><div class="bg-gradient-to-r from-red-900 via-red-800 to-red-700 px-6 py-8"><h2 class="text-2xl font-bold text-white text-center mb-2">Confirm Password</h2><p class="text-sm text-red-100 text-center"> Please confirm your password before continuing. </p></div><div class="bg-card border border-border border-t-0 px-6 py-8"><form><div><label for="password" class="block text-sm font-medium text-foreground mb-2">Password</label><input id="password" type="password" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"${ssrRenderAttr("value", unref(form).password)} required autofocus>`);
      if (unref(form).errors.password) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(form).errors.password)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center justify-end mt-6"><button type="submit" class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}>`);
      if (unref(form).processing) {
        _push(`<span>Confirming...</span>`);
      } else {
        _push(`<span>Confirm</span>`);
      }
      _push(`</button></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ConfirmPassword.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const __vite_glob_0_29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$K
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$J = {
  __name: "ForgotPassword",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      email: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background" }, _attrs))}><div class="w-full sm:max-w-md mt-6 overflow-hidden rounded-lg shadow-xl"><div class="bg-gradient-to-r from-red-900 via-red-800 to-red-700 px-6 py-8"><h2 class="text-2xl font-bold text-white text-center mb-2">Reset Password</h2><p class="text-sm text-red-100 text-center"> Forgot your password? No problem. Just let us know your email address and we will email you a password reset link. </p></div><div class="bg-card border border-border border-t-0 px-6 py-8"><form><div><label for="email" class="block text-sm font-medium text-foreground mb-2">Email</label><input id="email" type="email" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"${ssrRenderAttr("value", unref(form).email)} required autofocus>`);
      if (unref(form).errors.email) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(form).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center justify-between mt-6">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/login",
        class: "text-sm text-primary hover:text-primary/80 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Back to login `);
          } else {
            return [
              createTextVNode(" Back to login ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit" class="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}>`);
      if (unref(form).processing) {
        _push(`<span>Sending...</span>`);
      } else {
        _push(`<span>Send Reset Link</span>`);
      }
      _push(`</button></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ForgotPassword.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const __vite_glob_0_30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$J
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$I = {
  __name: "Login",
  __ssrInlineRender: true,
  setup(__props) {
    usePage().props.flash;
    const images = [
      "/movie_poster.jpg",
      "/movie_poster_2.jpg",
      "/plfilms-acradayinaccra-poster.png"
    ];
    const current = ref(0);
    let timer = null;
    onMounted(() => {
      timer = setInterval(() => {
        current.value = (current.value + 1) % images.length;
      }, 4e3);
    });
    onUnmounted(() => clearInterval(timer));
    const form = useForm({
      email: "",
      password: "",
      remember: false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex bg-background" }, _attrs))}><div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-900 via-red-800 to-red-700 items-center justify-center relative"><div class="absolute inset-0 bg-background/40"></div><div class="max-w-2xl px-8 z-10"><h1 class="text-4xl font-bold mb-4">Welcome to Promise Land Films</h1><p class="mb-6 text-muted-foreground">Sign in with email or phone number and your password.</p><div class="rounded-lg overflow-hidden shadow-2xl border border-border"><img${ssrRenderAttr("src", images[current.value])} class="w-full h-64 object-cover"></div></div><div class="absolute left-6 bottom-6 flex space-x-3"><!--[-->`);
      ssrRenderList(images, (_2, idx) => {
        _push(`<button class="${ssrRenderClass([current.value === idx ? "bg-primary" : "bg-muted", "w-3 h-3 rounded-full"])}"></button>`);
      });
      _push(`<!--]--></div></div><div class="flex-1 flex items-center justify-center p-6"><div class="w-full max-w-md"><div class="mb-8 text-center"><h2 class="text-3xl font-bold">Sign in</h2><p class="text-sm text-muted-foreground mt-2">Enter your credentials to continue</p></div><form class="bg-card border border-border rounded-lg p-6 shadow-lg space-y-4"><div><label class="block text-sm font-medium mb-2">Email or Phone Number</label><input${ssrRenderAttr("value", unref(form).email)} type="text" placeholder="email@example.com or 0244123456" class="w-full px-4 py-3 rounded-md bg-background border border-input">`);
      if (unref(form).errors.email) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(form).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium mb-2">Password</label><input${ssrRenderAttr("value", unref(form).password)} type="password" class="w-full px-4 py-3 rounded-md bg-background border border-input">`);
      if (unref(form).errors.password) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(form).errors.password)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).remember) ? ssrLooseContain(unref(form).remember, null) : unref(form).remember) ? " checked" : ""} type="checkbox" id="remember" class="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary"><label for="remember" class="ml-2 text-sm text-muted-foreground">Remember me for 30 days</label></div><div class="flex justify-between items-center"><a${ssrRenderAttr("href", _ctx.route("password.request"))} class="text-sm text-primary">Forgot password?</a><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-6 py-3 bg-primary text-primary-foreground rounded-md disabled:opacity-50">`);
      if (unref(form).processing) {
        _push(`<span>Signing in...</span>`);
      } else {
        _push(`<span>Sign in</span>`);
      }
      _push(`</button></div></form><p class="mt-6 text-center text-sm text-muted-foreground"> Don&#39;t have an account? <a${ssrRenderAttr("href", _ctx.route("register"))} class="text-primary font-medium">Register</a></p></div></div></div>`);
    };
  }
};
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Login.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const __vite_glob_0_31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$I
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$H = {
  __name: "Register",
  __ssrInlineRender: true,
  setup(__props) {
    const images = [
      "/movie_poster.jpg",
      "/movie_poster_2.jpg",
      "/plfilms-acradayinaccra-poster.png"
    ];
    const current = ref(0);
    let timer = null;
    onMounted(() => {
      timer = setInterval(() => {
        current.value = (current.value + 1) % images.length;
      }, 4e3);
    });
    onUnmounted(() => clearInterval(timer));
    const showPassword = ref(false);
    const showPasswordConfirmation = ref(false);
    const registerForm = useForm({
      name: "",
      phone_number: "",
      email: "",
      password: "",
      password_confirmation: ""
    });
    useForm({
      code: ""
    });
    ref(false);
    ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex bg-background" }, _attrs))}><div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-900 via-red-800 to-red-700 items-center justify-center relative"><div class="absolute inset-0 bg-background/40"></div><div class="max-w-2xl px-8 z-10"><h1 class="text-4xl font-bold mb-4">Join Promise Land Films</h1><p class="mb-6 text-muted-foreground"> Create your account to stream &quot;A Crazy Day in Accra&quot;. </p><div class="rounded-lg overflow-hidden shadow-2xl border border-border"><img${ssrRenderAttr("src", images[current.value])} class="w-full h-64 object-cover"></div></div><div class="absolute left-6 bottom-6 flex space-x-3"><!--[-->`);
      ssrRenderList(images, (_2, idx) => {
        _push(`<button class="${ssrRenderClass([current.value === idx ? "bg-primary" : "bg-muted", "w-3 h-3 rounded-full"])}"></button>`);
      });
      _push(`<!--]--></div></div><div class="flex-1 flex items-center justify-center p-6"><div class="w-full max-w-md"><div class="mb-8 text-center"><h2 class="text-3xl font-bold">Create your account</h2><p class="text-sm text-muted-foreground mt-2"> Enter your details to get started </p></div><div class="bg-card border border-border rounded-lg p-6 shadow-lg space-y-4"><div><label class="block text-sm font-medium mb-2">Name</label><input${ssrRenderAttr("value", unref(registerForm).name)} class="w-full px-4 py-3 rounded-md bg-background border border-input">`);
      if (unref(registerForm).errors.name) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(registerForm).errors.name)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium mb-2">Phone Number</label><input${ssrRenderAttr("value", unref(registerForm).phone_number)} type="tel" placeholder="0244 123 456" class="w-full px-4 py-3 rounded-md bg-background border border-input">`);
      if (unref(registerForm).errors.phone_number) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(registerForm).errors.phone_number)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium mb-2">Email (optional)</label><input${ssrRenderAttr("value", unref(registerForm).email)} type="email" placeholder="you@example.com" class="w-full px-4 py-3 rounded-md bg-background border border-input">`);
      if (unref(registerForm).errors.email) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(registerForm).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium mb-2">Password</label><div class="relative"><input${ssrRenderDynamicModel(showPassword.value ? "text" : "password", unref(registerForm).password, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} class="w-full px-4 py-3 rounded-md bg-background border border-input pr-10"><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">`);
      if (showPassword.value) {
        _push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>`);
      } else {
        _push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.83 9L15.5 12.67c.11-.35.17-.72.17-1.1 0-2.21-1.79-4-4-4-.38 0-.75.05-1.1.15L11.83 9zm7.08-9.14c-.37-.06-.74-.1-1.13-.1-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5.39 0 .76-.03 1.13-.1l1.41 1.41c-.54.1-1.08.16-1.54.16-5.5 0-10.27-3.61-12-8.5 1.73-4.89 6.5-8.5 12-8.5.46 0 .99.06 1.54.16L18.91.34zM19.5 13c0-1.66-1.34-3-3-3-.35 0-.69.06-1 .16l3.84 3.84c.1-.31.16-.65.16-1zm-9-8c.35 0 .69.06 1 .16L9.16 4.16C8.69 4.06 8.35 4 8 4c-1.66 0-3 1.34-3 3 0 .35.06.69.16 1l3.84-3.84z"></path></svg>`);
      }
      _push(`</button></div>`);
      if (unref(registerForm).errors.password) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(registerForm).errors.password)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium mb-2">Confirm Password</label><div class="relative"><input${ssrRenderDynamicModel(showPasswordConfirmation.value ? "text" : "password", unref(registerForm).password_confirmation, null)}${ssrRenderAttr("type", showPasswordConfirmation.value ? "text" : "password")} class="w-full px-4 py-3 rounded-md bg-background border border-input pr-10"><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">`);
      if (showPasswordConfirmation.value) {
        _push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>`);
      } else {
        _push(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.83 9L15.5 12.67c.11-.35.17-.72.17-1.1 0-2.21-1.79-4-4-4-.38 0-.75.05-1.1.15L11.83 9zm7.08-9.14c-.37-.06-.74-.1-1.13-.1-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5.39 0 .76-.03 1.13-.1l1.41 1.41c-.54.1-1.08.16-1.54.16-5.5 0-10.27-3.61-12-8.5 1.73-4.89 6.5-8.5 12-8.5.46 0 .99.06 1.54.16L18.91.34zM19.5 13c0-1.66-1.34-3-3-3-.35 0-.69.06-1 .16l3.84 3.84c.1-.31.16-.65.16-1zm-9-8c.35 0 .69.06 1 .16L9.16 4.16C8.69 4.06 8.35 4 8 4c-1.66 0-3 1.34-3 3 0 .35.06.69.16 1l3.84-3.84z"></path></svg>`);
      }
      _push(`</button></div>`);
      if (unref(registerForm).errors.password_confirmation) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(registerForm).errors.password_confirmation)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button${ssrIncludeBooleanAttr(unref(registerForm).processing) ? " disabled" : ""} class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md disabled:opacity-50">`);
      if (unref(registerForm).processing) {
        _push(`<span>Creating Account...</span>`);
      } else {
        _push(`<span>Create Account</span>`);
      }
      _push(`</button></div><p class="mt-6 text-center text-sm text-muted-foreground"> Already have an account? <a${ssrRenderAttr("href", _ctx.route("login"))} class="text-primary font-medium">Sign in</a></p></div></div></div>`);
    };
  }
};
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Register.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const __vite_glob_0_32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$H
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$G = {
  __name: "ResetPassword",
  __ssrInlineRender: true,
  props: {
    email: String,
    token: String
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      token: props.token,
      email: props.email,
      password: "",
      password_confirmation: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background" }, _attrs))}><div class="w-full sm:max-w-md mt-6 overflow-hidden rounded-lg shadow-xl"><div class="bg-gradient-to-r from-red-900 via-red-800 to-red-700 px-6 py-8"><h2 class="text-2xl font-bold text-white text-center">Create New Password</h2><p class="text-sm text-red-100 text-center mt-2">Enter your new password below</p></div><div class="bg-card border border-border border-t-0 px-6 py-8"><form><div class="space-y-4"><div><label for="email" class="block text-sm font-medium text-foreground mb-2">Email</label><input id="email" type="email" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"${ssrRenderAttr("value", unref(form).email)} required autofocus>`);
      if (unref(form).errors.email) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(form).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="password" class="block text-sm font-medium text-foreground mb-2">New Password</label><input id="password" type="password" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"${ssrRenderAttr("value", unref(form).password)} required>`);
      if (unref(form).errors.password) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(form).errors.password)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="password_confirmation" class="block text-sm font-medium text-foreground mb-2">Confirm Password</label><input id="password_confirmation" type="password" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"${ssrRenderAttr("value", unref(form).password_confirmation)} required>`);
      if (unref(form).errors.password_confirmation) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(form).errors.password_confirmation)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex items-center justify-end mt-6"><button type="submit" class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}>`);
      if (unref(form).processing) {
        _push(`<span>Resetting...</span>`);
      } else {
        _push(`<span>Reset Password</span>`);
      }
      _push(`</button></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ResetPassword.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const __vite_glob_0_33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$G
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$F = {
  __name: "TwoFactorChallenge",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("authenticator");
    const form = useForm({
      code: ""
    });
    const recoveryForm = useForm({
      recovery_code: ""
    });
    watch(activeTab, async () => {
      await nextTick();
      document.querySelector("input:visible")?.focus();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background" }, _attrs))}><div class="w-full sm:max-w-md mt-6 overflow-hidden rounded-lg shadow-xl"><div class="bg-gradient-to-r from-red-900 via-red-800 to-red-700 px-6 py-8"><h2 class="text-2xl font-bold text-white text-center mb-2">Two-Factor Authentication</h2><p class="text-sm text-red-100 text-center"> Verify access to your account </p></div><div class="bg-card border border-border border-t-0 px-6 py-8"><div class="flex gap-2 mb-6 border-b border-border"><button class="${ssrRenderClass([
        "pb-3 px-2 text-sm font-medium border-b-2 transition-colors",
        activeTab.value === "authenticator" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
      ])}"> Authenticator </button><button class="${ssrRenderClass([
        "pb-3 px-2 text-sm font-medium border-b-2 transition-colors",
        activeTab.value === "recovery" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
      ])}"> Recovery Code </button></div><form style="${ssrRenderStyle(activeTab.value === "authenticator" ? null : { display: "none" })}"><div><label for="code" class="block text-sm font-medium text-foreground mb-2">6-digit Code</label><input id="code"${ssrRenderAttr("value", unref(form).code)} type="text" inputmode="numeric" maxlength="6" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center text-lg tracking-widest" autofocus required placeholder="000000">`);
      if (unref(form).errors.code) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(form).errors.code)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center justify-end mt-6"><button type="submit" class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}>`);
      if (unref(form).processing) {
        _push(`<span>Confirming...</span>`);
      } else {
        _push(`<span>Confirm</span>`);
      }
      _push(`</button></div></form><form style="${ssrRenderStyle(activeTab.value === "recovery" ? null : { display: "none" })}"><div><label for="recovery_code" class="block text-sm font-medium text-foreground mb-2">Recovery Code</label><input id="recovery_code"${ssrRenderAttr("value", unref(recoveryForm).recovery_code)} type="text" class="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm" placeholder="xxxx-xxxx-xxxx-xxxx" required>`);
      if (unref(recoveryForm).errors.recovery_code) {
        _push(`<div class="text-destructive text-sm mt-1">${ssrInterpolate(unref(recoveryForm).errors.recovery_code)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center justify-end mt-6"><button type="submit" class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"${ssrIncludeBooleanAttr(unref(recoveryForm).processing) ? " disabled" : ""}>`);
      if (unref(recoveryForm).processing) {
        _push(`<span>Confirming...</span>`);
      } else {
        _push(`<span>Confirm</span>`);
      }
      _push(`</button></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/TwoFactorChallenge.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const __vite_glob_0_34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$F
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$E = {
  __name: "VerifyEmail",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const form = useForm({});
    computed(() => page.props.flash?.message);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background" }, _attrs))}><div class="w-full sm:max-w-md mt-6 overflow-hidden rounded-lg shadow-xl"><div class="bg-gradient-to-r from-red-900 via-red-800 to-red-700 px-6 py-8"><h2 class="text-2xl font-bold text-white text-center mb-3">Verify Your Email</h2><p class="text-sm text-red-100"> Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn&#39;t receive the email, we will gladly send you another. </p></div><div class="bg-card border border-border border-t-0 px-6 py-8"><div class="flex flex-col gap-3"><form><button type="submit" class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}>`);
      if (unref(form).processing) {
        _push(`<span>Resending...</span>`);
      } else {
        _push(`<span>Resend Verification Email</span>`);
      }
      _push(`</button></form><form method="POST" action="{{ route(&#39;logout&#39;) }}"><button type="submit" class="w-full text-sm text-primary hover:text-primary/80 py-2 transition-colors"> Log Out </button></form></div></div></div></div>`);
    };
  }
};
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/VerifyEmail.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const __vite_glob_0_35 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$E
}, Symbol.toStringTag, { value: "Module" }));
const logo = "/plf_logo_light.png";
const _sfc_main$D = {
  __name: "PublicHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const mobileMenuOpen = ref(false);
    const userMenuOpen = ref(false);
    const userMenuRef = ref(null);
    const isActive = (path) => {
      return page.url === path || page.url.startsWith(path + "/");
    };
    const user = computed(() => page.props.auth?.user);
    const isAdmin = computed(() => {
      return user.value?.roles?.some((role) => role.name === "admin") || false;
    });
    function handleClickOutside(event) {
      if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        userMenuOpen.value = false;
      }
    }
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });
    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800" }, _attrs))}><nav class="container mx-auto px-6 lg:px-12"><div class="flex items-center justify-between h-20">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "flex items-center gap-3 group"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", logo)} alt="Promise Land Films" class="h-12 w-auto transition-opacity group-hover:opacity-80"${_scopeId}><span class="text-xl font-bold text-white group-hover:text-red-600 transition-colors hidden md:inline"${_scopeId}> A Crazy Day in Accra </span>`);
          } else {
            return [
              createVNode("img", {
                src: logo,
                alt: "Promise Land Films",
                class: "h-12 w-auto transition-opacity group-hover:opacity-80"
              }),
              createVNode("span", { class: "text-xl font-bold text-white group-hover:text-red-600 transition-colors hidden md:inline" }, " A Crazy Day in Accra ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden lg:flex items-center space-x-8"><!--[-->`);
      ssrRenderList([
        ["/", "Home"],
        ["/details", "Details"],
        ["/gallery", "Gallery"]
      ], (item) => {
        _push(ssrRenderComponent(unref(Link), {
          key: item[0],
          href: item[0],
          class: [isActive(item[0]) ? "text-red-600" : "text-white hover:text-red-600", "font-semibold transition-colors"]
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item[1])}`);
            } else {
              return [
                createTextVNode(toDisplayString(item[1]), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      if (_ctx.$page.props.auth?.user) {
        _push(`<div class="relative ml-4 pl-4 border-l border-gray-700"><button class="flex items-center gap-2 text-white hover:text-red-500 transition-colors py-2 px-3 rounded-lg hover:bg-white/10"><div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold text-sm">${ssrInterpolate((_ctx.$page.props.auth.user.name || "U").charAt(0).toUpperCase())}</div><span class="font-medium max-w-[120px] truncate hidden xl:block">${ssrInterpolate(_ctx.$page.props.auth.user.name || "User")}</span><svg class="${ssrRenderClass([{ "rotate-180": userMenuOpen.value }, "w-4 h-4 transition-transform duration-200"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>`);
        if (userMenuOpen.value) {
          _push(`<div class="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 z-50"><div class="px-4 py-3 border-b border-gray-700"><p class="text-white font-semibold truncate">${ssrInterpolate(_ctx.$page.props.auth.user.name || "User")}</p><p class="text-gray-400 text-sm truncate">${ssrInterpolate(_ctx.$page.props.auth.user.email || "")}</p></div><div class="py-2">`);
          _push(ssrRenderComponent(unref(Link), {
            href: isAdmin.value ? "/admin" : "/dashboard",
            onClick: ($event) => userMenuOpen.value = false,
            class: "flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(isAdmin.value ? "Admin Dashboard" : "Dashboard")}</span>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5 text-gray-400",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    })
                  ])),
                  createVNode("span", null, toDisplayString(isAdmin.value ? "Admin Dashboard" : "Dashboard"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(unref(Link), {
            href: "/watch",
            onClick: ($event) => userMenuOpen.value = false,
            class: "flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><span${_scopeId}>Watch Movie</span>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5 text-gray-400",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    }),
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    })
                  ])),
                  createVNode("span", null, "Watch Movie")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(unref(Link), {
            href: "/profile",
            onClick: ($event) => userMenuOpen.value = false,
            class: "flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition-colors"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg><span${_scopeId}>Profile</span>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5 text-gray-400",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    })
                  ])),
                  createVNode("span", null, "Profile")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div><div class="border-t border-gray-700 pt-2">`);
          _push(ssrRenderComponent(unref(Link), {
            href: "/logout",
            method: "post",
            as: "button",
            onClick: ($event) => userMenuOpen.value = false,
            class: "flex items-center gap-3 w-full px-4 py-2.5 text-red-500 hover:bg-red-500/10 transition-colors"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Sign Out</span>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    })
                  ])),
                  createVNode("span", { class: "font-medium" }, "Sign Out")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-700">`);
        _push(ssrRenderComponent(unref(Link), {
          href: "/register",
          class: "text-white hover:text-red-600 font-semibold"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Sign Up`);
            } else {
              return [
                createTextVNode("Sign Up")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Link), {
          href: "/login",
          class: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Login `);
            } else {
              return [
                createTextVNode(" Login ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div><button class="lg:hidden text-white p-2 hover:text-red-600" aria-label="Toggle menu"${ssrRenderAttr("aria-expanded", mobileMenuOpen.value)}>`);
      if (!mobileMenuOpen.value) {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`);
      } else {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
      }
      _push(`</button></div>`);
      if (mobileMenuOpen.value) {
        _push(`<div class="lg:hidden py-4 border-t border-gray-800"><div class="flex flex-col space-y-3"><!--[-->`);
        ssrRenderList([
          ["/", "Home"],
          ["/details", "Details"],
          ["/gallery", "Gallery"]
        ], (item) => {
          _push(ssrRenderComponent(unref(Link), {
            key: item[0],
            href: item[0],
            onClick: ($event) => mobileMenuOpen.value = false,
            class: [isActive(item[0]) ? "text-red-600" : "text-white hover:text-red-600", "font-semibold py-2"]
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item[1])}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item[1]), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]-->`);
        if (_ctx.$page.props.auth?.user) {
          _push(`<div class="pt-3 border-t border-gray-800 space-y-1"><div class="px-2 py-3 mb-2"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">${ssrInterpolate((_ctx.$page.props.auth.user.name || "U").charAt(0).toUpperCase())}</div><div><p class="text-white font-semibold">${ssrInterpolate(_ctx.$page.props.auth.user.name || "User")}</p><p class="text-gray-400 text-sm">${ssrInterpolate(_ctx.$page.props.auth.user.email || "")}</p></div></div></div>`);
          _push(ssrRenderComponent(unref(Link), {
            href: isAdmin.value ? "/admin" : "/dashboard",
            onClick: ($event) => mobileMenuOpen.value = false,
            class: "flex items-center gap-3 px-2 py-3 text-white hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>${ssrInterpolate(isAdmin.value ? "Admin Dashboard" : "Dashboard")}</span>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5 text-gray-400",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    })
                  ])),
                  createVNode("span", { class: "font-medium" }, toDisplayString(isAdmin.value ? "Admin Dashboard" : "Dashboard"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(unref(Link), {
            href: "/watch",
            onClick: ($event) => mobileMenuOpen.value = false,
            class: "flex items-center gap-3 px-2 py-3 text-white hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Watch Movie</span>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5 text-gray-400",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    }),
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    })
                  ])),
                  createVNode("span", { class: "font-medium" }, "Watch Movie")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(unref(Link), {
            href: "/profile",
            onClick: ($event) => mobileMenuOpen.value = false,
            class: "flex items-center gap-3 px-2 py-3 text-white hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Profile</span>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5 text-gray-400",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    })
                  ])),
                  createVNode("span", { class: "font-medium" }, "Profile")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(unref(Link), {
            href: "/logout",
            method: "post",
            as: "button",
            onClick: ($event) => mobileMenuOpen.value = false,
            class: "flex items-center gap-3 w-full px-2 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors mt-2 border-t border-gray-800 pt-4"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"${_scopeId}></path></svg><span class="font-semibold"${_scopeId}>Sign Out</span>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    })
                  ])),
                  createVNode("span", { class: "font-semibold" }, "Sign Out")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="pt-3 border-t border-gray-800 flex flex-col space-y-3">`);
          _push(ssrRenderComponent(unref(Link), {
            href: "/register",
            class: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Sign Up `);
              } else {
                return [
                  createTextVNode(" Sign Up ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(unref(Link), {
            href: "/login",
            class: "text-white hover:text-red-600 font-semibold"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Login`);
              } else {
                return [
                  createTextVNode("Login")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav></header>`);
    };
  }
};
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/PublicHeader.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const _sfc_main$C = {
  __name: "PublicFooter",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-black border-t border-gray-800 text-white py-12" }, _attrs))}><div class="container mx-auto px-6 lg:px-12"><div class="grid md:grid-cols-4 gap-8 mb-8"><div><h3 class="text-2xl font-black mb-4">A CRAZY DAY<br>IN ACCRA</h3><p class="text-gray-400 text-sm"> Experience the ultimate thriller set in the heart of Accra. </p></div><div><h4 class="font-bold mb-4">Quick Links</h4><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "block text-gray-400 hover:text-red-600"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Home`);
          } else {
            return [
              createTextVNode("Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/details",
        class: "block text-gray-400 hover:text-red-600"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Details`);
          } else {
            return [
              createTextVNode("Details")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/gallery",
        class: "block text-gray-400 hover:text-red-600"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Gallery`);
          } else {
            return [
              createTextVNode("Gallery")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div><h4 class="font-bold mb-4">Legal</h4><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/privacy",
        class: "block text-gray-400 hover:text-red-600"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Privacy Policy`);
          } else {
            return [
              createTextVNode("Privacy Policy")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/terms",
        class: "block text-gray-400 hover:text-red-600"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Terms of Service`);
          } else {
            return [
              createTextVNode("Terms of Service")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div><h4 class="font-bold mb-4">Follow Us</h4><div class="flex space-x-4"><a href="#" aria-label="Facebook" class="text-gray-400 hover:text-red-600">FB</a><a href="#" aria-label="Twitter" class="text-gray-400 hover:text-red-600">X</a><a href="#" aria-label="Instagram" class="text-gray-400 hover:text-red-600">IG</a></div></div></div><div class="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm"> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} A Crazy Day In Accra. All rights reserved. </div></div></footer>`);
    };
  }
};
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/PublicFooter.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$B = {
  __name: "ContactBubble",
  __ssrInlineRender: true,
  setup(__props) {
    const isOpen = ref(false);
    const activeTab = ref("contact");
    const contactForm = useForm({
      name: "",
      email: "",
      message: ""
    });
    const reviewForm = useForm({
      author_name: "",
      email: "",
      rating: 5,
      content: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed bottom-6 right-6 z-40 font-sans" }, _attrs))} data-v-32a25ce8>`);
      if (isOpen.value) {
        _push(`<div class="absolute bottom-20 right-0 w-96 bg-black border border-gray-700 rounded-2xl shadow-2xl overflow-hidden" data-v-32a25ce8><div class="bg-red-600 px-6 py-4" data-v-32a25ce8><h3 class="text-lg font-bold text-white" data-v-32a25ce8>Contact &amp; Reviews</h3><p class="text-sm text-white/80" data-v-32a25ce8>Get in touch or share your thoughts</p></div><div class="flex border-b border-gray-700 bg-black/50" data-v-32a25ce8><button class="${ssrRenderClass([
          activeTab.value === "contact" ? "border-b-2 border-red-600 text-white" : "text-gray-400 hover:text-white",
          "flex-1 px-4 py-3 font-semibold transition-colors"
        ])}" data-v-32a25ce8> Contact </button><button class="${ssrRenderClass([
          activeTab.value === "review" ? "border-b-2 border-red-600 text-white" : "text-gray-400 hover:text-white",
          "flex-1 px-4 py-3 font-semibold transition-colors"
        ])}" data-v-32a25ce8> Review </button></div><div class="p-6 max-h-[500px] overflow-y-auto" data-v-32a25ce8>`);
        if (activeTab.value === "contact") {
          _push(`<form class="space-y-4" data-v-32a25ce8><div data-v-32a25ce8><label class="block text-sm font-semibold text-white mb-2" data-v-32a25ce8>Name</label><input${ssrRenderAttr("value", unref(contactForm).name)} type="text" placeholder="Your name" class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors" data-v-32a25ce8>`);
          if (unref(contactForm).errors.name) {
            _push(`<span class="text-red-500 text-xs mt-1" data-v-32a25ce8>${ssrInterpolate(unref(contactForm).errors.name)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div data-v-32a25ce8><label class="block text-sm font-semibold text-white mb-2" data-v-32a25ce8>Email</label><input${ssrRenderAttr("value", unref(contactForm).email)} type="email" placeholder="your@email.com" class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors" data-v-32a25ce8>`);
          if (unref(contactForm).errors.email) {
            _push(`<span class="text-red-500 text-xs mt-1" data-v-32a25ce8>${ssrInterpolate(unref(contactForm).errors.email)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div data-v-32a25ce8><label class="block text-sm font-semibold text-white mb-2" data-v-32a25ce8>Message</label><textarea placeholder="Tell us what&#39;s on your mind..." rows="4" class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors resize-none" data-v-32a25ce8>${ssrInterpolate(unref(contactForm).message)}</textarea>`);
          if (unref(contactForm).errors.message) {
            _push(`<span class="text-red-500 text-xs mt-1" data-v-32a25ce8>${ssrInterpolate(unref(contactForm).errors.message)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors" data-v-32a25ce8>`);
          if (unref(contactForm).processing) {
            _push(`<span data-v-32a25ce8>Sending...</span>`);
          } else {
            _push(`<span data-v-32a25ce8>Send Message</span>`);
          }
          _push(`</button></form>`);
        } else if (activeTab.value === "review") {
          _push(`<form class="space-y-4" data-v-32a25ce8><div data-v-32a25ce8><label class="block text-sm font-semibold text-white mb-2" data-v-32a25ce8>Your Name</label><input${ssrRenderAttr("value", unref(reviewForm).author_name)} type="text" placeholder="Display name" class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors" data-v-32a25ce8>`);
          if (unref(reviewForm).errors.author_name) {
            _push(`<span class="text-red-500 text-xs mt-1" data-v-32a25ce8>${ssrInterpolate(unref(reviewForm).errors.author_name)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div data-v-32a25ce8><label class="block text-sm font-semibold text-white mb-2" data-v-32a25ce8>Email</label><input${ssrRenderAttr("value", unref(reviewForm).email)} type="email" placeholder="your@email.com" class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors" data-v-32a25ce8>`);
          if (unref(reviewForm).errors.email) {
            _push(`<span class="text-red-500 text-xs mt-1" data-v-32a25ce8>${ssrInterpolate(unref(reviewForm).errors.email)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div data-v-32a25ce8><label class="block text-sm font-semibold text-white mb-2" data-v-32a25ce8>Rating</label><div class="flex gap-2" data-v-32a25ce8><!--[-->`);
          ssrRenderList(5, (star) => {
            _push(`<button type="button" class="${ssrRenderClass([star <= unref(reviewForm).rating ? "text-yellow-400" : "text-gray-600 hover:text-yellow-300", "text-2xl transition-colors"])}" data-v-32a25ce8> ★ </button>`);
          });
          _push(`<!--]--></div></div><div data-v-32a25ce8><label class="block text-sm font-semibold text-white mb-2" data-v-32a25ce8>Your Review</label><textarea placeholder="What did you think about the film?" rows="4" class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors resize-none" data-v-32a25ce8>${ssrInterpolate(unref(reviewForm).content)}</textarea>`);
          if (unref(reviewForm).errors.content) {
            _push(`<span class="text-red-500 text-xs mt-1" data-v-32a25ce8>${ssrInterpolate(unref(reviewForm).errors.content)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(reviewForm).processing) ? " disabled" : ""} class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors" data-v-32a25ce8>`);
          if (unref(reviewForm).processing) {
            _push(`<span data-v-32a25ce8>Submitting...</span>`);
          } else {
            _push(`<span data-v-32a25ce8>Submit Review</span>`);
          }
          _push(`</button></form>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="${ssrRenderClass([isOpen.value ? "scale-75" : "scale-100", "w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"])}" data-v-32a25ce8>`);
      if (!isOpen.value) {
        _push(`<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" data-v-32a25ce8><path d="M20.447 20.452h-.606v-5.585c0-1.416-.507-2.368-1.86-2.368-.85 0-1.35.572-1.573 1.125-.081.197-.102.472-.102.748v5.08h-.606c0 0 .008-8.246 0-9.102h.606v1.29c-.009.014-.021.035-.035.047h.035v-.047c.537-.826 1.487-2.01 3.612-2.01 2.638 0 4.614 1.725 4.614 5.435v4.402zM5.337 5.432c-.762 0-1.263-.505-1.263-1.137C4.074 3.771 4.576 3.27 5.399 3.27c.76 0 1.263.501 1.29 1.125 0 .632-.53 1.137-1.352 1.137zm.766 15.02H4.57V11.35h1.533v9.102zM17.467 3.007c-3.134 0-5.148 1.623-5.148 5.159v.286h-1.054V17.85h1.509v-8.54c0-1.416.504-2.368 1.86-2.368.85 0 1.35.572 1.574 1.125.081.197.101.472.101.748v8.035h1.509v-8.612c0-2.26-1.202-3.433-3.351-3.433z" data-v-32a25ce8></path></svg>`);
      } else {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-32a25ce8><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-32a25ce8></path></svg>`);
      }
      _push(`</button></div>`);
    };
  }
};
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ContactBubble.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const ContactBubble = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["__scopeId", "data-v-32a25ce8"]]);
const _sfc_main$A = {
  __name: "PublicLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white dark:bg-gray-900" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$D, null, null, _parent));
      _push(`<main class="pt-20">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$C, null, null, _parent));
      _push(ssrRenderComponent(ContactBubble, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/PublicLayout.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const _sfc_main$z = /* @__PURE__ */ defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    variant: {},
    size: {},
    class: {},
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        "data-slot": "button",
        as: __props.as,
        "as-child": __props.asChild,
        class: unref(cn)(unref(buttonVariants)({ variant: __props.variant, size: __props.size }), props.class)
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/button/Button.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        "default": "h-9 px-4 py-2 has-[>svg]:px-3",
        "sm": "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        "lg": "h-10 rounded-md px-6 has-[>svg]:px-4",
        "icon": "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const _sfc_main$y = /* @__PURE__ */ defineComponent({
  __name: "Input",
  __ssrInlineRender: true,
  props: {
    defaultValue: {},
    modelValue: {},
    class: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useVModel(props, "modelValue", emits, {
      passive: true,
      defaultValue: props.defaultValue
    });
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(`<input${ssrRenderAttrs((_temp0 = mergeProps({
        "data-slot": "input",
        class: unref(cn)(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          props.class
        )
      }, _attrs), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, unref(modelValue)))))}>`);
    };
  }
});
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/input/Input.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const _sfc_main$x = /* @__PURE__ */ defineComponent({
  __name: "Label",
  __ssrInlineRender: true,
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Label), mergeProps({ "data-slot": "label" }, unref(delegatedProps), {
        class: unref(cn)(
          "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          props.class
        )
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/label/Label.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const _sfc_main$w = /* @__PURE__ */ defineComponent({
  __name: "Textarea",
  __ssrInlineRender: true,
  props: {
    class: {},
    defaultValue: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useVModel(props, "modelValue", emits, {
      passive: true,
      defaultValue: props.defaultValue
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<textarea${ssrRenderAttrs(mergeProps({
        "data-slot": "textarea",
        class: unref(cn)("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", props.class)
      }, _attrs), "textarea")}>${ssrInterpolate(unref(modelValue))}</textarea>`);
    };
  }
});
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/textarea/Textarea.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "Card",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "card",
        class: unref(cn)(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
          props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/card/Card.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "CardAction",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "card-action",
        class: unref(cn)("col-start-2 row-span-2 row-start-1 self-start justify-self-end", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/card/CardAction.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "CardContent",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "card-content",
        class: unref(cn)("px-6", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/card/CardContent.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "CardDescription",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<p${ssrRenderAttrs(mergeProps({
        "data-slot": "card-description",
        class: unref(cn)("text-muted-foreground text-sm", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</p>`);
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/card/CardDescription.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "CardFooter",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "card-footer",
        class: unref(cn)("flex items-center px-6 [.border-t]:pt-6", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/card/CardFooter.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "CardHeader",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "card-header",
        class: unref(cn)("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/card/CardHeader.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "CardTitle",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<h3${ssrRenderAttrs(mergeProps({
        "data-slot": "card-title",
        class: unref(cn)("leading-none font-semibold", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</h3>`);
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/card/CardTitle.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = /* @__PURE__ */ Object.assign({ layout: _sfc_main$A }, {
  __name: "Contact",
  __ssrInlineRender: true,
  props: {
    pageContent: Object
  },
  setup(__props) {
    const form = reactive({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    const errors = reactive({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    const isSubmitting = ref(false);
    const validateForm = () => {
      errors.name = "";
      errors.email = "";
      errors.subject = "";
      errors.message = "";
      let isValid = true;
      if (!form.name.trim()) {
        errors.name = "Name is required";
        isValid = false;
      } else if (form.name.length < 2) {
        errors.name = "Name must be at least 2 characters";
        isValid = false;
      }
      if (!form.email.trim()) {
        errors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
      if (!form.subject.trim()) {
        errors.subject = "Subject is required";
        isValid = false;
      } else if (form.subject.length < 5) {
        errors.subject = "Subject must be at least 5 characters";
        isValid = false;
      }
      if (!form.message.trim()) {
        errors.message = "Message is required";
        isValid = false;
      } else if (form.message.length < 10) {
        errors.message = "Message must be at least 10 characters";
        isValid = false;
      }
      return isValid;
    };
    const submitForm = async () => {
      if (!validateForm()) return;
      isSubmitting.value = true;
      try {
        await router.post("/contact", form, {
          onSuccess: () => {
            form.name = "";
            form.email = "";
            form.subject = "";
            form.message = "";
            alert("Thank you for your message! We'll get back to you soon.");
          },
          onError: (serverErrors) => {
            if (serverErrors.name) errors.name = serverErrors.name;
            if (serverErrors.email) errors.email = serverErrors.email;
            if (serverErrors.subject) errors.subject = serverErrors.subject;
            if (serverErrors.message) errors.message = serverErrors.message;
          },
          onFinish: () => {
            isSubmitting.value = false;
          }
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("There was an error sending your message. Please try again.");
        isSubmitting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="text-center mb-12"><h1 class="text-4xl font-bold text-foreground mb-8">Contact Us</h1><p class="text-xl text-muted-foreground max-w-3xl mx-auto"> Get in touch with the &quot;A Crazy Day in Accra&quot; team. We&#39;d love to hear from you! </p></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-12">`);
      _push(ssrRenderComponent(unref(_sfc_main$v), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$q), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$p), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Send us a message`);
                      } else {
                        return [
                          createTextVNode("Send us a message")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$s), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Fill out the form below and we&#39;ll get back to you as soon as possible. `);
                      } else {
                        return [
                          createTextVNode(" Fill out the form below and we'll get back to you as soon as possible. ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$p), null, {
                      default: withCtx(() => [
                        createTextVNode("Send us a message")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$s), null, {
                      default: withCtx(() => [
                        createTextVNode(" Fill out the form below and we'll get back to you as soon as possible. ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$t), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-6"${_scopeId2}><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId2}><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$x), { for: "name" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Name *`);
                      } else {
                        return [
                          createTextVNode("Name *")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$y), {
                    id: "name",
                    modelValue: form.name,
                    "onUpdate:modelValue": ($event) => form.name = $event,
                    class: { "border-red-500": errors.name },
                    required: ""
                  }, null, _parent3, _scopeId2));
                  if (errors.name) {
                    _push3(`<div class="text-sm text-red-600"${_scopeId2}>${ssrInterpolate(errors.name)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$x), { for: "email" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Email *`);
                      } else {
                        return [
                          createTextVNode("Email *")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$y), {
                    id: "email",
                    type: "email",
                    modelValue: form.email,
                    "onUpdate:modelValue": ($event) => form.email = $event,
                    class: { "border-red-500": errors.email },
                    required: ""
                  }, null, _parent3, _scopeId2));
                  if (errors.email) {
                    _push3(`<div class="text-sm text-red-600"${_scopeId2}>${ssrInterpolate(errors.email)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$x), { for: "subject" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Subject *`);
                      } else {
                        return [
                          createTextVNode("Subject *")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$y), {
                    id: "subject",
                    modelValue: form.subject,
                    "onUpdate:modelValue": ($event) => form.subject = $event,
                    class: { "border-red-500": errors.subject },
                    required: ""
                  }, null, _parent3, _scopeId2));
                  if (errors.subject) {
                    _push3(`<div class="text-sm text-red-600"${_scopeId2}>${ssrInterpolate(errors.subject)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$x), { for: "message" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Message *`);
                      } else {
                        return [
                          createTextVNode("Message *")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$w), {
                    id: "message",
                    modelValue: form.message,
                    "onUpdate:modelValue": ($event) => form.message = $event,
                    class: { "border-red-500": errors.message },
                    rows: "5",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  if (errors.message) {
                    _push3(`<div class="text-sm text-red-600"${_scopeId2}>${ssrInterpolate(errors.message)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$z), {
                    type: "submit",
                    disabled: isSubmitting.value,
                    class: "w-full"
                  }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (isSubmitting.value) {
                          _push4(`<span${_scopeId3}>Sending...</span>`);
                        } else {
                          _push4(`<span${_scopeId3}>Send Message</span>`);
                        }
                      } else {
                        return [
                          isSubmitting.value ? (openBlock(), createBlock("span", { key: 0 }, "Sending...")) : (openBlock(), createBlock("span", { key: 1 }, "Send Message"))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form>`);
                } else {
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(submitForm, ["prevent"]),
                      class: "space-y-6"
                    }, [
                      createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$x), { for: "name" }, {
                            default: withCtx(() => [
                              createTextVNode("Name *")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$y), {
                            id: "name",
                            modelValue: form.name,
                            "onUpdate:modelValue": ($event) => form.name = $event,
                            class: { "border-red-500": errors.name },
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          errors.name ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-sm text-red-600"
                          }, toDisplayString(errors.name), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$x), { for: "email" }, {
                            default: withCtx(() => [
                              createTextVNode("Email *")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$y), {
                            id: "email",
                            type: "email",
                            modelValue: form.email,
                            "onUpdate:modelValue": ($event) => form.email = $event,
                            class: { "border-red-500": errors.email },
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                          errors.email ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-sm text-red-600"
                          }, toDisplayString(errors.email), 1)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$x), { for: "subject" }, {
                          default: withCtx(() => [
                            createTextVNode("Subject *")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$y), {
                          id: "subject",
                          modelValue: form.subject,
                          "onUpdate:modelValue": ($event) => form.subject = $event,
                          class: { "border-red-500": errors.subject },
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        errors.subject ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-600"
                        }, toDisplayString(errors.subject), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$x), { for: "message" }, {
                          default: withCtx(() => [
                            createTextVNode("Message *")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$w), {
                          id: "message",
                          modelValue: form.message,
                          "onUpdate:modelValue": ($event) => form.message = $event,
                          class: { "border-red-500": errors.message },
                          rows: "5",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        errors.message ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-600"
                        }, toDisplayString(errors.message), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode(unref(_sfc_main$z), {
                        type: "submit",
                        disabled: isSubmitting.value,
                        class: "w-full"
                      }, {
                        default: withCtx(() => [
                          isSubmitting.value ? (openBlock(), createBlock("span", { key: 0 }, "Sending...")) : (openBlock(), createBlock("span", { key: 1 }, "Send Message"))
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$q), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$p), null, {
                    default: withCtx(() => [
                      createTextVNode("Send us a message")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$s), null, {
                    default: withCtx(() => [
                      createTextVNode(" Fill out the form below and we'll get back to you as soon as possible. ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$t), null, {
                default: withCtx(() => [
                  createVNode("form", {
                    onSubmit: withModifiers(submitForm, ["prevent"]),
                    class: "space-y-6"
                  }, [
                    createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$x), { for: "name" }, {
                          default: withCtx(() => [
                            createTextVNode("Name *")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$y), {
                          id: "name",
                          modelValue: form.name,
                          "onUpdate:modelValue": ($event) => form.name = $event,
                          class: { "border-red-500": errors.name },
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        errors.name ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-600"
                        }, toDisplayString(errors.name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$x), { for: "email" }, {
                          default: withCtx(() => [
                            createTextVNode("Email *")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$y), {
                          id: "email",
                          type: "email",
                          modelValue: form.email,
                          "onUpdate:modelValue": ($event) => form.email = $event,
                          class: { "border-red-500": errors.email },
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        errors.email ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-600"
                        }, toDisplayString(errors.email), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$x), { for: "subject" }, {
                        default: withCtx(() => [
                          createTextVNode("Subject *")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$y), {
                        id: "subject",
                        modelValue: form.subject,
                        "onUpdate:modelValue": ($event) => form.subject = $event,
                        class: { "border-red-500": errors.subject },
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                      errors.subject ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-red-600"
                      }, toDisplayString(errors.subject), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$x), { for: "message" }, {
                        default: withCtx(() => [
                          createTextVNode("Message *")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$w), {
                        id: "message",
                        modelValue: form.message,
                        "onUpdate:modelValue": ($event) => form.message = $event,
                        class: { "border-red-500": errors.message },
                        rows: "5",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                      errors.message ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-red-600"
                      }, toDisplayString(errors.message), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode(unref(_sfc_main$z), {
                      type: "submit",
                      disabled: isSubmitting.value,
                      class: "w-full"
                    }, {
                      default: withCtx(() => [
                        isSubmitting.value ? (openBlock(), createBlock("span", { key: 0 }, "Sending...")) : (openBlock(), createBlock("span", { key: 1 }, "Send Message"))
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-8">`);
      _push(ssrRenderComponent(unref(_sfc_main$v), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$q), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$p), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Get in Touch`);
                      } else {
                        return [
                          createTextVNode("Get in Touch")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$s), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Multiple ways to reach out to our team `);
                      } else {
                        return [
                          createTextVNode(" Multiple ways to reach out to our team ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$p), null, {
                      default: withCtx(() => [
                        createTextVNode("Get in Touch")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$s), null, {
                      default: withCtx(() => [
                        createTextVNode(" Multiple ways to reach out to our team ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$t), { class: "space-y-4" }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center space-x-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Mail), { class: "h-5 w-5 text-muted-foreground" }, null, _parent3, _scopeId2));
                  _push3(`<div${_scopeId2}><p class="font-medium text-foreground"${_scopeId2}>Email</p><p class="text-sm text-muted-foreground"${_scopeId2}>info@acrazydayinaccra.com</p></div></div><div class="flex items-center space-x-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Phone), { class: "h-5 w-5 text-muted-foreground" }, null, _parent3, _scopeId2));
                  _push3(`<div${_scopeId2}><p class="font-medium text-foreground"${_scopeId2}>Phone</p><p class="text-sm text-muted-foreground"${_scopeId2}>+233 XX XXX XXXX</p></div></div><div class="flex items-center space-x-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(MapPin), { class: "h-5 w-5 text-muted-foreground" }, null, _parent3, _scopeId2));
                  _push3(`<div${_scopeId2}><p class="font-medium text-foreground"${_scopeId2}>Location</p><p class="text-sm text-muted-foreground"${_scopeId2}>Accra, Ghana</p></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center space-x-3" }, [
                      createVNode(unref(Mail), { class: "h-5 w-5 text-muted-foreground" }),
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-foreground" }, "Email"),
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "info@acrazydayinaccra.com")
                      ])
                    ]),
                    createVNode("div", { class: "flex items-center space-x-3" }, [
                      createVNode(unref(Phone), { class: "h-5 w-5 text-muted-foreground" }),
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-foreground" }, "Phone"),
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "+233 XX XXX XXXX")
                      ])
                    ]),
                    createVNode("div", { class: "flex items-center space-x-3" }, [
                      createVNode(unref(MapPin), { class: "h-5 w-5 text-muted-foreground" }),
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-foreground" }, "Location"),
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "Accra, Ghana")
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$q), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$p), null, {
                    default: withCtx(() => [
                      createTextVNode("Get in Touch")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$s), null, {
                    default: withCtx(() => [
                      createTextVNode(" Multiple ways to reach out to our team ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$t), { class: "space-y-4" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex items-center space-x-3" }, [
                    createVNode(unref(Mail), { class: "h-5 w-5 text-muted-foreground" }),
                    createVNode("div", null, [
                      createVNode("p", { class: "font-medium text-foreground" }, "Email"),
                      createVNode("p", { class: "text-sm text-muted-foreground" }, "info@acrazydayinaccra.com")
                    ])
                  ]),
                  createVNode("div", { class: "flex items-center space-x-3" }, [
                    createVNode(unref(Phone), { class: "h-5 w-5 text-muted-foreground" }),
                    createVNode("div", null, [
                      createVNode("p", { class: "font-medium text-foreground" }, "Phone"),
                      createVNode("p", { class: "text-sm text-muted-foreground" }, "+233 XX XXX XXXX")
                    ])
                  ]),
                  createVNode("div", { class: "flex items-center space-x-3" }, [
                    createVNode(unref(MapPin), { class: "h-5 w-5 text-muted-foreground" }),
                    createVNode("div", null, [
                      createVNode("p", { class: "font-medium text-foreground" }, "Location"),
                      createVNode("p", { class: "text-sm text-muted-foreground" }, "Accra, Ghana")
                    ])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$v), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$q), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$p), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Follow Us`);
                      } else {
                        return [
                          createTextVNode("Follow Us")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$s), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Stay updated with the latest news and behind-the-scenes content `);
                      } else {
                        return [
                          createTextVNode(" Stay updated with the latest news and behind-the-scenes content ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$p), null, {
                      default: withCtx(() => [
                        createTextVNode("Follow Us")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$s), null, {
                      default: withCtx(() => [
                        createTextVNode(" Stay updated with the latest news and behind-the-scenes content ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$t), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex space-x-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$z), {
                    variant: "outline",
                    size: "sm"
                  }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="sr-only"${_scopeId3}>Facebook</span> Facebook `);
                      } else {
                        return [
                          createVNode("span", { class: "sr-only" }, "Facebook"),
                          createTextVNode(" Facebook ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$z), {
                    variant: "outline",
                    size: "sm"
                  }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="sr-only"${_scopeId3}>Twitter</span> Twitter `);
                      } else {
                        return [
                          createVNode("span", { class: "sr-only" }, "Twitter"),
                          createTextVNode(" Twitter ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$z), {
                    variant: "outline",
                    size: "sm"
                  }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="sr-only"${_scopeId3}>Instagram</span> Instagram `);
                      } else {
                        return [
                          createVNode("span", { class: "sr-only" }, "Instagram"),
                          createTextVNode(" Instagram ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex space-x-4" }, [
                      createVNode(unref(_sfc_main$z), {
                        variant: "outline",
                        size: "sm"
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { class: "sr-only" }, "Facebook"),
                          createTextVNode(" Facebook ")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$z), {
                        variant: "outline",
                        size: "sm"
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { class: "sr-only" }, "Twitter"),
                          createTextVNode(" Twitter ")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$z), {
                        variant: "outline",
                        size: "sm"
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { class: "sr-only" }, "Instagram"),
                          createTextVNode(" Instagram ")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$q), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$p), null, {
                    default: withCtx(() => [
                      createTextVNode("Follow Us")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$s), null, {
                    default: withCtx(() => [
                      createTextVNode(" Stay updated with the latest news and behind-the-scenes content ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$t), null, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex space-x-4" }, [
                    createVNode(unref(_sfc_main$z), {
                      variant: "outline",
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "sr-only" }, "Facebook"),
                        createTextVNode(" Facebook ")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$z), {
                      variant: "outline",
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "sr-only" }, "Twitter"),
                        createTextVNode(" Twitter ")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$z), {
                      variant: "outline",
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "sr-only" }, "Instagram"),
                        createTextVNode(" Instagram ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><footer class="bg-gray-900 text-white py-12 mt-16"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-col md:flex-row justify-between items-center"><p class="text-gray-400 mb-4 md:mb-0">© 2025 A Crazy Day in Accra. All rights reserved.</p><div class="flex space-x-6">`);
      _push(ssrRenderComponent(_component_Link, {
        href: "/terms",
        class: "text-gray-400 hover:text-white transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Terms of Service`);
          } else {
            return [
              createTextVNode("Terms of Service")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Link, {
        href: "/privacy",
        class: "text-gray-400 hover:text-white transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Privacy Policy`);
          } else {
            return [
              createTextVNode("Privacy Policy")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></footer></div>`);
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Contact.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const __vite_glob_0_36 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$o
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "Tabs",
  __ssrInlineRender: true,
  props: {
    defaultValue: {},
    orientation: {},
    dir: {},
    activationMode: {},
    modelValue: {},
    unmountOnHide: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsRoot), mergeProps({ "data-slot": "tabs" }, unref(forwarded), {
        class: unref(cn)("flex flex-col gap-2", props.class)
      }, _attrs), {
        default: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", slotProps, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", slotProps)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/tabs/Tabs.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "TabsContent",
  __ssrInlineRender: true,
  props: {
    value: {},
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsContent), mergeProps({
        "data-slot": "tabs-content",
        class: unref(cn)("flex-1 outline-none", props.class)
      }, unref(delegatedProps), _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/tabs/TabsContent.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "TabsList",
  __ssrInlineRender: true,
  props: {
    loop: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsList), mergeProps({ "data-slot": "tabs-list" }, unref(delegatedProps), {
        class: unref(cn)(
          "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
          props.class
        )
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/tabs/TabsList.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "TabsTrigger",
  __ssrInlineRender: true,
  props: {
    value: {},
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsTrigger), mergeProps({
        "data-slot": "tabs-trigger",
        class: unref(cn)(
          "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          props.class
        )
      }, unref(forwardedProps), _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/tabs/TabsTrigger.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "Dialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogRoot), mergeProps({ "data-slot": "dialog" }, unref(forwarded), _attrs), {
        default: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", slotProps, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", slotProps)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/Dialog.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "DialogClose",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogClose), mergeProps({ "data-slot": "dialog-close" }, props, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogClose.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "DialogOverlay",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogOverlay), mergeProps({ "data-slot": "dialog-overlay" }, unref(delegatedProps), {
        class: unref(cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80", props.class)
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogOverlay.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "DialogContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {},
    showCloseButton: { type: Boolean, default: true }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogPortal), _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$h, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(DialogContent), mergeProps({ "data-slot": "dialog-content" }, { ..._ctx.$attrs, ...unref(forwarded) }, {
              class: unref(cn)(
                "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
                props.class
              )
            }), {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  if (__props.showCloseButton) {
                    _push3(ssrRenderComponent(unref(DialogClose), {
                      "data-slot": "dialog-close",
                      class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(X), null, null, _parent4, _scopeId3));
                          _push4(`<span class="sr-only"${_scopeId3}>Close</span>`);
                        } else {
                          return [
                            createVNode(unref(X)),
                            createVNode("span", { class: "sr-only" }, "Close")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default"),
                    __props.showCloseButton ? (openBlock(), createBlock(unref(DialogClose), {
                      key: 0,
                      "data-slot": "dialog-close",
                      class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(X)),
                        createVNode("span", { class: "sr-only" }, "Close")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$h),
              createVNode(unref(DialogContent), mergeProps({ "data-slot": "dialog-content" }, { ..._ctx.$attrs, ...unref(forwarded) }, {
                class: unref(cn)(
                  "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
                  props.class
                )
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default"),
                  __props.showCloseButton ? (openBlock(), createBlock(unref(DialogClose), {
                    key: 0,
                    "data-slot": "dialog-close",
                    class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(X)),
                      createVNode("span", { class: "sr-only" }, "Close")
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 3
              }, 16, ["class"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogContent.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "DialogDescription",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogDescription), mergeProps({ "data-slot": "dialog-description" }, unref(forwardedProps), {
        class: unref(cn)("text-muted-foreground text-sm", props.class)
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogDescription.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "DialogFooter",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "dialog-footer",
        class: unref(cn)("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogFooter.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "DialogHeader",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "dialog-header",
        class: unref(cn)("flex flex-col gap-2 text-center sm:text-left", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogHeader.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "DialogScrollContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogPortal), _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(DialogOverlay), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(DialogContent), mergeProps({
                    class: unref(cn)(
                      "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                      props.class
                    )
                  }, { ..._ctx.$attrs, ...unref(forwarded) }, {
                    onPointerDownOutside: (event) => {
                      const originalEvent = event.detail.originalEvent;
                      const target = originalEvent.target;
                      if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
                        event.preventDefault();
                      }
                    }
                  }), {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                        _push4(ssrRenderComponent(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent5, _scopeId4));
                              _push5(`<span class="sr-only"${_scopeId4}>Close</span>`);
                            } else {
                              return [
                                createVNode(unref(X), { class: "w-4 h-4" }),
                                createVNode("span", { class: "sr-only" }, "Close")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default"),
                          createVNode(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                            default: withCtx(() => [
                              createVNode(unref(X), { class: "w-4 h-4" }),
                              createVNode("span", { class: "sr-only" }, "Close")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(DialogContent), mergeProps({
                      class: unref(cn)(
                        "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                        props.class
                      )
                    }, { ..._ctx.$attrs, ...unref(forwarded) }, {
                      onPointerDownOutside: (event) => {
                        const originalEvent = event.detail.originalEvent;
                        const target = originalEvent.target;
                        if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
                          event.preventDefault();
                        }
                      }
                    }), {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default"),
                        createVNode(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                          default: withCtx(() => [
                            createVNode(unref(X), { class: "w-4 h-4" }),
                            createVNode("span", { class: "sr-only" }, "Close")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 3
                    }, 16, ["class", "onPointerDownOutside"])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(DialogOverlay), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
                default: withCtx(() => [
                  createVNode(unref(DialogContent), mergeProps({
                    class: unref(cn)(
                      "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                      props.class
                    )
                  }, { ..._ctx.$attrs, ...unref(forwarded) }, {
                    onPointerDownOutside: (event) => {
                      const originalEvent = event.detail.originalEvent;
                      const target = originalEvent.target;
                      if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
                        event.preventDefault();
                      }
                    }
                  }), {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "default"),
                      createVNode(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                        default: withCtx(() => [
                          createVNode(unref(X), { class: "w-4 h-4" }),
                          createVNode("span", { class: "sr-only" }, "Close")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 3
                  }, 16, ["class", "onPointerDownOutside"])
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogScrollContent.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "DialogTitle",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogTitle), mergeProps({ "data-slot": "dialog-title" }, unref(forwardedProps), {
        class: unref(cn)("text-lg leading-none font-semibold", props.class)
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogTitle.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "DialogTrigger",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogTrigger), mergeProps({ "data-slot": "dialog-trigger" }, props, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/dialog/DialogTrigger.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ Object.assign({ layout: _sfc_main$A }, {
  __name: "Gallery",
  __ssrInlineRender: true,
  props: {
    gallery: Array,
    pageContent: Object
  },
  setup(__props) {
    const props = __props;
    const activeCategory = ref("all");
    const lightboxOpen = ref(false);
    const lightboxIndex = ref(0);
    const images = computed(() => {
      return props.gallery?.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        category: item.category || "behind-the-scenes"
      })) || [];
    });
    const filteredImages = computed(() => {
      if (activeCategory.value === "all") {
        return images.value;
      }
      return images.value.filter((img) => img.category === activeCategory.value);
    });
    const selectedImage = computed(() => {
      return filteredImages.value[lightboxIndex.value];
    });
    const nextImage = () => {
      if (lightboxIndex.value < filteredImages.value.length - 1) {
        lightboxIndex.value++;
      }
    };
    const previousImage = () => {
      if (lightboxIndex.value > 0) {
        lightboxIndex.value--;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="text-center mb-12"><h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">Behind the Scenes</h1><p class="text-xl text-muted-foreground max-w-2xl mx-auto"> Explore exclusive behind-the-scenes content, cast interviews, making-of footage, and production moments </p></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$n), {
        modelValue: activeCategory.value,
        "onUpdate:modelValue": ($event) => activeCategory.value = $event,
        class: "mb-8"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$l), { class: "grid w-full max-w-3xl mx-auto grid-cols-3 md:grid-cols-6" }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$k), { value: "all" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`All`);
                      } else {
                        return [
                          createTextVNode("All")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$k), { value: "behind-the-scenes" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`BTS`);
                      } else {
                        return [
                          createTextVNode("BTS")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$k), { value: "cast-interviews" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Interviews`);
                      } else {
                        return [
                          createTextVNode("Interviews")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$k), { value: "making-of" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Making Of`);
                      } else {
                        return [
                          createTextVNode("Making Of")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$k), { value: "film-stills" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Stills`);
                      } else {
                        return [
                          createTextVNode("Stills")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$k), { value: "production" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Production`);
                      } else {
                        return [
                          createTextVNode("Production")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$k), { value: "all" }, {
                      default: withCtx(() => [
                        createTextVNode("All")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$k), { value: "behind-the-scenes" }, {
                      default: withCtx(() => [
                        createTextVNode("BTS")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$k), { value: "cast-interviews" }, {
                      default: withCtx(() => [
                        createTextVNode("Interviews")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$k), { value: "making-of" }, {
                      default: withCtx(() => [
                        createTextVNode("Making Of")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$k), { value: "film-stills" }, {
                      default: withCtx(() => [
                        createTextVNode("Stills")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$k), { value: "production" }, {
                      default: withCtx(() => [
                        createTextVNode("Production")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$l), { class: "grid w-full max-w-3xl mx-auto grid-cols-3 md:grid-cols-6" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$k), { value: "all" }, {
                    default: withCtx(() => [
                      createTextVNode("All")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$k), { value: "behind-the-scenes" }, {
                    default: withCtx(() => [
                      createTextVNode("BTS")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$k), { value: "cast-interviews" }, {
                    default: withCtx(() => [
                      createTextVNode("Interviews")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$k), { value: "making-of" }, {
                    default: withCtx(() => [
                      createTextVNode("Making Of")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$k), { value: "film-stills" }, {
                    default: withCtx(() => [
                      createTextVNode("Stills")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$k), { value: "production" }, {
                    default: withCtx(() => [
                      createTextVNode("Production")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (filteredImages.value.length === 0) {
        _push(`<div class="text-center py-20"><p class="text-muted-foreground">No images found in this category.</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(filteredImages.value, (image, index) => {
          _push(`<div class="group relative aspect-video overflow-hidden rounded-lg cursor-pointer shadow-lg hover:shadow-xl transition-all"><img${ssrRenderAttr("src", image.image_url)}${ssrRenderAttr("alt", image.title)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"><div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"><div class="absolute bottom-0 left-0 right-0 p-4"><h3 class="text-white font-semibold text-lg">${ssrInterpolate(image.title)}</h3>`);
          if (image.description) {
            _push(`<p class="text-white/80 text-sm mt-1">${ssrInterpolate(image.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(unref(_sfc_main$j), {
        open: lightboxOpen.value,
        "onUpdate:open": ($event) => lightboxOpen.value = $event
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$g), { class: "max-w-4xl" }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$d), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$b), null, {
                          default: withCtx((_5, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(selectedImage.value?.title)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(selectedImage.value?.title), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (selectedImage.value?.description) {
                          _push4(ssrRenderComponent(unref(_sfc_main$f), null, {
                            default: withCtx((_5, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(selectedImage.value.description)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(selectedImage.value.description), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode(unref(_sfc_main$b), null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(selectedImage.value?.title), 1)
                            ]),
                            _: 1
                          }),
                          selectedImage.value?.description ? (openBlock(), createBlock(unref(_sfc_main$f), { key: 0 }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(selectedImage.value.description), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="mt-4"${_scopeId2}>`);
                  if (selectedImage.value) {
                    _push3(`<img${ssrRenderAttr("src", selectedImage.value.image_url)}${ssrRenderAttr("alt", selectedImage.value.title)} class="w-full h-auto max-h-[70vh] object-contain rounded-lg"${_scopeId2}>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$e), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$z), {
                          variant: "outline",
                          onClick: previousImage,
                          disabled: lightboxIndex.value === 0
                        }, {
                          default: withCtx((_5, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Previous `);
                            } else {
                              return [
                                createTextVNode(" Previous ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$z), {
                          variant: "outline",
                          onClick: nextImage,
                          disabled: lightboxIndex.value === filteredImages.value.length - 1
                        }, {
                          default: withCtx((_5, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Next `);
                            } else {
                              return [
                                createTextVNode(" Next ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$z), {
                            variant: "outline",
                            onClick: previousImage,
                            disabled: lightboxIndex.value === 0
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Previous ")
                            ]),
                            _: 1
                          }, 8, ["disabled"]),
                          createVNode(unref(_sfc_main$z), {
                            variant: "outline",
                            onClick: nextImage,
                            disabled: lightboxIndex.value === filteredImages.value.length - 1
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Next ")
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$d), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$b), null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(selectedImage.value?.title), 1)
                          ]),
                          _: 1
                        }),
                        selectedImage.value?.description ? (openBlock(), createBlock(unref(_sfc_main$f), { key: 0 }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(selectedImage.value.description), 1)
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "mt-4" }, [
                      selectedImage.value ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: selectedImage.value.image_url,
                        alt: selectedImage.value.title,
                        class: "w-full h-auto max-h-[70vh] object-contain rounded-lg"
                      }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                    ]),
                    createVNode(unref(_sfc_main$e), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$z), {
                          variant: "outline",
                          onClick: previousImage,
                          disabled: lightboxIndex.value === 0
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Previous ")
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        createVNode(unref(_sfc_main$z), {
                          variant: "outline",
                          onClick: nextImage,
                          disabled: lightboxIndex.value === filteredImages.value.length - 1
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Next ")
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$g), { class: "max-w-4xl" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$d), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$b), null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedImage.value?.title), 1)
                        ]),
                        _: 1
                      }),
                      selectedImage.value?.description ? (openBlock(), createBlock(unref(_sfc_main$f), { key: 0 }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedImage.value.description), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "mt-4" }, [
                    selectedImage.value ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: selectedImage.value.image_url,
                      alt: selectedImage.value.title,
                      class: "w-full h-auto max-h-[70vh] object-contain rounded-lg"
                    }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                  ]),
                  createVNode(unref(_sfc_main$e), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$z), {
                        variant: "outline",
                        onClick: previousImage,
                        disabled: lightboxIndex.value === 0
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Previous ")
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode(unref(_sfc_main$z), {
                        variant: "outline",
                        onClick: nextImage,
                        disabled: lightboxIndex.value === filteredImages.value.length - 1
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Next ")
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Gallery.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __vite_glob_0_37 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$8 = /* @__PURE__ */ Object.assign({
  layout: _sfc_main$A
}, {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    heroBanner: {
      type: Object,
      default: null
    },
    banners: {
      type: Array,
      default: () => []
    },
    trailerUrl: {
      type: String,
      default: "https://vz-6024b712-a89.b-cdn.net/643d70e3-19ee-4ae9-a2c9-ec20bf5742d9/playlist.m3u8"
    },
    premiereDate: {
      type: String,
      default: "2025-12-10T06:00:00Z"
    },
    castCrew: {
      type: Array,
      default: () => []
    },
    reviews: {
      type: Array,
      default: () => []
    },
    sponsors: {
      type: Array,
      default: () => []
    },
    paid: Boolean,
    user: {
      type: Object,
      default: null
    }
  },
  setup(__props) {
    const props = __props;
    const activeBanner = computed(() => {
      if (props.heroBanner) return props.heroBanner;
      return props.banners.find((banner) => banner.is_active) || null;
    });
    const resolvedTrailerUrl = computed(() => activeBanner.value?.trailer_url || props.trailerUrl);
    const heroTitle = computed(() => activeBanner.value?.title || "A Crazy Day in Accra");
    const heroMessage = computed(
      () => activeBanner.value?.message || "One city. One insane day. A high-energy Ghanaian thriller packed with chaos, humor, and heart."
    );
    const heroFallbackImage = computed(() => activeBanner.value?.thumbnail_url || null);
    const heroCtaUrl = computed(() => activeBanner.value?.cta_url || "");
    ref(null);
    const trailerVideo = ref(null);
    const trailerVideoSection = ref(null);
    const heroHlsInstance = ref(null);
    const trailerHlsInstance = ref(null);
    const showHeroContent = ref(true);
    const heroBgStyle = computed(() => ({
      backgroundImage: heroFallbackImage.value ? `linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 35%, #0f0f0f 100%), url(${heroFallbackImage.value})` : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }));
    const movieMeta = {
      rating: "16+",
      runtime: "1h 45m",
      year: "2025",
      genres: ["Thriller", "Comedy", "Drama"]
    };
    const continueWatching = ref([]);
    const episodes = [
      {
        id: 1,
        number: 1,
        title: "A Crazy Morning",
        duration: "22m",
        thumbnail: "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22260%22 height=%22140%22%3E%3Crect fill=%22%231a1a1a%22 width=%22260%22 height=%22140%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%23ff6b6b%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22%3EEpisode 1%3C/text%3E%3C/svg%3E",
        description: "The day starts off normal… until Accra decides otherwise."
      },
      {
        id: 2,
        number: 2,
        title: "Traffic Trouble",
        duration: "24m",
        thumbnail: "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22260%22 height=%22140%22%3E%3Crect fill=%22%231a1a1a%22 width=%22260%22 height=%22140%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%23ff6b6b%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22%3EEpisode 2%3C/text%3E%3C/svg%3E",
        description: "A simple ride across town turns into total chaos."
      },
      {
        id: 3,
        number: 3,
        title: "Market Madness",
        duration: "21m",
        thumbnail: "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22260%22 height=%22140%22%3E%3Crect fill=%22%231a1a1a%22 width=%22260%22 height=%22140%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%23ff6b6b%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22%3EEpisode 3%3C/text%3E%3C/svg%3E",
        description: "Trotros, sellers, and one very wrong turn."
      }
    ];
    const showEpisodes = computed(() => props.user && episodes.length > 0);
    const trailerSection = ref(null);
    const castSection = ref(null);
    const reviewsSection = ref(null);
    const trailerVisible = ref(false);
    const castVisible = ref(false);
    const reviewsVisible = ref(false);
    const isMuted = ref(true);
    const volume = ref(0.7);
    const videoLoading = ref(true);
    const videoError = ref(false);
    let observer = null;
    const premiereAt = new Date(props.premiereDate || "2025-12-10T06:00:00Z");
    const now = ref(/* @__PURE__ */ new Date());
    let countdownTimer = null;
    const countdown = computed(() => {
      const diff = premiereAt.getTime() - now.value.getTime();
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
      }
      const totalSeconds = Math.floor(diff / 1e3);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor(totalSeconds % 86400 / 3600);
      const minutes = Math.floor(totalSeconds % 3600 / 60);
      const seconds = totalSeconds % 60;
      return { days, hours, minutes, seconds, isPast: false };
    });
    const heroCtaLabel = computed(
      () => activeBanner.value?.cta_text || (!countdown.value.isPast ? "Watch Trailer" : "Watch Now")
    );
    const premiereLabel = computed(() => {
      return premiereAt.toUTCString().replace("GMT", "GMT");
    });
    const notifyState = ref({
      loading: false,
      success: "",
      error: "",
      showForm: false,
      email: ""
    });
    const user = computed(() => props.user);
    const blockKeys = (e2) => {
      if (e2.key === "PrintScreen" || e2.ctrlKey && ["S", "U"].includes(e2.key) || e2.ctrlKey && e2.shiftKey && ["I", "J", "C"].includes(e2.key)) {
        e2.preventDefault();
        return false;
      }
    };
    const setupHls = (videoEl, hlsRef, { autoplay = false, muted = true } = {}) => {
      if (!videoEl || !resolvedTrailerUrl.value) return;
      videoEl.muted = muted;
      if (Hls.isSupported()) {
        hlsRef.value = new Hls({
          autoStartLoad: true,
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          backBufferLength: 0
        });
        hlsRef.value.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);
          if (data.fatal) {
            videoError.value = true;
            videoLoading.value = false;
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              console.log("Attempting to recover from network error...");
              hlsRef.value.startLoad();
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              console.log("Attempting to recover from media error...");
              hlsRef.value.recoverMediaError();
            }
          }
        });
        hlsRef.value.loadSource(resolvedTrailerUrl.value);
        hlsRef.value.attachMedia(videoEl);
        hlsRef.value.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest parsed");
          videoLoading.value = false;
          if (autoplay) {
            videoEl.play().catch((err) => {
              console.log("Autoplay blocked, trying muted:", err);
              videoEl.muted = true;
              isMuted.value = true;
              videoEl.play().catch(() => {
                console.log("Autoplay failed even when muted");
              });
            });
          }
        });
      } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
        videoEl.src = resolvedTrailerUrl.value;
        videoEl.addEventListener("loadedmetadata", () => {
          videoLoading.value = false;
          if (autoplay) {
            videoEl.play().catch((err) => {
              console.log("Autoplay blocked, trying muted:", err);
              videoEl.muted = true;
              isMuted.value = true;
              videoEl.play().catch(() => {
                console.log("Autoplay failed even when muted");
              });
            });
          }
        });
      }
    };
    onMounted(async () => {
      if (resolvedTrailerUrl.value && trailerVideo.value) {
        const video = trailerVideo.value;
        video.addEventListener("contextmenu", (e2) => e2.preventDefault());
        video.volume = volume.value;
        setupHls(video, heroHlsInstance, { autoplay: true, muted: true });
        window.addEventListener("keydown", blockKeys);
      }
      if (resolvedTrailerUrl.value && trailerVideoSection.value) {
        const video = trailerVideoSection.value;
        video.setAttribute("controlsList", "nodownload noplaybackrate noremoteplayback");
        video.setAttribute("disablePictureInPicture", true);
        video.addEventListener("contextmenu", (e2) => e2.preventDefault());
        setupHls(video, trailerHlsInstance, { autoplay: false, muted: false });
        window.addEventListener("keydown", blockKeys);
      }
      if (props.user) {
        try {
          const response = await fetch("/api/watch-progress");
          const data = await response.json();
          continueWatching.value = data;
        } catch (err) {
          console.error("Failed to load continue watching:", err);
        }
      }
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              if (entry.target === trailerSection.value) {
                trailerVisible.value = true;
              } else if (entry.target === castSection.value) {
                castVisible.value = true;
              } else if (entry.target === reviewsSection.value) {
                reviewsVisible.value = true;
              }
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.2 }
        );
        if (trailerSection.value) observer.observe(trailerSection.value);
        if (castSection.value) observer.observe(castSection.value);
        if (reviewsSection.value) observer.observe(reviewsSection.value);
      } else {
        trailerVisible.value = true;
        castVisible.value = true;
        reviewsVisible.value = true;
      }
      countdownTimer = setInterval(() => {
        now.value = /* @__PURE__ */ new Date();
      }, 1e3);
    });
    onUnmounted(() => {
      if (heroHlsInstance.value) {
        heroHlsInstance.value.destroy();
      }
      if (trailerHlsInstance.value) {
        trailerHlsInstance.value.destroy();
      }
      if (observer) {
        observer.disconnect();
      }
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
      window.removeEventListener("keydown", blockKeys);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-black text-white overflow-x-hidden" }, _attrs))} data-v-8b353967><section class="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden" data-v-8b353967><div class="absolute inset-0 w-full h-full bg-black z-0" data-v-8b353967>`);
      if (resolvedTrailerUrl.value) {
        _push(`<video class="w-full h-full object-cover relative z-10" playsinline${ssrIncludeBooleanAttr(isMuted.value) ? " muted" : ""} preload="metadata" data-v-8b353967></video>`);
      } else {
        _push(`<!---->`);
      }
      if (resolvedTrailerUrl.value && videoLoading.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center bg-black/80 z-20" data-v-8b353967><div class="text-center" data-v-8b353967><div class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" data-v-8b353967></div><p class="text-white text-sm" data-v-8b353967>Loading trailer...</p></div></div>`);
      } else {
        _push(`<div class="pointer-events-none absolute inset-0 bg-cover bg-center will-change-transform" style="${ssrRenderStyle(heroBgStyle.value)}" data-v-8b353967></div>`);
      }
      _push(`</div>`);
      if (resolvedTrailerUrl.value && !videoLoading.value) {
        _push(`<button class="fixed bottom-24 right-8 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-white/80 bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all hover:scale-105 shadow-2xl" style="${ssrRenderStyle({ "pointer-events": "auto !important" })}" data-v-8b353967>`);
        if (isMuted.value) {
          _push(`<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" data-v-8b353967><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" data-v-8b353967></path></svg>`);
        } else {
          _push(`<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" data-v-8b353967><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" data-v-8b353967></path></svg>`);
        }
        _push(`<span class="text-white font-semibold text-sm" data-v-8b353967>${ssrInterpolate(isMuted.value ? "Unmute" : "Mute")}</span></button>`);
      } else {
        _push(`<!---->`);
      }
      if (resolvedTrailerUrl.value) {
        _push(`<div class="absolute top-4 right-6 z-20 text-xs text-white/35 tracking-widest select-none pointer-events-none" data-v-8b353967> PROMISE LAND FILMS • PREVIEW </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-5" style="${ssrRenderStyle({ opacity: showHeroContent.value ? 0.5 : 0.2, transition: "opacity 1s ease-out" })}" data-v-8b353967></div><div class="pointer-events-none absolute inset-0 opacity-10 mix-blend-soft-light grain z-30" data-v-8b353967></div><div class="relative z-40 max-w-5xl px-6 text-center transition-all duration-1000" style="${ssrRenderStyle({
        opacity: showHeroContent.value ? 1 : 0,
        transform: showHeroContent.value ? "translateY(0)" : "translateY(20px)",
        pointerEvents: showHeroContent.value ? "auto" : "none"
      })}" data-v-8b353967><p class="text-xs uppercase tracking-[0.35em] text-red-400 mb-4 opacity-80" data-v-8b353967> Promise Land Films Original </p><h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-xl leading-tight" data-v-8b353967>${ssrInterpolate(heroTitle.value)}</h1><div class="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300 mb-4" data-v-8b353967><span class="px-2 py-0.5 border border-white/50 rounded text-xs font-semibold" data-v-8b353967>${ssrInterpolate(movieMeta.rating)}</span><span data-v-8b353967>${ssrInterpolate(movieMeta.year)}</span><span data-v-8b353967>•</span><span data-v-8b353967>${ssrInterpolate(movieMeta.runtime)}</span><span data-v-8b353967>•</span><span class="flex flex-wrap gap-2" data-v-8b353967><!--[-->`);
      ssrRenderList(movieMeta.genres, (genre) => {
        _push(`<span class="text-gray-300" data-v-8b353967>${ssrInterpolate(genre)}</span>`);
      });
      _push(`<!--]--></span></div><div class="mb-6 text-sm" data-v-8b353967><div class="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs md:text-sm text-gray-100" data-v-8b353967>`);
      if (!countdown.value.isPast) {
        _push(`<span class="flex items-center gap-2" data-v-8b353967> ⏳ <span class="font-semibold" data-v-8b353967>Premieres in</span><span data-v-8b353967>${ssrInterpolate(countdown.value.days)}d ${ssrInterpolate(countdown.value.hours)}h ${ssrInterpolate(countdown.value.minutes)}m ${ssrInterpolate(countdown.value.seconds)}s </span></span>`);
      } else {
        _push(`<span class="flex items-center gap-2 text-green-400" data-v-8b353967> ✅ <span class="font-semibold" data-v-8b353967>Now streaming exclusively on Promise Land Films</span></span>`);
      }
      _push(`<span class="hidden md:inline text-gray-300/80 ml-2" data-v-8b353967>${ssrInterpolate(premiereLabel.value)}</span></div></div><p class="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8" data-v-8b353967>${ssrInterpolate(heroMessage.value)}</p><div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4" data-v-8b353967><button class="px-10 py-4 bg-red-600 hover:bg-red-700 rounded-full font-bold text-lg shadow-xl transition-all flex items-center gap-3 hero-cta" data-v-8b353967><span class="inline-flex h-8 w-8 rounded-full bg-white/15 items-center justify-center" data-v-8b353967> ▶ </span><span data-v-8b353967>${ssrInterpolate(heroCtaLabel.value)}</span></button>`);
      if (!countdown.value.isPast && !heroCtaUrl.value) {
        _push(`<button class="px-10 py-4 border border-white/30 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/60 transition-all flex items-center gap-2"${ssrIncludeBooleanAttr(notifyState.value.loading) ? " disabled" : ""} data-v-8b353967><span data-v-8b353967>🔔</span><span data-v-8b353967>${ssrInterpolate(notifyState.value.success ? "Reminded" : notifyState.value.loading ? "Please wait..." : "Remind Me")}</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (notifyState.value.showForm && !user.value && !countdown.value.isPast) {
        _push(`<div class="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs md:text-sm" data-v-8b353967><input${ssrRenderAttr("value", notifyState.value.email)} type="email" placeholder="Enter your email for a launch reminder" class="w-full sm:w-72 px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-600" data-v-8b353967><button class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"${ssrIncludeBooleanAttr(notifyState.value.loading) ? " disabled" : ""} data-v-8b353967> Save </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (notifyState.value.error) {
        _push(`<p class="mt-2 text-xs text-red-400" data-v-8b353967>${ssrInterpolate(notifyState.value.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (notifyState.value.success) {
        _push(`<p class="mt-2 text-xs text-green-400" data-v-8b353967>${ssrInterpolate(notifyState.value.success)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
      if (__props.sponsors && __props.sponsors.length > 0) {
        _push(`<section class="py-16 px-6 bg-gradient-to-b from-black to-gray-900 border-t border-gray-800" data-v-8b353967><div class="max-w-6xl mx-auto" data-v-8b353967><h2 class="text-xl md:text-2xl font-bold mb-10 text-center text-gray-300" data-v-8b353967> Our Partners </h2><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center" data-v-8b353967><!--[-->`);
        ssrRenderList(__props.sponsors, (sponsor, index) => {
          _push(`<a${ssrRenderAttr("href", sponsor.website_url || "#")} target="_blank" rel="noopener noreferrer" class="group relative w-full aspect-video flex items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]" data-v-8b353967><img${ssrRenderAttr("src", sponsor.logo_url)}${ssrRenderAttr("alt", sponsor.name)} class="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" loading="lazy" data-v-8b353967></a>`);
        });
        _push(`<!--]--></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (user.value) {
        _push(`<section class="py-16 px-6 bg-black" data-v-8b353967><div class="max-w-7xl mx-auto" data-v-8b353967><h2 class="text-2xl md:text-3xl font-bold mb-6" data-v-8b353967> Featured Content </h2><div class="flex gap-6 overflow-x-auto scrollbar-hide pb-4" data-v-8b353967><div class="min-w-[280px] group cursor-pointer transform hover:-translate-y-2 transition-all duration-300" data-v-8b353967><div class="relative rounded-xl overflow-hidden bg-gray-900" data-v-8b353967><img${ssrRenderAttr("src", "/movie_poster_2.jpg")} alt="Full Movie" class="w-full h-[160px] object-cover group-hover:scale-110 transition-transform duration-300" data-v-8b353967><div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" data-v-8b353967></div><div class="absolute inset-0 flex items-center justify-center" data-v-8b353967><div class="w-16 h-16 rounded-full bg-red-600/80 flex items-center justify-center group-hover:bg-red-600 group-hover:scale-110 transition-all" data-v-8b353967><svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24" data-v-8b353967><path d="M8 5v14l11-7z" data-v-8b353967></path></svg></div></div><div class="absolute bottom-3 left-3 right-3" data-v-8b353967><span class="inline-block px-2 py-1 bg-red-600 text-xs font-semibold rounded mb-1" data-v-8b353967>FULL MOVIE</span><p class="text-sm font-bold text-white" data-v-8b353967>A Crazy Day in Accra</p></div></div><p class="mt-2 text-sm text-gray-400" data-v-8b353967>1h 42m • Action, Comedy, Thriller</p></div></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (continueWatching.value.length > 0) {
        _push(`<section class="py-16 px-6 bg-black" data-v-8b353967><div class="max-w-7xl mx-auto" data-v-8b353967><h2 class="text-2xl md:text-3xl font-bold mb-6" data-v-8b353967> Continue Watching </h2><div class="flex gap-6 overflow-x-auto scrollbar-hide pb-4" data-v-8b353967><!--[-->`);
        ssrRenderList(continueWatching.value, (item) => {
          _push(`<div class="min-w-[220px] group cursor-pointer" data-v-8b353967><div class="relative rounded-xl overflow-hidden" data-v-8b353967><img${ssrRenderAttr("src", item.poster)}${ssrRenderAttr("alt", item.title)} class="w-full h-[130px] object-cover group-hover:scale-110 transition-transform duration-300" data-v-8b353967><div class="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none" data-v-8b353967></div><div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20" data-v-8b353967><div class="h-1 bg-red-500" style="${ssrRenderStyle({ inlineSize: item.progress + "%" })}" data-v-8b353967></div></div><div class="absolute bottom-3 right-3 text-[10px] bg-black/70 px-2 py-0.5 rounded-full" data-v-8b353967>${ssrInterpolate(item.timeLeft)}</div></div><p class="mt-2 text-sm font-semibold" data-v-8b353967>${ssrInterpolate(item.title)}</p></div>`);
        });
        _push(`<!--]--></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (showEpisodes.value) {
        _push(`<section class="py-16 px-6 bg-black" data-v-8b353967><div class="max-w-7xl mx-auto" data-v-8b353967><div class="flex items-center justify-between mb-6" data-v-8b353967><h2 class="text-2xl md:text-3xl font-bold" data-v-8b353967> Episodes &amp; Extras </h2><span class="text-sm text-gray-400" data-v-8b353967>Season 1</span></div><div class="flex gap-6 overflow-x-auto scrollbar-hide pb-4" data-v-8b353967><!--[-->`);
        ssrRenderList(episodes, (episode) => {
          _push(`<div class="min-w-[260px] bg-gray-900 rounded-xl overflow-hidden group cursor-pointer transform hover:-translate-y-1 transition-transform duration-300" data-v-8b353967><div class="relative h-[140px]" data-v-8b353967><img${ssrRenderAttr("src", episode.thumbnail)}${ssrRenderAttr("alt", episode.title)} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" data-v-8b353967><div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" data-v-8b353967></div><div class="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-gray-200" data-v-8b353967><span class="bg-black/60 px-2 py-0.5 rounded-full" data-v-8b353967> Episode ${ssrInterpolate(episode.number)}</span><span class="bg-black/60 px-2 py-0.5 rounded-full" data-v-8b353967>${ssrInterpolate(episode.duration)}</span></div></div><div class="p-3" data-v-8b353967><p class="font-semibold text-sm mb-1 truncate" data-v-8b353967>${ssrInterpolate(episode.title)}</p><p class="text-xs text-gray-400 line-clamp-2" data-v-8b353967>${ssrInterpolate(episode.description)}</p></div></div>`);
        });
        _push(`<!--]--></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section id="trailer" class="${ssrRenderClass([trailerVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6", "relative py-24 px-6 max-w-6xl mx-auto transition-all duration-700 ease-out hidden"])}" data-v-8b353967><h2 class="text-3xl md:text-4xl font-bold mb-10 text-center" data-v-8b353967> Official Trailer </h2><div class="relative rounded-lg overflow-hidden shadow-2xl border border-gray-700 bg-black" data-v-8b353967><div class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/50 pointer-events-none" data-v-8b353967></div>`);
      if (resolvedTrailerUrl.value) {
        _push(`<video class="w-full h-[260px] md:h-[480px] bg-black" controls playsinline preload="auto" controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture data-v-8b353967></video>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><section class="${ssrRenderClass([castVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6", "py-24 px-6 bg-black transition-all duration-700 ease-out"])}" data-v-8b353967><div class="max-w-6xl mx-auto" data-v-8b353967><h2 class="text-3xl md:text-4xl font-bold mb-14 text-center" data-v-8b353967> Cast &amp; Crew </h2><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" data-v-8b353967><!--[-->`);
      ssrRenderList(__props.castCrew, (member) => {
        _push(`<div class="group text-center transform transition-transform duration-300 hover:-translate-y-2" data-v-8b353967><div class="relative mb-4 aspect-[3/4] overflow-hidden rounded-lg" data-v-8b353967><div class="absolute inset-0 bg-red-500/25 blur-xl opacity-0 group-hover:opacity-100 transition-opacity z-0" data-v-8b353967></div><img${ssrRenderAttr("src", member.image_url)}${ssrRenderAttr("alt", member.stage_name)} class="relative w-full h-full object-cover border border-white/20 group-hover:border-red-500/70 group-hover:shadow-[0_0_25px_rgba(248,113,113,0.55)] transition-all duration-300 rounded-lg" data-v-8b353967></div><p class="font-semibold text-base" data-v-8b353967>${ssrInterpolate(member.stage_name)}</p><p class="text-sm text-gray-400" data-v-8b353967>${ssrInterpolate(member.job_title)}</p></div>`);
      });
      _push(`<!--]--></div></div></section><section class="${ssrRenderClass([reviewsVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6", "py-24 px-6 bg-black transition-all duration-700 ease-out"])}" data-v-8b353967><div class="max-w-4xl mx-auto" data-v-8b353967><h2 class="text-3xl md:text-4xl font-bold mb-12 text-center" data-v-8b353967> Reviews </h2><div class="space-y-8" data-v-8b353967><!--[-->`);
      ssrRenderList(__props.reviews, (review) => {
        _push(`<div class="bg-linear-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-8 shadow-xl hover:shadow-[0_0_40px_rgba(0,0,0,0.7)] hover:-translate-y-1 transition-all duration-300" data-v-8b353967><div class="flex items-center justify-between mb-4" data-v-8b353967><p class="font-bold text-lg" data-v-8b353967>${ssrInterpolate(review.author_name)}</p><div class="text-yellow-400 text-lg tracking-widest drop-shadow" data-v-8b353967>${ssrInterpolate("★".repeat(review.rating))}</div></div><p class="text-gray-300 leading-relaxed" data-v-8b353967> &quot;${ssrInterpolate(review.content)}&quot; </p></div>`);
      });
      _push(`<!--]-->`);
      if (__props.reviews.length === 0) {
        _push(`<div class="text-center text-gray-500 text-sm py-8" data-v-8b353967> No reviews yet. Be the first to share your thoughts on the Details page. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section></div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Index.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-8b353967"]]);
const __vite_glob_0_38 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
const defaultPoster = "/movie_poster.jpg";
const defaultBackdrop = "/movie_poster_2.jpg";
const _sfc_main$7 = /* @__PURE__ */ Object.assign({ layout: _sfc_main$A }, {
  __name: "Information",
  __ssrInlineRender: true,
  props: {
    pageContent: Object,
    reviews: {
      type: Array,
      default: () => []
    },
    trailerUrl: {
      type: String,
      default: null
    },
    castCrew: {
      type: Array,
      default: () => []
    },
    sponsors: {
      type: Array,
      default: () => []
    },
    user: {
      type: Object,
      default: null
    }
  },
  setup(__props) {
    const props = __props;
    const movieMeta = {
      rating: "16+",
      runtime: "1h 45m",
      year: "2025"
    };
    const tabs = ["Overview", "Cast & Crew", "Reviews", "Production", "Sponsors"];
    const activeTab = ref("Overview");
    const castList = computed(() => {
      return props.castCrew || [];
    });
    const comments = ref([]);
    const newComment = ref({
      name: "",
      email: "",
      content: "",
      rating: 0
    });
    const submitting = ref(false);
    const premiereAt = /* @__PURE__ */ new Date("2025-12-10T06:00:00Z");
    const now = ref(/* @__PURE__ */ new Date());
    let countdownTimer = null;
    const countdown = computed(() => {
      const diff = premiereAt.getTime() - now.value.getTime();
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
      }
      const totalSeconds = Math.floor(diff / 1e3);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor(totalSeconds % 86400 / 3600);
      const minutes = Math.floor(totalSeconds % 3600 / 60);
      const seconds = totalSeconds % 60;
      return { days, hours, minutes, seconds, isPast: false };
    });
    const premiereLabel = computed(() => {
      return premiereAt.toUTCString().replace("GMT", "GMT");
    });
    const notifyState = ref({
      loading: false,
      success: "",
      error: "",
      showForm: false,
      email: ""
    });
    const user = computed(() => props.user);
    const showTrailerModal = ref(false);
    ref(null);
    const hlsInstance = ref(null);
    const destroyTrailerHls = () => {
      if (hlsInstance.value) {
        hlsInstance.value.destroy();
        hlsInstance.value = null;
      }
      window.removeEventListener("keydown", blockKeys);
    };
    function blockKeys(e2) {
      if (e2.key === "PrintScreen" || e2.ctrlKey && e2.shiftKey && ["I", "J", "C"].includes(e2.key) || e2.ctrlKey && ["U", "S"].includes(e2.key)) {
        e2.preventDefault();
        return false;
      }
    }
    computed(() => {
      return props.pageContent?.slug || "a-crazy-day-in-accra";
    });
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };
    onMounted(() => {
      if (props.reviews && props.reviews.length > 0) {
        comments.value = props.reviews;
      } else {
        comments.value = [];
      }
      countdownTimer = setInterval(() => {
        now.value = /* @__PURE__ */ new Date();
      }, 1e3);
    });
    onUnmounted(() => {
      if (countdownTimer) clearInterval(countdownTimer);
      destroyTrailerHls();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-black text-white" }, _attrs))} data-v-9feea3bc><section class="relative min-h-[70vh] flex items-end" style="${ssrRenderStyle({
        backgroundImage: `url(${__props.pageContent?.backdrop || defaultBackdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      })}" data-v-9feea3bc><div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" data-v-9feea3bc></div><div class="relative z-10 max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-10 w-full" data-v-9feea3bc><div class="hidden md:block" data-v-9feea3bc><div class="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/40" data-v-9feea3bc><img${ssrRenderAttr("src", __props.pageContent?.poster || defaultPoster)} alt="Movie poster" class="w-full h-full object-cover" data-v-9feea3bc></div></div><div class="md:col-span-2 space-y-6" data-v-9feea3bc><div class="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-red-400" data-v-9feea3bc><span data-v-9feea3bc>Promise Films Original</span><span class="text-xs bg-purple-600/80 px-2 py-1 rounded-full font-semibold" data-v-9feea3bc> Exclusive Premiere </span></div><h1 class="text-4xl md:text-5xl font-extrabold drop-shadow-xl" data-v-9feea3bc>${ssrInterpolate(__props.pageContent?.title || "A Crazy Day in Accra")}</h1><div class="flex flex-wrap gap-3 items-center text-sm text-gray-300" data-v-9feea3bc><span class="px-2 py-1 border border-white/60 rounded text-xs font-semibold" data-v-9feea3bc>${ssrInterpolate(movieMeta.rating)}</span><span data-v-9feea3bc>${ssrInterpolate(movieMeta.year)}</span><span data-v-9feea3bc>•</span><span data-v-9feea3bc>${ssrInterpolate(movieMeta.runtime)}</span><span data-v-9feea3bc>•</span><span data-v-9feea3bc>Thriller • Drama • Comedy</span><span class="text-yellow-400 font-semibold flex items-center gap-1" data-v-9feea3bc> ★ 8.7 <span class="text-xs text-gray-400" data-v-9feea3bc>pre-release</span></span></div><p class="text-gray-200 leading-relaxed max-w-2xl" data-v-9feea3bc> Jason arrives at a high-stakes pitch meeting in Accra and walks straight into a setup— framed for murder, hunted across the city, and forced to uncover a conspiracy before the day ends. </p><div class="space-y-3" data-v-9feea3bc><div class="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs md:text-sm text-gray-100" data-v-9feea3bc>`);
      if (!countdown.value.isPast) {
        _push(`<span class="flex items-center gap-2" data-v-9feea3bc> ⏳ <span class="font-semibold" data-v-9feea3bc>Premieres in</span><span data-v-9feea3bc>${ssrInterpolate(countdown.value.days)}d ${ssrInterpolate(countdown.value.hours)}h ${ssrInterpolate(countdown.value.minutes)}m ${ssrInterpolate(countdown.value.seconds)}s </span></span>`);
      } else {
        _push(`<span class="flex items-center gap-2 text-green-400" data-v-9feea3bc> ✅ <span class="font-semibold" data-v-9feea3bc>Now streaming exclusively on Promise Land Films</span></span>`);
      }
      _push(`<span class="hidden md:inline text-gray-300/80 ml-3" data-v-9feea3bc>${ssrInterpolate(premiereLabel.value)}</span></div><div class="flex flex-wrap items-center gap-3" data-v-9feea3bc>`);
      if (!countdown.value.isPast) {
        _push(`<button class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-full text-sm font-semibold"${ssrIncludeBooleanAttr(notifyState.value.loading) ? " disabled" : ""} data-v-9feea3bc><span data-v-9feea3bc>🔔</span><span data-v-9feea3bc>${ssrInterpolate(notifyState.value.success ? "Reminded" : notifyState.value.loading ? "Please wait..." : "Remind Me")}</span></button>`);
      } else {
        _push(`<button class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full text-sm font-semibold" data-v-9feea3bc> ▶ Watch Now </button>`);
      }
      if (__props.trailerUrl) {
        _push(`<button class="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 px-5 py-2.5 rounded-full text-sm" data-v-9feea3bc> 🎬 Watch Trailer </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (notifyState.value.showForm && !user.value && !countdown.value.isPast) {
        _push(`<div class="mt-2 flex flex-wrap items-center gap-3 text-xs md:text-sm" data-v-9feea3bc><input${ssrRenderAttr("value", notifyState.value.email)} type="email" placeholder="Enter your email for a launch reminder" class="w-full md:w-72 px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-600" data-v-9feea3bc><button class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"${ssrIncludeBooleanAttr(notifyState.value.loading) ? " disabled" : ""} data-v-9feea3bc> Save </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (notifyState.value.error) {
        _push(`<p class="text-xs text-red-400" data-v-9feea3bc>${ssrInterpolate(notifyState.value.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (notifyState.value.success) {
        _push(`<p class="text-xs text-green-400" data-v-9feea3bc>${ssrInterpolate(notifyState.value.success)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></section><div class="bg-zinc-950 sticky top-16 z-30 border-b border-white/10" data-v-9feea3bc><div class="max-w-7xl mx-auto px-6 flex gap-8 overflow-x-auto" data-v-9feea3bc><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([activeTab.value === tab ? "border-red-500 text-white" : "border-transparent text-gray-400 hover:text-white", "py-4 text-sm font-medium border-b-2 transition whitespace-nowrap"])}" data-v-9feea3bc>${ssrInterpolate(tab)}</button>`);
      });
      _push(`<!--]--></div></div><section class="max-w-7xl mx-auto px-6 py-10 space-y-12" data-v-9feea3bc>`);
      if (activeTab.value === "Overview") {
        _push(`<div class="space-y-8" data-v-9feea3bc><div class="grid md:grid-cols-3 gap-8" data-v-9feea3bc><div class="md:col-span-2 bg-zinc-900/80 p-6 rounded-xl border border-white/10" data-v-9feea3bc><h3 class="text-xl font-bold mb-3" data-v-9feea3bc>Storyline</h3><p class="text-gray-200 leading-relaxed" data-v-9feea3bc> Armed with a game-changing project, Jason arrives at an investor meeting only to walk into a trap. In minutes, he’s framed for murder and forced into a 24-hour race across Accra to clear his name, outrun hired killers, and expose a web of betrayal and corruption. </p></div><div class="space-y-3 text-sm" data-v-9feea3bc><div class="bg-zinc-900/80 p-4 rounded-xl border border-white/10" data-v-9feea3bc><p class="text-gray-400 text-xs uppercase tracking-wide mb-1" data-v-9feea3bc>Country of origin</p><p class="text-gray-100 font-semibold" data-v-9feea3bc>Ghana</p></div><div class="bg-zinc-900/80 p-4 rounded-xl border border-white/10" data-v-9feea3bc><p class="text-gray-400 text-xs uppercase tracking-wide mb-1" data-v-9feea3bc>Original language</p><p class="text-gray-100 font-semibold" data-v-9feea3bc>English • Twi</p></div><div class="bg-zinc-900/80 p-4 rounded-xl border border-white/10" data-v-9feea3bc><p class="text-gray-400 text-xs uppercase tracking-wide mb-1" data-v-9feea3bc>Production</p><p class="text-gray-100 font-semibold" data-v-9feea3bc>Promise Land Films</p></div></div></div><div class="grid md:grid-cols-2 gap-8" data-v-9feea3bc><div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10" data-v-9feea3bc><h4 class="text-lg font-semibold mb-3" data-v-9feea3bc>Themes</h4><ul class="space-y-2 text-gray-200 text-sm" data-v-9feea3bc><li data-v-9feea3bc>• Trust and betrayal in fast-moving relationships</li><li data-v-9feea3bc>• Corruption, justice, and power in modern Accra</li><li data-v-9feea3bc>• Survival under pressure in a city that never slows down</li><li data-v-9feea3bc>• Cultural identity vs. global opportunity</li></ul></div><div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10" data-v-9feea3bc><h4 class="text-lg font-semibold mb-3" data-v-9feea3bc>Cinematic Style</h4><ul class="space-y-2 text-gray-200 text-sm" data-v-9feea3bc><li data-v-9feea3bc>• High-energy handheld and drone shots through Accra</li><li data-v-9feea3bc>• Nighttime neon palettes and gritty street realism</li><li data-v-9feea3bc>• Fast-paced thriller editing with emotional pauses</li><li data-v-9feea3bc>• Ghanaian soundtrack influences layered over modern scoring</li></ul></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "Cast & Crew") {
        _push(`<div class="space-y-6" data-v-9feea3bc><h3 class="text-xl font-bold" data-v-9feea3bc>Cast &amp; Crew</h3><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" data-v-9feea3bc><!--[-->`);
        ssrRenderList(castList.value, (member) => {
          _push(`<div class="text-center group" data-v-9feea3bc><div class="aspect-[3/4] rounded-lg overflow-hidden border border-white/10 mb-3 group-hover:border-red-500/50 transition-colors" data-v-9feea3bc><img${ssrRenderAttr("src", member.image_url)}${ssrRenderAttr("alt", member.stage_name)} class="w-full h-full object-cover" data-v-9feea3bc></div><p class="font-semibold text-sm" data-v-9feea3bc>${ssrInterpolate(member.stage_name)}</p><p class="text-xs text-gray-400" data-v-9feea3bc>${ssrInterpolate(member.job_title)}</p></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "Reviews") {
        _push(`<div class="space-y-10" data-v-9feea3bc><div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10" data-v-9feea3bc><h3 class="text-xl font-bold mb-4" data-v-9feea3bc>Share your thoughts</h3><form class="space-y-4" data-v-9feea3bc><div class="grid md:grid-cols-2 gap-4" data-v-9feea3bc><input${ssrRenderAttr("value", newComment.value.name)} type="text" placeholder="Your name" class="input" required data-v-9feea3bc><input${ssrRenderAttr("value", newComment.value.email)} type="email" placeholder="Email (optional)" class="input" data-v-9feea3bc></div><textarea rows="4" class="input" placeholder="What did you think of the film?" required data-v-9feea3bc>${ssrInterpolate(newComment.value.content)}</textarea><div class="flex flex-wrap items-center gap-3" data-v-9feea3bc><div class="flex items-center gap-2" data-v-9feea3bc><span class="text-sm text-gray-200" data-v-9feea3bc>Rating:</span><!--[-->`);
        ssrRenderList(5, (star) => {
          _push(`<button type="button" class="${ssrRenderClass([star <= newComment.value.rating ? "text-yellow-400" : "text-gray-600", "text-lg focus:outline-none"])}" data-v-9feea3bc> ★ </button>`);
        });
        _push(`<!--]--></div><button type="submit" class="ml-auto bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-sm font-semibold"${ssrIncludeBooleanAttr(submitting.value) ? " disabled" : ""} data-v-9feea3bc>${ssrInterpolate(submitting.value ? "Posting..." : "Post Review")}</button></div></form></div><div class="space-y-6" data-v-9feea3bc><!--[-->`);
        ssrRenderList(comments.value, (comment) => {
          _push(`<div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10" data-v-9feea3bc><div class="flex items-center justify-between mb-2" data-v-9feea3bc><p class="font-semibold" data-v-9feea3bc>${ssrInterpolate(comment.name)}</p><div class="text-yellow-400 text-sm" data-v-9feea3bc>${ssrInterpolate("★".repeat(comment.rating))}</div></div><p class="text-gray-200 text-sm leading-relaxed" data-v-9feea3bc>${ssrInterpolate(comment.content)}</p><p class="text-xs text-gray-500 mt-2" data-v-9feea3bc>${ssrInterpolate(formatDate(comment.created_at))}</p></div>`);
        });
        _push(`<!--]-->`);
        if (comments.value.length === 0) {
          _push(`<div class="text-center text-gray-500 py-8 text-sm" data-v-9feea3bc> No reviews yet. Be the first to review this film after launch. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "Production") {
        _push(`<div class="grid md:grid-cols-2 gap-8" data-v-9feea3bc><div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10" data-v-9feea3bc><h4 class="text-lg font-semibold mb-3" data-v-9feea3bc>Production Company</h4><p class="text-gray-200" data-v-9feea3bc>Promise Land Films</p><p class="text-gray-400 text-sm mt-2" data-v-9feea3bc> An independent Ghanaian production company focused on bold stories and authentic African perspectives. </p></div><div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10" data-v-9feea3bc><h4 class="text-lg font-semibold mb-3" data-v-9feea3bc>Filming Locations</h4><p class="text-gray-200" data-v-9feea3bc>Accra, Ghana</p><p class="text-gray-400 text-sm mt-2" data-v-9feea3bc> Shot entirely on location in Accra, capturing the city’s energy, tension and everyday beauty. </p></div><div class="bg-zinc-900/80 p-6 rounded-xl border border-white/10" data-v-9feea3bc><h4 class="text-lg font-semibold mb-3" data-v-9feea3bc>Technical Specs</h4><ul class="text-gray-200 text-sm space-y-1" data-v-9feea3bc><li data-v-9feea3bc>• Aspect Ratio: 2.35:1 (Cinemascope)</li><li data-v-9feea3bc>• Resolution: 4K Digital</li><li data-v-9feea3bc>• Sound: Dolby Digital 5.1</li></ul></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "Sponsors") {
        _push(`<div class="space-y-6" data-v-9feea3bc><h3 class="text-xl font-bold" data-v-9feea3bc>Partners &amp; Sponsors</h3>`);
        if (props.sponsors && props.sponsors.length > 0) {
          _push(`<div data-v-9feea3bc><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6" data-v-9feea3bc><!--[-->`);
          ssrRenderList(props.sponsors, (sponsor, index) => {
            _push(`<a${ssrRenderAttr("href", sponsor.website_url || "#")} target="_blank" rel="noopener noreferrer" class="group relative flex items-center justify-center p-4 bg-zinc-900/80 rounded-lg border border-white/10 hover:border-red-500/50 aspect-video transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]" data-v-9feea3bc><img${ssrRenderAttr("src", sponsor.logo_url)}${ssrRenderAttr("alt", sponsor.name)} class="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" loading="lazy" data-v-9feea3bc></a>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<div class="text-center py-12 text-gray-400" data-v-9feea3bc><p data-v-9feea3bc>No sponsors information available.</p></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
      if (showTrailerModal.value) {
        _push(`<div class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" data-v-9feea3bc><div class="relative w-full max-w-5xl mx-auto aspect-video bg-black border border-white/10 rounded-xl overflow-hidden" data-v-9feea3bc><video class="w-full h-full object-contain" playsinline autoplay controls muted preload="auto" controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture data-v-9feea3bc></video><div class="absolute top-3 right-4 text-xs text-white/40 tracking-widest select-none" data-v-9feea3bc> PROMISE FILMS • TRAILER </div><button class="absolute top-3 left-3 text-white/70 hover:text-white" data-v-9feea3bc> ✕ Close </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Information.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const Information = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-9feea3bc"]]);
const __vite_glob_0_39 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Information
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$6 = {
  __name: "Payment",
  __ssrInlineRender: true,
  props: {
    user: Object,
    movie: Object,
    amount: { type: Number, default: 1500 }
  },
  setup(__props) {
    const props = __props;
    const loading = ref(true);
    const paymentChannel = ref("mobile_money");
    const couponCode = ref("");
    const discount = ref(0);
    const validatingCoupon = ref(false);
    const billingEmail = ref("");
    const showEmailPrompt = ref(!props.user);
    const processing = ref(false);
    const validationErrors = ref({});
    const finalAmount = computed(() => props.amount / 100 * (1 - discount.value / 100));
    const statusOverlay = ref({ visible: false, title: "", message: "" });
    onMounted(() => setTimeout(() => loading.value = false, 400));
    onUnmounted(() => {
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background text-foreground flex flex-col" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><h1 class="text-2xl font-bold">Complete Your Purchase</h1>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "text-sm text-muted-foreground hover:text-foreground transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Back Home `);
          } else {
            return [
              createTextVNode(" Back Home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
      if (loading.value) {
        _push(`<div class="flex-1 flex items-center justify-center"><div class="text-center"><div class="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div><p class="text-muted-foreground">Loading payment details...</p></div></div>`);
      } else {
        _push(`<div class="flex-1 flex items-center justify-center p-4 sm:p-6"><div class="w-full max-w-4xl"><div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"><div class="lg:col-span-2 space-y-6 lg:space-y-8">`);
        if (Object.keys(validationErrors.value).length > 0) {
          _push(`<div class="bg-red-50 border border-red-200 rounded-lg p-4"><h3 class="font-semibold text-red-900 mb-2">Please fix the following errors:</h3><ul class="space-y-1"><!--[-->`);
          ssrRenderList(validationErrors.value, (errors, field) => {
            _push(`<li class="text-sm text-red-700"><strong>${ssrInterpolate(field)}:</strong> ${ssrInterpolate(Array.isArray(errors) ? errors.join(", ") : errors)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-card border border-border rounded-lg p-4 sm:p-6"><h2 class="text-lg font-semibold text-foreground mb-4">Movie Details</h2><div class="flex flex-col sm:flex-row gap-4">`);
        if (__props.movie?.image_url) {
          _push(`<div class="shrink-0 w-24 h-32 mx-auto sm:mx-0"><img${ssrRenderAttr("src", __props.movie.image_url)}${ssrRenderAttr("alt", __props.movie.title)} class="w-full h-full object-cover rounded-lg"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex-1"><h3 class="text-xl font-bold text-foreground mb-2">${ssrInterpolate(__props.movie?.title || "A Crazy Day in Accra")}</h3><p class="text-muted-foreground mb-4">${ssrInterpolate(__props.movie?.description || "Unlimited streaming access to this film.")}</p><div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-muted-foreground">Access:</span><span class="font-medium">Unlimited Streaming</span></div><div class="flex justify-between"><span class="text-muted-foreground">Availability:</span><span class="font-medium">All Devices</span></div></div></div></div></div><div class="bg-card border border-border rounded-lg p-4 sm:p-6"><h2 class="text-lg font-semibold text-foreground mb-4">Payment Method</h2><div class="space-y-3"><label class="${ssrRenderClass([{ "border-primary bg-primary/5": paymentChannel.value === "mobile_money" }, "flex items-center p-3 sm:p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(paymentChannel.value, "mobile_money")) ? " checked" : ""} type="radio" value="mobile_money" class="h-4 w-4 text-primary cursor-pointer"><span class="ml-3 flex-1"><span class="font-medium block">Mobile Money (Recommended)</span><p class="text-sm text-muted-foreground">MTN, Vodafone, AirtelTigo – fast and reliable.</p></span></label><label class="${ssrRenderClass([{ "border-primary bg-primary/5": paymentChannel.value === "card" }, "flex items-center p-3 sm:p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(paymentChannel.value, "card")) ? " checked" : ""} type="radio" value="card" class="h-4 w-4 text-primary cursor-pointer"><span class="ml-3 flex-1"><span class="font-medium block">Card Payment</span><p class="text-sm text-muted-foreground">Visa &amp; Mastercard via Paystack.</p></span></label></div></div><div class="bg-card border border-border rounded-lg p-4 sm:p-6"><h2 class="text-lg font-semibold text-foreground mb-4">Promo Code</h2><div class="flex flex-col sm:flex-row gap-2"><input${ssrRenderAttr("value", couponCode.value)} type="text" placeholder="Enter promo/referral code (optional)" class="flex-1 px-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"><button${ssrIncludeBooleanAttr(validatingCoupon.value || !couponCode.value) ? " disabled" : ""} class="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50">${ssrInterpolate(validatingCoupon.value ? "Checking..." : "Apply")}</button></div>`);
        if (discount.value > 0) {
          _push(`<p class="text-sm text-green-600 mt-2">✓ Discount applied: ${ssrInterpolate(discount.value)}%</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (showEmailPrompt.value) {
          _push(`<div class="bg-card border border-border rounded-lg p-4 sm:p-6"><h2 class="text-lg font-semibold text-foreground mb-4">Billing Email (Optional)</h2><input${ssrRenderAttr("value", billingEmail.value)} type="email" placeholder="your@email.com (optional)" class="w-full px-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"><p class="text-sm text-muted-foreground mt-2">Leave empty to use your phone number as default email.</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="lg:col-span-1"><div class="bg-card border border-border rounded-lg p-4 sm:p-6 lg:sticky lg:top-6"><h2 class="text-lg font-semibold text-foreground mb-4">Order Summary</h2><div class="space-y-3 pb-4 border-b border-border"><div class="flex justify-between text-sm"><span class="text-muted-foreground">Subtotal</span><span class="font-medium">₵${ssrInterpolate((__props.amount / 100).toFixed(2))}</span></div>`);
        if (discount.value > 0) {
          _push(`<div class="flex justify-between text-sm text-green-600"><span>Discount (${ssrInterpolate(discount.value)}%)</span><span>-₵${ssrInterpolate((__props.amount * discount.value / 100 / 100).toFixed(2))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex justify-between text-lg font-bold pt-4 mb-6"><span>Total</span><span>₵${ssrInterpolate(finalAmount.value.toFixed(2))}</span></div><button${ssrIncludeBooleanAttr(processing.value) ? " disabled" : ""} class="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">${ssrInterpolate(processing.value ? "Processing..." : "Pay Securely with Paystack")}</button><p class="text-xs text-muted-foreground text-center mt-4">Secured by Paystack.</p></div></div></div></div></div>`);
      }
      if (statusOverlay.value.visible) {
        _push(`<div class="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6"><div class="max-w-md w-full bg-card border border-border rounded-2xl p-6 text-center"><div class="mb-4 flex justify-center"><div class="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div><h2 class="text-lg font-semibold mb-2">${ssrInterpolate(statusOverlay.value.title)}</h2><p class="text-sm text-muted-foreground">${ssrInterpolate(statusOverlay.value.message)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Payment.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __vite_glob_0_40 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$5 = /* @__PURE__ */ Object.assign({ layout: _sfc_main$A }, {
  __name: "Privacy",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><h1 class="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1><div class="prose prose-gray max-w-none space-y-8"><section><h2 class="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2><p class="text-muted-foreground"> Promise Land Films (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our Service. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2><p class="text-muted-foreground mb-4">We collect several types of information from and about users of our Service:</p><h3 class="text-xl font-semibold text-foreground mt-6 mb-3">Personal Information</h3><ul class="list-disc pl-6 space-y-2 text-muted-foreground"><li>Name and contact information (email address, phone number)</li><li>Account credentials (username and password)</li><li>Payment information (processed securely through Paystack)</li><li>Profile information you choose to provide</li></ul><h3 class="text-xl font-semibold text-foreground mt-6 mb-3">Usage Information</h3><ul class="list-disc pl-6 space-y-2 text-muted-foreground"><li>Viewing history and preferences</li><li>Interaction with the Service (pages visited, features used)</li><li>Device information (browser type, operating system)</li><li>IP address and location data</li><li>Referral code usage and tracking</li></ul></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2><p class="text-muted-foreground mb-4">We use the information we collect to:</p><ul class="list-disc pl-6 space-y-2 text-muted-foreground"><li>Provide, maintain, and improve our Service</li><li>Process your payments and manage subscriptions</li><li>Send you administrative information, including updates and security alerts</li><li>Respond to your inquiries and provide customer support</li><li>Analyze usage patterns to enhance user experience</li><li>Prevent fraud and ensure security</li><li>Track referral program participation and rewards</li><li>Send promotional communications (with your consent)</li><li>Comply with legal obligations</li></ul></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">4. Information Sharing and Disclosure</h2><p class="text-muted-foreground mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p><h3 class="text-xl font-semibold text-foreground mt-6 mb-3">Service Providers</h3><p class="text-muted-foreground mb-4"> We may share your information with third-party service providers who perform services on our behalf, including: </p><ul class="list-disc pl-6 space-y-2 text-muted-foreground"><li>Payment processing (Paystack)</li><li>SMS delivery (mNotify)</li><li>Email communications (Brevo)</li><li>Cloud hosting and data storage</li><li>Analytics and performance monitoring</li></ul><h3 class="text-xl font-semibold text-foreground mt-6 mb-3">Legal Requirements</h3><p class="text-muted-foreground mb-4"> We may disclose your information if required by law or in response to valid requests by public authorities. </p><h3 class="text-xl font-semibold text-foreground mt-6 mb-3">Business Transfers</h3><p class="text-muted-foreground"> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2><p class="text-muted-foreground mb-4"> We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include: </p><ul class="list-disc pl-6 space-y-2 text-muted-foreground"><li>Encryption of data in transit and at rest</li><li>Secure password storage using industry-standard hashing</li><li>Regular security audits and updates</li><li>Access controls and authentication requirements</li><li>Leaked password protection against known breached passwords</li></ul><p class="text-muted-foreground mt-4"> However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">6. Your Data Rights</h2><p class="text-muted-foreground mb-4">You have the following rights regarding your personal data:</p><ul class="list-disc pl-6 space-y-2 text-muted-foreground"><li><strong>Access:</strong> Request a copy of the personal data we hold about you</li><li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li><li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li><li><strong>Objection:</strong> Object to the processing of your personal data</li><li><strong>Portability:</strong> Request transfer of your data to another service</li><li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications at any time</li></ul><p class="text-muted-foreground mt-4"> To exercise these rights, please contact us at info@promiselandfilms.com. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking Technologies</h2><p class="text-muted-foreground"> We use cookies and similar tracking technologies to track activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">8. Children&#39;s Privacy</h2><p class="text-muted-foreground"> Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal data, please contact us so we can delete such information. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">9. Data Retention</h2><p class="text-muted-foreground"> We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">10. International Data Transfers</h2><p class="text-muted-foreground"> Your information may be transferred to and maintained on computers located outside of your jurisdiction where data protection laws may differ. By using our Service, you consent to the transfer of your information to Ghana and other countries where we operate. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">11. Changes to This Privacy Policy</h2><p class="text-muted-foreground"> We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Privacy Policy periodically for any changes. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">12. Contact Us</h2><p class="text-muted-foreground mb-4"> If you have any questions about this Privacy Policy or our data practices, please contact us: </p><p class="text-muted-foreground"> Email: info@promiselandfilms.com<br> Phone: +233 123 456 789 </p></section><p class="text-sm text-muted-foreground mt-8"> Last Updated: ${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))}</p></div></div><footer class="bg-gray-900 text-white py-12 mt-16"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-col md:flex-row justify-between items-center"><p class="text-gray-400 mb-4 md:mb-0">© 2025 A Crazy Day in Accra. All rights reserved.</p><div class="flex space-x-6">`);
      _push(ssrRenderComponent(_component_Link, {
        href: "/terms",
        class: "text-gray-400 hover:text-white transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Terms of Service`);
          } else {
            return [
              createTextVNode("Terms of Service")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Link, {
        href: "/privacy",
        class: "text-gray-400 hover:text-white transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Privacy Policy`);
          } else {
            return [
              createTextVNode("Privacy Policy")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></footer></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Privacy.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __vite_glob_0_41 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = /* @__PURE__ */ Object.assign({ layout: _sfc_main$A }, {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    user: Object
  },
  setup(__props) {
    const props = __props;
    const showDeleteModal = ref(false);
    const profileForm = useForm({
      name: props.user.name,
      email: props.user.email,
      phone_number: props.user.phone_number
    });
    const passwordForm = useForm({
      current_password: "",
      password: "",
      password_confirmation: ""
    });
    const deleteForm = useForm({
      password: ""
    });
    const updateProfile = () => {
      profileForm.put("/profile", {
        preserveScroll: true,
        onSuccess: () => {
          alert("Profile updated successfully!");
        }
      });
    };
    const updatePassword = () => {
      passwordForm.put("/profile/password", {
        preserveScroll: true,
        onSuccess: () => {
          passwordForm.reset();
          alert("Password updated successfully!");
        }
      });
    };
    const deleteAccount = () => {
      deleteForm.delete("/profile", {
        onSuccess: () => {
          showDeleteModal.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="mb-8 flex items-center justify-between"><div><h1 class="text-3xl font-bold text-foreground">Profile Settings</h1><p class="mt-2 text-muted-foreground">Manage your account settings and preferences</p></div><a href="/profile/payments" class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"> Payment History </a></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$v), { class: "mb-6" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$q), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$p), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Profile Information`);
                      } else {
                        return [
                          createTextVNode("Profile Information")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$s), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Update your account&#39;s profile information and email address.`);
                      } else {
                        return [
                          createTextVNode("Update your account's profile information and email address.")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$p), null, {
                      default: withCtx(() => [
                        createTextVNode("Profile Information")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$s), null, {
                      default: withCtx(() => [
                        createTextVNode("Update your account's profile information and email address.")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$t), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4"${_scopeId2}><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$x), { for: "name" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Name`);
                      } else {
                        return [
                          createTextVNode("Name")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$y), {
                    id: "name",
                    modelValue: unref(profileForm).name,
                    "onUpdate:modelValue": ($event) => unref(profileForm).name = $event,
                    class: { "border-red-500": unref(profileForm).errors.name },
                    required: ""
                  }, null, _parent3, _scopeId2));
                  if (unref(profileForm).errors.name) {
                    _push3(`<div class="text-sm text-red-600"${_scopeId2}>${ssrInterpolate(unref(profileForm).errors.name)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$x), { for: "email" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Email`);
                      } else {
                        return [
                          createTextVNode("Email")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$y), {
                    id: "email",
                    type: "email",
                    modelValue: unref(profileForm).email,
                    "onUpdate:modelValue": ($event) => unref(profileForm).email = $event,
                    class: { "border-red-500": unref(profileForm).errors.email },
                    required: ""
                  }, null, _parent3, _scopeId2));
                  if (unref(profileForm).errors.email) {
                    _push3(`<div class="text-sm text-red-600"${_scopeId2}>${ssrInterpolate(unref(profileForm).errors.email)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$x), { for: "phone" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Phone Number`);
                      } else {
                        return [
                          createTextVNode("Phone Number")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$y), {
                    id: "phone",
                    modelValue: unref(profileForm).phone_number,
                    "onUpdate:modelValue": ($event) => unref(profileForm).phone_number = $event,
                    class: { "border-red-500": unref(profileForm).errors.phone_number }
                  }, null, _parent3, _scopeId2));
                  if (unref(profileForm).errors.phone_number) {
                    _push3(`<div class="text-sm text-red-600"${_scopeId2}>${ssrInterpolate(unref(profileForm).errors.phone_number)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$z), {
                    type: "submit",
                    disabled: unref(profileForm).processing
                  }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(profileForm).processing ? "Saving..." : "Save Changes")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(profileForm).processing ? "Saving..." : "Save Changes"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form>`);
                } else {
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(updateProfile, ["prevent"]),
                      class: "space-y-4"
                    }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$x), { for: "name" }, {
                          default: withCtx(() => [
                            createTextVNode("Name")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$y), {
                          id: "name",
                          modelValue: unref(profileForm).name,
                          "onUpdate:modelValue": ($event) => unref(profileForm).name = $event,
                          class: { "border-red-500": unref(profileForm).errors.name },
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(profileForm).errors.name ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-600"
                        }, toDisplayString(unref(profileForm).errors.name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$x), { for: "email" }, {
                          default: withCtx(() => [
                            createTextVNode("Email")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$y), {
                          id: "email",
                          type: "email",
                          modelValue: unref(profileForm).email,
                          "onUpdate:modelValue": ($event) => unref(profileForm).email = $event,
                          class: { "border-red-500": unref(profileForm).errors.email },
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(profileForm).errors.email ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-600"
                        }, toDisplayString(unref(profileForm).errors.email), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$x), { for: "phone" }, {
                          default: withCtx(() => [
                            createTextVNode("Phone Number")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$y), {
                          id: "phone",
                          modelValue: unref(profileForm).phone_number,
                          "onUpdate:modelValue": ($event) => unref(profileForm).phone_number = $event,
                          class: { "border-red-500": unref(profileForm).errors.phone_number }
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(profileForm).errors.phone_number ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-600"
                        }, toDisplayString(unref(profileForm).errors.phone_number), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode(unref(_sfc_main$z), {
                        type: "submit",
                        disabled: unref(profileForm).processing
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(profileForm).processing ? "Saving..." : "Save Changes"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$q), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$p), null, {
                    default: withCtx(() => [
                      createTextVNode("Profile Information")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$s), null, {
                    default: withCtx(() => [
                      createTextVNode("Update your account's profile information and email address.")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$t), null, {
                default: withCtx(() => [
                  createVNode("form", {
                    onSubmit: withModifiers(updateProfile, ["prevent"]),
                    class: "space-y-4"
                  }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$x), { for: "name" }, {
                        default: withCtx(() => [
                          createTextVNode("Name")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$y), {
                        id: "name",
                        modelValue: unref(profileForm).name,
                        "onUpdate:modelValue": ($event) => unref(profileForm).name = $event,
                        class: { "border-red-500": unref(profileForm).errors.name },
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                      unref(profileForm).errors.name ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-red-600"
                      }, toDisplayString(unref(profileForm).errors.name), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$x), { for: "email" }, {
                        default: withCtx(() => [
                          createTextVNode("Email")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$y), {
                        id: "email",
                        type: "email",
                        modelValue: unref(profileForm).email,
                        "onUpdate:modelValue": ($event) => unref(profileForm).email = $event,
                        class: { "border-red-500": unref(profileForm).errors.email },
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                      unref(profileForm).errors.email ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-red-600"
                      }, toDisplayString(unref(profileForm).errors.email), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$x), { for: "phone" }, {
                        default: withCtx(() => [
                          createTextVNode("Phone Number")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$y), {
                        id: "phone",
                        modelValue: unref(profileForm).phone_number,
                        "onUpdate:modelValue": ($event) => unref(profileForm).phone_number = $event,
                        class: { "border-red-500": unref(profileForm).errors.phone_number }
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                      unref(profileForm).errors.phone_number ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-red-600"
                      }, toDisplayString(unref(profileForm).errors.phone_number), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode(unref(_sfc_main$z), {
                      type: "submit",
                      disabled: unref(profileForm).processing
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(profileForm).processing ? "Saving..." : "Save Changes"), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$v), { class: "mb-6" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$q), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$p), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Update Password`);
                      } else {
                        return [
                          createTextVNode("Update Password")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$s), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Ensure your account is using a long, random password to stay secure.`);
                      } else {
                        return [
                          createTextVNode("Ensure your account is using a long, random password to stay secure.")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$p), null, {
                      default: withCtx(() => [
                        createTextVNode("Update Password")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$s), null, {
                      default: withCtx(() => [
                        createTextVNode("Ensure your account is using a long, random password to stay secure.")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$t), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-4"${_scopeId2}><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$x), { for: "current_password" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Current Password`);
                      } else {
                        return [
                          createTextVNode("Current Password")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$y), {
                    id: "current_password",
                    type: "password",
                    modelValue: unref(passwordForm).current_password,
                    "onUpdate:modelValue": ($event) => unref(passwordForm).current_password = $event,
                    class: { "border-red-500": unref(passwordForm).errors.current_password },
                    required: ""
                  }, null, _parent3, _scopeId2));
                  if (unref(passwordForm).errors.current_password) {
                    _push3(`<div class="text-sm text-red-600"${_scopeId2}>${ssrInterpolate(unref(passwordForm).errors.current_password)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$x), { for: "password" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`New Password`);
                      } else {
                        return [
                          createTextVNode("New Password")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$y), {
                    id: "password",
                    type: "password",
                    modelValue: unref(passwordForm).password,
                    "onUpdate:modelValue": ($event) => unref(passwordForm).password = $event,
                    class: { "border-red-500": unref(passwordForm).errors.password },
                    required: ""
                  }, null, _parent3, _scopeId2));
                  if (unref(passwordForm).errors.password) {
                    _push3(`<div class="text-sm text-red-600"${_scopeId2}>${ssrInterpolate(unref(passwordForm).errors.password)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$x), { for: "password_confirmation" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Confirm Password`);
                      } else {
                        return [
                          createTextVNode("Confirm Password")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$y), {
                    id: "password_confirmation",
                    type: "password",
                    modelValue: unref(passwordForm).password_confirmation,
                    "onUpdate:modelValue": ($event) => unref(passwordForm).password_confirmation = $event,
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$z), {
                    type: "submit",
                    disabled: unref(passwordForm).processing
                  }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(passwordForm).processing ? "Updating..." : "Update Password")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(passwordForm).processing ? "Updating..." : "Update Password"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form>`);
                } else {
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(updatePassword, ["prevent"]),
                      class: "space-y-4"
                    }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$x), { for: "current_password" }, {
                          default: withCtx(() => [
                            createTextVNode("Current Password")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$y), {
                          id: "current_password",
                          type: "password",
                          modelValue: unref(passwordForm).current_password,
                          "onUpdate:modelValue": ($event) => unref(passwordForm).current_password = $event,
                          class: { "border-red-500": unref(passwordForm).errors.current_password },
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(passwordForm).errors.current_password ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-600"
                        }, toDisplayString(unref(passwordForm).errors.current_password), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$x), { for: "password" }, {
                          default: withCtx(() => [
                            createTextVNode("New Password")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$y), {
                          id: "password",
                          type: "password",
                          modelValue: unref(passwordForm).password,
                          "onUpdate:modelValue": ($event) => unref(passwordForm).password = $event,
                          class: { "border-red-500": unref(passwordForm).errors.password },
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(passwordForm).errors.password ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-600"
                        }, toDisplayString(unref(passwordForm).errors.password), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$x), { for: "password_confirmation" }, {
                          default: withCtx(() => [
                            createTextVNode("Confirm Password")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$y), {
                          id: "password_confirmation",
                          type: "password",
                          modelValue: unref(passwordForm).password_confirmation,
                          "onUpdate:modelValue": ($event) => unref(passwordForm).password_confirmation = $event,
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode(unref(_sfc_main$z), {
                        type: "submit",
                        disabled: unref(passwordForm).processing
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(passwordForm).processing ? "Updating..." : "Update Password"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$q), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$p), null, {
                    default: withCtx(() => [
                      createTextVNode("Update Password")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$s), null, {
                    default: withCtx(() => [
                      createTextVNode("Ensure your account is using a long, random password to stay secure.")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$t), null, {
                default: withCtx(() => [
                  createVNode("form", {
                    onSubmit: withModifiers(updatePassword, ["prevent"]),
                    class: "space-y-4"
                  }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$x), { for: "current_password" }, {
                        default: withCtx(() => [
                          createTextVNode("Current Password")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$y), {
                        id: "current_password",
                        type: "password",
                        modelValue: unref(passwordForm).current_password,
                        "onUpdate:modelValue": ($event) => unref(passwordForm).current_password = $event,
                        class: { "border-red-500": unref(passwordForm).errors.current_password },
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                      unref(passwordForm).errors.current_password ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-red-600"
                      }, toDisplayString(unref(passwordForm).errors.current_password), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$x), { for: "password" }, {
                        default: withCtx(() => [
                          createTextVNode("New Password")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$y), {
                        id: "password",
                        type: "password",
                        modelValue: unref(passwordForm).password,
                        "onUpdate:modelValue": ($event) => unref(passwordForm).password = $event,
                        class: { "border-red-500": unref(passwordForm).errors.password },
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                      unref(passwordForm).errors.password ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-red-600"
                      }, toDisplayString(unref(passwordForm).errors.password), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$x), { for: "password_confirmation" }, {
                        default: withCtx(() => [
                          createTextVNode("Confirm Password")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$y), {
                        id: "password_confirmation",
                        type: "password",
                        modelValue: unref(passwordForm).password_confirmation,
                        "onUpdate:modelValue": ($event) => unref(passwordForm).password_confirmation = $event,
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode(unref(_sfc_main$z), {
                      type: "submit",
                      disabled: unref(passwordForm).processing
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(passwordForm).processing ? "Updating..." : "Update Password"), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$v), { class: "border-red-600" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$q), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$p), { class: "text-red-600" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Delete Account`);
                      } else {
                        return [
                          createTextVNode("Delete Account")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$s), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Permanently delete your account and all associated data.`);
                      } else {
                        return [
                          createTextVNode("Permanently delete your account and all associated data.")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$p), { class: "text-red-600" }, {
                      default: withCtx(() => [
                        createTextVNode("Delete Account")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$s), null, {
                      default: withCtx(() => [
                        createTextVNode("Permanently delete your account and all associated data.")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$t), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="text-sm text-muted-foreground mb-4"${_scopeId2}> Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain. </p>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$z), {
                    variant: "destructive",
                    onClick: ($event) => showDeleteModal.value = true
                  }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Delete Account `);
                      } else {
                        return [
                          createTextVNode(" Delete Account ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("p", { class: "text-sm text-muted-foreground mb-4" }, " Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain. "),
                    createVNode(unref(_sfc_main$z), {
                      variant: "destructive",
                      onClick: ($event) => showDeleteModal.value = true
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Delete Account ")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$q), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$p), { class: "text-red-600" }, {
                    default: withCtx(() => [
                      createTextVNode("Delete Account")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$s), null, {
                    default: withCtx(() => [
                      createTextVNode("Permanently delete your account and all associated data.")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$t), null, {
                default: withCtx(() => [
                  createVNode("p", { class: "text-sm text-muted-foreground mb-4" }, " Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain. "),
                  createVNode(unref(_sfc_main$z), {
                    variant: "destructive",
                    onClick: ($event) => showDeleteModal.value = true
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Delete Account ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$j), {
        open: showDeleteModal.value,
        "onUpdate:open": ($event) => showDeleteModal.value = $event
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$g), null, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$d), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$b), null, {
                          default: withCtx((_5, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Are you sure you want to delete your account?`);
                            } else {
                              return [
                                createTextVNode("Are you sure you want to delete your account?")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$f), null, {
                          default: withCtx((_5, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` This action cannot be undone. This will permanently delete your account and remove your data from our servers. `);
                            } else {
                              return [
                                createTextVNode(" This action cannot be undone. This will permanently delete your account and remove your data from our servers. ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$b), null, {
                            default: withCtx(() => [
                              createTextVNode("Are you sure you want to delete your account?")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$f), null, {
                            default: withCtx(() => [
                              createTextVNode(" This action cannot be undone. This will permanently delete your account and remove your data from our servers. ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<form class="space-y-4"${_scopeId2}><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$x), { for: "delete_password" }, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Password`);
                      } else {
                        return [
                          createTextVNode("Password")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$y), {
                    id: "delete_password",
                    type: "password",
                    modelValue: unref(deleteForm).password,
                    "onUpdate:modelValue": ($event) => unref(deleteForm).password = $event,
                    placeholder: "Enter your password to confirm",
                    class: { "border-red-500": unref(deleteForm).errors.password },
                    required: ""
                  }, null, _parent3, _scopeId2));
                  if (unref(deleteForm).errors.password) {
                    _push3(`<div class="text-sm text-red-600"${_scopeId2}>${ssrInterpolate(unref(deleteForm).errors.password)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$e), null, {
                    default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$z), {
                          type: "button",
                          variant: "outline",
                          onClick: ($event) => showDeleteModal.value = false
                        }, {
                          default: withCtx((_5, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Cancel `);
                            } else {
                              return [
                                createTextVNode(" Cancel ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$z), {
                          type: "submit",
                          variant: "destructive",
                          disabled: unref(deleteForm).processing
                        }, {
                          default: withCtx((_5, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(deleteForm).processing ? "Deleting..." : "Delete Account")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(deleteForm).processing ? "Deleting..." : "Delete Account"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$z), {
                            type: "button",
                            variant: "outline",
                            onClick: ($event) => showDeleteModal.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Cancel ")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$z), {
                            type: "submit",
                            variant: "destructive",
                            disabled: unref(deleteForm).processing
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(deleteForm).processing ? "Deleting..." : "Delete Account"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$d), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$b), null, {
                          default: withCtx(() => [
                            createTextVNode("Are you sure you want to delete your account?")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$f), null, {
                          default: withCtx(() => [
                            createTextVNode(" This action cannot be undone. This will permanently delete your account and remove your data from our servers. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("form", {
                      onSubmit: withModifiers(deleteAccount, ["prevent"]),
                      class: "space-y-4"
                    }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$x), { for: "delete_password" }, {
                          default: withCtx(() => [
                            createTextVNode("Password")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$y), {
                          id: "delete_password",
                          type: "password",
                          modelValue: unref(deleteForm).password,
                          "onUpdate:modelValue": ($event) => unref(deleteForm).password = $event,
                          placeholder: "Enter your password to confirm",
                          class: { "border-red-500": unref(deleteForm).errors.password },
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                        unref(deleteForm).errors.password ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-600"
                        }, toDisplayString(unref(deleteForm).errors.password), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode(unref(_sfc_main$e), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$z), {
                            type: "button",
                            variant: "outline",
                            onClick: ($event) => showDeleteModal.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Cancel ")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$z), {
                            type: "submit",
                            variant: "destructive",
                            disabled: unref(deleteForm).processing
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(deleteForm).processing ? "Deleting..." : "Delete Account"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ]),
                        _: 1
                      })
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$g), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$d), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$b), null, {
                        default: withCtx(() => [
                          createTextVNode("Are you sure you want to delete your account?")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$f), null, {
                        default: withCtx(() => [
                          createTextVNode(" This action cannot be undone. This will permanently delete your account and remove your data from our servers. ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("form", {
                    onSubmit: withModifiers(deleteAccount, ["prevent"]),
                    class: "space-y-4"
                  }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$x), { for: "delete_password" }, {
                        default: withCtx(() => [
                          createTextVNode("Password")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$y), {
                        id: "delete_password",
                        type: "password",
                        modelValue: unref(deleteForm).password,
                        "onUpdate:modelValue": ($event) => unref(deleteForm).password = $event,
                        placeholder: "Enter your password to confirm",
                        class: { "border-red-500": unref(deleteForm).errors.password },
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                      unref(deleteForm).errors.password ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-red-600"
                      }, toDisplayString(unref(deleteForm).errors.password), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode(unref(_sfc_main$e), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$z), {
                          type: "button",
                          variant: "outline",
                          onClick: ($event) => showDeleteModal.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$z), {
                          type: "submit",
                          variant: "destructive",
                          disabled: unref(deleteForm).processing
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(deleteForm).processing ? "Deleting..." : "Delete Account"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ]),
                      _: 1
                    })
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Edit.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __vite_glob_0_42 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = {
  __name: "Payments",
  __ssrInlineRender: true,
  props: {
    payments: {
      type: Array,
      required: true
    },
    hasAccess: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const totalSpent = computed(() => {
      return (props.payments.filter((p2) => p2.status === "completed").reduce((sum, p2) => sum + p2.amount, 0) / 100).toFixed(2);
    });
    const successfulCount = computed(() => {
      return props.payments.filter((p2) => p2.status === "completed").length;
    });
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const getStatusClass = (status) => {
      const classes = {
        "completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        "pending": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        "failed": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        "cancelled": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
        "initialized": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      };
      return classes[status] || classes["initialized"];
    };
    const capitalizeStatus = (status) => {
      return status.charAt(0).toUpperCase() + status.slice(1);
    };
    const downloadReceipt = (payment) => {
      alert("Receipt download for payment #" + payment.reference);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$A, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-background py-12"${_scopeId}><div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"${_scopeId}><div class="mb-8"${_scopeId}><h1 class="text-3xl font-bold text-foreground mb-2"${_scopeId}>Payment History</h1><p class="text-muted-foreground"${_scopeId}>View your transaction history and download receipts</p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"${_scopeId}><div class="bg-card border border-border rounded-lg p-6 shadow"${_scopeId}><p class="text-sm text-muted-foreground mb-2"${_scopeId}>Total Spent</p><p class="text-3xl font-bold text-foreground"${_scopeId}>₵${ssrInterpolate(totalSpent.value)}</p></div><div class="bg-card border border-border rounded-lg p-6 shadow"${_scopeId}><p class="text-sm text-muted-foreground mb-2"${_scopeId}>Successful Payments</p><p class="text-3xl font-bold text-green-500"${_scopeId}>${ssrInterpolate(successfulCount.value)}</p></div><div class="bg-card border border-border rounded-lg p-6 shadow"${_scopeId}><p class="text-sm text-muted-foreground mb-2"${_scopeId}>Access Status</p><p class="${ssrRenderClass([__props.hasAccess ? "text-green-500" : "text-muted-foreground", "text-3xl font-bold"])}"${_scopeId}>${ssrInterpolate(__props.hasAccess ? "Active" : "Inactive")}</p></div></div><div class="bg-card border border-border rounded-lg shadow-lg overflow-hidden"${_scopeId}>`);
            if (__props.payments.length === 0) {
              _push2(`<div class="p-8 text-center text-muted-foreground"${_scopeId}><p${_scopeId}>No payment history yet.</p></div>`);
            } else {
              _push2(`<div class="overflow-x-auto"${_scopeId}><table class="w-full text-sm"${_scopeId}><thead class="bg-muted/50 border-b border-border"${_scopeId}><tr${_scopeId}><th class="px-6 py-4 text-left font-semibold"${_scopeId}>Date</th><th class="px-6 py-4 text-left font-semibold"${_scopeId}>Reference</th><th class="px-6 py-4 text-left font-semibold"${_scopeId}>Amount</th><th class="px-6 py-4 text-left font-semibold"${_scopeId}>Status</th><th class="px-6 py-4 text-right font-semibold"${_scopeId}>Action</th></tr></thead><tbody${_scopeId}><!--[-->`);
              ssrRenderList(__props.payments, (payment) => {
                _push2(`<tr class="border-b border-border hover:bg-muted/50 transition-colors"${_scopeId}><td class="px-6 py-4"${_scopeId}>${ssrInterpolate(formatDate(payment.created_at))}</td><td class="px-6 py-4 font-mono text-xs"${_scopeId}>${ssrInterpolate(payment.reference)}</td><td class="px-6 py-4 font-semibold"${_scopeId}>₵${ssrInterpolate((payment.amount / 100).toFixed(2))}</td><td class="px-6 py-4"${_scopeId}><span class="${ssrRenderClass([getStatusClass(payment.status), "px-3 py-1 rounded-full text-xs font-medium"])}"${_scopeId}>${ssrInterpolate(capitalizeStatus(payment.status))}</span></td><td class="px-6 py-4 text-right"${_scopeId}>`);
                if (payment.status === "completed") {
                  _push2(`<button class="text-primary hover:text-primary/80 text-sm font-medium transition-colors"${_scopeId}> Download Receipt </button>`);
                } else {
                  _push2(`<span class="text-muted-foreground text-sm"${_scopeId}>—</span>`);
                }
                _push2(`</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            }
            _push2(`</div><div class="mt-8"${_scopeId}><a href="/profile" class="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"${_scopeId}> ← Back to Profile </a></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-background py-12" }, [
                createVNode("div", { class: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" }, [
                  createVNode("div", { class: "mb-8" }, [
                    createVNode("h1", { class: "text-3xl font-bold text-foreground mb-2" }, "Payment History"),
                    createVNode("p", { class: "text-muted-foreground" }, "View your transaction history and download receipts")
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" }, [
                    createVNode("div", { class: "bg-card border border-border rounded-lg p-6 shadow" }, [
                      createVNode("p", { class: "text-sm text-muted-foreground mb-2" }, "Total Spent"),
                      createVNode("p", { class: "text-3xl font-bold text-foreground" }, "₵" + toDisplayString(totalSpent.value), 1)
                    ]),
                    createVNode("div", { class: "bg-card border border-border rounded-lg p-6 shadow" }, [
                      createVNode("p", { class: "text-sm text-muted-foreground mb-2" }, "Successful Payments"),
                      createVNode("p", { class: "text-3xl font-bold text-green-500" }, toDisplayString(successfulCount.value), 1)
                    ]),
                    createVNode("div", { class: "bg-card border border-border rounded-lg p-6 shadow" }, [
                      createVNode("p", { class: "text-sm text-muted-foreground mb-2" }, "Access Status"),
                      createVNode("p", {
                        class: ["text-3xl font-bold", __props.hasAccess ? "text-green-500" : "text-muted-foreground"]
                      }, toDisplayString(__props.hasAccess ? "Active" : "Inactive"), 3)
                    ])
                  ]),
                  createVNode("div", { class: "bg-card border border-border rounded-lg shadow-lg overflow-hidden" }, [
                    __props.payments.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "p-8 text-center text-muted-foreground"
                    }, [
                      createVNode("p", null, "No payment history yet.")
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "overflow-x-auto"
                    }, [
                      createVNode("table", { class: "w-full text-sm" }, [
                        createVNode("thead", { class: "bg-muted/50 border-b border-border" }, [
                          createVNode("tr", null, [
                            createVNode("th", { class: "px-6 py-4 text-left font-semibold" }, "Date"),
                            createVNode("th", { class: "px-6 py-4 text-left font-semibold" }, "Reference"),
                            createVNode("th", { class: "px-6 py-4 text-left font-semibold" }, "Amount"),
                            createVNode("th", { class: "px-6 py-4 text-left font-semibold" }, "Status"),
                            createVNode("th", { class: "px-6 py-4 text-right font-semibold" }, "Action")
                          ])
                        ]),
                        createVNode("tbody", null, [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.payments, (payment) => {
                            return openBlock(), createBlock("tr", {
                              key: payment.id,
                              class: "border-b border-border hover:bg-muted/50 transition-colors"
                            }, [
                              createVNode("td", { class: "px-6 py-4" }, toDisplayString(formatDate(payment.created_at)), 1),
                              createVNode("td", { class: "px-6 py-4 font-mono text-xs" }, toDisplayString(payment.reference), 1),
                              createVNode("td", { class: "px-6 py-4 font-semibold" }, "₵" + toDisplayString((payment.amount / 100).toFixed(2)), 1),
                              createVNode("td", { class: "px-6 py-4" }, [
                                createVNode("span", {
                                  class: [getStatusClass(payment.status), "px-3 py-1 rounded-full text-xs font-medium"]
                                }, toDisplayString(capitalizeStatus(payment.status)), 3)
                              ]),
                              createVNode("td", { class: "px-6 py-4 text-right" }, [
                                payment.status === "completed" ? (openBlock(), createBlock("button", {
                                  key: 0,
                                  onClick: ($event) => downloadReceipt(payment),
                                  class: "text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                                }, " Download Receipt ", 8, ["onClick"])) : (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: "text-muted-foreground text-sm"
                                }, "—"))
                              ])
                            ]);
                          }), 128))
                        ])
                      ])
                    ]))
                  ]),
                  createVNode("div", { class: "mt-8" }, [
                    createVNode("a", {
                      href: "/profile",
                      class: "inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                    }, " ← Back to Profile ")
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Payments.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __vite_glob_0_43 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2 = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: {
    user: {
      type: Object,
      default: () => ({
        name: "",
        email: "",
        phone_number: "",
        created_at: /* @__PURE__ */ new Date()
      })
    },
    featured: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const formatDate = (date) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="bg-card border-b border-border shadow-sm"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><div><h1 class="text-2xl font-bold text-foreground">Welcome, ${ssrInterpolate(__props.user.name)}!</h1><p class="text-muted-foreground">Your streaming dashboard</p></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "text-sm text-muted-foreground hover:text-foreground transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Back to Home `);
          } else {
            return [
              createTextVNode(" Back to Home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"><div class="bg-card border border-border rounded-lg p-6 shadow-sm"><p class="text-sm text-muted-foreground mb-2">Account Status</p><p class="text-2xl font-bold text-foreground">${ssrInterpolate(__props.user.email)}</p><p class="text-xs text-muted-foreground mt-2">Member since ${ssrInterpolate(formatDate(__props.user.created_at))}</p></div><div class="bg-card border border-border rounded-lg p-6 shadow-sm"><p class="text-sm text-muted-foreground mb-2">Phone</p><p class="text-2xl font-bold text-foreground">${ssrInterpolate(__props.user.phone_number || "Not provided")}</p>`);
      if (__props.user.phone_number) {
        _push(`<p class="text-xs text-green-600 mt-2">✓ Verified</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-card border border-border rounded-lg p-6 shadow-sm"><p class="text-sm text-muted-foreground mb-2">Access Level</p><p class="text-2xl font-bold text-green-600">Active</p><p class="text-xs text-muted-foreground mt-2">Full streaming access</p></div></div><div class="mb-12"><div class="flex justify-between items-center mb-6"><div><h2 class="text-2xl font-bold text-foreground mb-1">Featured Content</h2><p class="text-sm text-muted-foreground">Start watching or continue from where you left off</p></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "text-sm text-primary hover:text-primary/80 transition-colors font-medium"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All `);
          } else {
            return [
              createTextVNode(" View All ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (__props.featured.length > 0) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(__props.featured, (item) => {
          _push(`<div class="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"><div class="aspect-video bg-muted relative overflow-hidden group">`);
          if (item.image_url) {
            _push(`<img${ssrRenderAttr("src", item.image_url)}${ssrRenderAttr("alt", item.title)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"><button class="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg> Watch Now </button></div></div><div class="p-4"><h3 class="font-semibold text-foreground mb-1">${ssrInterpolate(item.title)}</h3><p class="text-sm text-muted-foreground line-clamp-2">${ssrInterpolate(item.description)}</p></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-12"><p class="text-muted-foreground">No content available yet.</p></div>`);
      }
      _push(`</div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-card border border-border rounded-lg p-6 shadow-sm"><h3 class="text-lg font-semibold text-foreground mb-4">Watch Movie</h3><div class="space-y-3">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/watch",
        class: "block p-4 border border-primary rounded-lg hover:bg-primary/10 transition-colors bg-primary/5"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="font-semibold text-primary flex items-center gap-2"${_scopeId}><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"${_scopeId}><path d="M8 5v14l11-7z"${_scopeId}></path></svg> Watch Full Movie </p><p class="text-sm text-muted-foreground mt-1"${_scopeId}>Stream &#39;A Crazy Day in Accra&#39; now</p>`);
          } else {
            return [
              createVNode("p", { class: "font-semibold text-primary flex items-center gap-2" }, [
                (openBlock(), createBlock("svg", {
                  class: "h-5 w-5",
                  fill: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", { d: "M8 5v14l11-7z" })
                ])),
                createTextVNode(" Watch Full Movie ")
              ]),
              createVNode("p", { class: "text-sm text-muted-foreground mt-1" }, "Stream 'A Crazy Day in Accra' now")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="bg-card border border-border rounded-lg p-6 shadow-sm"><h3 class="text-lg font-semibold text-foreground mb-4">Account Settings</h3><div class="space-y-3">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/profile",
        class: "block p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="font-medium text-foreground"${_scopeId}>Edit Profile</p><p class="text-sm text-muted-foreground"${_scopeId}>Update your personal information</p>`);
          } else {
            return [
              createVNode("p", { class: "font-medium text-foreground" }, "Edit Profile"),
              createVNode("p", { class: "text-sm text-muted-foreground" }, "Update your personal information")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/profile/payments",
        class: "block p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="font-medium text-foreground"${_scopeId}>Payment History</p><p class="text-sm text-muted-foreground"${_scopeId}>View your transactions</p>`);
          } else {
            return [
              createVNode("p", { class: "font-medium text-foreground" }, "Payment History"),
              createVNode("p", { class: "text-sm text-muted-foreground" }, "View your transactions")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Streamer/Dashboard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __vite_glob_0_44 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = /* @__PURE__ */ Object.assign({ layout: _sfc_main$A }, {
  __name: "Terms",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><h1 class="text-4xl font-bold text-foreground mb-8">Terms of Service</h1><div class="prose prose-gray max-w-none space-y-8"><section><h2 class="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2><p class="text-muted-foreground"> By accessing and using Promise Land Films (&quot;the Service&quot;), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">2. Use License</h2><p class="text-muted-foreground mb-4"> Permission is granted to temporarily stream one copy of the materials (film content) on Promise Land Films for personal, non-commercial viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: </p><ul class="list-disc pl-6 space-y-2 text-muted-foreground"><li>Modify or copy the materials</li><li>Use the materials for any commercial purpose or public display</li><li>Remove any copyright or proprietary notations from the materials</li><li>Transfer the materials to another person or mirror the content on any other server</li><li>Record, download, or redistribute the content</li></ul></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">3. Account Responsibilities</h2><p class="text-muted-foreground mb-4"> When you create an account with us, you must provide accurate and complete information. You are responsible for: </p><ul class="list-disc pl-6 space-y-2 text-muted-foreground"><li>Maintaining the confidentiality of your account credentials</li><li>All activities that occur under your account</li><li>Notifying us immediately of any unauthorized use of your account</li><li>Ensuring you have the legal capacity to enter into this agreement</li></ul></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">4. Payment and Subscription</h2><p class="text-muted-foreground mb-4"> Access to film content requires payment as specified on our platform. By providing payment information, you: </p><ul class="list-disc pl-6 space-y-2 text-muted-foreground"><li>Authorize us to charge your payment method for the subscription fee</li><li>Agree that subscriptions are valid for the specified duration</li><li>Understand that access expires at the end of the subscription period</li><li>Acknowledge that prices are subject to change with notice</li></ul></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">5. Content Restrictions</h2><p class="text-muted-foreground mb-4"> You may not use the Service to: </p><ul class="list-disc pl-6 space-y-2 text-muted-foreground"><li>Violate any local, state, national, or international law</li><li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li><li>Share account credentials with others</li><li>Attempt to bypass any access restrictions or security measures</li><li>Use automated systems to access the Service</li></ul></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">6. Intellectual Property</h2><p class="text-muted-foreground"> All content on Promise Land Films, including but not limited to films, images, text, graphics, logos, and software, is the property of Promise Land Films or its content suppliers and is protected by international copyright laws. Unauthorized use may result in legal action. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">7. Disclaimer</h2><p class="text-muted-foreground"> The materials on Promise Land Films are provided on an &#39;as is&#39; basis. Promise Land Films makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">8. Limitations</h2><p class="text-muted-foreground"> In no event shall Promise Land Films or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Service. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">9. Termination</h2><p class="text-muted-foreground"> We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms. Upon termination, your right to use the Service will cease immediately. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">10. Governing Law</h2><p class="text-muted-foreground"> These terms shall be governed by and construed in accordance with the laws of Ghana, without regard to its conflict of law provisions. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">11. Changes to Terms</h2><p class="text-muted-foreground"> We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. </p></section><section><h2 class="text-2xl font-semibold text-foreground mb-4">12. Contact Information</h2><p class="text-muted-foreground mb-4"> If you have any questions about these Terms, please contact us at: </p><p class="text-muted-foreground"> Email: info@promiselandfilms.com<br> Phone: +233 123 456 789 </p></section><p class="text-sm text-muted-foreground mt-8"> Last Updated: ${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))}</p></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Terms.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __vite_glob_0_45 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = /* @__PURE__ */ Object.assign({ layout: null }, {
  __name: "Watch",
  __ssrInlineRender: true,
  props: {
    fallbackVideoUrl: { type: String, required: true },
    videoTitle: { type: String, default: "A Crazy Day in Accra" },
    pageContent: { type: Object, default: null },
    user: { type: Object, default: null },
    subscription: { type: Object, default: null }
  },
  setup(__props) {
    const page = usePage();
    const csrfToken = computed(() => page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content || "");
    const props = __props;
    const playerContainer = ref(null);
    const player = ref(null);
    ref(null);
    const isLoading = ref(true);
    const isPlaying = ref(false);
    const isBuffering = ref(false);
    const isMuted = ref(false);
    const isFullscreen = ref(false);
    const currentTime = ref(0);
    const duration = ref(0);
    const buffered = ref(0);
    const volume = ref(1);
    const videoQuality = ref("HD");
    const errorMessage = ref("");
    const resumeTime = ref(0);
    const controlsVisible = ref(true);
    const showCenterPlay = ref(true);
    const hoverTime = ref(null);
    const hoverPercent = ref(0);
    const skipIndicator = ref(null);
    let controlsTimeout = null;
    let hls = null;
    let progressInterval = null;
    const progressPercent = computed(() => duration.value > 0 ? currentTime.value / duration.value * 100 : 0);
    const bufferedPercent = computed(() => duration.value > 0 ? buffered.value / duration.value * 100 : 0);
    const showMovieInfo = computed(() => controlsVisible.value && !isPlaying.value);
    const formattedDuration = computed(() => {
      const mins = Math.floor(duration.value / 60);
      if (mins === 0) return "--";
      return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
    });
    function formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return "0:00";
      const h2 = Math.floor(seconds / 3600);
      const m2 = Math.floor(seconds % 3600 / 60);
      const s2 = Math.floor(seconds % 60);
      if (h2 > 0) return `${h2}:${m2.toString().padStart(2, "0")}:${s2.toString().padStart(2, "0")}`;
      return `${m2}:${s2.toString().padStart(2, "0")}`;
    }
    function showControls() {
      controlsVisible.value = true;
      clearTimeout(controlsTimeout);
      if (isPlaying.value) {
        controlsTimeout = setTimeout(() => {
          if (isPlaying.value && true) {
            controlsVisible.value = false;
          }
        }, 3e3);
      }
    }
    function togglePlayPause() {
      if (!player.value || isLoading.value) return;
      if (player.value.paused) {
        player.value.play().catch(console.error);
      } else {
        player.value.pause();
      }
    }
    function skip(seconds) {
      if (!player.value) return;
      const newTime = Math.max(0, Math.min(duration.value, player.value.currentTime + seconds));
      player.value.currentTime = newTime;
      skipIndicator.value = seconds < 0 ? "back" : "forward";
      setTimeout(() => skipIndicator.value = null, 600);
      showControls();
    }
    function toggleMute() {
      if (!player.value) return;
      player.value.muted = !player.value.muted;
      isMuted.value = player.value.muted;
    }
    function toggleFullscreen() {
      if (!playerContainer.value) return;
      if (!document.fullscreenElement) {
        playerContainer.value.requestFullscreen?.() || playerContainer.value.webkitRequestFullscreen?.();
      } else {
        document.exitFullscreen?.() || document.webkitExitFullscreen?.();
      }
    }
    function extractVideoId() {
      try {
        const url = new URL(props.fallbackVideoUrl);
        const parts = url.pathname.split("/");
        return parts[1] || "movie-default";
      } catch {
        return "movie-default";
      }
    }
    async function saveProgress(completed = false) {
      if (!player.value || !props.user) return;
      const time = Math.floor(player.value.currentTime);
      const dur = Math.floor(player.value.duration) || 0;
      if (time <= 5) return;
      try {
        const videoId = extractVideoId();
        await fetch(`/api/watch-progress/${videoId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRF-TOKEN": csrfToken.value
          },
          body: JSON.stringify({
            current_time: completed ? 0 : time,
            total_duration: dur,
            video_title: props.videoTitle
          })
        });
      } catch (err) {
        console.error("Failed to save progress:", err);
      }
    }
    async function loadProgress() {
      if (!props.user) return 0;
      try {
        const videoId = extractVideoId();
        const response = await fetch(`/api/watch-progress/${videoId}`, {
          headers: { "Accept": "application/json" }
        });
        if (!response.ok) return 0;
        const data = await response.json();
        return data.current_time || 0;
      } catch {
        return 0;
      }
    }
    function handleKeydown(e2) {
      if (!player.value) return;
      const actions = {
        " ": () => togglePlayPause(),
        "k": () => togglePlayPause(),
        "ArrowLeft": () => skip(-10),
        "j": () => skip(-10),
        "ArrowRight": () => skip(10),
        "l": () => skip(10),
        "ArrowUp": () => {
          player.value.volume = Math.min(1, player.value.volume + 0.1);
        },
        "ArrowDown": () => {
          player.value.volume = Math.max(0, player.value.volume - 0.1);
        },
        "m": () => toggleMute(),
        "f": () => toggleFullscreen(),
        "Escape": () => {
          if (isFullscreen.value) toggleFullscreen();
        }
      };
      if (actions[e2.key]) {
        e2.preventDefault();
        actions[e2.key]();
        showControls();
      }
    }
    async function initializePlayer() {
      const video = player.value;
      if (!video || !props.fallbackVideoUrl) {
        errorMessage.value = "Video source not available";
        isLoading.value = false;
        return;
      }
      resumeTime.value = await loadProgress();
      if (Hls.isSupported()) {
        hls = new Hls({
          autoStartLoad: true,
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          startLevel: -1
        });
        hls.loadSource(props.fallbackVideoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          isLoading.value = false;
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            isLoading.value = false;
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                errorMessage.value = "Network error. Please check your connection.";
                setTimeout(() => hls?.startLoad(), 3e3);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                errorMessage.value = "Playback error. Please refresh the page.";
                break;
            }
          }
        });
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          const level = hls.levels[data.level];
          if (level) {
            videoQuality.value = level.height >= 1080 ? "4K" : level.height >= 720 ? "HD" : "SD";
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = props.fallbackVideoUrl;
        video.addEventListener("canplay", () => {
          isLoading.value = false;
        });
      } else {
        errorMessage.value = "Your browser does not support video playback.";
        isLoading.value = false;
      }
    }
    onMounted(() => {
      initializePlayer();
      progressInterval = setInterval(() => {
        if (isPlaying.value && true) saveProgress();
      }, 1e4);
      window.addEventListener("keydown", handleKeydown);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") saveProgress();
      });
      window.addEventListener("beforeunload", () => saveProgress());
      document.addEventListener("fullscreenchange", () => {
        isFullscreen.value = !!document.fullscreenElement;
      });
    });
    onUnmounted(() => {
      if (hls) hls.destroy();
      if (progressInterval) clearInterval(progressInterval);
      if (controlsTimeout) clearTimeout(controlsTimeout);
      window.removeEventListener("keydown", handleKeydown);
      saveProgress();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "playerContainer",
        ref: playerContainer,
        class: ["relative w-full h-screen bg-black overflow-hidden", { "cursor-none": !controlsVisible.value && isPlaying.value }]
      }, _attrs))} data-v-ac1f9c5b><video class="w-full h-full object-contain" playsinline preload="auto" data-v-ac1f9c5b></video><div class="absolute inset-0 pointer-events-none" data-v-ac1f9c5b><div class="${ssrRenderClass([controlsVisible.value ? "opacity-100" : "opacity-0", "absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500"])}" data-v-ac1f9c5b></div><div class="${ssrRenderClass([controlsVisible.value ? "opacity-100" : "opacity-0", "absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-500"])}" data-v-ac1f9c5b></div></div><div class="${ssrRenderClass([controlsVisible.value ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none", "absolute top-0 left-0 right-0 px-4 md:px-8 py-4 flex items-center justify-between z-40 transition-all duration-500"])}" data-v-ac1f9c5b><button class="flex items-center gap-3 text-white hover:text-gray-300 transition-colors group" data-v-ac1f9c5b><svg class="w-8 h-8 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" data-v-ac1f9c5b></path></svg><span class="hidden md:inline font-medium" data-v-ac1f9c5b>Back to Browse</span></button><div class="text-xs text-white/20 tracking-[0.2em] select-none font-light" data-v-ac1f9c5b> PROMISE LAND FILMS </div></div><div class="${ssrRenderClass([showMovieInfo.value ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12 pointer-events-none", "absolute bottom-36 md:bottom-40 left-4 md:left-8 z-30 max-w-md md:max-w-lg transition-all duration-700 ease-out"])}" data-v-ac1f9c5b><h1 class="text-2xl md:text-4xl font-bold mb-2 md:mb-3 drop-shadow-2xl leading-tight" data-v-ac1f9c5b>${ssrInterpolate(__props.videoTitle)}</h1><div class="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-300 mb-2 md:mb-3" data-v-ac1f9c5b><span class="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded" data-v-ac1f9c5b>18+</span><span class="text-white/80" data-v-ac1f9c5b>${ssrInterpolate(formattedDuration.value)}</span><span class="hidden md:inline text-white/50" data-v-ac1f9c5b>•</span><span class="hidden md:inline text-white/80" data-v-ac1f9c5b>2024</span><span class="text-green-500 font-semibold" data-v-ac1f9c5b>${ssrInterpolate(videoQuality.value)}</span></div><p class="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3" data-v-ac1f9c5b>${ssrInterpolate(__props.pageContent?.description || "One wild day. One city. Infinite chaos. A fast-paced Accra adventure like never before.")}</p></div><div class="${ssrRenderClass([controlsVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none", "absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-4 md:pb-6 z-40 transition-all duration-500"])}" data-v-ac1f9c5b><div class="mb-3 md:mb-4 group" data-v-ac1f9c5b><div class="relative h-1 group-hover:h-2 bg-white/20 rounded-full cursor-pointer transition-all duration-200" data-v-ac1f9c5b><div class="absolute h-full bg-white/30 rounded-full transition-all" style="${ssrRenderStyle({ width: bufferedPercent.value + "%" })}" data-v-ac1f9c5b></div><div class="absolute h-full bg-red-600 rounded-full" style="${ssrRenderStyle({ width: progressPercent.value + "%" })}" data-v-ac1f9c5b></div><div class="absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-red-600 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200" style="${ssrRenderStyle({ left: `calc(${progressPercent.value}% - 6px)` })}" data-v-ac1f9c5b></div>`);
      if (hoverTime.value !== null) {
        _push(`<div class="absolute -top-10 px-2 py-1 bg-black/95 text-white text-xs rounded-md transform -translate-x-1/2 shadow-lg" style="${ssrRenderStyle({ left: hoverPercent.value + "%" })}" data-v-ac1f9c5b>${ssrInterpolate(formatTime(hoverTime.value))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex items-center justify-between" data-v-ac1f9c5b><div class="flex items-center gap-2 md:gap-5" data-v-ac1f9c5b><button class="text-white hover:text-white/80 transition-all hover:scale-110 active:scale-95" data-v-ac1f9c5b>`);
      if (isPlaying.value) {
        _push(`<svg class="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" data-v-ac1f9c5b></path></svg>`);
      } else {
        _push(`<svg class="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path d="M8 5v14l11-7z" data-v-ac1f9c5b></path></svg>`);
      }
      _push(`</button><button class="text-white hover:text-white/80 transition-all hover:scale-110 active:scale-95 relative" data-v-ac1f9c5b><svg class="w-7 h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" data-v-ac1f9c5b><path d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4z" data-v-ac1f9c5b></path><path d="M5.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0012 16V8a1 1 0 00-1.6-.8l-5.334 4z" data-v-ac1f9c5b></path></svg><span class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold" data-v-ac1f9c5b>10</span></button><button class="text-white hover:text-white/80 transition-all hover:scale-110 active:scale-95 relative" data-v-ac1f9c5b><svg class="w-7 h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" data-v-ac1f9c5b><path d="M11.934 12.8a1 1 0 010-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4z" data-v-ac1f9c5b></path><path d="M18.934 12.8a1 1 0 010-1.6l-5.334-4A1 1 0 0012 8v8a1 1 0 001.6.8l5.334-4z" data-v-ac1f9c5b></path></svg><span class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold" data-v-ac1f9c5b>10</span></button><div class="hidden md:flex items-center gap-2 group/vol" data-v-ac1f9c5b><button class="text-white hover:text-white/80 transition-all" data-v-ac1f9c5b>`);
      if (isMuted.value || volume.value === 0) {
        _push(`<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" data-v-ac1f9c5b></path></svg>`);
      } else if (volume.value < 0.5) {
        _push(`<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" data-v-ac1f9c5b></path></svg>`);
      } else {
        _push(`<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" data-v-ac1f9c5b></path></svg>`);
      }
      _push(`</button><div class="w-0 group-hover/vol:w-24 overflow-hidden transition-all duration-300" data-v-ac1f9c5b><input type="range" min="0" max="1" step="0.05"${ssrRenderAttr("value", volume.value)} class="w-full h-1 appearance-none bg-white/30 rounded-full cursor-pointer accent-red-600" data-v-ac1f9c5b></div></div><div class="text-white text-xs md:text-sm font-medium tabular-nums ml-1 md:ml-0" data-v-ac1f9c5b><span class="text-white" data-v-ac1f9c5b>${ssrInterpolate(formatTime(currentTime.value))}</span><span class="text-white/50 mx-1" data-v-ac1f9c5b>/</span><span class="text-white/70" data-v-ac1f9c5b>${ssrInterpolate(formatTime(duration.value))}</span></div></div><div class="flex items-center gap-3 md:gap-4" data-v-ac1f9c5b><div class="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs font-semibold text-white/90" data-v-ac1f9c5b>${ssrInterpolate(videoQuality.value)}</div><button class="text-white hover:text-white/80 transition-all hover:scale-110 active:scale-95" data-v-ac1f9c5b>`);
      if (!isFullscreen.value) {
        _push(`<svg class="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" data-v-ac1f9c5b></path></svg>`);
      } else {
        _push(`<svg class="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" data-v-ac1f9c5b></path></svg>`);
      }
      _push(`</button></div></div></div>`);
      if (showCenterPlay.value && !isLoading.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center z-30" data-v-ac1f9c5b><button class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95 group" data-v-ac1f9c5b><svg class="w-10 h-10 md:w-12 md:h-12 text-white ml-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path d="M8 5v14l11-7z" data-v-ac1f9c5b></path></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isBuffering.value && !isLoading.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center z-30 pointer-events-none" data-v-ac1f9c5b><div class="w-14 h-14 md:w-16 md:h-16 border-4 border-white/10 border-t-red-600 rounded-full animate-spin" data-v-ac1f9c5b></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isLoading.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center bg-black z-50" data-v-ac1f9c5b><div class="text-center" data-v-ac1f9c5b><div class="w-14 h-14 md:w-16 md:h-16 border-4 border-white/10 border-t-red-600 rounded-full animate-spin mx-auto mb-4" data-v-ac1f9c5b></div><p class="text-white text-base md:text-lg font-medium" data-v-ac1f9c5b>Loading...</p>`);
        if (resumeTime.value > 0) {
          _push(`<p class="text-gray-500 text-sm mt-2" data-v-ac1f9c5b> Resuming from ${ssrInterpolate(formatTime(resumeTime.value))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (errorMessage.value) {
        _push(`<div class="absolute inset-0 flex items-center justify-center bg-black/95 z-50" data-v-ac1f9c5b><div class="text-center max-w-md px-6" data-v-ac1f9c5b><svg class="w-14 h-14 md:w-16 md:h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" data-v-ac1f9c5b></path></svg><p class="text-white text-lg mb-4" data-v-ac1f9c5b>${ssrInterpolate(errorMessage.value)}</p><button class="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition-colors" data-v-ac1f9c5b> Try Again </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (skipIndicator.value === "back") {
        _push(`<div class="absolute left-8 md:left-20 top-1/2 -translate-y-1/2 text-white z-30 pointer-events-none" data-v-ac1f9c5b><div class="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-3" data-v-ac1f9c5b><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" data-v-ac1f9c5b></path></svg><span class="font-semibold" data-v-ac1f9c5b>10s</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (skipIndicator.value === "forward") {
        _push(`<div class="absolute right-8 md:right-20 top-1/2 -translate-y-1/2 text-white z-30 pointer-events-none" data-v-ac1f9c5b><div class="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-3" data-v-ac1f9c5b><span class="font-semibold" data-v-ac1f9c5b>10s</span><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" data-v-ac1f9c5b><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" data-v-ac1f9c5b></path></svg></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute inset-0 flex md:hidden pointer-events-none z-20" data-v-ac1f9c5b><div class="w-1/3 h-full pointer-events-auto" data-v-ac1f9c5b></div><div class="w-1/3 h-full" data-v-ac1f9c5b></div><div class="w-1/3 h-full pointer-events-auto" data-v-ac1f9c5b></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Watch.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Watch = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ac1f9c5b"]]);
const __vite_glob_0_46 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Watch
}, Symbol.toStringTag, { value: "Module" }));
async function resolvePageComponent(path, pages) {
  for (const p2 of Array.isArray(path) ? path : [path]) {
    const page = pages[p2];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
function t() {
  return t = Object.assign ? Object.assign.bind() : function(t3) {
    for (var e2 = 1; e2 < arguments.length; e2++) {
      var o2 = arguments[e2];
      for (var n2 in o2) ({}).hasOwnProperty.call(o2, n2) && (t3[n2] = o2[n2]);
    }
    return t3;
  }, t.apply(null, arguments);
}
const e = String.prototype.replace, o = /%20/g, n = { RFC1738: function(t3) {
  return e.call(t3, o, "+");
}, RFC3986: function(t3) {
  return String(t3);
} };
var r = "RFC3986";
const i = Object.prototype.hasOwnProperty, s = Array.isArray, u = (function() {
  const t3 = [];
  for (let e2 = 0; e2 < 256; ++e2) t3.push("%" + ((e2 < 16 ? "0" : "") + e2.toString(16)).toUpperCase());
  return t3;
})(), l = function t2(e2, o2, n2) {
  if (!o2) return e2;
  if ("object" != typeof o2) {
    if (s(e2)) e2.push(o2);
    else {
      if (!e2 || "object" != typeof e2) return [e2, o2];
      (n2 && (n2.plainObjects || n2.allowPrototypes) || !i.call(Object.prototype, o2)) && (e2[o2] = true);
    }
    return e2;
  }
  if (!e2 || "object" != typeof e2) return [e2].concat(o2);
  let r2 = e2;
  return s(e2) && !s(o2) && (r2 = (function(t3, e3) {
    const o3 = e3 && e3.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
    for (let e4 = 0; e4 < t3.length; ++e4) void 0 !== t3[e4] && (o3[e4] = t3[e4]);
    return o3;
  })(e2, n2)), s(e2) && s(o2) ? (o2.forEach(function(o3, r3) {
    if (i.call(e2, r3)) {
      const i2 = e2[r3];
      i2 && "object" == typeof i2 && o3 && "object" == typeof o3 ? e2[r3] = t2(i2, o3, n2) : e2.push(o3);
    } else e2[r3] = o3;
  }), e2) : Object.keys(o2).reduce(function(e3, r3) {
    const s2 = o2[r3];
    return e3[r3] = i.call(e3, r3) ? t2(e3[r3], s2, n2) : s2, e3;
  }, r2);
}, c = 1024, a = function(t3, e2) {
  return [].concat(t3, e2);
}, f = function(t3, e2) {
  if (s(t3)) {
    const o2 = [];
    for (let n2 = 0; n2 < t3.length; n2 += 1) o2.push(e2(t3[n2]));
    return o2;
  }
  return e2(t3);
}, p = Object.prototype.hasOwnProperty, y = { brackets: function(t3) {
  return t3 + "[]";
}, comma: "comma", indices: function(t3, e2) {
  return t3 + "[" + e2 + "]";
}, repeat: function(t3) {
  return t3;
} }, d = Array.isArray, h = Array.prototype.push, b = function(t3, e2) {
  h.apply(t3, d(e2) ? e2 : [e2]);
}, m = Date.prototype.toISOString, g = { addQueryPrefix: false, allowDots: false, allowEmptyArrays: false, arrayFormat: "indices", charset: "utf-8", charsetSentinel: false, delimiter: "&", encode: true, encodeDotInKeys: false, encoder: function(t3, e2, o2, n2, r2) {
  if (0 === t3.length) return t3;
  let i2 = t3;
  if ("symbol" == typeof t3 ? i2 = Symbol.prototype.toString.call(t3) : "string" != typeof t3 && (i2 = String(t3)), "iso-8859-1" === o2) return escape(i2).replace(/%u[0-9a-f]{4}/gi, function(t4) {
    return "%26%23" + parseInt(t4.slice(2), 16) + "%3B";
  });
  let s2 = "";
  for (let t4 = 0; t4 < i2.length; t4 += c) {
    const e3 = i2.length >= c ? i2.slice(t4, t4 + c) : i2, o3 = [];
    for (let t5 = 0; t5 < e3.length; ++t5) {
      let n3 = e3.charCodeAt(t5);
      45 === n3 || 46 === n3 || 95 === n3 || 126 === n3 || n3 >= 48 && n3 <= 57 || n3 >= 65 && n3 <= 90 || n3 >= 97 && n3 <= 122 || "RFC1738" === r2 && (40 === n3 || 41 === n3) ? o3[o3.length] = e3.charAt(t5) : n3 < 128 ? o3[o3.length] = u[n3] : n3 < 2048 ? o3[o3.length] = u[192 | n3 >> 6] + u[128 | 63 & n3] : n3 < 55296 || n3 >= 57344 ? o3[o3.length] = u[224 | n3 >> 12] + u[128 | n3 >> 6 & 63] + u[128 | 63 & n3] : (t5 += 1, n3 = 65536 + ((1023 & n3) << 10 | 1023 & e3.charCodeAt(t5)), o3[o3.length] = u[240 | n3 >> 18] + u[128 | n3 >> 12 & 63] + u[128 | n3 >> 6 & 63] + u[128 | 63 & n3]);
    }
    s2 += o3.join("");
  }
  return s2;
}, encodeValuesOnly: false, format: r, formatter: n[r], indices: false, serializeDate: function(t3) {
  return m.call(t3);
}, skipNulls: false, strictNullHandling: false }, w = {}, v = function(t3, e2, o2, n2, r2, i2, s2, u2, l2, c2, a2, p2, y2, h2, m2, j2, $2, E2) {
  let O2 = t3, T2 = E2, R2 = 0, S2 = false;
  for (; void 0 !== (T2 = T2.get(w)) && !S2; ) {
    const e3 = T2.get(t3);
    if (R2 += 1, void 0 !== e3) {
      if (e3 === R2) throw new RangeError("Cyclic object value");
      S2 = true;
    }
    void 0 === T2.get(w) && (R2 = 0);
  }
  if ("function" == typeof c2 ? O2 = c2(e2, O2) : O2 instanceof Date ? O2 = y2(O2) : "comma" === o2 && d(O2) && (O2 = f(O2, function(t4) {
    return t4 instanceof Date ? y2(t4) : t4;
  })), null === O2) {
    if (i2) return l2 && !j2 ? l2(e2, g.encoder, $2, "key", h2) : e2;
    O2 = "";
  }
  if ("string" == typeof (I2 = O2) || "number" == typeof I2 || "boolean" == typeof I2 || "symbol" == typeof I2 || "bigint" == typeof I2 || (function(t4) {
    return !(!t4 || "object" != typeof t4 || !(t4.constructor && t4.constructor.isBuffer && t4.constructor.isBuffer(t4)));
  })(O2)) return l2 ? [m2(j2 ? e2 : l2(e2, g.encoder, $2, "key", h2)) + "=" + m2(l2(O2, g.encoder, $2, "value", h2))] : [m2(e2) + "=" + m2(String(O2))];
  var I2;
  const A2 = [];
  if (void 0 === O2) return A2;
  let D2;
  if ("comma" === o2 && d(O2)) j2 && l2 && (O2 = f(O2, l2)), D2 = [{ value: O2.length > 0 ? O2.join(",") || null : void 0 }];
  else if (d(c2)) D2 = c2;
  else {
    const t4 = Object.keys(O2);
    D2 = a2 ? t4.sort(a2) : t4;
  }
  const _2 = u2 ? e2.replace(/\./g, "%2E") : e2, k = n2 && d(O2) && 1 === O2.length ? _2 + "[]" : _2;
  if (r2 && d(O2) && 0 === O2.length) return k + "[]";
  for (let e3 = 0; e3 < D2.length; ++e3) {
    const f2 = D2[e3], g2 = "object" == typeof f2 && void 0 !== f2.value ? f2.value : O2[f2];
    if (s2 && null === g2) continue;
    const T3 = p2 && u2 ? f2.replace(/\./g, "%2E") : f2, S3 = d(O2) ? "function" == typeof o2 ? o2(k, T3) : k : k + (p2 ? "." + T3 : "[" + T3 + "]");
    E2.set(t3, R2);
    const I3 = /* @__PURE__ */ new WeakMap();
    I3.set(w, E2), b(A2, v(g2, S3, o2, n2, r2, i2, s2, u2, "comma" === o2 && j2 && d(O2) ? null : l2, c2, a2, p2, y2, h2, m2, j2, $2, I3));
  }
  return A2;
}, j = Object.prototype.hasOwnProperty, $ = Array.isArray, E = { allowDots: false, allowEmptyArrays: false, allowPrototypes: false, allowSparse: false, arrayLimit: 20, charset: "utf-8", charsetSentinel: false, comma: false, decodeDotInKeys: false, decoder: function(t3, e2, o2) {
  const n2 = t3.replace(/\+/g, " ");
  if ("iso-8859-1" === o2) return n2.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(n2);
  } catch (t4) {
    return n2;
  }
}, delimiter: "&", depth: 5, duplicates: "combine", ignoreQueryPrefix: false, interpretNumericEntities: false, parameterLimit: 1e3, parseArrays: true, plainObjects: false, strictNullHandling: false }, O = function(t3) {
  return t3.replace(/&#(\d+);/g, function(t4, e2) {
    return String.fromCharCode(parseInt(e2, 10));
  });
}, T = function(t3, e2) {
  return t3 && "string" == typeof t3 && e2.comma && t3.indexOf(",") > -1 ? t3.split(",") : t3;
}, R = function(t3, e2, o2, n2) {
  if (!t3) return;
  const r2 = o2.allowDots ? t3.replace(/\.([^.[]+)/g, "[$1]") : t3, i2 = /(\[[^[\]]*])/g;
  let s2 = o2.depth > 0 && /(\[[^[\]]*])/.exec(r2);
  const u2 = s2 ? r2.slice(0, s2.index) : r2, l2 = [];
  if (u2) {
    if (!o2.plainObjects && j.call(Object.prototype, u2) && !o2.allowPrototypes) return;
    l2.push(u2);
  }
  let c2 = 0;
  for (; o2.depth > 0 && null !== (s2 = i2.exec(r2)) && c2 < o2.depth; ) {
    if (c2 += 1, !o2.plainObjects && j.call(Object.prototype, s2[1].slice(1, -1)) && !o2.allowPrototypes) return;
    l2.push(s2[1]);
  }
  return s2 && l2.push("[" + r2.slice(s2.index) + "]"), (function(t4, e3, o3, n3) {
    let r3 = n3 ? e3 : T(e3, o3);
    for (let e4 = t4.length - 1; e4 >= 0; --e4) {
      let n4;
      const i3 = t4[e4];
      if ("[]" === i3 && o3.parseArrays) n4 = o3.allowEmptyArrays && "" === r3 ? [] : [].concat(r3);
      else {
        n4 = o3.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        const t5 = "[" === i3.charAt(0) && "]" === i3.charAt(i3.length - 1) ? i3.slice(1, -1) : i3, e5 = o3.decodeDotInKeys ? t5.replace(/%2E/g, ".") : t5, s3 = parseInt(e5, 10);
        o3.parseArrays || "" !== e5 ? !isNaN(s3) && i3 !== e5 && String(s3) === e5 && s3 >= 0 && o3.parseArrays && s3 <= o3.arrayLimit ? (n4 = [], n4[s3] = r3) : "__proto__" !== e5 && (n4[e5] = r3) : n4 = { 0: r3 };
      }
      r3 = n4;
    }
    return r3;
  })(l2, e2, o2, n2);
};
function S(t3, e2) {
  const o2 = /* @__PURE__ */ (function(t4) {
    return E;
  })();
  if ("" === t3 || null == t3) return o2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  const n2 = "string" == typeof t3 ? (function(t4, e3) {
    const o3 = { __proto__: null }, n3 = (e3.ignoreQueryPrefix ? t4.replace(/^\?/, "") : t4).split(e3.delimiter, Infinity === e3.parameterLimit ? void 0 : e3.parameterLimit);
    let r3, i3 = -1, s2 = e3.charset;
    if (e3.charsetSentinel) for (r3 = 0; r3 < n3.length; ++r3) 0 === n3[r3].indexOf("utf8=") && ("utf8=%E2%9C%93" === n3[r3] ? s2 = "utf-8" : "utf8=%26%2310003%3B" === n3[r3] && (s2 = "iso-8859-1"), i3 = r3, r3 = n3.length);
    for (r3 = 0; r3 < n3.length; ++r3) {
      if (r3 === i3) continue;
      const t5 = n3[r3], u2 = t5.indexOf("]="), l2 = -1 === u2 ? t5.indexOf("=") : u2 + 1;
      let c2, p2;
      -1 === l2 ? (c2 = e3.decoder(t5, E.decoder, s2, "key"), p2 = e3.strictNullHandling ? null : "") : (c2 = e3.decoder(t5.slice(0, l2), E.decoder, s2, "key"), p2 = f(T(t5.slice(l2 + 1), e3), function(t6) {
        return e3.decoder(t6, E.decoder, s2, "value");
      })), p2 && e3.interpretNumericEntities && "iso-8859-1" === s2 && (p2 = O(p2)), t5.indexOf("[]=") > -1 && (p2 = $(p2) ? [p2] : p2);
      const y2 = j.call(o3, c2);
      y2 && "combine" === e3.duplicates ? o3[c2] = a(o3[c2], p2) : y2 && "last" !== e3.duplicates || (o3[c2] = p2);
    }
    return o3;
  })(t3, o2) : t3;
  let r2 = o2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  const i2 = Object.keys(n2);
  for (let e3 = 0; e3 < i2.length; ++e3) {
    const s2 = i2[e3], u2 = R(s2, n2[s2], o2, "string" == typeof t3);
    r2 = l(r2, u2, o2);
  }
  return true === o2.allowSparse ? r2 : (function(t4) {
    const e3 = [{ obj: { o: t4 }, prop: "o" }], o3 = [];
    for (let t5 = 0; t5 < e3.length; ++t5) {
      const n3 = e3[t5], r3 = n3.obj[n3.prop], i3 = Object.keys(r3);
      for (let t6 = 0; t6 < i3.length; ++t6) {
        const n4 = i3[t6], s2 = r3[n4];
        "object" == typeof s2 && null !== s2 && -1 === o3.indexOf(s2) && (e3.push({ obj: r3, prop: n4 }), o3.push(s2));
      }
    }
    return (function(t5) {
      for (; t5.length > 1; ) {
        const e4 = t5.pop(), o4 = e4.obj[e4.prop];
        if (s(o4)) {
          const t6 = [];
          for (let e5 = 0; e5 < o4.length; ++e5) void 0 !== o4[e5] && t6.push(o4[e5]);
          e4.obj[e4.prop] = t6;
        }
      }
    })(e3), t4;
  })(r2);
}
class I {
  constructor(t3, e2, o2) {
    var n2, r2;
    this.name = t3, this.definition = e2, this.bindings = null != (n2 = e2.bindings) ? n2 : {}, this.wheres = null != (r2 = e2.wheres) ? r2 : {}, this.config = o2;
  }
  get template() {
    const t3 = `${this.origin}/${this.definition.uri}`.replace(/\/+$/, "");
    return "" === t3 ? "/" : t3;
  }
  get origin() {
    return this.config.absolute ? this.definition.domain ? `${this.config.url.match(/^\w+:\/\//)[0]}${this.definition.domain}${this.config.port ? `:${this.config.port}` : ""}` : this.config.url : "";
  }
  get parameterSegments() {
    var t3, e2;
    return null != (t3 = null == (e2 = this.template.match(/{[^}?]+\??}/g)) ? void 0 : e2.map((t4) => ({ name: t4.replace(/{|\??}/g, ""), required: !/\?}$/.test(t4) }))) ? t3 : [];
  }
  matchesUrl(t3) {
    var e2;
    if (!this.definition.methods.includes("GET")) return false;
    const o2 = this.template.replace(/[.*+$()[\]]/g, "\\$&").replace(/(\/?){([^}?]*)(\??)}/g, (t4, e3, o3, n3) => {
      var r3;
      const i3 = `(?<${o3}>${(null == (r3 = this.wheres[o3]) ? void 0 : r3.replace(/(^\^)|(\$$)/g, "")) || "[^/?]+"})`;
      return n3 ? `(${e3}${i3})?` : `${e3}${i3}`;
    }).replace(/^\w+:\/\//, ""), [n2, r2] = t3.replace(/^\w+:\/\//, "").split("?"), i2 = null != (e2 = new RegExp(`^${o2}/?$`).exec(n2)) ? e2 : new RegExp(`^${o2}/?$`).exec(decodeURI(n2));
    if (i2) {
      for (const t4 in i2.groups) i2.groups[t4] = "string" == typeof i2.groups[t4] ? decodeURIComponent(i2.groups[t4]) : i2.groups[t4];
      return { params: i2.groups, query: S(r2) };
    }
    return false;
  }
  compile(t3) {
    return this.parameterSegments.length ? this.template.replace(/{([^}?]+)(\??)}/g, (e2, o2, n2) => {
      var r2, i2;
      if (!n2 && [null, void 0].includes(t3[o2])) throw new Error(`Ziggy error: '${o2}' parameter is required for route '${this.name}'.`);
      if (this.wheres[o2] && !new RegExp(`^${n2 ? `(${this.wheres[o2]})?` : this.wheres[o2]}$`).test(null != (i2 = t3[o2]) ? i2 : "")) throw new Error(`Ziggy error: '${o2}' parameter '${t3[o2]}' does not match required format '${this.wheres[o2]}' for route '${this.name}'.`);
      return encodeURI(null != (r2 = t3[o2]) ? r2 : "").replace(/%7C/g, "|").replace(/%25/g, "%").replace(/\$/g, "%24");
    }).replace(this.config.absolute ? /(\.[^/]+?)(\/\/)/ : /(^)(\/\/)/, "$1/").replace(/\/+$/, "") : this.template;
  }
}
class A extends String {
  constructor(e2, o2, n2 = true, r2) {
    if (super(), this.t = null != r2 ? r2 : "undefined" != typeof Ziggy ? Ziggy : null == globalThis ? void 0 : globalThis.Ziggy, !this.t && "undefined" != typeof document && document.getElementById("ziggy-routes-json") && (globalThis.Ziggy = JSON.parse(document.getElementById("ziggy-routes-json").textContent), this.t = globalThis.Ziggy), this.t = t({}, this.t, { absolute: n2 }), e2) {
      if (!this.t.routes[e2]) throw new Error(`Ziggy error: route '${e2}' is not in the route list.`);
      this.i = new I(e2, this.t.routes[e2], this.t), this.u = this.l(o2);
    }
  }
  toString() {
    const e2 = Object.keys(this.u).filter((t3) => !this.i.parameterSegments.some(({ name: e3 }) => e3 === t3)).filter((t3) => "_query" !== t3).reduce((e3, o2) => t({}, e3, { [o2]: this.u[o2] }), {});
    return this.i.compile(this.u) + (function(t3, e3) {
      let o2 = t3;
      const i2 = (function(t4) {
        if (!t4) return g;
        if (void 0 !== t4.allowEmptyArrays && "boolean" != typeof t4.allowEmptyArrays) throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
        if (void 0 !== t4.encodeDotInKeys && "boolean" != typeof t4.encodeDotInKeys) throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
        if (null != t4.encoder && "function" != typeof t4.encoder) throw new TypeError("Encoder has to be a function.");
        const e4 = t4.charset || g.charset;
        if (void 0 !== t4.charset && "utf-8" !== t4.charset && "iso-8859-1" !== t4.charset) throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
        let o3 = r;
        if (void 0 !== t4.format) {
          if (!p.call(n, t4.format)) throw new TypeError("Unknown format option provided.");
          o3 = t4.format;
        }
        const i3 = n[o3];
        let s3, u3 = g.filter;
        if (("function" == typeof t4.filter || d(t4.filter)) && (u3 = t4.filter), s3 = t4.arrayFormat in y ? t4.arrayFormat : "indices" in t4 ? t4.indices ? "indices" : "repeat" : g.arrayFormat, "commaRoundTrip" in t4 && "boolean" != typeof t4.commaRoundTrip) throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
        return { addQueryPrefix: "boolean" == typeof t4.addQueryPrefix ? t4.addQueryPrefix : g.addQueryPrefix, allowDots: void 0 === t4.allowDots ? true === t4.encodeDotInKeys || g.allowDots : !!t4.allowDots, allowEmptyArrays: "boolean" == typeof t4.allowEmptyArrays ? !!t4.allowEmptyArrays : g.allowEmptyArrays, arrayFormat: s3, charset: e4, charsetSentinel: "boolean" == typeof t4.charsetSentinel ? t4.charsetSentinel : g.charsetSentinel, commaRoundTrip: t4.commaRoundTrip, delimiter: void 0 === t4.delimiter ? g.delimiter : t4.delimiter, encode: "boolean" == typeof t4.encode ? t4.encode : g.encode, encodeDotInKeys: "boolean" == typeof t4.encodeDotInKeys ? t4.encodeDotInKeys : g.encodeDotInKeys, encoder: "function" == typeof t4.encoder ? t4.encoder : g.encoder, encodeValuesOnly: "boolean" == typeof t4.encodeValuesOnly ? t4.encodeValuesOnly : g.encodeValuesOnly, filter: u3, format: o3, formatter: i3, serializeDate: "function" == typeof t4.serializeDate ? t4.serializeDate : g.serializeDate, skipNulls: "boolean" == typeof t4.skipNulls ? t4.skipNulls : g.skipNulls, sort: "function" == typeof t4.sort ? t4.sort : null, strictNullHandling: "boolean" == typeof t4.strictNullHandling ? t4.strictNullHandling : g.strictNullHandling };
      })(e3);
      let s2, u2;
      "function" == typeof i2.filter ? (u2 = i2.filter, o2 = u2("", o2)) : d(i2.filter) && (u2 = i2.filter, s2 = u2);
      const l2 = [];
      if ("object" != typeof o2 || null === o2) return "";
      const c2 = y[i2.arrayFormat], a2 = "comma" === c2 && i2.commaRoundTrip;
      s2 || (s2 = Object.keys(o2)), i2.sort && s2.sort(i2.sort);
      const f2 = /* @__PURE__ */ new WeakMap();
      for (let t4 = 0; t4 < s2.length; ++t4) {
        const e4 = s2[t4];
        i2.skipNulls && null === o2[e4] || b(l2, v(o2[e4], e4, c2, a2, i2.allowEmptyArrays, i2.strictNullHandling, i2.skipNulls, i2.encodeDotInKeys, i2.encode ? i2.encoder : null, i2.filter, i2.sort, i2.allowDots, i2.serializeDate, i2.format, i2.formatter, i2.encodeValuesOnly, i2.charset, f2));
      }
      const h2 = l2.join(i2.delimiter);
      let m2 = true === i2.addQueryPrefix ? "?" : "";
      return i2.charsetSentinel && (m2 += "iso-8859-1" === i2.charset ? "utf8=%26%2310003%3B&" : "utf8=%E2%9C%93&"), h2.length > 0 ? m2 + h2 : "";
    })(t({}, e2, this.u._query), { addQueryPrefix: true, arrayFormat: "indices", encodeValuesOnly: true, skipNulls: true, encoder: (t3, e3) => "boolean" == typeof t3 ? Number(t3) : e3(t3) });
  }
  p(e2) {
    e2 ? this.t.absolute && e2.startsWith("/") && (e2 = this.h().host + e2) : e2 = this.m();
    let o2 = {};
    const [n2, r2] = Object.entries(this.t.routes).find(([t3, n3]) => o2 = new I(t3, n3, this.t).matchesUrl(e2)) || [void 0, void 0];
    return t({ name: n2 }, o2, { route: r2 });
  }
  m() {
    const { host: t3, pathname: e2, search: o2 } = this.h();
    return (this.t.absolute ? t3 + e2 : e2.replace(this.t.url.replace(/^\w*:\/\/[^/]+/, ""), "").replace(/^\/+/, "/")) + o2;
  }
  current(e2, o2) {
    const { name: n2, params: r2, query: i2, route: s2 } = this.p();
    if (!e2) return n2;
    const u2 = new RegExp(`^${e2.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`).test(n2);
    if ([null, void 0].includes(o2) || !u2) return u2;
    const l2 = new I(n2, s2, this.t);
    o2 = this.l(o2, l2);
    const c2 = t({}, r2, i2);
    if (Object.values(o2).every((t3) => !t3) && !Object.values(c2).some((t3) => void 0 !== t3)) return true;
    const a2 = (t3, e3) => Object.entries(t3).every(([t4, o3]) => Array.isArray(o3) && Array.isArray(e3[t4]) ? o3.every((o4) => e3[t4].includes(o4) || e3[t4].includes(decodeURIComponent(o4))) : "object" == typeof o3 && "object" == typeof e3[t4] && null !== o3 && null !== e3[t4] ? a2(o3, e3[t4]) : e3[t4] == o3 || e3[t4] == decodeURIComponent(o3));
    return a2(o2, c2);
  }
  h() {
    var t3, e2, o2, n2, r2, i2;
    const { host: s2 = "", pathname: u2 = "", search: l2 = "" } = "undefined" != typeof window ? window.location : {};
    return { host: null != (t3 = null == (e2 = this.t.location) ? void 0 : e2.host) ? t3 : s2, pathname: null != (o2 = null == (n2 = this.t.location) ? void 0 : n2.pathname) ? o2 : u2, search: null != (r2 = null == (i2 = this.t.location) ? void 0 : i2.search) ? r2 : l2 };
  }
  get params() {
    const { params: e2, query: o2 } = this.p();
    return t({}, e2, o2);
  }
  get routeParams() {
    return this.p().params;
  }
  get queryParams() {
    return this.p().query;
  }
  has(t3) {
    return this.t.routes.hasOwnProperty(t3);
  }
  l(e2 = {}, o2 = this.i) {
    null != e2 || (e2 = {}), e2 = ["string", "number"].includes(typeof e2) ? [e2] : e2;
    const n2 = o2.parameterSegments.filter(({ name: t3 }) => !this.t.defaults[t3]);
    return Array.isArray(e2) ? e2 = e2.reduce((e3, o3, r2) => t({}, e3, n2[r2] ? { [n2[r2].name]: o3 } : "object" == typeof o3 ? o3 : { [o3]: "" }), {}) : 1 !== n2.length || e2[n2[0].name] || !e2.hasOwnProperty(Object.values(o2.bindings)[0]) && !e2.hasOwnProperty("id") || (e2 = { [n2[0].name]: e2 }), t({}, this.v(o2), this.j(e2, o2));
  }
  v(e2) {
    return e2.parameterSegments.filter(({ name: t3 }) => this.t.defaults[t3]).reduce((e3, { name: o2 }, n2) => t({}, e3, { [o2]: this.t.defaults[o2] }), {});
  }
  j(e2, { bindings: o2, parameterSegments: n2 }) {
    return Object.entries(e2).reduce((e3, [r2, i2]) => {
      if (!i2 || "object" != typeof i2 || Array.isArray(i2) || !n2.some(({ name: t3 }) => t3 === r2)) return t({}, e3, { [r2]: i2 });
      if (!i2.hasOwnProperty(o2[r2])) {
        if (!i2.hasOwnProperty("id")) throw new Error(`Ziggy error: object passed as '${r2}' parameter is missing route model binding key '${o2[r2]}'.`);
        o2[r2] = "id";
      }
      return t({}, e3, { [r2]: i2[o2[r2]] });
    }, {});
  }
  valueOf() {
    return this.toString();
  }
}
function D(t3, e2, o2, n2) {
  const r2 = new A(t3, e2, o2, n2);
  return t3 ? r2.toString() : r2;
}
const _ = { install(t3, e2) {
  const o2 = (t4, o3, n2, r2 = e2) => D(t4, o3, n2, r2);
  parseInt(t3.version) > 2 ? (t3.config.globalProperties.route = o2, t3.provide("route", o2)) : t3.mixin({ methods: { route: o2 } });
} };
const Ziggy$1 = { "url": "http://crazyday.test", "port": null, "defaults": {}, "routes": { "login.store": { "uri": "login", "methods": ["POST"] }, "logout": { "uri": "logout", "methods": ["POST"] }, "password.email": { "uri": "forgot-password", "methods": ["POST"] }, "password.update": { "uri": "reset-password", "methods": ["POST"] }, "register.store": { "uri": "register", "methods": ["POST"] }, "user-profile-information.update": { "uri": "user/profile-information", "methods": ["PUT"] }, "user-password.update": { "uri": "user/password", "methods": ["PUT"] }, "password.confirmation": { "uri": "user/confirmed-password-status", "methods": ["GET", "HEAD"] }, "password.confirm.store": { "uri": "user/confirm-password", "methods": ["POST"] }, "two-factor.login.store": { "uri": "two-factor-challenge", "methods": ["POST"] }, "two-factor.enable": { "uri": "user/two-factor-authentication", "methods": ["POST"] }, "two-factor.confirm": { "uri": "user/confirmed-two-factor-authentication", "methods": ["POST"] }, "two-factor.disable": { "uri": "user/two-factor-authentication", "methods": ["DELETE"] }, "two-factor.qr-code": { "uri": "user/two-factor-qr-code", "methods": ["GET", "HEAD"] }, "two-factor.secret-key": { "uri": "user/two-factor-secret-key", "methods": ["GET", "HEAD"] }, "two-factor.recovery-codes": { "uri": "user/two-factor-recovery-codes", "methods": ["GET", "HEAD"] }, "two-factor.regenerate-recovery-codes": { "uri": "user/two-factor-recovery-codes", "methods": ["POST"] }, "home": { "uri": "/", "methods": ["GET", "HEAD"] }, "details": { "uri": "details", "methods": ["GET", "HEAD"] }, "reviews.store": { "uri": "reviews", "methods": ["POST"] }, "contact": { "uri": "contact", "methods": ["GET", "HEAD"] }, "contact.store": { "uri": "contact", "methods": ["POST"] }, "terms": { "uri": "terms", "methods": ["GET", "HEAD"] }, "privacy": { "uri": "privacy", "methods": ["GET", "HEAD"] }, "gallery": { "uri": "gallery", "methods": ["GET", "HEAD"] }, "sitemap": { "uri": "sitemap.xml", "methods": ["GET", "HEAD"] }, "login": { "uri": "login", "methods": ["GET", "HEAD"] }, "register": { "uri": "register", "methods": ["GET", "HEAD"] }, "password.request": { "uri": "forgot-password", "methods": ["GET", "HEAD"] }, "password.reset": { "uri": "reset-password/{token}", "methods": ["GET", "HEAD"], "parameters": ["token"] }, "verification.notice": { "uri": "verify-email", "methods": ["GET", "HEAD"] }, "verification.verify": { "uri": "email/verify/{id}/{hash}", "methods": ["GET", "HEAD"], "parameters": ["id", "hash"] }, "verification.send": { "uri": "email/verification-notification", "methods": ["POST"] }, "password.confirm": { "uri": "confirm-password", "methods": ["GET", "HEAD"] }, "two-factor.login": { "uri": "two-factor-challenge", "methods": ["GET", "HEAD"] }, "admin.dashboard": { "uri": "admin", "methods": ["GET", "HEAD"] }, "admin.banners.index": { "uri": "admin/banners", "methods": ["GET", "HEAD"] }, "admin.banners.create": { "uri": "admin/banners/create", "methods": ["GET", "HEAD"] }, "admin.banners.store": { "uri": "admin/banners", "methods": ["POST"] }, "admin.banners.show": { "uri": "admin/banners/{banner}", "methods": ["GET", "HEAD"], "parameters": ["banner"], "bindings": { "banner": "id" } }, "admin.banners.edit": { "uri": "admin/banners/{banner}/edit", "methods": ["GET", "HEAD"], "parameters": ["banner"], "bindings": { "banner": "id" } }, "admin.banners.update": { "uri": "admin/banners/{banner}", "methods": ["PUT", "PATCH"], "parameters": ["banner"], "bindings": { "banner": "id" } }, "admin.banners.destroy": { "uri": "admin/banners/{banner}", "methods": ["DELETE"], "parameters": ["banner"], "bindings": { "banner": "id" } }, "admin.gallery.index": { "uri": "admin/gallery", "methods": ["GET", "HEAD"] }, "admin.gallery.create": { "uri": "admin/gallery/create", "methods": ["GET", "HEAD"] }, "admin.gallery.store": { "uri": "admin/gallery", "methods": ["POST"] }, "admin.gallery.show": { "uri": "admin/gallery/{gallery}", "methods": ["GET", "HEAD"], "parameters": ["gallery"], "bindings": { "gallery": "id" } }, "admin.gallery.edit": { "uri": "admin/gallery/{gallery}/edit", "methods": ["GET", "HEAD"], "parameters": ["gallery"], "bindings": { "gallery": "id" } }, "admin.gallery.update": { "uri": "admin/gallery/{gallery}", "methods": ["PUT", "PATCH"], "parameters": ["gallery"], "bindings": { "gallery": "id" } }, "admin.gallery.destroy": { "uri": "admin/gallery/{gallery}", "methods": ["DELETE"], "parameters": ["gallery"], "bindings": { "gallery": "id" } }, "admin.cast-crew.index": { "uri": "admin/cast-crew", "methods": ["GET", "HEAD"] }, "admin.cast-crew.create": { "uri": "admin/cast-crew/create", "methods": ["GET", "HEAD"] }, "admin.cast-crew.store": { "uri": "admin/cast-crew", "methods": ["POST"] }, "admin.cast-crew.show": { "uri": "admin/cast-crew/{castCrew}", "methods": ["GET", "HEAD"], "parameters": ["castCrew"], "bindings": { "castCrew": "id" } }, "admin.cast-crew.edit": { "uri": "admin/cast-crew/{castCrew}/edit", "methods": ["GET", "HEAD"], "parameters": ["castCrew"], "bindings": { "castCrew": "id" } }, "admin.cast-crew.update": { "uri": "admin/cast-crew/{castCrew}", "methods": ["PUT", "PATCH"], "parameters": ["castCrew"], "bindings": { "castCrew": "id" } }, "admin.cast-crew.destroy": { "uri": "admin/cast-crew/{castCrew}", "methods": ["DELETE"], "parameters": ["castCrew"], "bindings": { "castCrew": "id" } }, "admin.page-content.index": { "uri": "admin/page-content", "methods": ["GET", "HEAD"] }, "admin.page-content.create": { "uri": "admin/page-content/create", "methods": ["GET", "HEAD"] }, "admin.page-content.store": { "uri": "admin/page-content", "methods": ["POST"] }, "admin.page-content.show": { "uri": "admin/page-content/{pageContent}", "methods": ["GET", "HEAD"], "parameters": ["pageContent"], "bindings": { "pageContent": "id" } }, "admin.page-content.edit": { "uri": "admin/page-content/{pageContent}/edit", "methods": ["GET", "HEAD"], "parameters": ["pageContent"], "bindings": { "pageContent": "id" } }, "admin.page-content.update": { "uri": "admin/page-content/{pageContent}", "methods": ["PUT", "PATCH"], "parameters": ["pageContent"], "bindings": { "pageContent": "id" } }, "admin.page-content.destroy": { "uri": "admin/page-content/{pageContent}", "methods": ["DELETE"], "parameters": ["pageContent"], "bindings": { "pageContent": "id" } }, "admin.watch-analytics": { "uri": "admin/watch-analytics", "methods": ["GET", "HEAD"] }, "admin.reviews.index": { "uri": "admin/reviews", "methods": ["GET", "HEAD"] }, "admin.reviews.create": { "uri": "admin/reviews/create", "methods": ["GET", "HEAD"] }, "admin.reviews.store": { "uri": "admin/reviews", "methods": ["POST"] }, "admin.reviews.show": { "uri": "admin/reviews/{review}", "methods": ["GET", "HEAD"], "parameters": ["review"], "bindings": { "review": "id" } }, "admin.reviews.edit": { "uri": "admin/reviews/{review}/edit", "methods": ["GET", "HEAD"], "parameters": ["review"], "bindings": { "review": "id" } }, "admin.reviews.update": { "uri": "admin/reviews/{review}", "methods": ["PUT", "PATCH"], "parameters": ["review"], "bindings": { "review": "id" } }, "admin.reviews.destroy": { "uri": "admin/reviews/{review}", "methods": ["DELETE"], "parameters": ["review"], "bindings": { "review": "id" } }, "admin.reviews.approve": { "uri": "admin/reviews/{review}/approve", "methods": ["PATCH"], "parameters": ["review"], "bindings": { "review": "id" } }, "admin.upload.image": { "uri": "admin/upload/image", "methods": ["POST"] }, "admin.upload.delete": { "uri": "admin/upload/image", "methods": ["DELETE"] }, "admin.referral-codes.index": { "uri": "admin/referral-codes", "methods": ["GET", "HEAD"] }, "admin.referral-codes.store": { "uri": "admin/referral-codes", "methods": ["POST"] }, "admin.referral-codes.stats": { "uri": "admin/referral-codes/{code}/stats", "methods": ["GET", "HEAD"], "parameters": ["code"] }, "admin.referral-codes.activate": { "uri": "admin/referral-codes/{code}/activate", "methods": ["PATCH"], "parameters": ["code"] }, "admin.referral-codes.deactivate": { "uri": "admin/referral-codes/{code}/deactivate", "methods": ["PATCH"], "parameters": ["code"] }, "admin.analytics": { "uri": "admin/analytics", "methods": ["GET", "HEAD"] }, "admin.settings.index": { "uri": "admin/settings", "methods": ["GET", "HEAD"] }, "admin.settings.update": { "uri": "admin/settings", "methods": ["POST"] }, "admin.settings.update-single": { "uri": "admin/settings/{key}", "methods": ["POST"], "parameters": ["key"] }, "admin.env-settings.index": { "uri": "admin/env-settings", "methods": ["GET", "HEAD"] }, "admin.env-settings.update": { "uri": "admin/env-settings", "methods": ["POST"] }, "admin.env-settings.verify-password": { "uri": "admin/env-settings/verify-password", "methods": ["POST"] }, "admin.env-settings.send-otp": { "uri": "admin/env-settings/send-otp", "methods": ["POST"] }, "admin.env-settings.verify-otp": { "uri": "admin/env-settings/verify-otp", "methods": ["POST"] }, "admin.env-settings.lock": { "uri": "admin/env-settings/lock", "methods": ["POST"] }, "admin.subscribers.index": { "uri": "admin/subscribers", "methods": ["GET", "HEAD"] }, "admin.subscribers.export": { "uri": "admin/subscribers/export", "methods": ["GET", "HEAD"] }, "dashboard": { "uri": "dashboard", "methods": ["GET", "HEAD"] }, "profile.edit": { "uri": "profile", "methods": ["GET", "HEAD"] }, "profile.update": { "uri": "profile", "methods": ["PUT"] }, "profile.password": { "uri": "profile/password", "methods": ["PUT"] }, "two-factor.settings": { "uri": "account/two-factor", "methods": ["GET", "HEAD"] }, "profile.destroy": { "uri": "profile", "methods": ["DELETE"] }, "profile.payments": { "uri": "profile/payments", "methods": ["GET", "HEAD"] }, "payments.init": { "uri": "payments/init", "methods": ["POST"] }, "payments.status": { "uri": "payments/status/{reference}", "methods": ["GET", "HEAD"], "parameters": ["reference"] }, "watch": { "uri": "watch", "methods": ["GET", "HEAD"] }, "payments.callback": { "uri": "payment", "methods": ["GET", "HEAD"] }, "payment.checkout": { "uri": "payment/checkout", "methods": ["GET", "HEAD"] }, "referral.index": { "uri": "api/referral", "methods": ["GET", "HEAD"] }, "referral.validate": { "uri": "api/referral/validate", "methods": ["POST"] }, "referral.calculate-discount": { "uri": "api/referral/calculate-discount", "methods": ["POST"] }, "referral.validate-discount": { "uri": "referral/validate-discount", "methods": ["POST"] }, "payments.webhook": { "uri": "webhooks/paystack", "methods": ["POST"] }, "storage.local": { "uri": "storage/{path}", "methods": ["GET", "HEAD"], "wheres": { "path": ".*" }, "parameters": ["path"] } } };
if (typeof window !== "undefined" && typeof window.Ziggy !== "undefined") {
  Object.assign(Ziggy$1.routes, window.Ziggy.routes);
}
createServer((page) => {
  return createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, /* @__PURE__ */ Object.assign({ "./Pages/Account/TwoFactorSettings.vue": __vite_glob_0_0, "./Pages/Admin/Banners/Create.vue": __vite_glob_0_1, "./Pages/Admin/Banners/Edit.vue": __vite_glob_0_2, "./Pages/Admin/Banners/Index.vue": __vite_glob_0_3, "./Pages/Admin/Banners/Show.vue": __vite_glob_0_4, "./Pages/Admin/CastCrew/Create.vue": __vite_glob_0_5, "./Pages/Admin/CastCrew/Edit.vue": __vite_glob_0_6, "./Pages/Admin/CastCrew/Index.vue": __vite_glob_0_7, "./Pages/Admin/CastCrew/Show.vue": __vite_glob_0_8, "./Pages/Admin/Dashboard.vue": __vite_glob_0_9, "./Pages/Admin/Email/Index.vue": __vite_glob_0_10, "./Pages/Admin/EnvSettings.vue": __vite_glob_0_11, "./Pages/Admin/EnvSettingsLocked.vue": __vite_glob_0_12, "./Pages/Admin/Gallery/Create.vue": __vite_glob_0_13, "./Pages/Admin/Gallery/Edit.vue": __vite_glob_0_14, "./Pages/Admin/Gallery/Index.vue": __vite_glob_0_15, "./Pages/Admin/Gallery/Show.vue": __vite_glob_0_16, "./Pages/Admin/PageContent/Create.vue": __vite_glob_0_17, "./Pages/Admin/PageContent/Edit.vue": __vite_glob_0_18, "./Pages/Admin/PageContent/Index.vue": __vite_glob_0_19, "./Pages/Admin/PageContent/Show.vue": __vite_glob_0_20, "./Pages/Admin/Reviews/Create.vue": __vite_glob_0_21, "./Pages/Admin/Reviews/Edit.vue": __vite_glob_0_22, "./Pages/Admin/Reviews/Index.vue": __vite_glob_0_23, "./Pages/Admin/Reviews/Show.vue": __vite_glob_0_24, "./Pages/Admin/Settings.vue": __vite_glob_0_25, "./Pages/Admin/Sms/Index.vue": __vite_glob_0_26, "./Pages/Admin/Subscribers/Index.vue": __vite_glob_0_27, "./Pages/Admin/WatchAnalytics.vue": __vite_glob_0_28, "./Pages/Auth/ConfirmPassword.vue": __vite_glob_0_29, "./Pages/Auth/ForgotPassword.vue": __vite_glob_0_30, "./Pages/Auth/Login.vue": __vite_glob_0_31, "./Pages/Auth/Register.vue": __vite_glob_0_32, "./Pages/Auth/ResetPassword.vue": __vite_glob_0_33, "./Pages/Auth/TwoFactorChallenge.vue": __vite_glob_0_34, "./Pages/Auth/VerifyEmail.vue": __vite_glob_0_35, "./Pages/Contact.vue": __vite_glob_0_36, "./Pages/Gallery.vue": __vite_glob_0_37, "./Pages/Index.vue": __vite_glob_0_38, "./Pages/Information.vue": __vite_glob_0_39, "./Pages/Payment.vue": __vite_glob_0_40, "./Pages/Privacy.vue": __vite_glob_0_41, "./Pages/Profile/Edit.vue": __vite_glob_0_42, "./Pages/Profile/Payments.vue": __vite_glob_0_43, "./Pages/Streamer/Dashboard.vue": __vite_glob_0_44, "./Pages/Terms.vue": __vite_glob_0_45, "./Pages/Watch.vue": __vite_glob_0_46 })),
    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h$1(App, props) }).use(plugin).use(_, Ziggy$1);
    }
  });
});
