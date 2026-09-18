import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tag, Check, Copy, ArrowRight, Percent, Sparkles } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const { coupons, applyCouponCode, setCustomerScreen, orderType } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleApply = (code: string) => {
    applyCouponCode(code, orderType);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
      setCustomerScreen('home');
    }, 1200);
  };

  return (
    <div className="min-h-screen pb-28 pt-4 px-4 sm:px-6 max-w-4xl mx-auto bg-[#FAF7F2]">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE6D6] text-[#48521E] text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Asian Kitchen Deals</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Offers & Promo Codes
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Apply active discount coupons directly to save on your favorite baos, dumplings, and wok bowls.
        </p>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white rounded-2xl border border-cream-300 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top decorative badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#EDE6D6] flex items-center justify-center text-[#565F28] shrink-0">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900">{coupon.description}</h3>
                  <span className="text-[11px] text-stone-500 font-medium">
                    Min order: ₹{coupon.minOrder || coupon.minOrderAmount || 199} • Max discount: ₹{coupon.maxDiscount || 100}
                  </span>
                </div>
              </div>
            </div>

            {/* Coupon Code Strip and Button */}
            <div className="mt-5 pt-3 border-t border-dashed border-cream-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-[#FAF6EE] px-3 py-1.5 rounded-lg border border-cream-300/80 font-mono font-black text-xs text-[#48521E]">
                <Tag className="w-3.5 h-3.5 text-[#565F28]" />
                <span>{coupon.code}</span>
              </div>

              <button
                onClick={() => handleApply(coupon.code)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                  copiedCode === coupon.code
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#565F28] hover:bg-[#485022] text-white'
                }`}
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <span>Apply Code</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
