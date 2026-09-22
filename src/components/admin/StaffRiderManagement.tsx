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
  Star,
  Pencil,
  X,
  Check,
} from 'lucide-react';

export const StaffRiderManagement: React.FC = () => {
  const {
    riders,
    staff,
    coupons,
    addRider,
    updateRider,
    deleteRider,
    toggleRiderAvailability,
    addCoupon,
    deleteCoupon,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'riders' | 'staff' | 'coupons'
  >('riders');

  // Rider modal
  const [showRiderModal, setShowRiderModal] = useState(false);
  const [editingRiderId, setEditingRiderId] = useState<string | null>(null);

  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [riderVehicle, setRiderVehicle] = useState('Scooter');
  const [riderVehicleNumber, setRiderVehicleNumber] = useState('');

  const [isSavingRider, setIsSavingRider] = useState(false);

  // Coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(299);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const openAddRider = () => {
    setEditingRiderId(null);
    setRiderName('');
    setRiderPhone('');
    setRiderVehicle('Scooter');
    setRiderVehicleNumber('');
    setShowRiderModal(true);
  };

  const openEditRider = (rider: Rider) => {
    setEditingRiderId(rider.id);
    setRiderName(rider.name);
    setRiderPhone(rider.phone);
    setRiderVehicle(rider.vehicle || 'Scooter');
    setRiderVehicleNumber(rider.vehicleNumber || '');
    setShowRiderModal(true);
  };

  const closeRiderModal = () => {
    if (isSavingRider) return;

    setShowRiderModal(false);
    setEditingRiderId(null);
  };

  const handleSaveRider = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!riderName.trim()) {
      alert('Please enter rider name.');
      return;
    }

    if (!riderPhone.trim()) {
      alert('Please enter rider phone number.');
      return;
    }

    setIsSavingRider(true);

    try {
      if (editingRiderId) {
        await updateRider(editingRiderId, {
          name: riderName,
          phone: riderPhone,
          vehicle: riderVehicle,
          vehicleNumber: riderVehicleNumber,
        });
      } else {
        await addRider({
          name: riderName,
          phone: riderPhone,
          vehicle: riderVehicle,
          vehicleNumber: riderVehicleNumber,
        });
      }

      setShowRiderModal(false);
      setEditingRiderId(null);
    } catch (error) {
      console.error(error);
      alert('Failed to save rider. Please try again.');
    } finally {
      setIsSavingRider(false);
    }
  };

  const handleDeleteRider = async (rider: Rider) => {
    const confirmed = window.confirm(
      `Delete rider "${rider.name}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteRider(rider.id);
    } catch (error) {
      console.error(error);
      alert('Failed to delete rider.');
    }
  };

  const handleToggleAvailability = async (rider: Rider) => {
    try {
      await toggleRiderAvailability(
        rider.id,
        !Boolean(rider.isAvailable)
      );
    } catch (error) {
      console.error(error);
      alert('Failed to update rider availability.');
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCouponCode) return;

    addCoupon({
      code: newCouponCode.toUpperCase().trim(),
      description:
        newCouponDesc ||
        `${newCouponDiscount}% off on orders above ₹${newCouponMinOrder}`,
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

      {/* RIDERS */}
      {activeSubTab === 'riders' && (
        <div className="space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-syzlo-charcoal">
                Delivery Riders
              </h2>
              <p className="text-xs text-stone-500">
                Manage your delivery staff and availability.
              </p>
            </div>

            <button
              onClick={openAddRider}
              className="px-4 py-2.5 bg-olive-500 hover:bg-olive-600 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              ADD RIDER
            </button>
          </div>

          {/* Rider Cards */}
          {riders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-cream-200 p-10 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-cream-100 flex items-center justify-center mb-3">
                <Bike className="w-7 h-7 text-stone-500" />
              </div>

              <h3 className="font-black text-syzlo-charcoal">
                No riders added
              </h3>

              <p className="text-xs text-stone-500 mt-1 mb-4">
                Add your first delivery rider.
              </p>

              <button
                onClick={openAddRider}
                className="px-4 py-2 bg-olive-500 text-white rounded-xl text-xs font-bold"
              >
                ADD FIRST RIDER
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {riders.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-4"
                >

                  {/* Rider Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-olive-100 text-olive-800 flex items-center justify-center text-lg">
                        🛵
                      </div>

                      <div>
                        <h3 className="font-extrabold text-sm text-syzlo-charcoal">
                          {r.name}
                        </h3>

                        <span className="text-[11px] text-stone-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-olive-600" />
                          {r.phone}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        r.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                    </span>
                  </div>

                  {/* Vehicle */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-cream-50 p-2.5 rounded-xl">
                      <span className="text-[10px] text-stone-400 font-bold block">
                        Vehicle
                      </span>

                      <span className="font-bold text-syzlo-charcoal">
                        {r.vehicle || 'Scooter'}
                      </span>
                    </div>

                    <div className="bg-cream-50 p-2.5 rounded-xl">
                      <span className="text-[10px] text-stone-400 font-bold block">
                        Vehicle No.
                      </span>

                      <span className="font-bold text-syzlo-charcoal">
                        {r.vehicleNumber || 'Not added'}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="text-xs bg-cream-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-stone-400 font-bold block">
                      Deliveries / Rating
                    </span>

                    <span className="font-bold text-syzlo-charcoal flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {r.rating || 0}
                      <span className="text-stone-400">
                        ({r.completedDeliveries || 0} deliveries)
                      </span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-cream-100 flex gap-2">

                    <button
                      onClick={() => handleToggleAvailability(r)}
                      className={`flex-1 py-2 rounded-xl text-[11px] font-bold ${
                        r.isAvailable
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {r.isAvailable ? 'MARK UNAVAILABLE' : 'MAKE AVAILABLE'}
                    </button>

                    <button
                      onClick={() => openEditRider(r)}
                      className="p-2 bg-cream-100 hover:bg-cream-200 rounded-xl text-stone-700"
                      title="Edit rider"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteRider(r)}
                      className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-600"
                      title="Delete rider"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STAFF */}
      {activeSubTab === 'staff' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s: StaffMember) => (
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
                    <h3 className="font-extrabold text-sm text-syzlo-charcoal">
                      {s.name}
                    </h3>

                    <span className="text-[11px] text-stone-500">
                      {s.phone}
                    </span>
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

      {/* COUPONS */}
      {activeSubTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-cream-200 shadow-xs space-y-3">

            <h3 className="font-black text-sm text-syzlo-charcoal uppercase tracking-wider">
              Create Promotional Coupon
            </h3>

            <form
              onSubmit={handleCreateCoupon}
              className="space-y-3 text-xs font-semibold"
            >
              <div>
                <label className="block text-stone-600 mb-1">
                  Coupon Code *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. BAOMASTI"
                  value={newCouponCode}
                  onChange={(e) =>
                    setNewCouponCode(e.target.value.toUpperCase())
                  }
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-stone-600 mb-1">
                    Discount %
                  </label>

                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newCouponDiscount}
                    onChange={(e) =>
                      setNewCouponDiscount(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-cream-300"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">
                    Min Order (₹)
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={newCouponMinOrder}
                    onChange={(e) =>
                      setNewCouponMinOrder(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-cream-300"
                  />
                </div>

              </div>

              <div>
                <label className="block text-stone-600 mb-1">
                  Description
                </label>

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

                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        {c.discountValue}% OFF
                      </span>

                    </div>

                    <p className="text-xs text-stone-500 mt-0.5">
                      {c.description}
                    </p>

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

      {/* ADD / EDIT RIDER MODAL */}
      {showRiderModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-cream-200 flex items-center justify-between">

              <div>
                <h3 className="font-black text-syzlo-charcoal">
                  {editingRiderId ? 'Edit Rider' : 'Add Rider'}
                </h3>

                <p className="text-[11px] text-stone-500">
                  Delivery staff details
                </p>
              </div>

              <button
                onClick={closeRiderModal}
                className="p-2 rounded-xl hover:bg-cream-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSaveRider}
              className="p-5 space-y-4"
            >

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Rider Name *
                </label>

                <input
                  type="text"
                  required
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  placeholder="Enter rider name"
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-olive-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Phone Number *
                </label>

                <input
                  type="tel"
                  required
                  value={riderPhone}
                  onChange={(e) => setRiderPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-olive-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Vehicle Type
                </label>

                <select
                  value={riderVehicle}
                  onChange={(e) => setRiderVehicle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-300"
                >
                  <option value="Scooter">Scooter</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Electric Scooter">Electric Scooter</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Vehicle Number
                </label>

                <input
                  type="text"
                  value={riderVehicleNumber}
                  onChange={(e) =>
                    setRiderVehicleNumber(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="e.g. AS01AB1234"
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-300 uppercase focus:outline-none focus:ring-2 focus:ring-olive-300"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingRider}
                className="w-full py-3 bg-olive-500 hover:bg-olive-600 disabled:opacity-50 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />

                {isSavingRider
                  ? 'SAVING...'
                  : editingRiderId
                    ? 'UPDATE RIDER'
                    : 'SAVE RIDER'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
