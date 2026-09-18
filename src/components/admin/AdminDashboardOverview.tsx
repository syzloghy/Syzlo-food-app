import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Bike,
  Clock,
  PlusCircle,
  Utensils,
  Tag,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

interface AdminDashboardOverviewProps {
  onNavigateTab: (tab: 'orders' | 'menu' | 'coupons' | 'reports') => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onNavigateTab,
}) => {
  const { orders, riders, menuItems } = useApp();

  // Compute live metrics
  const totalSales = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const ordersToday = orders.length;
  const activeRidersCount = riders.filter((r) => r.status === 'ONLINE' || r.isAvailable).length;
  const pendingOrdersCount = orders.filter((o) =>
    ['ORDER_PLACED', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(
      o.status
    )
  ).length;

  const aov = ordersToday > 0 ? Math.round(totalSales / ordersToday) : 0;

  // Chart Data: Hourly sales
  const salesChartData = [
    { time: '11 AM', sales: 1200, orders: 4 },
    { time: '12 PM', sales: 3400, orders: 11 },
    { time: '1 PM', sales: 5600, orders: 16 },
    { time: '2 PM', sales: 4200, orders: 12 },
    { time: '3 PM', sales: 1800, orders: 5 },
    { time: '5 PM', sales: 2400, orders: 7 },
    { time: '7 PM', sales: 6800, orders: 20 },
    { time: '8 PM', sales: 8400, orders: 24 },
    { time: '9 PM', sales: 7100, orders: 19 },
    { time: '10 PM', sales: 3900, orders: 10 },
  ];

  // Category sales breakdown
  const categoryData = [
    { name: 'Artisanal Bao', value: 45, color: '#7A7B26' },
    { name: 'Combos', value: 25, color: '#A3A438' },
    { name: 'Chinese Wok', value: 15, color: '#C29B38' },
    { name: 'Starters', value: 10, color: '#4E5016' },
    { name: 'Drinks', value: 5, color: '#EED7B5' },
  ];

  // Order Type Breakdown
  const deliveryCount = orders.filter((o) => o.orderType === 'DELIVERY').length;
  const pickupCount = orders.filter((o) => o.orderType === 'PICKUP').length;
  const dineInCount = orders.filter((o) => o.orderType === 'DINE-IN').length;

  const orderTypeData = [
    { name: 'Delivery', count: deliveryCount || 4, color: '#7A7B26' },
    { name: 'Pickup', count: pickupCount || 2, color: '#3B82F6' },
    { name: 'Dine-in', count: dineInCount || 3, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales</span>
            <DollarSign className="w-4 h-4 text-olive-600" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-syzlo-charcoal">
            ₹{totalSales.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18.4% today
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Orders Today</span>
            <ShoppingBag className="w-4 h-4 text-olive-600" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-syzlo-charcoal">
            {ordersToday}
          </span>
          <span className="text-[10px] text-stone-500 block mt-1">Live synchronized</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Order Value</span>
            <TrendingUp className="w-4 h-4 text-olive-600" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-syzlo-charcoal">
            ₹{aov}
          </span>
          <span className="text-[10px] text-stone-500 block mt-1">Per checkout</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Riders</span>
            <Bike className="w-4 h-4 text-olive-600" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-syzlo-charcoal">
            {activeRidersCount} / {riders.length}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">All on EV Fleet</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-amber-600">
            {pendingOrdersCount}
          </span>
          <span className="text-[10px] text-stone-500 block mt-1">In kitchen / transit</span>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="bg-cream-100 p-3.5 rounded-2xl border border-cream-300 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-olive-800 uppercase tracking-wider">
          ⚡ Quick Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-olive-500 hover:text-white text-xs font-bold text-syzlo-charcoal transition-colors border border-cream-300 shadow-2xs flex items-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Manage Orders</span>
          </button>
          <button
            onClick={() => onNavigateTab('menu')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-olive-500 hover:text-white text-xs font-bold text-syzlo-charcoal transition-colors border border-cream-300 shadow-2xs flex items-center gap-1"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Edit Menu & Prices</span>
          </button>
          <button
            onClick={() => onNavigateTab('coupons')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-olive-500 hover:text-white text-xs font-bold text-syzlo-charcoal transition-colors border border-cream-300 shadow-2xs flex items-center gap-1"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Add Promo Coupon</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sales Over Time Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-syzlo-charcoal uppercase tracking-wider">
                Sales Velocity & Order Volume
              </h3>
              <p className="text-xs text-stone-500">Hourly sales turnover today (₹)</p>
            </div>
            <span className="text-xs font-bold text-olive-700 bg-olive-50 px-2.5 py-1 rounded-full border border-olive-200">
              Peak: 8:00 PM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7A7B26" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7A7B26" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" />
                <XAxis dataKey="time" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#20221A',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#7A7B26"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fulfillment Breakdown Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-syzlo-charcoal uppercase tracking-wider">
              Channel Split
            </h3>
            <p className="text-xs text-stone-500">Delivery vs Pickup vs Dine-in</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {orderTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-cream-100">
            {orderTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-stone-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-syzlo-charcoal">{item.count} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Contribution Bar Chart */}
      <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-syzlo-charcoal uppercase tracking-wider">
              Category Revenue Share
            </h3>
            <p className="text-xs text-stone-500">Contribution percentage across food categories</p>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0ede6" />
              <XAxis type="number" unit="%" fontSize={11} stroke="#888888" />
              <YAxis dataKey="name" type="category" fontSize={11} stroke="#888888" width={90} />
              <Tooltip />
              <Bar dataKey="value" fill="#7A7B26" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
