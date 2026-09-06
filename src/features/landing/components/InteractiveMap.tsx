import { memo, useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, X } from 'lucide-react';
import { weddingConfig } from '@/config/wedding.config';

const { map: mapConfig, event } = weddingConfig;

const venueIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:40px;height:52px;filter:drop-shadow(0 6px 14px rgba(0,0,0,.45));animation:pinPulse 2s infinite;">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52" fill="none">
      <defs>
        <linearGradient id="goldPin" x1="8" y1="4" x2="32" y2="40" gradientUnits="userSpaceOnUse">
          <stop stop-color="#f2dfa0"/>
          <stop offset="0.45" stop-color="#e4c878"/>
          <stop offset="1" stop-color="#9a7835"/>
        </linearGradient>
      </defs>
      <path d="M20 0C10.06 0 2 8.06 2 18c0 11.2 18 34 18 34s18-22.8 18-34C38 8.06 29.94 0 20 0z" fill="url(#goldPin)" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>
      <circle cx="20" cy="18" r="6.5" fill="#1a1208" stroke="rgba(255,255,255,.35)" stroke-width="1"/>
    </svg>
  </div>
  <style>@keyframes pinPulse{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-2px) scale(1.05)}}</style>`,
  iconSize: [40, 52],
  iconAnchor: [20, 52],
  popupAnchor: [0, -54],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:20px;height:20px;border-radius:50%;
    background:#3b82f6;border:3px solid #fff;
    box-shadow:0 0 12px rgba(59,130,246,.7);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.Layer[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const distanceBadgeRef = useRef<HTMLElement | null>(null);

  const [status, setStatus] = useState<'idle' | 'locating' | 'routing' | 'ready' | 'denied' | 'error'>(
    'idle',
  );
  const [distanceKm, setDistanceKm] = useState<string | null>(null);
  const [usesFallbackRoute, setUsesFallbackRoute] = useState(false);
  const [isPanelHidden, setIsPanelHidden] = useState(false);

  const clearRouteArtifacts = useCallback(() => {
    const map = mapInstance.current;
    if (!map) return;

    routeLayersRef.current.forEach((layer) => map.removeLayer(layer));
    routeLayersRef.current = [];

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    distanceBadgeRef.current?.remove();
    distanceBadgeRef.current = null;
  }, []);

  const showDistanceBadge = useCallback((km: string, isFallback = false) => {
    if (!mapRef.current) return;

    distanceBadgeRef.current?.remove();

    const badge = document.createElement('div');
    badge.className = 'map-distance-badge';
    badge.innerHTML = `
      <div>المسافة: ${km} كم</div>
      ${isFallback ? '<div class="map-distance-badge__hint">*(من موقع تقريبي)</div>' : ''}
    `;
    mapRef.current.appendChild(badge);
    distanceBadgeRef.current = badge;
  }, []);

  const drawRoute = useCallback(
    async (startLat: number, startLng: number, isFallback = false) => {
      const map = mapInstance.current;
      if (!map) return;

      setStatus('routing');
      setUsesFallbackRoute(isFallback);
      clearRouteArtifacts();

      const straightDistance = haversineKm(startLat, startLng, mapConfig.lat, mapConfig.lng).toFixed(1);
      setDistanceKm(straightDistance);

      const userMarker = L.marker([startLat, startLng], { icon: userIcon })
        .addTo(map)
        .bindPopup(isFallback ? 'موقع تقريبي' : 'موقعك الحالي');
      userMarkerRef.current = userMarker;
      routeLayersRef.current.push(userMarker);

      if (!mapConfig.orsApiKey) {
        map.fitBounds(
          L.latLngBounds([
            [startLat, startLng],
            [mapConfig.lat, mapConfig.lng],
          ]),
          { padding: [60, 60] },
        );
        showDistanceBadge(straightDistance, isFallback);
        setStatus('ready');
        return;
      }

      try {
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${mapConfig.orsApiKey}&start=${startLng},${startLat}&end=${mapConfig.lng},${mapConfig.lat}`,
        );
        const data = await response.json();

        if (data.features?.length) {
          const coords: [number, number][] = data.features[0].geometry.coordinates.map(
            (coordinate: number[]) => [coordinate[1], coordinate[0]] as [number, number],
          );

          const glowLine = L.polyline(coords, {
            color: '#c9a24d',
            weight: 8,
            opacity: 0.25,
            lineCap: 'round',
          }).addTo(map);
          routeLayersRef.current.push(glowLine);

          const routeLine = L.polyline(coords, {
            color: '#c9a24d',
            weight: 4,
            opacity: 0.9,
            lineCap: 'round',
            dashArray: '12 8',
          }).addTo(map);
          routeLayersRef.current.push(routeLine);

          map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });

          const routeDistance = data.features[0].properties?.summary?.distance;
          const km = routeDistance ? (routeDistance / 1000).toFixed(1) : straightDistance;
          setDistanceKm(km);
          showDistanceBadge(km, isFallback);
        } else {
          showDistanceBadge(straightDistance, isFallback);
          map.fitBounds(
            L.latLngBounds([
              [startLat, startLng],
              [mapConfig.lat, mapConfig.lng],
            ]),
            { padding: [60, 60] },
          );
        }

        setStatus('ready');
      } catch {
        showDistanceBadge(straightDistance, isFallback);
        setStatus('error');
      }
    },
    [clearRouteArtifacts, showDistanceBadge],
  );

  const handleRequestRoute = useCallback(() => {
    setIsPanelHidden(false);

    if (!navigator.geolocation) {
      void drawRoute(mapConfig.defaultStartLat, mapConfig.defaultStartLng, true);
      return;
    }

    setStatus('locating');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void drawRoute(position.coords.latitude, position.coords.longitude);
      },
      () => setStatus('denied'),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  }, [drawRoute]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [mapConfig.lat, mapConfig.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });
    mapInstance.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const venueMarker = L.marker([mapConfig.lat, mapConfig.lng], { icon: venueIcon }).addTo(map);
    venueMarker
      .bindPopup(`
      <div style="font-family:Tajawal,sans-serif;text-align:center;direction:rtl;padding:4px 0">
        <h3 style="margin:0 0 6px;font-size:1.1rem;color:#c9a24d">حفل الزفاف</h3>
        <p style="margin:4px 0;color:#333;font-size:.9rem"><b>${event.venue}</b></p>
        <p style="margin:4px 0;color:#555;font-size:.85rem">${event.time}</p>
        <p style="margin:4px 0;color:#555;font-size:.85rem">${event.venueDetail}</p>
      </div>
    `)
      .openPopup();

    return () => {
      clearRouteArtifacts();
      map.remove();
      mapInstance.current = null;
    };
  }, [clearRouteArtifacts]);

  const googleMapsUrl =
    mapConfig.mapsUrl ??
    `https://www.google.com/maps/dir/?api=1&destination=${mapConfig.lat},${mapConfig.lng}`;
  const showActionPanel = !isPanelHidden && status !== 'locating' && status !== 'routing';

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="map-container" />

      {(status === 'locating' || status === 'routing') && (
        <div className="map-status-overlay">
          {status === 'locating' ? 'جارٍ تحديد موقعك...' : 'جارٍ حساب المسافة ورسم المسار...'}
        </div>
      )}

      {showActionPanel && status === 'idle' && (
        <div className="map-action-panel">
          <button
            type="button"
            className="map-action-panel__close"
            onClick={() => setIsPanelHidden(true)}
            aria-label="إغلاق"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
          <button type="button" className="btn-gold map-action-panel__primary" onClick={handleRequestRoute}>
            <Navigation size={18} strokeWidth={1.75} aria-hidden />
            حدّد موقعي واعرض المسار
          </button>
          <p className="map-action-panel__hint">اضغط للسماح بالموقع وحساب المسافة إلى القاعة</p>
        </div>
      )}

      {showActionPanel && status === 'denied' && (
        <div className="map-action-panel map-action-panel--warning">
          <button
            type="button"
            className="map-action-panel__close"
            onClick={() => setIsPanelHidden(true)}
            aria-label="إغلاق"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
          <p className="map-action-panel__message">لم يتم السماح بالوصول إلى موقعك.</p>
          <button type="button" className="btn-gold map-action-panel__primary" onClick={handleRequestRoute}>
            إعادة المحاولة
          </button>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="map-action-panel__link">
            <MapPin size={16} strokeWidth={1.75} aria-hidden />
            فتح المسار في Google Maps
          </a>
        </div>
      )}

      {showActionPanel && status === 'error' && (
        <div className="map-action-panel map-action-panel--warning">
          <button
            type="button"
            className="map-action-panel__close"
            onClick={() => setIsPanelHidden(true)}
            aria-label="إغلاق"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
          <p className="map-action-panel__message">تعذّر رسم المسار — تم عرض المسافة التقريبية.</p>
          <button type="button" className="btn-gold map-action-panel__primary" onClick={handleRequestRoute}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {showActionPanel && status === 'ready' && (
        <div className="map-ready-actions">
          <button
            type="button"
            className="map-ready-actions__close"
            onClick={() => setIsPanelHidden(true)}
            aria-label="إغلاق"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
          {usesFallbackRoute && (
            <p className="map-fallback-note">يظهر المسار من موقع تقريبي لعدم مشاركة الموقع</p>
          )}
          <div className="map-ready-actions__buttons">
            <button type="button" className="map-ready-actions__secondary" onClick={handleRequestRoute}>
              تحديث موقعي
            </button>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="map-ready-actions__secondary">
              فتح في Google Maps
            </a>
          </div>
          {distanceKm && <p className="map-ready-actions__distance">المسافة: {distanceKm} كم</p>}
        </div>
      )}

      {isPanelHidden && status !== 'locating' && status !== 'routing' && (
        <button type="button" className="map-panel-reopen" onClick={() => setIsPanelHidden(false)}>
          <Navigation size={16} strokeWidth={1.75} aria-hidden />
          خيارات المسار
        </button>
      )}
    </div>
  );
}

export default memo(InteractiveMap);
