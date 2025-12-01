import type { LucideIcon } from 'lucide-react';

// ============= Auth Types =============
export interface LoginDto {
  email: string;
  password: string;
}

// Registro Simples (User Only) - Para staff/diretores/conselheiros
export interface RegisterSimpleDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'ADMIN' | 'DIRECTOR' | 'LEADER' | 'CONSELHEIRO' | 'MEMBRO';
}

// Registro de Membro Completo (User + Member)
export interface RegisterMemberDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  gender: 'MASCULINO' | 'FEMININO';
  unitId: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
}

// Legacy - manter para compatibilidade
export interface AddressDto {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ResponsibleDto {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  gender: string;
  unitId?: string;
  phone: string;
  address: AddressDto;
  responsible: ResponsibleDto;
}

export interface AuthResponseDto {
  message?: string;
  access_token: string;
  token_type?: string;
  expires_in?: number;
  user: UserResponseDto;
  member?: MemberResponseDto; // Incluído quando é registro de membro
}

export interface UserResponseDto {
  id: string; // UUID do backend
  name: string;
  email: string;
  role: string;
  memberId?: string | null; // Presente se role = MEMBRO
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
  guardianName?: string;
  guardianPhone?: string;
  contactEmail?: string;
  enrollmentDate?: string;
  status: 'active' | 'inactive';
  notes?: string;
  currentClass?: string;
  unitId?: string;
  unit?: UnitResponseDto;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  _count?: {
    progress: number;
    specialties: number;
  };
  // Legacy compatibility - will be removed
  joinDate?: string;
}

export interface CreateMemberDto {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  photoUrl?: string;
  guardianName?: string;
  guardianPhone?: string;
  contactEmail?: string;
  enrollmentDate?: string;
  status?: string;
  notes?: string;
  unitId?: string;
}

export interface UpdateMemberDto {
  firstName?: string;
  lastName?: string;
export interface UpdateMemberDto {
  firstName?: string;
  lastName?: string;
  birthdate?: string;
  gender?: string;
  photoUrl?: string;
  guardianName?: string;
  guardianPhone?: string;
  contactEmail?: string;
  enrollmentDate?: string;
  status?: string;
  notes?: string;
  unitId?: string;
}

// ============= Unit Types =============
export interface UnitResponseDto {
  id: string;
  name: string;
  description?: string;
  gender: 'MASCULINO' | 'FEMININO' | 'MISTO';
  minCapacity: number;
  maxCapacity: number;
  isActive: boolean;
  leaderUserId?: string | null;
  createdAt: string;
  updatedAt: string;
  // Relações incluídas do backend
  leader?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  } | null;
  _count?: {
    members: number;
  };
  members?: MemberResponseDto[]; // Incluído em findOne
  minAge?: number; // Legacy - manter para compatibilidade
  maxAge?: number; // Legacy - manter para compatibilidade
}

export interface CreateUnitDto {
  name: string;
  description?: string;
  gender: 'MASCULINO' | 'FEMININO' | 'MISTO';
  minCapacity?: number; // Default 8
  maxCapacity?: number; // Default 10
  leaderUserId?: string; // UUID do conselheiro líder (opcional)
  minAge?: number; // Legacy - manter para compatibilidade
  maxAge?: number; // Legacy - manter para compatibilidade
}

// ============= Event Types =============

// Enums
export type EventType = 'MEETING' | 'CAMP' | 'ACTIVITY' | 'CEREMONY' | 'TRAINING' | 'COMMUNITY_SERVICE' | 'OTHER';
export type EventStatus = 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type ParticipantStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'ATTENDED' | 'ABSENT';

// DTOs de Criação/Atualização
export interface CreateEventDto {
  title: string;
  description?: string;
  eventType: EventType;
  startDate: string; // ISO 8601
  endDate?: string; // ISO 8601
  location?: string;
  cost?: number; // DECIMAL(10,2) no backend
  maxParticipants?: number;
  requiresConfirmation?: boolean;
  status?: EventStatus;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  eventType?: EventType;
  startDate?: string;
  endDate?: string;
  location?: string;
  cost?: number; // DECIMAL(10,2) no backend
  maxParticipants?: number;
  requiresConfirmation?: boolean;
  status?: EventStatus;
}

export interface AddParticipantDto {
  memberId: string;
  status?: ParticipantStatus;
  notes?: string;
}

export interface UpdateParticipantStatusDto {
  status: ParticipantStatus;
  notes?: string;
}

// Response DTOs
export interface EventResponseDto {
  id: string;
  title: string;
  description?: string | null;
  eventType: EventType;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  cost?: number | null; // DECIMAL(10,2) retornado como number pelo backend
  maxParticipants?: number | null;
  requiresConfirmation: boolean;
  status: EventStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  participants?: EventParticipantDto[];
  _count?: {
    participants?: number;
    attendances?: number;
    notifications?: number;
  };
}

export interface EventParticipantDto {
  id: string;
  eventId: string;
  memberId: string;
  status: ParticipantStatus;
  confirmedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  member?: {
    id: string;
    firstName: string;
    lastName: string;
    birthdate?: string;
    photoUrl?: string | null;
    guardianName: string;
    guardianPhone: string;
    contactEmail?: string | null;
    unit?: {
      id: string;
      name: string;
    };
  };
  event?: EventResponseDto;
}

export interface EventStatisticsDto {
  participants: {
    PENDING: number;
    CONFIRMED: number;
    DECLINED: number;
    ATTENDED?: number;
    ABSENT?: number;
  };
  attendances?: {
    PRESENT: number;
    ABSENT: number;
    LATE: number;
  };
}

// ============= Finance Types =============

// Account Type Enum (conforme API)
export type AccountType = 'BANK' | 'CASH' | 'CREDIT_CARD';

// Transaction Type Enum (conforme API)
export type TransactionType = 'INCOME' | 'EXPENSE';

// Payment Status Enum (conforme API)
export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface TransactionResponseDto {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'INCOME' | 'EXPENSE';
  date: string;
  categoryId?: string;
  accountId: string;
  category?: CategoryResponseDto;
  account?: AccountResponseDto;
  createdAt: string;
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'INCOME' | 'EXPENSE';
  description?: string;
  color?: string;
  icon?: string;
}

export interface AccountResponseDto {
  id: string;
  name: string;
  type: string;
  balance: number;
  description?: string;
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
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

// ============= Fee Types (Cotas) =============
export type FeeStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface FeeResponseDto {
  id: string;
  memberId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: FeeStatus;
  notes?: string;
  accountId?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  member?: MemberResponseDto;
  account?: AccountResponseDto;
  transaction?: TransactionResponseDto;
}

export interface CreateFeeDto {
  memberId: string;
  amount: number;
  dueDate: string;
  status?: FeeStatus;
  notes?: string;
}

export interface GenerateFeesDto {
  amount: number;
  dueDate: string;
  unitId?: string;
  notes?: string;
}

export interface PayFeeDto {
  accountId: string;
  paymentDate?: string;
  notes?: string;
}

// Legacy aliases for compatibility
export type MembershipFeeStatus = FeeStatus;
export type MembershipFeeResponseDto = FeeResponseDto;
export type CreateMembershipFeeDto = CreateFeeDto;
export type GenerateMembershipFeesDto = GenerateFeesDto;
export type PayMembershipFeeDto = PayFeeDto;

// ============= Inventory Types =============
export interface InventoryItemResponseDto {
  id: string;
  name: string;
  description?: string;
  code?: string;
  categoryId: string;
  unitOfMeasure: string;
  quantityInStock: number;
  minimumStock: number;
  condition: 'NEW' | 'GOOD' | 'WORN' | 'DAMAGED';
  location?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  supplier?: string;
  observations?: string;
  photoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: InventoryCategoryResponseDto;
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
  // Optional role-based visibility control; when provided, only users with one of these roles can see the item
  allowedRoles?: string[];
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
// CreateMemberDto and UpdateMemberDto defined above in Member Types

// CreateEventDto e UpdateEventDto estão definidos acima em Event Types

export interface CreateTransactionDto {
  type: 'INCOME' | 'EXPENSE' | 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  accountId: string;
  date: string;
  memberId?: string;
  eventId?: string;
  receiptUrl?: string;
  status?: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  recurring?: boolean;
  recurringType?: string;
  tags?: string[];
}

export interface CreateItemDto {
  name: string;
  description?: string;
  code?: string;
  categoryId: string;
  unitOfMeasure: string;
  quantityInStock?: number;
  minimumStock?: number;
  condition?: 'NEW' | 'GOOD' | 'WORN' | 'DAMAGED';
  location?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  supplier?: string;
  observations?: string;
  photoUrl?: string;
  isActive?: boolean;
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
