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

    {/* Customer Navigation Drawer */}
{isSidebarOpen && currentView === 'customer' && (
  <div
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex justify-start"
    onClick={() => setIsSidebarOpen(false)}
  >
    <div
      className="w-[84%] max-w-sm bg-[#FAF7F2] h-full shadow-2xl flex flex-col border-r border-[#E8DED0]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-5 py-5 bg-white border-b border-[#E8DED0]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-[#48521E]">
              {brandConfig.brandName || 'SYZLO'}
            </h2>

            <p className="mt-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-500">
              The Bao Makers
            </p>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5">

        {/* Main */}
        <div className="mb-6">
          <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Menu
          </p>

          <div className="space-y-1">
            <button
              onClick={() => handleNavigateCustomer('home')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
            >
              <House className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavigateCustomer('orders')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
            >
              <ReceiptText className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => handleNavigateCustomer('offers')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
            >
              <Tag className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Offers</span>
            </button>

            <button
              onClick={() => handleNavigateCustomer('profile')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
            >
              <User className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Account</span>
            </button>
          </div>
        </div>

        {/* Customer */}
        <div className="mb-6">
          <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Your Account
          </p>

          <div className="space-y-1">
            <button
              onClick={() => handleNavigateCustomer('profile')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
            >
              <Heart className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Favourites</span>
            </button>

            <button
              onClick={() => handleNavigateCustomer('profile')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
            >
              <MapPin className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Addresses</span>
            </button>

            <button
              onClick={() => handleNavigateCustomer('profile')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors"
            >
              <CircleHelp className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Help & Support</span>
            </button>
          </div>
        </div>

        {/* Legal */}
        <div className="mb-6">
          <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Information
          </p>

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors">
              <FileText className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Terms & Conditions</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors">
              <ShieldCheck className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Privacy Policy</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors">
              <RotateCcw className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Refund & Cancellation</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors">
              <Truck className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Delivery Policy</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors">
              <CreditCard className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Payment Policy</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors">
              <Phone className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
              <span>Contact Us</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-stone-800 hover:bg-white transition-colors">
              <Info className="w-[18px] h-[18px] text-stone-600" strokeWidth={1.8} />
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
  

      {/* Footer */}
      <div className="px-5 py-4 bg-white border-t border-[#E8DED0]">
        <p className="text-[10px] text-stone-400 text-center">
          {brandConfig.brandName || 'SYZLO'} · The Bao Makers
        </p>
      </div>
    </div>
  </div>
)}
