import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryAddress } from '../../types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  ShoppingBag,
  Home,
  Briefcase,
  Navigation,
} from 'lucide-react';
import { OpenStreetMap } from '../common/OpenStreetMap';

export const CustomerProfile: React.FC = () => {
  const {
    customerProfile,
    updateCustomerProfile,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    orders,
    menuItems,
    addToCart,
    setCustomerScreen,
    osmConfig,
  } = useApp();

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(customerProfile.name);
  const [profilePhone, setProfilePhone] = useState(customerProfile.phone);
  const [profileEmail, setProfileEmail] = useState(customerProfile.email);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrPincode, setAddrPincode] = useState('400050');
  const [addrCoords, setAddrCoords] = useState<{ lat: number; lng: number }>({
    lat: osmConfig.centerLat,
    lng: osmConfig.centerLng,
  });

  const favoriteItems = menuItems.filter((m) =>
    customerProfile.savedFavorites.includes(m.id)
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      name: profileName,
      phone: profilePhone,
      email: profileEmail,
    });
    setIsEditingProfile(false);
    setProfileSuccessMsg('Profile details successfully updated!');
    setTimeout(() => setProfileSuccessMsg(null), 3000);
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrLabel('HOME');
    setAddrHouse('');
    setAddrStreet('');
    setAddrLandmark('');
    setAddrPincode('400050');
    setAddrCoords({ lat: osmConfig.centerLat, lng: osmConfig.centerLng });
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: DeliveryAddress) => {
    setEditingAddressId(addr.id || null);
    setAddrLabel(addr.label);
    setAddrHouse(addr.houseNo);
    setAddrStreet(addr.street);
    setAddrLandmark(addr.areaLandmark);
    setAddrPincode(addr.pinCode);
    if (addr.location) {
      setAddrCoords(addr.location);
    }
    setAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const addressPayload: DeliveryAddress = {
      id: editingAddressId || `addr-${Date.now()}`,
      label: addrLabel,
      houseNo: addrHouse,
      street: addrStreet,
      areaLandmark: addrLandmark,
      pinCode: addrPincode,
      location: addrCoords,
      isDefault: false,
    };

    if (editingAddressId) {
      updateCustomerAddress(editingAddressId, addressPayload);
      setProfileSuccessMsg('Delivery address updated!');
    } else {
      addCustomerAddress(addressPayload);
      setProfileSuccessMsg('New delivery address added!');
    }

    setAddressModalOpen(false);
    setTimeout(() => setProfileSuccessMsg(null), 3000);
  };

  return (
    <div className="min-h-screen pb-32 sm:pb-20 bg-[#FAF6EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-syzlo-charcoal tracking-tight">
              My Account
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage your personal credentials, contact info, and delivery addresses
            </p>
          </div>
          <button
            onClick={() => setCustomerScreen('home')}
            className="text-xs font-bold text-olive-700 hover:text-olive-900 bg-white px-3.5 py-2 rounded-xl border border-cream-300 shadow-2xs"
          >
            ← Back to Store
          </button>
        </div>

        {/* Feedback Alert */}
        {profileSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{profileSuccessMsg}</span>
          </div>
        )}

        {/* User Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-olive-600 text-white flex items-center justify-center font-black text-2xl shadow-md border border-olive-700 shrink-0">
                {customerProfile.name.charAt(0) || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-black text-xl text-syzlo-charcoal">
                    {customerProfile.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-olive-100 text-olive-800 text-[10px] font-black uppercase tracking-wider">
                    SYZLO Patron
                  </span>
                </div>
                <div className="text-xs text-stone-500 space-y-1">
                  <p className="flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-olive-600" /> {customerProfile.phone}
                  </p>
                  <p className="flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-olive-600" /> {customerProfile.email}
                  </p>
                </div>
              </div>
            </div>

            <button
              id="edit-profile-btn"
              onClick={() => {
                setProfileName(customerProfile.name);
                setProfilePhone(customerProfile.phone);
                setProfileEmail(customerProfile.email);
                setIsEditingProfile(!isEditingProfile);
              }}
              className="px-4 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 border border-cream-300 text-xs font-bold text-stone-800 flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-olive-700" />
              <span>{isEditingProfile ? 'Close Editing' : 'Update Details'}</span>
            </button>
          </div>

          {/* Inline Profile Edit Form */}
          {isEditingProfile && (
            <form onSubmit={handleSaveProfile} className="pt-4 border-t border-cream-200 space-y-3.5 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-semibold focus:outline-hidden focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-semibold focus:outline-hidden focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-semibold focus:outline-hidden focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-cream-100 text-stone-600 text-xs font-bold hover:bg-cream-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-olive-600 hover:bg-olive-700 text-white text-xs font-black transition-colors shadow-xs"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-cream-100/70 p-3 rounded-2xl border border-cream-200 text-center">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
                Total Orders Placed
              </span>
              <span className="text-lg font-black text-syzlo-charcoal">{orders.length}</span>
            </div>

            <div className="bg-cream-100/70 p-3 rounded-2xl border border-cream-200 text-center">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
                Total Spent
              </span>
              <span className="text-lg font-black text-syzlo-charcoal">
                ₹{orders.reduce((sum, o) => sum + o.grandTotal, 0).toFixed(0)}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-cream-100/70 p-3 rounded-2xl border border-cream-200 text-center">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
                Saved Addresses
              </span>
              <span className="text-lg font-black text-syzlo-charcoal">
                {customerProfile.addresses.length}
              </span>
            </div>
          </div>
        </div>

        {/* Saved Delivery Addresses Section */}
        <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-olive-100 flex items-center justify-center text-olive-700">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-base text-syzlo-charcoal leading-tight">
                  Delivery Addresses
                </h3>
                <p className="text-[11px] text-stone-500">
                  Update, pin on OpenStreetMap, or add new addresses for fast checkout
                </p>
              </div>
            </div>

            <button
              id="add-address-btn"
              onClick={handleOpenAddAddress}
              className="px-3.5 py-2 rounded-xl bg-olive-600 hover:bg-olive-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Address Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {customerProfile.addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl border border-cream-300 bg-[#FAF6EF]/60 hover:bg-[#FAF6EF] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white border border-cream-300 flex items-center justify-center text-sm shadow-2xs shrink-0">
                      {addr.label === 'HOME' && <Home className="w-4 h-4 text-olive-700" />}
                      {addr.label === 'WORK' && <Briefcase className="w-4 h-4 text-blue-700" />}
                      {addr.label === 'OTHER' && <MapPin className="w-4 h-4 text-amber-700" />}
                    </div>
                    <div>
                      <span className="font-black text-xs text-syzlo-charcoal block">
                        {addr.label}
                      </span>
                      <span className="text-[10px] text-stone-500">Pincode: {addr.pinCode}</span>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditAddress(addr)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-white transition-colors"
                      title="Edit Address"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {customerProfile.addresses.length > 1 && addr.id && (
                      <button
                        onClick={() => deleteCustomerAddress(addr.id!)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-white transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-stone-700 leading-relaxed font-medium">
                  <p>{addr.houseNo}, {addr.street}</p>
                  <p className="text-stone-500 text-[11px]">{addr.areaLandmark}</p>
                </div>

                {addr.location && (
                  <div className="text-[10px] text-olive-700 font-bold flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    <span>OSM Geolocation: {addr.location.lat.toFixed(4)}, {addr.location.lng.toFixed(4)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Dishes */}
        {favoriteItems.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-xs space-y-4">
            <h3 className="font-black text-base text-syzlo-charcoal flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Your Favorite Comfort Baos</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favoriteItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl border border-cream-200 flex items-center justify-between gap-3 hover:bg-cream-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-syzlo-charcoal line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-olive-700 font-extrabold">₹{item.price}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(item, 1, [])}
                    className="p-2 rounded-xl bg-olive-100 hover:bg-olive-500 text-olive-700 hover:text-white transition-colors"
                    title="Quick Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Address Add/Edit Modal with OpenStreetMap Pinning */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-cream-300 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-cream-200">
              <h3 className="font-black text-base text-syzlo-charcoal flex items-center gap-2">
                <MapPin className="w-4 h-4 text-olive-600" />
                <span>{editingAddressId ? 'Edit Address' : 'Add Delivery Address'}</span>
              </h3>
              <button
                onClick={() => setAddressModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              {/* Address Label Choice */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Address Label</label>
                <div className="flex gap-2">
                  {(['HOME', 'WORK', 'OTHER'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setAddrLabel(l)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        addrLabel === l
                          ? 'bg-olive-600 text-white shadow-xs'
                          : 'bg-cream-100 text-stone-700 hover:bg-cream-200'
                      }`}
                    >
                      {l === 'HOME' && '🏠 Home'}
                      {l === 'WORK' && '🏢 Work'}
                      {l === 'OTHER' && '📍 Other'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flat / House */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Flat / House / Building No.</label>
                <input
                  type="text"
                  value={addrHouse}
                  onChange={(e) => setAddrHouse(e.target.value)}
                  placeholder="e.g. Flat 302, Palm Grove Apts"
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-medium focus:outline-hidden focus:border-olive-500"
                  required
                />
              </div>

              {/* Street */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Street / Road Name</label>
                <input
                  type="text"
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  placeholder="e.g. 14th Road, Khar West"
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-medium focus:outline-hidden focus:border-olive-500"
                  required
                />
              </div>

              {/* Landmark & Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Area / Landmark</label>
                  <input
                    type="text"
                    value={addrLandmark}
                    onChange={(e) => setAddrLandmark(e.target.value)}
                    placeholder="Near Starbucks"
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-medium focus:outline-hidden focus:border-olive-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    placeholder="400050"
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-medium focus:outline-hidden focus:border-olive-500"
                    required
                  />
                </div>
              </div>

              {/* OpenStreetMap Pinning */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span>Pin on OpenStreetMap (For Rider Delivery Accuracy)</span>
                  <span className="text-[10px] text-olive-700 font-semibold">Click map to adjust pin</span>
                </label>
                <div className="rounded-2xl overflow-hidden border border-cream-300 shadow-2xs">
                  <OpenStreetMap
                    pinCoords={addrCoords}
                    onPinSelect={(coords) => setAddrCoords(coords)}
                    heightClass="h-44"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-cream-100 text-stone-700 text-xs font-bold hover:bg-cream-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-olive-600 hover:bg-olive-700 text-white text-xs font-black shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
