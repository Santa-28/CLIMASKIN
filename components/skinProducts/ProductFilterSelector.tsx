import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export type ProductCategory = 'All' | 'Serum' | 'Sunscreen' | 'Moisturizer' | 'Cleanser' | 'Toner' | 'Face Wash' | 'Night Cream';

interface ProductFilterSelectorProps {
  selectedCategory: ProductCategory;
  onCategorySelect: (category: ProductCategory) => void;
}

const categories: { key: ProductCategory; label: string; icon: string }[] = [
  { key: 'All', label: 'All', icon: 'category' },
  { key: 'Serum', label: 'Serum', icon: 'spa' },
  { key: 'Sunscreen', label: 'Sunscreen', icon: 'wb-sunny' },
  { key: 'Moisturizer', label: 'Moisturizer', icon: 'water-drop' },
  { key: 'Cleanser', label: 'Cleanser', icon: 'soap' },
  { key: 'Toner', label: 'Toner', icon: 'opacity' },
  { key: 'Face Wash', label: 'Face Wash', icon: 'face' },
  { key: 'Night Cream', label: 'Night Cream', icon: 'nightlight' },
];

export default function ProductFilterSelector({ selectedCategory, onCategorySelect }: ProductFilterSelectorProps) {
  const renderCategoryButton = (category: typeof categories[0]) => {
    const isSelected = selectedCategory === category.key;

    return (
      <Animated.View
        key={category.key}
        entering={FadeInUp.duration(600).delay(categories.indexOf(category) * 100)}
      >
        <TouchableOpacity
          style={[styles.categoryButton, isSelected && styles.selectedCategoryButton]}
          onPress={() => onCategorySelect(category.key)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isSelected
              ? ['#4FC3F7', '#29B6F6', '#0288D1']
              : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
            }
            style={styles.categoryGradient}
          >
            <MaterialIcons
              name={category.icon as any}
              size={20}
              color={isSelected ? '#FFFFFF' : '#4FC3F7'}
              style={styles.categoryIcon}
            />
            <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
              {category.label}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View entering={FadeInUp.duration(800)} style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="filter-list" size={24} color="#4FC3F7" />
        <Text style={styles.title}>Filter by Category</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map(renderCategoryButton)}
      </ScrollView>

      {selectedCategory !== 'All' && (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.selectedInfo}>
          <Text style={styles.selectedInfoText}>
            Showing {selectedCategory} products
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    marginLeft: 8,
  },
  scrollContent: {
    paddingRight: 16,
  },
  categoryButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedCategoryButton: {
    elevation: 8,
    shadowOpacity: 0.3,
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    justifyContent: 'center',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4FC3F7',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  selectedInfo: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  selectedInfoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
