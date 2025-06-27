import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CommentWithUser } from '@/services/api';
import { getRandomAvatar } from '@/utils/avatars';
import { AppTheme } from '@/constants/Theme';

interface CommentCardProps {
  comment: CommentWithUser;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const avatar = getRandomAvatar();

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInUp.duration(300).springify()}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image 
            source={avatar} 
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{comment.name}</Text>
            <Text style={styles.commentTime}>1h ago</Text>
          </View>
          <Text style={styles.userEmail}>{comment.email}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.commentText}>
          {comment.body}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButtonTouchable}>
          <Text style={styles.actionButton}>👍 Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonTouchable}>
          <Text style={styles.actionButton}>💬 Reply</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppTheme.colors.surfaceSecondary,
    marginHorizontal: AppTheme.spacing.lg,
    marginVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: AppTheme.colors.primary,
    ...AppTheme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: AppTheme.spacing.sm,
  },
  avatarContainer: {
    marginRight: AppTheme.spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: AppTheme.borderRadius.full,
    borderWidth: 2,
    borderColor: AppTheme.colors.surface,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: '600',
    color: AppTheme.colors.textPrimary,
    flex: 1,
  },
  commentTime: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textTertiary,
    marginLeft: AppTheme.spacing.sm,
  },
  userEmail: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textSecondary,
    marginTop: 2,
  },
  content: {
    marginBottom: AppTheme.spacing.sm,
  },
  commentText: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    lineHeight: AppTheme.typography.lineHeight.normal * AppTheme.typography.fontSize.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: AppTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.divider,
  },
  actionButton: {
    fontSize: AppTheme.typography.fontSize.xs,
    color: AppTheme.colors.textTertiary,
    fontWeight: '500',
  },
  actionButtonTouchable: {
    marginRight: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.xs,
    paddingHorizontal: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.sm,
  },
});
