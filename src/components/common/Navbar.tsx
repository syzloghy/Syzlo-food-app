import React, { useState } from 'react';
import { useApp, AppView, CustomerScreen } from '../../context/AppContext';
import {
  Menu as MenuIcon,
   X,
  MapPin,
  Mail,
  ChevronRight,
  ShieldCheck,
  ChefHat,
  Monitor,
  Bike,
  Lock,
  Unlock,
  KeyRound,
  Phone,
  Store,
  Sparkles,
  HeartHandshake,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { OpenStreetMap } from './OpenStreetMap';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    customerScreen,
    setCustomerScreen,
    cart,
    orders,
    brandConfig,
    osmConfig,
    customerProfile,
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedAddrLabel, setSelectedAddrLabel] = useState('Home - Bandra West');
  const [mapPinCoords, setMapPinCoords] = useState<{ lat: number; lng: number }>({
    lat: osmConfig.centerLat + 0.005,
    lng: osmConfig.centerLng + 0.004,
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const activeOrder = orders.find((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');

  const handleNavigateCustomer = (screen: CustomerScreen) => {
    setCurrentView('customer');
    setCustomerScreen(screen);
    setIsSidebarOpen(false);
  };

  const handleSwitchPortal = (view: AppView) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Clean, Relaxing Customer Header (Matches reference syz.png) */}
      {currentView === 'customer' && (
        <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADFCF] transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 sm:h-16 flex items-center justify-between">
            {/* Left: Hamburger Menu Button */}
            <button
              id="main-hamburger-button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-stone-800 hover:bg-cream-200/80 transition-colors focus:outline-hidden"
              title="Open Navigation Menu"
            >
              <MenuIcon className="w-6 h-6 text-stone-900" />
            </button>

            {/* Center: Brand Logo & Typography */}
            <div
              className="flex flex-col items-center cursor-pointer select-none group"
              onClick={() => setCustomerScreen('home')}
            >
              <span className="font-black text-xl sm:text-2xl tracking-tight text-[#48521E] uppercase leading-none">
                {brandConfig.brandName || 'SYZLO'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 tracking-wider uppercase mt-0.5">
                GOOD FOOD. EVERYDAY
              </span>
            </div>

            {/* Right: Search and Cart Icons */}
            <div className="flex items-center gap-1 sm:gap-2 -mr-2">
              <button
                id="header-search-button"
              onClick={() => {
  if (customerScreen !== 'home') {
    setCustomerScreen('home');
  }

  setTimeout(() => {
    document
      .getElementById('home-search-input')
      ?.focus();

    document
      .getElementById('home-search-input')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
  }, 50);
}}
                className="p-2 rounded-xl text-stone-800 hover:bg-cream-200/80 transition-colors focus:outline-hidden"
                title="Search Menu"
              >
                <Search className="w-5 h-5 text-stone-800" />
              </button>

              <button
                id="header-cart-button"
                onClick={() => setCustomerScreen('cart')}
                className="p-2 rounded-xl text-stone-800 hover:bg-cream-200/80 transition-colors relative focus:outline-hidden"
                title="View Cart"
              >
                <ShoppingBag className="w-5 h-5 text-stone-800" />
                {totalCartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#565F28] text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Right Slide-over Menu Bar Drawer */}
      {isSidebarOpen && (
        <div
         <div
  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-start animate-fadeIn"
  onClick={() => setIsSidebarOpen(false)}
>
        >
          <div
className="w-[82%] max-w-sm bg-[#FAF6EF] h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-r border-cream-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-cream-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-olive-600 text-white flex items-center justify-center font-black text-lg shadow-xs overflow-hidden">
                  {brandConfig.logoUrl ? (
                    <img src={brandConfig.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <span>🥟</span>
                  )}
                </div>
                <div>
                  <h3 className="font-black text-base text-syzlo-charcoal leading-none">
                    {brandConfig.brandName || 'SYZLO'}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Handmade with love like Mom</p>
                </div>
              </div>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-cream-100 rounded-xl transition-colors"
                title="Close Menu Bar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items (1. Home 2. Cart 3. Order Tracking 4. Account) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-3 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
                    Navigation Menu
                  </span>
                  <span className="text-[10px] text-olive-700 font-medium">Comfort Food</span>
                </div>

                {/* 1. Home */}
                <button
                  id="menu-nav-home"
                  onClick={() => handleNavigateCustomer('home')}
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                    customerScreen === 'home' && currentView === 'customer'
                      ? 'bg-olive-600 text-white shadow-sm'
                      : 'bg-white hover:bg-cream-100 text-stone-800 border border-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏠</span>
                    <div className="text-left">
                      <span className="block font-black text-sm">1. Home</span>
                      <span className={`text-[10px] font-normal ${customerScreen === 'home' && currentView === 'customer' ? 'text-cream-100' : 'text-stone-500'}`}>
                        Comfort Banners, Categories & Dishes
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                {/* 2. Cart */}
                <button
                  id="menu-nav-cart"
                  onClick={() => handleNavigateCustomer('cart')}
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                    customerScreen === 'cart' && currentView === 'customer'
                      ? 'bg-olive-600 text-white shadow-sm'
                      : 'bg-white hover:bg-cream-100 text-stone-800 border border-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🛍️</span>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="block font-black text-sm">2. Cart</span>
                        {totalCartCount > 0 && (
                          <span className="px-2 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black">
                            {totalCartCount} items
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-normal ${customerScreen === 'cart' && currentView === 'customer' ? 'text-cream-100' : 'text-stone-500'}`}>
                        {totalCartCount > 0 ? `Subtotal: ${brandConfig.currencySymbol}${cartSubtotal}` : 'Your meal bag is empty'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                {/* 3. Order Tracking */}
                <button
                  id="menu-nav-tracking"
                  onClick={() => handleNavigateCustomer('tracking')}
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                    customerScreen === 'tracking' && currentView === 'customer'
                      ? 'bg-olive-600 text-white shadow-sm'
                      : 'bg-white hover:bg-cream-100 text-stone-800 border border-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🛵</span>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="block font-black text-sm">3. Order Tracking</span>
                        {activeOrder && (
                          <span className="px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold animate-pulse">
                            Live Active
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-normal ${customerScreen === 'tracking' && currentView === 'customer' ? 'text-cream-100' : 'text-stone-500'}`}>
                        {activeOrder ? `Order #${activeOrder.id} • ${activeOrder.status}` : 'Track current or recent orders'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                {/* 4. Account */}
                <button
                  id="menu-nav-account"
                  onClick={() => handleNavigateCustomer('profile')}
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                    customerScreen === 'profile' && currentView === 'customer'
                      ? 'bg-olive-600 text-white shadow-sm'
                      : 'bg-white hover:bg-cream-100 text-stone-800 border border-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">👤</span>
                    <div className="text-left">
                      <span className="block font-black text-sm">4. Account</span>
                      <span className={`text-[10px] font-normal ${customerScreen === 'profile' && currentView === 'customer' ? 'text-cream-100' : 'text-stone-500'}`}>
                        Update personal details, phone & address list
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              </div>
              {/* Relaxing Comfort Quote */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center">
                <p className="text-xs font-semibold text-amber-950 leading-relaxed italic">
                  &ldquo;AI can do everything, but it still can&apos;t prepare food like Mom.&rdquo;
                </p>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mt-1">
                  Handcrafted with Soul • SYZLO
                </span>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-white border-t border-cream-200 flex items-center justify-between text-[11px] text-stone-500">
              <span>{brandConfig.brandName} v2.4</span>
              <span>OpenStreetMap & Razorpay Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-cream-300 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black text-syzlo-charcoal flex items-center gap-2">
                <MapPin className="w-4 h-4 text-olive-600" />
                Select Delivery Location (OpenStreetMap)
              </h3>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-cream-200 text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs text-stone-500 mb-2">
                Click map to pin exact drop location:
              </p>
              <OpenStreetMap
                pinCoords={mapPinCoords}
                onPinSelect={(coords) => {
                  setMapPinCoords(coords);
                  setSelectedAddrLabel(`Pinned (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})`);
                }}
                heightClass="h-56"
              />
            </div>

            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {customerProfile.addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddrLabel(`${addr.label} - ${addr.street}`);
                    setLocationModalOpen(false);
                  }}
                  className="p-3 rounded-xl border border-cream-300 hover:border-olive-500 hover:bg-olive-50/50 cursor-pointer transition-all flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-cream-200 flex items-center justify-center text-syzlo-charcoal font-bold text-xs shrink-0">
                    {addr.label === 'HOME' ? '🏠' : '🏢'}
                  </div>
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-syzlo-charcoal block">{addr.label}</span>
                    <span className="text-stone-600 block leading-relaxed">
                      {addr.houseNo}, {addr.street}, {addr.areaLandmark} - {addr.pinCode}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setLocationModalOpen(false)}
              className="w-full py-2.5 bg-olive-600 hover:bg-olive-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Confirm Delivery Address: {selectedAddrLabel}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
