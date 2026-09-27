import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChefHat,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  Check,
  Flame,
  Maximize,
  Minimize,
  Bell,
  PackageCheck,
  ClipboardList,
} from 'lucide-react';

type KDSStatus =
  | 'ORDER_PLACED'
  | 'RESTAURANT_ACCEPTED'
  | 'PREPARING'
  | 'READY';

type KDSOrder = ReturnType<
  typeof useApp
>['orders'][number];

export const KitchenDisplaySystem: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    isAudioMuted,
    toggleAudioMute,
  } = useApp();

  const [filterType, setFilterType] = useState<
    'ALL' | 'DELIVERY' | 'PICKUP' | 'DINE-IN'
  >('ALL');

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  const getStatus = (order: KDSOrder) =>
    String(order.status).toUpperCase();

  const getOrderType = (order: KDSOrder) =>
    String(order.orderType).toUpperCase();

  // Orders assigned to riders or already handed over
  // must not appear in the active kitchen queue.
  const isRiderAssigned = (order: KDSOrder) => {
    const status = getStatus(order);

    return [
      'RIDER_ASSIGNED',
      'PICKED_UP',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'COMPLETED',
      'CANCELLED',
    ].includes(status);
  };

  const matchesFilter = (order: KDSOrder) => {
    if (filterType === 'ALL') return true;

    return getOrderType(order) === filterType;
  };

  const activeOrders = orders.filter((order) => {
    const status = getStatus(order);

    return (
      [
        'ORDER_PLACED',
        'RESTAURANT_ACCEPTED',
        'PREPARING',
        'READY',
      ].includes(status) &&
      !isRiderAssigned(order) &&
      matchesFilter(order)
    );
  });

  const newOrders = activeOrders.filter(
    (order) => getStatus(order) === 'ORDER_PLACED'
  );

  const preparingOrders = activeOrders.filter((order) =>
    ['RESTAURANT_ACCEPTED', 'PREPARING'].includes(
      getStatus(order)
    )
  );

  const readyOrders = activeOrders.filter(
    (order) => getStatus(order) === 'READY'
  );

  const completedOrders = orders
    .filter((order) =>
      ['COMPLETED', 'DELIVERED'].includes(getStatus(order))
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  const getElapsedMins = (createdAt: string) => {
    const elapsed = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / 60000
    );

    return Math.max(0, elapsed);
  };

  const getTime = (createdAt: string) =>
    new Date(createdAt).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const columns: {
    title: string;
    subtitle: string;
    orders: KDSOrder[];
    color: string;
    headerColor: string;
    icon: React.ElementType;
  }[] = [
    {
      title: 'NEW ORDERS',
      subtitle: 'Waiting for acceptance',
      orders: newOrders,
      color: 'border-red-700',
      headerColor: 'bg-red-800',
      icon: ClipboardList,
    },
    {
      title: 'PREPARING',
      subtitle: 'Items are being cooked',
      orders: preparingOrders,
      color: 'border-amber-600',
      headerColor: 'bg-amber-700',
      icon: Flame,
    },
    {
      title: 'READY',
      subtitle: 'Ready for packing / handover',
      orders: readyOrders,
      color: 'border-green-700',
      headerColor: 'bg-green-800',
      icon: CheckCircle2,
    },
    {
      title: 'COMPLETED',
      subtitle: 'Latest 10 completed orders',
      orders: completedOrders,
      color: 'border-slate-700',
      headerColor: 'bg-slate-800',
      icon: PackageCheck,
    },
  ];

  const handleAccept = (order: KDSOrder) => {
    updateOrderStatus(
      order.id,
      'RESTAURANT_ACCEPTED',
      'Kitchen accepted order'
    );
  };

  const handleStartPreparing = (order: KDSOrder) => {
    updateOrderStatus(
      order.id,
      'PREPARING',
      'Cooking in progress'
    );
  };

  const handleReady = (order: KDSOrder) => {
    updateOrderStatus(
      order.id,
      'READY',
      getOrderType(order) === 'PICKUP'
        ? 'Ready at counter'
        : getOrderType(order) === 'DINE-IN'
          ? 'Ready for table'
          : 'Ready for rider pickup'
    );
  };

  return (
    <div className="min-h-screen bg-[#07151B] text-white p-3 sm:p-4 lg:p-5">
      {/* HEADER */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#20313A] bg-[#0B1C24] px-4 py-3">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-[0.12em]">
              SYZLO
            </h1>
            <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400">
              THE BAO MAKERS
            </p>
          </div>

          <div className="hidden h-10 w-px bg-slate-600 sm:block" />

          <div>
            <h2 className="text-base font-extrabold uppercase sm:text-xl">
              Kitchen Display System
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Live
              </span>

              <span className="text-slate-600">|</span>
              <span>SYZLO Guwahati</span>
              <span className="text-slate-600">|</span>

              <span>
                {currentTime.toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>

              <span className="text-slate-600">|</span>

              <span>
                {currentTime.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleAudioMute}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${
              isAudioMuted
                ? 'border-red-800 bg-red-950 text-red-300'
                : 'border-green-800 bg-green-950 text-green-300'
            }`}
          >
            {isAudioMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            )}

            {isAudioMuted ? 'Sound Off' : 'New Order Sound'}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#142832] px-3 py-2 text-xs font-bold hover:bg-[#203640]"
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </header>

      {/* FILTERS */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(
            ['ALL', 'DELIVERY', 'PICKUP', 'DINE-IN'] as const
          ).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`rounded-lg px-4 py-2 text-xs font-extrabold transition ${
                filterType === type
                  ? 'bg-[#6D8527] text-white'
                  : 'border border-[#29404A] bg-[#10232C] text-slate-300 hover:bg-[#1A333D]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          Active kitchen orders:{' '}
          <span className="font-bold text-white">
            {activeOrders.length}
          </span>
        </div>
      </div>

      {/* FOUR COLUMNS */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => {
          const ColumnIcon = column.icon;

          return (
            <section
              key={column.title}
              className={`flex min-h-[520px] flex-col overflow-hidden rounded-xl border-2 ${column.color} bg-[#10232B]`}
            >
              {/* COLUMN HEADER */}
              <div
                className={`flex items-center justify-between gap-2 px-3 py-3 ${column.headerColor}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                    <ColumnIcon className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h3 className="text-sm font-black tracking-wide">
                      {column.title} ({column.orders.length})
                    </h3>
                    <p className="text-[11px] text-white/80">
                      {column.subtitle}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-black/20 px-2.5 py-1 text-xs font-black">
                  {column.orders.length}
                </span>
              </div>

              {/* ORDER LIST */}
              <div className="flex-1 space-y-3 overflow-y-auto p-2">
                {column.orders.length === 0 ? (
                  <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-600 bg-[#142832] p-5 text-center">
                    <ColumnIcon className="mb-3 h-8 w-8 text-slate-500" />
                    <p className="text-sm font-semibold text-slate-400">
                      No orders in this queue
                    </p>
                  </div>
                ) : (
                  column.orders.map((order) => {
                    const status = getStatus(order);
                    const elapsed = getElapsedMins(order.createdAt);
                    const isCompleted = [
                      'COMPLETED',
                      'DELIVERED',
                    ].includes(status);

                    const isOverdue =
                      elapsed >= 15 && !isCompleted && status !== 'READY';

                    return (
                      <article
                        key={order.id}
                        className={`rounded-xl border-2 bg-[#F8F9FA] p-3 text-slate-900 shadow-lg ${
                          isOverdue
                            ? 'border-red-500'
                            : 'border-slate-300'
                        }`}
                      >
                        {/* ORDER TOP */}
                        <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-base font-black">
                                #{order.id}
                              </span>

                              <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                                {getOrderType(order)}
                              </span>
                            </div>

                            <p className="mt-1 text-xs font-medium text-slate-600">
                              {getOrderType(order) === 'DINE-IN'
                                ? order.dineInTable || 'Dine-in'
                                : order.customerName}
                            </p>
                          </div>

                          <div
                            className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-black ${
                              isOverdue
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            {elapsed} min
                          </div>
                        </div>

                        {/* ORDER ITEMS */}
                        <div className="space-y-2 py-3">
                          {order.items.map((item) => (
                            <div
                              key={item.cartItemId}
                              className="border-b border-slate-200 pb-2 last:border-0"
                            >
                              <div className="flex items-start gap-2 text-sm">
                                <span className="shrink-0 font-black">
                                  {item.quantity} ×
                                </span>

                                <span className="font-semibold leading-snug">
                                  {item.menuItem.name}
                                </span>
                              </div>

                              {item.selectedAddOns?.length > 0 && (
                                <p className="mt-1 pl-7 text-xs font-medium text-amber-700">
                                  +{' '}
                                  {item.selectedAddOns
                                    .map((addon) => addon.name)
                                    .join(', ')}
                                </p>
                              )}

                              {item.specialInstructions && (
                                <p className="mt-1 rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                                  Note: {item.specialInstructions}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* GENERAL INSTRUCTIONS */}
                        {order.specialInstructions && (
                          <div className="mb-3 rounded-lg bg-amber-100 p-2 text-xs font-semibold text-amber-900">
                            Special note: {order.specialInstructions}
                          </div>
                        )}

                        {/* ACTION BUTTONS */}
                        {!isCompleted && (
                          <div className="border-t border-slate-200 pt-2">
                            {status === 'ORDER_PLACED' && (
                              <button
                                type="button"
                                onClick={() => handleAccept(order)}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-700 px-3 py-3 text-sm font-black text-white hover:bg-red-800"
                              >
                                <Check className="h-5 w-5" />
                                Accept Order
                              </button>
                            )}

                            {status === 'RESTAURANT_ACCEPTED' && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStartPreparing(order)
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-3 py-3 text-sm font-black text-black hover:bg-amber-600"
                              >
                                <Flame className="h-5 w-5" />
                                Start Preparing
                              </button>
                            )}

                            {status === 'PREPARING' && (
                              <button
                                type="button"
                                onClick={() => handleReady(order)}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-3 py-3 text-sm font-black text-white hover:bg-green-800"
                              >
                                <CheckCircle2 className="h-5 w-5" />
                                Mark as Ready
                              </button>
                            )}

                            {status === 'READY' && (
                              <div className="rounded-lg border border-green-700 bg-green-50 px-3 py-3 text-center text-xs font-bold text-green-800">
                                Ready for handover / pickup
                              </div>
                            )}
                          </div>
                        )}

                        {isCompleted && (
                          <div className="flex items-center justify-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-xs font-bold text-green-800">
                            <CheckCircle2 className="h-4 w-4" />
                            Completed
                          </div>
                        )}

                        <div className="mt-2 text-right text-[10px] text-slate-500">
                          Order time: {getTime(order.createdAt)}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* FOOTER */}
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#20313A] py-3 text-xs text-slate-400">
        <span className="font-semibold">
          Good Food. Brings People Together.
        </span>

        <div className="flex flex-wrap items-center gap-5">
          <span className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Active Orders: {activeOrders.length}
          </span>

          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Live Preparation Queue
          </span>

          <span className="font-black tracking-widest text-white">
            SYZLO
          </span>
        </div>
      </footer>
    </div>
  );
};
