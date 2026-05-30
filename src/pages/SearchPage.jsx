// SearchPage.jsx — Search results across stores using the fuzzy search engine.
import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEOHead from '../components/common/SEOHead'
import StoreCard from '../components/store/StoreCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { fetchStores } from '../utils/dataService'
import { search, addSearchHistory, getSearchHistory } from '../utils/search'
import { useLanguage } from '../hooks/useLanguage'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const { t } = useLanguage()
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState(q)

  useEffect(() => {
    let mounted = true
    fetchStores().then((all) => { if (mounted) { setStores(all); setLoading(false) } })
    return () => { mounted = false }
  }, [])

  // Save non-empty queries to history.
  useEffect(() => { if (q) addSearchHistory(q) }, [q])

  const results = useMemo(() => (q ? search(stores, q) : stores), [stores, q])
  const history = getSearchHistory()

  const onSubmit = (e) => {
    e.preventDefault()
    setParams(input.trim() ? { q: input.trim() } : {})
  }

  return (
    <main className="page container">
      <SEOHead
        title={q ? `Search: ${q}` : 'Search Stores'}
        description="Search local stores and products on FlashCart Bangladesh."
        canonical="https://flashcart.bsdc.info.bd/search"
      />
      <section className="section">
        <h1>{t('search')}</h1>
        <form onSubmit={onSubmit} className="mb-2">
          <input className="form-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('searchPlaceholder')} />
        </form>

        {/* Recent searches */}
        {!q && history.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-2">
            {history.map((h) => (
              <button key={h} className="pill" onClick={() => setParams({ q: h })}>{h}</button>
            ))}
          </div>
        )}

        {loading ? <LoadingSpinner large /> : results.length ? (
          <div className="grid-stores">{results.map((s) => <StoreCard key={s.id} store={s} />)}</div>
        ) : (
          <p className="empty-state">{t('noResults')}</p>
        )}
      </section>
    </main>
  )
}
