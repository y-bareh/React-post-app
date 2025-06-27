import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PostWithUser } from '@/services/api';
import { getAvatarForUser } from '@/utils/avatars';
import { useSavedPosts } from '@/contexts/SavedPostsContext';
import { AppTheme } from '@/constants/Theme';

interface PostCardProps {
  post: PostWithUser;
  onPress: (postId: number) => void;
}

export default function PostCard({ post, onPress }: PostCardProps) {
  const avatar = getAvatarForUser(post.user?.id || post.user_id);
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
  const scaleValue = useSharedValue(1);
  const saveIconScale = useSharedValue(1);

  const isSaved = isPostSaved(post.id);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const saveIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: saveIconScale.value }],
    };
  });

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, { damping: 15 });
  };

  const handleSavePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    saveIconScale.value = withSpring(0.8, { damping: 10 }, () => {
      saveIconScale.value = withSpring(1, { damping: 10 });
    });

    if (isSaved) {
      await unsavePost(post.id);
    } else {
      await savePost(post);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      style={animatedStyle}
    >
      <TouchableOpacity 
        style={styles.container} 
        onPress={() => onPress(post.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
      {/* Header with user info */}
      <View style={styles.header}>
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
        </View>
        <View style={styles.postMeta}>
          <Text style={styles.postTime}>2h ago</Text>
          <Animated.View style={saveIconAnimatedStyle}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSavePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.saveIcon, isSaved && styles.savedIcon]}>
                {isSaved ? '🔖' : '📌'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      
      {/* Post content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.body} numberOfLines={3}>
          {post.body}
        </Text>
      </View>

      {/* Post actions */}
      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Text style={styles.actionText}>💬 Comments</Text>
        </View>
        <View style={styles.actionButton}>
          <Text style={styles.actionText}>🔗 Share</Text>
        </View>
        <View style={styles.readMore}>
          <Text style={styles.readMoreText}>Read more →</Text>
        </View>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppTheme.colors.surface,
    marginHorizontal: AppTheme.spacing.lg,
    marginVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    ...AppTheme.shadows.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.divider,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: AppTheme.spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: AppTheme.borderRadius.full,
    borderWidth: 2,
    borderColor: AppTheme.colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: AppTheme.borderRadius.full,
    backgroundColor: AppTheme.colors.success,
    borderWidth: 2,
    borderColor: AppTheme.colors.surface,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: '600',
    color: AppTheme.colors.textPrimary,
    lineHeight: AppTheme.typography.lineHeight.tight * AppTheme.typography.fontSize.base,
  },
  userEmail: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  postMeta: {
    alignItems: 'flex-end',
  },
  postTime: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textTertiary,
    marginBottom: AppTheme.spacing.xs,
  },
  saveButton: {
    padding: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.sm,
  },
  saveIcon: {
    fontSize: 20,
    color: AppTheme.colors.textTertiary,
  },
  savedIcon: {
    color: AppTheme.colors.primary,
  },
  content: {
    marginBottom: AppTheme.spacing.md,
  },
  title: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: '700',
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.sm,
    lineHeight: AppTheme.typography.lineHeight.tight * AppTheme.typography.fontSize.lg,
  },
  body: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    lineHeight: AppTheme.typography.lineHeight.normal * AppTheme.typography.fontSize.base,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: AppTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.divider,
  },
  actionButton: {
    marginRight: AppTheme.spacing.lg,
  },
  actionText: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    fontWeight: '500',
  },
  readMore: {
    marginLeft: 'auto',
  },
  readMoreText: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.primary,
    fontWeight: '600',
  },
});
