import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { FileText } from 'lucide-react';

// Code-split heavy workspace components so Landing Page loads instantly
const AppWorkspace = lazy(() => import('./pages/AppWorkspace'));
const DesignSystemShowcase = lazy(() => import('./components/ui/DesignSystemShowcase'));

const WorkspaceLoader: React.FC<{ label?: string }> = ({ label = 'Loading Workspace...' }) => (
  <div className="min-h-screen bg-surface-canvas flex flex-col items-center justify-center p-6 animate-fade-in">
    <div className="flex flex-col items-center max-w-xs text-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center shadow-soft">
          <FileText className="w-6 h-6 stroke-[2.2]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent-500 ring-2 ring-white dark:ring-neutral-900 animate-pulse" />
        </div>
      </div>
      <div className="w-36 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div className="h-full bg-brand-700 rounded-full w-1/2 animate-[pulse_1s_ease-in-out_infinite]" />
      </div>
      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 tracking-wide">
        {label}
      </span>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Standalone Design System Showcase */}
            <Route
              path="/design-system"
              element={
                <Suspense fallback={<WorkspaceLoader label="Loading Design System Showcase..." />}>
                  <div className="min-h-screen bg-surface-canvas">
                    <DesignSystemShowcase />
                  </div>
                </Suspense>
              }
            />

            {/* Teacher Workspace Routes */}
            <Route
              path="/app/*"
              element={
                <Suspense fallback={<WorkspaceLoader label="Loading Teacher Workspace..." />}>
                  <AppWorkspace />
                </Suspense>
              }
            />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
