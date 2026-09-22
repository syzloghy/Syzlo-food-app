import React, { useState } from 'react';
import { useApp, AppView, CustomerScreen } from '../../context/AppContext';
import {
  Menu as MenuIcon,
  X,
  MapPin,
  House,
  ReceiptText,
  Tag,
  User,
  Heart,
  CircleHelp,
  FileText,
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard,
  Phone,
  Info,
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

  const [selectedAddrLabel, setSelectedAddrLabel] = useState(
    'Home - Bandra West'
  );

  const [mapPinCoords, setMapPinCoords] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: osmConfig.centerLat + 0.005,
    lng: osmConfig.centerLng + 0.004,
  });

  const totalCartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  const activeOrder = orders.find(
    (o) =>
      o.status !== 'DELIVERED' &&
      o.status !== 'CANCELLED'
  );

  const handleNavigateCustomer = (
    screen: CustomerScreen
  ) => {
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
      {/* =========================================================
          CUSTOMER HEADER
      ========================================================= */}
      {currentView === 'customer' && (
        <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADFCF] transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 sm:h-16 flex items-center justify-between">

            {/* Hamburger */}
            <button
              id="main-hamburger-button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-stone-800 hover:bg-cream-200/80 transition-colors focus:outline-hidden"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <MenuIcon className="w-6 h-6 text-stone-900" />
            </button>

            {/* Brand */}
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

            {/* Search + Cart */}
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
                aria-label="Search Menu"
              >
                <Search className="w-5 h-5 text-stone-800" />
              </button>

              <button
                id="header-cart-button"
                onClick={() => setCustomerScreen('cart')}
                className="p-2 rounded-xl text-stone-800 hover:bg-cream-200/80 transition-colors relative focus:outline-hidden"
                title="View Cart"
                aria-label="View Cart"
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

      {/* =========================================================
          CUSTOMER NAVIGATION DRAWER
      ========================================================= */}
      {isSidebarOpen && currentView === 'customer' && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex justify-start"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="w-[84%] max-w-sm bg-[#FAF6EF] h-full shadow-2xl flex flex-col border-r border-cream-300"
            onClick={(e) => e.stopPropagation()}
          >

            {/* =====================================================
                OLIVE DRAWER HEADER
            ===================================================== */}
            <div className="p-5 bg-[#7A7B26] border-b border-[#696A20]">
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  {/* SYZLO Logo */}
                  <div className="w-10 h-10 rounded-xl bg-[#EED7B5] text-[#7A7B26] flex items-center justify-center font-black text-lg shadow-sm overflow-hidden">
                    {brandConfig.logoUrl ? (
                      <img
                        src={brandConfig.logoUrl}
                        alt="SYZLO Logo"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span>S</span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-black text-base text-[#EED7B5] leading-none">
                      {brandConfig.brandName || 'SYZLO'}
                    </h3>

                    <p className="text-[10px] text-[#EED7B5]/75 mt-1 uppercase tracking-[0.14em] font-semibold">
                      The Bao Makers
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-[#EED7B5]/80 hover:text-[#EED7B5] hover:bg-[#696A20] rounded-xl transition-colors"
                  title="Close Menu"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>
            </div>

            {/* =====================================================
                DRAWER CONTENT — REMAINS LIGHT
            ===================================================== */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

              {/* Main Menu */}
              <div className="space-y-1.5">

                <div className="flex items-center justify-between px-3 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
                    Menu
                  </span>

                  <span className="text-[10px] text-stone-500 font-medium">
                    SYZLO
                  </span>
                </div>

                {/* Home */}
                <button
                  onClick={() =>
                    handleNavigateCustomer('home')
                  }
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                    customerScreen === 'home' &&
                    currentView === 'customer'
                      ? 'bg-olive-600 text-white shadow-sm'
                      : 'bg-white hover:bg-cream-100 text-stone-800 border border-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <House
                      className={`w-[18px] h-[18px] ${
                        customerScreen === 'home' &&
                        currentView === 'customer'
                          ? 'text-white'
                          : 'text-stone-600'
                      }`}
                      strokeWidth={1.8}
                    />

                    <div className="text-left">
                      <span className="block font-black text-sm">
                        Home
                      </span>

                      <span
                        className={`text-[10px] font-normal ${
                          customerScreen === 'home' &&
                          currentView === 'customer'
                            ? 'text-cream-100'
                            : 'text-stone-500'
                        }`}
                      >
                        Comfort Banners, Categories & Dishes
                      </span>
                    </div>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

                {/* My Orders */}
                <button
                  onClick={() =>
                    handleNavigateCustomer('orders')
                  }
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                    customerScreen === 'orders' &&
                    currentView === 'customer'
                      ? 'bg-olive-600 text-white shadow-sm'
                      : 'bg-white hover:bg-cream-100 text-stone-800 border border-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <ReceiptText
                      className={`w-[18px] h-[18px] ${
                        customerScreen === 'orders' &&
                        currentView === 'customer'
                          ? 'text-white'
                          : 'text-stone-600'
                      }`}
                      strokeWidth={1.8}
                    />

                    <div className="text-left">
                      <span className="block font-black text-sm">
                        My Orders
                      </span>

                      <span
                        className={`text-[10px] font-normal ${
                          customerScreen === 'orders' &&
                          currentView === 'customer'
                            ? 'text-cream-100'
                            : 'text-stone-500'
                        }`}
                      >
                        View your order history
                      </span>
                    </div>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

                {/* Offers */}
                <button
                  onClick={() =>
                    handleNavigateCustomer('offers')
                  }
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                    customerScreen === 'offers' &&
                    currentView === 'customer'
                      ? 'bg-olive-600 text-white shadow-sm'
                      : 'bg-white hover:bg-cream-100 text-stone-800 border border-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <Tag
                      className={`w-[18px] h-[18px] ${
                        customerScreen === 'offers' &&
                        currentView === 'customer'
                          ? 'text-white'
                          : 'text-stone-600'
                      }`}
                      strokeWidth={1.8}
                    />

                    <div className="text-left">
                      <span className="block font-black text-sm">
                        Offers
                      </span>

                      <span
                        className={`text-[10px] font-normal ${
                          customerScreen === 'offers' &&
                          currentView === 'customer'
                            ? 'text-cream-100'
                            : 'text-stone-500'
                        }`}
                      >
                        Deals & available coupons
                      </span>
                    </div>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

                {/* Account */}
                <button
                  onClick={() =>
                    handleNavigateCustomer('profile')
                  }
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                    customerScreen === 'profile' &&
                    currentView === 'customer'
                      ? 'bg-olive-600 text-white shadow-sm'
                      : 'bg-white hover:bg-cream-100 text-stone-800 border border-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <User
                      className={`w-[18px] h-[18px] ${
                        customerScreen === 'profile' &&
                        currentView === 'customer'
                          ? 'text-white'
                          : 'text-stone-600'
                      }`}
                      strokeWidth={1.8}
                    />

                    <div className="text-left">
                      <span className="block font-black text-sm">
                        Account
                      </span>

                      <span
                        className={`text-[10px] font-normal ${
                          customerScreen === 'profile' &&
                          currentView === 'customer'
                            ? 'text-cream-100'
                            : 'text-stone-500'
                        }`}
                      >
                        Personal details & account
                      </span>
                    </div>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

              </div>

              {/* Your Account */}
              <div className="space-y-1.5">

                <div className="px-3 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
                    Your Account
                  </span>
                </div>

                {/* Favourites */}
                <button
                  onClick={() =>
                    handleNavigateCustomer('profile')
                  }
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-white hover:bg-cream-100 text-stone-800 border border-cream-200 transition-all"
                >
                  <div className="flex items-center gap-3">

                    <Heart
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />

                    <span className="font-black text-sm">
                      Favourites
                    </span>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

                {/* Addresses */}
                <button
                  onClick={() =>
                    handleNavigateCustomer('profile')
                  }
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-white hover:bg-cream-100 text-stone-800 border border-cream-200 transition-all"
                >
                  <div className="flex items-center gap-3">

                    <MapPin
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />

                    <span className="font-black text-sm">
                      Addresses
                    </span>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

                {/* Help */}
                <button
                  onClick={() =>
                    handleNavigateCustomer('profile')
                  }
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-white hover:bg-cream-100 text-stone-800 border border-cream-200 transition-all"
                >
                  <div className="flex items-center gap-3">

                    <CircleHelp
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />

                    <span className="font-black text-sm">
                      Help & Support
                    </span>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

              </div>

              {/* Information */}
              <div className="space-y-1.5">

                <div className="px-3 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
                    Information
                  </span>
                </div>

                {/* Terms */}
                <button
                  type="button"
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-white hover:bg-cream-100 text-stone-800 border border-cream-200 transition-all"
                >
                  <div className="flex items-center gap-3">

                    <FileText
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />

                    <span className="font-black text-sm">
                      Terms & Conditions
                    </span>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

                {/* Privacy */}
                <button
                  type="button"
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-white hover:bg-cream-100 text-stone-800 border border-cream-200 transition-all"
                >
                  <div className="flex items-center gap-3">

                    <ShieldCheck
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />

                    <span className="font-black text-sm">
                      Privacy Policy
                    </span>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

                {/* Refund */}
                <button
                  type="button"
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-white hover:bg-cream-100 text-stone-800 border border-cream-200 transition-all"
                >
                  <div className="flex items-center gap-3">

                    <RotateCcw
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />

                    <span className="font-black text-sm">
                      Refund & Cancellation
                    </span>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

                {/* Delivery */}
                <button
                  type="button"
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-white hover:bg-cream-100 text-stone-800 border border-cream-200 transition-all"
                >
                  <div className="flex items-center gap-3">

                    <Truck
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />

                    <span className="font-black text-sm">
                      Delivery Policy
                    </span>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

                {/* Payment */}
                <button
                  type="button"
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-white hover:bg-cream-100 text-stone-800 border border-cream-200 transition-all"
                >
                  <div className="flex items-center gap-3">

                    <CreditCard
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />

                    <span className="font-black text-sm">
                      Payment Policy
                    </span>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

                {/* Contact */}
                <button
                  type="button"
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-white hover:bg-cream-100 text-stone-800 border border-cream-200 transition-all"
                >
                  <div className="flex items-center gap-3">

                    <Phone
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />

                    <span className="font-black text-sm">
                      Contact Us
                    </span>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

                {/* About */}
                <button
                  type="button"
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-white hover:bg-cream-100 text-stone-800 border border-cream-200 transition-all"
                >
                  <div className="flex items-center gap-3">

                    <Info
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />

                    <span className="font-black text-sm">
                      About SYZLO
                    </span>

                  </div>

                  <span className="text-stone-400">
                    ›
                  </span>
                </button>

              </div>

              {/* FSSAI */}
              <div className="border-t border-[#E5DCCE] pt-5">

                <div className="flex items-center gap-3 px-2">

                  <div className="w-10 h-10 rounded-lg bg-white border border-[#DDD2C3] flex items-center justify-center">
                    <ShieldCheck
                      className="w-5 h-5 text-stone-700"
                      strokeWidth={1.6}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-stone-400">
                      Food Safety
                    </p>

                    <p className="text-xs font-semibold text-stone-700 mt-0.5">
                      FSSAI Lic. No. 20326101003500
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* =====================================================
                OLIVE DRAWER FOOTER
            ===================================================== */}
            <div className="px-5 py-4 bg-[#7A7B26] border-t border-[#696A20]">
              <p className="text-[11px] text-[#EED7B5] text-center font-semibold tracking-wide">
                {brandConfig.brandName || 'SYZLO'} · The Bao Makers
              </p>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          LOCATION MODAL
      ========================================================= */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-cream-300 shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-3">

              <h3 className="text-base font-black text-syzlo-charcoal flex items-center gap-2">
                <MapPin className="w-4 h-4 text-olive-600" />
                Select Delivery Location
              </h3>

              <button
                onClick={() =>
                  setLocationModalOpen(false)
                }
                className="p-1.5 rounded-full hover:bg-cream-200 text-stone-600 transition-colors"
                aria-label="Close location modal"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Map */}
            <div className="mb-4">

              <p className="text-xs text-stone-500 mb-2">
                Click map to pin exact drop location:
              </p>

              <OpenStreetMap
                pinCoords={mapPinCoords}
                onPinSelect={(coords) => {
                  setMapPinCoords(coords);

                  setSelectedAddrLabel(
                    `Pinned (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})`
                  );
                }}
                heightClass="h-56"
              />

            </div>

            {/* Saved Addresses */}
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">

              {customerProfile.addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddrLabel(
                      `${addr.label} - ${addr.street}`
                    );

                    setLocationModalOpen(false);
                  }}
                  className="p-3 rounded-xl border border-cream-300 hover:border-olive-500 hover:bg-olive-50/50 cursor-pointer transition-all flex items-start gap-3"
                >

                  <div className="w-8 h-8 rounded-lg bg-cream-200 flex items-center justify-center text-syzlo-charcoal font-bold text-xs shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>

                  <div className="flex-1 text-xs">

                    <span className="font-bold text-syzlo-charcoal block">
                      {addr.label}
                    </span>

                    <span className="text-stone-600 block leading-relaxed">
                      {addr.houseNo}, {addr.street},{' '}
                      {addr.areaLandmark} - {addr.pinCode}
                    </span>

                  </div>

                </div>
              ))}

            </div>

            {/* Confirm */}
            <button
              onClick={() =>
                setLocationModalOpen(false)
              }
              className="w-full py-2.5 bg-olive-600 hover:bg-olive-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Confirm Delivery Address:{' '}
              {selectedAddrLabel}
            </button>

          </div>
        </div>
      )}
    </>
  );
};
