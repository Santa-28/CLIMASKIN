import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useUser } from '../context/UserContext';
import { getAuth } from 'firebase/auth';
import { saveQuizAnswers } from '../../services/quizService';

const quizData = [
  {
    question: "How often are you exposed to sunlight?",
    options: ["Rarely", "1-2 hours daily", "More than 2 hours", "Always"],
    key: "sunExposure",
  },
  {
    question: "Do you live in a humid climate?",
    options: ["Yes", "No"],
    key: "humidity",
  },
];

export default function CombinedOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    skinType: 'normal',
    waterIntake: 2,
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const router = useRouter();
  const { setUserName, setSkinType, setWaterIntake } = useUser();

  const handleProfileChange = (key: string, value: any) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const handleQuizAnswer = (key: string, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [key]: value }));
  };

  const validateProfile = () => {
    if (!profileData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (validateProfile()) {
        setCurrentStep(1);
      }
    } else if (currentStep < quizData.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save profile data to context
      setUserName(profileData.name);
      setSkinType(profileData.skinType);
      setWaterIntake(profileData.waterIntake);

      // Save quiz answers
      await saveQuizAnswers(user.uid, {
        skinType: profileData.skinType,
        waterIntake: profileData.waterIntake.toString(),
        ...quizAnswers,
      });

      console.log('Onboarding completed');
      router.push('/onboarding/SkinCareQuestions');
    } catch (error: any) {
      console.error('Failed to save onboarding data:', error.message);
      Alert.alert('Error', 'Failed to save your data. Please try again.');
    }
  };

  const renderProfileStep = () => (
    <Animated.View entering={FadeInUp.duration(600)} style={styles.stepContainer}>
      <View style={styles.header}>
        <MaterialIcons name="person-add" size={40} color="#FFB300" />
        <Text style={styles.title}>Setup Your Profile ✨</Text>
        <Text style={styles.subtitle}>Personalize your ClimaSkin experience</Text>
      </View>

      {/* Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="person" size={24} color="#4CAF50" style={styles.inputIcon} />
          <TextInput
            value={profileData.name}
            onChangeText={(value) => handleProfileChange('name', value)}
            placeholder="Enter your name"
            style={styles.textInput}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Skin Type */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Skin Type</Text>
        <View style={styles.pickerWrapper}>
          <MaterialIcons name="water-drop" size={24} color="#4CAF50" style={styles.inputIcon} />
          <Picker
            selectedValue={profileData.skinType}
            onValueChange={(value) => handleProfileChange('skinType', value)}
            style={styles.picker}
          >
            <Picker.Item label="Normal" value="normal" />
            <Picker.Item label="Oily" value="oily" />
            <Picker.Item label="Dry" value="dry" />
            <Picker.Item label="Combination" value="combination" />
            <Picker.Item label="Sensitive" value="sensitive" />
          </Picker>
        </View>
      </View>

      {/* Water Intake */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Daily Water Intake (liters)</Text>
        <View style={styles.sliderWrapper}>
          <MaterialIcons name="local-drink" size={24} color="#4CAF50" style={styles.inputIcon} />
          <Slider
            minimumValue={0}
            maximumValue={5}
            step={0.5}
            value={profileData.waterIntake}
            onValueChange={(value) => handleProfileChange('waterIntake', value)}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor="#FFB300"
            style={styles.slider}
          />
        </View>
        <Text style={styles.sliderValue}>{profileData.waterIntake} L / day</Text>
      </View>
    </Animated.View>
  );

  const renderQuizStep = () => {
    const questionIndex = currentStep - 1;
    const q = quizData[questionIndex];

    return (
      <Animated.View entering={FadeInDown.duration(600)} style={styles.stepContainer}>
        <MaterialIcons name="wb-sunny" size={60} color="#FFB300" style={styles.icon} />
        <Text style={styles.heading}>{q.question}</Text>
        <Text style={styles.subheading}>
          Question {questionIndex + 1} of {quizData.length}
        </Text>

        <View style={styles.optionsContainer}>
          {q.options.map((option, index) => (
            <Animated.View
              key={option}
              entering={FadeInUp.duration(400).delay(index * 100)}
            >
              <TouchableOpacity
                onPress={() => handleQuizAnswer(q.key, option)}
                style={[
                  styles.option,
                  quizAnswers[q.key] === option && styles.selectedOption,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    quizAnswers[q.key] === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
                {quizAnswers[q.key] === option && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderProgressBar = () => {
    const totalSteps = 1 + quizData.length;
    return (
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= currentStep ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <LinearGradient colors={['#4FC3F7', '#81D4FA', '#E3F2FD']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderProgressBar()}

        {currentStep === 0 ? renderProfileStep() : renderQuizStep()}

        <Animated.View entering={FadeInUp.duration(400).delay(600)} style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleNext}
            style={styles.nextButton}
          >
            <LinearGradient colors={['#4CAF50', '#81C784']} style={styles.gradientButton}>
              <Text style={styles.buttonText}>
                {currentStep === 0 ? 'Next' : currentStep === quizData.length ? 'Finish' : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  stepContainer: { alignItems: 'center', marginBottom: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontFamily: 'Poppins-Bold', color: '#333', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  subtitle: { fontSize: 16, fontFamily: 'Poppins-Regular', color: '#666', marginTop: 8 },
  inputContainer: { marginBottom: 20, width: '100%' },
  label: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#333', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  textInput: { flex: 1, fontSize: 16, fontFamily: 'Poppins-Regular', color: '#333', paddingVertical: 12 },
  pickerWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 12 },
  picker: { flex: 1, fontFamily: 'Poppins-Regular', color: '#333' },
  sliderWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  slider: { flex: 1, height: 40 },
  sliderValue: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#333', textAlign: 'center', marginTop: 8 },
  icon: { alignSelf: 'center', marginBottom: 16 },
  heading: { fontSize: 28, fontFamily: 'Poppins-Bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 8, textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  subheading: { fontSize: 16, fontFamily: 'Poppins-Regular', color: '#E3F2FD', textAlign: 'center', marginBottom: 24 },
  optionsContainer: { width: '100%', alignItems: 'center', marginBottom: 24 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 16, borderRadius: 15, backgroundColor: '#FFFFFF', marginVertical: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  selectedOption: { borderWidth: 2, borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
  optionText: { fontSize: 18, fontFamily: 'Poppins-SemiBold', color: '#333' },
  selectedOptionText: { color: '#4CAF50' },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  progressDot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 4 },
  activeDot: { backgroundColor: '#4CAF50' },
  inactiveDot: { backgroundColor: '#B0BEC5' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 16 },
  navButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, borderWidth: 2, borderColor: '#4CAF50', backgroundColor: 'transparent' },
  nextButton: { width: 150, borderRadius: 25, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  gradientButton: { paddingVertical: 14, alignItems: 'center' },
  buttonText: { fontSize: 18, fontFamily: 'Poppins-SemiBold', color: '#FFFFFF' },
  navButtonText: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#4CAF50' },
});
