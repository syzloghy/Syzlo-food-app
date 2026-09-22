import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  ArrowRight,
  Banknote,
  Bike,
  Box,
  CreditCard,
  IndianRupee,
  MapPin,
  Package,
  Printer,
  ShoppingBag,
  Tag,
  TrendingUp,
  Truck,
  Utensils,
  Users,
  WalletCards,
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  onNavigateTab: (
    tab: 'orders' | 'menu' | 'coupons' | 'reports'
  ) => void;
}

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString('en-IN')}`;

const today = (value?: string) => {
  if (!value) return false;

  const d = new Date(value);
  const now = new Date();

  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

export const AdminDashboardOverview: React.FC<
  AdminDashboardOverviewProps
> = ({ onNavigateTab }) => {

  const {
    orders,
    riders,
    heroBanners,
    brandConfig,
  } = useApp();

  /*
   * IMPORTANT:
   * Demo INITIAL_ORDERS are not business transactions.
   * Only orders successfully linked to Supabase are counted.
   */
  const realOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          Boolean(order.supabaseOrderId)
      ),
    [orders]
  );

  const todayOrders = useMemo(
    () =>
      realOrders.filter((order) =>
        today(order.createdAt)
      ),
    [realOrders]
  );

  const salesOrders = todayOrders.filter(
    (order) =>
      order.status !== 'CANCELLED' &&
      order.status !== 'cancelled'
  );

  const revenue = salesOrders.reduce(
    (sum, order) =>
      sum + Number(order.grandTotal || 0),
    0
  );

  const discounts = todayOrders.reduce(
    (sum, order) =>
      sum + Number(order.discount || 0),
    0
  );

  const itemsSold = salesOrders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (itemSum, item) =>
          itemSum +
          Number(item.quantity || 0),
        0
      ),
    0
  );

  const aov =
    salesOrders.length > 0
      ? revenue / salesOrders.length
      : 0;

  const activeRiders = riders.filter(
    (rider) =>
      rider.status === 'ONLINE' ||
      rider.status === 'BUSY' ||
      rider.isAvailable
  );

  const newOrders = todayOrders.filter(
    (o) =>
      o.status === 'placed' ||
      o.status === 'ORDER_PLACED'
  ).length;

  const preparingOrders = todayOrders.filter(
    (o) =>
      o.status === 'accepted' ||
      o.status === 'RESTAURANT_ACCEPTED' ||
      o.status === 'preparing' ||
      o.status === 'PREPARING'
  ).length;

  const readyOrders = todayOrders.filter(
    (o) =>
      o.status === 'ready' ||
      o.status === 'READY'
  ).length;

  const outForDelivery = todayOrders.filter(
    (o) =>
      o.status === 'rider_assigned' ||
      o.status === 'RIDER_ASSIGNED' ||
      o.status === 'picked_up' ||
      o.status === 'PICKED_UP' ||
      o.status === 'out_for_delivery' ||
      o.status === 'OUT_FOR_DELIVERY'
  ).length;

  const deliveryCount = todayOrders.filter(
    (o) =>
      o.orderType === 'DELIVERY' ||
      o.orderType === 'delivery'
  ).length;

  const pickupCount = todayOrders.filter(
    (o) =>
      o.orderType === 'PICKUP' ||
      o.orderType === 'pickup'
  ).length;

  const dineInCount = todayOrders.filter(
    (o) =>
      o.orderType === 'DINE-IN' ||
      o.orderType === 'dine_in'
  ).length;

  const topItems = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        quantity: number;
        sales: number;
      }
    >();

    salesOrders.forEach((order) => {
      order.items.forEach((item) => {

        const id =
          item.menuItem?.id ||
          item.menuItem?.name;

        if (!id) return;

        const existing = map.get(id);

        if (existing) {
          existing.quantity += Number(
            item.quantity || 0
          );

          existing.sales += Number(
            item.totalPrice || 0
          );
        } else {
          map.set(id, {
            name:
              item.menuItem?.name ||
              'Item',
            quantity:
              Number(item.quantity || 0),
            sales:
              Number(item.totalPrice || 0),
          });
        }

      });
    });

    return Array.from(map.values())
      .sort(
        (a, b) =>
          b.quantity - a.quantity
      )
      .slice(0, 5);

  }, [salesOrders]);

  const banner =
    heroBanners.find(
      (item) => item.isActive !== false
    ) ||
    heroBanners[0];

  return (
    <div className="space-y-4">

      {/* =====================================================
          KPI ROW
      ====================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <Kpi
          icon={ShoppingBag}
          label="Total Orders"
          value={String(todayOrders.length)}
          helper="Today"
        />

        <Kpi
          icon={IndianRupee}
          label="Total Revenue"
          value={money(revenue)}
          helper="Today"
        />

        <Kpi
          icon={TrendingUp}
          label="Average Order Value"
          value={money(aov)}
          helper="Per order"
        />

        <Kpi
          icon={Bike}
          label="Active Riders"
          value={`${activeRiders.length} / ${riders.length}`}
          helper={
            activeRiders.length > 0
              ? `${activeRiders.length} available`
              : 'No active riders'
          }
        />

        <Kpi
          icon={Users}
          label="Table Occupancy"
          value="—"
          helper="Dine-in tables"
        />

      </div>

      {/* =====================================================
          HERO / STATUS / ACTIONS
      ====================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">

        {/* HERO */}
        <section className="xl:col-span-7 min-h-[215px] rounded-xl overflow-hidden relative bg-[#27291E]">

          {banner?.imageUrl && (
            <img
              src={banner.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#22241A] via-[#22241A]/80 to-transparent" />

          <div className="relative z-10 p-7 h-full flex flex-col justify-center">

            <p className="text-[10px] uppercase tracking-[0.25em] text-[#EED7B5] font-bold">
              {banner?.badge ||
                'THE BAO MAKERS'}
            </p>

            <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-white leading-tight max-w-[480px]">
              {banner?.title ||
                'Handcrafted Comfort, Always.'}
            </h2>

            <p className="mt-2 text-sm text-white/80 max-w-[420px]">
              {banner?.subtitle ||
                'Fresh buns. Real ingredients. Happier people.'}
            </p>

            <button
              type="button"
              onClick={() =>
                onNavigateTab('orders')
              }
              className="mt-5 w-fit px-4 py-2.5 rounded-lg bg-[#565F28] hover:bg-[#48501F] text-white text-xs font-bold flex items-center gap-2"
            >
              View Today's Orders
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>

        </section>

        {/* OUTLET STATUS */}
        <section className="xl:col-span-2 bg-white rounded-xl border border-[#E6DED1] p-4">

          <div className="flex items-center justify-between">

            <h3 className="text-sm font-black">
              Outlet Status
            </h3>

            <span className="px-2.5 py-1 rounded-full bg-[#DDEBD4] text-[#35733B] text-[10px] font-black">
              Pre-launch
            </span>

          </div>

          <div className="mt-5 space-y-4">

            <Status
              label="Accepting Orders"
              value="No"
            />

            <Status
              label="Kitchen Online"
              value="Yes"
            />

            <Status
              label="POS Active"
              value="Yes"
            />

            <Status
              label="Online Ordering"
              value="Ready"
            />

          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="xl:col-span-3 bg-white rounded-xl border border-[#E6DED1] p-4">

          <h3 className="text-sm font-black">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-2.5 mt-4">

            <Action
              icon={PlusIcon}
              label={
                <>
                  New Order
                  <br />
                  (POS)
                </>
              }
              onClick={() =>
                onNavigateTab('orders')
              }
            />

            <Action
              icon={Utensils}
              label={
                <>
                  Kitchen Display
                  <br />
                  (KDS)
                </>
              }
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent(
                    'syzlo-open-kds'
                  )
                )
              }
            />

            <Action
              icon={ShoppingBag}
              label="View Menu"
              onClick={() =>
                onNavigateTab('menu')
              }
            />

            <Action
              icon={Printer}
              label="Print Last Bill"
              onClick={() => {}}
            />

          </div>

        </section>

      </div>

      {/* =====================================================
          LIVE ORDERS + GLANCE
      ====================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">

        {/* LIVE ORDERS */}
        <section className="xl:col-span-8 bg-white rounded-xl border border-[#E6DED1] overflow-hidden">

          <div className="p-4 border-b border-[#EEE8DE]">

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-black">
                Live Orders
                <span className="ml-1 text-[#7A7B26]">
                  ({todayOrders.length})
                </span>
              </h3>

              <button
                type="button"
                onClick={() =>
                  onNavigateTab('orders')
                }
                className="text-xs font-bold text-[#397A35] flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </button>

            </div>

            <div className="flex gap-2 mt-3 overflow-x-auto">

              <Filter
                label={`All (${todayOrders.length})`}
                active
              />

              <Filter
                label={`New (${newOrders})`}
              />

              <Filter
                label={`Preparing (${preparingOrders})`}
              />

              <Filter
                label={`Ready (${readyOrders})`}
              />

              <Filter
                label={`Out for Delivery (${outForDelivery})`}
              />

            </div>

          </div>

          {todayOrders.length === 0 ? (
            <div className="py-12 text-center">

              <ShoppingBag className="w-8 h-8 mx-auto text-[#CFC7B8]" />

              <p className="mt-3 text-sm font-bold text-stone-500">
                No live orders yet
              </p>

              <p className="mt-1 text-xs text-stone-400">
                New orders will appear here when SYZLO starts.
              </p>

            </div>
          ) : (
            <div>
              {todayOrders.slice(0, 6).map(
                (order) => (
                  <div
                    key={order.id}
                    className="px-4 py-3 border-b border-[#F0EBE3] grid grid-cols-12 gap-3 items-center"
                  >

                    <div className="col-span-2">
                      <p className="text-xs font-black text-[#8C2019]">
                        #{order.id}
                      </p>
                    </div>

                    <div className="col-span-3">
                      <p className="text-xs font-bold">
                        {order.customerName}
                      </p>

                      <p className="text-[10px] text-stone-400">
                        {order.items.length} item
                        {order.items.length !== 1
                          ? 's'
                          : ''}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-xs">
                        {order.orderType}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <span className="px-2 py-1 rounded-full bg-[#E7F2E4] text-[#367737] text-[10px] font-bold">
                        {String(
                          order.status
                        ).replaceAll(
                          '_',
                          ' '
                        )}
                      </span>
                    </div>

                    <div className="col-span-3 text-right">
                      <p className="text-sm font-black">
                        {money(
                          Number(
                            order.grandTotal || 0
                          )
                        )}
                      </p>
                    </div>

                  </div>
                )
              )}
            </div>
          )}

        </section>

        {/* TODAY AT A GLANCE */}
        <section className="xl:col-span-4 bg-white rounded-xl border border-[#E6DED1] p-4">

          <div className="flex items-center justify-between">

            <h3 className="text-lg font-black">
              Today at a Glance
            </h3>

            <Activity className="w-5 h-5 text-[#7A7B26]" />

          </div>

          <div className="mt-5 space-y-1">

            <Glance
              label="Orders"
              value={todayOrders.length}
            />

            <Glance
              label="Revenue"
              value={money(revenue)}
            />

            <Glance
              label="Items Sold"
              value={itemsSold}
            />

            <Glance
              label="Discounts"
              value={money(discounts)}
            />

            <Glance
              label="Delivery"
              value={deliveryCount}
            />

            <Glance
              label="Pickup"
              value={pickupCount}
            />

            <Glance
              label="Dine-in"
              value={dineInCount}
            />

          </div>

          <div className="mt-5 h-20 rounded-lg bg-[#F7F3EB] flex items-center justify-center">
            <span className="text-[11px] text-stone-400">
              Sales graph will appear after the first sale
            </span>
          </div>

        </section>

      </div>

      {/* =====================================================
          BOTTOM ROW
      ====================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-3">

        {/* TOP ITEMS */}
        <section className="xl:col-span-5 bg-white rounded-xl border border-[#E6DED1] p-4">

          <div className="flex items-center justify-between">

            <h3 className="text-lg font-black">
              Top Selling Items
            </h3>

            <span className="text-xs text-stone-400">
              Today
            </span>

          </div>

          {topItems.length === 0 ? (
            <Empty
              icon={Package}
              title="No sales yet"
              text="Your best-selling items will appear here."
            />
          ) : (
            <div className="mt-4">
              {topItems.map(
                (item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 py-2.5 border-b border-[#F0EBE3]"
                  >

                    <div className="w-7 h-7 rounded-full bg-[#F4E7C8] flex items-center justify-center text-xs font-black">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-bold">
                        {item.name}
                      </p>

                      <p className="text-[10px] text-stone-400">
                        {item.quantity} sold
                      </p>
                    </div>

                    <p className="text-xs font-black">
                      {money(item.sales)}
                    </p>

                  </div>
                )
              )}
            </div>
          )}

        </section>

        {/* RIDERS */}
        <section className="xl:col-span-4 bg-white rounded-xl border border-[#E6DED1] p-4">

          <div className="flex items-center justify-between">

            <h3 className="text-lg font-black">
              Rider Status
            </h3>

            <span className="text-xs font-bold text-[#397A35]">
              View all →
            </span>

          </div>

          {riders.length === 0 ? (
            <Empty
              icon={Bike}
              title="No riders"
              text="Add riders to manage deliveries."
            />
          ) : (
            <div className="mt-4">

              {riders.slice(0, 4).map(
                (rider) => {

                  const status =
                    rider.status ===
                    'BUSY'
                      ? 'On Delivery'
                      : rider.status ===
                          'ONLINE' ||
                        rider.isAvailable
                        ? 'Available'
                        : 'Offline';

                  return (
                    <div
                      key={rider.id}
                      className="flex items-center gap-3 py-2.5 border-b border-[#F0EBE3]"
                    >

                      <div className="w-9 h-9 rounded-full bg-[#EEE8D9] flex items-center justify-center">
                        <Bike className="w-4 h-4 text-[#7A7B26]" />
                      </div>

                      <div className="flex-1">

                        <p className="text-xs font-bold">
                          {rider.name}
                        </p>

                        <p className="text-[10px] text-stone-400">
                          {rider.vehicle ||
                            'Delivery rider'}
                        </p>

                      </div>

                      <span className="px-2 py-1 rounded-full bg-[#DDEED8] text-[#397A35] text-[9px] font-bold">
                        {status}
                      </span>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* ACTIVITY */}
        <section className="xl:col-span-3 bg-white rounded-xl border border-[#E6DED1] p-4">

          <div className="flex items-center justify-between">

            <h3 className="text-lg font-black">
              Recent Activity
            </h3>

            <Activity className="w-4 h-4 text-[#7A7B26]" />

          </div>

          {todayOrders.length === 0 ? (
            <Empty
              icon={Activity}
              title="No activity"
              text="Recent order events will appear here."
            />
          ) : (
            <div className="mt-4 space-y-4">

              {todayOrders
                .slice(0, 5)
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex gap-3"
                  >

                    <div className="w-7 h-7 rounded-full bg-[#E7EBCF] flex items-center justify-center shrink-0">
                      <Box className="w-3.5 h-3.5 text-[#565F28]" />
                    </div>

                    <div>

                      <p className="text-[11px] font-bold">
                        Order received
                      </p>

                      <p className="text-[10px] text-stone-400">
                        #{order.id}
                      </p>

                    </div>

                  </div>
                ))}

            </div>
          )}

        </section>

      </div>

      {/* =====================================================
          PAYMENT SUMMARY
      ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        <Payment
          icon={WalletCards}
          label="UPI Payments"
          value={0}
        />

        <Payment
          icon={Banknote}
          label="Cash Payments"
          value={0}
        />

        <Payment
          icon={CreditCard}
          label="Online Payments"
          value={0}
        />

      </div>

    </div>
  );
};

/* ============================================================
   COMPONENTS
============================================================ */

const Kpi: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  helper: string;
}> = ({
  icon: Icon,
  label,
  value,
  helper,
}) => (
  <div
    className="
      bg-white
      rounded-2xl
      border border-[#E4DDD0]
      px-4
      py-4
      min-h-[108px]
      transition-all
      duration-150
      hover:border-[#D6CEBE]
      hover:shadow-[0_4px_18px_rgba(70,60,40,0.05)]
    "
  >
    <div className="flex items-center gap-3">

      {/* ICON */}
      <div
        className="
          w-11
          h-11
          rounded-full
          bg-[#F0EBD9]
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        <Icon
          className="w-[19px] h-[19px] text-[#565F28]"
          strokeWidth={1.8}
        />
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">

        <p className="text-[10px] font-semibold text-[#858177] leading-none">
          {label}
        </p>

        <p className="mt-2 text-[22px] leading-none font-black tracking-tight text-[#20221A] truncate">
          {value}
        </p>

        <p className="mt-2 text-[9px] font-medium text-[#A09A90]">
          {helper}
        </p>

      </div>

    </div>
  </div>
);

const Status: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => (
  <div className="flex items-center justify-between">

    <div className="flex items-center gap-2">

      <span className="w-2.5 h-2.5 rounded-full bg-[#24913A]" />

      <span className="text-xs text-stone-600">
        {label}
      </span>

    </div>

    <span className="text-xs font-bold">
      {value}
    </span>

  </div>
);

const Action: React.FC<{
  icon: React.ElementType;
  label: React.ReactNode;
  onClick: () => void;
}> = ({
  icon: Icon,
  label,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="h-[74px] rounded-xl bg-[#F3F5E8] hover:bg-[#E9ECD9] flex flex-col items-center justify-center gap-2 transition-colors"
  >
    <Icon className="w-5 h-5 text-[#20221A]" />

    <span className="text-[10px] font-bold text-center leading-tight">
      {label}
    </span>
  </button>
);

const Filter: React.FC<{
  label: string;
  active?: boolean;
}> = ({ label, active }) => (
  <span
    className={`
      px-3 py-1.5
      rounded-lg
      whitespace-nowrap
      text-[10px]
      font-bold
      ${
        active
          ? 'bg-[#565F28] text-white'
          : 'bg-[#F3F1ED] text-stone-600'
      }
    `}
  >
    {label}
  </span>
);

const Glance: React.FC<{
  label: string;
  value: string | number;
}> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between py-2.5 border-b border-[#F0EBE3] last:border-0">

    <span className="text-xs text-stone-500">
      {label}
    </span>

    <span className="text-sm font-black">
      {value}
    </span>

  </div>
);

const Payment: React.FC<{
  icon: React.ElementType;
  label: string;
  value: number;
}> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="bg-white rounded-xl border border-[#E6DED1] p-4 flex items-center gap-3">

    <div className="w-10 h-10 rounded-xl bg-[#F1EBD9] flex items-center justify-center">
      <Icon className="w-4 h-4 text-[#7A7B26]" />
    </div>

    <div>

      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
        {label}
      </p>

      <p className="text-xl font-black mt-1">
        {value}
      </p>

    </div>

  </div>
);

const Empty: React.FC<{
  icon: React.ElementType;
  title: string;
  text: string;
}> = ({
  icon: Icon,
  title,
  text,
}) => (
  <div className="py-10 text-center">

    <Icon className="w-7 h-7 mx-auto text-[#CFC7B8]" />

    <p className="mt-3 text-xs font-bold text-stone-500">
      {title}
    </p>

    <p className="mt-1 text-[10px] text-stone-400">
      {text}
    </p>

  </div>
);

const PlusIcon: React.FC<{
  className?: string;
}> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
