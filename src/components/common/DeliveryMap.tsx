import React from 'react';
import { RESTAURANT_LOCATION } from '../../data/mockData';
import { Navigation, Store, Home, MapPin } from 'lucide-react';

interface DeliveryMapProps {
  riderCoords?: { lat: number; lng: number };
  customerCoords?: { lat: number; lng: number };
  interactivePinPicker?: boolean;
  onSelectCoords?: (coords: { lat: number; lng: number }) => void;
  heightClass?: string;
  statusText?: string;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
  riderCoords,
  customerCoords = { lat: 19.0650, lng: 72.8270 },
  interactivePinPicker = false,
  onSelectCoords,
  heightClass = 'h-64 sm:h-80',
  statusText = 'Live Route Tracking',
}) => {
  // Map bounds normalization for Bandra / Mumbai coordinates
  // Restaurant: 19.0558, 72.8295
  const baseLat = RESTAURANT_LOCATION.lat;
  const baseLng = RESTAURANT_LOCATION.lng;

  // Convert GPS coordinates to 1000x600 SVG canvas space
  const projectToSvg = (lat: number, lng: number) => {
    // scale factor
    const dLat = (lat - baseLat) * 3500;
    const dLng = (lng - baseLng) * 3500;

    // Center at 450, 320
    const x = Math.max(60, Math.min(840, 450 + dLng));
    const y = Math.max(50, Math.min(480, 320 - dLat));
    return { x, y };
  };

  const restPos = projectToSvg(baseLat, baseLng);
  const custPos = projectToSvg(customerCoords.lat, customerCoords.lng);
  const riderPos = riderCoords ? projectToSvg(riderCoords.lat, riderCoords.lng) : null;

  // SVG road waypoint coordinates
  const midPointX = (restPos.x + custPos.x) / 2 + 35;
  const midPointY = (restPos.y + custPos.y) / 2 - 25;

  const routePathD = `M ${restPos.x} ${restPos.y} Q ${midPointX} ${midPointY} ${custPos.x} ${custPos.y}`;

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactivePinPicker || !onSelectCoords) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 900;
    const clickY = ((e.clientY - rect.top) / rect.height) * 540;

    // Invert projection
    const dLng = (clickX - 450) / 3500;
    const dLat = (320 - clickY) / 3500;
    onSelectCoords({
      lat: baseLat + dLat,
      lng: baseLng + dLng,
    });
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden bg-[#F2ECE1] border border-[#E3D4C0] shadow-inner select-none`}>
      {/* Top Map Header Badge */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-cream-300 shadow-sm flex items-center gap-2 text-xs font-semibold text-syzlo-charcoal">
        <span className="w-2 h-2 rounded-full bg-olive-500 animate-ping" />
        <Navigation className="w-3.5 h-3.5 text-olive-600" />
        <span>{statusText}</span>
      </div>

      {interactivePinPicker && (
        <div className="absolute top-3 right-3 z-10 bg-olive-500 text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm">
          Tap anywhere to pin address
        </div>
      )}

      {/* SVG Canvas Map */}
      <svg
        viewBox="0 0 900 540"
        className="w-full h-full cursor-crosshair"
        onClick={handleMapClick}
      >
        {/* Decorative Grid & Neighborhood Zones */}
        <defs>
          <pattern id="city-blocks" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="90" height="90" rx="8" fill="#EDE4D6" opacity="0.75" />
          </pattern>
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7A7B26" />
            <stop offset="100%" stopColor="#E09F3E" />
          </linearGradient>
        </defs>

        {/* Background city blocks */}
        <rect width="900" height="540" fill="#F4EDE3" />
        <rect width="900" height="540" fill="url(#city-blocks)" opacity="0.6" />

        {/* Major Avenue / Road Networks */}
        <path d="M 0 160 Q 300 180 900 140" stroke="#FFFFFF" strokeWidth="24" fill="none" opacity="0.9" />
        <path d="M 0 380 Q 400 360 900 400" stroke="#FFFFFF" strokeWidth="24" fill="none" opacity="0.9" />
        <path d="M 220 0 Q 240 300 200 540" stroke="#FFFFFF" strokeWidth="20" fill="none" opacity="0.9" />
        <path d="M 520 0 Q 560 260 540 540" stroke="#FFFFFF" strokeWidth="22" fill="none" opacity="0.9" />
        <path d="M 720 0 Q 700 280 740 540" stroke="#FFFFFF" strokeWidth="18" fill="none" opacity="0.9" />

        {/* Street Labels */}
        <text x="230" y="30" fill="#9C8E7B" fontSize="11" fontWeight="600" letterSpacing="1">HILL ROAD</text>
        <text x="535" y="30" fill="#9C8E7B" fontSize="11" fontWeight="600" letterSpacing="1">LINKING ROAD</text>
        <text x="50" y="175" fill="#9C8E7B" fontSize="11" fontWeight="600" letterSpacing="1">TURNER ROAD</text>
        <text x="60" y="395" fill="#9C8E7B" fontSize="11" fontWeight="600" letterSpacing="1">CARTER ROAD</text>

        {/* Route Path */}
        <path
          d={routePathD}
          stroke="#FFFFFF"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={routePathD}
          stroke="url(#route-gradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="8 6"
          className="animate-[dash_2s_linear_infinite]"
        />

        {/* SYZLO Restaurant Pin */}
        <g transform={`translate(${restPos.x}, ${restPos.y})`}>
          <circle r="22" fill="#7A7B26" fillOpacity="0.25" className="animate-ping" />
          <circle r="16" fill="#7A7B26" stroke="#FFFFFF" strokeWidth="3" />
          <foreignObject x="-12" y="-12" width="24" height="24">
            <div className="flex items-center justify-center w-full h-full text-white">
              <Store className="w-3.5 h-3.5" />
            </div>
          </foreignObject>
          <rect x="-38" y="20" width="76" height="20" rx="4" fill="#20221A" />
          <text x="0" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700">SYZLO HUB</text>
        </g>

        {/* Customer Destination Pin */}
        <g transform={`translate(${custPos.x}, ${custPos.y})`}>
          <circle r="20" fill="#E09F3E" fillOpacity="0.2" />
          <circle r="15" fill="#E09F3E" stroke="#FFFFFF" strokeWidth="3" />
          <foreignObject x="-10" y="-10" width="20" height="20">
            <div className="flex items-center justify-center w-full h-full text-white">
              <Home className="w-3.5 h-3.5" />
            </div>
          </foreignObject>
          <rect x="-42" y="20" width="84" height="20" rx="4" fill="#20221A" />
          <text x="0" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700">DESTINATION</text>
        </g>

        {/* Rider Marker (if available) */}
        {riderPos && (
          <g transform={`translate(${riderPos.x}, ${riderPos.y})`}>
            <circle r="24" fill="#3B82F6" fillOpacity="0.25" className="animate-pulse" />
            <circle r="16" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
            <foreignObject x="-12" y="-12" width="24" height="24">
              <div className="flex items-center justify-center w-full h-full text-white text-xs font-bold">
                🛵
              </div>
            </foreignObject>
            <rect x="-34" y="-32" width="68" height="18" rx="4" fill="#1E3A8A" />
            <text x="0" y="-20" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700">RIDER AARAV</text>
          </g>
        )}
      </svg>

      {/* Map Scale & Legend Footer */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-cream-200 text-[11px] font-medium text-stone-700 shadow-sm flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-olive-500 inline-block" /> Kitchen
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Live Rider
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> You
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cream-200 text-[10px] font-semibold text-stone-500 shadow-sm flex items-center gap-1">
          <MapPin className="w-3 h-3 text-olive-600" />
          <span>Bandra West Hub</span>
        </div>
      </div>
    </div>
  );
};
