import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { AppContent } from './components/AppContent';
import { ErrorBoundary } from './utils/errorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}