import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { orderService } from '../../services/orderService';
import { CouponApplicableMode, OrderType } from '../../types';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Bike,
  UtensilsCrossed,
  Info,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    orderType,
    setOrderType,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    coupons,
    setCustomerScreen,
    brandConfig,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const breakdown = orderService.calculateOrderBreakdown(cart, orderType, appliedCoupon, 40);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;

    const res = applyCouponCode(code, orderType);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const getModeBadge = (mode?: CouponApplicableMode) => {
    switch (mode) {
      case 'PICKUP':
        return (
          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold border border-amber-300">
            Pickup Exclusive
          </span>
        );
      case 'DELIVERY':
        return (
          <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold border border-blue-300">
            Delivery Only
          </span>
        );
      case 'DINE-IN':
        return (
          <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold border border-purple-300">
            Dine-In Only
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold">
            All Modes
          </span>
        );
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-cream-100 flex items-center justify-center text-4xl mb-4 text-stone-400 border border-cream-300">
          🥟
        </div>
        <h2 className="text-xl font-extrabold text-syzlo-charcoal">Your cart is empty</h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xs leading-relaxed">
          Good food is always cooking at {brandConfig.brandName || 'SYZLO'}. Explore our fluffy baos, combos and wok noodles!
        </p>
        <button
          id="explore-menu-btn"
          onClick={() => setCustomerScreen('menu')}
          className="mt-6 px-6 py-3 bg-olive-500 hover:bg-olive-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center gap-2"
        >
          <span>BROWSE MENU</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 sm:pb-16 bg-[#FAF6EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Navigation back */}
        <button
          onClick={() => setCustomerScreen('menu')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-syzlo-charcoal mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-syzlo-charcoal tracking-tight">
              Your Cart
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-olive-100 text-olive-800 text-xs font-extrabold">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} Items
            </span>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Items List Left Column */}
          <div className="lg:col-span-7 space-y-3">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded-xl object-cover border border-cream-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div
                        className={`w-3 h-3 rounded-xs border-2 bg-white flex items-center justify-center p-0.5 ${
                          item.menuItem.isVeg ? 'border-emerald-600' : 'border-red-600'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.menuItem.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        />
                      </div>
                      <h3 className="font-bold text-sm text-syzlo-charcoal">
                        {item.menuItem.name}
                      </h3>
                    </div>

                    <div className="text-xs font-black text-syzlo-charcoal">
                      ₹{item.menuItem.price}
                    </div>

                    {/* Add-ons list */}
                    {item.selectedAddOns.length > 0 && (
                      <div className="mt-1.5 space-y-0.5">
                        {item.selectedAddOns.map((addon) => (
                          <div
                            key={addon.id}
                            className="text-[11px] text-stone-500 font-medium flex items-center gap-1"
                          >
                            <span>+ {addon.name}</span>
                            <span className="text-stone-400 font-semibold">(₹{addon.price})</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <div className="mt-1 text-[11px] italic text-stone-500">
                        Note: "{item.specialInstructions}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Item Total */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="font-black text-sm text-syzlo-charcoal">
                    ₹{item.totalPrice}
                  </span>

                  <div className="flex items-center gap-2 bg-cream-100 rounded-xl p-1 border border-cream-300">
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-stone-700 hover:bg-cream-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs w-4 text-center text-syzlo-charcoal">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-stone-700 hover:bg-cream-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Order Type Fulfillment Selector */}
            <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs space-y-2">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider block">
                Fulfillment Mode
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['DELIVERY', 'PICKUP', 'DINE-IN'] as OrderType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setOrderType(type);
                      // If coupon was applied, re-verify with new orderType
                      if (appliedCoupon) {
                        applyCouponCode(appliedCoupon.code, type);
                      }
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      orderType === type
                        ? 'bg-olive-500 text-white shadow-xs'
                        : 'bg-cream-100 text-stone-700 hover:bg-cream-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bill Summary & Mode Coupon Right Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Coupon Box */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cream-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-syzlo-charcoal uppercase tracking-wider mb-3">
                <Tag className="w-4 h-4 text-olive-600" />
                <span>Offers & Coupons</span>
              </div>

              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-olive-50 border border-olive-400 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-xs text-olive-800">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[10px] bg-olive-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                        APPLIED
                      </span>
                      {getModeBadge(appliedCoupon.applicableMode)}
                    </div>
                    <span className="text-xs text-stone-600 block mt-0.5">
                      {appliedCoupon.description} (Saved ₹{breakdown.discount})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-red-600 hover:text-red-700 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponFeedback(null);
                      }}
                      className="flex-1 px-3 py-2 text-xs font-mono uppercase rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      APPLY
                    </button>
                  </div>

                  {couponFeedback && (
                    <div
                      className={`mt-2 text-xs font-medium flex items-center gap-1.5 ${
                        couponFeedback.success ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {couponFeedback.success ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{couponFeedback.message}</span>
                    </div>
                  )}

                  {/* Available coupons chips with mode badge */}
                  <div className="mt-3 pt-3 border-t border-cream-100">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                      Available Coupons for {orderType}
                    </span>
                    <div className="space-y-2">
                      {coupons
                        .filter((c) => c.active !== false && c.isActive !== false)
                        .map((c) => {
                          const isMatch =
                            !c.applicableMode ||
                            c.applicableMode === 'ALL' ||
                            (c.applicableMode === 'PICKUP' && orderType === 'PICKUP') ||
                            (c.applicableMode === 'DELIVERY' && orderType === 'DELIVERY') ||
                            (c.applicableMode === 'DINE-IN' && orderType === 'DINE-IN');

                          return (
                            <div
                              key={c.code}
                              onClick={() => {
                                if (!isMatch) {
                                  setCouponFeedback({
                                    success: false,
                                    message: `This coupon requires switching to ${c.applicableMode} mode.`,
                                  });
                                  return;
                                }
                                handleApplyCoupon(c.code);
                              }}
                              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-xs ${
                                isMatch
                                  ? 'border-cream-300 hover:border-olive-500 hover:bg-olive-50/40 bg-white'
                                  : 'border-stone-200 bg-stone-50 opacity-70'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-syzlo-charcoal">
                                    {c.code}
                                  </span>
                                  {getModeBadge(c.applicableMode)}
                                </div>
                                <span className="text-[11px] text-stone-500 block mt-0.5">
                                  {c.description} (Min ₹{c.minOrder})
                                </span>
                              </div>
                              <span
                                className={`text-[11px] font-bold ${
                                  isMatch ? 'text-olive-700' : 'text-stone-400'
                                }`}
                              >
                                {isMatch ? 'Apply' : 'Switch Mode'}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bill Summary Details */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cream-200 shadow-xs space-y-3">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider block">
                Bill Summary ({orderType})
              </span>

              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-bold text-syzlo-charcoal">₹{breakdown.itemTotal}</span>
                </div>

                {breakdown.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{breakdown.discount}</span>
                  </div>
                )}

                {orderType === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee (OpenStreetMap Distance)</span>
                    <span className="font-bold text-syzlo-charcoal">₹{breakdown.deliveryFee}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Govt. GST (5%) & Eco Packaging</span>
                  <span className="font-bold text-syzlo-charcoal">₹{breakdown.tax}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-cream-200 flex justify-between items-baseline">
                <div>
                  <span className="font-extrabold text-sm text-syzlo-charcoal block">To Pay</span>
                  <span className="text-[10px] text-stone-400">Inclusive of all applicable taxes</span>
                </div>
                <span className="text-xl font-black text-syzlo-charcoal">
                  ₹{breakdown.grandTotal}
                </span>
              </div>

              <button
                id="proceed-checkout-btn"
                onClick={() => setCustomerScreen('checkout')}
                className="w-full mt-2 py-3 bg-olive-500 hover:bg-olive-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
