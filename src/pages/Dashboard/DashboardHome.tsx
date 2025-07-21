import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Building2, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';
import { mockResources, mockBookings } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate stats based on user role
  const getStats = () => {
    const totalResources = mockResources.length;
    const availableResources = mockResources.filter(r => r.status === 'available').length;
    const inUseResources = mockResources.filter(r => r.status === 'in-use').length;
    const maintenanceResources = mockResources.filter(r => r.status === 'maintenance').length;
    
    const totalBookings = mockBookings.length;
    const pendingBookings = mockBookings.filter(b => b.status === 'pending').length;
    const approvedBookings = mockBookings.filter(b => b.status === 'approved').length;
    
    const userBookings = user ? mockBookings.filter(b => b.userId === user.id).length : 0;

    return {
      totalResources,
      availableResources,
      inUseResources,
      maintenanceResources,
      totalBookings,
      pendingBookings,
      approvedBookings,
      userBookings
    };
  };

  const stats = getStats();

  const getQuickActions = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { label: 'Manage Resources', icon: Building2, action: () => navigate('/dashboard/resources') },
          { label: 'View All Bookings', icon: Calendar, action: () => navigate('/dashboard/bookings') },
          { label: 'User Management', icon: Users, action: () => navigate('/dashboard/users') },
          { label: 'Generate Reports', icon: TrendingUp, action: () => navigate('/dashboard/reports') }
        ];
      case 'lecturer':
        return [
          { label: 'Book Resource', icon: Plus, action: () => navigate('/dashboard/bookings') },
          { label: 'View My Bookings', icon: Calendar, action: () => navigate('/dashboard/bookings') },
          { label: 'Browse Resources', icon: Building2, action: () => navigate('/dashboard/resources') }
        ];
      case 'student':
        return [
          { label: 'Book Study Room', icon: Plus, action: () => navigate('/dashboard/bookings') },
          { label: 'My Reservations', icon: Calendar, action: () => navigate('/dashboard/bookings') },
          { label: 'Available Resources', icon: Building2, action: () => navigate('/dashboard/resources') }
        ];
      case 'maintenance':
        return [
          { label: 'View Maintenance Tasks', icon: AlertTriangle, action: () => navigate('/dashboard/maintenance') },
          { label: 'Resource Status', icon: Building2, action: () => navigate('/dashboard/resources') },
          { label: 'Upcoming Bookings', icon: Calendar, action: () => navigate('/dashboard/bookings') }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  const getRoleSpecificCards = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Total Resources', value: stats.totalResources, icon: Building2, color: 'text-primary' },
          { title: 'Available Resources', value: stats.availableResources, icon: CheckCircle, color: 'text-success' },
          { title: 'Pending Approvals', value: stats.pendingBookings, icon: Clock, color: 'text-warning' },
          { title: 'Under Maintenance', value: stats.maintenanceResources, icon: AlertTriangle, color: 'text-destructive' }
        ];
      case 'lecturer':
        return [
          { title: 'My Bookings', value: stats.userBookings, icon: Calendar, color: 'text-primary' },
          { title: 'Available Resources', value: stats.availableResources, icon: Building2, color: 'text-success' },
          { title: 'Approved Bookings', value: stats.approvedBookings, icon: CheckCircle, color: 'text-success' },
          { title: 'Pending Approval', value: stats.pendingBookings, icon: Clock, color: 'text-warning' }
        ];
      case 'student':
        return [
          { title: 'My Reservations', value: stats.userBookings, icon: Calendar, color: 'text-primary' },
          { title: 'Available Rooms', value: stats.availableResources, icon: Building2, color: 'text-success' },
          { title: 'Study Spaces', value: mockResources.filter(r => r.type === 'classroom' && r.capacity && r.capacity <= 25).length, icon: Users, color: 'text-secondary' }
        ];
      case 'maintenance':
        return [
          { title: 'Maintenance Tasks', value: stats.maintenanceResources, icon: AlertTriangle, color: 'text-destructive' },
          { title: 'Total Resources', value: stats.totalResources, icon: Building2, color: 'text-primary' },
          { title: 'Operational', value: stats.availableResources + stats.inUseResources, icon: CheckCircle, color: 'text-success' }
        ];
      default:
        return [];
    }
  };

  const roleCards = getRoleSpecificCards();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero text-white rounded-xl p-6 shadow-elegant">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="opacity-90">
          {user?.role === 'admin' && "Manage university resources and monitor system usage."}
          {user?.role === 'lecturer' && "Book classrooms and resources for your lectures."}
          {user?.role === 'student' && "Reserve study spaces and access academic resources."}
          {user?.role === 'maintenance' && "Monitor facility status and manage maintenance tasks."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="stat-card card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all"
                  onClick={action.action}
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium text-center">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockBookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  booking.status === 'approved' ? 'bg-success' :
                  booking.status === 'pending' ? 'bg-warning' : 'bg-destructive'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{booking.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.userName} • {booking.date} {booking.startTime}-{booking.endTime}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  booking.status === 'approved' ? 'status-available' :
                  booking.status === 'pending' ? 'status-pending' : 'status-maintenance'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Resource Status</CardTitle>
            <CardDescription>Current facility availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockResources.slice(0, 3).map((resource) => (
              <div key={resource.id} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{resource.name}</p>
                  <p className="text-xs text-muted-foreground">{resource.location}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  resource.status === 'available' ? 'status-available' :
                  resource.status === 'in-use' ? 'status-in-use' : 'status-maintenance'
                }`}>
                  {resource.status.replace('-', ' ')}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;