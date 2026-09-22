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
          <div className="bg-white rounded-2xl border border-[#E5DED1] p-8 shadow-[0_2px_12px_rgba(60,50,30,0.03)]">
            <h2 className="text-xl font-black tracking-tight">
              Settings
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              Business settings will be connected here.
            </p>
          </div>
        );

      case 'business':
        return (
          <div className="bg-white rounded-2xl border border-[#E5DED1] p-8 shadow-[0_2px_12px_rgba(60,50,30,0.03)]">
            <h2 className="text-xl font-black tracking-tight">
              Business Settings
            </h2>

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
    <div className="min-h-screen bg-[#F7F4ED] text-[#20221A]">

      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ======================================================
          SIDEBAR
      ======================================================= */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-50
          w-[236px]
          bg-[#F5F1E8]
          border-r border-[#E2D8C8]
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
        <div className="h-[82px] px-5 flex items-center border-b border-[#E5DCCF]">

          <div className="flex items-center gap-3 min-w-0">

            {brandConfig.logoUrl ? (
              <img
                src={brandConfig.logoUrl}
                alt="SYZLO"
                className="w-10 h-10 object-contain"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#565F28] flex items-center justify-center shadow-sm">
                <Store
                  className="w-[19px] h-[19px] text-white"
                  strokeWidth={1.8}
                />
              </div>
            )}

            <div className="min-w-0">

              <h1 className="text-[21px] leading-none font-black tracking-[0.03em]">
                {brandConfig.brandName || 'SYZLO'}
              </h1>

              <p className="mt-1.5 text-[8px] uppercase tracking-[0.22em] text-[#777466] font-bold">
                THE BAO MAKERS
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="ml-auto lg:hidden w-8 h-8 rounded-lg hover:bg-[#EAE4D9] flex items-center justify-center"
          >
            <X className="w-[18px] h-[18px]" />
          </button>

        </div>


        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-3 py-5">

          {navSections.map((section, sectionIndex) => (
            <div
              key={section.title || sectionIndex}
              className="mb-6"
            >

              {section.title && (
                <p className="px-3 mb-2.5 text-[9px] font-black tracking-[0.18em] text-[#969080]">
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
                        group
                        w-full
                        min-h-[42px]
                        flex items-center gap-3
                        px-3
                        rounded-xl
                        text-left
                        transition-all duration-150
                        ${
                          active
                            ? 'bg-[#DCDDBF] text-[#41471E] shadow-[0_1px_2px_rgba(60,55,20,0.05)]'
                            : 'text-[#55564E] hover:bg-[#EBE5D9] hover:text-[#292B23]'
                        }
                      `}
                    >

                      <span
                        className={`
                          w-8 h-8 rounded-lg
                          flex items-center justify-center
                          shrink-0
                          ${
                            active
                              ? 'bg-[#565F28] text-white'
                              : 'bg-transparent text-[#67675F] group-hover:text-[#35372F]'
                          }
                        `}
                      >
                        <Icon
                          className="w-[17px] h-[17px]"
                          strokeWidth={1.8}
                        />
                      </span>

                      <span
                        className={`
                          flex-1 text-[13px]
                          ${
                            active
                              ? 'font-bold'
                              : 'font-medium'
                          }
                        `}
                      >
                        {item.label}
                      </span>

                      {item.badge && (
                        <span className="min-w-[22px] h-[20px] px-1.5 rounded-full bg-[#C94138] text-white text-[10px] font-black flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}

                      {item.id === 'pos' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#DCE8D5] text-[#4B703D] text-[8px] font-black uppercase tracking-wide">
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
        <div className="p-4 border-t border-[#E2D8C8]">

          <div className="rounded-2xl overflow-hidden bg-[#565F28] min-h-[112px] relative">

            <div className="absolute inset-0 bg-gradient-to-br from-[#687238] via-[#565F28] to-[#3E441D]" />

            <div className="relative p-4 h-full flex flex-col justify-between">

              <div className="flex items-center justify-between">

                <span className="text-[9px] uppercase tracking-[0.15em] text-white/60 font-bold">
                  SYZLO
                </span>

                <span className="flex items-center gap-1.5 text-[9px] text-white/80 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B9D68E]" />
                  Outlet Online
                </span>

              </div>

              <p className="mt-5 text-white text-[13px] leading-[1.35] font-bold">
                Good Food.
                <br />
                Happier People.
              </p>

            </div>

          </div>

        </div>

      </aside>


      {/* ======================================================
          MAIN AREA
      ======================================================= */}
      <main className="lg:ml-[236px] min-h-screen">


        {/* TOP BAR */}
        <header className="h-[82px] bg-[#FBFAF7] border-b border-[#E5DED2] px-4 sm:px-6 lg:px-8 flex items-center">

          <div className="flex items-center gap-4 w-full">


            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
              className="lg:hidden w-9 h-9 rounded-lg hover:bg-[#EEE9E0] flex items-center justify-center"
            >
              <Menu
                className="w-[20px] h-[20px]"
                strokeWidth={1.8}
              />
            </button>


            {/* OUTLET INFORMATION */}
            <div className="hidden sm:block min-w-[210px]">

              <div className="flex items-center gap-2.5">

                <h2 className="text-[15px] font-black tracking-tight">
                  SYZLO Guwahati
                </h2>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E4EFDF] text-[#4B713E] text-[9px] font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4B8B38]" />
                  Open
                </span>

              </div>

              <p className="text-[10px] text-[#858177] mt-1.5">
                Outlet ID: SYZ-GHY-001
                <span className="mx-2 text-[#C4BBAE]">|</span>
                Guwahati, Assam
              </p>

            </div>


            {/* SEARCH */}
            <div className="hidden md:flex flex-1 max-w-[430px] mx-auto">

              <div className="w-full h-[42px] bg-white border border-[#DED8CF] rounded-xl flex items-center gap-2.5 px-3.5 shadow-[0_1px_2px_rgba(50,40,20,0.02)]">

                <Search
                  className="w-[16px] h-[16px] text-[#9B968D]"
                  strokeWidth={1.8}
                />

                <span className="text-[11px] text-[#99948B]">
                  Search orders, customers, menu...
                </span>

              </div>

            </div>


            {/* RIGHT SIDE */}
            <div className="ml-auto flex items-center gap-3">


              {/* NOTIFICATIONS */}
              <button
                type="button"
                className="relative w-10 h-10 rounded-xl bg-white border border-[#E0D9CF] flex items-center justify-center hover:bg-[#F5F1E9] transition-colors"
              >

                <Bell
                  className="w-[17px] h-[17px] text-[#4F5048]"
                  strokeWidth={1.8}
                />

                {newOrderCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C94138] text-white text-[8px] font-black flex items-center justify-center border-2 border-[#FBFAF7]">
                    {newOrderCount}
                  </span>
                )}

              </button>


              {/* ADMIN PROFILE */}
              <div className="hidden sm:flex items-center gap-2.5 pl-2">

                <div className="w-9 h-9 rounded-full bg-[#565F28] text-white flex items-center justify-center font-black text-sm">
                  A
                </div>

                <div className="hidden lg:block">

                  <p className="text-[12px] font-bold leading-none">
                    Admin
                  </p>

                  <p className="text-[9px] text-[#89857D] mt-1">
                    Outlet Manager
                  </p>

                </div>

                <ChevronDown
                  className="w-[15px] h-[15px] text-[#8D897F]"
                  strokeWidth={1.8}
                />

              </div>

            </div>

          </div>

        </header>


        {/* CONTENT */}
        <div className="p-4 sm:p-5 lg:p-7 xl:p-8">

          <div className="max-w-[1380px] mx-auto">
            {renderContent()}
          </div>

        </div>

      </main>

    </div>
  );
};
