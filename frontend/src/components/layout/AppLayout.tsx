import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from './AppSidebar';

export function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-auto bg-background">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
