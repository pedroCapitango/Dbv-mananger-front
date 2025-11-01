import { API_BASE_URL } from '../utils/constants';
import type {
  RegisterDto,
  RegisterSimpleDto,
  RegisterMemberDto,
  AuthResponseDto,
  UserResponseDto,
  MemberResponseDto,
  CreateMemberDto,
  UpdateMemberDto,
  EventResponseDto,
  CreateEventDto,
  UpdateEventDto,
  EventParticipantDto,
  EventStatisticsDto,
  AddParticipantDto,
  UpdateParticipantStatusDto,
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
  private debug: boolean;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  // Debug habilitado via env: VITE_DEBUG_API=true. Evitar logs verbosos em produção.
  const env: any = (import.meta as any)?.env || {};
  this.debug = (env.VITE_DEBUG_API === 'true') || false;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };


    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const method = (options.method || 'GET').toString().toUpperCase();
    const url = `${this.baseUrl}${endpoint}`;

    if (this.debug) {
      // Evitar logar payloads enormes ou dados sensíveis em produção
      const bodyPreview = typeof options.body === 'string' && options.body.length > 300
        ? options.body.substring(0, 300) + '...'
        : options.body;
      console.log('➡️ API Request:', { method, url, headers, body: bodyPreview });
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (this.debug) {
        console.log('⬅️ API Response:', { method, url, status: response.status });
      }

      // Para DELETE sem body
      if (response.status === 204) {
        return {} as T;
      }

      // Verificar se a resposta é JSON antes de tentar fazer parse
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Se não for JSON, pegar o texto
        const text = await response.text();
        data = { message: text || `Erro ${response.status}` };
      }

      if (!response.ok) {
        // Montar detalhes contextuais
        const detailsParts: string[] = [];

        // Extrair mensagens de validação quando existirem
        if (data?.errors) {
          if (Array.isArray(data.errors)) {
            detailsParts.push(
              data.errors
                .map((e: any) => e?.message || e?.msg || JSON.stringify(e))
                .join('; ')
            );
          } else if (typeof data.errors === 'object') {
            detailsParts.push(
              Object.entries(data.errors)
                .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                .join('; ')
            );
          }
        } else if (data?.error && typeof data.error === 'string') {
          detailsParts.push(data.error);
        } else if (data?.message && typeof data.message === 'string') {
          detailsParts.push(data.message);
        }

        const details = detailsParts.filter(Boolean).join(' | ');

        let errorMessage = 'Erro na requisição';
        if (response.status === 400 || response.status === 422) {
          errorMessage = `Falha de validação em ${method} ${endpoint}${details ? `: ${details}` : ''}`;
        } else if (response.status === 401) {
          // Se não autorizado, limpar token salvo
          this.setToken(null);
          errorMessage = details || 'Credenciais inválidas. Verifique seu email e senha.';
        } else if (response.status === 403) {
          errorMessage = details || 'Acesso negado.';
        } else if (response.status === 404) {
          errorMessage = `Rota não encontrada: ${url}. Verifique se o backend está configurado corretamente.`;
        } else if (response.status >= 500) {
          errorMessage = `Erro no servidor (${response.status}) em ${method} ${endpoint}${details ? `: ${details}` : ''}`;
        } else {
          errorMessage = details || `Erro ${response.status} em ${method} ${endpoint}`;
        }

        if (this.debug) {
          console.error('❌ API Error:', { method, url, status: response.status, data, message: errorMessage });
        }

        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      // Se for erro de rede
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão ou se o backend está online.');
      }
      if (this.debug) {
        console.error('API Error (catch):', error);
      }
      throw error;
    }
  }

  // ============= Auth Endpoints =============
  async login(email: string, password: string) {
    console.log('🌐 API Service: Fazendo requisição de login para:', `${this.baseUrl}/auth/login`);
    console.log('📧 Dados:', { email, password });
    
    const response = await this.request<AuthResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    console.log('📦 Resposta recebida:', response);
    
    if (response.access_token) {
      this.setToken(response.access_token);
      console.log('🔑 Token salvo:', response.access_token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ Resposta não contém access_token!');
    }
    
    return response;
  }

  // Registro Simples - Cria apenas User (staff/diretores/conselheiros)
  async registerSimple(data: RegisterSimpleDto) {
    console.log('🌐 API Service: Registrando usuário simples:', `${this.baseUrl}/auth/register`);
    const response = await this.request<AuthResponseDto>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
      console.log('🔑 Token salvo após registro simples');
    }
    
    return response;
  }

  // Registro de Membro - Cria User + Member (transação atômica)
  async registerMember(data: RegisterMemberDto) {
    console.log('🌐 API Service: Registrando membro completo:', `${this.baseUrl}/auth/register-member`);
    const response = await this.request<AuthResponseDto>('/auth/register-member', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
      console.log('🔑 Token salvo após registro de membro');
    }
    
    return response;
  }

  // Legacy - manter para compatibilidade
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
      method: 'PATCH',
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

  // Buscar unidades sem autenticação (para tela de registro)
  async getUnitsPublic() {
    const url = `${this.baseUrl}/units`;
    
    if (this.debug) {
      console.log('➡️ API Request (Public):', { url });
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (this.debug) {
        console.log('⬅️ API Response (Public):', { url, status: response.status });
      }

      if (!response.ok) {
        throw new Error(`Erro ao buscar unidades: ${response.status}`);
      }

      const data = await response.json();
      return data as UnitResponseDto[];
    } catch (error: any) {
      console.error('Erro ao buscar unidades públicas:', error);
      throw error;
    }
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
  
  // CRUD de Eventos
  async getEvents(filters?: {
    eventType?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    let url = '/events';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
    }
    return this.request<EventResponseDto[]>(url);
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
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string) {
    return this.request<EventResponseDto>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async getEventStatistics(eventId: string) {
    return this.request<EventStatisticsDto>(`/events/${eventId}/statistics`);
  }

  // Gerenciamento de Participantes
  async getEventParticipants(eventId: string) {
    return this.request<EventParticipantDto[]>(`/events/${eventId}/participants`);
  }

  async addEventParticipant(eventId: string, data: AddParticipantDto) {
    return this.request<EventParticipantDto>(`/events/${eventId}/participants`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateParticipantStatus(eventId: string, memberId: string, data: UpdateParticipantStatusDto) {
    return this.request<EventParticipantDto>(`/events/${eventId}/participants/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async removeEventParticipant(eventId: string, memberId: string) {
    return this.request<EventParticipantDto>(`/events/${eventId}/participants/${memberId}`, {
      method: 'DELETE',
    });
  }

  async getMemberEvents(memberId: string) {
    return this.request<EventParticipantDto[]>(`/events/member/${memberId}`);
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
