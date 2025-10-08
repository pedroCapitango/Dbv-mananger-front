export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://clube-black-api.onrender.com/api/v1';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  MEMBERS: '/members',
  EVENTS: '/events',
  FINANCE: '/finance',
  INVENTORY: '/inventory',
  PROGRESS: '/progress',
} as const;

export const COLORS = {
  primary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-purple-500',
} as const;

export const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-700',
} as const;

export const STATUS_COLORS = {
  // Event statuses
  scheduled: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  
  // Legacy statuses
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  suspended: 'bg-red-100 text-red-700',
} as const;
