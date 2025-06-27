import axios from 'axios';

const BASE_URL = 'https://gorest.co.in/public/v2';

export interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
}

export interface PostWithUser extends Post {
  user: User | null;
}

export interface CommentWithUser extends Comment {
  user?: User;
}

// API functions
export const fetchPosts = async (page: number = 1): Promise<Post[]> => {
  try {
    console.log(`Fetching posts from: ${BASE_URL}/posts?page=${page}&per_page=10`);
    const response = await axios.get(`${BASE_URL}/posts?page=${page}&per_page=10`);
    const posts = response.data || [];
    console.log(`Raw API response: ${posts.length} posts`);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchPostById = async (postId: number): Promise<Post | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${postId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`Post ${postId} not found (404)`);
      return null;
    }
    console.error('Error fetching post:', error);
    throw error;
  }
};

export const fetchUserById = async (userId: number): Promise<User | null> => {
  try {
    console.log(`🔍 Fetching user ${userId} from: ${BASE_URL}/users/${userId}`);
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    
    if (response.data) {
      console.log(`✅ User ${userId} found: ${response.data.name}`);
      return response.data;
    } else {
      console.log(`⚠️ User ${userId} returned empty data`);
      return null;
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log(`🚫 User ${userId} not found (404)`);
      return null;
    } else if (error.response?.status === 429) {
      console.log(`⏳ Rate limited for user ${userId}, waiting...`);
      // Wait a bit and retry once for rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const retryResponse = await axios.get(`${BASE_URL}/users/${userId}`);
        return retryResponse.data || null;
      } catch (retryError) {
        console.log(`❌ Retry failed for user ${userId}`);
        return null;
      }
    } else {
      console.log(`❌ Error fetching user ${userId}:`, error.response?.status, error.message);
      return null;
    }
  }
};

