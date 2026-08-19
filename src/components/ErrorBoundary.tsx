import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error in Da Vinci PAS System UI:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app-shell">
          <div className="card">
            <h2>Something went wrong</h2>
            <div className="notice notice-danger">{this.state.error.message}</div>
            <div className="button-row">
              <button className="button-primary" onClick={() => this.setState({ error: null })}>
                Try again
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
