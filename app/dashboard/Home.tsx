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
  FadeIn,
  FadeOut,
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
import { saveFeedback } from "../../services/feedbackService";
import { auth } from "../../config/firebaseconfig";

type TabType = 'overview' | 'products' | 'feedback';

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

  const [activeTab, setActiveTab] = useState<TabType>('overview');
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

  // Tab indicator animation
  const tabIndicatorPosition = useSharedValue(0);
  
  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabIndicatorPosition.value }],
  }));

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
      setTimeout(() => {
        setPersonalizedRecommendations(recommendedProducts);
        setIsLoadingPersonalized(false);
      }, 2000);
    }

    // Generate daily tip
    const tips = [
      `Stay hydrated! Aim for ${waterIntake} cups of water today.`,
      `Your ${skinType} skin needs consistent care. Keep up the good work!`,
      `Don't forget to apply sunscreen daily, especially with your ${skinConcerns.join(', ')} concerns.`,
      `Your preferred routine: ${routinePreferences}. Stick to it for best results!`,
      `Great job tracking your skin care! Consistency is key.`,
    ];
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
  }, [age, gender, skinType, waterIntake, skinConcerns, routinePreferences]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const tabPositions = { overview: 0, products: 120, feedback: 240 };
    tabIndicatorPosition.value = withSpring(tabPositions[tab], {
      damping: 15,
      stiffness: 150,
    });
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <Animated.View
      entering={FadeInUp.duration(600).delay(100).springify().damping(12).stiffness(90)}
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

  const handleSubmitFeedback = async () => {
    if (feedbackRating > 0 || feedbackText.trim().length > 0) {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Not Logged In', 'You must be logged in to submit feedback.');
          return;
        }
        await saveFeedback(user.uid, feedbackRating, feedbackText.trim());
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
        setFeedbackRating(0);
        setFeedbackText('');
      } catch (error) {
        Alert.alert('Submission Error', 'There was an error submitting your feedback. Please try again later.');
      }
    } else {
      Alert.alert('Feedback Incomplete', 'Please provide a rating or some comments.');
    }
  };

  // TABS CONTENT COMPONENTS
  const OverviewTab = () => (
    <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
      {/* HEADER */}
      <Animated.View 
        entering={FadeInUp.duration(600).springify().damping(10).stiffness(80)}
        style={styles.header}
      >
        <MaterialIcons name="wb-sunny" size={42} color="#FFB300" style={styles.headerIcon} />
        <View style={styles.greetingContainer}>
          {userName ? (
            <Text style={styles.title}>Welcome {userName} 🌤️</Text>
          ) : (
            <Text style={styles.title}>Welcome</Text>
          )}
        </View>
        <Text style={styles.subtitle}>Your personalized skin care starts here</Text>
      </Animated.View>

      {/* USER PROFILE */}
      <Animated.View
        entering={FadeInUp.duration(700).delay(100).springify().damping(10).stiffness(80)}
        style={styles.userDetailsContainer}
      >
        <Text style={styles.sectionTitle}>Your Profile</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="person" size={24} color="#000000" />
            <Text style={styles.detailLabel}>Age</Text>
            <Text style={styles.detailValue}>{age || 'Not set'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="man" size={24} color="#000000" />
            <Text style={styles.detailLabel}>Gender</Text>
            <Text style={styles.detailValue}>{gender || 'Not set'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water" size={24} color="#000000" />
            <Text style={styles.detailLabel}>Water Intake</Text>
            <Text style={styles.detailValue}>{waterIntake} cups</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="face" size={24} color="#000000" />
            <Text style={styles.detailLabel}>Skin Type</Text>
            <Text style={styles.detailValue}>{skinType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="fitness" size={24} color="#000000" />
            <Text style={styles.detailLabel}>Routine</Text>
            <Text style={styles.detailValue}>{routinePreferences}</Text>
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
        entering={FadeInUp.duration(700).delay(200).springify().damping(10).stiffness(80)}
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
        entering={FadeInUp.duration(700).delay(300).springify().damping(10).stiffness(80)}
        style={styles.cardContainer}
      >
        <Text style={styles.sectionTitle}>Weather Today</Text>
        <WeatherCard />
      </Animated.View>

      {/* REMINDER */}
      <Animated.View
        entering={FadeInUp.duration(700).delay(400).springify().damping(10).stiffness(80)}
      >
        <ProductReminder />
      </Animated.View>
    </Animated.View>
  );

  const ProductsTab = () => (
    <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
      {/* PRODUCT FILTER */}
      <Animated.View
        entering={FadeInUp.duration(600).springify().damping(10).stiffness(80)}
      >
        <ProductFilterSelector
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </Animated.View>

      {/* PERSONALIZED RECOMMENDATIONS */}
      {isLoadingPersonalized ? (
        <Animated.View
          entering={FadeInUp.duration(700).delay(100).springify().damping(10).stiffness(80)}
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
            entering={FadeInUp.duration(700).delay(100).springify().damping(10).stiffness(80)}
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
            entering={FadeInUp.duration(700).delay(100).springify().damping(10).stiffness(80)}
            style={styles.recommendationContainer}
          >
            <Text style={styles.sectionTitle}>Personalized for You</Text>
            <Text style={styles.noRecommendationsText}>No personalized recommendations available at the moment.</Text>
          </Animated.View>
        )
      )}

      {/* FEATURED PRODUCT */}
      <Animated.View
        entering={FadeInUp.duration(700).delay(200).springify().damping(10).stiffness(80)}
        style={styles.cardContainer}
      >
        <Text style={styles.sectionTitle}>Featured Product</Text>
        <ProductCard product={featuredProduct} />
      </Animated.View>

      {/* EXPLORE MORE */}
      <Animated.View
        entering={FadeInUp.duration(700).delay(300).springify().damping(10).stiffness(80)}
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
    </Animated.View>
  );

  const FeedbackTab = () => (
    <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
      <Animated.View
        entering={FadeInUp.duration(600).springify().damping(10).stiffness(80)}
        style={styles.feedbackContainer}
      >
        <View style={styles.feedbackHeader}>
          <MaterialIcons name="feedback" size={32} color="#4FC3F7" />
          <Text style={styles.feedbackMainTitle}>We Value Your Opinion</Text>
        </View>
        <Text style={styles.feedbackSubtitle}>
          Help us improve your experience by sharing your thoughts
        </Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Rate your experience:</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setFeedbackRating(star)}>
                <MaterialIcons
                  name={star <= feedbackRating ? 'star' : 'star-border'}
                  size={40}
                  color={star <= feedbackRating ? '#FFD700' : '#CCCCCC'}
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
          {feedbackRating > 0 && (
            <Animated.Text 
              entering={FadeInUp.duration(400)}
              style={styles.ratingText}
            >
              {feedbackRating === 5 ? '🌟 Excellent!' : 
               feedbackRating === 4 ? '😊 Great!' : 
               feedbackRating === 3 ? '👍 Good!' : 
               feedbackRating === 2 ? '😐 Fair' : '😞 Needs improvement'}
            </Animated.Text>
          )}
        </View>

        <View style={styles.feedbackInputContainer}>
          <Text style={styles.feedbackInputLabel}>Tell us more:</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Share your experience, suggestions, or any concerns..."
            placeholderTextColor="#999999"
            value={feedbackText}
            onChangeText={setFeedbackText}
            multiline
            numberOfLines={6}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (feedbackRating === 0 && feedbackText.trim().length === 0) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmitFeedback}
          activeOpacity={0.8}
        >
          <MaterialIcons name="send" size={20} color="#FFFFFF" style={styles.submitIcon} />
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>

        <View style={styles.feedbackFooter}>
          <Ionicons name="shield-checkmark" size={16} color="#666666" />
          <Text style={styles.feedbackFooterText}>
            Your feedback is confidential and helps us serve you better
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );

  return (
    <LinearGradient colors={["#4FC3F7", "#81D4FA", "#E3F2FD"]} style={styles.container}>
      {/* TAB CONTENT */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'feedback' && <FeedbackTab />}
      </ScrollView>

      {/* TABS NAVIGATION */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => handleTabChange('overview')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="home"
              size={20}
              color={activeTab === 'overview' ? '#FFFFFF' : '#666666'}
            />
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'products' && styles.tabActive]}
            onPress={() => handleTabChange('products')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="basket"
              size={20}
              color={activeTab === 'products' ? '#FFFFFF' : '#666666'}
            />
            <Text style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}>
              Products
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'feedback' && styles.tabActive]}
            onPress={() => handleTabChange('feedback')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chatbubbles"
              size={20}
              color={activeTab === 'feedback' ? '#FFFFFF' : '#666666'}
            />
            <Text style={[styles.tabText, activeTab === 'feedback' && styles.tabTextActive]}>
              Feedback
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Tab Indicator */}
        <Animated.View style={[styles.tabIndicator, animatedIndicatorStyle]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 8,
    paddingBottom: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(79, 195, 247, 0.1)',
    marginRight: 8,
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#4FC3F7',
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    left: 16,
    width: 100,
    height: 3,
    backgroundColor: '#4FC3F7',
    borderRadius: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    paddingBottom: 120,
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    backgroundColor: "rgba(79, 195, 247, 0.08)",
    borderRadius: 16,
    padding: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666666",
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
    paddingHorizontal: 0,
  },
  concernChip: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  concernText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#000",
  },
  dailyTipContainer: {
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
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
    color: "#F57C00",
    marginLeft: 8,
  },
  tipText: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#333333",
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
  },
  recommendationContainer: {
    width: "100%",
    marginBottom: 24,
  },
  recommendationList: {
    paddingHorizontal: 4,
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  feedbackHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackMainTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#000000",
    marginTop: 12,
    textAlign: 'center',
  },
  feedbackSubtitle: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#666666",
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  ratingContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  starIcon: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#4FC3F7",
    marginTop: 12,
  },
  feedbackInputContainer: {
    marginBottom: 24,
  },
  feedbackInputLabel: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    marginBottom: 12,
  },
  feedbackInput: {
    backgroundColor: "rgba(79, 195, 247, 0.05)",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#000000",
    textAlignVertical: "top",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "rgba(79, 195, 247, 0.2)",
  },
  submitButton: {
    backgroundColor: "#4FC3F7",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitIcon: {
    marginRight: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },
  feedbackFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  feedbackFooterText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
  },
});