import React, { useState, useEffect } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  RefreshControl, 
  Text, 
  View,
  Alert,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { PostWithUser, fetchValidPostsWithUsers } from '@/services/api';
import PostCard from '@/components/PostCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import FloatingActionButton from '@/components/FloatingActionButton';
import SimpleHeader from '@/components/SimpleHeader';
import { PostCardSkeleton } from '@/components/SkeletonLoader';
import { useSavedPosts } from '@/contexts/SavedPostsContext';
import { AppTheme } from '@/constants/Theme';

export default function HomeScreen() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'saved'>('home');
  
  const { savedPosts } = useSavedPosts();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (!isRefresh && pageNum === 1) {
        setLoading(true);
      } else if (!isRefresh) {
        setLoadingMore(true);
      }

      const newPosts = await fetchValidPostsWithUsers(pageNum);
      
      if (isRefresh || pageNum === 1) {
        setPosts(newPosts);
        setPage(2);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setPage(pageNum + 1);
      }

      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadPosts(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadPosts(page);
    }
  };

  const handleTabChange = (tab: 'home' | 'saved') => {
    setActiveTab(tab);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getCurrentPosts = () => {
    return activeTab === 'home' ? posts : savedPosts;
  };

  const handleNewPost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('New Post', 'Create new post feature coming soon!');
  };

  const handlePostPress = (postId: number) => {
    router.push({
      pathname: '/post-details' as any,
      params: { id: postId.toString() }
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
        {activeTab === 'home' ? 'Latest Posts' : 'Saved Posts'}
      </Text>
      <Text style={styles.headerSubtitle}>
        {activeTab === 'home' 
          ? 'Discover amazing content from our community'
          : `You have ${savedPosts.length} saved posts`
        }
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return <View style={styles.footerSpacing} />;
    return (
      <View style={styles.footer}>
        <LoadingSpinner size="small" />
        <Text style={styles.loadingText}>Loading more posts...</Text>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>
        {activeTab === 'home' ? '📝' : '🔖'}
      </Text>
      <Text style={styles.emptyTitle}>
        {activeTab === 'home' ? 'No posts yet' : 'No saved posts'}
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === 'home' 
          ? 'Be the first to share something amazing!'
          : 'Start saving posts by tapping the bookmark icon!'
        }
      </Text>
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  if (loading && activeTab === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={AppTheme.colors.primary} barStyle="light-content" />
        <SimpleHeader activeTab={activeTab} onTabChange={handleTabChange} />
        {renderHeader()}
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  const currentPosts = getCurrentPosts();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={AppTheme.colors.primary} barStyle="light-content" />
      <SimpleHeader activeTab={activeTab} onTabChange={handleTabChange} />
      <FlatList
        data={currentPosts}
        keyExtractor={(item) => `${activeTab}-${item.id}`}
        renderItem={({ item }) => (
          <PostCard post={item} onPress={handlePostPress} />
        )}
        refreshControl={
          activeTab === 'home' ? (
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              colors={[AppTheme.colors.primary]}
              tintColor={AppTheme.colors.primary}
            />
          ) : undefined
        }
        onEndReached={activeTab === 'home' ? handleLoadMore : undefined}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={activeTab === 'home' ? renderFooter : undefined}
        ListEmptyComponent={renderEmptyComponent}
        ItemSeparatorComponent={renderSeparator}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={currentPosts.length === 0 ? styles.emptyListContainer : undefined}
      />
      {activeTab === 'home' && <FloatingActionButton onPress={handleNewPost} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingTop: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.divider,
  },
  headerTitle: {
    fontSize: AppTheme.typography.fontSize.xxl,
    fontWeight: '700',
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    lineHeight: AppTheme.typography.lineHeight.normal * AppTheme.typography.fontSize.base,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: AppTheme.spacing.xs,
  },
  footer: {
    padding: AppTheme.spacing.lg,
    alignItems: 'center',
  },
  footerSpacing: {
    height: AppTheme.spacing.xl,
  },
  loadingText: {
    fontSize: AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textSecondary,
    marginTop: AppTheme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme.spacing.xxxl,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: AppTheme.spacing.lg,
  },
  emptyTitle: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: '600',
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.sm,
  },
  emptyText: {
    fontSize: AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: AppTheme.typography.lineHeight.normal * AppTheme.typography.fontSize.base,
  },
  skeletonContainer: {
    flex: 1,
    paddingTop: AppTheme.spacing.sm,
  },
});
