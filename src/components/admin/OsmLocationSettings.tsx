import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenStreetMap } from '../common/OpenStreetMap';
import {
  MapPin,
  Compass,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Save,
  Globe,
  Navigation,
} from 'lucide-react';

export const OsmLocationSettings: React.FC = () => {
  const { osmConfig, updateOsmConfig } = useApp();

  const [centerLat, setCenterLat] = useState(osmConfig.centerLat);
  const [centerLng, setCenterLng] = useState(osmConfig.centerLng);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(osmConfig.deliveryRadiusKm);
  const [attribution, setAttribution] = useState(osmConfig.attribution);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOsmConfig({
      centerLat: Number(centerLat),
      centerLng: Number(centerLng),
      deliveryRadiusKm: Number(deliveryRadiusKm),
      attribution,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-xs">
        <h2 className="text-xl font-black text-syzlo-charcoal flex items-center gap-2">
          <Globe className="w-5 h-5 text-olive-600" />
          Free OpenStreetMap (OSM) & Location Compliance
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure SYZLO Kitchen's geographic hub, delivery range calculations, and OpenStreetMap license compliance.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Location settings and delivery zone updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Settings */}
        <div className="bg-white p-6 rounded-2xl border border-cream-300 shadow-xs">
          <h3 className="text-sm font-black text-syzlo-charcoal mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-olive-600" />
            Kitchen Coordinates & Delivery Parameters
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.00001"
                  value={centerLat}
                  onChange={(e) => setCenterLat(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 font-mono text-xs font-bold focus:ring-2 focus:ring-olive-500/20"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.00001"
                  value={centerLng}
                  onChange={(e) => setCenterLng(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 font-mono text-xs font-bold focus:ring-2 focus:ring-olive-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">
                  Maximum Delivery Service Radius: <span className="text-olive-700">{deliveryRadiusKm} km</span>
                </label>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={deliveryRadiusKm}
                onChange={(e) => setDeliveryRadiusKm(Number(e.target.value))}
                className="w-full accent-olive-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-semibold mt-1">
                <span>3 km (Hyperlocal)</span>
                <span>12 km (City core)</span>
                <span>25 km (Metro radius)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                OSM Compliance Attribution Notice
              </label>
              <input
                type="text"
                value={attribution}
                onChange={(e) => setAttribution(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs font-medium focus:ring-2 focus:ring-olive-500/20"
                required
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Mandatory under Open Data Commons Open Database License (ODbL). Rendered on all maps.
              </p>
            </div>

            {/* Compliance Badge */}
            <div className="p-4 bg-cream-100 rounded-xl border border-cream-300 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-syzlo-charcoal">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero-Cost Open-Source Map Compliance</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Uses the official OpenStreetMap Foundation tile servers with client-side spherical trigonometry for distance calculation. Completely eliminates expensive third-party Google Maps billing.
              </p>
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-olive-700 hover:underline"
              >
                <span>Read OpenStreetMap ODbL Guidelines</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-olive-600 hover:bg-olive-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Apply Location Changes</span>
            </button>
          </form>
        </div>

        {/* Live Interactive Map Preview */}
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-cream-300 shadow-xs">
            <h3 className="text-xs font-black text-syzlo-charcoal mb-2 flex items-center justify-between">
              <span>Live OpenStreetMap Preview (Click to test pin dropping)</span>
              <span className="text-[10px] text-stone-400 font-mono">Zoom: 14x</span>
            </h3>

            <OpenStreetMap
              pinCoords={{ lat: centerLat, lng: centerLng }}
              onPinSelect={(coords) => {
                setCenterLat(coords.lat);
                setCenterLng(coords.lng);
              }}
              heightClass="h-80 sm:h-96"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
