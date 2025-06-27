import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { AppTheme } from '@/constants/Theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonLoader({ 
  width = '100%', 
  height = 20, 
  borderRadius = AppTheme.borderRadius.sm,
  style 
}: SkeletonLoaderProps) {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmerValue.value, [0, 0.5, 1], [0.3, 0.7, 0.3]);
    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <View style={styles.postSkeleton}>
      {/* Header */}
      <View style={styles.header}>
        <SkeletonLoader width={44} height={44} borderRadius={AppTheme.borderRadius.full} />
        <View style={styles.userInfo}>
          <SkeletonLoader width="60%" height={16} style={{ marginBottom: 4 }} />
          <SkeletonLoader width="80%" height={12} />
        </View>
        <SkeletonLoader width={40} height={12} />
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        <SkeletonLoader width="90%" height={20} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="100%" height={14} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="100%" height={14} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="70%" height={14} />
      </View>
      
      {/* Actions */}
      <View style={styles.actions}>
        <SkeletonLoader width={80} height={14} />
        <SkeletonLoader width={60} height={14} />
        <SkeletonLoader width={70} height={14} />
      </View>
    </View>
  );
}

export function CommentCardSkeleton() {
  return (
    <View style={styles.commentSkeleton}>
      <View style={styles.commentHeader}>
        <SkeletonLoader width={36} height={36} borderRadius={AppTheme.borderRadius.full} />
        <View style={styles.commentUserInfo}>
          <SkeletonLoader width="50%" height={14} style={{ marginBottom: 4 }} />
          <SkeletonLoader width="70%" height={12} />
        </View>
      </View>
      <View style={styles.commentContent}>
        <SkeletonLoader width="100%" height={12} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="100%" height={12} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="60%" height={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: AppTheme.colors.divider,
  },
  postSkeleton: {
    backgroundColor: AppTheme.colors.surface,
    marginHorizontal: AppTheme.spacing.lg,
    marginVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.divider,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  userInfo: {
    flex: 1,
    marginLeft: AppTheme.spacing.md,
  },
  content: {
    marginBottom: AppTheme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: AppTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.divider,
  },
  commentSkeleton: {
    backgroundColor: AppTheme.colors.surfaceSecondary,
    marginHorizontal: AppTheme.spacing.lg,
    marginVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: AppTheme.colors.primary,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  commentUserInfo: {
    flex: 1,
    marginLeft: AppTheme.spacing.md,
  },
  commentContent: {
    marginTop: AppTheme.spacing.sm,
  },
});
