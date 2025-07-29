import ProductCard from "@/components/skinProducts/ProductCard";
import WeatherCard from "@/components/weather/WeatherCard";
import { products } from "@/constants/product";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Home() {
  // Animation for gradient shift
  const gradientShift = useSharedValue(0);
  const animatedGradientStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(gradientShift.value * 20, {
          duration: 5000,
          easing: Easing.linear,
        }),
      },
    ],
  }));

  React.useEffect(() => {
    gradientShift.value = withTiming(
      1,
      { duration: 5000, easing: Easing.linear },
      () => {
        gradientShift.value = 0;
      }
    );
  }, []);

  return (
    <LinearGradient
      colors={["#4FC3F7", "#81D4FA", "#E3F2FD"]}
      style={styles.container}
    >
      <Animated.View style={animatedGradientStyle}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View
            entering={FadeInDown.duration(800).springify()}
            style={styles.header}
          >
            <MaterialIcons
              name="wb-sunny"
              size={40}
              color="#FFB300"
              style={styles.headerIcon}
            />
            <Text style={styles.title}>Welcome to ClimaSkin 🌤️</Text>
            <Text style={styles.subtitle}>
              Your personalized skin care starts here
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .springify()
              .damping(10)
              .stiffness(80)}
            style={styles.cardContainer}
          >
            <WeatherCard />
          </Animated.View>
          {products.map((product) => (
            <Animated.View
              key={product.id}
              entering={FadeInDown.duration(1200)
                .springify()
                .damping(10)
                .stiffness(80)}
              style={styles.cardContainer}
            >
              <ProductCard product={product} />
            </Animated.View>
          ))}

          {/* Later: TipsCard, ProductRecommendationCard */}
        </ScrollView>
      </Animated.View>
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
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerIcon: {
    marginBottom: 8,
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
    color: "#E3F2FD",
    textAlign: "center",
    marginTop: 8,
  },
  cardContainer: {
    width: "100%",
    alignItems: "center",
  },
});
