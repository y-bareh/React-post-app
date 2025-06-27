import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import {
  PostWithUser,
  CommentWithUser,
  fetchPostById,
  fetchUserById,
  fetchCommentsWithUsers,
} from '@/services/api';
import { getAvatarForUser } from '@/utils/avatars';
import CommentCard from '@/components/CommentCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CommentCardSkeleton } from '@/components/SkeletonLoader';
import { useSavedPosts } from '@/contexts/SavedPostsContext';
import { AppTheme } from '@/constants/Theme';

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<PostWithUser | null>(null);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();

  const handleSave = async () => {
    if (!post) return;
    
    const isSaved = isPostSaved(post.id);
    try {
      if (isSaved) {
        await unsavePost(post.id);
      } else {
        await savePost(post);
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    
    try {
      await Share.share({
        message: `Check out this post: "${post.title}" - ${post.body}`,
        title: post.title,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  useEffect(() => {
    if (id) {
      loadPostDetails();
    }
  }, [id]);

  const loadPostDetails = async () => {
    try {
      setLoading(true);
      const postId = parseInt(id!, 10);
      console.log(`📖 Loading post details for ID: ${postId}`);

      // Fetch post and comments in parallel
      const [postData, commentsData] = await Promise.all([
        fetchPostById(postId),
        fetchCommentsWithUsers(postId),
      ]);
      
      if (!postData) {
        console.log(`❌ Post ${postId} not found`);
        Alert.alert('Error', 'Post not found or has been deleted.');
        router.back();
        return;
      }

      console.log(`✅ Post found: ${postData.title}`);

      // Fetch user data for the post
      try {
        const userData = await fetchUserById(postData.user_id);
        setPost({ 
          ...postData, 
          user: userData || {
            id: postData.user_id,
            name: 'Unknown User',
            email: 'unknownuser@example.com',
            gender: 'male',
            status: 'active'
          }
        });
        console.log(`✅ User data loaded: ${userData?.name || 'Unknown User'}`);
      } catch (error) {
        console.log(`⚠️ Failed to fetch user ${postData.user_id}, using fallback`);
        setPost({ 
          ...postData, 
          user: {
            id: postData.user_id,
            name: 'Unknown User',
            email: 'unknownuser@example.com',
            gender: 'male',
            status: 'active'
          }
        });
      }

      setComments(commentsData);
      console.log(`✅ Loaded ${commentsData.length} comments`);
    } catch (error) {
      console.error('❌ Error loading post details:', error);
      Alert.alert('Error', 'Failed to load post details. Please try again.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={AppTheme.colors.primary} barStyle="light-content" />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={AppTheme.colors.primary} barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>😞</Text>
          <Text style={styles.errorTitle}>Post not found</Text>
          <Text style={styles.errorText}>
            This post may have been deleted or moved.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const avatar = getAvatarForUser(post.user?.id || post.user_id);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={AppTheme.colors.primary} barStyle="light-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Post Content */}
        <Animated.View 
          style={styles.postContainer}
          entering={FadeIn.duration(600)}
        >
          <View style={styles.postHeader}>
            <View style={styles.avatarContainer}>
              <Image 
                source={avatar} 
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{post.user?.name || 'Unknown User'}</Text>
              <Text style={styles.userEmail}>{post.user?.email || 'unknownuser@example.com'}</Text>
              <Text style={styles.postTime}>2 hours ago</Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>⋯</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.content}>{post.body}</Text>

          {/* Post Actions */}
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>👍 Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Text style={styles.actionText}>🔗 Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Text style={styles.actionText}>
                {post && isPostSaved(post.id) ? '🔖 Saved' : '💾 Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>
              💬 Comments ({comments.length})
            </Text>
            {comments.length > 0 && (
              <Text style={styles.commentsSubtitle}>
                Join the conversation
              </Text>
            )}
          </View>

          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          ) : (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsIcon}>💭</Text>
              <Text style={styles.noCommentsTitle}>No comments yet</Text>
              <Text style={styles.noCommentsText}>
                Be the first to share your thoughts!
              </Text>
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: AppTheme.colors.surface,
    padding: AppTheme.spacing.lg,
    margin: AppTheme.spacing.lg,
    borderRadius: AppTheme.borderRadius.lg,
    ...AppTheme.shadows.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.divider,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: AppTheme.spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: AppTheme.spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: AppTheme.borderRadius.full,
    borderWidth: 3,
    borderColor: AppTheme.colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: AppTheme.borderRadius.full,
    backgroundColor: AppTheme.colors.success,
    borderWidth: 2,
    borderColor: AppTheme.colors.surface,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: '700',
    color: AppTheme.colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginBottom: 4,
  },
  postTime: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textTertiary,
  },
  moreButton: {
    padding: AppTheme.spacing.xs,
  },
  moreButtonText: {
    fontSize: 20,
    color: AppTheme.colors.textTertiary,
  },
  title: {
    fontSize: AppTheme.typography.fontSize.xxl,
    fontWeight: '700',
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.md,
    lineHeight: AppTheme.typography.lineHeight.tight * AppTheme.typography.fontSize.xxl,
  },
  content: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    lineHeight: AppTheme.typography.lineHeight.relaxed * AppTheme.typography.fontSize.base,
    marginBottom: AppTheme.spacing.lg,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: AppTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.divider,
  },
  actionButton: {
    marginRight: AppTheme.spacing.xl,
    paddingVertical: AppTheme.spacing.xs,
  },
  actionText: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    fontWeight: '500',
  },
  commentsSection: {
    marginTop: AppTheme.spacing.sm,
  },
  commentsHeader: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: AppTheme.colors.divider,
  },
  commentsTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: '600',
    color: AppTheme.colors.textPrimary,
    marginBottom: 4,
  },
  commentsSubtitle: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
  },
  noCommentsContainer: {
    backgroundColor: AppTheme.colors.surface,
    padding: AppTheme.spacing.xxxl,
    marginHorizontal: AppTheme.spacing.lg,
    marginTop: AppTheme.spacing.lg,
    borderRadius: AppTheme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.divider,
  },
  noCommentsIcon: {
    fontSize: 48,
    marginBottom: AppTheme.spacing.md,
  },
  noCommentsTitle: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: '600',
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.sm,
  },
  noCommentsText: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: AppTheme.typography.lineHeight.normal * AppTheme.typography.fontSize.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme.spacing.xxxl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: AppTheme.spacing.lg,
  },
  errorTitle: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: '600',
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.sm,
  },
  errorText: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.xl,
    lineHeight: AppTheme.typography.lineHeight.normal * AppTheme.typography.fontSize.base,
  },
  backButton: {
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: AppTheme.spacing.xl,
    paddingVertical: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.md,
  },
  backButtonText: {
    color: AppTheme.colors.surface,
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: AppTheme.spacing.xxxl,
  },
});
