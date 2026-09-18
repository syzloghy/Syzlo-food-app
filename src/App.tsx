/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { CustomerHome } from './components/customer/CustomerHome';
import { MenuPage } from './components/customer/MenuPage';
import { CartPage } from './components/customer/CartPage';
import { CheckoutPage } from './components/customer/CheckoutPage';
import { OrderTracking } from './components/customer/OrderTracking';
import { CustomerOrdersList } from './components/customer/CustomerOrdersList';
import { CustomerProfile } from './components/customer/CustomerProfile';
import { OffersPage } from './components/customer/OffersPage';
import { CustomizationBottomSheet } from './components/customer/CustomizationBottomSheet';
import { AdminLayout } from './components/admin/AdminLayout';
import { KitchenDisplaySystem } from './components/kds/KitchenDisplaySystem';
import { PointOfSale } from './components/pos/PointOfSale';
import { RiderApp } from './components/rider/RiderApp';

const AppContent: React.FC = () => {
  const { currentView, customerScreen } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-syzlo-charcoal flex flex-col font-sans selection:bg-olive-500 selection:text-white">
      {/* Universal Top Navigation Header with View Switcher */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'customer' && (
          <>
            {customerScreen === 'home' && <CustomerHome />}
            {customerScreen === 'menu' && <MenuPage />}
            {customerScreen === 'cart' && <CartPage />}
            {customerScreen === 'checkout' && <CheckoutPage />}
            {customerScreen === 'tracking' && <OrderTracking />}
            {customerScreen === 'orders' && <CustomerOrdersList />}
            {customerScreen === 'profile' && <CustomerProfile />}
            {customerScreen === 'offers' && <OffersPage />}

            {/* Mobile Bottom Navigation (Visible only in customer view) */}
            <BottomNav />
          </>
        )}

        {currentView === 'admin' && <AdminLayout />}
        {currentView === 'kds' && <KitchenDisplaySystem />}
        {currentView === 'pos' && <PointOfSale />}
        {currentView === 'rider' && <RiderApp />}
      </main>

      {/* Customization Bottom Sheet Modal */}
      <CustomizationBottomSheet />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
