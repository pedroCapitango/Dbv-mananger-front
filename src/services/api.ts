import { API_BASE_URL } from '../utils/constants';
import type {
  RegisterDto,
  AuthResponseDto,
  UserResponseDto,
  MemberResponseDto,
  CreateMemberDto,
  UpdateMemberDto,
  EventResponseDto,
  CreateEventDto,
  UpdateEventDto,
  TransactionResponseDto,
  CreateTransactionDto,
  CategoryResponseDto,
  AccountResponseDto,
  FinanceDashboardDto,
  InventoryItemResponseDto,
  CreateItemDto,
  UpdateItemDto,
  LoanResponseDto,
  CreateLoanDto,
  AttendanceResponseDto,
  RecordAttendanceDto,
  MemberProgressResponseDto,
  MemberSpecialtyResponseDto,
  PostResponseDto,
  CreatePostDto,
  UnitResponseDto,
  CreateUnitDto,
} from '../types';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      // Para DELETE sem body
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ============= Auth Endpoints =============
  async login(email: string, password: string) {
    const response = await this.request<AuthResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async register(data: RegisterDto) {
    const response = await this.request<AuthResponseDto>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    return response;
  }

  async logout() {
    this.setToken(null);
  }

  // ============= User Endpoints =============
  async getUsers() {
    return this.request<UserResponseDto[]>('/users');
  }

  async getUser(id: number) {
    return this.request<UserResponseDto>(`/users/${id}`);
  }

  async createUser(data: any) {
    return this.request<UserResponseDto>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: number, data: any) {
    return this.request<UserResponseDto>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: number) {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // ============= Member Endpoints =============
  async getMembers() {
    return this.request<MemberResponseDto[]>('/members');
  }

  async getMember(id: string) {
    return this.request<MemberResponseDto>(`/members/${id}`);
  }

  async createMember(data: CreateMemberDto) {
    return this.request<MemberResponseDto>('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMember(id: string, data: UpdateMemberDto) {
    return this.request<MemberResponseDto>(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMember(id: string) {
    return this.request<void>(`/members/${id}`, {
      method: 'DELETE',
    });
  }

  async restoreMember(id: string) {
    return this.request<MemberResponseDto>(`/members/${id}/restore`, {
      method: 'POST',
    });
  }

  // ============= Unit Endpoints =============
  async getUnits() {
    return this.request<UnitResponseDto[]>('/units');
  }

  async getUnit(id: string) {
    return this.request<UnitResponseDto>(`/units/${id}`);
  }

  async createUnit(data: CreateUnitDto) {
    return this.request<UnitResponseDto>('/units', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUnit(id: string, data: Partial<CreateUnitDto>) {
    return this.request<UnitResponseDto>(`/units/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUnit(id: string) {
    return this.request<void>(`/units/${id}`, {
      method: 'DELETE',
    });
  }

  // ============= Event Endpoints =============
  async getEvents() {
    return this.request<EventResponseDto[]>('/events');
  }

  async getEvent(id: string) {
    return this.request<EventResponseDto>(`/events/${id}`);
  }

  async createEvent(data: CreateEventDto) {
    return this.request<EventResponseDto>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: UpdateEventDto) {
    return this.request<EventResponseDto>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string) {
    return this.request<void>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async getEventParticipants(eventId: string) {
    return this.request<any>(`/events/${eventId}/participants`);
  }

  async addEventParticipant(eventId: string, memberId: string, data?: any) {
    return this.request<any>(`/events/${eventId}/participants/${memberId}`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async removeEventParticipant(eventId: string, memberId: string) {
    return this.request<void>(`/events/${eventId}/participants/${memberId}`, {
      method: 'DELETE',
    });
  }

  async getEventStatistics(eventId: string) {
    return this.request<any>(`/events/${eventId}/statistics`);
  }

  async getMemberEvents(memberId: string) {
    return this.request<EventResponseDto[]>(`/events/member/${memberId}`);
  }

  // ============= Finance Endpoints =============
  async getFinanceDashboard() {
    return this.request<FinanceDashboardDto>('/finance/dashboard');
  }

  async getTransactions() {
    return this.request<TransactionResponseDto[]>('/finance/transactions');
  }

  async getTransaction(id: string) {
    return this.request<TransactionResponseDto>(`/finance/transactions/${id}`);
  }

  async createTransaction(data: CreateTransactionDto) {
    return this.request<TransactionResponseDto>('/finance/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTransaction(id: string, data: Partial<CreateTransactionDto>) {
    return this.request<TransactionResponseDto>(`/finance/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(id: string) {
    return this.request<void>(`/finance/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories() {
    return this.request<CategoryResponseDto[]>('/finance/categories');
  }

  async getAccounts() {
    return this.request<AccountResponseDto[]>('/finance/accounts');
  }

  async getMembershipFees() {
    return this.request<any[]>('/finance/membership-fees');
  }

  async generateMembershipFees(data: any) {
    return this.request<any>('/finance/membership-fees/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async payMembershipFee(id: string, data: any) {
    return this.request<any>(`/finance/membership-fees/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMonthlyReport(year: number, month: number) {
    return this.request<any>(`/finance/reports/monthly/${year}/${month}`);
  }

  // ============= Inventory Endpoints =============
  async getInventoryDashboard() {
    return this.request<any>('/inventory/dashboard');
  }

  async getInventoryItems() {
    return this.request<InventoryItemResponseDto[]>('/inventory/items');
  }

  async getInventoryItem(id: string) {
    return this.request<InventoryItemResponseDto>(`/inventory/items/${id}`);
  }

  async createInventoryItem(data: CreateItemDto) {
    return this.request<InventoryItemResponseDto>('/inventory/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInventoryItem(id: string, data: UpdateItemDto) {
    return this.request<InventoryItemResponseDto>(`/inventory/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInventoryItem(id: string) {
    return this.request<void>(`/inventory/items/${id}`, {
      method: 'DELETE',
    });
  }

  async getInventoryCategories() {
    return this.request<any[]>('/inventory/categories');
  }

  async getLoans() {
    return this.request<LoanResponseDto[]>('/inventory/loans');
  }

  async createLoan(data: CreateLoanDto) {
    return this.request<LoanResponseDto>('/inventory/loans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async returnLoan(id: string, data: any) {
    return this.request<LoanResponseDto>(`/inventory/loans/${id}/return`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMovements() {
    return this.request<any[]>('/inventory/movements');
  }

  // ============= Attendance Endpoints =============
  async getAttendances() {
    return this.request<AttendanceResponseDto[]>('/attendance');
  }

  async recordAttendance(data: RecordAttendanceDto) {
    return this.request<AttendanceResponseDto>('/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bulkRecordAttendance(data: any) {
    return this.request<any>('/attendance/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEventAttendance(eventId: string) {
    return this.request<AttendanceResponseDto[]>(`/attendance/event/${eventId}`);
  }

  async getMemberAttendance(memberId: string) {
    return this.request<AttendanceResponseDto[]>(`/attendance/member/${memberId}`);
  }

  async getAttendanceStatistics() {
    return this.request<any>('/attendance/statistics/overall');
  }

  // ============= Progress Endpoints =============
  async getMemberProgress() {
    return this.request<MemberProgressResponseDto[]>('/member-progress');
  }

  async createMemberProgress(data: any) {
    return this.request<MemberProgressResponseDto>('/member-progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMemberSpecialties(memberId: string) {
    return this.request<MemberSpecialtyResponseDto[]>(`/member-specialties/member/${memberId}`);
  }

  async createMemberSpecialty(data: any) {
    return this.request<MemberSpecialtyResponseDto>('/member-specialties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============= Feed/Posts Endpoints =============
  async getPosts() {
    return this.request<PostResponseDto[]>('/feed');
  }

  async getPublicPosts() {
    return this.request<PostResponseDto[]>('/feed/public');
  }

  async getPost(id: string) {
    return this.request<PostResponseDto>(`/feed/${id}`);
  }

  async createPost(data: CreatePostDto) {
    return this.request<PostResponseDto>('/feed', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePost(id: string, data: Partial<CreatePostDto>) {
    return this.request<PostResponseDto>(`/feed/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: string) {
    return this.request<void>(`/feed/${id}`, {
      method: 'DELETE',
    });
  }

  async getEventPosts(eventId: string) {
    return this.request<PostResponseDto[]>(`/feed/event/${eventId}/posts`);
  }

  async addComment(postId: string, content: string) {
    return this.request<any>(`/feed/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async addReaction(postId: string, type: string) {
    return this.request<any>(`/feed/${postId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  // ============= Health Check =============
  async healthCheck() {
    return this.request<any>('/health');
  }
}

export const apiService = new ApiService(API_BASE_URL);
