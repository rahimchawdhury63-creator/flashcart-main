// SearchBox.jsx — Foodpanda-style search box with live autocomplete dropdown.
// Shows category / store / item suggestions as you type, plus recent + trending
// searches when empty. Keyboard accessible (arrow keys + Enter + Escape).

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { buildSearchIndex } from '../../utils/dataService'
import {
  getSuggestions,
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory,
  TRENDING,
} from '../../utils/search'
import {
  IconSearch, IconClose, IconClock, IconList, IconGrid, IconChevronRight,
} from '../svgs'

// Small icon per suggestion type.
function TypeIcon({ type }) {
  if (type === 'category') return <IconGrid size={16} />
  if (type === 'store') return <IconList size={16} />
  if (type === 'item') return <IconSearch size={16} />
  if (type === 'recent') return <IconClock size={16} />
  return <IconSearch size={16} />
}

/**
 * @param {object} props
 * @param {string} [props.variant] - 'header' | 'hero' (styling hook)
 * @param {string} [props.initial] - initial query value
 * @param {boolean} [props.autoFocus]
 */
export default function SearchBox({ variant = 'header', initial = '', autoFocus = false }) {
  const { t, pick, lang } = useLanguage()
  const navigate = useNavigate()

  const [query, setQuery] = useState(initial)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [highlight, setHighlight] = useState(-1)
  const [history, setHistory] = useState(getSearchHistory())

  const boxRef = useRef(null)
  const inputRef = useRef(null)

  // Lazily build the search index the first time the box is focused.
  const ensureIndex = useCallback(async () => {
    if (index) return index
    const idx = await buildSearchIndex()
    setIndex(idx)
    return idx
  }, [index])

  // Recompute suggestions whenever the query or index changes (debounced).
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }
    let active = true
    const handle = setTimeout(async () => {
      const idx = await ensureIndex()
      if (!active) return
      setSuggestions(getSuggestions(idx, query, pick, lang))
      setHighlight(-1)
    }, 120) // debounce keystrokes
    return () => {
      active = false
      clearTimeout(handle)
    }
  }, [query, ensureIndex, pick, lang])

  // Close the dropdown when clicking outside.
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Navigate to full results for a free-text query.
  const runSearch = (term) => {
    const q = (term ?? query).trim()
    if (!q) return
    addSearchHistory(q)
    setHistory(getSearchHistory())
    setOpen(false)
    setQuery(q)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  // Act on a chosen suggestion (navigate to its target, or run a search).
  const choose = (s) => {
    if (!s) return runSearch()
    if (s.type === 'search' || s.type === 'recent' || s.type === 'trending') {
      runSearch(s.query ?? s.label)
    } else if (s.to) {
      addSearchHistory(s.label)
      setOpen(false)
      navigate(s.to)
    }
  }

  // The list shown in the dropdown: suggestions while typing, history+trending when empty.
  const emptyList = [
    ...history.map((h) => ({ label: h, type: 'recent', query: h })),
    ...TRENDING.map((tr) => ({ label: lang === 'bn' ? tr.bn : tr.en, type: 'trending', query: tr.en })),
  ]
  const list = query.trim() ? suggestions : emptyList

  // Keyboard navigation.
  const onKeyDown = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h + 1, list.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(h - 1, -1)) }
    else if (e.key === 'Enter') { e.preventDefault(); highlight >= 0 ? choose(list[highlight]) : runSearch() }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className={`searchbox searchbox-${variant}`} ref={boxRef} role="search">
      <form
        className="searchbox-input"
        onSubmit={(e) => { e.preventDefault(); runSearch() }}
      >
        <IconSearch size={18} className="searchbox-leading" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { setOpen(true); ensureIndex() }}
          onKeyDown={onKeyDown}
          placeholder={t('searchPlaceholder')}
          aria-label={t('search')}
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {query && (
          <button type="button" className="searchbox-clear" onClick={() => { setQuery(''); inputRef.current?.focus() }} aria-label="Clear">
            <IconClose size={16} />
          </button>
        )}
        {variant === 'hero' && <button type="submit" className="btn btn-accent searchbox-btn">{t('search')}</button>}
      </form>

      {/* Dropdown */}
      {open && (list.length > 0) && (
        <div className="searchbox-dropdown animate-fade-in" role="listbox">
          {/* Header for empty state sections */}
          {!query.trim() && history.length > 0 && (
            <div className="searchbox-section-head">
              <span>{lang === 'bn' ? 'সাম্প্রতিক' : 'Recent'}</span>
              <button className="searchbox-clearhist" onClick={() => { clearSearchHistory(); setHistory([]) }}>
                {lang === 'bn' ? 'মুছুন' : 'Clear'}
              </button>
            </div>
          )}
          {!query.trim() && history.length === 0 && (
            <div className="searchbox-section-head"><span>{lang === 'bn' ? 'জনপ্রিয়' : 'Trending'}</span></div>
          )}

          {list.map((s, i) => (
            <button
              key={`${s.type}-${s.label}-${i}`}
              type="button"
              role="option"
              aria-selected={highlight === i}
              className={`searchbox-item ${highlight === i ? 'active' : ''}`}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => choose(s)}
            >
              <span className="searchbox-item-icon"><TypeIcon type={s.type} /></span>
              <span className="searchbox-item-text">
                <span className="searchbox-item-label">{s.label}</span>
                {s.sub && <span className="searchbox-item-sub">{s.sub}</span>}
              </span>
              {/* Type tag + count, like Foodpanda */}
              <span className="searchbox-item-meta">
                {s.type === 'category' && (
                  <span className="badge badge-muted">{s.count != null ? `${s.count} ${t('stores')}` : t('categories')}</span>
                )}
                {s.type === 'store' && <span className="badge badge-primary">{t('stores')}</span>}
                {s.type === 'item' && <span className="badge badge-accent">{lang === 'bn' ? 'পণ্য' : 'Item'}</span>}
                {(s.type === 'recent' || s.type === 'trending' || s.type === 'search') && <IconChevronRight size={16} />}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
