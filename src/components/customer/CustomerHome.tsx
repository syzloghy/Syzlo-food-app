import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodCategory, HeroBanner } from '../../types';
import { FoodCard } from './FoodCard';
import { orderService } from '../../services/orderService';
import {
  Search,
  ArrowRight,
  MapPin,
  ChevronDown,
  Leaf,
  Bike,
  ChefHat,
  Heart,
  Smile,
  X,
  Check,
} from 'lucide-react';

const COMFORT_MOM_QUOTES = [
  '“AI can do everything, but it can never prepare food with love like Mom.”',
  '“No algorithms in our pots — just bubbling broths, fiery woks, and maternal warmth.”',
  '“Put your screen down and enjoy real handmade comfort.”',
  '“Handcrafted baos prepared fresh for you every single day.”',
];

export const CustomerHome: React.FC = () => {
  const {
    menuItems,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    orderType,
    setOrderType,
    setCustomerScreen,
    cart,
    heroBanners,
    categoriesConfig,
    appliedCoupon,
    brandConfig,
    customerProfile,
  } = useApp();

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Guwahati');

  // Active banners from AppContext
  const activeBanners = heroBanners.filter((b) => b.isActive !== false);

  // Auto rotate banners every 6 seconds
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % COMFORT_MOM_QUOTES.length);
    }, 8000);
    return () => clearInterval(quoteTimer);
  }, []);

  const currentBanner: HeroBanner | undefined = activeBanners[activeBannerIndex] || activeBanners[0];

  // Filter menu items based on category and search query
  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const popularItems = filteredItems.filter((item) => item.isBestseller);
  const remainingItems = filteredItems.filter((item) => !item.isBestseller);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
