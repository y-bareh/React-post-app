import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { AppTheme } from '@/constants/Theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  size?: number;
  style?: any;
}

export default function FloatingActionButton({ 
  onPress, 
  icon = '✏️', 
  size = 56,
  style 
}: FloatingActionButtonProps) {
  const scaleValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scaleValue.value },
        { 
          rotate: `${interpolate(
            rotateValue.value,
            [0, 1],
            [0, 360]
          )}deg` 
        },
      ],
    };
  });

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1);
  };

  const handlePress = () => {
    rotateValue.value = withSpring(rotateValue.value + 1);
    onPress();
  };

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle, style]}>
      <TouchableOpacity
        style={[styles.button, { borderRadius: size / 2 }]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Text style={styles.icon}>{icon}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: AppTheme.spacing.xl,
    right: AppTheme.spacing.lg,
    zIndex: 1000,
  },
  button: {
    flex: 1,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...AppTheme.shadows.lg,
  },
  icon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});
