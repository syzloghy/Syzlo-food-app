import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  ArrowRight,
  Banknote,
  Bike,
  ChevronRight,
  CircleCheck,
  Clock3,
  CreditCard,
  IndianRupee,
  LayoutDashboard,
  Package,
  Plus,
  Printer,
  ReceiptText,
  Search,
  ShoppingBag,
  Tag,
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

const formatCurrency = (value: number) =>
  `₹${Math.round(value).toLocaleString('en-IN')}`;

const isToday = (dateString?: string) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'placed':
    case 'ORDER_PLACED':
      return 'New';

    case 'accepted':
    case 'RESTAURANT_ACCEPTED':
    case 'preparing':
    case 'PREPARING':
      return 'Preparing';

    case 'ready':
    case 'READY':
      return 'Ready';

    case 'rider_assigned':
    case 'RIDER_ASSIGNED':
    case 'picked_up':
    case 'PICKED_UP':
    case 'out_for_delivery':
    case 'OUT_FOR_DELIVERY':
      return 'Out for Delivery';

    case 'delivered':
    case 'DELIVERED':
    case 'completed':
    case 'COMPLETED':
      return 'Delivered';

    case 'cancelled':
    case 'CANCELLED':
      return 'Cancelled';

    default:
      return status;
  }
};

const getOrderTypeLabel = (orderType: string) => {
  switch (orderType) {
    case 'DELIVERY':
    case 'delivery':
      return 'Delivery';

    case 'PICKUP':
    case 'pickup':
      return 'Pickup';

    case 'DINE-IN':
    case 'dine_in':
      return 'Dine-in';

    default:
      return orderType;
  }
};

export const AdminDashboardOverview: React.FC<
  AdminDashboardOverviewProps
