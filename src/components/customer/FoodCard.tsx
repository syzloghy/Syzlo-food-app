import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Minus, Plus, Check } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { cart, updateCartQuantity, setCustomizingItem, addToCart } = useApp();
  const [localQty, setLocalQty] = useState(1);

  // Find all cart instances of this item
  const cartEntries = cart.filter((ci) => ci.menuItem.id === item.id);
  const totalQuantity = cartEntries.reduce((sum, ci) => sum + ci.quantity, 0);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.addOns && item.addOns.length > 0) {
      setCustomizingItem(item);
    } else {
      addToCart(item, localQty);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (totalQuantity > 0) {
      if (item.addOns && item.addOns.length > 0) {
        setCustomizingItem(item);
      } else {
        updateCartQuantity(cartEntries[0].cartItemId, cartEntries[0].quantity + 1);
      }
    } else {
      setLocalQty((prev) => prev + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (totalQuantity > 0) {
      const target = cartEntries[cartEntries.length - 1];
      updateCartQuantity(target.cartItemId, target.quantity - 1);
    } else {
      setLocalQty((prev) => Math.max(1, prev - 1));
    }
  };

  const displayQuantity = totalQuantity > 0 ? totalQuantity : localQty;

  return (
    <div
      id={`food-card-${item.id}`}
      className="group relative flex flex-col justify-between bg-white rounded-2xl border border-cream-200/80 hover:border-[#565F28]/40 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Food Image Container */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-cream-100">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
        />

        {/* Top-Right: Veg / Non-Veg Indicator Icon (as in reference screenshot) */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <div
            className={`w-4 h-4 rounded-xs border-2 bg-white flex items-center justify-center p-0.5 shadow-xs ${
              item.isVeg ? 'border-emerald-600' : 'border-red-600'
            }`}
            title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Food Details Body */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-stone-900 line-clamp-1 group-hover:text-[#4A5320] transition-colors">
            {item.name}
          </h3>

          <p className="mt-0.5 text-xs text-stone-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action Button Area */}
        <div className="mt-2.5 pt-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
              ₹{item.price}
            </span>
            {item.addOns && item.addOns.length > 0 && (
              <span className="text-[10px] font-semibold text-stone-400">Customizable</span>
            )}
          </div>

          {/* Stepper and Add Button Row (matches reference image) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Stepper [- 1 +] */}
            <div className="flex items-center bg-[#FAF6EE] border border-cream-300/80 rounded-xl px-1.5 py-1 text-stone-800 text-xs font-bold shrink-0">
              <button
                id={`decrease-qty-${item.id}`}
                onClick={handleDecrement}
                className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors active:scale-95"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-1.5 min-w-[16px] text-center font-extrabold text-xs text-stone-900">
                {displayQuantity}
              </span>
              <button
                id={`increase-qty-${item.id}`}
                onClick={handleIncrement}
                className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors active:scale-95"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add Button */}
            <button
              id={`add-btn-${item.id}`}
              onClick={handleAddClick}
              disabled={!item.isAvailable}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-96 flex items-center justify-center gap-1 ${
                !item.isAvailable
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                  : totalQuantity > 0
                  ? 'bg-[#4A5320] text-white'
                  : 'bg-[#565F28] hover:bg-[#485022] text-white'
              }`}
            >
              {totalQuantity > 0 ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Added</span>
                </>
              ) : (
                <span>Add</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
