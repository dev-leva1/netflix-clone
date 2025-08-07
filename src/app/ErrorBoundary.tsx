import React from 'react'

interface ErrorBoundaryProps {
  fallback: React.ReactNode
  onError?: (error: unknown, info?: unknown) => void
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: unknown
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: unknown, info: unknown) {
    this.props.onError?.(error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}


