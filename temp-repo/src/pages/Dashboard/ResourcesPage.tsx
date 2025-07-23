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
import { 
  Building2, 
  MapPin, 
  Users, 
  Plus, 
  Filter, 
  Search, 
  Settings,
  Monitor,
  FlaskConical,
  Presentation,
  Calendar
} from 'lucide-react';
import { mockResources, Resource } from '@/data/mockData';
import lectureHall from '@/assets/lecture-hall.jpg';
import computerLab from '@/assets/computer-lab.jpg';

const ResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // New resource form state
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'classroom' as Resource['type'],
    capacity: '',
    location: '',
    features: ''
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    
    const resource: Resource = {
      id: (resources.length + 1).toString(),
      name: newResource.name,
      type: newResource.type,
      capacity: newResource.capacity ? parseInt(newResource.capacity) : undefined,
      location: newResource.location,
      status: 'available',
      features: newResource.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
    };

    setResources([...resources, resource]);
    setNewResource({
      name: '',
      type: 'classroom',
      capacity: '',
      location: '',
      features: ''
    });
    setIsCreateDialogOpen(false);
  };

  const handleStatusChange = (resourceId: string, newStatus: Resource['status']) => {
    setResources(resources.map(resource =>
      resource.id === resourceId ? { ...resource, status: newStatus } : resource
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="status-available">Available</Badge>;
      case 'in-use':
        return <Badge className="status-in-use">In Use</Badge>;
      case 'maintenance':
        return <Badge className="status-maintenance">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'classroom':
        return <Presentation className="w-5 h-5" />;
      case 'lab':
        return <FlaskConical className="w-5 h-5" />;
      case 'computer':
        return <Monitor className="w-5 h-5" />;
      case 'projector':
        return <Monitor className="w-5 h-5" />;
      case 'event-space':
        return <Building2 className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  const getResourceImage = (type: Resource['type']) => {
    switch (type) {
      case 'classroom':
      case 'event-space':
        return lectureHall;
      case 'lab':
      case 'computer':
        return computerLab;
      default:
        return lectureHall;
    }
  };

  const canManageResources = user?.role === 'admin' || user?.role === 'maintenance';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-muted-foreground">
            {canManageResources ? 'Manage university resources and facilities' : 'Browse available resources for booking'}
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>
                  Create a new resource for booking
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateResource} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Resource Name</Label>
                  <Input
                    id="name"
                    value={newResource.name}
                    onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                    placeholder="e.g., Lecture Hall A1"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={newResource.type} onValueChange={(value: Resource['type']) => 
                    setNewResource({...newResource, type: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classroom">Classroom</SelectItem>
                      <SelectItem value="lab">Laboratory</SelectItem>
                      <SelectItem value="computer">Computer</SelectItem>
                      <SelectItem value="projector">Projector</SelectItem>
                      <SelectItem value="event-space">Event Space</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newResource.capacity}
                      onChange={(e) => setNewResource({...newResource, capacity: e.target.value})}
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newResource.location}
                      onChange={(e) => setNewResource({...newResource, location: e.target.value})}
                      placeholder="Building A, Floor 1"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="features">Features (comma separated)</Label>
                  <Textarea
                    id="features"
                    value={newResource.features}
                    onChange={(e) => setNewResource({...newResource, features: e.target.value})}
                    placeholder="Projector, Sound System, Air Conditioning"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary">
                    Add Resource
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="classroom">Classroom</SelectItem>
                <SelectItem value="lab">Laboratory</SelectItem>
                <SelectItem value="computer">Computer</SelectItem>
                <SelectItem value="projector">Projector</SelectItem>
                <SelectItem value="event-space">Event Space</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in-use">In Use</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="shadow-md hover:shadow-lg transition-all card-hover overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={getResourceImage(resource.type)} 
                alt={resource.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                {getStatusBadge(resource.status)}
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(resource.type)}
                  <div>
                    <h3 className="font-semibold text-lg">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{resource.type.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{resource.location}</span>
                </div>
                
                {resource.capacity && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Capacity: {resource.capacity}</span>
                  </div>
                )}
                
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                {user?.role !== 'maintenance' && resource.status === 'available' && (
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Resource
                  </Button>
                )}
                
                {canManageResources && (
                  <div className="flex space-x-2">
                    {resource.status !== 'maintenance' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(resource.id, 'maintenance')}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    )}
                    {resource.status === 'maintenance' && (
                      <Button
                        size="sm"
                        className="btn-primary"
                        onClick={() => handleStatusChange(resource.id, 'available')}
                      >
                        Mark Fixed
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredResources.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'No resources have been added yet.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;