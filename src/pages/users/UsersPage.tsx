import React, { useState } from 'react';
import { Plus, Search, User, Shield } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { MainLayout } from '../../components/layout/MainLayout';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import type { UserResponseDto } from '../../types';

export const UsersPage: React.FC = () => {
  const { users, isLoading, error, createUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const userFormFields: FormField[] = [
    { name: 'fullName', label: 'Nome Completo', type: 'text', required: true, placeholder: 'João Silva' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'joao@exemplo.com' },
    { name: 'password', label: 'Senha', type: 'password', required: true, placeholder: 'Ex: Senha@123 (maiúscula, minúscula, número e @$!%*?&)' },
    { name: 'confirmPassword', label: 'Confirmar Senha', type: 'password', required: true, placeholder: 'Repita a senha' },
    { 
      name: 'role', 
      label: 'Função', 
      type: 'select', 
      required: true,
      options: [
        { value: 'DIRECTOR', label: 'Diretor' },
        { value: 'LEADER', label: 'Líder' },
        { value: 'CONSELHEIRO', label: 'Conselheiro' },
        { value: 'ADMIN', label: 'Administrador' },
      ]
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-purple-100 text-purple-800',
      DIRECTOR: 'bg-blue-100 text-blue-800',
      LEADER: 'bg-green-100 text-green-800',
      CONSELHEIRO: 'bg-yellow-100 text-yellow-800',
      MEMBRO: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      ADMIN: 'Administrador',
      DIRECTOR: 'Diretor',
      LEADER: 'Líder',
      CONSELHEIRO: 'Conselheiro',
      MEMBRO: 'Membro',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role as keyof typeof styles] || styles.MEMBRO}`}>
        {labels[role as keyof typeof labels] || role}
      </span>
    );
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Usuário', 
      render: (u: UserResponseDto) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{u.name}</div>
            <div className="text-sm text-gray-500">{u.email}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'role', 
      label: 'Função', 
      render: (u: UserResponseDto) => getRoleBadge(u.role)
    },
    { 
      key: 'createdAt', 
      label: 'Criado em',
      render: (u: UserResponseDto) => u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '-'
    },
  ];

  const handleCreate = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      
      if (data.password !== data.confirmPassword) {
        setActionError('As senhas não coincidem');
        return;
      }

      // Validação de senha forte
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(data.password)) {
        setActionError('A senha deve ter no mínimo 8 caracteres e conter: letra maiúscula, minúscula, número e caractere especial (@$!%*?&)');
        return;
      }

      await createUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role,
      });
      
      setActionSuccess('Usuário criado com sucesso!');
      setIsCreateModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (user: UserResponseDto) => {
    if (!window.confirm(`Deseja realmente deletar o usuário "${user.name}"?`)) return;
    
    try {
      setActionError(null);
      await deleteUser(user.id);
      setActionSuccess('Usuário deletado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  return (
    <MainLayout title="Usuários">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
            <p className="text-gray-600 mt-1">Crie e gerencie contas de diretores, líderes, conselheiros e administradores</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Novo Usuário
          </Button>
        </div>

        {actionSuccess && <Alert type="success">{actionSuccess}</Alert>}
        {actionError && <Alert type="error">{actionError}</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        <Card>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar usuários por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Table
            data={filteredUsers}
            columns={columns}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </Card>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Criar Novo Usuário"
        >
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield size={20} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Criando conta de sistema</p>
                <p>Este usuário terá acesso ao painel administrativo do clube. Use para criar contas de diretores, líderes, conselheiros e outros associados.</p>
              </div>
            </div>
          </div>
          <Form
            fields={userFormFields}
            onSubmit={handleCreate}
            submitLabel="Criar Usuário"
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};
