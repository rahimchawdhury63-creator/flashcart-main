// HomePage.jsx — Landing page: hero, categories, featured/nearby stores, top items.

import React, { useEffect, useState } from 'react'
import SEOHead from '../components/common/SEOHead'
import HeroSection from '../components/home/HeroSection'
import CategoryGrid from '../components/home/CategoryGrid'
import FeaturedStores from '../components/home/FeaturedStores'
import NearbyStores from '../components/home/NearbyStores'
import TopItems from '../components/home/TopItems'
import BannerSlider from '../components/home/BannerSlider'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { fetchStores, fetchItems } from '../utils/dataService'
import { rankStores, rankItems } from '../utils/ranking'
import { useSEO } from '../hooks/useSEO'

export default function HomePage() {
  const [stores, setStores] = useState([])
  const [topItems, setTopItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Load stores + a sample of items for the "popular" section on mount.
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const all = await fetchStores()
      if (!mounted) return
      const ranked = rankStores(all)
      setStores(ranked)

      // Gather items from the top stores for the popular-items section.
      const itemBundles = await Promise.all(
        ranked.slice(0, 4).map(async (s) => {
          const its = await fetchItems(s.id)
          return its.map((i) => ({ ...i, _storeSlug: s.slug }))
        })
      )
      if (!mounted) return
      setTopItems(rankItems(itemBundles.flat()))
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [])

  // SEO meta for the homepage.
  const seo = useSEO({
    title: 'Free Online Delivery in Bangladesh',
    description:
      'Order food, groceries, medicine, fashion and electronics from local stores near you with cash on delivery. FlashCart — আপনার কাছের দোকান।',
    canonical: 'https://flashcart.bsdc.info.bd/',
  })

  return (
    <main className="page">
      <SEOHead {...seo} />
      <HeroSection />
      <CategoryGrid />
      {loading ? (
        <LoadingSpinner label="Loading stores..." large />
      ) : (
        <>
          <NearbyStores stores={stores} />
          <FeaturedStores stores={stores} />
          <BannerSlider />
          <TopItems items={topItems} />
        </>
      )}
    </main>
  )
}
