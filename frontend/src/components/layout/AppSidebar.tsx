import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  FileText,
  LogOut,
  Mountain,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Locations', href: '/rentals', icon: FileText },
  { name: 'Produits', href: '/products', icon: Package },
  { name: 'Clients', href: '/customers', icon: Users },
  { name: 'Types de produits', href: '/product-types', icon: Tags },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Mountain className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-accent-foreground">Mountain Ride</span>
            <span className="text-xs text-sidebar-foreground/70">Backoffice</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'sidebar-item',
                isActive && 'sidebar-item-active'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Réduire</span>
            </>
          )}
        </Button>
      </div>

      {/* User Info */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-sidebar-accent-foreground">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-sidebar-foreground/70">{user.role}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="sidebar-item w-full text-destructive hover:bg-destructive/10"
          title={collapsed ? 'Déconnexion' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
