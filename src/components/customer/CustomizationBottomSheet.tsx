import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { AddOn } from '../../types';

export const CustomizationBottomSheet: React.FC = () => {
  const { customizingItem, setCustomizingItem, addToCart, globalAddons } = useApp();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  if (!customizingItem) return null;

  // Combine item-specific add-ons and active global add-ons from Admin
  const availableAddons: AddOn[] = [
    ...(customizingItem.addOns || []),
    ...globalAddons.filter(
      (ga) =>
        ga.isAvailable !== false &&
        !(customizingItem.addOns || []).some((ia) => ia.name.toLowerCase() === ga.name.toLowerCase())
    ),
  ];

  const toggleAddOn = (addon: AddOn) => {
    if (selectedAddOns.some((a) => a.id === addon.id)) {
      setSelectedAddOns((prev) => prev.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddOns((prev) => [...prev, addon]);
    }
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = customizingItem.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(customizingItem, quantity, selectedAddOns, specialInstructions);
    setCustomizingItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div
        className="absolute inset-0"
        onClick={() => setCustomizingItem(null)}
      />

      {/* Modal / Bottom Sheet Container */}
      <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        {/* Grabber indicator for mobile */}
        <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Header Bar */}
        <div className="p-4 sm:p-5 flex items-start justify-between border-b border-cream-200 shrink-0">
          <div className="flex items-center gap-3 pr-4">
            <img
              src={customizingItem.image}
              alt={customizingItem.name}
              className="w-16 h-16 rounded-2xl object-cover border border-cream-200 shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div
                  className={`w-3.5 h-3.5 rounded-xs border-2 bg-white flex items-center justify-center p-0.5 ${
                    customizingItem.isVeg ? 'border-emerald-600' : 'border-red-600'
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      customizingItem.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                    }`}
                  />
                </div>
                <span className="text-[11px] font-bold text-olive-700 uppercase tracking-wider">
                  {customizingItem.category}
                </span>
              </div>
              <h2 className="font-extrabold text-base sm:text-lg text-syzlo-charcoal leading-snug">
                {customizingItem.name}
              </h2>
              <span className="font-black text-sm text-syzlo-charcoal">
                ₹{customizingItem.price} base
              </span>
            </div>
          </div>

          <button
            onClick={() => setCustomizingItem(null)}
            className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-stone-700 flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-cream-50 p-3 rounded-xl border border-cream-200">
            {customizingItem.description}
          </p>

          {/* Add-ons Selection */}
          {availableAddons.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-syzlo-charcoal uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Choose Add-ons & Modifiers</span>
                </h4>
                <span className="text-xs text-stone-500 font-medium">Optional</span>
              </div>

              <div className="space-y-2">
                {availableAddons.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-olive-500 bg-olive-50/60 shadow-2xs'
                          : 'border-cream-200 hover:border-cream-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-olive-500 border-olive-500 text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-syzlo-charcoal">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-olive-800">
                        +₹{addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block font-bold text-sm text-syzlo-charcoal uppercase tracking-wider mb-2">
              Cooking Instructions
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less spicy, extra sauce on side, warm bao please..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20 placeholder:text-stone-400"
            />
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-sm text-syzlo-charcoal">Quantity</span>
            <div className="flex items-center bg-cream-100 border border-cream-300 rounded-xl p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white text-syzlo-charcoal hover:bg-cream-200 flex items-center justify-center font-bold transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-black text-sm text-syzlo-charcoal">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-olive-500 text-white hover:bg-olive-600 flex items-center justify-center font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Sticky Bottom Action Bar */}
        <div className="p-4 sm:p-5 bg-cream-50 border-t border-cream-200 shrink-0 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase block">Total Price</span>
            <span className="text-xl sm:text-2xl font-black text-syzlo-charcoal tracking-tight">
              ₹{totalPrice}
            </span>
          </div>

          <button
            id="add-customized-item-btn"
            onClick={handleAddToCart}
            className="flex-1 max-w-xs py-3.5 px-5 bg-olive-500 hover:bg-olive-600 text-white font-bold text-sm rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>ADD TO CART</span>
            <span>•</span>
            <span>₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