export const fetchCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`);
    return response.data || [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`Comments for post ${postId} not found (404)`);
      return [];
    }
    console.error('Error fetching comments:', error);
    return []; // Return empty array instead of throwing error
  }
};

export const fetchPostsWithUsers = async (page: number = 1): Promise<PostWithUser[]> => {
  try {
    const posts = await fetchPosts(page);
    const postsWithUsers = await Promise.all(
      posts.map(async (post) => {
        try {
          const user = await fetchUserById(post.user_id);
          return { 
            ...post, 
            user: user || {
              id: post.user_id,
              name: 'Unknown User',
              email: 'unknownuser@example.com',
              gender: 'male',
              status: 'active'
            }
          };
        } catch (error) {
          console.error(`Error fetching user ${post.user_id}:`, error);
          // Return post with a default user if user fetch fails
          return {
            ...post,
            user: {
              id: post.user_id,
              name: 'Unknown User',
              email: 'unknownuser@example.com',
              gender: 'male',
              status: 'active'
            }
          };
        }
      })
    );
    return postsWithUsers;
  } catch (error) {
    console.error('Error fetching posts with users:', error);
    throw error;
  }
};

export const fetchCommentsWithUsers = async (postId: number): Promise<CommentWithUser[]> => {
  try {
    console.log(`📝 Fetching comments for post ${postId}`);
    
    // Use the robust comment fetching that tries multiple endpoints
    const comments = await fetchCommentsRobust(postId);
    
    if (comments.length === 0) {
      console.log(`📝 No comments found for post ${postId}`);
      return [];
    }
    
    console.log(`📝 Processing ${comments.length} comments for post ${postId}`);
    
    return comments.map(comment => ({
      ...comment,
      user: {
        id: 0,
        name: comment.name || 'Anonymous',
        email: comment.email || 'anonymous@example.com',
        gender: 'male',
        status: 'active'
      }
    }));
  } catch (error) {
    console.error(`❌ Error fetching comments for post ${postId}:`, error);
    return []; // Return empty array instead of throwing
  }
};

export const fetchValidPostsWithUsers = async (page: number = 1): Promise<PostWithUser[]> => {
  try {
    const posts = await fetchPosts(page);
    
    if (!posts || posts.length === 0) {
      console.log('No posts returned from API');
      return [];
    }
    
    console.log(`Fetched ${posts.length} posts for page ${page}`);
    
    // Get unique user IDs to minimize API calls
    const userIds = [...new Set(posts.map(post => post.user_id))];
    console.log(`Need to fetch ${userIds.length} unique users:`, userIds);
    
    // Fetch users in parallel with individual error handling and small delays
    const userPromises = userIds.map(async (userId, index) => {
      // Add small delay to avoid overwhelming the API
      if (index > 0) {
        await new Promise(resolve => setTimeout(resolve, 100 * index));
      }
      
      try {
        const user = await fetchUserById(userId);
        if (user) {
          console.log(`✅ Fetched user ${userId}: ${user.name}`);
          return { userId, user };
        } else {
          console.log(`❌ User ${userId} not found (null response)`);
          return { userId, user: null };
        }
      } catch (error: any) {
        console.log(`❌ Failed to fetch user ${userId}:`, error.response?.status || error.message);
        return { userId, user: null };
      }
    });
    
    // Wait for all user fetches to complete
    const userResults = await Promise.all(userPromises);
    
    // Create user map for quick lookup
    const userMap = new Map<number, User>();
    let successfulUserFetches = 0;
    
    userResults.forEach(({ userId, user }) => {
      if (user) {
        userMap.set(userId, user);
        successfulUserFetches++;
      }
    });
    
    console.log(`✅ Successfully fetched ${successfulUserFetches} out of ${userIds.length} users`);
    
    // Create posts with user data (always include the post, even if user fetch failed)
    const postsWithUsers = posts.map(post => {
      const user = userMap.get(post.user_id);
      
      if (user) {
        // Real user found
        return {
          ...post,
          user
        };
      } else {
        // User not found - use fallback with clear indication
        return {
          ...post,
          user: {
            id: post.user_id,
            name: 'Unknown User',
            email: 'unknownuser@example.com',
            gender: 'male',
            status: 'active'
          }
        };
      }
    });
    
    console.log(`✅ Returning ${postsWithUsers.length} posts with user data`);
    console.log(`📊 Real users: ${successfulUserFetches}, Fallback users: ${userIds.length - successfulUserFetches}`);
    
    return postsWithUsers;
    
  } catch (error) {
    console.error('❌ Error in fetchValidPostsWithUsers:', error);
    // Don't throw - return empty array to prevent "No posts available"
    return [];
  }
};

export const safelyFetchPostDetails = async (postId: number): Promise<PostWithUser | null> => {
  try {
    const post = await fetchPostById(postId);
    if (!post) {
      return null;
    }
    
    const user = await fetchUserById(post.user_id);
    return {
      ...post,
      user: user || {
        id: post.user_id,
        name: 'Unknown User',
        email: 'unknownuser@example.com',
        gender: 'male',
        status: 'active'
      }
    };
  } catch (error) {
    console.error(`Error safely fetching post ${postId}:`, error);
    return null;
  }
};

// Retry mechanism for failed requests
const retryRequest = async <T>(
  requestFn: () => Promise<T>, 
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T | null> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Don't retry 404 errors
        return null;
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.warn(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  return null;
};

export const fetchPostsWithRetry = async (page: number = 1): Promise<Post[]> => {
  const result = await retryRequest(() => fetchPosts(page));
  return result || [];
};

export const fetchPostByIdWithRetry = async (postId: number): Promise<Post | null> => {
  return await retryRequest(() => fetchPostById(postId));
};

// Alternative approach: Only fetch posts from existing users
export const fetchPostsFromExistingUsers = async (page: number = 1): Promise<PostWithUser[]> => {
  try {
    // First, get available users
    const usersResponse = await axios.get(`${BASE_URL}/users?page=1&per_page=100`);
    const availableUsers: User[] = usersResponse.data || [];
    
    if (availableUsers.length === 0) {
      console.warn('No users available');
      return [];
    }
    
    // Create a set of available user IDs for quick lookup
    const availableUserIds = new Set(availableUsers.map(user => user.id));
    
    // Get posts
    const posts = await fetchPosts(page);
    
    // Filter posts to only include those with existing users
    const validPosts = posts.filter(post => availableUserIds.has(post.user_id));
    
    // Map users to posts
    const userMap = new Map(availableUsers.map(user => [user.id, user]));
    
    return validPosts.map(post => ({
      ...post,
      user: userMap.get(post.user_id)!
    }));
    
  } catch (error) {
    console.error('Error fetching posts from existing users:', error);
    throw error;
  }
};

// Simple fallback: just get posts without trying to fetch users
export const fetchPostsSimple = async (page: number = 1): Promise<PostWithUser[]> => {
  try {
    const posts = await fetchPosts(page);
    
    return posts.map(post => ({
      ...post,
      user: {
        id: post.user_id,
        name: 'Unknown User',
        email: 'unknownuser@example.com',
        gender: 'male',
        status: 'active'
      }
    }));
  } catch (error) {
    console.error('Error fetching posts simple:', error);
    throw error;
  }
};

// Alternative: Fetch comments from the main comments endpoint
export const fetchCommentsFromMainEndpoint = async (page: number = 1, postId?: number): Promise<Comment[]> => {
  try {
    let url = `${BASE_URL}/comments?page=${page}&per_page=20`;
    if (postId) {
      url += `&post_id=${postId}`;
    }
    
    console.log(`🔍 Fetching comments from: ${url}`);
    const response = await axios.get(url);
    const comments = response.data || [];
    
    console.log(`✅ Fetched ${comments.length} comments from main endpoint`);
    return comments;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`Comments not found (404)`);
      return [];
    }
    console.error('Error fetching comments from main endpoint:', error);
    return [];
  }
};

// Enhanced comments fetching that tries both endpoints
export const fetchCommentsRobust = async (postId: number): Promise<Comment[]> => {
  try {
    console.log(`🔍 Fetching comments for post ${postId} using multiple methods`);
    
    // Try the post-specific endpoint first (current method)
    try {
      const commentsFromPost = await fetchCommentsByPostId(postId);
      if (commentsFromPost.length > 0) {
        console.log(`✅ Got ${commentsFromPost.length} comments from post endpoint`);
        return commentsFromPost;
      }
    } catch (error) {
      console.log(`⚠️ Post endpoint failed, trying main comments endpoint`);
    }
    
    // Fallback to main comments endpoint with filtering
    const commentsFromMain = await fetchCommentsFromMainEndpoint(1, postId);
    console.log(`✅ Got ${commentsFromMain.length} comments from main endpoint`);
    return commentsFromMain;
    
  } catch (error) {
    console.error(`❌ All comment fetching methods failed for post ${postId}:`, error);
    return [];
  }
};

// Function to fetch all comments (for exploring all comments in the system)
export const fetchAllComments = async (page: number = 1): Promise<Comment[]> => {
  try {
    console.log(`📝 Fetching all comments from page ${page}`);
    const comments = await fetchCommentsFromMainEndpoint(page);
    console.log(`📝 Fetched ${comments.length} comments from page ${page}`);
    return comments;
  } catch (error) {
    console.error(`❌ Error fetching all comments from page ${page}:`, error);
    return [];
  }
};

// Function to get comment statistics from the main endpoint
export const getCommentStats = async (): Promise<{totalComments: number, sampleComments: Comment[]}> => {
  try {
    const sampleComments = await fetchCommentsFromMainEndpoint(1);
    return {
      totalComments: sampleComments.length,
      sampleComments: sampleComments.slice(0, 5) // First 5 as sample
    };
  } catch (error) {
    console.error('Error getting comment stats:', error);
    return { totalComments: 0, sampleComments: [] };
  }
};
