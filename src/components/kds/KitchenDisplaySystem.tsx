import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import {
  ChefHat,
  Volume2,
  VolumeX,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Play,
  Check,
  Flame,
  Filter,
  PlusCircle,
} from 'lucide-react';

export const KitchenDisplaySystem: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    isAudioMuted,
    toggleAudioMute,
    placeCustomerOrder,
  } = useApp();

  const [filterType, setFilterType] = useState<'ALL' | 'DELIVERY' | 'PICKUP' | 'DINE-IN'>('ALL');

  // Filter orders relevant to kitchen
  const activeOrders = orders.filter((o) => {
    const isKitchenStage = ['ORDER_PLACED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY'].includes(o.status);
    const matchesType = filterType === 'ALL' || o.orderType === filterType;
    return isKitchenStage && matchesType;
  });

  const newOrders = activeOrders.filter((o) => o.status === 'ORDER_PLACED');
  const acceptedOrders = activeOrders.filter((o) => o.status === 'RESTAURANT_ACCEPTED');
  const preparingOrders = activeOrders.filter((o) => o.status === 'PREPARING');
  const readyOrders = activeOrders.filter((o) => o.status === 'READY');

  // Helper to calculate minutes elapsed
  const getElapsedMins = (createdAt: string) => {
    const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    return Math.max(1, diff);
  };

  // Helper to quickly inject a test kitchen order for demonstrations
  const handleQuickTestOrder = () => {
    placeCustomerOrder({
      source: 'ONLINE',
      orderType: 'DELIVERY',
      customerName: 'Live Demo Guest',
      customerPhone: '+91 99999 11111',
      specialInstructions: 'Make it extra spicy with fried garlic!',
      paymentMethod: 'UPI',
    });
  };

  const columns: {
    title: string;
    status: OrderStatus;
    orders: typeof orders;
    color: string;
    badgeColor: string;
  }[] = [
    {
      title: 'NEW INCOMING',
      status: 'ORDER_PLACED',
      orders: newOrders,
      color: 'border-amber-400 bg-amber-50/40',
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      title: 'ACCEPTED',
      status: 'RESTAURANT_ACCEPTED',
      orders: acceptedOrders,
      color: 'border-blue-400 bg-blue-50/40',
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      title: 'PREPARING ON WOK / STEAM',
      status: 'PREPARING',
      orders: preparingOrders,
      color: 'border-orange-500 bg-orange-50/40',
      badgeColor: 'bg-orange-600 text-white',
    },
    {
      title: 'READY FOR DISPATCH',
      status: 'READY',
      orders: readyOrders,
      color: 'border-emerald-400 bg-emerald-50/40',
      badgeColor: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1C14] text-white p-4 sm:p-6 pb-24">
      {/* Top KDS Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#23251A] p-4 rounded-2xl border border-[#343827] mb-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-olive-500 flex items-center justify-center text-white font-bold shadow-xs">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                SYZLO Kitchen Display System (KDS)
              </h1>
              {newOrders.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                  {newOrders.length} URGENT
                </span>
              )}
            </div>
            <p className="text-xs text-[#C8C2B3]">
              Station 1: Steamed Bao & Dim Sums • Station 2: Wok Toss & Starters
            </p>
          </div>
        </div>

        {/* Filter Pills, Sound Control & Quick Order Test */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-[#1A1C14] p-1 rounded-xl border border-[#343827]">
            {(['ALL', 'DELIVERY', 'PICKUP', 'DINE-IN'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterType === type
                    ? 'bg-olive-500 text-white shadow-xs'
                    : 'text-[#AFA898] hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={toggleAudioMute}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              isAudioMuted
                ? 'bg-red-950/60 border-red-800 text-red-300'
                : 'bg-olive-900/60 border-olive-700 text-olive-200'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-olive-400" />}
            <span>{isAudioMuted ? 'Muted' : 'Kitchen Bell: Active'}</span>
          </button>

          <button
            onClick={handleQuickTestOrder}
            className="px-3 py-1.5 rounded-xl bg-cream-200 text-[#1A1C14] hover:bg-white text-xs font-black flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Test Ticket</span>
          </button>
        </div>
      </div>

      {/* 4-Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div
            key={col.status}
            className={`rounded-2xl border-2 flex flex-col h-[calc(100vh-190px)] min-h-[500px] overflow-hidden bg-[#22251B]/90 ${col.color}`}
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-[#363A29] flex items-center justify-between bg-[#1D2016]">
              <div className="flex items-center gap-2">
                <span className="font-black text-xs tracking-wider uppercase text-white">
                  {col.title}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${col.badgeColor}`}>
                {col.orders.length}
              </span>
            </div>

            {/* Column Cards List */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {col.orders.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center text-[#7F796E] text-xs font-medium border border-dashed border-[#363A29] rounded-xl p-4">
                  <span>No tickets in this queue</span>
                </div>
              ) : (
                col.orders.map((ord) => {
                  const elapsed = getElapsedMins(ord.createdAt);
                  const isOverdue = elapsed > 15 && col.status !== 'READY';

                  return (
                    <div
                      key={ord.id}
                      className={`bg-[#2B2F21] rounded-2xl border-2 p-4 shadow-md flex flex-col justify-between transition-all ${
                        isOverdue
                          ? 'border-red-500 ring-2 ring-red-500/20'
                          : col.status === 'ORDER_PLACED'
                          ? 'border-amber-400 animate-pulse'
                          : 'border-[#3D432E]'
                      }`}
                    >
                      <div>
                        {/* Order Header Bar */}
                        <div className="flex items-start justify-between gap-2 border-b border-[#3D432E] pb-2.5 mb-2.5">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-sm font-black text-cream-200">
                                #{ord.id}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-extrabold uppercase text-[#D5CEBF]">
                                {ord.orderType}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#A69F90] block mt-0.5 font-medium">
                              {ord.orderType === 'DINE-IN'
                                ? ord.dineInTable || 'Dine-In'
                                : ord.customerName}
                            </span>
                          </div>

                          <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-black ${
                              isOverdue
                                ? 'bg-red-600 text-white animate-bounce'
                                : 'bg-[#1D2016] text-cream-300'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{elapsed}m ago</span>
                          </div>
                        </div>

                        {/* Items Checklist */}
                        <div className="space-y-2 mb-3">
                          {ord.items.map((it) => (
                            <div
                              key={it.cartItemId}
                              className="text-xs border-b border-[#363A29] pb-1.5 last:border-none"
                            >
                              <div className="flex justify-between font-bold text-white">
                                <span>
                                  <span className="text-olive-400 font-black text-sm mr-1">
                                    {it.quantity}×
                                  </span>{' '}
                                  {it.menuItem.name}
                                </span>
                              </div>

                              {it.selectedAddOns.length > 0 && (
                                <div className="text-[11px] text-amber-300 mt-0.5 pl-4">
                                  + {it.selectedAddOns.map((a) => a.name).join(', ')}
                                </div>
                              )}

                              {it.specialInstructions && (
                                <div className="text-[11px] text-red-300 bg-red-950/50 px-2 py-0.5 rounded border border-red-800/50 mt-1">
                                  ⚠️ "{it.specialInstructions}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* General Order Instructions */}
                        {ord.specialInstructions && (
                          <div className="p-2 bg-amber-950/40 border border-amber-800/60 rounded-xl text-[11px] text-amber-300 font-semibold mb-3">
                            📌 Customer Note: {ord.specialInstructions}
                          </div>
                        )}
                      </div>

                      {/* Action Control Buttons */}
                      <div className="pt-2 border-t border-[#3D432E] mt-1">
                        {ord.status === 'ORDER_PLACED' && (
                          <button
                            id={`kds-accept-btn-${ord.id}`}
                            onClick={() => updateOrderStatus(ord.id, 'RESTAURANT_ACCEPTED', 'Kitchen accepted order')}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>ACCEPT ORDER</span>
                          </button>
                        )}

                        {ord.status === 'RESTAURANT_ACCEPTED' && (
                          <button
                            id={`kds-start-btn-${ord.id}`}
                            onClick={() => updateOrderStatus(ord.id, 'PREPARING', 'Cooking in progress')}
                            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
                          >
                            <Flame className="w-4 h-4" />
                            <span>START PREPARING</span>
                          </button>
                        )}

                        {ord.status === 'PREPARING' && (
                          <button
                            id={`kds-ready-btn-${ord.id}`}
                            onClick={() =>
                              updateOrderStatus(
                                ord.id,
                                'READY',
                                ord.orderType === 'PICKUP'
                                  ? 'Ready at counter'
                                  : ord.orderType === 'DINE-IN'
                                  ? 'Ready for table'
                                  : 'Ready for rider pickup'
                              )
                            }
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>MARK AS READY</span>
                          </button>
                        )}

                        {ord.status === 'READY' && (
                          <div className="text-center py-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/40 rounded-xl border border-emerald-800">
                            ✓ Waiting for handover / rider
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
