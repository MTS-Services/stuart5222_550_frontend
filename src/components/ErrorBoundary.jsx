import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Something went wrong
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    An unexpected error occurred. Please try refreshing the page.
                  </p>
                </div>
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-600">
                      Error Details (Development)
                    </summary>
                    <div className="mt-2 p-3 bg-red-50 rounded border text-xs">
                      <div className="font-medium text-red-800">Error:</div>
                      <pre className="mt-1 text-red-700 whitespace-pre-wrap">
                        {this.state.error && this.state.error.toString()}
                      </pre>
                      {this.state.errorInfo && (
                        <>
                          <div className="mt-2 font-medium text-red-800">Component Stack:</div>
                          <pre className="mt-1 text-red-700 whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </>
                      )}
                    </div>
                  </details>
                )}
              </div>
              <div className="mt-6 flex flex-col space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => window.location.href = '/admin'}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;