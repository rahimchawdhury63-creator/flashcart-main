// ErrorBoundary.jsx — Catches render errors in the React tree and shows a fallback
// instead of a blank white screen. Wraps the whole app in App.jsx.

import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  // Update state so the next render shows the fallback UI.
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  // Log the error (could be sent to a monitoring service).
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('FlashCart error boundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: 'var(--sp-5) 0', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p className="text-secondary">
            Please reload the page. If the problem continues, try again later.
          </p>
          <button className="btn btn-primary mt-2" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
