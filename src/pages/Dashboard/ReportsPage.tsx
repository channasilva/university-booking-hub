import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Users, 
  Building2, 
  TrendingUp,
  Clock,
  PieChart
} from 'lucide-react';
import { mockResources, mockBookings } from '@/data/mockData';

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('usage');
  const [timeRange, setTimeRange] = useState('month');

  // Calculate statistics
  const stats = {
    totalBookings: mockBookings.length,
    approvedBookings: mockBookings.filter(b => b.status === 'approved').length,
    pendingBookings: mockBookings.filter(b => b.status === 'pending').length,
    totalResources: mockResources.length,
    availableResources: mockResources.filter(r => r.status === 'available').length,
    utilizationRate: Math.round((mockBookings.filter(b => b.status === 'approved').length / mockResources.length) * 100)
  };

  // Resource usage data
  const resourceUsage = mockResources.map(resource => {
    const bookings = mockBookings.filter(b => b.resourceId === resource.id && b.status === 'approved');
    return {
      name: resource.name,
      type: resource.type,
      bookings: bookings.length,
      utilizationRate: Math.round((bookings.length / 30) * 100) // Assuming 30 days
    };
  }).sort((a, b) => b.bookings - a.bookings);

  // Department usage (mock data)
  const departmentUsage = [
    { name: 'Computer Science', bookings: 15, percentage: 45 },
    { name: 'Engineering', bookings: 8, percentage: 24 },
    { name: 'Mathematics', bookings: 6, percentage: 18 },
    { name: 'Physics', bookings: 4, percentage: 13 }
  ];

  // Peak hours (mock data)
  const peakHours = [
    { hour: '09:00', bookings: 8 },
    { hour: '10:00', bookings: 12 },
    { hour: '11:00', bookings: 15 },
    { hour: '14:00', bookings: 10 },
    { hour: '15:00', bookings: 9 },
    { hour: '16:00', bookings: 6 }
  ];

  const exportReport = () => {
    // In a real app, this would generate and download a CSV/PDF
    alert('Report export functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Track resource usage and system performance
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usage">Usage Report</SelectItem>
              <SelectItem value="department">Department Report</SelectItem>
              <SelectItem value="performance">Performance Report</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.utilizationRate}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Resources</CardTitle>
            <Building2 className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableResources}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalResources} total
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage Chart */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Resource Usage</span>
            </CardTitle>
            <CardDescription>
              Most booked resources this {timeRange}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resourceUsage.slice(0, 5).map((resource, index) => (
                <div key={resource.name} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{resource.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{resource.bookings}</p>
                    <p className="text-xs text-muted-foreground">bookings</p>
                  </div>
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${Math.min(resource.utilizationRate, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Usage */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Department Usage</span>
            </CardTitle>
            <CardDescription>
              Bookings by department this {timeRange}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentUsage.map((dept, index) => (
                <div key={dept.name} className="flex items-center space-x-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: [
                        'hsl(var(--primary))',
                        'hsl(var(--secondary))', 
                        'hsl(var(--accent))',
                        'hsl(var(--muted-foreground))'
                      ][index] 
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{dept.name}</p>
                    <p className="text-xs text-muted-foreground">{dept.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{dept.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Peak Usage Hours</span>
            </CardTitle>
            <CardDescription>
              Busiest times of the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {peakHours.map((hour) => (
                <div key={hour.hour} className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium">
                    {hour.hour}
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full" 
                      style={{ width: `${(hour.bookings / 15) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm font-medium text-right">
                    {hour.bookings}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
            <CardDescription>
              Summary for this {timeRange}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average booking duration</span>
              <span className="font-medium">2.5 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Most popular resource type</span>
              <span className="font-medium">Classrooms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Busiest day</span>
              <span className="font-medium">Wednesday</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average approval time</span>
              <span className="font-medium">4.2 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cancellation rate</span>
              <span className="font-medium">8.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;