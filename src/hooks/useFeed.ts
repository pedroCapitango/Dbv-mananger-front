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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (data: CreatePostDto) => {
    try {
      const newPost = await apiService.createPost(data);
      setPosts([newPost, ...posts]);
      return newPost;
    } catch (err) {
      throw err;
    }
  };

  const updatePost = async (id: string, data: Partial<CreatePostDto>) => {
    try {
      const updatedPost = await apiService.updatePost(id, data);
      setPosts(posts.map(p => p.id === id ? updatedPost : p));
      return updatedPost;
    } catch (err) {
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      await apiService.deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const addComment = async (postId: string, content: string) => {
    try {
      const result = await apiService.addComment(postId, content);
      await fetchPosts(); // Refresh to get updated comments
      return result;
    } catch (err) {
      throw err;
    }
  };

  const addReaction = async (postId: string, type: string) => {
    try {
      const result = await apiService.addReaction(postId, type);
      await fetchPosts(); // Refresh to get updated reactions
      return result;
    } catch (err) {
      throw err;
    }
  };

  const getEventPosts = async (eventId: string) => {
    try {
      return await apiService.getEventPosts(eventId);
    } catch (err) {
      throw err;
    }
  };

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
    getEventPosts,
  };
};
