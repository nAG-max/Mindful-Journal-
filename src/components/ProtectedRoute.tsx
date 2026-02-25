import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <div className="h-1 bg-emerald-600/20 w-full overflow-hidden">
          <div className="h-full bg-emerald-600 animate-[loading_1.5s_infinite_linear]" style={{ width: '30%', marginLeft: '-30%' }}>
            <style>{`
              @keyframes loading {
                0% { margin-left: -30%; width: 30%; }
                50% { width: 60%; }
                100% { margin-left: 100%; width: 30%; }
              }
            `}</style>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-emerald-600 p-3 rounded-2xl text-white animate-pulse">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-stone-400 text-sm font-medium animate-pulse">Securing session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
