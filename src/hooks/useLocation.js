// useLocation.js — Convenience hook to access the user-location context.
// Named useUserLocation to avoid clashing with react-router's useLocation.
import { useContext } from 'react'
import { LocationContext } from '../contexts/LocationContext'

export function useUserLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useUserLocation must be used within a LocationProvider')
  return ctx
}
