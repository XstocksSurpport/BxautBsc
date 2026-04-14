import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = { error: Error | null };

/**
 * Catches render errors so a single bad widget does not blank the whole app.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary-fallback pixel-frame" role="alert">
          <p className="error-boundary-fallback__title">Something went wrong</p>
          <p className="error-boundary-fallback__detail">{this.state.error.message}</p>
          <p className="error-boundary-fallback__zh">页面出现异常，请刷新后重试。</p>
          <button
            type="button"
            className="btn btn-gold"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
