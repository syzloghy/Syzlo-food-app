import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Upload,
  Save,
  CheckCircle2,
  FileBadge,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Shield,
  Package,
} from 'lucide-react';

export const BrandLogoSettings: React.FC = () => {
  const { brandConfig, updateBrandConfig } = useApp();

  const [brandName, setBrandName] = useState(brandConfig.brandName);
  const [tagline, setTagline] = useState(brandConfig.tagline);
  const [logoUrl, setLogoUrl] = useState(brandConfig.logoUrl);
  const [phone, setPhone] = useState(brandConfig.contactPhone);
  const [email, setEmail] = useState(brandConfig.contactEmail);
  const [address, setAddress] = useState(brandConfig.restaurantAddress);
  const [fssai, setFssai] = useState(brandConfig.fssaiLicense);
  const [gstin, setGstin] = useState(brandConfig.gstin);
  const [currencySymbol, setCurrencySymbol] = useState(brandConfig.currencySymbol);

  // Packaging charges by order mode
  const [packagingChargeTakeaway, setPackagingChargeTakeaway] = useState(brandConfig.packagingChargeTakeaway ?? 20);
  const [packagingChargeDelivery, setPackagingChargeDelivery] = useState(brandConfig.packagingChargeDelivery ?? 15);
  const [packagingChargeDineIn, setPackagingChargeDineIn] = useState(brandConfig.packagingChargeDineIn ?? 0);
  const [isPackagingChargeEnabled, setIsPackagingChargeEnabled] = useState(brandConfig.isPackagingChargeEnabled ?? true);

  const [saved, setSaved] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandConfig({
      brandName,
      tagline,
      logoUrl,
      contactPhone: phone,
      contactEmail: email,
      restaurantAddress: address,
      fssaiLicense: fssai,
      gstin,
      currencySymbol,
      packagingChargeTakeaway: Number(packagingChargeTakeaway),
      packagingChargeDelivery: Number(packagingChargeDelivery),
      packagingChargeDineIn: Number(packagingChargeDineIn),
      isPackagingChargeEnabled,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-cream-300 shadow-xs">
        <h2 className="text-xl font-black text-syzlo-charcoal flex items-center gap-2">
          <Store className="w-5 h-5 text-olive-600" />
          Brand Identity, Packaging Charges & Restaurant Settings
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Upload your restaurant logo, configure takeaway/delivery packaging charges, FSSAI compliance, and brand contact info.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Brand configuration, packaging charges, and logo updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Logo Upload & Visual Identity Preview */}
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-xs text-center">
            <h3 className="text-xs font-black text-syzlo-charcoal mb-4 uppercase tracking-wider">
              Brand Logo & Icon
            </h3>

            {/* Logo Preview */}
            <div className="w-28 h-28 mx-auto rounded-3xl bg-cream-100 border-2 border-dashed border-olive-400 p-2 flex items-center justify-center overflow-hidden shadow-inner group relative">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={brandName}
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                <span className="text-3xl">🥟</span>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <label className="w-full py-2.5 px-4 rounded-xl bg-olive-600 hover:bg-olive-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
                <Upload className="w-4 h-4" />
                <span>Upload Logo File (PNG/SVG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 text-left mb-1">
                  Or Paste External Logo URL
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-cream-300 text-xs font-medium focus:ring-2 focus:ring-olive-500/20"
                />
              </div>
            </div>
          </div>

          {/* Live Customer Header Preview Card */}
          <div className="bg-[#20221A] text-white p-5 rounded-3xl shadow-md border border-olive-900/50">
            <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider text-olive-400 mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Customer Navbar Preview</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-olive-500 text-white flex items-center justify-center font-black text-base shadow-sm overflow-hidden shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span>🥟</span>
                )}
              </div>
              <div>
                <h4 className="font-black text-lg tracking-wider text-white leading-none">
                  {brandName || 'SYZLO'}
                </h4>
                <p className="text-[11px] text-cream-200 mt-1 line-clamp-1">{tagline}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Packaging Charges & Compliance Inputs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Packaging Charges Card */}
          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div>
                <h3 className="text-sm font-black text-syzlo-charcoal flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>Packaging Charges by Order Mode</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Control fee charged for takeaway containers, delivery boxes, or dine-in packaging
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPackagingChargeEnabled}
                  onChange={(e) => setIsPackagingChargeEnabled(e.target.checked)}
                  className="rounded text-olive-600 focus:ring-olive-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-stone-700">Enable Packaging Fees</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200">
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  🥡 Takeaway / Pickup Charge ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  value={packagingChargeTakeaway}
                  onChange={(e) => setPackagingChargeTakeaway(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 font-black text-sm text-syzlo-charcoal bg-white focus:ring-2 focus:ring-olive-500/20"
                />
                <span className="text-[10px] text-stone-500 block mt-1">
                  Applied when customer selects Takeaway mode
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200">
                <label className="block text-xs font-bold text-blue-900 mb-1">
                  🛵 Delivery Packaging Charge ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  value={packagingChargeDelivery}
                  onChange={(e) => setPackagingChargeDelivery(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 font-black text-sm text-syzlo-charcoal bg-white focus:ring-2 focus:ring-olive-500/20"
                />
                <span className="text-[10px] text-stone-500 block mt-1">
                  Applied on doorstep delivery orders
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200">
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  🍽️ Dine-in Table Fee ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  value={packagingChargeDineIn}
                  onChange={(e) => setPackagingChargeDineIn(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 font-black text-sm text-syzlo-charcoal bg-white focus:ring-2 focus:ring-olive-500/20"
                />
                <span className="text-[10px] text-stone-500 block mt-1">
                  Usually ₹0 for in-restaurant dining
                </span>
              </div>
            </div>
          </div>

          {/* Restaurant Details & Legal Compliance */}
          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-syzlo-charcoal border-b border-cream-200 pb-3">
              Restaurant Details & Statutory Registrations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-bold focus:ring-2 focus:ring-olive-500/20"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-bold focus:ring-2 focus:ring-olive-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Brand Tagline / Pitch</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  Customer Support Hotline
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs font-medium focus:ring-2 focus:ring-olive-500/20"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  Support Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs font-medium focus:ring-2 focus:ring-olive-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                Kitchen Outlet Physical Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs font-medium focus:ring-2 focus:ring-olive-500/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cream-200">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  FSSAI Food Safety License No.
                </label>
                <input
                  type="text"
                  value={fssai}
                  onChange={(e) => setFssai(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 font-mono text-xs focus:ring-2 focus:ring-olive-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <FileBadge className="w-3.5 h-3.5 text-olive-600" />
                  GSTIN / Tax ID
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 font-mono text-xs uppercase focus:ring-2 focus:ring-olive-500/20"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-olive-600 hover:bg-olive-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings & Packaging Charges</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
