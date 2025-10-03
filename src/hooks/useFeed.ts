import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { PostResponseDto, CreatePostDto } from '../types';

export const useFeed = () => {
  const [posts, setPosts] = useState<PostResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getPosts();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar posts');
      console.error('Erro ao buscar posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (data: CreatePostDto) => {
    try {
      const newPost = await apiService.createPost(data);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar post';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updatePost = async (id: string, data: Partial<CreatePostDto>) => {
    try {
      const updatedPost = await apiService.updatePost(id, data);
      setPosts(prev =>
        prev.map(post => (post.id === id ? updatedPost : post))
      );
      return updatedPost;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar post';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deletePost = async (id: string) => {
    try {
      await apiService.deletePost(id);
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar post';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addComment = async (postId: string, content: string) => {
    try {
      const comment = await apiService.addComment(postId, content);
      await fetchPosts(); // Refresh to get updated comments
      return comment;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao adicionar comentário';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addReaction = async (postId: string, type: string) => {
    try {
      const reaction = await apiService.addReaction(postId, type);
      await fetchPosts(); // Refresh to get updated reactions
      return reaction;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao adicionar reação';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    isLoading,
    error,
    refetch: fetchPosts,
    createPost,
    updatePost,
    deletePost,
    addComment,
    addReaction,
  };
};
