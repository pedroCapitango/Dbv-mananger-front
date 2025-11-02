# 📅 Guia de API de Eventos - Formato Correto

## ⚠️ Correções Implementadas para Evitar Erro 400

### 1. **Campo `eventType` (não `type`)**
```typescript
// ❌ ERRADO
{ type: 'meeting' }

// ✅ CORRETO
{ eventType: 'MEETING' }
```

### 2. **Valores UPPERCASE para Enums**

#### EventType (Tipos de Evento)
```typescript
// ❌ ERRADO
'meeting', 'campamento', 'training', 'social', 'service', 'other'

// ✅ CORRETO
'MEETING' | 'CAMP' | 'ACTIVITY' | 'CEREMONY' | 'TRAINING' | 'COMMUNITY_SERVICE' | 'OTHER'
```

#### EventStatus (Status do Evento)
```typescript
// ❌ ERRADO
'scheduled', 'ongoing', 'completed', 'cancelled'

// ✅ CORRETO
'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
```

### 3. **Formato ISO 8601 para Datas**
```typescript
// ❌ ERRADO
startDate: '2025-11-01T10:00'  // datetime-local format

// ✅ CORRETO
startDate: '2025-11-01T10:00:00.000Z'  // ISO 8601 format
```

### 4. **Campo `cost` como Number (não String)**
```typescript
// ❌ ERRADO
cost: '5000'

// ✅ CORRETO
cost: 5000  // ou parseFloat('5000')
```

### 5. **Campos Opcionais como `undefined` (não empty string)**
```typescript
// ❌ ERRADO
{
  description: '',
  endDate: '',
  location: ''
}

// ✅ CORRETO
{
  description: undefined,
  endDate: undefined,
  location: undefined
}
```

## 📝 Exemplo Completo de Requisição

### POST /events - Criar Evento

```typescript
const eventData: CreateEventDto = {
  title: 'Acampamento de Inverno 2025',
  description: 'Acampamento anual da unidade na Serra da Leba',
  eventType: 'CAMP',
  startDate: '2025-11-01T08:00:00.000Z',
  endDate: '2025-11-03T17:00:00.000Z',
  location: 'Serra da Leba, Huíla',
  cost: 15000.00,
  maxParticipants: 50,
  requiresConfirmation: true,
  status: 'SCHEDULED'
};

// Envio
const response = await apiService.createEvent(eventData);
```

### PATCH /events/:id - Atualizar Evento

```typescript
const updateData: UpdateEventDto = {
  status: 'CONFIRMED',
  maxParticipants: 60
};

const response = await apiService.updateEvent(eventId, updateData);
```

## 🔄 Transformação de Dados do Formulário

No `EventsPage.tsx`, os dados do formulário são transformados antes do envio:

```typescript
const handleCreate = async (data: Record<string, any>) => {
  const eventData: CreateEventDto = {
    title: data.title,
    description: data.description || undefined,
    eventType: data.eventType,  // ✅ Já vem correto do select
    startDate: new Date(data.startDate).toISOString(),  // ✅ Converte para ISO 8601
    endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    location: data.location || undefined,
    cost: data.cost ? parseFloat(data.cost) : undefined,  // ✅ Converte para number
    maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : undefined,
    status: data.status || 'SCHEDULED',  // ✅ Default UPPERCASE
  };
  
  await createEvent(eventData);
};
```

## 📋 Campos do Formulário Corretos

```typescript
const eventFormFields: FormField[] = [
  { name: 'title', label: 'Título do Evento', type: 'text', required: true },
  { name: 'description', label: 'Descrição', type: 'textarea' },
  { 
    name: 'eventType',  // ✅ Campo correto
    label: 'Tipo de Evento', 
    type: 'select', 
    required: true,
    options: [
      { value: 'MEETING', label: 'Reunião' },  // ✅ Valores UPPERCASE
      { value: 'CAMP', label: 'Acampamento' },
      { value: 'ACTIVITY', label: 'Atividade' },
      { value: 'CEREMONY', label: 'Cerimônia' },
      { value: 'TRAINING', label: 'Treinamento' },
      { value: 'COMMUNITY_SERVICE', label: 'Serviço Comunitário' },
      { value: 'OTHER', label: 'Outro' }
    ]
  },
  { name: 'startDate', label: 'Data de Início', type: 'datetime-local', required: true },
  { name: 'endDate', label: 'Data de Término', type: 'datetime-local' },
  { name: 'location', label: 'Local', type: 'text' },
  { name: 'cost', label: 'Custo (AOA)', type: 'number' },
  { name: 'maxParticipants', label: 'Máximo de Participantes', type: 'number' },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { value: 'SCHEDULED', label: 'Agendado' },  // ✅ Valores UPPERCASE
      { value: 'CONFIRMED', label: 'Confirmado' },
      { value: 'COMPLETED', label: 'Concluído' },
      { value: 'CANCELLED', label: 'Cancelado' }
    ]
  }
];
```

## 🎯 Validação de Dados

O backend valida:
- ✅ `title`: string, obrigatório, min 1 caractere
- ✅ `eventType`: enum EventType, obrigatório
- ✅ `startDate`: ISO 8601 datetime, obrigatório
- ✅ `endDate`: ISO 8601 datetime, opcional, deve ser > startDate
- ✅ `cost`: DECIMAL(10,2), opcional, >= 0
- ✅ `maxParticipants`: integer, opcional, >= 1
- ✅ `status`: enum EventStatus, opcional, default 'SCHEDULED'

## 🔍 Debugging de Erro 400

Se você receber erro 400, verifique:

1. **Campo `eventType` presente?** (não `type`)
2. **Valores de enum em UPPERCASE?** (MEETING não meeting)
3. **Datas em formato ISO 8601?** (use `.toISOString()`)
4. **Cost é number?** (não string)
5. **Campos vazios são undefined?** (não empty string '')

## 📚 Documentação Completa da API

Ver arquivo de documentação original para todos os endpoints:
- POST /events - Criar evento
- GET /events - Listar eventos (com filtros)
- GET /events/:id - Buscar evento específico
- PATCH /events/:id - Atualizar evento
- DELETE /events/:id - Deletar evento
- GET /events/:id/statistics - Estatísticas do evento
- POST /events/:eventId/participants - Adicionar participante
- PATCH /events/:eventId/participants/:memberId - Atualizar status
- DELETE /events/:eventId/participants/:memberId - Remover participante

## ✅ Status da Implementação

- [x] CreateEventDto com campos corretos
- [x] EventType com valores UPPERCASE
- [x] EventStatus com valores UPPERCASE
- [x] Transformação de datas para ISO 8601
- [x] Conversão de cost para number
- [x] Campos opcionais como undefined
- [x] Formulário com field name `eventType`
- [x] Select options com valores corretos
- [x] Handlers com transformação adequada
- [x] TypeScript types alinhados com backend
- [x] Build sem erros

## 🚀 Testes Recomendados

1. Criar evento apenas com campos obrigatórios
2. Criar evento com todos os campos preenchidos
3. Atualizar evento existente
4. Verificar validação de datas (endDate > startDate)
5. Testar com cost decimal (ex: 1500.50)
6. Testar todos os tipos de evento (MEETING, CAMP, etc.)
7. Testar todos os status (SCHEDULED, CONFIRMED, etc.)
