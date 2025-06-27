import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppTheme } from '@/constants/Theme';

type TabType = 'home' | 'saved';

interface SimpleHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function SimpleHeader({ activeTab, onTabChange }: SimpleHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'home' && styles.activeTab]}
        onPress={() => onTabChange('home')}
      >
        <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
          Home
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
        onPress={() => onTabChange('saved')}
      >
        <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
          Saved
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.surface,
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: AppTheme.colors.divider,
    ...AppTheme.shadows.md,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: AppTheme.spacing.md,
    paddingHorizontal: AppTheme.spacing.lg,
    alignItems: 'center',
    borderRadius: AppTheme.borderRadius.lg,
    marginHorizontal: AppTheme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primaryDark,
    ...AppTheme.shadows.sm,
  },
  tabText: {
    fontSize: AppTheme.typography.fontSize.lg,
    fontWeight: '700',
    color: AppTheme.colors.textPrimary,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
