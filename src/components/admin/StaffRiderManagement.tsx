import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Rider, StaffMember, Coupon } from '../../types';
import {
  Bike,
  Users,
  Tag,
  Plus,
  Trash2,
  Phone,
  Shield,
  Star,
  Check,
} from 'lucide-react';

export const StaffRiderManagement: React.FC = () => {
  const { riders, staff, coupons, addCoupon, deleteCoupon } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'riders' | 'staff' | 'coupons'>('riders');

  // Coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(299);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    addCoupon({
      code: newCouponCode.toUpperCase().trim(),
      description: newCouponDesc || `${newCouponDiscount}% off on orders above ₹${newCouponMinOrder}`,
      discountType: 'PERCENT',
      discountValue: newCouponDiscount,
      minOrder: newCouponMinOrder,
      minOrderAmount: newCouponMinOrder,
      maxDiscount: 150,
      active: true,
      isActive: true,
      usageCount: 0,
      expiryDate: '2026-12-31',
    });

    setNewCouponCode('');
    setNewCouponDesc('');
  };

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 bg-cream-100 p-1.5 rounded-2xl border border-cream-300 w-fit">
        <button
          onClick={() => setActiveSubTab('riders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'riders'
              ? 'bg-olive-500 text-white shadow-xs'
              : 'text-stone-700 hover:text-syzlo-charcoal'
          }`}
        >
          <Bike className="w-3.5 h-3.5" />
          <span>Delivery Fleet ({riders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'staff'
              ? 'bg-olive-500 text-white shadow-xs'
              : 'text-stone-700 hover:text-syzlo-charcoal'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Kitchen & POS Staff ({staff.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'coupons'
              ? 'bg-olive-500 text-white shadow-xs'
              : 'text-stone-700 hover:text-syzlo-charcoal'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Coupons & Offers ({coupons.length})</span>
        </button>
      </div>

      {/* 1. Riders Sub Tab */}
      {activeSubTab === 'riders' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {riders.map((r) => (
            <div
              key={r.id}
              className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-olive-100 text-olive-800 flex items-center justify-center font-bold text-lg">
                    🛵
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-syzlo-charcoal">{r.name}</h3>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-olive-600" /> {r.phone}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    r.status === 'ONLINE' || r.isAvailable
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {r.status === 'ONLINE' || r.isAvailable ? 'AVAILABLE' : 'BUSY'}
                </span>
              </div>

              <div className="pt-2 border-t border-cream-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-cream-50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-stone-400 font-bold block">Vehicle</span>
                  <span className="font-bold text-syzlo-charcoal">{r.vehicle}</span>
                </div>
                <div className="bg-cream-50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-stone-400 font-bold block">Rating</span>
                  <span className="font-bold text-syzlo-charcoal flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {r.rating} ({r.completedDeliveries})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Staff Sub Tab */}
      {activeSubTab === 'staff' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-cream-100 text-syzlo-charcoal flex items-center justify-center font-bold">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-syzlo-charcoal">{s.name}</h3>
                    <span className="text-[11px] text-stone-500">{s.phone}</span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-olive-100 text-olive-800 text-[10px] font-black uppercase">
                  {s.role}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 pt-1">
                Branch: Indiranagar • Shift: {s.shift} • Status: {s.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Coupons Sub Tab */}
      {activeSubTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Coupon Form */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-3">
            <h3 className="font-black text-sm text-syzlo-charcoal uppercase tracking-wider">
              Create Promotional Coupon
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-stone-600 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BAOMASTI"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Discount %</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 20% OFF on all weekend orders"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-olive-500 hover:bg-olive-600 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>SAVE COUPON</span>
              </button>
            </form>
          </div>

          {/* Existing Coupons List */}
          <div className="lg:col-span-7 space-y-3">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-olive-100 text-olive-700 flex items-center justify-center font-bold">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-syzlo-charcoal">
                        {c.code}
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        {c.discountValue}% OFF
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{c.description}</p>
                    <span className="text-[10px] text-stone-400 font-semibold block mt-0.5">
                      Min order ₹{c.minOrder}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteCoupon(c.code)}
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
