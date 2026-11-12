import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ToastProvider } from './components/ui/Toast';

// Code-split heavy workspace components so Landing Page loads instantly
const AppWorkspace = lazy(() => import('./pages/AppWorkspace'));
const DesignSystemShowcase = lazy(() => import('./components/ui/DesignSystemShowcase'));

const WorkspaceLoader: React.FC = () => (
  <div className="min-h-screen bg-surface-canvas flex flex-col items-center justify-center p-4">
    <div className="w-10 h-10 rounded-full border-3 border-brand-700 border-t-transparent animate-spin mb-4" />
    <span className="text-xs font-semibold text-neutral-500 font-mono tracking-wide">
      Loading EduPulse Workspace...
    </span>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Standalone Design System Showcase */}
          <Route
            path="/design-system"
            element={
              <Suspense fallback={<WorkspaceLoader />}>
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
              <Suspense fallback={<WorkspaceLoader />}>
                <AppWorkspace />
              </Suspense>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
