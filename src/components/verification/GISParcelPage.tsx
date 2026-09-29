import React, { useEffect, useRef, useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { GIS_PARCELS } from '../../data/mockData';
import { GISParcelData } from '../../types';
import L from 'leaflet';
import { 
  MapPin, 
  Search, 
  Layers, 
  Maximize2, 
  Info, 
  ShieldCheck, 
  ExternalLink,
  Building,
  CheckCircle2,
  Compass
} from 'lucide-react';

export const GISParcelPage: React.FC = () => {
  const { navigateToRecordReview, records } = useLandRecord();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayersRef = useRef<{ [key: string]: L.Polygon }>({});

  const [selectedParcel, setSelectedParcel] = useState<GISParcelData>(GIS_PARCELS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSurveyBoundaries, setShowSurveyBoundaries] = useState(true);
  const [showVillageBoundary, setShowVillageBoundary] = useState(true);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // prevent multiple inits

    // Center on Wagholi cadastral cluster (Pune, MH)
    const map = L.map(mapContainerRef.current, {
      center: [18.5793, 73.9812],
      zoom: 16,
      zoomControl: true
    });
    mapInstanceRef.current = map;

    // High quality OpenStreetMap cartographic base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | DILRMP Cadastre',
      maxZoom: 19,
    }).addTo(map);

    // Draw Village Boundary Outer Polyline
    const villageOuterCoords: [number, number][] = [
      [18.5855, 73.9740],
      [18.5865, 73.9910],
      [18.5730, 73.9920],
      [18.5720, 73.9750],
      [18.5855, 73.9740]
    ];

    const villagePoly = L.polygon(villageOuterCoords, {
      color: '#0f172a',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#3b82f6',
      fillOpacity: 0.03
    }).addTo(map);

    villagePoly.bindTooltip('Wagholi Revenue Mouza Boundary', { permanent: false });

    // Draw Parcels
    GIS_PARCELS.forEach((parcel) => {
      const isSelected = parcel.id === GIS_PARCELS[0].id;
      const poly = L.polygon(parcel.coordinates, {
        color: isSelected ? '#2563eb' : '#059669',
        weight: isSelected ? 4 : 2,
        fillColor: isSelected ? '#3b82f6' : '#10b981',
        fillOpacity: isSelected ? 0.45 : 0.25,
      }).addTo(map);

      poly.bindTooltip(`Survey ${parcel.surveyNumber} (${parcel.ownerName})`, {
        sticky: true,
        className: 'text-xs font-semibold'
      });

      poly.on('click', () => {
        setSelectedParcel(parcel);
      });

      polygonLayersRef.current[parcel.id] = poly;
    });

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update polygon highlighting when selected parcel changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    GIS_PARCELS.forEach((p) => {
      const poly = polygonLayersRef.current[p.id];
      if (!poly) return;

      const isCurrent = p.id === selectedParcel.id;
      poly.setStyle({
        color: isCurrent ? '#2563eb' : '#059669',
        weight: isCurrent ? 4 : 2,
        fillColor: isCurrent ? '#3b82f6' : '#10b981',
        fillOpacity: isCurrent ? 0.45 : 0.25,
      });

      if (isCurrent) {
        poly.bringToFront();
      }
    });

    // Pan to centroid
    mapInstanceRef.current.panTo(selectedParcel.centroid, { animate: true });
  }, [selectedParcel]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const lower = searchQuery.toLowerCase();
    const match = GIS_PARCELS.find(p => 
      p.surveyNumber.toLowerCase().includes(lower) ||
      p.ulpin.toLowerCase().includes(lower) ||
      p.ownerName.toLowerCase().includes(lower)
    );

    if (match) {
      setSelectedParcel(match);
    } else {
      alert(`No parcel found matching "${searchQuery}". Try "142/2A" or "Suresh".`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Survey #, ULPIN, or Owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-2xs"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            Locate
          </button>
        </form>
      </div>

      {/* Map + Side Info Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Leaflet Map Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[650px]">
          {/* Map Controls Header */}
          <div className="p-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Compass className="w-4 h-4" />
                Cadastral Survey Layer: Wagholi (Pune, MH)
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showSurveyBoundaries}
                  onChange={(e) => setShowSurveyBoundaries(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Survey Boundaries</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showVillageBoundary}
                  onChange={(e) => setShowVillageBoundary(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Village Boundary</span>
              </label>
            </div>
          </div>

          {/* Leaflet Container */}
          <div ref={mapContainerRef} className="flex-1 w-full h-full z-10" />

          {/* Map Footer Legend */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-500 border border-blue-700"></span>
                <span>Selected Parcel</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-700"></span>
                <span>Verified Cadastre</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-slate-800"></span>
                <span>Village Mouza Outer Border</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Click any polygon boundary to view property deed details
            </span>
          </div>
        </div>

        {/* Parcel Information Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5 flex flex-col justify-between h-[650px] overflow-y-auto">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Cadastral Parcel Attributes
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center justify-between">
                <span>Survey #{selectedParcel.surveyNumber}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                  {selectedParcel.status}
                </span>
              </h3>
            </div>

            {/* ULPIN Highlight Box */}
            <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                Bhu-Aadhaar ULPIN
              </span>
              <div className="font-mono font-bold text-emerald-400 text-sm tracking-wider">
                {selectedParcel.ulpin}
              </div>
            </div>

            {/* Key Field Attributes */}
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Titleholder / Owner:</span>
                <strong className="text-slate-900">{selectedParcel.ownerName}</strong>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Revenue Mouza:</span>
                <strong className="text-slate-900">{selectedParcel.village}</strong>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Tehsil & District:</span>
                <strong className="text-slate-900">{selectedParcel.tehsil}, {selectedParcel.district}</strong>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Spatial Land Area:</span>
                <strong className="text-slate-900">{selectedParcel.area}</strong>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Classification:</span>
                <strong className="text-slate-900">{selectedParcel.classification}</strong>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Centroid Coordinates:</span>
                <strong className="font-mono text-slate-900">
                  {selectedParcel.centroid[0].toFixed(4)}° N, {selectedParcel.centroid[1].toFixed(4)}° E
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Action in Panel */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => {
                const rec = records.find(r => r.fields.surveyNumber.value.includes(selectedParcel.surveyNumber)) || records[0];
                navigateToRecordReview(rec.id);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Inspect Linked Land Record</span>
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Synchronized with Survey of India & DILRMP Geo-Server
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
