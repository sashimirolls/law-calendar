import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Logger } from './logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Logger.error('ErrorBoundary', 'Uncaught error:', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-red-700 font-semibold">Something went wrong</h2>
          <pre className="mt-2 text-sm text-red-600">
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}