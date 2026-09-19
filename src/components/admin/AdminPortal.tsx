import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  ChefHat,
  Monitor,
  Tv,
  LogOut,
  LockKeyhole,
} from 'lucide-react';

import { supabase } from '../../lib/supabase';
import { AdminLayout } from './AdminLayout';
import { KitchenDisplaySystem } from '../kds/KitchenDisplaySystem';
import { PointOfSale } from '../pos/PointOfSale';

type AdminModule = 'admin' | 'kds' | 'pos' | 'display';

export const AdminPortal: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedModule, setSelectedModule] = useState<AdminModule | null>(null);
  const [pinVerified, setPinVerified] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error || !data.user) {
      setError('Invalid email or password.');
      return;
    }

    setAuthenticated(true);
  };

  const handleModuleSelect = (module: AdminModule) => {
    setSelectedModule(module);
    setPin('');
    setPinVerified(false);
    setError('');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(pin)) {
      setError('Enter a valid 6-digit PIN.');
      return;
    }

    /*
      Temporary UI gate.

      IMPORTANT:
      This is NOT the final secure PIN verification.
      We will replace this with a Supabase database/RPC
      verification before production.
    */
    setPinVerified(true);
    setError('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setAuthenticated(false);
    setSelectedModule(null);
    setPinVerified(false);
    setEmail('');
    setPassword('');
    setPin('');
    setError('');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-cream-200 shadow-xl p-6 sm:p-8">
            <div className="text-center mb-7">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-olive-600 text-white flex items-center justify-center shadow-lg mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <h1 className="text-2xl font-black text-syzlo-charcoal">
                SYZLO ADMIN
              </h1>

              <p className="text-sm text-stone-500 mt-1">
                Secure management portal
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Admin email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-olive-600 hover:bg-olive-700 disabled:opacity-60 text-white font-black transition-colors"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (selectedModule && !pinVerified) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl border border-cream-200 shadow-xl p-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-olive-600 text-white flex items-center justify-center mb-3">
                <LockKeyhole className="w-7 h-7" />
              </div>

              <h2 className="text-xl font-black text-syzlo-charcoal">
                Module Access
              </h2>

              <p className="text-sm text-stone-500 mt-1">
                Enter your 6-digit access PIN
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPin(value);
                  setError('');
                }}
                placeholder="••••••"
                autoFocus
                className="w-full text-center tracking-[0.6em] text-2xl font-black px-4 py-4 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500"
              />

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-olive-600 hover:bg-olive-700 text-white font-black"
              >
                Unlock
              </button>

              <button
                type="button"
               onClick={() => {
  setSelectedModule(null);
  setPinVerified(false);
  setError('');
  setPin('');
}}
                className="w-full py-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-stone-700 font-bold"
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (pinVerified && selectedModule === 'admin') {
    return <AdminLayout />;
  }

  if (pinVerified && selectedModule === 'kds') {
    return <KitchenDisplaySystem />;
  }

  if (pinVerified && selectedModule === 'pos') {
    return <PointOfSale />;
  }

  if (pinVerified && selectedModule === 'display') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Tv className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-black">CUSTOMER DISPLAY</h1>
          <p className="text-stone-400 mt-2">
            Token display will be connected next.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-syzlo-charcoal">
              SYZLO ADMIN
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Select a system to access
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-cream-200 text-stone-600 hover:bg-cream-100 text-sm font-bold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <button
            onClick={() => handleModuleSelect('admin')}
            className="bg-white rounded-3xl border border-cream-200 shadow-sm hover:shadow-lg p-6 text-left transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-olive-100 text-olive-700 flex items-center justify-center mb-5">
              <LayoutDashboard className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black">ADMIN</h2>
            <p className="text-sm text-stone-500 mt-1">
              Menu, categories, orders, coupons, settings and reports.
            </p>
          </button>

          <button
            onClick={() => handleModuleSelect('kds')}
            className="bg-white rounded-3xl border border-cream-200 shadow-sm hover:shadow-lg p-6 text-left transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mb-5">
              <ChefHat className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black">KDS</h2>
            <p className="text-sm text-stone-500 mt-1">
              Kitchen order management and preparation status.
            </p>
          </button>

          <button
            onClick={() => handleModuleSelect('pos')}
            className="bg-white rounded-3xl border border-cream-200 shadow-sm hover:shadow-lg p-6 text-left transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
              <Monitor className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black">POS</h2>
            <p className="text-sm text-stone-500 mt-1">
              Dine-in, takeaway, payment and order creation.
            </p>
          </button>

          <button
            onClick={() => handleModuleSelect('display')}
            className="bg-white rounded-3xl border border-cream-200 shadow-sm hover:shadow-lg p-6 text-left transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
              <Tv className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black">CUSTOMER DISPLAY</h2>
            <p className="text-sm text-stone-500 mt-1">
              Public order-token display for the outlet.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
