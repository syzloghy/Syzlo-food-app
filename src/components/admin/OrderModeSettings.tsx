import React, { useEffect, useState } from 'react';
import { CheckCircle2, Save, Truck, ShoppingBag, Utensils } from 'lucide-react';

const STORAGE_KEY = 'syzlo_order_modes';

export interface OrderModes {
  delivery: boolean;
  takeaway: boolean;
  dineIn: boolean;
}

const DEFAULT_MODES: OrderModes = {
  delivery: true,
  takeaway: true,
  dineIn: true,
};

export const getOrderModes = (): OrderModes => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_MODES;

    return {
      ...DEFAULT_MODES,
      ...JSON.parse(saved),
    };
  } catch {
    return DEFAULT_MODES;
  }
};

export const OrderModeSettings: React.FC = () => {
  const [modes, setModes] = useState<OrderModes>(getOrderModes);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const refresh = () => setModes(getOrderModes());
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  const toggleMode = (mode: keyof OrderModes) => {
    setModes((current) => ({
      ...current,
      [mode]: !current[mode],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modes));
    window.dispatchEvent(new Event('syzlo-order-modes-updated'));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  const options = [
    {
      id: 'delivery' as const,
      title: 'Delivery',
      description: 'Allow customers to place delivery orders.',
      icon: Truck,
    },
    {
      id: 'takeaway' as const,
      title: 'Takeaway',
      description: 'Allow customers to order and collect from the outlet.',
      icon: ShoppingBag,
    },
    {
      id: 'dineIn' as const,
      title: 'Dine-in',
      description: 'Allow customers to place orders for dining at the outlet.',
      icon: Utensils,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#E5DED1] p-6">
        <h2 className="text-xl font-black text-[#20221A]">
          Order Type Settings
        </h2>
        <p className="text-sm text-stone-500 mt-2">
          Enable or disable the order types available to your customers.
        </p>
      </div>

          {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-sm font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Settings saved successfully.
        </div>
      )}

      <div className="space-y-3">
        {options.map((option) => {
          const Icon = option.icon;
          const enabled = modes[option.id];

          return (
            <div
              key={option.id}
              className="bg-white rounded-2xl border border-[#E5DED1] p-5 flex items-center gap-4 transition-all hover:border-[#565F28]/40"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F3F1E8] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#565F28]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#292B23]">
                  {option.title}
                </h3>

                <p className="text-xs text-stone-500 mt-1">
                  {option.description}
                </p>

                <span
                  className={`inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold ${
                    enabled ? 'text-[#565F28]' : 'text-stone-500'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      enabled ? 'bg-[#565F28]' : 'bg-stone-400'
                    }`}
                  />
                  {enabled ? 'Accepting orders' : 'Not accepting orders'}
                </span>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`${option.title} ${enabled ? 'enabled' : 'disabled'}`}
                onClick={() => toggleMode(option.id)}
                className={`relative w-[58px] h-[32px] rounded-full shrink-0 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-[#565F28]/20 ${
                  enabled ? 'bg-[#565F28]' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`absolute top-[4px] left-[4px] w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                    enabled ? 'translate-x-[26px]' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

     <button
  type="button"
  onClick={handleSave}
  className="w-full sm:w-auto min-w-[180px] px-6 py-3.5 bg-[#565F28] hover:bg-[#454D20] active:scale-[0.98] text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2"
>
  <Save className="w-4 h-4" />
  Save Changes
</button>
    </div>
  );
};
