// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://clube-black-api.onrender.com/api/v1';

// Priority Colors
export const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
} as const;

// Status Colors
export const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
} as const;

// Event Status Colors
export const EVENT_STATUS_COLORS = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
} as const;

// Participant Status Colors
export const PARTICIPANT_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  DECLINED: 'bg-red-100 text-red-700',
  ATTENDED: 'bg-blue-100 text-blue-700',
  ABSENT: 'bg-gray-100 text-gray-700',
} as const;