> = ({ onNavigateTab }) => {
  const {
    orders,
    riders,
    staff,
    setAdminScreen,
  } = useApp();

  /*
   * Only orders connected to Supabase are treated as real orders.
   * This prevents INITIAL_ORDERS/demo data from appearing as
   * real business activity before SYZLO launches.
   */
  const realOrders = useMemo(
    () =>
      orders.filter(
        (order) => Boolean(order.supabaseOrderId)
      ),
    [orders]
  );

  const todayOrders = useMemo(
    () =>
      realOrders.filter((order) =>
        isToday(order.createdAt)
      ),
    [realOrders]
  );

  const activeSalesOrders = useMemo(
    () =>
      todayOrders.filter(
        (order) =>
          order.status !== 'CANCELLED' &&
          order.status !== 'cancelled'
      ),
    [todayOrders]
  );

  const todaySales = useMemo(
    () =>
      activeSalesOrders.reduce(
        (sum, order) =>
          sum + Number(order.grandTotal || 0),
        0
      ),
    [activeSalesOrders]
  );

  const todayDiscounts = useMemo(
    () =>
      todayOrders.reduce(
        (sum, order) =>
          sum + Number(order.discount || 0),
        0
      ),
    [todayOrders]
  );

  const itemsSold = useMemo(
    () =>
      activeSalesOrders.reduce(
        (sum, order) =>
          sum +
          order.items.reduce(
            (itemSum, item) =>
              itemSum + Number(item.quantity || 0),
            0
          ),
        0
      ),
    [activeSalesOrders]
  );

  const averageOrderValue =
    activeSalesOrders.length > 0
      ? todaySales / activeSalesOrders.length
      : 0;

  const activeRiders = riders.filter(
    (rider) =>
      rider.status === 'ONLINE' ||
      rider.status === 'BUSY' ||
      rider.isAvailable
  );

  const newOrders = todayOrders.filter(
    (order) =>
      order.status === 'placed' ||
      order.status === 'ORDER_PLACED'
  );

  const preparingOrders = todayOrders.filter(
    (order) =>
      order.status === 'accepted' ||
      order.status === 'RESTAURANT_ACCEPTED' ||
      order.status === 'preparing' ||
      order.status === 'PREPARING'
  );

  const readyOrders = todayOrders.filter(
    (order) =>
      order.status === 'ready' ||
      order.status === 'READY'
  );

  const deliveryOrders = todayOrders.filter(
    (order) =>
      order.status === 'rider_assigned' ||
      order.status === 'RIDER_ASSIGNED' ||
      order.status === 'picked_up' ||
      order.status === 'PICKED_UP' ||
      order.status === 'out_for_delivery' ||
      order.status === 'OUT_FOR_DELIVERY'
  );

  const deliveryCount = todayOrders.filter(
    (order) =>
      order.orderType === 'DELIVERY' ||
      order.orderType === 'delivery'
  ).length;

  const pickupCount = todayOrders.filter(
    (order) =>
      order.orderType === 'PICKUP' ||
      order.orderType === 'pickup'
  ).length;

  const dineInCount = todayOrders.filter(
    (order) =>
      order.orderType === 'DINE-IN' ||
      order.orderType === 'dine_in'
  ).length;

  const paymentCounts = {
    UPI: todayOrders.filter(
      (order) =>
        order.paymentMethod === 'UPI' ||
        order.paymentMethod === 'upi'
    ).length,

    Cash: todayOrders.filter(
      (order) =>
        order.paymentMethod === 'CASH' ||
        order.paymentMethod === 'cash'
    ).length,

    Online: todayOrders.filter(
      (order) =>
        order.paymentMethod === 'ONLINE' ||
        order.paymentMethod === 'online'
    ).length,
  };

  const topSellingItems = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        quantity: number;
        sales: number;
      }
    >();

    activeSalesOrders.forEach((order) => {
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
              'Unknown item',
            quantity: Number(
              item.quantity || 0
            ),
            sales: Number(
              item.totalPrice || 0
            ),
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
  }, [activeSalesOrders]);

  const recentOrders = [...todayOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const goToOrders = () =>
    onNavigateTab('orders');

  const goToKDS = () =>
    setAdminScreen('kitchen');

  const goToPOS = () =>
    setAdminScreen('pos');

  return (
    <div className="space-y-5">

      {/* =========================================================
          TOP HEADER
      ========================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-[#7A7B26]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7A7B26]">
              SYZLO ADMIN
            </span>
          </div>

          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-[#20221A]">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Overview & operations dashboard
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="hidden md:flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-[#E8D8BD]">
            <Search className="w-4 h-4 text-stone-400" />

            <span className="text-xs text-stone-400">
              Search orders, customers, menu...
            </span>
          </div>

          <div className="h-10 px-4 rounded-xl bg-white border border-[#E8D8BD] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-bold text-[#20221A]">
              Pre-launch
            </span>
          </div>

        </div>
      </div>

      {/* =========================================================
          KPI CARDS
      ========================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">

        <KpiCard
          label="Total Orders"
          value={todayOrders.length.toString()}
          icon={ShoppingBag}
        />

        <KpiCard
          label="Total Revenue"
          value={formatCurrency(todaySales)}
          icon={IndianRupee}
        />

        <KpiCard
          label="Average Order Value"
          value={formatCurrency(averageOrderValue)}
          icon={TrendingIcon}
        />

        <KpiCard
          label="Active Riders"
          value={`${activeRiders.length} / ${riders.length}`}
          subtitle={
            activeRiders.length > 0
              ? `${activeRiders.length} currently available`
              : 'No active riders'
          }
          icon={Bike}
        />

        <KpiCard
          label="Table Occupancy"
          value="—"
          subtitle="No table data yet"
          icon={Users}
        />

      </div>

      {/* =========================================================
          HERO + STATUS + QUICK ACTIONS
      ========================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* HERO */}
        <section className="xl:col-span-7 min-h-[220px] rounded-3xl overflow-hidden relative bg-[#252719] border border-[#D8C7A8]">

          <div className="absolute inset-0 bg-gradient-to-r from-[#20221A] via-[#2B2D20] to-[#5A492F]" />

          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-[radial-gradient(circle_at_center,_#EED7B5,_transparent_65%)]" />

          <div className="relative z-10 p-7 sm:p-9 h-full flex flex-col justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#EED7B5] font-bold">
                THE BAO MAKERS'
              </p>

              <h2 className="mt-3 max-w-md text-3xl sm:text-4xl font-black text-white leading-tight">
                Handcrafted
                <br />
                Comfort, Always.
              </h2>

              <p className="mt-3 text-sm text-white/75">
                Fresh buns. Real ingredients. Happier people.
              </p>
            </div>

            <button
              type="button"
              onClick={goToOrders}
              className="mt-6 w-fit inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7A7B26] hover:bg-[#696A20] text-white text-xs font-bold transition-colors"
            >
              View Today's Orders
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </section>

        {/* OUTLET STATUS */}
        <section className="xl:col-span-2 bg-white rounded-3xl border border-[#E8D8BD] p-5">

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#20221A]">
              Outlet Status
            </h2>

            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#F5F0E6] text-[#7A7B26]">
              PRE-LAUNCH
            </span>
          </div>

          <div className="mt-5 space-y-4">

            <StatusLine
              label="Accepting Orders"
              value="No"
            />

            <StatusLine
              label="Kitchen Online"
              value="Ready"
            />

            <StatusLine
              label="POS Active"
              value="Ready"
            />

            <StatusLine
              label="Online Ordering"
              value="Ready"
            />

          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="xl:col-span-3 bg-white rounded-3xl border border-[#E8D8BD] p-5">

          <h2 className="text-sm font-black text-[#20221A]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-2.5 mt-4">

            <QuickAction
              label="New Order"
              icon={Plus}
              onClick={goToPOS}
            />

            <QuickAction
              label="Kitchen Display"
              icon={Utensils}
              onClick={goToKDS}
            />

            <QuickAction
              label="View Menu"
              icon={ShoppingBag}
              onClick={() => onNavigateTab('menu')}
            />

            <QuickAction
              label="Print Last Bill"
              icon={Printer}
              onClick={goToPOS}
            />

          </div>
        </section>

      </div>

      {/* =========================================================
          LIVE ORDERS + TODAY GLANCE
      ========================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* LIVE ORDERS */}
        <section className="xl:col-span-8 bg-white rounded-3xl border border-[#E8D8BD] overflow-hidden">

          <div className="p-5 border-b border-[#F0E8DB]">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <h2 className="text-lg font-black text-[#20221A]">
                  Live Orders
                  <span className="ml-2 text-[#7A7B26]">
                    ({todayOrders.length})
                  </span>
                </h2>

                <p className="mt-1 text-xs text-stone-500">
                  Today's active order pipeline
                </p>
              </div>

              <button
                type="button"
                onClick={goToOrders}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#7A7B26]"
              >
                View all
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

            </div>

            <div className="flex flex-wrap gap-2 mt-4">

              <OrderFilter
                label="All"
                count={todayOrders.length}
                active
              />

              <OrderFilter
                label="New"
                count={newOrders.length}
              />

              <OrderFilter
                label="Preparing"
                count={preparingOrders.length}
              />

              <OrderFilter
                label="Ready"
                count={readyOrders.length}
              />

              <OrderFilter
                label="Delivery"
                count={deliveryOrders.length}
              />

            </div>

          </div>

          {recentOrders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="divide-y divide-[#F0E8DB]">

              {recentOrders.map((order) => (
                <LiveOrderRow
                  key={order.id}
                  order={order}
                />
              ))}

            </div>
          )}

        </section>

        {/* TODAY AT A GLANCE */}
        <section className="xl:col-span-4 bg-white rounded-3xl border border-[#E8D8BD] p-5">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-black text-[#20221A]">
                Today at a Glance
              </h2>

              <p className="mt-1 text-xs text-stone-500">
                Current business activity
              </p>
            </div>

            <Activity className="w-5 h-5 text-[#7A7B26]" />

          </div>

          <div className="mt-6">

            <GlanceRow
              label="Orders"
              value={todayOrders.length}
            />

            <GlanceRow
              label="Revenue"
              value={formatCurrency(todaySales)}
            />

            <GlanceRow
              label="Items Sold"
              value={itemsSold}
            />

            <GlanceRow
              label="Discounts"
              value={formatCurrency(todayDiscounts)}
            />

            <GlanceRow
              label="Delivery"
              value={deliveryCount}
            />

            <GlanceRow
              label="Pickup"
              value={pickupCount}
            />

            <GlanceRow
              label="Dine-in"
              value={dineInCount}
            />

          </div>

        </section>

      </div>

      {/* =========================================================
          LOWER DASHBOARD
      ========================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-4">

        {/* TOP SELLING */}
        <section className="lg:col-span-1 xl:col-span-5 bg-white rounded-3xl border border-[#E8D8BD] p-5">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-black text-[#20221A]">
                Top Selling Items
              </h2>

              <p className="mt-1 text-xs text-stone-500">
                Today's item performance
              </p>
            </div>

            <span className="text-xs font-semibold text-stone-400">
              Today
            </span>

          </div>

          {topSellingItems.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="w-8 h-8 mx-auto text-[#CFC4B3]" />

              <p className="mt-3 text-sm font-semibold text-stone-500">
                No item sales yet
              </p>

              <p className="mt-1 text-xs text-stone-400">
                Your best-selling items will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-2">

              {topSellingItems.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center gap-3 py-2.5 border-b border-[#F2ECE3] last:border-0"
                >

                  <div className="w-7 h-7 rounded-full bg-[#F3E9D7] flex items-center justify-center text-xs font-black text-[#7A7B26]">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-bold text-[#20221A] truncate">
                      {item.name}
                    </p>

                    <p className="text-[11px] text-stone-400">
                      {item.quantity} sold
                    </p>

                  </div>

                  <p className="text-sm font-black text-[#20221A]">
                    {formatCurrency(item.sales)}
                  </p>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* RIDER STATUS */}
        <section className="lg:col-span-1 xl:col-span-4 bg-white rounded-3xl border border-[#E8D8BD] p-5">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-black text-[#20221A]">
                Rider Status
              </h2>

              <p className="mt-1 text-xs text-stone-500">
                Current delivery team
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAdminScreen('riders')}
              className="text-xs font-bold text-[#7A7B26]"
            >
              View all
            </button>

          </div>

          {riders.length === 0 ? (
            <div className="py-12 text-center">
              <Bike className="w-8 h-8 mx-auto text-[#CFC4B3]" />

              <p className="mt-3 text-sm font-semibold text-stone-500">
                No riders added
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-2">

              {riders.slice(0, 4).map((rider) => {

                const status =
                  rider.status === 'BUSY'
                    ? 'Busy'
                    : rider.status === 'ONLINE' ||
                        rider.isAvailable
                      ? 'Available'
                      : 'Offline';

                return (
                  <div
                    key={rider.id}
                    className="flex items-center gap-3 py-2.5 border-b border-[#F2ECE3] last:border-0"
                  >

                    <div className="w-9 h-9 rounded-full bg-[#EEE7D8] flex items-center justify-center">
                      <Bike className="w-4 h-4 text-[#7A7B26]" />
                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-bold text-[#20221A] truncate">
                        {rider.name}
                      </p>

                      <p className="text-[11px] text-stone-400">
                        {rider.vehicle || 'Delivery'}
                      </p>

                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        status === 'Available'
                          ? 'bg-emerald-50 text-emerald-700'
                          : status === 'Busy'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {status}
                    </span>

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* RECENT ACTIVITY */}
        <section className="lg:col-span-2 xl:col-span-3 bg-white rounded-3xl border border-[#E8D8BD] p-5">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-black text-[#20221A]">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-stone-500">
                Latest order events
              </p>
            </div>

            <Clock3 className="w-5 h-5 text-[#7A7B26]" />

          </div>

          {todayOrders.length === 0 ? (
            <div className="py-12 text-center">

              <Clock3 className="w-8 h-8 mx-auto text-[#CFC4B3]" />

              <p className="mt-3 text-sm font-semibold text-stone-500">
                No activity yet
              </p>

              <p className="mt-1 text-xs text-stone-400">
                Order activity will appear here.
              </p>

            </div>
          ) : (
            <div className="mt-5 space-y-4">

              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-start gap-3"
                >

                  <div className="w-7 h-7 rounded-full bg-[#F3E9D7] flex items-center justify-center shrink-0">
                    <CircleCheck className="w-3.5 h-3.5 text-[#7A7B26]" />
                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-xs font-bold text-[#20221A]">
                      Order {order.id}
                    </p>

                    <p className="mt-0.5 text-[11px] text-stone-400">
                      {getStatusLabel(
                        String(order.status)
                      )}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>

      {/* =========================================================
          PAYMENT + ORDER SOURCE
      ========================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <SmallSummaryCard
          title="UPI Payments"
          value={paymentCounts.UPI}
          icon={WalletCards}
        />

        <SmallSummaryCard
          title="Cash Payments"
          value={paymentCounts.Cash}
          icon={Banknote}
        />

        <SmallSummaryCard
          title="Online Payments"
          value={paymentCounts.Online}
          icon={CreditCard}
        />

      </div>

      {/* =========================================================
          QUICK ADMIN LINKS
      ========================================================== */}
      <section className="rounded-3xl bg-[#F5EFE4] border border-[#E8D8BD] p-5">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-[#20221A]">
              Administration
            </h2>

            <p className="mt-1 text-xs text-stone-500">
              Manage the operational areas of your outlet.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <AdminLink
              label="Orders"
              onClick={goToOrders}
            />

            <AdminLink
              label="Kitchen / KDS"
              onClick={goToKDS}
            />

            <AdminLink
              label="POS"
              onClick={goToPOS}
            />

            <AdminLink
              label="Menu"
              onClick={() => onNavigateTab('menu')}
            />

            <AdminLink
              label="Coupons"
              onClick={() => onNavigateTab('coupons')}
            />

            <AdminLink
              label="Reports"
              onClick={() => onNavigateTab('reports')}
            />

          </div>

        </div>

      </section>

    </div>
  );
};

/* ===============================================================
   KPI CARD
================================================================ */

interface KpiCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtitle,
  icon: Icon,
}) => (
  <div className="bg-white rounded-2xl border border-[#E8D8BD] p-4 shadow-[0_2px_10px_rgba(60,45,20,0.03)]">

    <div className="flex items-center gap-3">

      <div className="w-10 h-10 rounded-full bg-[#F2E8D5] flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#7A7B26]" />
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
          {label}
        </p>

        <p className="mt-1 text-xl font-black text-[#20221A] truncate">
          {value}
        </p>

        {subtitle && (
          <p className="mt-0.5 text-[10px] text-stone-400 truncate">
            {subtitle}
          </p>
        )}

      </div>

    </div>

  </div>
);

/* ===============================================================
   STATUS LINE
================================================================ */

const StatusLine: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3">

    <div className="flex items-center gap-2">

      <span className="w-2 h-2 rounded-full bg-[#B9B79D]" />

      <span className="text-xs text-stone-600">
        {label}
      </span>

    </div>

    <span className="text-xs font-bold text-stone-500">
      {value}
    </span>

  </div>
);

/* ===============================================================
   QUICK ACTION
================================================================ */

const QuickAction: React.FC<{
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}> = ({ label, icon: Icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="min-h-[72px] rounded-2xl border border-[#E8D8BD] bg-[#FAF7F0] hover:bg-[#F1E8D7] transition-colors flex flex-col items-center justify-center gap-2 text-center"
  >
    <Icon className="w-5 h-5 text-[#7A7B26]" />

    <span className="text-[11px] font-bold text-[#20221A]">
      {label}
    </span>
  </button>
);

/* ===============================================================
   ORDER FILTER
================================================================ */

const OrderFilter: React.FC<{
  label: string;
  count: number;
  active?: boolean;
}> = ({ label, count, active }) => (
  <div
    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${
      active
        ? 'bg-[#7A7B26] text-white'
        : 'bg-[#F7F3EB] text-stone-600'
    }`}
  >
    {label} ({count})
  </div>
);

/* ===============================================================
   EMPTY ORDERS
================================================================ */

const EmptyOrders = () => (
  <div className="py-14 px-5 text-center">

    <div className="mx-auto w-12 h-12 rounded-2xl bg-[#F5EFE4] flex items-center justify-center">
      <ReceiptText className="w-5 h-5 text-[#7A7B26]" />
    </div>

    <h3 className="mt-4 text-sm font-black text-[#20221A]">
      No live orders
    </h3>

    <p className="mt-1 text-xs text-stone-400 max-w-sm mx-auto">
      New customer, POS and delivery orders will appear
      here when SYZLO starts receiving orders.
    </p>

  </div>
);

/* ===============================================================
   LIVE ORDER ROW
================================================================ */

const LiveOrderRow: React.FC<{
  order: any;
}> = ({ order }) => (
  <div className="p-4 hover:bg-[#FCFAF6] transition-colors">

    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">

      <div className="md:col-span-2">

        <p className="text-xs font-black text-[#8C1E16]">
          #{order.id}
        </p>

        <p className="mt-1 text-[10px] text-stone-400">
          {new Date(order.createdAt).toLocaleTimeString(
            [],
            {
              hour: '2-digit',
              minute: '2-digit',
            }
          )}
        </p>

      </div>

      <div className="md:col-span-3">

        <p className="text-xs font-bold text-[#20221A]">
          {order.customerName || 'Customer'}
        </p>

        <p className="mt-1 text-[10px] text-stone-400">
          {order.customerPhone || 'Phone unavailable'}
        </p>

      </div>

      <div className="md:col-span-3">

        <div className="flex items-center gap-2">

          <ShoppingBag className="w-3.5 h-3.5 text-[#7A7B26]" />

          <span className="text-xs font-semibold text-stone-600">
            {order.items?.length || 0} item
            {order.items?.length === 1 ? '' : 's'}
          </span>

        </div>

        <p className="mt-1 text-[10px] text-stone-400">
          {getOrderTypeLabel(
            String(order.orderType)
          )}
        </p>

      </div>

      <div className="md:col-span-2">

        <span className="inline-flex px-2.5 py-1 rounded-full bg-[#F3E9D7] text-[10px] font-bold text-[#7A7B26]">
          {getStatusLabel(
            String(order.status)
          )}
        </span>

      </div>

      <div className="md:col-span-2 text-left md:text-right">

        <p className="text-sm font-black text-[#20221A]">
          {formatCurrency(
            Number(order.grandTotal || 0)
          )}
        </p>

      </div>

    </div>

  </div>
);

/* ===============================================================
   GLANCE ROW
================================================================ */

const GlanceRow: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#F2ECE3] last:border-0">

    <span className="text-xs text-stone-500">
      {label}
    </span>

    <span className="text-sm font-black text-[#20221A]">
      {value}
    </span>

  </div>
);

/* ===============================================================
   SMALL SUMMARY
================================================================ */

const SmallSummaryCard: React.FC<{
  title: string;
  value: number;
  icon: React.ElementType;
}> = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-2xl border border-[#E8D8BD] p-4 flex items-center gap-3">

    <div className="w-10 h-10 rounded-xl bg-[#F4EDDF] flex items-center justify-center">
      <Icon className="w-4 h-4 text-[#7A7B26]" />
    </div>

    <div>

      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
        {title}
      </p>

      <p className="mt-1 text-xl font-black text-[#20221A]">
        {value}
      </p>

    </div>

  </div>
);

/* ===============================================================
   ADMIN LINK
================================================================ */

const AdminLink: React.FC<{
  label: string;
  onClick: () => void;
}> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E4D6BF] hover:bg-[#7A7B26] hover:text-white transition-colors text-xs font-bold text-[#20221A]"
  >
    {label}
    <ChevronRight className="w-3 h-3" />
  </button>
);

/* ===============================================================
   ICON HELPER
================================================================ */

const TrendingIcon: React.FC<{
  className?: string;
}> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M14 7h7v7" />
  </svg>
);
