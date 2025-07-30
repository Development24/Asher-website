import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state if props change and resetOnPropsChange is true
    if (this.props.resetOnPropsChange && prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          <div className="space-x-4">
            <Button onClick={this.resetError} variant="outline">
              Try Again
            </Button>
            <Button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              variant="default"
            >
              Refresh Page
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 text-left max-w-2xl">
              <summary className="cursor-pointer text-sm text-gray-500 mb-2">Error Details (Development)</summary>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// Specific error boundaries for different parts of the app
export const PropertyErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-red-50 dark:bg-red-900/10">
    <div className="mb-4">
      <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Failed to load property</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      There was an error loading this property. Please try again.
    </p>
    <Button onClick={resetError} size="sm" variant="outline">
      Retry
    </Button>
  </div>
);

export const FormErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <div className="flex flex-col items-center justify-center p-6 text-center border rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
    <div className="mb-4">
      <svg className="w-10 h-10 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Form Error</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      There was an error with the form. Your data has been preserved.
    </p>
    <Button onClick={resetError} size="sm">
      Continue
    </Button>
  </div>
);

// HOC for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
} 