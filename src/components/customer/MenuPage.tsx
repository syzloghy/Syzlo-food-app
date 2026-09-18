import React from 'react';
import { useApp } from '../../context/AppContext';
import { RESTAURANT_LOCATION } from '../../data/mockData';
import { FoodCategory, OrderType } from '../../types';
import { FoodCard } from './FoodCard';
import {
  Star,
  Clock,
  MapPin,
  Sparkles,
  Percent,
  Bike,
  ShoppingBag,
  Utensils,
  ChevronRight,
} from 'lucide-react';

export const MenuPage: React.FC = () => {
  const {
    menuItems,
    selectedCategory,
    setSelectedCategory,
    orderType,
    setOrderType,
    setCustomerScreen,
    cart,
  } = useApp();

  const categories: { id: FoodCategory; label: string }[] = [
    { id: 'ALL', label: 'All Items' },
    { id: 'BAO', label: 'Artisanal Bao' },
    { id: 'COMBOS', label: 'Bao & Meal Combos' },
    { id: 'CHINESE', label: 'Wok Chinese' },
    { id: 'STARTERS', label: 'Dim Sums & Starters' },
    { id: 'DRINKS', label: 'Asian Coolers & Boba' },
  ];

  const orderTypes: { id: OrderType; label: string; icon: React.ReactNode }[] = [
    { id: 'DELIVERY', label: 'Delivery (30 mins)', icon: <Bike className="w-3.5 h-3.5" /> },
    { id: 'PICKUP', label: 'Pickup (15 mins)', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'DINE-IN', label: 'Dine-in (Table)', icon: <Utensils className="w-3.5 h-3.5" /> },
  ];

  const itemsToDisplay =
    selectedCategory === 'ALL'
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="min-h-screen pb-28 sm:pb-16 bg-[#FAF6EF]">
      {/* Restaurant Header Banner Card */}
      <div className="bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-olive-100 text-olive-800 text-[11px] font-extrabold uppercase tracking-wider">
                  Direct Kitchen
                </span>
                <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {RESTAURANT_LOCATION.openingHours}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-syzlo-charcoal tracking-tight">
                {RESTAURANT_LOCATION.name}
              </h1>

              <p className="text-xs sm:text-sm font-semibold text-olive-700 mt-1">
                "The Bao Makers" • {RESTAURANT_LOCATION.cuisine}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-stone-600 font-medium">
                <div className="flex items-center gap-1 bg-cream-100 px-2 py-1 rounded-md text-syzlo-charcoal font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{RESTAURANT_LOCATION.rating}</span>
                  <span className="text-stone-400 font-normal">(1,240+ reviews)</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-olive-600" />
                  <span>30 mins delivery time</span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-olive-600" />
                  <span>{RESTAURANT_LOCATION.address}</span>
                </div>
              </div>
            </div>

            {/* Promotional coupon preview tag */}
            <div className="bg-cream-100 p-4 rounded-2xl border border-cream-300 max-w-sm w-full">
              <div className="flex items-center gap-2 text-olive-700 font-bold text-xs uppercase tracking-wider mb-1">
                <Percent className="w-3.5 h-3.5" />
                <span>Today's Top Offer</span>
              </div>
              <p className="text-xs font-bold text-syzlo-charcoal">
                Use code <span className="bg-white px-2 py-0.5 rounded-md border border-cream-300 font-mono text-olive-700">SYZLO50</span> for 50% off up to ₹100!
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                Valid on delivery, pickup, and dine-in orders today.
              </p>
            </div>
          </div>

          {/* Mode Switcher: DELIVERY | PICKUP | DINE-IN */}
          <div className="mt-6 pt-5 border-t border-cream-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center bg-cream-100 p-1 rounded-xl border border-cream-300">
              {orderTypes.map((ot) => (
                <button
                  key={ot.id}
                  id={`menu-order-type-${ot.id.toLowerCase()}`}
                  onClick={() => setOrderType(ot.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    orderType === ot.id
                      ? 'bg-olive-500 text-white shadow-xs'
                      : 'text-stone-600 hover:text-syzlo-charcoal'
                  }`}
                >
                  {ot.icon}
                  <span>{ot.label}</span>
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-stone-500">
              Showing <span className="text-syzlo-charcoal font-bold">{itemsToDisplay.length}</span> handcrafted dishes
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Category Navigation Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-cream-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`sticky-cat-${cat.id.toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-olive-500 text-white shadow-xs'
                      : 'bg-cream-100 text-stone-600 hover:bg-cream-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {itemsToDisplay.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Sticky Cart Bar on Menu Page as well */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-18 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-8 z-30 animate-in slide-in-from-bottom-5">
          <div
            onClick={() => setCustomerScreen('cart')}
            className="w-full sm:w-88 bg-olive-500 text-white rounded-2xl p-3.5 shadow-2xl border border-olive-600 flex items-center justify-between cursor-pointer hover:bg-olive-600 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block text-cream-200">
                  {totalCartCount} {totalCartCount === 1 ? 'ITEM' : 'ITEMS'}
                </span>
                <span className="text-base font-black text-white">
                  ₹{cartSubtotal}
                </span>
              </div>
            </div>

            <button className="px-4 py-2 bg-white text-olive-700 font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5">
              <span>VIEW CART</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
