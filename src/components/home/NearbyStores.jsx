// NearbyStores.jsx — Stores sorted by distance from the customer (if location known).
import React, { useMemo } from 'react'
import StoreCard from '../store/StoreCard'
import { useLanguage } from '../../hooks/useLanguage'
import { useUserLocation } from '../../hooks/useLocation'
import { haversineDistance } from '../../utils/maps'

export default function NearbyStores({ stores }) {
  const { t } = useLanguage()
  const { location } = useUserLocation()

  // Compute distances and sort when we know the user's location.
  const withDistance = useMemo(() => {
    if (!location) return []
    return stores
      .map((s) => ({ ...s, _distance: haversineDistance(location.lat, location.lng, s.lat, s.lng) }))
      .sort((a, b) => a._distance - b._distance)
      .slice(0, 8)
  }, [stores, location])

  if (!location || !withDistance.length) return null

  return (
    <section className="section container">
      <div className="section-header"><h2 style={{ margin: 0 }}>{t('nearbyStores')}</h2></div>
      <div className="grid-stores">
        {withDistance.map((s) => <StoreCard key={s.id} store={s} distance={s._distance} />)}
      </div>
    </section>
  )
}
