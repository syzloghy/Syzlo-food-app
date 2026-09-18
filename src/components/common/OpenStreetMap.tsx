import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, ZoomIn, ZoomOut, Compass, ExternalLink, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface OpenStreetMapProps {
  pinCoords?: { lat: number; lng: number };
  onPinSelect?: (coords: { lat: number; lng: number }, addressSnippet?: string) => void;
  interactive?: boolean;
  showRider?: boolean;
  riderCoords?: { lat: number; lng: number };
  heightClass?: string;
  showDeliveryZone?: boolean;
}

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  pinCoords,
  onPinSelect,
  interactive = true,
  showRider = false,
  riderCoords,
  heightClass = 'h-72 sm:h-96',
  showDeliveryZone = true,
}) => {
  const { osmConfig, brandConfig } = useApp();

  // Map center and zoom
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: pinCoords?.lat || osmConfig.centerLat,
    lng: pinCoords?.lng || osmConfig.centerLng,
  });
  const [zoom, setZoom] = useState<number>(14);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pinCoords) {
      setCenter({ lat: pinCoords.lat, lng: pinCoords.lng });
    }
  }, [pinCoords?.lat, pinCoords?.lng]);

  // Haversine formula to compute distance in km from restaurant
  const computeDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const targetCoords = pinCoords || center;
  const distanceKm = computeDistanceKm(
    osmConfig.centerLat,
    osmConfig.centerLng,
    targetCoords.lat,
    targetCoords.lng
  );
  const isWithinZone = distanceKm <= osmConfig.deliveryRadiusKm;

  // Slippy Map math: Convert (lat, lng, zoom) to tile coordinates
  const latLngToTile = (lat: number, lng: number, z: number) => {
    const n = Math.pow(2, z);
    const x = ((lng + 180) / 360) * n;
    const latRad = (lat * Math.PI) / 180;
    const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
    return { x, y };
  };

  // Convert pixel offset on map container to delta lat/lng
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onPinSelect || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - rect.width / 2;
    const clickY = e.clientY - rect.top - rect.height / 2;

    // Degrees per pixel at current zoom
    const metersPerPixel = (156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / Math.pow(2, zoom);
    const deltaLng = (clickX * metersPerPixel) / 111320;
    const deltaLat = -(clickY * metersPerPixel) / 110574;

    const newLat = Math.round((center.lat + deltaLat) * 100000) / 100000;
    const newLng = Math.round((center.lng + deltaLng) * 100000) / 100000;

    onPinSelect({ lat: newLat, lng: newLng });
  };

  // Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter({ lat, lng });
        if (onPinSelect) {
          onPinSelect({ lat, lng }, 'Current Device GPS Location');
        }
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  // Compute 3x3 tiles surrounding current center
  const centerTile = latLngToTile(center.lat, center.lng, zoom);
  const baseTileX = Math.floor(centerTile.x);
  const baseTileY = Math.floor(centerTile.y);
  const subX = (centerTile.x - baseTileX) * 256;
  const subY = (centerTile.y - baseTileY) * 256;

  const tileRange = [-1, 0, 1];

  // Convert coordinate to screen X,Y relative to container center
  const coordToPixel = (lat: number, lng: number) => {
    const tile = latLngToTile(lat, lng, zoom);
    const px = (tile.x - centerTile.x) * 256;
    const py = (tile.y - centerTile.y) * 256;
    return { px, py };
  };

  const restPixel = coordToPixel(osmConfig.centerLat, osmConfig.centerLng);
  const targetPixel = coordToPixel(targetCoords.lat, targetCoords.lng);
  const riderPixel = riderCoords ? coordToPixel(riderCoords.lat, riderCoords.lng) : null;

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={`relative w-full ${heightClass} rounded-2xl overflow-hidden bg-[#e8e0d5] border border-cream-300 shadow-inner select-none cursor-crosshair`}
    >
      {/* Tile Layer Container */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
        style={{
          transform: `translate(${-subX + 128}px, ${-subY + 128}px)`,
        }}
      >
        <div className="relative w-[768px] h-[768px]">
          {tileRange.map((dy) =>
            tileRange.map((dx) => {
              const tx = baseTileX + dx;
              const ty = baseTileY + dy;
              const maxTile = Math.pow(2, zoom);
              const wrappedTx = ((tx % maxTile) + maxTile) % maxTile;
              // OpenStreetMap Tile Server
              const tileUrl = `https://tile.openstreetmap.org/${zoom}/${wrappedTx}/${ty}.png`;

              return (
                <img
                  key={`${zoom}-${tx}-${ty}`}
                  src={tileUrl}
                  alt="OpenStreetMap Tile"
                  loading="lazy"
                  className="absolute w-[256px] h-[256px] object-cover filter saturate-90 brightness-98"
                  style={{
                    left: `${(dx + 1) * 256}px`,
                    top: `${(dy + 1) * 256}px`,
                  }}
                  onError={(e) => {
                    // Fallback to neutral placeholder if OSM tile fails
                    (e.target as HTMLElement).style.backgroundColor = '#EDE4D6';
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      {/* SVG Route & Markers Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="osm-route-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7A7B26" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <filter id="marker-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Route line connecting restaurant to delivery address */}
        <g transform="translate(0, 0)">
          {/* Center of container is (width/2, height/2) */}
          {containerRef.current && (
            <>
              {/* Route stroke */}
              <line
                x1={containerRef.current.clientWidth / 2 + restPixel.px}
                y1={containerRef.current.clientHeight / 2 + restPixel.py}
                x2={containerRef.current.clientWidth / 2 + targetPixel.px}
                y2={containerRef.current.clientHeight / 2 + targetPixel.py}
                stroke="#20221A"
                strokeWidth="5"
                strokeLinecap="round"
                strokeOpacity="0.25"
              />
              <line
                x1={containerRef.current.clientWidth / 2 + restPixel.px}
                y1={containerRef.current.clientHeight / 2 + restPixel.py}
                x2={containerRef.current.clientWidth / 2 + targetPixel.px}
                y2={containerRef.current.clientHeight / 2 + targetPixel.py}
                stroke="url(#osm-route-grad)"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
            </>
          )}
        </g>
      </svg>

      {/* Interactive HTML Markers */}
      {containerRef.current && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Restaurant Marker */}
          <div
            className="absolute -translate-x-1/2 -translate-y-full transition-transform"
            style={{
              left: `${containerRef.current.clientWidth / 2 + restPixel.px}px`,
              top: `${containerRef.current.clientHeight / 2 + restPixel.py}px`,
            }}
          >
            <div className="flex flex-col items-center group">
              <span className="px-2 py-0.5 rounded-md bg-[#20221A] text-white text-[10px] font-extrabold tracking-wider whitespace-nowrap shadow-md mb-1 border border-olive-500">
                SYZLO Kitchen
              </span>
              <div className="w-8 h-8 rounded-full bg-olive-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-olive-500/50">
                🥟
              </div>
            </div>
          </div>

          {/* Customer / Target Pin */}
          <div
            className="absolute -translate-x-1/2 -translate-y-full transition-transform"
            style={{
              left: `${containerRef.current.clientWidth / 2 + targetPixel.px}px`,
              top: `${containerRef.current.clientHeight / 2 + targetPixel.py}px`,
            }}
          >
            <div className="flex flex-col items-center animate-bounce">
              <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-bold whitespace-nowrap shadow-md mb-1">
                Delivery Pin
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-amber-400">
                <MapPin className="w-4 h-4 fill-white" />
              </div>
            </div>
          </div>

          {/* Rider Marker (if active) */}
          {showRider && riderPixel && (
            <div
              className="absolute -translate-x-1/2 -translate-y-full transition-all duration-700"
              style={{
                left: `${containerRef.current.clientWidth / 2 + riderPixel.px}px`,
                top: `${containerRef.current.clientHeight / 2 + riderPixel.py}px`,
              }}
            >
              <div className="flex flex-col items-center">
                <span className="px-2 py-0.5 rounded-md bg-olive-700 text-white text-[10px] font-extrabold whitespace-nowrap shadow-md mb-1 animate-pulse">
                  🛵 Rider Moving
                </span>
                <div className="w-9 h-9 rounded-full bg-[#7A7B26] text-white flex items-center justify-center shadow-xl border-2 border-white ring-3 ring-olive-400">
                  <Navigation className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Left: Free OSM Status & Distance Tag */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cream-300 shadow-sm flex items-center gap-2 text-xs font-semibold text-syzlo-charcoal">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-extrabold tracking-wide uppercase text-olive-700">OpenStreetMap Free Engine</span>
        </div>

        {showDeliveryZone && (
          <div
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm backdrop-blur-md ${
              isWithinZone
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-amber-50 text-amber-800 border border-amber-300'
            }`}
          >
            {isWithinZone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
            <span>
              {distanceKm} km from Hub {isWithinZone ? '(Deliverable)' : '(Out of Zone)'}
            </span>
          </div>
        )}
      </div>

      {/* Top Right: Zoom & Reset Controls */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.min(18, z + 1));
          }}
          className="w-8 h-8 rounded-xl bg-white/95 text-stone-700 hover:text-black border border-cream-300 shadow-sm flex items-center justify-center transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.max(11, z - 1));
          }}
          className="w-8 h-8 rounded-xl bg-white/95 text-stone-700 hover:text-black border border-cream-300 shadow-sm flex items-center justify-center transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCenter({ lat: osmConfig.centerLat, lng: osmConfig.centerLng });
          }}
          className="w-8 h-8 rounded-xl bg-white/95 text-stone-700 hover:text-black border border-cream-300 shadow-sm flex items-center justify-center transition-colors"
          title="Reset to Restaurant"
        >
          <Compass className="w-4 h-4 text-olive-600" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleGetLocation();
          }}
          className={`w-8 h-8 rounded-xl bg-white/95 text-stone-700 hover:text-black border border-cream-300 shadow-sm flex items-center justify-center transition-colors ${
            isLocating ? 'animate-spin' : ''
          }`}
          title="My Current GPS Location"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
        </button>
      </div>

      {/* Bottom OSM Map Compliance Attribution Notice (Strict Requirement) */}
      <div className="absolute bottom-2 right-2 z-30 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-[10px] text-stone-600 border border-stone-200/80 shadow-xs flex items-center gap-1 pointer-events-auto">
        <span>Map data</span>
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="text-olive-700 hover:underline font-bold inline-flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {osmConfig.attribution}
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {interactive && (
        <div className="absolute bottom-2 left-2 z-30 bg-black/70 text-white backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-medium shadow-xs">
          Click map to pin exact address
        </div>
      )}
    </div>
  );
};
