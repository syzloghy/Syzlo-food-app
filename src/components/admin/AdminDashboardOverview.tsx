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
<div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

  {/* =====================================================
      HERO
  ====================================================== */}
  <section
    className="
      xl:col-span-7
      min-h-[245px]
      rounded-2xl
      overflow-hidden
      relative
      bg-[#2D3021]
      border border-[#3A3D2A]
      shadow-[0_3px_18px_rgba(40,35,20,0.08)]
    "
  >

    {banner?.imageUrl && (
      <img
        src={banner.imageUrl}
        alt=""
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          opacity-[0.62]
        "
      />
    )}

    {/* DARK OVERLAY */}
    <div
      className="
        absolute
        inset-0
        bg-gradient-to-r
        from-[#202319]
        via-[#202319]/85
        to-[#202319]/10
      "
    />

    {/* CONTENT */}
    <div
      className="
        relative
        z-10
        p-7
        sm:p-8
        h-full
        flex
        flex-col
        justify-center
      "
    >

      <p
        className="
          text-[9px]
          uppercase
          tracking-[0.28em]
          text-[#EED7B5]
          font-bold
        "
      >
        {banner?.badge || 'THE BAO MAKERS'}
      </p>

      <h2
        className="
          mt-3
          text-[32px]
          sm:text-[38px]
          lg:text-[42px]
          font-serif
          font-bold
          text-white
          leading-[1.05]
          tracking-tight
          max-w-[500px]
        "
      >
        {banner?.title ||
          'Handcrafted Comfort, Always.'}
      </h2>

      <p
        className="
          mt-3
          text-[12px]
          sm:text-[13px]
          text-white/75
          max-w-[410px]
          leading-relaxed
        "
      >
        {banner?.subtitle ||
          'Fresh buns. Real ingredients. Happier people.'}
      </p>

      <button
        type="button"
        onClick={() =>
          onNavigateTab('orders')
        }
        className="
          mt-6
          w-fit
          h-9
          px-4
          rounded-lg
          bg-[#565F28]
          hover:bg-[#48501F]
          text-white
          text-[10px]
          font-bold
          flex
          items-center
          gap-2
          transition-colors
        "
      >
        View Today's Orders

        <ArrowRight
          className="w-3.5 h-3.5"
          strokeWidth={1.8}
        />
      </button>

    </div>

  </section>


  {/* =====================================================
      OUTLET STATUS
  ====================================================== */}
  <section
    className="
      xl:col-span-2
      bg-white
      rounded-2xl
      border border-[#E4DDD0]
      p-5
      shadow-[0_2px_12px_rgba(60,50,30,0.03)]
    "
  >

    <div className="flex items-start justify-between gap-2">

      <div>

        <p className="text-[9px] uppercase tracking-[0.15em] text-[#969080] font-bold">
          Outlet
        </p>

        <h3 className="mt-1 text-[15px] font-black">
          Status
        </h3>

      </div>

      <span
        className="
          inline-flex
          items-center
          gap-1.5
          px-2.5
          py-1
          rounded-full
          bg-[#F0E9D9]
          text-[#6C623F]
          text-[9px]
          font-black
        "
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#9B8B4A]" />
        Pre-launch
      </span>

    </div>


    <div className="mt-6 space-y-4">

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


    <div className="mt-5 pt-4 border-t border-[#F0EBE3]">

      <p className="text-[9px] text-[#9A958B] leading-relaxed">
        Outlet status will update automatically
        when operations begin.
      </p>

    </div>

  </section>


  {/* =====================================================
      QUICK ACTIONS
  ====================================================== */}
  <section
    className="
      xl:col-span-3
      bg-white
      rounded-2xl
      border border-[#E4DDD0]
      p-5
      shadow-[0_2px_12px_rgba(60,50,30,0.03)]
    "
  >

    <div className="flex items-center justify-between">

      <div>

        <p className="text-[9px] uppercase tracking-[0.15em] text-[#969080] font-bold">
          Shortcuts
        </p>

        <h3 className="mt-1 text-[15px] font-black">
          Quick Actions
        </h3>

      </div>

    </div>


    <div className="grid grid-cols-2 gap-2.5 mt-5">

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
<div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

  {/* =====================================================
      LIVE ORDERS
  ====================================================== */}
  <section
    className="
      xl:col-span-8
      bg-white
      rounded-2xl
      border border-[#E4DDD0]
      overflow-hidden
      shadow-[0_2px_12px_rgba(60,50,30,0.03)]
    "
  >

    {/* HEADER */}
    <div className="px-5 pt-5 pb-4 border-b border-[#EEE8DE]">

      <div className="flex items-center justify-between gap-3">

        <div className="flex items-center gap-2.5">

          <span className="w-2 h-2 rounded-full bg-[#565F28]" />

          <h3 className="text-[17px] font-black tracking-tight">
            Live Orders
          </h3>

          <span
            className="
              min-w-[24px]
              h-[21px]
              px-1.5
              rounded-full
              bg-[#F1EBD9]
              text-[#565F28]
              text-[9px]
              font-black
              flex
              items-center
              justify-center
            "
          >
            {todayOrders.length}
          </span>

        </div>

        <button
          type="button"
          onClick={() =>
            onNavigateTab('orders')
          }
          className="
            text-[10px]
            font-bold
            text-[#565F28]
            flex
            items-center
            gap-1
            hover:underline
          "
        >
          View all

          <ArrowRight
            className="w-3 h-3"
            strokeWidth={1.8}
          />
        </button>

      </div>


      {/* FILTERS */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-0.5">

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


    {/* CONTENT */}
    {todayOrders.length === 0 ? (

      <div className="min-h-[285px] flex flex-col items-center justify-center px-6 text-center">

        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-[#F5F1E8]
            flex
            items-center
            justify-center
          "
        >
          <ShoppingBag
            className="w-6 h-6 text-[#C8C0B1]"
            strokeWidth={1.6}
          />
        </div>

        <p className="mt-4 text-[13px] font-bold text-[#626057]">
          No live orders yet
        </p>

        <p className="mt-1.5 max-w-[280px] text-[10px] leading-relaxed text-[#A19B91]">
          New orders will appear here automatically
          when customers start ordering from SYZLO.
        </p>

        <button
          type="button"
          onClick={() =>
            onNavigateTab('orders')
          }
          className="
            mt-4
            h-8
            px-3.5
            rounded-lg
            border border-[#DDD6C9]
            bg-white
            text-[9px]
            font-bold
            text-[#565F28]
            hover:bg-[#F7F4ED]
            transition-colors
          "
        >
          Open Orders
        </button>

      </div>

    ) : (

      <div>

        {/* TABLE HEADER */}
        <div
          className="
            hidden
            md:grid
            grid-cols-12
            gap-3
            px-5
            py-3
            bg-[#FAF8F4]
            border-b border-[#EEE8DE]
            text-[8px]
            uppercase
            tracking-[0.12em]
            font-black
            text-[#99938A]
          "
        >
          <div className="col-span-2">
            Order
          </div>

          <div className="col-span-3">
            Customer
          </div>

          <div className="col-span-2">
            Type
          </div>

          <div className="col-span-2">
            Status
          </div>

          <div className="col-span-3 text-right">
            Amount
          </div>
        </div>


        {/* ORDERS */}
        {todayOrders
          .slice(0, 6)
          .map((order) => (

            <div
              key={order.id}
              className="
                px-5
                py-4
                border-b
                border-[#F0EBE3]
                last:border-b-0
                hover:bg-[#FCFBF8]
                transition-colors
              "
            >

              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-center">

                {/* ORDER */}
                <div className="md:col-span-2">

                  <p className="text-[10px] font-black text-[#565F28]">
                    #{order.id}
                  </p>

                  <p className="mt-1 text-[9px] text-[#A09A90]">
                    {order.items.length} item
                    {order.items.length !== 1
                      ? 's'
                      : ''}
                  </p>

                </div>


                {/* CUSTOMER */}
                <div className="md:col-span-3">

                  <p className="text-[11px] font-bold text-[#292B24]">
                    {order.customerName}
                  </p>

                  <p className="mt-1 text-[9px] text-[#A09A90]">
                    {order.orderType}
                  </p>

                </div>


                {/* TYPE */}
                <div className="md:col-span-2">

                  <span
                    className="
                      inline-flex
                      px-2
                      py-1
                      rounded-md
                      bg-[#F3F0E8]
                      text-[#68645A]
                      text-[9px]
                      font-bold
                    "
                  >
                    {String(order.orderType)
                      .replaceAll('_', ' ')}
                  </span>

                </div>


                {/* STATUS */}
                <div className="md:col-span-2">

                  <span
                    className="
                      inline-flex
                      px-2
                      py-1
                      rounded-md
                      bg-[#E7EEDC]
                      text-[#4B713E]
                      text-[9px]
                      font-bold
                      capitalize
                    "
                  >
                    {String(order.status)
                      .replaceAll('_', ' ')}
                  </span>

                </div>


                {/* AMOUNT */}
                <div className="md:col-span-3 md:text-right">

                  <p className="text-[12px] font-black text-[#292B24]">
                    {money(
                      Number(
                        order.grandTotal || 0
                      )
                    )}
                  </p>

                </div>

              </div>

            </div>

          ))}

      </div>

    )}

  </section>


  {/* =====================================================
      TODAY AT A GLANCE
  ====================================================== */}
  <section
    className="
      xl:col-span-4
      bg-white
      rounded-2xl
      border border-[#E4DDD0]
      p-5
      shadow-[0_2px_12px_rgba(60,50,30,0.03)]
    "
  >

    <div className="flex items-start justify-between">

      <div>

        <p className="text-[9px] uppercase tracking-[0.15em] text-[#969080] font-bold">
          Performance
        </p>

        <h3 className="mt-1 text-[17px] font-black tracking-tight">
          Today at a Glance
        </h3>

      </div>

      <div
        className="
          w-8
          h-8
          rounded-lg
          bg-[#F1EBD9]
          flex
          items-center
          justify-center
        "
      >
        <Activity
          className="w-[16px] h-[16px] text-[#565F28]"
          strokeWidth={1.7}
        />
      </div>

    </div>


    {/* METRICS */}
    <div className="mt-5">

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


    {/* GRAPH EMPTY STATE */}
    <div
      className="
        mt-5
        h-[82px]
        rounded-xl
        bg-[#F7F4ED]
        border border-[#EEE8DE]
        flex
        flex-col
        items-center
        justify-center
        text-center
      "
    >

      <div className="flex items-end gap-1 h-5">

        <span className="w-1.5 h-2 rounded-sm bg-[#D7D2C5]" />
        <span className="w-1.5 h-3 rounded-sm bg-[#CCC6B8]" />
        <span className="w-1.5 h-4 rounded-sm bg-[#C1BAAA]" />
        <span className="w-1.5 h-2.5 rounded-sm bg-[#D7D2C5]" />
        <span className="w-1.5 h-5 rounded-sm bg-[#B9B19F]" />

      </div>

      <span className="mt-2 text-[9px] text-[#9D978D]">
        Sales graph will appear after the first sale
      </span>

    </div>

  </section>

</div>
      {/* =====================================================
    BOTTOM ROW
====================================================== */}
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-4">

  {/* =====================================================
      TOP SELLING ITEMS
  ====================================================== */}
  <section
    className="
      xl:col-span-5
      bg-white
      rounded-2xl
      border border-[#E4DDD0]
      p-5
      shadow-[0_2px_12px_rgba(60,50,30,0.03)]
    "
  >

    <div className="flex items-start justify-between">

      <div>

        <p className="text-[9px] uppercase tracking-[0.15em] text-[#969080] font-bold">
          Products
        </p>

        <h3 className="mt-1 text-[17px] font-black tracking-tight">
          Top Selling Items
        </h3>

      </div>

      <span className="text-[9px] font-medium text-[#99938A]">
        Today
      </span>

    </div>


    {topItems.length === 0 ? (

      <div className="min-h-[150px] flex flex-col items-center justify-center text-center">

        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-[#F5F1E8]
            flex
            items-center
            justify-center
          "
        >
          <Package
            className="w-[19px] h-[19px] text-[#C7BFAF]"
            strokeWidth={1.6}
          />
        </div>

        <p className="mt-3 text-[11px] font-bold text-[#68655D]">
          No sales yet
        </p>

        <p className="mt-1 text-[9px] text-[#A29C92]">
          Your best-selling items will appear here.
        </p>

      </div>

    ) : (

      <div className="mt-4">

        {topItems.map((item, index) => (

          <div
            key={item.name}
            className="
              flex
              items-center
              gap-3
              py-3
              border-b
              border-[#F0EBE3]
              last:border-b-0
            "
          >

            <div
              className="
                w-7
                h-7
                rounded-lg
                bg-[#F1EBD9]
                flex
                items-center
                justify-center
                text-[9px]
                font-black
                text-[#565F28]
                shrink-0
              "
            >
              {String(index + 1).padStart(2, '0')}
            </div>

            <div className="flex-1 min-w-0">

              <p className="text-[11px] font-bold truncate">
                {item.name}
              </p>

              <p className="mt-1 text-[9px] text-[#A09A90]">
                {item.quantity} sold
              </p>

            </div>

            <p className="text-[11px] font-black shrink-0">
              {money(item.sales)}
            </p>

          </div>

        ))}

      </div>

    )}

  </section>


  {/* =====================================================
      RIDER STATUS
  ====================================================== */}
  <section
    className="
      xl:col-span-4
      bg-white
      rounded-2xl
      border border-[#E4DDD0]
      p-5
      shadow-[0_2px_12px_rgba(60,50,30,0.03)]
    "
  >

    <div className="flex items-start justify-between">

      <div>

        <p className="text-[9px] uppercase tracking-[0.15em] text-[#969080] font-bold">
          Delivery
        </p>

        <h3 className="mt-1 text-[17px] font-black tracking-tight">
          Rider Status
        </h3>

      </div>

      <button
        type="button"
        onClick={() => onNavigateTab('reports')}
        className="
          text-[9px]
          font-bold
          text-[#565F28]
          hover:underline
        "
      >
        View all →
      </button>

    </div>


    {riders.length === 0 ? (

      <div className="min-h-[150px] flex flex-col items-center justify-center text-center">

        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-[#F5F1E8]
            flex
            items-center
            justify-center
          "
        >
          <Bike
            className="w-[19px] h-[19px] text-[#C7BFAF]"
            strokeWidth={1.6}
          />
        </div>

        <p className="mt-3 text-[11px] font-bold text-[#68655D]">
          No riders
        </p>

        <p className="mt-1 text-[9px] text-[#A29C92]">
          Add riders to manage deliveries.
        </p>

      </div>

    ) : (

      <div className="mt-4">

        {riders.slice(0, 4).map((rider) => {

          const status =
            rider.status === 'BUSY'
              ? 'On Delivery'
              : rider.status === 'ONLINE' ||
                rider.isAvailable
                ? 'Available'
                : 'Offline';

          const statusClass =
            status === 'On Delivery'
              ? 'bg-[#F2E8D0] text-[#80652B]'
              : status === 'Available'
                ? 'bg-[#E1EEDB] text-[#47733D]'
                : 'bg-[#EEEAE3] text-[#8B867D]';

          return (
            <div
              key={rider.id}
              className="
                flex
                items-center
                gap-3
                py-3
                border-b
                border-[#F0EBE3]
                last:border-b-0
              "
            >

              <div
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-[#F1EBD9]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <Bike
                  className="w-[15px] h-[15px] text-[#565F28]"
                  strokeWidth={1.7}
                />
              </div>


              <div className="flex-1 min-w-0">

                <p className="text-[11px] font-bold truncate">
                  {rider.name}
                </p>

                <p className="mt-1 text-[9px] text-[#A09A90] truncate">
                  {rider.vehicle || 'Delivery rider'}
                </p>

              </div>


              <span
                className={`
                  px-2
                  py-1
                  rounded-full
                  text-[8px]
                  font-bold
                  whitespace-nowrap
                  ${statusClass}
                `}
              >
                {status}
              </span>

            </div>
          );

        })}

      </div>

    )}

  </section>


  {/* =====================================================
      RECENT ACTIVITY
  ====================================================== */}
  <section
    className="
      xl:col-span-3
      bg-white
      rounded-2xl
      border border-[#E4DDD0]
      p-5
      shadow-[0_2px_12px_rgba(60,50,30,0.03)]
    "
  >

    <div className="flex items-start justify-between">

      <div>

        <p className="text-[9px] uppercase tracking-[0.15em] text-[#969080] font-bold">
          Timeline
        </p>

        <h3 className="mt-1 text-[17px] font-black tracking-tight">
          Recent Activity
        </h3>

      </div>

      <Activity
        className="w-[16px] h-[16px] text-[#565F28]"
        strokeWidth={1.7}
      />

    </div>


    {todayOrders.length === 0 ? (

      <div className="min-h-[150px] flex flex-col items-center justify-center text-center">

        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-[#F5F1E8]
            flex
            items-center
            justify-center
          "
        >
          <Activity
            className="w-[18px] h-[18px] text-[#C7BFAF]"
            strokeWidth={1.6}
          />
        </div>

        <p className="mt-3 text-[11px] font-bold text-[#68655D]">
          No activity
        </p>

        <p className="mt-1 max-w-[170px] text-[9px] leading-relaxed text-[#A29C92]">
          Recent order events will appear here.
        </p>

      </div>

    ) : (

      <div className="mt-4 space-y-4">

        {todayOrders
          .slice(0, 5)
          .map((order) => (

            <div
              key={order.id}
              className="flex gap-3"
            >

              <div
                className="
                  w-7
                  h-7
                  rounded-full
                  bg-[#E7EBCF]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <Box
                  className="w-[13px] h-[13px] text-[#565F28]"
                  strokeWidth={1.7}
                />
              </div>

              <div className="min-w-0">

                <p className="text-[10px] font-bold">
                  Order received
                </p>

                <p className="mt-1 text-[9px] text-[#A09A90] truncate">
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
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

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

const Payment: React.FC<{
  icon: React.ElementType;
  label: string;
  value: number;
}> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div
    className="
      bg-white
      rounded-2xl
      border border-[#E4DDD0]
      px-5
      py-4
      flex
      items-center
      gap-3
      shadow-[0_2px_12px_rgba(60,50,30,0.03)]
    "
  >

    <div
      className="
        w-10
        h-10
        rounded-xl
        bg-[#F1EBD9]
        flex
        items-center
        justify-center
        shrink-0
      "
    >
      <Icon
        className="w-[16px] h-[16px] text-[#565F28]"
        strokeWidth={1.7}
      />
    </div>

    <div>

      <p
        className="
          text-[8px]
          font-bold
          uppercase
          tracking-[0.12em]
          text-[#9A958B]
        "
      >
        {label}
      </p>

      <p className="mt-1 text-[19px] font-black">
        {money(value)}
      </p>

    </div>

  </div>
);

const Status: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  const isReady =
    value === 'Yes';

  return (
    <div className="flex items-center justify-between gap-3">

      <div className="flex items-center gap-2.5 min-w-0">

        <span
          className={`
            w-2 h-2
            rounded-full
            shrink-0
            ${
              isReady
                ? 'bg-[#4D8A43]'
                : 'bg-[#B6A77A]'
            }
          `}
        />

        <span className="text-[10px] text-[#67645C] truncate">
          {label}
        </span>

      </div>

      <span
        className={`
          text-[10px]
          font-bold
          shrink-0
          ${
            isReady
              ? 'text-[#47753D]'
              : 'text-[#807656]'
          }
        `}
      >
        {value}
      </span>

    </div>
  );
};

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
    className="
      h-[82px]
      rounded-xl
      bg-[#F3F5E8]
      border border-[#E7E9D8]
      hover:bg-[#E8EBD8]
      hover:border-[#D9DEC0]
      flex
      flex-col
      items-center
      justify-center
      gap-2
      transition-all
      duration-150
    "
  >

    <div
      className="
        w-8
        h-8
        rounded-lg
        bg-white
        flex
        items-center
        justify-center
        shadow-[0_1px_3px_rgba(50,50,20,0.05)]
      "
    >
      <Icon
        className="w-[15px] h-[15px] text-[#565F28]"
        strokeWidth={1.8}
      />
    </div>

    <span
      className="
        text-[9px]
        font-bold
        text-[#34362D]
        text-center
        leading-tight
      "
    >
      {label}
    </span>

  </button>
);

const Filter: React.FC<{
  label: string;
  active?: boolean;
}> = ({
  label,
  active,
}) => (
  <span
    className={`
      inline-flex
      items-center
      justify-center
      min-h-[27px]
      px-3
      rounded-lg
      whitespace-nowrap
      text-[9px]
      font-bold
      border
      transition-colors
      ${
        active
          ? 'bg-[#565F28] border-[#565F28] text-white'
          : 'bg-[#F7F5F0] border-[#E9E3D8] text-[#706C64]'
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
