import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Plus, Filter, Search } from 'lucide-react';
import { mockBookings, mockResources, Booking } from '@/data/mockData';
import { format } from 'date-fns';

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // New booking form state
  const [newBooking, setNewBooking] = useState({
    resourceId: '',
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesUser = user?.role === 'admin' || booking.userId === user?.id;
    
    return matchesSearch && matchesStatus && matchesUser;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    const booking: Booking = {
      id: (bookings.length + 1).toString(),
      resourceId: newBooking.resourceId,
      userId: user?.id || '',
      userName: user?.name || '',
      userRole: user?.role || '',
      title: newBooking.title,
      description: newBooking.description,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      date: newBooking.date,
      status: user?.role === 'admin' ? 'approved' : 'pending',
      createdAt: new Date().toISOString()
    };

    setBookings([...bookings, booking]);
    setNewBooking({
      resourceId: '',
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: ''
    });
    setIsCreateDialogOpen(false);
  };

  const handleStatusChange = (bookingId: string, newStatus: 'approved' | 'rejected') => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="status-available">Approved</Badge>;
      case 'pending':
        return <Badge className="status-pending">Pending</Badge>;
      case 'rejected':
        return <Badge className="status-maintenance">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getResourceName = (resourceId: string) => {
    const resource = mockResources.find(r => r.id === resourceId);
    return resource?.name || 'Unknown Resource';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin' ? 'Manage all resource bookings' : 'Manage your bookings and reservations'}
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
              <DialogDescription>
                Reserve a resource for your activity
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resource">Resource</Label>
                <Select value={newBooking.resourceId} onValueChange={(value) => 
                  setNewBooking({...newBooking, resourceId: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resource" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockResources
                      .filter(r => r.status === 'available')
                      .map((resource) => (
                      <SelectItem key={resource.id} value={resource.id}>
                        {resource.name} - {resource.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBooking.title}
                  onChange={(e) => setNewBooking({...newBooking, title: e.target.value})}
                  placeholder="e.g., CS101 Lecture"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newBooking.description}
                  onChange={(e) => setNewBooking({...newBooking, description: e.target.value})}
                  placeholder="Brief description of the activity"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newBooking.startTime}
                    onChange={(e) => setNewBooking({...newBooking, startTime: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newBooking.endTime}
                    onChange={(e) => setNewBooking({...newBooking, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-primary">
                  Create Booking
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search bookings..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-lg">{booking.title}</h3>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <p className="text-muted-foreground">{booking.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{getResourceName(booking.resourceId)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{booking.userName} ({booking.userRole})</span>
                  </div>
                </div>
                
                {user?.role === 'admin' && booking.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleStatusChange(booking.id, 'rejected')}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="btn-primary"
                      onClick={() => handleStatusChange(booking.id, 'approved')}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Create your first booking to get started.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;