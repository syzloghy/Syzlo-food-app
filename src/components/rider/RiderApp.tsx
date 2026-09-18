import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RESTAURANT_LOCATION } from '../../data/mockData';
import { DeliveryMap } from '../common/DeliveryMap';
import { OrderStatus } from '../../types';
import {
  Bike,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  Shield,
  DollarSign,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const RiderApp: React.FC = () => {
  const { orders, riders, updateOrderStatus, updateRiderLocation } = useApp();

  // Pick first active rider (Vikram Rathore)
  const currentRider = riders[0];

  // Find orders assigned to this rider or available delivery orders needing delivery
  const assignedOrders = orders.filter(
    (o) =>
      o.orderType === 'DELIVERY' &&
      o.status !== 'DELIVERED' &&
      o.status !== 'CANCELLED'
  );

  const activeOrder = assignedOrders[0] || null;

  const [isRiderOnline, setIsRiderOnline] = useState(true);

  // Rider action state transitions
  const handleRiderAction = (targetStatus: OrderStatus, notes?: string) => {
    if (!activeOrder) return;
    updateOrderStatus(activeOrder.id, targetStatus, notes);

    // If out for delivery or picked up, simulate rider position moving towards customer
    if (targetStatus === 'OUT_FOR_DELIVERY' && activeOrder.deliveryAddress) {
      updateRiderLocation(currentRider.id, {
        lat: 19.0620,
        lng: 72.8290,
      });
    } else if (targetStatus === 'DELIVERED') {
      updateRiderLocation(currentRider.id, {
        lat: 19.0596,
        lng: 72.8312,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] p-4 sm:p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Rider Top Profile & Status Bar */}
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-olive-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg text-syzlo-charcoal">
                  {currentRider.name}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-olive-100 text-olive-800 text-[10px] font-black uppercase">
                  {currentRider.vehicle}
                </span>
              </div>
              <span className="text-xs text-stone-500">
                ⭐ {currentRider.rating} Rating • {currentRider.completedDeliveries} Completed Trips
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Online / Offline switch */}
            <button
              onClick={() => setIsRiderOnline(!isRiderOnline)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isRiderOnline
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-200 text-stone-600 border border-stone-300'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isRiderOnline ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'
                }`}
              />
              <span>{isRiderOnline ? 'ONLINE & READY' : 'OFFLINE'}</span>
            </button>
          </div>
        </div>

        {/* Active Delivery Order Card */}
        {activeOrder ? (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-black text-olive-800 bg-olive-50 px-2.5 py-1 rounded-md border border-olive-200">
                    Active Order #{activeOrder.id}
                  </span>
                  <span className="text-xs text-stone-500 ml-2 font-semibold">
                    Payment: {activeOrder.paymentMethod} (₹{activeOrder.grandTotal})
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-olive-100 text-olive-800">
                  Current Status: {activeOrder.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Addresses Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Restaurant */}
                <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 space-y-1">
                  <span className="text-[10px] font-bold text-olive-800 uppercase tracking-wider block">
                    Pick Up From:
                  </span>
                  <h4 className="font-bold text-xs text-syzlo-charcoal">
                    {RESTAURANT_LOCATION.name} Kitchen Hub
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {RESTAURANT_LOCATION.address}
                  </p>
                  <span className="text-[11px] font-bold text-olive-700 block mt-1">
                    Phone: {RESTAURANT_LOCATION.phone}
                  </span>
                </div>

                {/* Customer */}
                <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 space-y-1">
                  <span className="text-[10px] font-bold text-olive-800 uppercase tracking-wider block">
                    Deliver To:
                  </span>
                  <h4 className="font-bold text-xs text-syzlo-charcoal">
                    {activeOrder.customerName}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {activeOrder.deliveryAddress
                      ? `${activeOrder.deliveryAddress.houseNo}, ${activeOrder.deliveryAddress.street}, ${activeOrder.deliveryAddress.areaLandmark}`
                      : 'Bandra West, Mumbai'}
                  </p>
                  <span className="text-[11px] font-bold text-olive-700 block mt-1">
                    Phone: {activeOrder.customerPhone}
                  </span>
                </div>
              </div>

              {/* Interactive Vector Route Map */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-syzlo-charcoal block">
                  Delivery Route Map
                </span>
                <DeliveryMap
                  riderCoords={currentRider.location}
                  customerCoords={
                    activeOrder.deliveryAddress
                      ? {
                          lat: activeOrder.deliveryAddress.latitude || 19.0650,
                          lng: activeOrder.deliveryAddress.longitude || 72.8270,
                        }
                      : undefined
                  }
                  heightClass="h-72"
                  statusText={`Delivery route for #${activeOrder.id}`}
                />
              </div>

              {/* Rider Action Buttons according to prompt requirement:
                  ACCEPT DELIVERY -> REACHED RESTAURANT -> PICKED UP -> OUT FOR DELIVERY -> DELIVERED */}
              <div className="pt-2 border-t border-cream-200 space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Update Delivery Progress
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Button 1: Accept Delivery */}
                  <button
                    onClick={() =>
                      handleRiderAction('RIDER_ASSIGNED', `${currentRider.name} accepted delivery`)
                    }
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                      activeOrder.status === 'READY' || activeOrder.status === 'ORDER_PLACED' || activeOrder.status === 'PREPARING'
                        ? 'bg-olive-500 text-white shadow-xs hover:bg-olive-600'
                        : 'bg-cream-100 text-stone-500'
                    }`}
                  >
                    1. ACCEPT DELIVERY
                  </button>

                  {/* Button 2: Picked up */}
                  <button
                    onClick={() =>
                      handleRiderAction('PICKED_UP', 'Package collected from kitchen')
                    }
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                      activeOrder.status === 'RIDER_ASSIGNED' || activeOrder.status === 'READY'
                        ? 'bg-amber-500 text-white shadow-xs hover:bg-amber-600'
                        : 'bg-cream-100 text-stone-500'
                    }`}
                  >
                    2. PICKED UP
                  </button>

                  {/* Button 3: Out for Delivery */}
                  <button
                    onClick={() =>
                      handleRiderAction('OUT_FOR_DELIVERY', 'Rider on the way to customer')
                    }
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                      activeOrder.status === 'PICKED_UP'
                        ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
                        : 'bg-cream-100 text-stone-500'
                    }`}
                  >
                    3. OUT FOR DELIVERY
                  </button>

                  {/* Button 4: Delivered */}
                  <button
                    onClick={() =>
                      handleRiderAction('DELIVERED', 'Delivered to customer successfully')
                    }
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                      activeOrder.status === 'OUT_FOR_DELIVERY'
                        ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                        : 'bg-cream-100 text-stone-500'
                    }`}
                  >
                    4. DELIVERED ✓
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-cream-200 text-center shadow-xs">
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto text-2xl mb-3">
              🛵
            </div>
            <h3 className="font-bold text-base text-syzlo-charcoal">
              No Pending Deliveries
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              You are currently online. When a customer orders delivery, your task will appear here with route navigation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
