// StoreMap.jsx — Leaflet + OpenStreetMap map showing the store location and delivery area.
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { useLanguage } from '../../hooks/useLanguage'

export default function StoreMap({ store }) {
  const { pick } = useLanguage()
  if (store?.lat == null || store?.lng == null) return null
  const center = [store.lat, store.lng]

  return (
    <div className="map-box">
      {/* MapContainer renders OSM tiles; no API key required. */}
      <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>{pick(store.name)}</Popup>
        </Marker>
        {/* Delivery radius overlay (km -> meters). */}
        {!store.allBangladeshDelivery && (
          <Circle
            center={center}
            radius={(store.deliveryRadius || 10) * 1000}
            pathOptions={{ color: '#1a6b3c', fillColor: '#1a6b3c', fillOpacity: 0.08 }}
          />
        )}
      </MapContainer>
    </div>
  )
}
