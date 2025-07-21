import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  Users, 
  Building2, 
  BarChart3, 
  LogOut,
  School,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    roles: ['admin', 'lecturer', 'student', 'maintenance']
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: Calendar,
    path: '/dashboard/bookings',
    roles: ['admin', 'lecturer', 'student']
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: Building2,
    path: '/dashboard/resources',
    roles: ['admin', 'lecturer', 'maintenance']
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    path: '/dashboard/users',
    roles: ['admin']
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/dashboard/reports',
    roles: ['admin', 'lecturer']
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: Settings,
    path: '/dashboard/maintenance',
    roles: ['admin', 'maintenance']
  }
];

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const filteredItems = sidebarItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <School className="w-8 h-8 text-primary" />
            <div>
              <h1 className="font-bold text-lg">Campus Resources</h1>
              <p className="text-sm text-muted-foreground">Management System</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 px-3",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold">
              {filteredItems.find(item => item.path === currentPath)?.label || 'Dashboard'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.department}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;