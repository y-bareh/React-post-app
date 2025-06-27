// Enhanced color palette and theme with dark mode support
export const LightTheme = {
  colors: {
    // Primary colors
    primary: '#3B82F6', // Modern blue
    primaryLight: '#60A5FA',
    primaryDark: '#1D4ED8',
    
    // Secondary colors
    secondary: '#10B981', // Emerald green
    accent: '#F59E0B', // Amber
    
    // Neutral colors
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    
    // Text colors
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Interactive colors
    link: '#3B82F6',
    divider: '#E2E8F0',
    border: '#CBD5E1',
    
    // Shadow colors
    shadowLight: 'rgba(0, 0, 0, 0.05)',
    shadowMedium: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.15)',
  },
  
  typography: {
    // Font families
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
  },
  
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export const DarkTheme = {
  colors: {
    // Primary colors
    primary: '#60A5FA', // Lighter blue for dark mode
    primaryLight: '#93C5FD',
    primaryDark: '#3B82F6',
    
    // Secondary colors
    secondary: '#34D399', // Lighter emerald for dark mode
    accent: '#FBBF24', // Lighter amber
    
    // Neutral colors
    background: '#0F172A',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    
    // Text colors
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#64748B',
    
    // Status colors
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    
    // Interactive colors
    link: '#60A5FA',
    divider: '#334155',
    border: '#475569',
    
    // Shadow colors
    shadowLight: 'rgba(0, 0, 0, 0.2)',
    shadowMedium: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.4)',
  },
  
  typography: LightTheme.typography,
  spacing: LightTheme.spacing,
  borderRadius: LightTheme.borderRadius,
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

// Export default theme (can be light or dark based on system preference)
export const AppTheme = LightTheme;

// Typography enhancements
export const Typography = {
  h1: {
    fontSize: AppTheme.typography.fontSize.xxxl,
    fontWeight: '800' as const,
    lineHeight: AppTheme.typography.lineHeight.tight * AppTheme.typography.fontSize.xxxl,
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.lg,
  },
  h2: {
    fontSize: AppTheme.typography.fontSize.xxl,
    fontWeight: '700' as const,
    lineHeight: AppTheme.typography.lineHeight.tight * AppTheme.typography.fontSize.xxl,
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.md,
  },
  h3: {
    fontSize: AppTheme.typography.fontSize.xl,
    fontWeight: '600' as const,
    lineHeight: AppTheme.typography.lineHeight.tight * AppTheme.typography.fontSize.xl,
    color: AppTheme.colors.textPrimary,
    marginBottom: AppTheme.spacing.sm,
  },
  body: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: '400' as const,
    lineHeight: AppTheme.typography.lineHeight.normal * AppTheme.typography.fontSize.base,
    color: AppTheme.colors.textSecondary,
  },
  caption: {
    fontSize: AppTheme.typography.fontSize.sm,
    fontWeight: '400' as const,
    lineHeight: AppTheme.typography.lineHeight.normal * AppTheme.typography.fontSize.sm,
    color: AppTheme.colors.textTertiary,
  },
  button: {
    fontSize: AppTheme.typography.fontSize.base,
    fontWeight: '600' as const,
    lineHeight: AppTheme.typography.lineHeight.tight * AppTheme.typography.fontSize.base,
  },
};

// Animation constants
export const AnimationDurations = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Layout constants  
export const Layout = {
  headerHeight: 60,
  tabBarHeight: 80,
  borderWidth: {
    thin: 1,
    medium: 2,
    thick: 3,
  },
};
