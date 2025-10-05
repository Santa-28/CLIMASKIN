import React, { useEffect, useState, useMemo } from "react";
import { View, ScrollView, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  FadeInUp,
} from "react-native-reanimated";

import WeatherCard from "@/components/weather/WeatherCard";
import ProductCard from "@/components/skinProducts/ProductCard";
import ProductFilterSelector, { ProductCategory } from "@/components/skinProducts/ProductFilterSelector";
import ProductReminder from "@/components/notifications/ProductReminder";
import { ProductCardSkeleton } from "@/components/ui/SkeletonLoader";
import { useUser } from "../context/UserContext";
import { Product, products } from "../../constants/product";
import { RecommendationEngine } from "../../services/recommendationEngine";
import { UserProfile } from "../../types/faceDetection.types";
import { Alert } from 'react-native';

export default function Home() {
  const {
    userName,
    age,
    gender,
    skinType,
    waterIntake,
    skinConcerns,
    routinePreferences
  } = useUser();

  // We will hide age and gender display as per user request, but they are fetched and available in context

  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<Product[]>([]);
  const [isLoadingPersonalized, setIsLoadingPersonalized] = useState(true);
  const [dailyTip, setDailyTip] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const filteredExploreProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter(product => product.type === selectedCategory);
  }, [selectedCategory]);

  const filteredPersonalized = useMemo(() => {
    if (selectedCategory === 'All') {
      return personalizedRecommendations;
    }
    return personalizedRecommendations.filter(product => product.type === selectedCategory);
  }, [personalizedRecommendations, selectedCategory]);

  const featuredProduct = useMemo(() => {
    if (selectedCategory === 'All') {
      return products[0];
    }
    return filteredExploreProducts[0] || products[0];
  }, [selectedCategory, filteredExploreProducts]);

  // Animations
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const nameOpacity = useSharedValue(0);
  const nameTranslateY = useSharedValue(10);

  const animatedNameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ translateY: nameTranslateY.value }],
  }));

  useEffect(() => {
    // Animate header on mount
    headerOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
    headerTranslateY.value = withSpring(0, { damping: 10, stiffness: 100 });

    // Animate userName when available
    if (userName) {
      nameOpacity.value = withTiming(1, { duration: 600 });
      nameTranslateY.value = withSpring(0, { damping: 10, stiffness: 100 });
    }
  }, [userName, headerOpacity, headerTranslateY, nameOpacity, nameTranslateY]);

  useEffect(() => {
    // Generate personalized recommendations
    if (age && gender && skinType) {
      setIsLoadingPersonalized(true);
      const userProfile: UserProfile = {
        age,
        gender: gender as 'male' | 'female' | 'unknown',
        skinType,
      };
      const recommendations = RecommendationEngine.getRecommendations(userProfile);
      const recommendedProducts = products.filter(product =>
        recommendations.some(rec => rec.name === product.name)
      );
      // Simulate loading time
      setTimeout(() => {
        setPersonalizedRecommendations(recommendedProducts);
        setIsLoadingPersonalized(false);
      }, 2000);
    }

    // Generate daily tip based on user data
    const tips = [
      `Stay hydrated! Aim for ${waterIntake} cups of water today.`,
      `Your ${skinType} skin needs consistent care. Keep up the good work!`,
      `Don't forget to apply sunscreen daily, especially with your ${skinConcerns.join(', ')} concerns.`,
      `Your preferred routine: ${routinePreferences}. Stick to it for best results!`,
      `Great job tracking your skin care! Consistency is key.`,
    ];
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
  }, [age, gender, skinType, waterIntake, skinConcerns, routinePreferences]);

  const renderProductCard = ({ item }: { item: Product }) => (
    <Animated.View
      entering={FadeInUp.duration(800).delay(200).springify().damping(12).stiffness(90)}
      style={styles.productCard}
    >
      <ProductCard product={item} selectedCategory={selectedCategory} />
    </Animated.View>
  );

  const renderSkeletonCard = () => (
    <View style={styles.productCard}>
      <ProductCardSkeleton />
    </View>
  );

  const renderConcernChip = ({ item }: { item: string }) => (
    <View style={styles.concernChip}>
      <Text style={styles.concernText}>{item}</Text>
    </View>
  );

  return (
    <LinearGradient colors={["#4FC3F7", "#81D4FA", "#E3F2FD"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <Animated.View style={[styles.header, animatedHeaderStyle]}>
          <MaterialIcons name="wb-sunny" size={42} color="#FFB300" style={styles.headerIcon} />

          <View style={styles.greetingContainer}>
            {/* <Text style={styles.title}>Climaskin</Text> */}
            {userName ? (
              <Animated.Text style={[styles.title, animatedNameStyle]}>
                Welcome {userName} 🌤️
              </Animated.Text>
            ) : (
              <Text style={styles.title}>Welcome</Text>
            )}
          </View>

          <Text style={styles.subtitle}>Your personalized skin care starts here</Text>
        </Animated.View>

        {/* USER DETAILS SUMMARY */}
        <Animated.View
          entering={FadeInUp.duration(1000).springify().damping(10).stiffness(80)}
          style={styles.userDetailsContainer}
        >
          <Text style={styles.sectionTitle}>Your Profile</Text>
          <View style={styles.detailsGrid}>
            {/* Age and Gender are hidden as per user request */}
            <View style={styles.detailItem}>
              <Ionicons name="person" size={24} color="#000000" />
              <Text style={[styles.detailLabel, { color: '#333333' }]}>Age</Text>
              <Text style={[styles.detailValue, { color: '#000000' }]}>{age || 'Not set'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="man" size={24} color="#000000" />
              <Text style={[styles.detailLabel, { color: '#333333' }]}>Gender</Text>
              <Text style={[styles.detailValue, { color: '#000000' }]}>{gender || 'Not set'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="water" size={24} color="#000000" />
              <Text style={[styles.detailLabel, { color: '#333333' }]}>Water Intake</Text>
              <Text style={[styles.detailValue, { color: '#000000' }]}>{waterIntake} cups</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="face" size={24} color="#000000" />
              <Text style={[styles.detailLabel, { color: '#333333' }]}>Skin Type</Text>
              <Text style={[styles.detailValue, { color: '#000000' }]}>{skinType}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="fitness" size={24} color="#000000" />
              <Text style={[styles.detailLabel, { color: '#333333' }]}>Routine</Text>
              <Text style={[styles.detailValue, { color: '#000000' }]}>{routinePreferences}</Text>
            </View>
          </View>

          {skinConcerns.length > 0 && (
            <View style={styles.concernsContainer}>
              <Text style={styles.concernsTitle}>Skin Concerns:</Text>
              <FlatList
                data={skinConcerns}
                renderItem={renderConcernChip}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.concernsList}
              />
            </View>
          )}
        </Animated.View>

        {/* DAILY TIP */}
        <Animated.View
          entering={FadeInUp.duration(1000).delay(200).springify().damping(10).stiffness(80)}
          style={styles.dailyTipContainer}
        >
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={24} color="#FFD700" />
            <Text style={styles.tipTitle}>Daily Tip</Text>
          </View>
          <Text style={styles.tipText}>{dailyTip}</Text>
        </Animated.View>

        {/* WEATHER */}
        <Animated.View
          entering={FadeInUp.duration(1000).delay(400).springify().damping(10).stiffness(80)}
          style={styles.cardContainer}
        >
          <Text style={styles.sectionTitle}>Weather Today</Text>
          <WeatherCard />
        </Animated.View>

        {/* PRODUCT FILTER */}
        <Animated.View
          entering={FadeInUp.duration(1000).delay(500).springify().damping(10).stiffness(80)}
        >
          <ProductFilterSelector
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </Animated.View>

        {/* REMINDER NOTIFICATIONS */}
        <Animated.View
          entering={FadeInUp.duration(1000).delay(600).springify().damping(10).stiffness(80)}
        >
          <ProductReminder />
        </Animated.View>

        {/* PERSONALIZED RECOMMENDATIONS */}
        {isLoadingPersonalized ? (
          <Animated.View
            entering={FadeInUp.duration(1000).delay(700).springify().damping(10).stiffness(80)}
            style={styles.recommendationContainer}
          >
            <Text style={styles.sectionTitle}>Personalized for You</Text>
            <FlatList
              data={[1, 2, 3, 4]}
              renderItem={renderSkeletonCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.toString()}
              contentContainerStyle={styles.recommendationList}
            />
          </Animated.View>
        ) : (
          filteredPersonalized.length > 0 ? (
            <Animated.View
              entering={FadeInUp.duration(1000).delay(700).springify().damping(10).stiffness(80)}
              style={styles.recommendationContainer}
            >
              <Text style={styles.sectionTitle}>Personalized for You</Text>
              <FlatList
                data={filteredPersonalized}
                renderItem={renderProductCard}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.recommendationList}
              />
            </Animated.View>
          ) : (
            <Animated.View
              entering={FadeInUp.duration(1000).delay(700).springify().damping(10).stiffness(80)}
              style={styles.recommendationContainer}
            >
              <Text style={styles.sectionTitle}>Personalized for You</Text>
              <Text style={styles.noRecommendationsText}>No personalized recommendations available at the moment.</Text>
            </Animated.View>
          )
        )}

        {/* FEATURED PRODUCT */}
        <Animated.View
          entering={FadeInUp.duration(1000).delay(800).springify().damping(10).stiffness(80)}
          style={styles.cardContainer}
        >
          <Text style={styles.sectionTitle}>Featured Product</Text>
          <ProductCard product={featuredProduct} />
        </Animated.View>

        {/* ALL RECOMMENDATIONS */}
        <Animated.View
          entering={FadeInUp.duration(1000).delay(1000).springify().damping(10).stiffness(80)}
          style={styles.recommendationContainer}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore More</Text>
            <Text style={styles.productCount}>
              {filteredExploreProducts.length} product{filteredExploreProducts.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <FlatList
            data={filteredExploreProducts}
            renderItem={renderProductCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.recommendationList}
          />
        </Animated.View>

        {/* FEEDBACK SECTION */}
        <Animated.View
          entering={FadeInUp.duration(1000).delay(1100).springify().damping(10).stiffness(80)}
          style={styles.feedbackContainer}
        >
          <Text style={styles.sectionTitle}>Share Your Feedback</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rate your experience:</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setFeedbackRating(star)}>
                  <MaterialIcons
                    name={star <= feedbackRating ? 'star' : 'star-border'}
                    size={32}
                    color={star <= feedbackRating ? '#FFD700' : '#CCCCCC'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Tell us what you think..."
            placeholderTextColor="#666666"
            value={feedbackText}
            onChangeText={setFeedbackText}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              if (feedbackRating > 0 || feedbackText.trim().length > 0) {
                const compliments = [
                  "Thank you for your valuable feedback! 🌟",
                  "We appreciate your input! 💖",
                  "Your feedback helps us improve! 🙌",
                  "Thanks for sharing your thoughts! 😊",
                  "Your opinion matters to us! 👍",
                  "Thanks for helping us grow! 🌱",
                  "We love hearing from you! 💬",
                  "Your feedback is a gift! 🎁",
                ];
                const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
                Alert.alert('Feedback Submitted', randomCompliment);
                // Clear feedback inputs after submission
                setFeedbackRating(0);
                setFeedbackText('');
              } else {
                Alert.alert('Feedback Incomplete', 'Please provide a rating or some comments.');
              }
            }}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerIcon: {
    marginBottom: 8,
  },
  greetingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666666",
    textAlign: "center",
    marginTop: 8,
  },
  userDetailsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#333333",
    marginTop: 8,
    textAlign: "center",
  },
  detailValue: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    marginTop: 4,
    textAlign: "center",
  },
  concernsContainer: {
    marginTop: 16,
  },
  concernsTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    marginBottom: 8,
  },
  concernsList: {
    paddingHorizontal: 8,
  },
  concernChip: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  concernText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#000",
  },
  dailyTipContainer: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#FFD700",
    marginLeft: 8,
  },
  tipText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#000000",
    lineHeight: 24,
  },
  cardContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    alignSelf: "flex-start",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  recommendationContainer: {
    width: "100%",
    marginBottom: 24,
  },
  recommendationList: {
    paddingHorizontal: 8,
  },
  productCard: {
    marginRight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productCount: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  noRecommendationsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
  },
  feedbackContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  feedbackInput: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#000000",
    marginBottom: 16,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4FC3F7",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },
});
