import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { OrderManagement } from './OrderManagement';
import { MenuManagement } from './MenuManagement';
import { HeroBannersManagement } from './HeroBannersManagement';
import { CategoryManagement } from './CategoryManagement';
import { AddonsManagement } from './AddonsManagement';
import { CouponsManagement } from './CouponsManagement';
import { PaymentGatewaysSettings } from './PaymentGatewaysSettings';
import { OsmLocationSettings } from './OsmLocationSettings';
import { BrandLogoSettings } from './BrandLogoSettings';
import { StaffRiderManagement } from './StaffRiderManagement';
import { ReportsAnalytics } from './ReportsAnalytics';
import {
  LayoutDashboard,
   ArrowLeft,
  ShoppingBag,
  Utensils,
  Layers,
  FolderTree,
  Tag,
  CreditCard,
  Globe,
  Store,
  Users,
  BarChart3,
  Menu as MenuIcon,
  X,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export type AdminTabId =
  | 'overview'
  | 'orders'
  | 'banners'
  | 'categories'
  | 'menu'
  | 'addons'
  | 'coupons'
  | 'gateways'
  | 'map-osm'
  | 'brand'
  | 'staff'
  | 'reports';

interface AdminLayoutProps {
  onBack?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBack }) => {
  const { brandConfig, orders } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');
  const [isMenuBarOpen, setIsMenuBarOpen] = useState(false);

  // Grouped Menu Bar List Items
  const menuSections = [
    {
      group: 'Core Operations',
      items: [
        {
          id: 'overview',
          label: 'Overview & Operations Dashboard',
          icon: <LayoutDashboard className="w-4 h-4 text-olive-600" />,
          desc: 'Live restaurant KPIs, alerts & pipeline',
        },
        {
          id: 'orders',
          label: 'Orders & Rider Assignment',
          icon: <ShoppingBag className="w-4 h-4 text-amber-600" />,
          desc: 'Manage orders, assign delivery riders',
          badge: orders.filter((o) => o.status === 'ORDER_PLACED').length > 0
            ? `${orders.filter((o) => o.status === 'ORDER_PLACED').length} New`
            : undefined,
        },
        {
          id: 'reports',
          label: 'Reports & Sales Analytics',
          icon: <BarChart3 className="w-4 h-4 text-emerald-600" />,
          desc: 'Revenue, order breakdown, channel share',
        },
      ],
    },
    {
      group: 'Content & Customer App',
      items: [
        {
          id: 'banners',
          label: 'Hero Banners (Top Carousel)',
          icon: <Layers className="w-4 h-4 text-indigo-600" />,
          desc: 'Upload hero banners, custom copy & discounts',
        },
        {
          id: 'categories',
          label: 'Categories & Photo Uploads',
          icon: <FolderTree className="w-4 h-4 text-teal-600" />,
          desc: 'Upload category cover pictures and badges',
        },
        {
          id: 'menu',
          label: 'Food Menu & Dish Catalog',
          icon: <Utensils className="w-4 h-4 text-rose-600" />,
          desc: 'Pricing, descriptions, availability toggle',
        },
        {
          id: 'addons',
          label: 'Add-ons & Modifiers Manager',
          icon: <SlidersHorizontal className="w-4 h-4 text-orange-600" />,
          desc: 'Sauces, extra dips, fillings & crunch',
        },
        {
          id: 'coupons',
          label: 'Mode-Specific Coupons (Pickup / Delivery)',
          icon: <Tag className="w-4 h-4 text-purple-600" />,
          desc: 'Create discount codes with channel rules',
        },
      ],
    },
    {
      group: 'Settings & Integrations',
      items: [
        {
          id: 'gateways',
          label: 'Payment Gateways (Razorpay, Cashfree, UPI)',
          icon: <CreditCard className="w-4 h-4 text-blue-600" />,
          desc: 'Configure API keys, webhooks & test mode',
        },
        {
          id: 'map-osm',
          label: 'OpenStreetMap (OSM) & Free Location',
          icon: <Globe className="w-4 h-4 text-emerald-600" />,
          desc: 'Kitchen coordinates, radius & map compliance',
        },
        {
          id: 'brand',
          label: 'Brand Identity & Logo Upload',
          icon: <Store className="w-4 h-4 text-amber-700" />,
          desc: 'Upload brand logo, FSSAI & GSTIN info',
        },
        {
          id: 'staff',
          label: 'Staff Roster & Rider Fleet',
          icon: <Users className="w-4 h-4 text-stone-600" />,
          desc: 'Fleet availability, shift tracking & phones',
        },
      ],
    },
  ];

  const handleSelectMenuItem = (id: AdminTabId) => {
    setActiveTab(id);
    // Requirement: When clicked, immediately close the menu bar
    setIsMenuBarOpen(false);
  };

  const currentItem = menuSections
    .flatMap((s) => s.items)
    .find((i) => i.id === activeTab);

  return (
    <div className="min-h-screen bg-[#FAF6EF] p-3 sm:p-6 pb-28">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Admin Navigation Bar */}
       {onBack && (
  <button
    onClick={onBack}
    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-stone-700 text-sm font-bold transition-colors"
  >
    <ArrowLeft className="w-4 h-4" />
    Back
  </button>
)}
            {/* Logo from Brand Config */}
            <div className="w-10 h-10 rounded-2xl bg-olive-600 text-white flex items-center justify-center font-black shadow-md overflow-hidden shrink-0">
              {brandConfig.logoUrl ? (
                <img src={brandConfig.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <span>🥟</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg text-syzlo-charcoal">
                  {brandConfig.brandName || 'SYZLO'} Dashboard
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-olive-100 text-olive-800 text-[10px] font-black uppercase">
                  Admin
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                {currentItem?.label || 'Central Management System'}
              </p>
            </div>
          </div>

          {/* Action: Open List Menu Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuBarOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-syzlo-charcoal hover:bg-black text-white rounded-2xl text-xs font-bold transition-colors shadow-sm"
              title="Open Navigation Menu Bar"
            >
              <MenuIcon className="w-4 h-4 text-amber-400" />
              <span>Menu & Settings List</span>
            </button>
          </div>
        </div>

        {/* Quick Horizontal Scroller for Most Frequent Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-cream-100 p-1.5 rounded-2xl border border-cream-300 no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
            { id: 'orders', label: 'Orders & Riders', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
            { id: 'banners', label: 'Hero Banners', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'categories', label: 'Categories', icon: <FolderTree className="w-3.5 h-3.5" /> },
            { id: 'menu', label: 'Menu Items', icon: <Utensils className="w-3.5 h-3.5" /> },
            { id: 'addons', label: 'Add-ons', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
            { id: 'coupons', label: 'Coupons (Modes)', icon: <Tag className="w-3.5 h-3.5" /> },
            { id: 'gateways', label: 'Payment Gateways', icon: <CreditCard className="w-3.5 h-3.5" /> },
            { id: 'map-osm', label: 'OSM Map', icon: <Globe className="w-3.5 h-3.5" /> },
            { id: 'brand', label: 'Brand & Logo', icon: <Store className="w-3.5 h-3.5" /> },
            { id: 'staff', label: 'Staff & Riders', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectMenuItem(tab.id as AdminTabId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-olive-600 text-white shadow-xs'
                    : 'text-stone-700 hover:text-syzlo-charcoal hover:bg-cream-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab View Container */}
        <div>
          {activeTab === 'overview' && (
            <AdminDashboardOverview onNavigateTab={(t) => handleSelectMenuItem(t as AdminTabId)} />
          )}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'banners' && <HeroBannersManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'menu' && <MenuManagement />}
          {activeTab === 'addons' && <AddonsManagement />}
          {activeTab === 'coupons' && <CouponsManagement />}
          {activeTab === 'gateways' && <PaymentGatewaysSettings />}
          {activeTab === 'map-osm' && <OsmLocationSettings />}
          {activeTab === 'brand' && <BrandLogoSettings />}
          {activeTab === 'staff' && <StaffRiderManagement />}
          {activeTab === 'reports' && <ReportsAnalytics />}
        </div>
      </div>

      {/* Slide-over List Menu Bar Drawer (Closes when clicked) */}
      {isMenuBarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-cream-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-olive-600 text-white flex items-center justify-center font-bold">
                  <MenuIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-syzlo-charcoal">
                    Admin Menu Bar
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Click any item to navigate (auto-closes)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMenuBarOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-cream-200 rounded-xl transition-colors"
                title="Close Menu Bar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Menu Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {menuSections.map((section) => (
                <div key={section.group} className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 px-3">
                    {section.group}
                  </h4>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isSelected = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectMenuItem(item.id as AdminTabId)}
                          className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                            isSelected
                              ? 'bg-olive-50 border border-olive-300 text-olive-900 shadow-2xs'
                              : 'hover:bg-cream-100 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-cream-200 flex items-center justify-center shrink-0">
                              {item.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs leading-tight">
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-cream-50 border-t border-cream-200 text-center">
              <p className="text-[11px] text-stone-500 font-medium">
                {brandConfig.brandName || 'SYZLO'} Restaurant Management OS
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