const getCategoryImage = (categoryId: string, fallback: string) =>
  categoriesConfig.find((category) => category.id === categoryId)?.image || fallback;
  
  // Breakdown with packaging charge
  const breakdown = orderService.calculateOrderBreakdown(
    cart,
    orderType,
    appliedCoupon,
    orderType === 'DELIVERY' ? 40 : 0,
    brandConfig
  );

  return (
    <div className="min-h-screen pb-32 sm:pb-24 bg-[#FAF7F2]">
      {/* 1. LOCATION & ORDER MODE BAR (Matches reference image syz.png) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between gap-2">
        {/* Left: Deliver to Guwahati */}
        <button
          id="location-picker-btn"
          onClick={() => setLocationModalOpen(true)}
          className="flex items-center gap-2 text-left group transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-[#EDE6D6] flex items-center justify-center text-[#565F28] shrink-0">
            <MapPin className="w-4 h-4 fill-[#565F28]/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-stone-500 font-medium leading-tight">Deliver to</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-stone-900 leading-tight">
                {selectedCity}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-600 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
        </button>

        {/* Right: Mode Toggle (Delivery vs Pickup pill) */}
        <div className="flex items-center p-1 bg-[#EDE6D6] rounded-full border border-cream-300/60">
          <button
            id="order-mode-delivery"
            onClick={() => setOrderType('DELIVERY')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              orderType === 'DELIVERY'
                ? 'bg-[#565F28] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Delivery
          </button>
          <button
            id="order-mode-pickup"
            onClick={() => setOrderType('PICKUP')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              orderType === 'PICKUP'
                ? 'bg-[#565F28] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Pickup
          </button>
        </div>
      </div>

      {/* 2. LANDSCAPE HERO BANNER FOR MOBILE & DESKTOP (Matches reference image syz.png) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2">
        <div className="relative rounded-3xl overflow-hidden bg-[#EDE6D6] border border-cream-300 shadow-xs">
          <div className="flex flex-row items-stretch min-h-[175px] sm:min-h-[220px]">
            {/* Left Content Side */}
            <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between z-10">
              <div>
                <h1 className="text-xl sm:text-3xl font-black tracking-tight text-[#48521E] uppercase leading-none sm:leading-tight">
                  GOOD<br />
                  FOOD<br />
                  EVERYDAY
                </h1>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-stone-700 font-medium max-w-[200px] sm:max-w-xs leading-snug">
                  Delicious Asian flavors, crafted fresh.
                </p>
              </div>

              <div>
                <button
                  id="hero-order-now-btn"
                  onClick={() => {
                    const elem = document.getElementById('popular-items-section');
                    elem?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-3 sm:mt-4 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#565F28] hover:bg-[#474F20] text-white font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-97 inline-flex items-center gap-1.5"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Banner Pagination Dots */}
                <div className="flex items-center gap-1.5 mt-3 sm:mt-4">
                  <span className="w-4 h-1.5 rounded-full bg-[#565F28]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#565F28]/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#565F28]/40" />
                </div>
              </div>
            </div>

            {/* Right Landscape Culinary Photo */}
            <div className="w-[45%] sm:w-[50%] relative shrink-0 overflow-hidden flex items-center justify-end">
              <img
                src={currentBanner?.imageUrl || '/src/assets/images/syzlo_hero_landscape_1789711000950.jpg'}
                alt="Delicious Hot Steaming Asian Dish"
                className="w-full h-full object-cover object-center"
              />
              {/* Soft gradient blend into the background on the left edge of image */}
              <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#EDE6D6] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEARCH BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4 text-[#565F28]" />
          </div>
          <input
            type="text"
            id="home-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Chicken Bao, Chilli Chicken, Hakka Noodles..."
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white rounded-2xl border border-cream-300 focus:outline-hidden focus:border-[#565F28] focus:ring-2 focus:ring-[#565F28]/20 text-xs sm:text-sm font-medium text-stone-800 placeholder:text-stone-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-stone-400 hover:text-stone-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

     {/* 4. CIRCULAR DISH CATEGORIES ROW */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
  <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-none">

    {/* 1. All Category */}
    <button
      onClick={() => setSelectedCategory('ALL')}
      className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-hidden"
    >
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 p-0.5 transition-all shadow-2xs ${
          selectedCategory === 'ALL'
            ? 'border-[#565F28] ring-2 ring-[#565F28]/30 scale-105'
            : 'border-cream-300 hover:border-[#565F28]/50'
        }`}
      >
        <img
src={getCategoryImage(
  'ALL',
  'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=300&q=80'
)}          alt="All Dishes"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <span
        className={`text-xs transition-colors ${
          selectedCategory === 'ALL'
            ? 'font-black text-[#48521E]'
            : 'font-semibold text-stone-700'
        }`}
      >
        All
      </span>
    </button>

    {/* 2. Bao Category */}
    <button
      onClick={() => setSelectedCategory('BAO')}
      className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-hidden"
    >
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 p-0.5 transition-all shadow-2xs ${
          selectedCategory === 'BAO'
            ? 'border-[#565F28] ring-2 ring-[#565F28]/30 scale-105'
            : 'border-cream-300 hover:border-[#565F28]/50'
        }`}
      >
        <img
          src={getCategoryImage(
            'BAO',
            'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80'
          )}
          alt="Bao"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <span
        className={`text-xs transition-colors ${
          selectedCategory === 'BAO'
            ? 'font-black text-[#48521E]'
            : 'font-semibold text-stone-700'
        }`}
      >
        Bao
      </span>
    </button>

    {/* 3. Chinese Category */}
    <button
      onClick={() => setSelectedCategory('CHINESE')}
      className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-hidden"
    >
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 p-0.5 transition-all shadow-2xs ${
          selectedCategory === 'CHINESE'
            ? 'border-[#565F28] ring-2 ring-[#565F28]/30 scale-105'
            : 'border-cream-300 hover:border-[#565F28]/50'
        }`}
      >
        <img
          src={getCategoryImage(
            'CHINESE',
            'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80'
          )}
          alt="Chinese"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <span
        className={`text-xs transition-colors ${
          selectedCategory === 'CHINESE'
            ? 'font-black text-[#48521E]'
            : 'font-semibold text-stone-700'
        }`}
      >
        Chinese
      </span>
    </button>

    {/* 4. Combos Category */}
    <button
      onClick={() => setSelectedCategory('COMBOS')}
      className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-hidden"
    >
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 p-0.5 transition-all shadow-2xs ${
          selectedCategory === 'COMBOS'
            ? 'border-[#565F28] ring-2 ring-[#565F28]/30 scale-105'
            : 'border-cream-300 hover:border-[#565F28]/50'
        }`}
      >
        <img
          src={getCategoryImage(
            'COMBOS',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80'
          )}
          alt="Combos"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <span
        className={`text-xs transition-colors ${
          selectedCategory === 'COMBOS'
            ? 'font-black text-[#48521E]'
            : 'font-semibold text-stone-700'
        }`}
      >
        Combos
      </span>
    </button>

    {/* 5. Drinks Category */}
    <button
      onClick={() => setSelectedCategory('DRINKS')}
      className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-hidden"
    >
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 p-0.5 transition-all shadow-2xs ${
          selectedCategory === 'DRINKS'
            ? 'border-[#565F28] ring-2 ring-[#565F28]/30 scale-105'
            : 'border-cream-300 hover:border-[#565F28]/50'
        }`}
      >
        <img
          src={getCategoryImage(
            'DRINKS',
            'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80'
          )}
          alt="Drinks"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <span
        className={`text-xs transition-colors ${
          selectedCategory === 'DRINKS'
            ? 'font-black text-[#48521E]'
            : 'font-semibold text-stone-700'
        }`}
      >
        Drinks
      </span>
      </button>

    {/* 6. Starters Category */}
    <button
      onClick={() => setSelectedCategory('STARTERS')}
      className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-hidden"
    >
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 p-0.5 transition-all shadow-2xs ${
          selectedCategory === 'STARTERS'
            ? 'border-[#565F28] ring-2 ring-[#565F28]/30 scale-105'
            : 'border-cream-300 hover:border-[#565F28]/50'
        }`}
      >
        <img
          src={getCategoryImage(
            'STARTERS',
            'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80'
          )}
          alt="Starters"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <span
        className={`text-xs transition-colors ${
          selectedCategory === 'STARTERS'
            ? 'font-black text-[#48521E]'
            : 'font-semibold text-stone-700'
        }`}
      >
        Starters
      </span>
    </button>
  </div>
</div>

      {/* 5. POPULAR ITEMS 2-COLUMN GRID (Matches reference image syz.png) */}
      <div id="popular-items-section" className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
            Popular Items
          </h2>
          <button
            onClick={() => setCustomerScreen('menu')}
            className="text-xs font-bold text-[#565F28] hover:text-[#434B1D] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2-Column Mobile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {popularItems.slice(0, 4).map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>

        {/* Remaining / Filtered Items if searching or selected specific category */}
        {(selectedCategory !== 'ALL' || searchQuery || popularItems.length === 0) && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black text-stone-900">
                {selectedCategory === 'ALL' ? 'All Offerings' : `${selectedCategory} Specials`}
              </h3>
              <span className="text-xs text-stone-500">{filteredItems.length} items</span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-cream-200 shadow-xs">
                <div className="text-3xl mb-2">🥟</div>
                <h4 className="text-sm font-bold text-stone-800">No dishes match your search</h4>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-[#565F28] text-white text-xs font-bold"
                >
                  Show All Items
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredItems.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6. TRUST BADGES / BRAND VALUES (Matches reference image syz.png) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          {/* Fresh Ingredients */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#EDE6D6] flex items-center justify-center text-[#565F28] mb-1.5 shadow-2xs">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-stone-700 leading-tight">
              Fresh<br />Ingredients
            </span>
          </div>

          {/* Fast Delivery */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#EDE6D6] flex items-center justify-center text-[#565F28] mb-1.5 shadow-2xs">
              <Bike className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-stone-700 leading-tight">
              Fast<br />Delivery
            </span>
          </div>

          {/* Authentic Flavors */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#EDE6D6] flex items-center justify-center text-[#565F28] mb-1.5 shadow-2xs">
              <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-stone-700 leading-tight">
              Authentic<br />Flavors
            </span>
          </div>

          {/* Loved by Customers */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#EDE6D6] flex items-center justify-center text-[#565F28] mb-1.5 shadow-2xs">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-stone-700 leading-tight">
              Loved by<br />Customers
            </span>
          </div>
        </div>
      </div>

      {/* 7. COMFORTING KITCHEN PHILOSOPHY BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-2">
        <div className="bg-[#FAF6EE] border border-cream-300/80 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#565F28] text-white flex items-center justify-center text-sm shadow-xs shrink-0">
              🥟
            </div>
            <p className="text-xs font-medium text-stone-700 italic">
              {COMFORT_MOM_QUOTES[quoteIndex]}
            </p>
          </div>
          <button
            onClick={() => setQuoteIndex((prev) => (prev + 1) % COMFORT_MOM_QUOTES.length)}
            className="text-[10px] font-bold text-[#565F28] hover:text-[#434B1D] px-2 py-1 rounded-lg bg-cream-200/60 transition-colors shrink-0"
          >
            Next
          </button>
        </div>
      </div>

      {/* 8. FLOATING CART PILL */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 max-w-lg mx-auto z-40 animate-slideUp">
          <div className="bg-[#1F2218] text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl border border-stone-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#565F28] text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                {totalCartCount}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm sm:text-base text-white">
                    {brandConfig.currencySymbol}{breakdown.grandTotal}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    ({totalCartCount} {totalCartCount === 1 ? 'item' : 'items'})
                  </span>
                </div>
                <div className="text-[10px] text-stone-400">
                  <span>{orderType === 'DELIVERY' ? 'Doorstep Delivery' : 'Direct Kitchen Pickup'}</span>
                </div>
              </div>
            </div>

            <button
              id="floating-cart-checkout"
              onClick={() => setCustomerScreen('cart')}
              className="px-4 py-2 rounded-xl bg-[#565F28] hover:bg-[#474F20] text-white font-bold text-xs transition-all shadow-sm active:scale-97 flex items-center gap-1 shrink-0"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* LOCATION SELECTION MODAL */}
      {locationModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLocationModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-cream-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#565F28]" />
                <h3 className="font-black text-sm text-stone-900">Choose Delivery Location</h3>
              </div>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2">
              {['Guwahati', 'GS Road, Guwahati', 'Zoo Road, Guwahati', 'Beltola, Guwahati', 'Pan Bazar, Guwahati'].map(
                (loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedCity(loc);
                      setLocationModalOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedCity === loc
                        ? 'bg-[#565F28] text-white'
                        : 'bg-cream-100 hover:bg-cream-200 text-stone-800'
                    }`}
                  >
                    <span>{loc}</span>
                    {selectedCity === loc && <Check className="w-4 h-4" />}
                  </button>
                )
              )}
            </div>

            <p className="text-[11px] text-stone-400 text-center">
              Delivering hot Asian baos and wok bowls across Guwahati
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
