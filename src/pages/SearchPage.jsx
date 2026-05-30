// SearchPage.jsx — Full search results: stores + items, related keywords, counts.

import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import SearchBox from '../components/common/SearchBox'
import StoreCard from '../components/store/StoreCard'
import StarRating from '../components/common/StarRating'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { buildSearchIndex } from '../utils/dataService'
import { searchAll, relatedKeywords, addSearchHistory, TRENDING } from '../utils/search'
import { useLanguage } from '../hooks/useLanguage'
import { IconSearch } from '../components/svgs'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const { t, pick, lang } = useLanguage()
  const [index, setIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all') // all | stores | items

  // Build the unified search index once.
  useEffect(() => {
    let mounted = true
    buildSearchIndex().then((idx) => { if (mounted) { setIndex(idx); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  // Save the query to history.
  useEffect(() => { if (q) addSearchHistory(q) }, [q])

  // Run the search whenever the query or index changes.
  const results = useMemo(() => {
    if (!index) return { stores: [], items: [], total: 0 }
    return searchAll(index, q)
  }, [index, q])

  const related = useMemo(() => (index ? relatedKeywords(results, lang) : []), [results, index, lang])

  return (
    <main className="page container">
      <SEOHead
        title={q ? `Search: ${q}` : 'Search Stores & Items'}
        description="Search local stores, restaurants, dishes and products on FlashCart Bangladesh."
        canonical="https://flashcart.bsdc.info.bd/search"
      />

      <section className="section">
        {/* Search box at top of results */}
        <div className="mb-2" style={{ maxWidth: 640 }}>
          <SearchBox variant="header" initial={q} />
        </div>

        {/* Heading + count */}
        {q ? (
          <h1 style={{ fontSize: '1.4rem' }}>
            {results.total} {lang === 'bn' ? 'ফলাফল' : 'results'} {lang === 'bn' ? 'এর জন্য' : 'for'} "{q}"
          </h1>
        ) : (
          <h1 style={{ fontSize: '1.4rem' }}>{t('search')}</h1>
        )}

        {/* Related keyword chips */}
        {q && related.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-2">
            <span className="text-light" style={{ fontSize: '0.8rem', alignSelf: 'center' }}>
              {lang === 'bn' ? 'সম্পর্কিত:' : 'Related:'}
            </span>
            {related.map((r) => (
              <Link key={r.label} to={r.to} className="pill">{r.label}</Link>
            ))}
          </div>
        )}

        {/* Trending when empty */}
        {!q && (
          <div className="flex gap-1 flex-wrap mb-3">
            <span className="text-light" style={{ fontSize: '0.8rem', alignSelf: 'center' }}>
              {lang === 'bn' ? 'জনপ্রিয়:' : 'Trending:'}
            </span>
            {TRENDING.map((tr) => (
              <button key={tr.en} className="pill" onClick={() => setParams({ q: tr.en })}>
                {lang === 'bn' ? tr.bn : tr.en}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <LoadingSpinner large />
        ) : q && results.total === 0 ? (
          <div className="empty-state">
            <IconSearch />
            <p>{lang === 'bn' ? `"${q}" এর জন্য কিছু পাওয়া যায়নি` : `No results found for "${q}"`}</p>
            {/* "Did you mean" spelling correction */}
            {results.didYouMean && (
              <p style={{ marginTop: 8 }}>
                {lang === 'bn' ? 'আপনি কি খুঁজছেন:' : 'Did you mean:'}{' '}
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--color-primary)', fontWeight: 700 }}
                  onClick={() => setParams({ q: results.didYouMean })}
                >
                  {results.didYouMean}
                </button>
              </p>
            )}
            <Link to="/stores" className="btn btn-primary mt-2">{t('stores')}</Link>
          </div>
        ) : (
          <>
            {/* Tabs (only meaningful when there's a query) */}
            {q && (results.stores.length > 0 && results.items.length > 0) && (
              <div className="flex gap-1 mb-3">
                <button className={`pill ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
                  {t('viewAll')} ({results.total})
                </button>
                <button className={`pill ${tab === 'stores' ? 'active' : ''}`} onClick={() => setTab('stores')}>
                  {t('stores')} ({results.stores.length})
                </button>
                <button className={`pill ${tab === 'items' ? 'active' : ''}`} onClick={() => setTab('items')}>
                  {lang === 'bn' ? 'পণ্য' : 'Items'} ({results.items.length})
                </button>
              </div>
            )}

            {/* Stores section */}
            {(tab === 'all' || tab === 'stores') && results.stores.length > 0 && (
              <div className="mb-3">
                <h2 style={{ fontSize: '1.1rem' }}>{t('stores')} ({results.stores.length})</h2>
                <div className="grid-stores">
                  {results.stores.map((s) => <StoreCard key={s.id} store={s} />)}
                </div>
              </div>
            )}

            {/* Items section — the dishes/products that were missing before */}
            {(tab === 'all' || tab === 'items') && results.items.length > 0 && (
              <div className="mb-3">
                <h2 style={{ fontSize: '1.1rem' }}>{lang === 'bn' ? 'পণ্য ও খাবার' : 'Items & Dishes'} ({results.items.length})</h2>
                <div className="grid-cards">
                  {results.items.map((it) => (
                    <Link
                      key={it.id}
                      to={`/store/${it._storeSlug}/item/${it.slug}`}
                      className="card card-hover"
                      style={{ color: 'inherit' }}
                    >
                      <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: 'var(--color-bg)' }}>
                        <img src={it.image} alt={pick(it.name)} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div className="card-body">
                        <h4 className="truncate" style={{ margin: 0 }}>{pick(it.name)}</h4>
                        <p className="text-light truncate" style={{ margin: '2px 0', fontSize: '0.76rem' }}>
                          {it._store ? pick(it._store.name) : ''}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="item-price">৳{it.discountPrice || it.price}</span>
                          <StarRating value={it.averageRating} size={13} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* When no query: show all stores as a browse fallback */}
            {!q && (
              <div className="grid-stores">
                {results.stores.map((s) => <StoreCard key={s.id} store={s} />)}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
