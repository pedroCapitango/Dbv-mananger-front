import type { LucideIcon } from 'lucide-react';

// ============= Auth Types =============
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponseDto {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserResponseDto;
}

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// ============= Member Types =============
export interface MemberResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  photoUrl?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  status: 'active' | 'inactive';
  joinDate: string;
  unitId?: string;
  unit?: UnitResponseDto;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberDto {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  photoUrl?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  unitId?: string;
}

export interface UpdateMemberDto {
  firstName?: string;
  lastName?: string;
  birthdate?: string;
  gender?: string;
  photoUrl?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  status?: 'active' | 'inactive';
  unitId?: string;
}

// ============= Unit Types =============
export interface UnitResponseDto {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnitDto {
  name: string;
  description?: string;
}

// ============= Event Types =============
export interface EventResponseDto {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  type: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  maxParticipants?: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  participants?: EventParticipantDto[];
  _count?: {
    participants: number;
  };
}

export interface EventParticipantDto {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  member: MemberResponseDto;
}

// ============= Finance Types =============
export interface TransactionResponseDto {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  categoryId: string;
  accountId: string;
  category?: CategoryResponseDto;
  account?: AccountResponseDto;
  createdAt: string;
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  type: 'income' | 'expense';
  description?: string;
}

export interface AccountResponseDto {
  id: string;
  name: string;
  type: string;
  balance: number;
  description?: string;
}

export interface FinanceDashboardDto {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactions: TransactionResponseDto[];
  topCategories: {
    category: string;
    total: number;
  }[];
}

// ============= Inventory Types =============
export interface InventoryItemResponseDto {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  minQuantity?: number;
  location?: string;
  categoryId: string;
  category?: InventoryCategoryResponseDto;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCategoryResponseDto {
  id: string;
  name: string;
  description?: string;
}

export interface LoanResponseDto {
  id: string;
  itemId: string;
  memberId: string;
  quantity: number;
  loanDate: string;
  expectedReturnDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  item?: InventoryItemResponseDto;
  member?: MemberResponseDto;
}

// ============= Attendance Types =============
export interface AttendanceResponseDto {
  id: string;
  eventId: string;
  memberId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  recordedAt: string;
  event?: EventResponseDto;
  member?: MemberResponseDto;
}

// ============= Progress Types =============
export interface MemberProgressResponseDto {
  id: string;
  memberId: string;
  className: string;
  startDate: string;
  completionDate?: string;
  status: 'in_progress' | 'completed';
  member?: MemberResponseDto;
}

export interface MemberSpecialtyResponseDto {
  id: string;
  memberId: string;
  specialtyName: string;
  category: string;
  startDate: string;
  completionDate?: string;
  status: 'in_progress' | 'completed';
  instructorName?: string;
  member?: MemberResponseDto;
}

// ============= Feed/Post Types =============
export interface PostResponseDto {
  id: string;
  content: string;
  mediaUrls?: string[];
  eventId?: string;
  authorId: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author?: UserResponseDto;
  event?: EventResponseDto;
  _count?: {
    comments: number;
    reactions: number;
  };
}

// ============= UI Types =============
export interface DashboardStat {
  label: string;
  value: string;
  icon: LucideIcon;
  change: string;
  color: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface AttendanceData {
  week: string;
  attendance: number;
}

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path?: string;
}

// ============= API Response Types =============
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Legacy types for compatibility
export interface User extends UserResponseDto {}
export interface Member extends MemberResponseDto {}
export interface Event extends EventResponseDto {}
export interface FinanceRecord extends TransactionResponseDto {}
export interface InventoryItem extends InventoryItemResponseDto {}

export interface Task {
  id: number;
  task: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
  dueDate?: string;
}

// ============= Create/Update DTOs =============
export interface CreateMemberDto {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  photoUrl?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalInfo?: string;
  allergies?: string;
  status?: 'active' | 'inactive';
  unitId?: string;
}

export interface UpdateMemberDto extends Partial<CreateMemberDto> {}

export interface CreateEventDto {
  title: string;
  description?: string;
  type: string;
  startDate: string;
  endDate?: string;
  location?: string;
  cost?: number;
  maxParticipants?: number;
  status?: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  requiresPayment?: boolean;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

export interface CreateTransactionDto {
  type: 'income' | 'expense';
  amount: number;
  description?: string;
  categoryId: string;
  accountId: string;
  memberId?: string;
  eventId?: string;
  date: string;
  paymentMethod?: string;
  reference?: string;
}

export interface CreateItemDto {
  name: string;
  description?: string;
  categoryId: string;
  quantity: number;
  minQuantity?: number;
  unit?: string;
  cost?: number;
  location?: string;
  barcode?: string;
  imageUrl?: string;
  status?: 'available' | 'low_stock' | 'out_of_stock' | 'discontinued';
}

export interface UpdateItemDto extends Partial<CreateItemDto> {}

export interface CreateLoanDto {
  itemId: string;
  memberId: string;
  quantity: number;
  expectedReturnDate: string;
  notes?: string;
}

export interface RecordAttendanceDto {
  eventId: string;
  memberId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface CreatePostDto {
  content: string;
  mediaUrls?: string[];
  eventId?: string;
  isPublic?: boolean;
}

export interface CreateUnitDto {
  name: string;
  description?: string;
  minAge?: number;
  maxAge?: number;
}
