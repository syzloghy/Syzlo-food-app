import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { HeroBanner, FoodCategory } from '../../types';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Eye,
  Percent,
  Layers,
} from 'lucide-react';

export const HeroBannersManagement: React.FC = () => {
  const { heroBanners, addHeroBanner, updateHeroBanner, deleteHeroBanner, toggleHeroBannerStatus } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  // Form state
  const [badge, setBadge] = useState('Exclusive Deal');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('Order Now');
  const [ctaCategory, setCtaCategory] = useState<FoodCategory>('BAO');
  const [bgColor, setBgColor] = useState('from-[#20221A] via-[#2D3021] to-[#393D28]');

  const colorPresets = [
    { label: 'Charcoal Olive (Signature)', value: 'from-[#20221A] via-[#2D3021] to-[#393D28]' },
    { label: 'Warm Amber Crust', value: 'from-[#3A2818] via-[#4A341E] to-[#2D1F12]' },
    { label: 'Midnight Asian Slate', value: 'from-[#1A2328] via-[#24333A] to-[#162024]' },
    { label: 'Deep Forest Umami', value: 'from-[#1F2B1D] via-[#283825] to-[#172115]' },
  ];

 const handleImageFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

    const fileName = `hero-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${fileExtension}`;

    const filePath = `hero-banners/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Hero banner image upload failed:', uploadError);
      alert('Image upload failed. Please try again.');
      return;
    }

    const { data } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      alert('Could not get the uploaded image URL.');
      return;
    }

    setImageUrl(data.publicUrl);

    console.log(
      'Hero banner image uploaded:',
      data.publicUrl
    );
  } catch (error) {
    console.error(
      'Hero banner image upload failed:',
      error
    );

    alert('Image upload failed. Please try again.');
  }
};

  const openCreateModal = () => {
    setEditingBannerId(null);
    setBadge('Special Offer');
    setTitle('');
    setSubtitle('Where Indian spices meet soft bao. Made fresh. Served hot.');
    setCouponCode('');
    setImageUrl('https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1200&q=80');
    setCtaText('Order Now');
    setCtaCategory('BAO');
    setBgColor(colorPresets[0].value);
    setIsModalOpen(true);
  };

  const openEditModal = (b: HeroBanner) => {
    setEditingBannerId(b.id);
    setBadge(b.badge);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setCouponCode(b.couponCode || '');
    setImageUrl(b.imageUrl);
    setCtaText(b.ctaText);
    setCtaCategory(b.ctaCategory || 'BAO');
    setBgColor(b.bgColor || colorPresets[0].value);
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    if (editingBannerId) {
      await updateHeroBanner(editingBannerId, {
        badge,
        title,
        subtitle,
        couponCode: couponCode ? couponCode.toUpperCase() : undefined,
        imageUrl,
        ctaText,
        ctaCategory,
        bgColor,
      });
    } else {
      await addHeroBanner({
        badge,
        title,
        subtitle,
        couponCode: couponCode ? couponCode.toUpperCase() : undefined,
        imageUrl,
        ctaText,
        ctaCategory,
        bgColor,
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-cream-300 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-syzlo-charcoal flex items-center gap-2">
            <Layers className="w-5 h-5 text-olive-600" />
            Top Hero Banners Manager
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure the customer homepage top carousel, deals, and promotional banners with custom uploads.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-olive-600 hover:bg-olive-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Hero Banner</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {heroBanners.map((banner) => (
          <div
            key={banner.id}
            className={`rounded-2xl border transition-all overflow-hidden flex flex-col bg-white ${
              banner.isActive ? 'border-cream-300 shadow-sm' : 'border-stone-200 opacity-60'
            }`}
          >
            {/* Live Banner Preview */}
            <div className={`relative p-5 text-white bg-gradient-to-r ${banner.bgColor || 'from-[#20221A] to-[#393D28]'}`}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-olive-500/50 border border-olive-300/30 text-[10px] font-extrabold uppercase tracking-wider">
                  {banner.badge}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${banner.isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-stone-500/20 text-stone-300'}`}>
                  {banner.isActive ? 'Active on App' : 'Disabled'}
                </span>
              </div>

              <h3 className="font-extrabold text-base line-clamp-2 leading-snug">{banner.title}</h3>
              <p className="text-xs text-cream-200 mt-1 line-clamp-2 opacity-90">{banner.subtitle}</p>

              {banner.couponCode && (
                <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md border border-white/20">
                  <Percent className="w-3 h-3 text-amber-400" />
                  <span>Code: {banner.couponCode}</span>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 underline underline-offset-2">
                  {banner.ctaText} →
                </span>
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-14 h-14 rounded-xl object-cover border border-white/20 shadow-md shrink-0"
                />
              </div>
            </div>

            {/* Admin Controls */}
            <div className="p-3 bg-stone-50 border-t border-cream-200 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleHeroBannerStatus(banner.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    banner.isActive
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {banner.isActive ? 'Disable' : 'Enable'}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(banner)}
                  className="p-1.5 text-stone-600 hover:text-olive-700 hover:bg-cream-200 rounded-lg transition-colors"
                  title="Edit Banner"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteHeroBanner(banner.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create / Edit Banner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-cream-300 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h3 className="font-black text-lg text-syzlo-charcoal">
                {editingBannerId ? 'Edit Hero Banner' : 'Create New Hero Banner'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Badge / Tag</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Exclusive Deal, Weekend Feast"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Coupon Code (Optional)</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. BAOLOVE"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium uppercase focus:ring-2 focus:ring-olive-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Banner Headline / Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 20% OFF on all Handcrafted Bao"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle / Marketing Copy</label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Short engaging description..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                />
              </div>

              {/* Image Upload or URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Banner Image (Upload File or Paste Image URL)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 border border-cream-300 text-xs font-bold text-syzlo-charcoal flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-4 h-4 text-olive-600" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs font-medium focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>
                {imageUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="Banner Preview"
                      className="w-20 h-14 object-cover rounded-xl border border-cream-300 shadow-xs"
                    />
                    <span className="text-[11px] text-stone-500">Image successfully loaded & ready</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Order Now, Explore Combos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Target Category Link</label>
                  <select
                    value={ctaCategory}
                    onChange={(e) => setCtaCategory(e.target.value as FoodCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                  >
                    <option value="ALL">All Menu</option>
                    <option value="BAO">Bao</option>
                    <option value="COMBOS">Combos</option>
                    <option value="CHINESE">Chinese</option>
                    <option value="STARTERS">Starters</option>
                    <option value="DRINKS">Drinks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Color Palette Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setBgColor(preset.value)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                        bgColor === preset.value
                          ? 'border-olive-600 bg-cream-100 ring-2 ring-olive-500/20'
                          : 'border-cream-300 hover:bg-stone-50'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-gradient-to-r ${preset.value} shrink-0`} />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-cream-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-cream-300 text-xs font-bold text-stone-600 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-olive-600 hover:bg-olive-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  {editingBannerId ? 'Save Changes' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
