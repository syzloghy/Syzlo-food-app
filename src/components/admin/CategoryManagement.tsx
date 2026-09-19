import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { CategoryConfig } from '../../types';
import {
  FolderTree,
  Upload,
  Edit2,
  Check,
  X,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

export const CategoryManagement: React.FC = () => {
  const { categoriesConfig, updateCategoryConfig, menuItems } = useApp();

  const [editingCategory, setEditingCategory] = useState<CategoryConfig | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🥟');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);

 const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

    const categorySlug =
      editingCategory?.id?.toLowerCase() || 'category';

    const filePath = `categories/${categorySlug}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Category image upload failed:', uploadError);
      alert(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      alert('Image uploaded but public URL could not be created.');
      return;
    }

    setImage(data.publicUrl);

    console.log('Category image uploaded:', data.publicUrl);
  } catch (error: any) {
    console.error('Category image upload error:', error);
    alert(
      error?.message ||
      'Failed to upload category image.'
    );
  }
};

  const openEditModal = (cat: CategoryConfig) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setIcon(cat.icon);
    setImage(cat.image);
    setIsActive(cat.isActive);
  };

 const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!editingCategory) return;

  try {
    await updateCategoryConfig(editingCategory.id, {
      name,
      description,
      icon,
      image,
      isActive,
    });

    setEditingCategory(null);

    alert('Category saved successfully.');
  } catch (error: any) {
    console.error('SAVE CATEGORY ERROR:', error);

    alert(
      error?.message ||
      error?.details ||
      error?.hint ||
      'Failed to save category.'
    );
  }
};
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-cream-300 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-syzlo-charcoal flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-olive-600" />
            Menu Categories & Category Images
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Upload custom banner photos, icons, and descriptions for each food category on the customer app.
          </p>
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoriesConfig.map((cat) => {
          const itemCount = menuItems.filter((i) => i.category === cat.id).length;

          return (
            <div
              key={cat.id}
              className={`rounded-2xl border bg-white overflow-hidden shadow-xs flex flex-col transition-all ${
                cat.isActive ? 'border-cream-300' : 'border-stone-200 opacity-60'
              }`}
            >
              {/* Category Card Header Image */}
              <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-xs flex items-center justify-center text-lg shadow-sm">
                    {cat.icon}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-bold tracking-wider uppercase border border-white/20">
                    {cat.id}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      cat.isActive
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-stone-500 text-white'
                    }`}
                  >
                    {cat.isActive ? 'Visible' : 'Hidden'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-extrabold text-lg leading-tight drop-shadow-sm">{cat.name}</h3>
                  <span className="text-[11px] text-cream-200 font-medium">
                    {itemCount} Dishes Listed
                  </span>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-cream-200 flex items-center justify-between">
                  <button
                    onClick={() => updateCategoryConfig(cat.id, { isActive: !cat.isActive })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      cat.isActive
                        ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    {cat.isActive ? 'Hide from Menu' : 'Show in Menu'}
                  </button>

                  <button
                    onClick={() => openEditModal(cat)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-olive-50 hover:bg-olive-100 text-olive-800 rounded-xl text-xs font-bold transition-colors border border-olive-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Photo & Info</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-cream-300">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h3 className="font-black text-lg text-syzlo-charcoal">
                Edit Category: {editingCategory.id}
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-center text-lg font-medium focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-olive-500/20"
                  required
                />
              </div>

              {/* Upload Image or URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Category Image (Upload Device File or Image URL)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 border border-cream-300 text-xs font-bold text-syzlo-charcoal flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-4 h-4 text-olive-600" />
                    <span>Upload Picture</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs font-medium focus:ring-2 focus:ring-olive-500/20"
                    required
                  />
                </div>

                {image && (
                  <div className="mt-2 relative h-28 rounded-xl overflow-hidden border border-cream-300 shadow-xs">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Live Preview
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-cream-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2.5 rounded-xl border border-cream-300 text-xs font-bold text-stone-600 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-olive-600 hover:bg-olive-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
