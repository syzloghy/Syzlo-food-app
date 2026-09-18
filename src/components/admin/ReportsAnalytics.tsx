import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Star, TrendingUp, Award, Users, DollarSign } from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { orders, riders, menuItems } = useApp();

  // Weekly sales trend data
  const weeklySalesData = [
    { day: 'Mon', revenue: 24500, orders: 72 },
    { day: 'Tue', revenue: 28900, orders: 84 },
    { day: 'Wed', revenue: 31200, orders: 95 },
    { day: 'Thu', revenue: 29800, orders: 89 },
    { day: 'Fri', revenue: 42100, orders: 130 },
    { day: 'Sat', revenue: 56400, orders: 182 },
    { day: 'Sun', revenue: 61800, orders: 198 },
  ];

  // Best selling dishes calculation
  const bestSellers = menuItems.filter((i) => i.isBestseller).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Analytics Summary Banner */}
      <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Weekly Gross Volume
          </span>
          <span className="text-2xl font-black text-syzlo-charcoal">₹2,74,700</span>
          <span className="text-xs text-emerald-700 font-bold block mt-0.5">+24% vs last week</span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Weekly Orders Placed
          </span>
          <span className="text-2xl font-black text-syzlo-charcoal">850 orders</span>
          <span className="text-xs text-stone-500 block mt-0.5">Avg 121 orders/day</span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Repeat Customer Rate
          </span>
          <span className="text-2xl font-black text-olive-700">68.4%</span>
          <span className="text-xs text-emerald-700 font-bold block mt-0.5">High loyalty index</span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Avg Kitchen Prep Time
          </span>
          <span className="text-2xl font-black text-syzlo-charcoal">12.5 mins</span>
          <span className="text-xs text-emerald-700 font-bold block mt-0.5">Target: &lt; 15 mins</span>
        </div>
      </div>

      {/* Weekly Revenue & Volume Chart */}
      <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm text-syzlo-charcoal uppercase tracking-wider">
              Weekly Revenue Trajectory
            </h3>
            <p className="text-xs text-stone-500">Gross sales across all 3 ordering modes (₹)</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklySalesData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" />
              <XAxis dataKey="day" stroke="#888888" fontSize={11} />
              <YAxis stroke="#888888" fontSize={11} />
              <Tooltip
                formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: '#20221A',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="revenue" fill="#7A7B26" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Grid: Best Sellers & Rider Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top 5 Dishes */}
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-syzlo-charcoal uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-olive-600" />
              <span>Top Best-Selling Dishes</span>
            </h3>
            <span className="text-xs text-stone-400 font-medium">By units sold</span>
          </div>

          <div className="space-y-3">
            {bestSellers.map((dish, idx) => (
              <div
                key={dish.id}
                className="flex items-center justify-between p-3 bg-cream-50 rounded-2xl border border-cream-200"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-olive-500 text-white font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-syzlo-charcoal">{dish.name}</h4>
                    <span className="text-[10px] text-stone-500">{dish.category} • ₹{dish.price}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-xs text-syzlo-charcoal block">
                    {320 - idx * 45} sold
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    ⭐ {dish.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rider Performance Table */}
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-syzlo-charcoal uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-olive-600" />
              <span>Rider Performance League</span>
            </h3>
            <span className="text-xs text-stone-400 font-medium">Today's metrics</span>
          </div>

          <div className="space-y-3">
            {riders.map((r, idx) => (
              <div
                key={r.id}
                className="p-3 bg-cream-50 rounded-2xl border border-cream-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-cream-200 flex items-center justify-center text-sm font-bold text-syzlo-charcoal">
                    🛵
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-syzlo-charcoal">{r.name}</h4>
                    <span className="text-[11px] text-stone-500">{r.vehicle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-black text-xs text-syzlo-charcoal block">
                      {r.completedDeliveries} Trips
                    </span>
                    <span className="text-[10px] text-stone-400">Avg 21 mins ETA</span>
                  </div>
                  <div className="bg-white px-2 py-1 rounded-lg border border-cream-200 font-bold text-xs text-syzlo-charcoal">
                    ⭐ {r.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
