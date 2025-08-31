import React from "react";
import { View, Text, StyleSheet, ColorValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  gradientColors: readonly [ColorValue, ColorValue, ...ColorValue[]];
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  gradientColors,
}) => {
  return (
    <LinearGradient colors={gradientColors} style={styles.card}>
      {/* Header with Fade Animation */}
      <Animated.Text entering={FadeIn.duration(800)} style={styles.title}>
        {title}
      </Animated.Text>

      {/* Content with Overlay for Readability */}
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6, // Android shadow
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 12,
    padding: 16,
  },
});

export default SectionCard;