import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Product } from '../../constants/product';

type ProductCardProps = {
  product: Product;
};

const getGradientColors = (type: string) => {
  const typeLower = type.toLowerCase();
  if (typeLower.includes('moisturizer')) return ['#0288D1', '#4FC3F7']; // Blue for hydration
  if (typeLower.includes('sunscreen')) return ['#FFD700', '#FFA500']; // Orange for sun protection
  if (typeLower.includes('cleanser')) return ['#4CAF50', '#81C784']; // Green for cleansing
  return ['#E3F2FD', '#B3E5FC']; // Default: Light blue
};

const getIconName = (type: string) => {
  const typeLower = type.toLowerCase();
  if (typeLower.includes('moisturizer')) return 'water-drop';
  if (typeLower.includes('sunscreen')) return 'wb-sunny';
  if (typeLower.includes('cleanser')) return 'soap';
  return 'spa'; // Fallback icon
};

export default function ProductCard({ product }: ProductCardProps) {
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(1, { duration: 600 }) }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.duration(800).springify().damping(12).stiffness(90)}
      style={[styles.cardContainer, animatedCardStyle]}
    >
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
        onPress={() => {}} // Optional: Add navigation to product details
      >
        <LinearGradient
          colors={getGradientColors(product.type) as [import('react-native').ColorValue, import('react-native').ColorValue]}
          style={styles.gradient}
        >
          <Animated.Image
            source={{ uri: product.image }}
            style={styles.image}
            entering={FadeInUp.duration(600).delay(200).springify()}
          />
          <View style={styles.overlay} />
          <View style={styles.content}>
            <View style={styles.header}>
              <MaterialIcons
                name={getIconName(product.type)}
                size={24}
                color="#FFFFFF"
                style={styles.icon}
              />
              <Animated.Text
                entering={FadeInUp.duration(400).delay(400).springify()}
                style={styles.name}
              >
                {product.name}
              </Animated.Text>
            </View>
            <Animated.Text
              entering={FadeInUp.duration(400).delay(600).springify()}
              style={styles.desc}
            >
              {product.description}
            </Animated.Text>
            <Animated.Text
              entering={FadeInUp.duration(400).delay(800).springify()}
              style={styles.type}
            >
              Type: {product.type}
            </Animated.Text>
            <Animated.Text
              entering={FadeInUp.duration(400).delay(1000).springify()}
              style={styles.suitable}
            >
              Suitable For: {product.suitableFor.join(', ')}
            </Animated.Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '90%',
    marginVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  card: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  pressedCard: {
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    padding: 16,
    borderRadius: 18,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Subtle overlay for depth
    borderRadius: 18,
  },
  content: {
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  desc: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#F5F5F5',
    marginBottom: 8,
  },
  type: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#F5F5F5',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  suitable: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#F5F5F5',
  },
});