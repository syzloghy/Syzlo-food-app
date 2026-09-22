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
  ShoppingBag,
  Utensils,
  Monitor,
  Tags,
  FolderTree,
  Image,
  SlidersHorizontal,
  TicketPercent,
  Users,
  Bike,
  UserCog,
  BarChart3,
  CreditCard,
  Settings,
  Menu,
  Bell,
  Search,
  ChevronDown,
  X,
  Store,
} from 'lucide-react';

import { KitchenDisplaySystem } from '../kds/KitchenDisplaySystem';
import { PointOfSale } from '../pos/PointOfSale';

export type AdminTabId =
  | 'overview'
  | 'orders'
  | 'kitchen'
  | 'pos'
  | 'menu'
  | 'categories'
  | 'banners'
  | 'addons'
  | 'coupons'
  | 'customers'
  | 'riders'
  | 'staff'
  | 'reports'
  | 'payments'
  | 'settings'
  | 'gateways'
  | 'map-osm'
  | 'brand'
  | 'business';

interface NavItem {
  id: AdminTabId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const AdminLayout: React.FC = () => {
  const {
    brandConfig,
    orders,
    riders,
    setAdminScreen,
  } = useApp();

  const [activeTab, setActiveTab] =
    useState<AdminTabId>('overview');

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const newOrderCount = orders.filter(
    (order) =>
      order.status === 'ORDER_PLACED' ||
      order.status === 'placed'
  ).length;

  const navSections: {
    title?: string;
    items: NavItem[];
  }[] = [
    {
      items: [
        {
          id: 'overview',
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'orders',
          label: 'Orders',
          icon: ShoppingBag,
          badge:
            newOrderCount > 0
              ? String(newOrderCount)
              : undefined,
        },
        {
          id: 'kitchen',
          label: 'Kitchen / KDS',
          icon: Utensils,
        },
        {
          id: 'pos',
          label: 'POS',
          icon: Monitor,
        },
      ],
    },

    {
      title: 'CATALOG',
      items: [
        {
          id: 'menu',
          label: 'Menu',
          icon: Tags,
        },
        {
          id: 'categories',
          label: 'Categories',
          icon: FolderTree,
        },
        {
          id: 'banners',
          label: 'Banners',
          icon: Image,
        },
        {
          id: 'addons',
          label: 'Add-ons',
          icon: SlidersHorizontal,
        },
        {
          id: 'coupons',
          label: 'Coupons',
          icon: TicketPercent,
        },
      ],
    },

    {
      title: 'PEOPLE',
      items: [
        {
          id: 'customers',
          label: 'Customers',
          icon: Users,
        },
        {
          id: 'riders',
          label: 'Riders',
          icon: Bike,
        },
        {
          id: 'staff',
          label: 'Staff',
          icon: UserCog,
        },
      ],
    },

    {
      title: 'FINANCE & REPORTS',
      items: [
        {
          id: 'reports',
          label: 'Reports',
          icon: BarChart3,
        },
        {
          id: 'payments',
          label: 'Payments',
          icon: CreditCard,
        },
      ],
    },

    {
      title: 'SETTINGS',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
        },
      ],
    },
  ];

  const handleNavigation = (id: AdminTabId) => {
    setActiveTab(id);
    setMobileSidebarOpen(false);

    if (id === 'overview') {
      setAdminScreen('dashboard');
    }

    if (id === 'orders') {
      setAdminScreen('orders');
    }

    if (id === 'kitchen') {
      setAdminScreen('kitchen');
    }

    if (id === 'pos') {
      setAdminScreen('pos');
    }

    if (id === 'menu') {
      setAdminScreen('menu');
    }

    if (id === 'categories') {
      setAdminScreen('categories');
    }

    if (id === 'banners') {
      setAdminScreen('banners');
    }

    if (id === 'addons') {
      setAdminScreen('addons');
    }

    if (id === 'coupons') {
      setAdminScreen('coupons');
    }

    if (id === 'riders') {
      setAdminScreen('riders');
    }

    if (id === 'staff') {
      setAdminScreen('staff');
    }

    if (id === 'reports') {
      setAdminScreen('reports');
    }

    if (id === 'gateways') {
      setAdminScreen('gateways');
    }

    if (id === 'map-osm') {
      setAdminScreen('map-osm');
    }

    if (id === 'brand') {
      setAdminScreen('brand');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrderManagement />;

      case 'kitchen':
        return <KitchenDisplaySystem />;

      case 'pos':
        return <PointOfSale />;

      case 'menu':
        return <MenuManagement />;

      case 'categories':
        return <CategoryManagement />;

      case 'banners':
        return <HeroBannersManagement />;

      case 'addons':
        return <AddonsManagement />;

      case 'coupons':
        return <CouponsManagement />;

      case 'riders':
      case 'staff':
      case 'customers':
        return <StaffRiderManagement />;

      case 'reports':
        return <ReportsAnalytics />;

      case 'payments':
      case 'gateways':
        return <PaymentGatewaysSettings />;

      case 'map-osm':
        return <OsmLocationSettings />;

      case 'brand':
        return <BrandLogoSettings />;

    case 'settings':
  return (
    <div className="bg-white rounded-xl border border-[#E6DED1] p-8">
      <h2 className="text-xl font-black">Settings</h2>
      <p className="mt-2 text-sm text-stone-500">
        Business settings will be connected here.
      </p>
    </div>
  );

case 'business':
  return (
    <div className="bg-white rounded-xl border border-[#E6DED1] p-8">
      <h2 className="text-xl font-black">Business Settings</h2>
      <p className="mt-2 text-sm text-stone-500">
        Business settings will be connected here.
      </p>
    </div>
  );

      default:
        return (
          <AdminDashboardOverview
            onNavigateTab={(tab) => {
              if (tab === 'orders') {
                handleNavigation('orders');
              }

              if (tab === 'menu') {
                handleNavigation('menu');
              }

              if (tab === 'coupons') {
                handleNavigation('coupons');
              }

              if (tab === 'reports') {
                handleNavigation('reports');
              }
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EB] text-[#20221A]">

      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ======================================================
          SIDEBAR
      ======================================================= */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-50
          w-[225px]
          bg-[#F8F4EC]
          border-r border-[#E5D8C2]
          flex flex-col
          transition-transform duration-200
          lg:translate-x-0
          ${
            mobileSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >

        {/* BRAND */}
        <div className="h-[78px] px-6 flex items-center border-b border-[#E9DDC9]">

          <div>
            <div className="flex items-center gap-2">

              {brandConfig.logoUrl ? (
                <img
                  src={brandConfig.logoUrl}
                  alt="SYZLO"
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#565F28] flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
              )}

              <div>
                <h1 className="text-xl font-black tracking-wide">
                  {brandConfig.brandName || 'SYZLO'}
                </h1>

                <p className="text-[8px] uppercase tracking-[0.22em] text-stone-500 font-bold">
                  THE BAO MAKERS
                </p>
              </div>

            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileSidebarOpen(false)
            }
            className="ml-auto lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-3 py-5">

          {navSections.map((section, sectionIndex) => (
            <div
              key={section.title || sectionIndex}
              className="mb-5"
            >

              {section.title && (
                <p className="px-3 mb-2 text-[9px] font-black tracking-[0.16em] text-stone-400">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleNavigation(item.id)
                      }
                      className={`
                        w-full
                        flex items-center gap-3
                        px-3 py-2.5
                        rounded-xl
                        text-left
                        transition-all
                        ${
                          active
                            ? 'bg-[#E7E2CE] text-[#20221A] font-bold'
                            : 'text-stone-700 hover:bg-[#EEE8DC]'
                        }
                      `}
                    >

                      <Icon
                        className={`
                          w-[18px] h-[18px]
                          shrink-0
                          ${
                            active
                              ? 'text-[#20221A]'
                              : 'text-stone-700'
                          }
                        `}
                        strokeWidth={1.8}
                      />

                      <span className="flex-1 text-sm">
                        {item.label}
                      </span>

                      {item.badge && (
                        <span className="min-w-[22px] h-[20px] px-1.5 rounded-full bg-[#D9423A] text-white text-[10px] font-black flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}

                      {item.id === 'pos' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#DDEBD4] text-[#427239] text-[9px] font-black">
                          New
                        </span>
                      )}

                    </button>
                  );
                })}

              </div>
            </div>
          ))}

        </div>

        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-[#E5D8C2]">

          <div className="rounded-2xl overflow-hidden bg-[#31351F] h-[125px] relative">

            <div className="absolute inset-0 bg-gradient-to-t from-[#263018] to-transparent" />

            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm font-black leading-tight">
                Good Food
                <br />
                More People
                <br />
                Happier Cities.
              </p>
            </div>

          </div>

        </div>

      </aside>

      {/* ======================================================
          MAIN AREA
      ======================================================= */}
      <main className="lg:ml-[225px] min-h-screen">

        {/* TOP BAR */}
        <header className="h-[78px] bg-[#FBF9F5] border-b border-[#E7DDCE] px-4 sm:px-6 lg:px-7 flex items-center">

          <div className="flex items-center gap-4 w-full">

            <button
              type="button"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
              className="lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* OUTLET */}
            <div className="hidden sm:block">

              <div className="flex items-center gap-2">

                <h2 className="text-base font-black">
                  SYZLO Guwahati
                </h2>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DFF0DD] text-[#2F7134] text-[10px] font-black">
                  <span className="w-2 h-2 rounded-full bg-[#24913A]" />
                  Open
                </span>

              </div>

              <p className="text-[11px] text-stone-500 mt-1">
                Outlet ID: SYZ-GHY-001
                <span className="mx-2">|</span>
                Guwahati, Assam
              </p>

            </div>

            {/* SEARCH */}
            <div className="hidden md:flex flex-1 max-w-[390px] mx-auto">

              <div className="w-full h-10 bg-white border border-[#DED8CF] rounded-xl flex items-center gap-2 px-3">

                <Search className="w-4 h-4 text-stone-400" />

                <span className="text-xs text-stone-400">
                  Search orders, customers, menu...
                </span>

              </div>

            </div>

            {/* RIGHT */}
            <div className="ml-auto flex items-center gap-4">

              <button
                type="button"
                className="relative w-9 h-9 rounded-full bg-white border border-[#E0D8CC] flex items-center justify-center"
              >
                <Bell className="w-4 h-4" />

                {newOrderCount > 0 && (
                  <span className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-[#D9423A] text-white text-[9px] font-black flex items-center justify-center">
                    {newOrderCount}
                  </span>
                )}

              </button>

              <div className="hidden sm:flex items-center gap-2">

                <div className="w-9 h-9 rounded-full bg-[#5E5C2B] text-white flex items-center justify-center font-black">
                  A
                </div>

                <div className="hidden md:block">
                  <p className="text-sm font-bold">
                    Admin
                  </p>

                  <p className="text-[10px] text-stone-500">
                    Outlet Manager
                  </p>
                </div>

                <ChevronDown className="w-4 h-4 text-stone-500" />

              </div>

            </div>

          </div>

        </header>

        {/* CONTENT */}
        <div className="p-4 sm:p-5 lg:p-6 xl:p-7">

          <div className="max-w-[1320px] mx-auto">
            {renderContent()}
          </div>

        </div>

      </main>

    </div>
  );
};
