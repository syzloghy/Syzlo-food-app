import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentGatewayConfig } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Key,
  ShieldCheck,
  Save,
  Lock,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';

export const PaymentGatewaysSettings: React.FC = () => {
  const { paymentGateways, updatePaymentGateway, togglePaymentGateway } = useApp();

  const [revealedSecrets, setRevealedSecrets] = useState<{ [key: string]: boolean }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdate = (id: PaymentGatewayConfig['id'], updates: Partial<PaymentGatewayConfig>) => {
    updatePaymentGateway(id, updates);
    setSuccessMessage(`Updated ${id} gateway configuration.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-xs">
        <h2 className="text-xl font-black text-syzlo-charcoal flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-olive-600" />
          Payment Gateways & Checkout Integration
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage integrations for Razorpay, Cashfree, Direct UPI QR, and Cash on Delivery. Active methods appear directly in the customer checkout drawer.
        </p>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {paymentGateways.map((gw) => {
          const isRevealed = !!revealedSecrets[gw.id];

          return (
            <div
              key={gw.id}
              className={`rounded-2xl border bg-white p-5 shadow-xs flex flex-col justify-between transition-all ${
                gw.isEnabled ? 'border-cream-300 ring-1 ring-olive-500/20' : 'border-stone-200 opacity-65'
              }`}
            >
              <div>
                {/* Header of card */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-cream-200">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-olive-100 flex items-center justify-center text-xl shadow-2xs">
                      {gw.icon || '💳'}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-syzlo-charcoal">{gw.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            gw.isEnabled
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {gw.isEnabled ? 'Active in Checkout' : 'Disabled'}
                        </span>
                        {gw.isTestMode && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            Sandbox / Test Mode
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => togglePaymentGateway(gw.id)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                      gw.isEnabled ? 'bg-olive-600' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        gw.isEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-stone-600 mt-3 leading-relaxed">{gw.description}</p>

                {/* Gateway Specific Credentials Inputs */}
                {(gw.id === 'RAZORPAY' || gw.id === 'CASHFREE') && (
                  <div className="mt-4 space-y-3 bg-stone-50 p-3.5 rounded-xl border border-cream-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-stone-700 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-olive-600" />
                        API Credentials
                      </span>
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gw.isTestMode}
                          onChange={(e) => handleUpdate(gw.id, { isTestMode: e.target.checked })}
                          className="rounded text-olive-600 w-3.5 h-3.5"
                        />
                        <span>Sandbox Test Mode</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        {gw.id === 'RAZORPAY' ? 'Key ID (Public)' : 'App ID'}
                      </label>
                      <input
                        type="text"
                        value={gw.keyId || ''}
                        onChange={(e) => handleUpdate(gw.id, { keyId: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-cream-300 font-mono text-xs focus:ring-2 focus:ring-olive-500/20"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-stone-600">Secret Key (server-side only)</label><p className="mt-1 text-[10px] text-amber-700">Do not enter a live secret here. Payment secrets must be stored on the backend.</p>
                        <button
                          type="button"
                          onClick={() => toggleReveal(gw.id)}
                          className="text-[10px] font-bold text-olive-700 hover:underline flex items-center gap-1"
                        >
                          {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{isRevealed ? 'Hide' : 'Reveal'}</span>
                        </button>
                      </div>
                      <input
                        type={isRevealed ? 'text' : 'password'}
                        value={gw.secretKey || ''}
                        onChange={(e) => handleUpdate(gw.id, { secretKey: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-cream-300 font-mono text-xs focus:ring-2 focus:ring-olive-500/20"
                      />
                    </div>
                  </div>
                )}

                {gw.id === 'UPI_QR' && (
                  <div className="mt-4 space-y-3 bg-stone-50 p-3.5 rounded-xl border border-cream-200">
                    <span className="text-xs font-extrabold text-stone-700 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      Merchant VPA Handle
                    </span>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        Virtual Payment Address (VPA)
                      </label>
                      <input
                        type="text"
                        value={gw.keyId || 'syzlo@okaxis'}
                        onChange={(e) => handleUpdate(gw.id, { keyId: e.target.value })}
                        placeholder="e.g. syzlo@okaxis, restaurant@upi"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-cream-300 font-mono text-xs focus:ring-2 focus:ring-olive-500/20"
                      />
                    </div>
                    <p className="text-[10px] text-stone-500">
                      Customers will see a dynamic QR code pre-filled with the exact order grand total.
                    </p>
                  </div>
                )}

                {gw.id === 'CASH_ON_DELIVERY' && (
                  <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-cream-200 text-[11px] text-stone-600">
                    Supports counter payment for Pickups / Dine-In and cash collection by riders for home deliveries.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-cream-200 flex items-center justify-between text-xs font-semibold text-stone-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  PCI-DSS Encrypted Simulation
                </span>
                <span className="text-olive-700 font-bold">Auto-Synced</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
