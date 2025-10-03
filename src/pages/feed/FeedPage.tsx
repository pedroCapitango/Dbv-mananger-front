import React, { useState } from 'react';
import { Plus, MessageCircle, ThumbsUp, Heart, Edit, Trash2, Send } from 'lucide-react';
import { useFeed } from '../../hooks/useFeed';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Form } from '../../components/ui/Form';
import type { FormField } from '../../components/ui/Form';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import type { PostResponseDto, CreatePostDto } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Input } from '../../components/ui/Input';

export const FeedPage: React.FC = () => {
  const { posts, isLoading, error, createPost, updatePost, deletePost, addComment, addReaction } = useFeed();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostResponseDto | null>(null);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const postFormFields: FormField[] = [
    { name: 'content', label: 'Conteúdo', type: 'textarea', required: true, placeholder: 'O que você quer compartilhar?', rows: 4 },
    { 
      name: 'isPublic', 
      label: 'Visibilidade', 
      type: 'select',
      options: [
        { value: 'true', label: 'Público' },
        { value: 'false', label: 'Privado (apenas membros)' },
      ],
    },
  ];

  const handleCreate = async (formData: Record<string, any>) => {
    try {
      const data: CreatePostDto = {
        content: formData.content,
        isPublic: formData.isPublic === 'true',
      };
      await createPost(data);
      setIsCreateModalOpen(false);
      setActionSuccess('Post criado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao criar post');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleEdit = async (formData: Record<string, any>) => {
    if (!selectedPost) return;
    try {
      const data: Partial<CreatePostDto> = {
        content: formData.content,
        isPublic: formData.isPublic === 'true',
      };
      await updatePost(selectedPost.id, data);
      setIsEditModalOpen(false);
      setSelectedPost(null);
      setActionSuccess('Post atualizado com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao atualizar post');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleDelete = async (post: PostResponseDto) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      await deletePost(post.id);
      setActionSuccess('Post excluído com sucesso!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao excluir post');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleAddComment = async (postId: string) => {
    const content = commentText[postId];
    if (!content || !content.trim()) return;
    
    try {
      await addComment(postId, content);
      setCommentText({ ...commentText, [postId]: '' });
      setActionSuccess('Comentário adicionado!');
      setTimeout(() => setActionSuccess(null), 2000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao adicionar comentário');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleReaction = async (postId: string, type: string) => {
    try {
      await addReaction(postId, type);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao reagir');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const openEditModal = (post: PostResponseDto) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  if (error) {
    return (
      <div className="p-6">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
            <p className="text-sm text-gray-600">Compartilhe e interaja com a comunidade</p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Novo Post
        </Button>
      </div>

      {actionSuccess && <Alert type="success" message={actionSuccess} />}
      {actionError && <Alert type="error" message={actionError} />}

      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <p className="text-center text-gray-500">Carregando posts...</p>
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500">Nenhum post ainda. Seja o primeiro a postar!</p>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">
                        {post.author?.name || 'Autor Desconhecido'}
                      </p>
                      {post.isPublic && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                          Público
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => openEditModal(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleDelete(post)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {post.mediaUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Media ${idx + 1}`}
                        className="rounded-lg max-h-64 object-cover"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-3 border-t">
                  <button
                    onClick={() => handleReaction(post.id, 'like')}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span className="text-sm">
                      {post.reactions?.filter((r: any) => r.type === 'like').length || 0}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => handleReaction(post.id, 'heart')}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">
                      {post.reactions?.filter((r: any) => r.type === 'heart').length || 0}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments?.length || 0}</span>
                  </div>
                </div>

                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                    {post.comments.map((comment: any) => (
                      <div key={comment.id} className="text-sm">
                        <p className="font-semibold text-gray-900">
                          {comment.author?.name || 'Usuário'}
                        </p>
                        <p className="text-gray-700">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                    placeholder="Adicionar comentário..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(post.id);
                      }
                    }}
                  />
                  <Button
                    size="small"
                    onClick={() => handleAddComment(post.id)}
                  >
                    <Send className="w-4 h-4" />
                    Enviar
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Post"
      >
        <Form
          fields={postFormFields}
          onSubmit={handleCreate}
          submitLabel="Publicar"
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
            initialValues={{
              content: selectedPost.content,
              isPublic: selectedPost.isPublic ? 'true' : 'false',
            }}
            onSubmit={handleEdit}
            submitLabel="Salvar Alterações"
          />
        )}
      </Modal>
    </div>
  );
};
