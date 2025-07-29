import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function GenderScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState('');

  const genders = [
    { label: 'Male', icon: 'man' },
    { label: 'Female', icon: 'woman' },
    { label: 'Other', icon: 'transgender' },
  ];

  const handleNext = () => {
    if (selectedGender) {
      // You can store gender in AsyncStorage or context if needed
      router.push('../onboarding/quiz');
    }
  };

  return (
    <LinearGradient
      colors={['#4FC3F7', '#81D4FA', '#E3F2FD']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.heading}>Tell Us About You</Text>
          <Text style={styles.subheading}>What’s your gender?</Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {genders.map((gender, index) => (
            <Animated.View
              key={gender.label}
              entering={FadeInUp.duration(400).delay(index * 200)}
            >
              <Pressable
                onPress={() => setSelectedGender(gender.label)}
                style={({ pressed }) => [
                  styles.option,
                  selectedGender === gender.label && styles.selectedOption,
                  pressed && styles.pressedOption,
                ]}
              >
                <View style={styles.optionContent}>
                  <MaterialIcons
                    name={gender.icon}
                    size={28}
                    color={selectedGender === gender.label ? '#4CAF50' : '#666'}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      selectedGender === gender.label && styles.selectedOptionText,
                    ]}
                  >
                    {gender.label}
                  </Text>
                </View>
                {selectedGender === gender.label && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                )}
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInUp.duration(400).delay(600)}>
          <Pressable
            onPress={handleNext}
            disabled={!selectedGender}
            style={({ pressed }) => [
              styles.nextButton,
              !selectedGender && styles.disabledButton,
              pressed && selectedGender && styles.pressedButton,
            ]}
          >
            <LinearGradient
              colors={selectedGender ? ['#4CAF50', '#81C784'] : ['#B0BEC5', '#CFD8DC']}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Next</Text>
            </LinearGradient>
          </Pressable>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subheading: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#E3F2FD',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  pressedOption: {
    backgroundColor: '#F5F5F5',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginLeft: 12,
  },
  selectedOptionText: {
    color: '#4CAF50',
  },
  nextButton: {
    width: 200,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  pressedButton: {
    transform: [{ scale: 0.95 }],
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});