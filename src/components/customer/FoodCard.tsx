import React from 'react';
import { MenuItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Minus, Plus } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const {
    cart,
    updateCartQuantity,
    setCustomizingItem,
    addToCart,
  } = useApp();

  const cartEntries = cart.filter(
    (ci) => ci.menuItem.id === item.id
  );

  const totalQuantity = cartEntries.reduce(
    (sum, ci) => sum + ci.quantity,
    0
  );

  const hasAddOns = Boolean(
    item.addOns && item.addOns.length > 0
  );

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!item.isAvailable) return;

    if (hasAddOns) {
      setCustomizingItem(item);
    } else {
      addToCart(item, 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!item.isAvailable) return;

    if (hasAddOns) {
      setCustomizingItem(item);
      return;
    }

    if (cartEntries.length > 0) {
      const target = cartEntries[0];

      updateCartQuantity(
        target.cartItemId,
        target.quantity + 1
      );
    } else {
      addToCart(item, 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (cartEntries.length === 0) return;

    const target = cartEntries[cartEntries.length - 1];

    updateCartQuantity(
      target.cartItemId,
      target.quantity - 1
    );
  };

  return (
    <div
      id={`food-card-${item.id}`}
      className="group relative flex flex-col justify-between bg-white rounded-2xl border border-cream-200/80 hover:border-[#565F28]/40 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="relative w-full aspect-4/3 overflow-hidden bg-cream-100">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
        />

        <div className="absolute top-2.5 right-2.5 z-10">
          <div
            className={`w-4 h-4 rounded-xs border-2 bg-white flex items-center justify-center p-0.5 shadow-xs ${
              item.isVeg
                ? 'border-emerald-600'
                : 'border-red-600'
            }`}
            title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                item.isVeg
                  ? 'bg-emerald-600'
                  : 'bg-red-600'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-stone-900 line-clamp-1 group-hover:text-[#4A5320] transition-colors">
            {item.name}
          </h3>

          <p className="mt-0.5 text-xs text-stone-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="mt-2.5 pt-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
              ₹{item.price}
            </span>

            {hasAddOns && (
              <span className="text-[10px] font-semibold text-stone-400">
                Customizable
              </span>
            )}
          </div>

          {totalQuantity === 0 ? (
            <div className="flex justify-end">
              <button
                id={`add-btn-${item.id}`}
                type="button"
                onClick={handleAdd}
                disabled={!item.isAvailable}
                className={`min-w-20 py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                  !item.isAvailable
                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                    : 'bg-[#565F28] hover:bg-[#485022] text-white'
                }`}
              >
                {item.isAvailable ? 'Add' : 'Unavailable'}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <div className="inline-flex items-center bg-[#FAF6EE] border border-cream-300/80 rounded-xl px-1.5 py-1 text-stone-800 text-xs font-bold">
                <button
                  id={`decrease-qty-${item.id}`}
                  type="button"
                  onClick={handleDecrement}
                  className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors active:scale-95"
                  aria-label={`Decrease ${item.name} quantity`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="px-2 min-w-[28px] text-center font-extrabold text-sm text-stone-900">
                  {totalQuantity}
                </span>

                <button
                  id={`increase-qty-${item.id}`}
                  type="button"
                  onClick={handleIncrement}
                  disabled={!item.isAvailable}
                  className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors active:scale-95 disabled:opacity-40"
                  aria-label={`Increase ${item.name} quantity`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
