import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

interface SkeletonLoaderProps {
  width: number;
  height: number;
  borderRadius?: number;
}

const SkeletonItem: React.FC<SkeletonLoaderProps> = ({ width, height, borderRadius = 8 }) => {
  const translateX = useSharedValue(-width);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width * 2, { duration: 1500 }),
      -1,
      false
    );
  }, [width]);

  return (
    <View style={[styles.skeleton, { width, height, borderRadius }]}>
      <Animated.View style={[styles.shimmer, animatedStyle]} />
    </View>
  );
};

const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <SkeletonItem width={268} height={160} borderRadius={12} />
        <View style={styles.content}>
          <View style={styles.header}>
            <SkeletonItem width={24} height={24} borderRadius={12} />
            <SkeletonItem width={150} height={20} borderRadius={4} />
          </View>
          <SkeletonItem width={250} height={14} borderRadius={4} />
          <SkeletonItem width={200} height={14} borderRadius={4} />
          <SkeletonItem width={220} height={14} borderRadius={4} />
          <SkeletonItem width={80} height={16} borderRadius={4} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  cardContainer: {
    width: 300,
    marginVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  card: {
    borderRadius: 18,
  },
  content: {
    paddingHorizontal: 8,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export { ProductCardSkeleton, SkeletonItem };
