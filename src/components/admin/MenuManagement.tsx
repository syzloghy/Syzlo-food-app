import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, FoodCategory } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Star,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const MenuManagement: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories: FoodCategory[] = ['BAO', 'COMBOS', 'CHINESE', 'STARTERS', 'DRINKS'];

  const filteredItems = menuItems.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenNew = () => {
    setEditingItem({
      name: '',
      description: '',
      price: 199,
      category: 'BAO',
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80',
      isVeg: true,
      isBestseller: false,
      isAvailable: true,
      rating: 4.8,
      reviewsCount: 12,
      addOns: [
        { id: `addon-${Date.now()}-1`, name: 'Extra Sauce', price: 20 },
        { id: `addon-${Date.now()}-2`, name: 'Extra Chili Crisp', price: 25 },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name) return;

    if (editingItem.id) {
      updateMenuItem(editingItem.id, editingItem);
    } else {
      addMenuItem(editingItem as Omit<MenuItem, 'id'>);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
          />
        </div>

        <button
          id="add-new-dish-btn"
          onClick={handleOpenNew}
          className="px-4 py-2.5 bg-olive-500 hover:bg-olive-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW DISH</span>
        </button>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 border-b border-cream-200 text-stone-500 uppercase tracking-wider text-[11px] font-extrabold">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Dietary</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-medium text-stone-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-cream-50/50 transition-colors">
                  {/* Item Image & Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-cream-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-syzlo-charcoal text-sm">
                            {item.name}
                          </span>
                          {item.isBestseller && (
                            <span className="px-1.5 py-0.2 rounded bg-olive-100 text-olive-800 font-extrabold text-[9px] uppercase">
                              Star
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-cream-100 text-syzlo-charcoal font-bold text-xs">
                      {item.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-black text-syzlo-charcoal text-sm">
                    ₹{item.price}
                  </td>

                  {/* Veg / Non-Veg */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        item.isVeg
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                  </td>

                  {/* Availability Toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() =>
                        updateMenuItem(item.id, { isAvailable: !item.isAvailable })
                      }
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        item.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-stone-100 text-stone-400 border border-stone-300'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.isAvailable ? 'bg-emerald-500' : 'bg-stone-400'
                        }`}
                      />
                      <span>{item.isAvailable ? 'Available' : 'Sold Out'}</span>
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 hover:bg-cream-200 text-stone-700 rounded-lg transition-colors"
                      title="Edit dish"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove "${item.name}"?`)) {
                          deleteMenuItem(item.id);
                        }
                      }}
                      className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      title="Delete dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-black text-base text-syzlo-charcoal">
                {editingItem.id ? 'Edit Menu Item' : 'Add New Handcrafted Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs font-semibold text-stone-700">
              <div>
                <label className="block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
                />
              </div>

              <div>
                <label className="block mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingItem.price || 0}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">Category *</label>
                  <select
                    value={editingItem.category || 'BAO'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as Exclude<FoodCategory, 'ALL'>,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingItem.image || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-hidden focus:border-olive-500 font-mono text-[11px]"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isVeg ?? true}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isVeg: e.target.checked })
                    }
                    className="rounded text-olive-600 focus:ring-olive-500"
                  />
                  <span>Is Vegetarian (Green tag)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isBestseller ?? false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isBestseller: e.target.checked })
                    }
                    className="rounded text-olive-600 focus:ring-olive-500"
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isAvailable ?? true}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isAvailable: e.target.checked })
                    }
                    className="rounded text-olive-600 focus:ring-olive-500"
                  />
                  <span>Currently in Stock (Available)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-cream-200 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-cream-100 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-olive-500 hover:bg-olive-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
