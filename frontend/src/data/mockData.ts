export interface Resource {
  id: string;
  name: string;
  type: 'classroom' | 'lab' | 'projector' | 'computer' | 'event-space';
  capacity?: number;
  location: string;
  status: 'available' | 'in-use' | 'maintenance';
  features: string[];
  image?: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  userId: string;
  userName: string;
  userRole: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Lecture Hall A1',
    type: 'classroom',
    capacity: 150,
    location: 'Building A, Floor 1',
    status: 'available',
    features: ['Projector', 'Sound System', 'Air Conditioning', 'Whiteboard']
  },
  {
    id: '2',
    name: 'Computer Lab B2',
    type: 'lab',
    capacity: 30,
    location: 'Building B, Floor 2',
    status: 'in-use',
    features: ['30 PCs', 'High-speed Internet', 'Programming Software', 'Air Conditioning']
  },
  {
    id: '3',
    name: 'Seminar Room C3',
    type: 'classroom',
    capacity: 25,
    location: 'Building C, Floor 3',
    status: 'available',
    features: ['Interactive Whiteboard', 'Video Conferencing', 'Flexible Seating']
  },
  {
    id: '4',
    name: 'Physics Lab D1',
    type: 'lab',
    capacity: 20,
    location: 'Building D, Floor 1',
    status: 'maintenance',
    features: ['Lab Equipment', 'Safety Systems', 'Chemical Storage']
  },
  {
    id: '5',
    name: 'Main Auditorium',
    type: 'event-space',
    capacity: 500,
    location: 'Main Building',
    status: 'available',
    features: ['Stage', 'Professional Sound', 'Lighting System', 'Recording Equipment']
  },
  {
    id: '6',
    name: 'Study Room E2',
    type: 'classroom',
    capacity: 8,
    location: 'Library, Floor 2',
    status: 'available',
    features: ['Quiet Environment', 'Whiteboard', 'Power Outlets', 'WiFi']
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    resourceId: '1',
    userId: '2',
    userName: 'Prof. Michael Chen',
    userRole: 'lecturer',
    title: 'Advanced Algorithms Lecture',
    description: 'Weekly lecture for CS students',
    startTime: '09:00',
    endTime: '11:00',
    date: '2024-07-22',
    status: 'approved',
    createdAt: '2024-07-20T10:00:00Z'
  },
  {
    id: '2',
    resourceId: '2',
    userId: '3',
    userName: 'Emma Davis',
    userRole: 'student',
    title: 'Programming Assignment',
    description: 'Working on final project',
    startTime: '14:00',
    endTime: '17:00',
    date: '2024-07-22',
    status: 'pending',
    createdAt: '2024-07-21T08:00:00Z'
  },
  {
    id: '3',
    resourceId: '5',
    userId: '1',
    userName: 'Dr. Sarah Johnson',
    userRole: 'admin',
    title: 'University Graduation Ceremony',
    description: 'Annual graduation event',
    startTime: '10:00',
    endTime: '14:00',
    date: '2024-07-25',
    status: 'approved',
    createdAt: '2024-07-15T12:00:00Z'
  }
];

export const getResourceById = (id: string): Resource | undefined => {
  return mockResources.find(resource => resource.id === id);
};

export const getBookingsByResource = (resourceId: string): Booking[] => {
  return mockBookings.filter(booking => booking.resourceId === resourceId);
};

export const getBookingsByUser = (userId: string): Booking[] => {
  return mockBookings.filter(booking => booking.userId === userId);
};