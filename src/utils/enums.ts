/**
 * Enums da API - Devem corresponder exatamente aos enums do backend
 */

// ============= Finance Enums =============

/**
 * Tipos de Conta Financeira
 * Backend: AccountType enum
 */
export const ACCOUNT_TYPES = {
  BANK: 'BANK',           // Conta bancária
  CASH: 'CASH',           // Dinheiro (caixa)
  CREDIT_CARD: 'CREDIT_CARD',  // Cartão de crédito
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];

/**
 * Tipos de Transação
 * Backend: TransactionType enum
 */
export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',    // Receita
  EXPENSE: 'EXPENSE',  // Despesa
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

/**
 * Status de Pagamento
 * Backend: PaymentStatus enum
 */
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',      // Pendente
  PAID: 'PAID',           // Pago
  OVERDUE: 'OVERDUE',     // Atrasado
  CANCELLED: 'CANCELLED', // Cancelado
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// ============= Member Enums =============

/**
 * Gênero
 * Backend: GenderEnum
 */
export const GENDER = {
  MASCULINO: 'MASCULINO',
  FEMININO: 'FEMININO',
  MISTO: 'MISTO',
} as const;

export type Gender = typeof GENDER[keyof typeof GENDER];

/**
 * Classes de Desbravadores
 * Backend: ClassEnum
 */
export const CLASSES = {
  AMIGO: 'AMIGO',               // 10 anos
  COMPANHEIRO: 'COMPANHEIRO',   // 11 anos
  PESQUISADOR: 'PESQUISADOR',   // 12 anos
  PIONEIRO: 'PIONEIRO',         // 13 anos
  EXCURSIONISTA: 'EXCURSIONISTA', // 14 anos
  GUIA: 'GUIA',                 // 15 anos
  LIDER: 'LIDER',               // Líder
} as const;

export type ClassType = typeof CLASSES[keyof typeof CLASSES];

/**
 * Papéis/Funções
 * Backend: RoleEnum
 */
export const ROLES = {
  DIRECTOR: 'DIRECTOR',
  CONSELHEIRO: 'CONSELHEIRO',
  TESOUREIRO: 'TESOUREIRO',
  PAI: 'PAI',
  MEMBRO: 'MEMBRO',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// ============= Event Enums =============

/**
 * Status de Evento
 * Backend: EventStatus enum
 */
export const EVENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type EventStatus = typeof EVENT_STATUS[keyof typeof EVENT_STATUS];

/**
 * Tipos de Evento
 * Backend: EventType enum
 */
export const EVENT_TYPES = {
  MEETING: 'MEETING',
  CAMP: 'CAMP',
  ACTIVITY: 'ACTIVITY',
  CEREMONY: 'CEREMONY',
  TRAINING: 'TRAINING',
  COMMUNITY_SERVICE: 'COMMUNITY_SERVICE',
  OTHER: 'OTHER',
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

/**
 * Status de Participante
 * Backend: ParticipantStatus enum
 */
export const PARTICIPANT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  DECLINED: 'DECLINED',
  ATTENDED: 'ATTENDED',
  ABSENT: 'ABSENT',
} as const;

export type ParticipantStatus = typeof PARTICIPANT_STATUS[keyof typeof PARTICIPANT_STATUS];

// ============= Helper Functions =============

/**
 * Valida se um valor é um AccountType válido
 */
export const isValidAccountType = (value: string): value is AccountType => {
  return Object.values(ACCOUNT_TYPES).includes(value as AccountType);
};

/**
 * Valida se um valor é um PaymentStatus válido
 */
export const isValidPaymentStatus = (value: string): value is PaymentStatus => {
  return Object.values(PAYMENT_STATUS).includes(value as PaymentStatus);
};

/**
 * Obtém label amigável para tipo de conta
 */
export const getAccountTypeLabel = (type: AccountType): string => {
  const labels: Record<AccountType, string> = {
    BANK: 'Conta Bancária',
    CASH: 'Caixa (Dinheiro)',
    CREDIT_CARD: 'Cartão de Crédito',
  };
  return labels[type] || type;
};

/**
 * Obtém label amigável para status de pagamento
 */
export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  const labels: Record<PaymentStatus, string> = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    OVERDUE: 'Atrasado',
    CANCELLED: 'Cancelado',
  };
  return labels[status] || status;
};
