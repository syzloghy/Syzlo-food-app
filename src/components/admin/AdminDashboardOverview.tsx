import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Banknote,
  Bike,
  Clock3,
  CreditCard,
  IndianRupee,
  Package,
  ReceiptText,
  ShoppingBag,
  Tag,
  TrendingUp,
  Utensils,
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

export const AdminDashboardOverview: React.FC<
  AdminDashboardOverviewProps
> = ({ onNavigateTab }) => {
  const { orders, riders } = useApp();

  /*
   * Only orders successfully connected to Supabase
   * are treated as real business orders.
   *
   * This prevents INITIAL_ORDERS/demo data from appearing
   * as real SYZLO sales before the outlet launches.
   */
  const realOrders = useMemo(
    () => orders.filter((order) => Boolean(order.supabaseOrderId)),
    [orders]
  );

  const todaysOrders = useMemo(
    () =>
      realOrders.filter((order) =>
        isToday(order.createdAt)
      ),
    [realOrders]
  );

  const validSalesOrders = useMemo(
    () =>
      todaysOrders.filter(
        (order) =>
          order.status !== 'CANCELLED' &&
          order.status !== 'cancelled'
      ),
    [todaysOrders]
  );

  const todaySales = useMemo(
    () =>
      validSalesOrders.reduce(
        (sum, order) => sum + Number(order.grandTotal || 0),
        0
      ),
    [validSalesOrders]
  );

  const todayDiscounts = useMemo(
    () =>
      todaysOrders.reduce(
        (sum, order) => sum + Number(order.discount || 0),
        0
      ),
    [todaysOrders]
  );

  const todayItemsSold = useMemo(
    () =>
      validSalesOrders.reduce(
        (sum, order) =>
          sum +
          order.items.reduce(
            (itemSum, item) =>
              itemSum + Number(item.quantity || 0),
            0
          ),
        0
      ),
    [validSalesOrders]
  );

  const averageOrderValue =
    validSalesOrders.length > 0
      ? todaySales / validSalesOrders.length
      : 0;

  /*
   * Live order pipeline
   */
  const newOrders = todaysOrders.filter(
    (order) =>
      order.status === 'placed' ||
      order.status === 'ORDER_PLACED'
  ).length;

  const preparingOrders = todaysOrders.filter(
    (order) =>
      order.status === 'preparing' ||
      order.status === 'PREPARING' ||
      order.status === 'accepted' ||
      order.status === 'RESTAURANT_ACCEPTED'
  ).length;

  const readyOrders = todaysOrders.filter(
    (order) =>
      order.status === 'ready' ||
      order.status === 'READY'
  ).length;

  const deliveryOrders = todaysOrders.filter(
    (order) =>
      order.status === 'out_for_delivery' ||
      order.status === 'OUT_FOR_DELIVERY' ||
      order.status === 'picked_up' ||
      order.status === 'PICKED_UP' ||
      order.status === 'rider_assigned' ||
      order.status === 'RIDER_ASSIGNED'
  ).length;

  /*
   * Order type
   */
  const deliveryCount = todaysOrders.filter(
    (order) =>
      order.orderType === 'DELIVERY' ||
      order.orderType === 'delivery'
  ).length;

  const pickupCount = todaysOrders.filter(
    (order) =>
      order.orderType === 'PICKUP' ||
      order.orderType === 'pickup'
  ).length;

  const dineInCount = todaysOrders.filter(
    (order) =>
      order.orderType === 'DINE-IN' ||
      order.orderType === 'dine_in'
  ).length;

  /*
   * Payment methods
   */
  const upiCount = todaysOrders.filter(
    (order) =>
      order.paymentMethod === 'UPI' ||
      order.paymentMethod === 'upi'
  ).length;

  const cashCount = todaysOrders.filter(
    (order) =>
      order.paymentMethod === 'CASH' ||
      order.paymentMethod === 'cash'
  ).length;

  const onlineCount = todaysOrders.filter(
    (order) =>
      order.paymentMethod === 'ONLINE' ||
      order.paymentMethod === 'online'
  ).length;

  /*
   * Top selling items
   */
  const topSellingItems = useMemo(() => {
    const itemMap = new Map<
      string,
      {
        name: string;
        quantity: number;
        sales: number;
      }
    >();

    validSalesOrders.forEach((order) => {
      order.items.forEach((item) => {
        const id = item.menuItem?.id || item.menuItem?.name;

        if (!id) return;

        const existing = itemMap.get(id);

        if (existing) {
          existing.quantity += Number(item.quantity || 0);
          existing.sales += Number(item.totalPrice || 0);
        } else {
          itemMap.set(id, {
            name: item.menuItem?.name || 'Unknown item',
            quantity: Number(item.quantity || 0),
            sales: Number(item.totalPrice || 0),
          });
        }
      });
    });

    return Array.from(itemMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [validSalesOrders]);

  const activeRiders = riders.filter(
    (rider) =>
      rider.status === 'ONLINE' ||
      rider.status === 'BUSY' ||
      rider.isAvailable
  ).length;

  const hasTodayData = todaysOrders.length > 0;

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-olive-700">
            SYZLO ADMIN
          </p>

          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-syzlo-charcoal">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Today's business overview and live operations.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Business Status
          </p>

          <div className="mt-1 flex items-center gap-2 sm:justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-syzlo-charcoal">
              Outlet Ready
            </span>
          </div>
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">

        <MetricCard
          label="Today's Sales"
          value={formatCurrency(todaySales)}
          icon={IndianRupee}
        />

        <MetricCard
          label="Orders Today"
          value={todaysOrders.length.toString()}
          icon={ShoppingBag}
        />

        <MetricCard
          label="Items Sold"
          value={todayItemsSold.toString()}
          icon={Package}
        />

        <MetricCard
          label="Discounts"
          value={formatCurrency(todayDiscounts)}
          icon={Tag}
        />

        <MetricCard
          label="Average Order"
          value={formatCurrency(averageOrderValue)}
          icon={TrendingUp}
        />

        <MetricCard
          label="Active Riders"
          value={`${activeRiders}/${riders.length}`}
          icon={Bike}
        />

      </div>

      {/* LIVE OPERATIONS */}
      <section className="bg-white rounded-3xl border border-cream-200 shadow-xs overflow-hidden">

        <div className="p-5 border-b border-cream-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-syzlo-charcoal">
                Live Operations
              </h2>

              <p className="mt-1 text-xs text-stone-500">
                Current order pipeline
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-olive-700 hover:text-olive-900"
            >
              View Orders
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x-0 lg:divide-x divide-y lg:divide-y-0 divide-cream-100">

          <PipelineCard
            label="New"
            count={newOrders}
            icon={ReceiptText}
          />

          <PipelineCard
            label="Preparing"
            count={preparingOrders}
            icon={Utensils}
          />

          <PipelineCard
            label="Ready"
            count={readyOrders}
            icon={Package}
          />

          <PipelineCard
            label="Out for Delivery"
            count={deliveryOrders}
            icon={Bike}
          />

        </div>
      </section>

      {/* PRE-LAUNCH / EMPTY STATE */}
      {!hasTodayData && (
        <section className="bg-white rounded-3xl border border-cream-200 shadow-xs p-6 sm:p-8">

          <div className="max-w-xl mx-auto text-center">

            <div className="mx-auto w-12 h-12 rounded-2xl bg-cream-100 border border-cream-200 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-olive-700" />
            </div>

            <h2 className="mt-4 text-lg font-black text-syzlo-charcoal">
              No orders yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              SYZLO has not recorded any real orders yet.
              Once your first order is completed, sales,
              item performance, payment data and other
              dashboard metrics will appear here automatically.
            </p>

          </div>

        </section>
      )}

      {/* BUSINESS DATA */}
      {hasTodayData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ORDER CHANNELS */}
          <DashboardCard
            title="Order Channels"
            subtitle="Today's order distribution"
          >
            <div className="space-y-4">

              <BreakdownRow
                label="Delivery"
                value={deliveryCount}
                total={todaysOrders.length}
              />

              <BreakdownRow
                label="Pickup"
                value={pickupCount}
                total={todaysOrders.length}
              />

              <BreakdownRow
                label="Dine-in"
                value={dineInCount}
                total={todaysOrders.length}
              />

            </div>
          </DashboardCard>

          {/* PAYMENTS */}
          <DashboardCard
            title="Payment Summary"
            subtitle="Today's payment methods"
          >
            <div className="grid grid-cols-3 gap-3">

              <PaymentBox
                label="UPI"
                count={upiCount}
                icon={WalletCards}
              />

              <PaymentBox
                label="Cash"
                count={cashCount}
                icon={Banknote}
              />

              <PaymentBox
                label="Online"
                count={onlineCount}
                icon={CreditCard}
              />

            </div>
          </DashboardCard>

          {/* TOP ITEMS */}
          <DashboardCard
            title="Top Selling Items"
            subtitle="Today's item performance"
          >
            {topSellingItems.length === 0 ? (
              <EmptyText text="No item sales recorded yet." />
            ) : (
              <div className="space-y-3">

                {topSellingItems.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between gap-3 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">

                      <span className="w-7 h-7 rounded-lg bg-cream-100 flex items-center justify-center text-xs font-black text-olive-800 shrink-0">
                        {index + 1}
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-syzlo-charcoal truncate">
                          {item.name}
                        </p>

                        <p className="text-[11px] text-stone-500">
                          {item.quantity} sold
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-black text-syzlo-charcoal">
                      {formatCurrency(item.sales)}
                    </span>
                  </div>
                ))}

              </div>
            )}
          </DashboardCard>

          {/* SALES */}
          <DashboardCard
            title="Sales Overview"
            subtitle="Today's revenue"
          >
            <div className="flex items-end justify-between gap-4">

              <div>
                <p className="text-3xl font-black text-syzlo-charcoal">
                  {formatCurrency(todaySales)}
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  {validSalesOrders.length} completed/active sales order
                  {validSalesOrders.length === 1 ? '' : 's'}
                </p>
              </div>

              <TrendingUp className="w-7 h-7 text-olive-700" />
            </div>

            <div className="mt-5 h-2 rounded-full bg-cream-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#7A7B26]"
                style={{
                  width:
                    todaySales > 0
                      ? '100%'
                      : '0%',
                }}
              />
            </div>
          </DashboardCard>

        </div>
      )}

      {/* QUICK ACTIONS */}
      <section className="bg-cream-100 rounded-3xl border border-cream-200 p-5">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-syzlo-charcoal">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-stone-500">
              Common administrative actions
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <ActionButton
              label="Manage Orders"
              icon={ShoppingBag}
              onClick={() => onNavigateTab('orders')}
            />

            <ActionButton
              label="Edit Menu"
              icon={Utensils}
              onClick={() => onNavigateTab('menu')}
            />

            <ActionButton
              label="Manage Coupons"
              icon={Tag}
              onClick={() => onNavigateTab('coupons')}
            />

            <ActionButton
              label="Reports"
              icon={TrendingUp}
              onClick={() => onNavigateTab('reports')}
            />

          </div>

        </div>
      </section>

      {/* FOOTER STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1 pb-2">

        <div className="flex items-center gap-2">
          <Clock3 className="w-3.5 h-3.5 text-stone-400" />

          <span className="text-[11px] text-stone-500">
            Dashboard uses live application data.
          </span>
        </div>

        <span className="text-[11px] font-semibold text-stone-400">
          SYZLO ADMIN
        </span>

      </div>

    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
}) => (
  <div className="bg-white rounded-2xl border border-cream-200 shadow-xs p-4">

    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500">
        {label}
      </span>

      <Icon className="w-4 h-4 text-olive-700 shrink-0" />
    </div>

    <p className="mt-3 text-xl sm:text-2xl font-black text-syzlo-charcoal">
      {value}
    </p>

  </div>
);

interface PipelineCardProps {
  label: string;
  count: number;
  icon: React.ElementType;
}

const PipelineCard: React.FC<PipelineCardProps> = ({
  label,
  count,
  icon: Icon,
}) => (
  <div className="p-5">

    <div className="flex items-center justify-between gap-3">

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
          {label}
        </p>

        <p className="mt-2 text-2xl font-black text-syzlo-charcoal">
          {count}
        </p>
      </div>

      <Icon className="w-5 h-5 text-olive-700" />

    </div>

  </div>
);

interface DashboardCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  children,
}) => (
  <section className="bg-white rounded-3xl border border-cream-200 shadow-xs p-5">

    <div className="mb-5">
      <h2 className="text-sm font-black uppercase tracking-wider text-syzlo-charcoal">
        {title}
      </h2>

      <p className="mt-1 text-xs text-stone-500">
        {subtitle}
      </p>
    </div>

    {children}

  </section>
);

interface BreakdownRowProps {
  label: string;
  value: number;
  total: number;
}

const BreakdownRow: React.FC<BreakdownRowProps> = ({
  label,
  value,
  total,
}) => {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>

      <div className="flex items-center justify-between mb-1.5">

        <span className="text-sm font-semibold text-stone-600">
          {label}
        </span>

        <span className="text-sm font-black text-syzlo-charcoal">
          {value}
        </span>

      </div>

      <div className="h-2 rounded-full bg-cream-100 overflow-hidden">

        <div
          className="h-full rounded-full bg-[#7A7B26] transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
};

interface PaymentBoxProps {
  label: string;
  count: number;
  icon: React.ElementType;
}

const PaymentBox: React.FC<PaymentBoxProps> = ({
  label,
  count,
  icon: Icon,
}) => (
  <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4 text-center">

    <Icon className="w-5 h-5 mx-auto text-olive-700" />

    <p className="mt-2 text-xl font-black text-syzlo-charcoal">
      {count}
    </p>

    <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">
      {label}
    </p>

  </div>
);

interface ActionButtonProps {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon: Icon,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-cream-200 text-xs font-bold text-syzlo-charcoal hover:bg-[#7A7B26] hover:text-white hover:border-[#7A7B26] transition-colors"
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

const EmptyText: React.FC<{ text: string }> = ({ text }) => (
  <div className="py-8 text-center">
    <p className="text-sm text-stone-400">
      {text}
    </p>
  </div>
);
