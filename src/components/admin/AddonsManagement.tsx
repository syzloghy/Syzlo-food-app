import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlobalAddon } from '../../types';
import {
  Utensils,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const AddonsManagement: React.FC = () => {
  const { globalAddons, addGlobalAddon, updateGlobalAddon, deleteGlobalAddon, toggleAddonAvailability } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(25);
  const [category, setCategory] = useState<GlobalAddon['category']>('Sauces & Dips');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const categories: GlobalAddon['category'][] = [
    'Sauces & Dips',
    'Sides & Crunch',
    'Extra Fillings',
    'Beverages',
  ];

  const filteredAddons = globalAddons.filter((a) => {
    const matchesCat = selectedCat === 'ALL' || a.category === selectedCat;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openCreateModal = () => {
    setEditingAddonId(null);
    setName('');
    setPrice(25);
    setCategory('Sauces & Dips');
    setIsAvailable(true);
    setIsModalOpen(true);
  };

  const openEditModal = (a: GlobalAddon) => {
    setEditingAddonId(a.id);
    setName(a.name);
    setPrice(a.price);
    setCategory(a.category);
    setIsAvailable(a.isAvailable);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price < 0) return;

    if (editingAddonId) {
      updateGlobalAddon(editingAddonId, {
        name,
        price: Number(price),
        category,
        isAvailable,
      });
    } else {
      addGlobalAddon({
        name,
        price: Number(price),
        category,
        isAvailable,
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
            <Utensils className="w-5 h-5 text-olive-600" />
            Add-ons & Modifiers Manager
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure sauces, dips, extra bao fillings, and toppings available during customer food customization.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-olive-600 hover:bg-olive-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Add-on</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search add-on name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-cream-300 text-xs font-medium focus:ring-2 focus:ring-olive-500/20 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCat('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCat === 'ALL'
                ? 'bg-olive-600 text-white'
                : 'bg-white text-stone-600 hover:bg-cream-100 border border-cream-300'
            }`}
          >
            All ({globalAddons.length})
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCat === c
                  ? 'bg-olive-600 text-white'
                  : 'bg-white text-stone-600 hover:bg-cream-100 border border-cream-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Addons List Table */}
      <div className="bg-white rounded-2xl border border-cream-300 shadow-xs overflow-hidden">
        <div className="divide-y divide-cream-200">
          {filteredAddons.map((addon) => (
            <div
              key={addon.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-olive-100 text-olive-800 flex items-center justify-center font-bold text-sm shrink-0">
                  +₹
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-syzlo-charcoal">{addon.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold">
                      {addon.category}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-olive-700 mt-0.5 block">
                    +₹{addon.price}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-cream-100">
                {/* Availability Switch */}
                <button
                  onClick={() => toggleAddonAvailability(addon.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    addon.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${addon.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span>{addon.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(addon)}
                    className="p-2 text-stone-500 hover:text-olive-700 hover:bg-cream-100 rounded-lg transition-colors"
                    title="Edit Add-on"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteGlobalAddon(addon.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Add-on"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredAddons.length === 0 && (
            <div className="py-12 text-center text-stone-400 text-xs">
              No add-ons found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-cream-300">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h3 className="font-black text-lg text-syzlo-charcoal">
                {editingAddonId ? 'Edit Add-on' : 'Add New Modifier / Add-on'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Add-on Item Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Extra Truffle Mayo Dip, Extra Cheese"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Extra Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GlobalAddon['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="addon-stock"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded text-olive-600 focus:ring-olive-500 w-4 h-4"
                />
                <label htmlFor="addon-stock" className="text-xs font-bold text-stone-700 cursor-pointer">
                  In Stock & available for customers
                </label>
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
                  Save Add-on
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
