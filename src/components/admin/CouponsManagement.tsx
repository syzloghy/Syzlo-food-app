import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coupon, CouponApplicableMode } from '../../types';
import {
  Tag,
  Plus,
  Trash2,
  Check,
  X,
  Percent,
  Sparkles,
  ShoppingBag,
  Bike,
  UtensilsCrossed,
} from 'lucide-react';

export const CouponsManagement: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon, toggleCouponStatus } = useApp();

  const [modeFilter, setModeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [minOrder, setMinOrder] = useState<number>(200);
  const [maxDiscount, setMaxDiscount] = useState<number>(100);
  const [description, setDescription] = useState('');
  const [applicableMode, setApplicableMode] = useState<CouponApplicableMode>('ALL');

  const filteredCoupons = coupons.filter((c) => {
    if (modeFilter === 'ALL') return true;
    return c.applicableMode === modeFilter;
  });

  const openCreateModal = () => {
    setCode('');
    setDiscountType('PERCENT');
    setDiscountValue(20);
    setMinOrder(200);
    setMaxDiscount(100);
    setDescription('Exclusive discount on your meal.');
    setApplicableMode('ALL');
    setIsModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || discountValue <= 0) return;

    const newCoupon: Coupon = {
      code: code.trim().toUpperCase(),
      discountValue: Number(discountValue),
      discountType,
      minOrder: Number(minOrder),
      maxDiscount: discountType === 'PERCENT' ? Number(maxDiscount) : undefined,
      description,
      active: true,
      isActive: true,
      applicableMode,
    };

    addCoupon(newCoupon);
    setIsModalOpen(false);
  };

  const getModeBadge = (mode?: CouponApplicableMode) => {
    switch (mode) {
      case 'PICKUP':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold border border-amber-300">
            <ShoppingBag className="w-3 h-3 text-amber-600" />
            <span>Pickup Only</span>
          </span>
        );
      case 'DELIVERY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold border border-blue-300">
            <Bike className="w-3 h-3 text-blue-600" />
            <span>Delivery Only</span>
          </span>
        );
      case 'DINE-IN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold border border-purple-300">
            <UtensilsCrossed className="w-3 h-3 text-purple-600" />
            <span>Dine-In Only</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-extrabold">
            <span>All Channels</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-cream-300 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-syzlo-charcoal flex items-center gap-2">
            <Tag className="w-5 h-5 text-olive-600" />
            Coupons & Channel-Specific Offers
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure coupons with mode-based exclusivity (Pickup vs Delivery vs Dine-in discounts).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-olive-600 hover:bg-olive-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Mode Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setModeFilter('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            modeFilter === 'ALL'
              ? 'bg-olive-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-cream-100 border border-cream-300'
          }`}
        >
          All Offers ({coupons.length})
        </button>
        <button
          onClick={() => setModeFilter('PICKUP')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            modeFilter === 'PICKUP'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-cream-100 border border-cream-300'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Pickup Exclusive</span>
        </button>
        <button
          onClick={() => setModeFilter('DELIVERY')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            modeFilter === 'DELIVERY'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-cream-100 border border-cream-300'
          }`}
        >
          <Bike className="w-3.5 h-3.5" />
          <span>Delivery Only</span>
        </button>
        <button
          onClick={() => setModeFilter('DINE-IN')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            modeFilter === 'DINE-IN'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-cream-100 border border-cream-300'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Dine-In Special</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCoupons.map((coupon) => {
          const isActive = coupon.active !== false && coupon.isActive !== false;
          const isPercent = coupon.discountType === 'PERCENT' || (coupon.discountType as string) === 'PERCENTAGE';

          return (
            <div
              key={coupon.code}
              className={`rounded-2xl border bg-white p-5 shadow-xs flex flex-col justify-between transition-all ${
                isActive ? 'border-cream-300' : 'border-stone-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono font-black text-base tracking-wider px-2.5 py-1 rounded-xl bg-olive-100 text-olive-800 border border-olive-200 shadow-2xs">
                    {coupon.code}
                  </span>
                  {getModeBadge(coupon.applicableMode)}
                </div>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-black text-syzlo-charcoal">
                    {isPercent ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}
                  </span>
                  {coupon.maxDiscount && (
                    <span className="text-xs text-stone-500 font-semibold">
                      (Up to ₹{coupon.maxDiscount})
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{coupon.description}</p>

                <div className="mt-3 py-2 px-3 rounded-xl bg-cream-50 border border-cream-200 text-[11px] font-semibold text-stone-600 flex items-center justify-between">
                  <span>Min Cart Value:</span>
                  <span className="font-bold text-syzlo-charcoal">₹{coupon.minOrder}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-cream-200 flex items-center justify-between">
                <button
                  onClick={() => toggleCouponStatus(coupon.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {isActive ? 'Pause Code' : 'Activate Code'}
                </button>

                <button
                  onClick={() => deleteCoupon(coupon.code)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-cream-300">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h3 className="font-black text-lg text-syzlo-charcoal">Create New Coupon</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Coupon Promo Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. PICKUP30, WEEKEND50"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 font-mono text-sm font-bold uppercase focus:ring-2 focus:ring-olive-500/20"
                  required
                />
              </div>

              {/* Mode Exclusive Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Applicable Order Channel / Mode
                </label>
                <select
                  value={applicableMode}
                  onChange={(e) => setApplicableMode(e.target.value as CouponApplicableMode)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-semibold focus:ring-2 focus:ring-olive-500/20 bg-cream-50"
                >
                  <option value="ALL">All Modes (Delivery, Pickup, Dine-in)</option>
                  <option value="PICKUP">Pickup Exclusive (Only valid when customer selects Pickup)</option>
                  <option value="DELIVERY">Delivery Only (Only valid for home delivery)</option>
                  <option value="DINE-IN">Dine-In Only (Table orders)</option>
                </select>
                <p className="text-[10px] text-stone-500 mt-1">
                  Enforces channel restriction so pickup customers get specific discounts as requested!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'PERCENT' | 'FIXED')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Value ({discountType === 'PERCENT' ? '%' : '₹'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Min Cart Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    disabled={discountType === 'FIXED'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20 disabled:bg-stone-100 disabled:text-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Marketing Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                  required
                />
              </div>

              <div className="pt-4 border-t border-cream-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-cream-300 text-xs font-bold text-stone-600 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-olive-600 hover:bg-olive-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
