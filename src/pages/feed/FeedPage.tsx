import React, { useState } from 'react';
import { Plus, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useFeed } from '../../hooks/useFeed';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import type { CreatePostDto } from '../../types';
import { formatDate } from '../../utils/formatters';

const postFormFields: FormField[] = [
  { name: 'title', label: 'Título', type: 'text', required: true, placeholder: 'Título do post...' },
  { name: 'content', label: 'Conteúdo', type: 'textarea', required: true, placeholder: 'Escreva algo...' },
  { 
    name: 'visibility', 
    label: 'Visibilidade', 
    type: 'select', 
    required: true,
    options: [
      { value: 'public', label: 'Público' },
      { value: 'members', label: 'Somente Membros' },
      { value: 'private', label: 'Privado' }
    ]
  },
];

export const FeedPage: React.FC = () => {
  const { posts, isLoading, error, createPost, updatePost, deletePost, addComment, addReaction } = useFeed();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleCreatePost = async (data: Record<string, any>) => {
    try {
      setActionError(null);
      await createPost(data as CreatePostDto);
      setActionSuccess('Post criado com sucesso!');
      setIsCreateModalOpen(false);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleUpdatePost = async (data: Record<string, any>) => {
    if (!selectedPost) return;
    try {
      setActionError(null);
      await updatePost(selectedPost.id, data);
      setIsEditModalOpen(false);
      setSelectedPost(null);
      setActionSuccess('Post atualizado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDeletePost = async (post: any) => {
    if (!window.confirm('Deseja realmente deletar este post?')) return;
    
    try {
      setActionError(null);
      await deletePost(post.id);
      setActionSuccess('Post deletado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleAddComment = async (postId: string) => {
    const content = commentContent[postId];
    if (!content || !content.trim()) return;

    try {
      setActionError(null);
      await addComment(postId, content);
      setCommentContent({ ...commentContent, [postId]: '' });
      setActionSuccess('Comentário adicionado!');
      setTimeout(() => setActionSuccess(null), 2000);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleAddReaction = async (postId: string, type: string) => {
    try {
      setActionError(null);
      await addReaction(postId, type);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const openEditModal = (post: any) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feed Social</h1>
          <p className="text-gray-600 mt-1">Compartilhe e interaja com a comunidade</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} icon={Plus}>
          Novo Post
        </Button>
      </div>

      {actionSuccess && <Alert variant="success">{actionSuccess}</Alert>}
      {actionError && <Alert variant="error">{actionError}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      {isLoading ? (
        <Card>
          <p className="text-center py-8 text-gray-500">Carregando posts...</p>
        </Card>
      ) : posts.length === 0 ? (
        <Card>
          <p className="text-center py-8 text-gray-500">Nenhum post ainda. Seja o primeiro a postar!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(post.createdAt)} • {post.author?.name || 'Autor Desconhecido'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => openEditModal(post)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeletePost(post)}>
                      Deletar
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

                <div className="flex items-center gap-4 pt-2 border-t">
                  <button
                    onClick={() => handleAddReaction(post.id, 'like')}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart size={20} />
                    <span className="text-sm">{post.reactions?.length || 0}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle size={20} />
                    <span className="text-sm">{post.comments?.length || 0}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-green-500 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>

                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-sm font-medium text-gray-700">Comentários:</p>
                    {post.comments.map((comment: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900">{comment.author?.name}</p>
                        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Adicionar comentário..."
                    value={commentContent[post.id] || ''}
                    onChange={(e) => setCommentContent({ ...commentContent, [post.id]: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                  />
                  <Button onClick={() => handleAddComment(post.id)} size="sm">
                    Comentar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Post"
      >
        <Form
          fields={postFormFields}
          onSubmit={handleCreatePost}
          submitLabel="Publicar"
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPost(null);
        }}
        title="Editar Post"
      >
        {selectedPost && (
          <Form
            fields={postFormFields}
            initialValues={selectedPost}
            onSubmit={handleUpdatePost}
            submitLabel="Salvar Alterações"
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedPost(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};
