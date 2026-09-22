import React, { useState } from 'react';
import { useApp, AppView, CustomerScreen } from '../../context/AppContext';
import {
  Menu as MenuIcon,
  X,
  MapPin,
  ChevronRight,
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
              className="p-2 -ml-2 rounded-xl text-stone-800 hover:bg-stone-100 transition-colors focus:outline-hidden"
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

              {/* Search */}
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
                className="p-2 rounded-xl text-stone-800 hover:bg-stone-100 transition-colors focus:outline-hidden"
                title="Search Menu"
                aria-label="Search Menu"
              >
                <Search className="w-5 h-5 text-stone-800" />
              </button>

              {/* Cart */}
              <button
                id="header-cart-button"
                onClick={() => setCustomerScreen('cart')}
                className="p-2 rounded-xl text-stone-800 hover:bg-stone-100 transition-colors relative focus:outline-hidden"
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
            className="w-[84%] max-w-sm bg-[#7A7B26] h-full shadow-2xl flex flex-col border-r border-[#6B6C20]"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Drawer Header */}
            className="px-5 py-5 bg-[#7A7B26] border-b border-[#8D8E3D]"
              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-black tracking-tight text-[#EED7B5]">
                    {brandConfig.brandName || 'SYZLO'}
                  </h2>

                  <p className="mt-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#EED7B5]/70">
                    The Bao Makers
                  </p>
                </div>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                 className="p-2 rounded-lg text-[#EED7B5]/80 hover:bg-[#6B6C20] hover:text-[#EED7B5] transition-colors"
                  aria-label="Close menu"
                >
                  <X
                    className="w-5 h-5"
                    strokeWidth={1.8}
                  />
                </button>

              </div>
            </div>

            {/* Drawer Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-5">

              {/* Main Menu */}
              <div className="mb-6">

                <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                  Menu
                </p>

                <div className="space-y-1">

                  {/* Home */}
                  <button
                    onClick={() =>
                      handleNavigateCustomer('home')
                    }
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <House
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Home</span>
                  </button>

                  {/* My Orders */}
                  <button
                    onClick={() =>
                      handleNavigateCustomer('orders')
                    }
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <ReceiptText
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>My Orders</span>
                  </button>

                  {/* Offers */}
                  <button
                    onClick={() =>
                      handleNavigateCustomer('offers')
                    }
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <Tag
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Offers</span>
                  </button>

                  {/* Account */}
                  <button
                    onClick={() =>
                      handleNavigateCustomer('profile')
                    }
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <User
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Account</span>
                  </button>

                </div>
              </div>

              {/* Customer Section */}
              <div className="mb-6">

                <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                  Your Account
                </p>

                <div className="space-y-1">

                  {/* Favourites */}
                  <button
                    onClick={() =>
                      handleNavigateCustomer('profile')
                    }
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <Heart
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Favourites</span>
                  </button>

                  {/* Addresses */}
                  <button
                    onClick={() =>
                      handleNavigateCustomer('profile')
                    }
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <MapPin
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Addresses</span>
                  </button>

                  {/* Help */}
                  <button
                    onClick={() =>
                      handleNavigateCustomer('profile')
                    }
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <CircleHelp
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Help & Support</span>
                  </button>

                </div>
              </div>

              {/* Information / Legal */}
              <div className="mb-6">

                <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                  Information
                </p>

                <div className="space-y-1">

                  {/* Terms */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <FileText
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Terms & Conditions</span>
                  </button>

                  {/* Privacy */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <ShieldCheck
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Privacy Policy</span>
                  </button>

                  {/* Refund */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <RotateCcw
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Refund & Cancellation</span>
                  </button>

                  {/* Delivery */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <Truck
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Delivery Policy</span>
                  </button>

                  {/* Payment */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <CreditCard
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Payment Policy</span>
                  </button>

                  {/* Contact */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <Phone
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>Contact Us</span>
                  </button>

                  {/* About */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
                  >
                    <Info
                      className="w-[18px] h-[18px] text-stone-600"
                      strokeWidth={1.8}
                    />
                    <span>About SYZLO</span>
                  </button>

                </div>
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

            {/* Drawer Footer */}
            <div className="px-5 py-4 bg-white border-t border-[#E8DED0]">
              <p className="text-[10px] text-stone-400 text-center">
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
