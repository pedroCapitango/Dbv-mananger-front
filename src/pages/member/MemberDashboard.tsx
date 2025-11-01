import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Award, 
  DollarSign, 
  Package, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Flame,
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Smile,
  Send,
  TrendingUp,
  Users
} from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../hooks/useEvents';

interface MemberStats {
  className: string;
  classProgress: number;
  specialties: number;
  attendanceRate: number;
  attendanceStreak: number;
  totalPresences: number;
  totalMeetings: number;
}

interface MembershipFee {
  month: string;
  year: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  amount?: number;
}

interface Loan {
  id: string;
  itemName: string;
  dueDate: string;
  daysRemaining: number;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  mediaUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const [newPostContent, setNewPostContent] = useState('');

  // Mock data - substituir por dados reais da API
  const memberStats: MemberStats = {
    className: 'COMPANHEIRO',
    classProgress: 75,
    specialties: 12,
    attendanceRate: 87.5,
    attendanceStreak: 5,
    totalPresences: 42,
    totalMeetings: 48
  };

  const upcomingEvents = events
    .filter(e => e.status === 'SCHEDULED' || e.status === 'CONFIRMED')
    .slice(0, 3);

  const membershipFees: MembershipFee[] = [
    { month: 'Fevereiro', year: 2025, status: 'paid', dueDate: '2025-02-05', amount: 5000 },
    { month: 'Março', year: 2025, status: 'pending', dueDate: '2025-03-05', amount: 5000 },
  ];

  const loans: Loan[] = [
    { id: '1', itemName: 'Camisa Oficial M', dueDate: '2025-01-30', daysRemaining: 5 },
  ];

  const posts: Post[] = [
    {
      id: '1',
      author: { name: 'Clube Desbravadores', avatar: undefined, role: 'Administração' },
      content: '🏕️ Não percam! Acampamento de inverno acontece nos dias 15-17 de Fevereiro. Vagas limitadas! Confirmem presença até amanhã.',
      mediaUrl: undefined,
      timestamp: '2 horas atrás',
      likes: 24,
      comments: 8,
      isLiked: false
    },
    {
      id: '2',
      author: { name: 'Maria Santos', avatar: undefined, role: 'Líder' },
      content: 'Parabéns ao João e à Ana pela conclusão da especialidade de Primeiros Socorros! 🎉👏',
      timestamp: '5 horas atrás',
      likes: 18,
      comments: 5,
      isLiked: true
    },
    {
      id: '3',
      author: { name: 'Pedro Costa', avatar: undefined, role: 'Membro' },
      content: 'Alguém mais animado para o acampamento? Vai ser incrível! 🔥',
      timestamp: '1 dia atrás',
      likes: 12,
      comments: 7,
      isLiked: false
    }
  ];

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) return;
    // TODO: enviar post para API
    console.log('Novo post:', newPostContent);
    setNewPostContent('');
  };

  return (
    <MainLayout title="Início">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Coluna Esquerda - Perfil & Stats */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* Perfil Card */}
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <User size={48} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Olá, {user?.name || 'Membro'}! 👋</h2>
                  <p className="text-blue-100 text-sm mb-4">Bem-vindo de volta!</p>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Classe Atual</span>
                      <span className="text-lg font-bold">{memberStats.className}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${memberStats.classProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-100 mt-1">{memberStats.classProgress}% concluído</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <Award className="mx-auto mb-1" size={24} />
                      <p className="text-2xl font-bold">{memberStats.specialties}</p>
                      <p className="text-xs text-blue-100">Especialidades</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <TrendingUp className="mx-auto mb-1" size={24} />
                      <p className="text-2xl font-bold">{memberStats.attendanceRate}%</p>
                      <p className="text-xs text-blue-100">Presença</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Presenças Card */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Minhas Presenças</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Taxa de Presença</span>
                      <span className="text-2xl font-bold text-green-600">
                        {memberStats.attendanceRate}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {memberStats.totalPresences} de {memberStats.totalMeetings} reuniões
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="text-orange-500" size={20} />
                      <span className="font-semibold text-gray-900">Sequência Atual</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      🔥 {memberStats.attendanceStreak} presenças seguidas
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Continue assim!</p>
                  </div>
                </div>
              </Card>

              {/* Empréstimos Card */}
              {loans.length > 0 && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Package className="text-purple-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">Meus Empréstimos</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {loans.map(loan => (
                      <div key={loan.id} className="bg-purple-50 rounded-lg p-4">
                        <p className="font-medium text-gray-900 mb-2">{loan.itemName}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={16} className="text-purple-600" />
                          <span className="text-gray-600">
                            Devolver até: {new Date(loan.dueDate).toLocaleDateString('pt-AO')}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 font-medium ${
                          loan.daysRemaining <= 3 ? 'text-red-600' : 'text-purple-600'
                        }`}>
                          {loan.daysRemaining} dias restantes
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Coluna Central - Feed */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Próximos Eventos */}
              <Card className="shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Próximos Eventos</h3>
                </div>

                <div className="space-y-3">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map(event => (
                      <div 
                        key={event.id} 
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(event.startDate).toLocaleDateString('pt-AO')}
                              </span>
                              {event.location && (
                                <span>📍 {event.location}</span>
                              )}
                            </div>
                          </div>
                          <Button variant="secondary" className="ml-4">
                            Confirmar
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhum evento próximo</p>
                  )}
                </div>
              </Card>

              {/* Mensalidades */}
              <Card className="shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Mensalidades</h3>
                </div>

                <div className="space-y-3">
                  {membershipFees.map((fee, idx) => (
                    <div 
                      key={idx}
                      className={`rounded-lg p-4 flex items-center justify-between ${
                        fee.status === 'paid' 
                          ? 'bg-green-50' 
                          : fee.status === 'pending'
                          ? 'bg-yellow-50'
                          : 'bg-red-50'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {fee.month} {fee.year}
                        </p>
                        <p className="text-sm text-gray-600">
                          Vencimento: {new Date(fee.dueDate).toLocaleDateString('pt-AO')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {fee.status === 'paid' ? (
                          <>
                            <CheckCircle className="text-green-600" size={20} />
                            <span className="font-semibold text-green-600">PAGO</span>
                          </>
                        ) : fee.status === 'pending' ? (
                          <>
                            <Clock className="text-yellow-600" size={20} />
                            <span className="font-semibold text-yellow-600">PENDENTE</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="text-red-600" size={20} />
                            <span className="font-semibold text-red-600">ATRASADO</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Criar Post */}
              <Card className="shadow-lg">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Compartilhe algo com o grupo..."
                      className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
                          <ImageIcon size={20} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
                          <Smile size={20} />
                        </button>
                      </div>
                      <Button 
                        onClick={handlePostSubmit}
                        disabled={!newPostContent.trim()}
                        className="flex items-center gap-2"
                      >
                        <Send size={18} />
                        Publicar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Feed de Posts */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="text-gray-600" size={24} />
                  <h3 className="font-semibold text-gray-900 text-lg">Feed da Comunidade</h3>
                </div>

                {posts.map(post => (
                  <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow">
                    {/* Post Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                        {post.author.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{post.author.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {post.author.role}
                          </span>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

                    {/* Post Media */}
                    {post.mediaUrl && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={post.mediaUrl} 
                          alt="Post media" 
                          className="w-full h-auto"
                        />
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                      <button className={`flex items-center gap-2 text-sm font-medium transition ${
                        post.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                      }`}>
                        <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                        <MessageCircle size={18} />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition">
                        <Share2 size={18} />
                        Compartilhar
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center py-4">
                <Button variant="secondary">
                  Carregar mais posts
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};
