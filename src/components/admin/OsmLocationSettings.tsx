import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenStreetMap } from '../common/OpenStreetMap';
import {
  MapPin,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Save,
  Globe,
} from 'lucide-react';

const STORAGE_KEY = 'syzlo_outlet_settings';

type OutletSettings = {
  kitchenAddress: string;
  centerLat: number;
  centerLng: number;
  deliveryRadiusKm: number;
  attribution: string;
};

export const OsmLocationSettings: React.FC = () => {
  const { osmConfig, updateOsmConfig } = useApp();

  const [kitchenAddress, setKitchenAddress] = useState(
    osmConfig.kitchenAddress || 'Sixmile, Guwahati, Assam 781022'
  );
  const [centerLat, setCenterLat] = useState(osmConfig.centerLat);
  const [centerLng, setCenterLng] = useState(osmConfig.centerLng);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(
    osmConfig.deliveryRadiusKm
  );
  const [attribution, setAttribution] = useState(osmConfig.attribution);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Load saved settings when the component opens.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const settings = JSON.parse(stored) as Partial<OutletSettings>;

      if (typeof settings.kitchenAddress === 'string') {
        setKitchenAddress(settings.kitchenAddress);
      }
      if (
        typeof settings.centerLat === 'number' &&
        Number.isFinite(settings.centerLat)
      ) {
        setCenterLat(settings.centerLat);
      }
      if (
        typeof settings.centerLng === 'number' &&
        Number.isFinite(settings.centerLng)
      ) {
        setCenterLng(settings.centerLng);
      }
      if (
        typeof settings.deliveryRadiusKm === 'number' &&
        Number.isFinite(settings.deliveryRadiusKm)
      ) {
        setDeliveryRadiusKm(settings.deliveryRadiusKm);
      }
      if (typeof settings.attribution === 'string') {
        setAttribution(settings.attribution);
      }
    } catch {
      setError('Could not load saved outlet settings.');
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);

    const lat = Number(centerLat);
    const lng = Number(centerLng);
    const radius = Number(deliveryRadiusKm);

    if (!kitchenAddress.trim()) {
      setError('Please enter the outlet address.');
      return;
    }

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      setError('Please enter a valid latitude between -90 and 90.');
      return;
    }

    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      setError('Please enter a valid longitude between -180 and 180.');
      return;
    }

    if (!Number.isFinite(radius) || radius < 3 || radius > 25) {
      setError('Delivery radius must be between 3 and 25 km.');
      return;
    }

    const settings: OutletSettings = {
      kitchenAddress: kitchenAddress.trim(),
      centerLat: lat,
      centerLng: lng,
      deliveryRadiusKm: radius,
      attribution,
    };

    try {
      // Save to this browser.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

      // Update the app's existing location configuration.
      updateOsmConfig({
        centerLat: lat,
        centerLng: lng,
        deliveryRadiusKm: radius,
        attribution,
        kitchenAddress: settings.kitchenAddress,
      });

      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Could not save settings in this browser.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-xs">
        <h2 className="text-xl font-black text-syzlo-charcoal flex items-center gap-2">
          <Globe className="w-5 h-5 text-olive-600" />
          Outlet Location & Delivery Settings
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Configure the SYZLO outlet address, map location and delivery radius.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Outlet settings saved successfully in this browser.</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs font-bold text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-cream-300 shadow-xs">
          <h3 className="text-sm font-black text-syzlo-charcoal mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-olive-600" />
            Outlet Details
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Outlet Name
              </label>
              <input
                type="text"
                value="SYZLO"
                readOnly
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-stone-50 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Outlet Address
              </label>
              <textarea
                value={kitchenAddress}
                onChange={(e) => setKitchenAddress(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs font-medium focus:ring-2 focus:ring-olive-500/20"
                placeholder="Sixmile, Guwahati, Assam 781022"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={centerLat}
                  onChange={(e) => setCenterLat(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 font-mono text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={centerLng}
                  onChange={(e) => setCenterLng(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 font-mono text-xs font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Maximum Delivery Radius:{' '}
                <span className="text-olive-700">
                  {deliveryRadiusKm} km
                </span>
              </label>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={deliveryRadiusKm}
                onChange={(e) =>
                  setDeliveryRadiusKm(Number(e.target.value))
                }
                className="w-full accent-olive-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-semibold mt-1">
                <span>3 km</span>
                <span>12 km</span>
                <span>25 km</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                OSM Attribution
              </label>
              <input
                type="text"
                value={attribution}
                onChange={(e) => setAttribution(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs font-medium"
                required
              />
            </div>

            <div className="p-4 bg-cream-100 rounded-xl border border-cream-300 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-syzlo-charcoal">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>OpenStreetMap</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                The current delivery configuration uses a radius around the
                outlet. Map-drawn delivery zones are a separate future feature.
              </p>
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-olive-700 hover:underline"
              >
                <span>OpenStreetMap attribution information</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-olive-600 hover:bg-olive-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Outlet Settings</span>
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-cream-300 shadow-xs">
            <h3 className="text-xs font-black text-syzlo-charcoal mb-2">
              Outlet Map Preview
            </h3>

            <OpenStreetMap
              pinCoords={{ lat: centerLat, lng: centerLng }}
              onPinSelect={(coords) => {
                setCenterLat(coords.lat);
                setCenterLng(coords.lng);
              }}
              heightClass="h-80 sm:h-96"
            />
            <p className="text-[10px] text-stone-500 mt-2">
              Click the map to adjust the outlet pin, then save your changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
