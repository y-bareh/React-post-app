import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostWithUser } from '@/services/api';

interface SavedPostsContextType {
  savedPosts: PostWithUser[];
  savePost: (post: PostWithUser) => Promise<void>;
  unsavePost: (postId: number) => Promise<void>;
  isPostSaved: (postId: number) => boolean;
}

const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

const SAVED_POSTS_KEY = '@saved_posts';

export function SavedPostsProvider({ children }: { children: React.ReactNode }) {
  const [savedPosts, setSavedPosts] = useState<PostWithUser[]>([]);

  // Load saved posts from AsyncStorage on app start
  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      const savedPostsJson = await AsyncStorage.getItem(SAVED_POSTS_KEY);
      if (savedPostsJson) {
        const posts = JSON.parse(savedPostsJson);
        setSavedPosts(posts);
      }
    } catch (error) {
      console.error('Error loading saved posts:', error);
    }
  };

  const savePost = async (post: PostWithUser) => {
    try {
      const isAlreadySaved = savedPosts.some(savedPost => savedPost.id === post.id);
      if (!isAlreadySaved) {
        const updatedSavedPosts = [...savedPosts, post];
        setSavedPosts(updatedSavedPosts);
        await AsyncStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(updatedSavedPosts));
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const unsavePost = async (postId: number) => {
    try {
      const updatedSavedPosts = savedPosts.filter(post => post.id !== postId);
      setSavedPosts(updatedSavedPosts);
      await AsyncStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(updatedSavedPosts));
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  const isPostSaved = (postId: number): boolean => {
    return savedPosts.some(post => post.id === postId);
  };

  return (
    <SavedPostsContext.Provider
      value={{
        savedPosts,
        savePost,
        unsavePost,
        isPostSaved,
      }}
    >
      {children}
    </SavedPostsContext.Provider>
  );
}

export function useSavedPosts() {
  const context = useContext(SavedPostsContext);
  if (context === undefined) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
}
