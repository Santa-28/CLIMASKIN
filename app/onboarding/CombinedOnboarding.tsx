import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useUser } from '../context/UserContext';
import { getAuth } from 'firebase/auth';
import { saveQuizAnswers } from '../../services/quizService';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { db } from '@/config/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';

// Define the response structure from Roboflow
interface PredictionResponse {
  predictions: {
    [key: string]: {
      class_id: number;
      confidence: number;
    };
  };
}

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
    skinType: 'unknown',
    waterIntake: 2,
    imageUri: '',
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [routinePreferences, setRoutinePreferences] = useState('Natural');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const router = useRouter();
  const { setUserName, setSkinType, setWaterIntake, setSkinConcerns: setContextSkinConcerns, setRoutinePreferences: setContextRoutinePreferences } = useUser();

  const handleProfileChange = (key: string, value: any) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const handleQuizAnswer = (key: string, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [key]: value }));
  };

  const toggleConcern = (concern: string) => {
    setSkinConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const validateProfile = () => {
    if (!profileData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (profileData.skinType === 'unknown' && !prediction) {
      Alert.alert('Error', 'Please upload a skin image to detect your skin type');
      return false;
    }
    return true;
  };

  const validateAllQuestions = () => {
    // Check if all quiz questions are answered
    for (const q of quizData) {
      if (!quizAnswers[q.key]) {
        Alert.alert('Error', `Please answer: ${q.question}`);
        return false;
      }
    }
    // Check if at least one skin concern is selected
    if (skinConcerns.length === 0) {
      Alert.alert('Error', 'Please select at least one skin concern');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    if (!pickerResult.canceled && pickerResult.assets[0].base64) {
      handleProfileChange('imageUri', pickerResult.assets[0].uri);
      classifySkinType(pickerResult.assets[0].base64);
    }
  };

  const classifySkinType = async (base64Image: string) => {
    try {
      setLoading(true);
      setPrediction(null);

      const response = await axios.post(
        "https://serverless.roboflow.com/skin-type-tgow5/1",
        base64Image,
        {
          params: { api_key: "JFfjlaDDlbFKWcAGYBy3" },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log("Full Response:", response.data);

      const data = response.data as PredictionResponse;
      const predictions = data.predictions;
      let bestClass = "";
      let bestConfidence = 0;

      for (const [label, info] of Object.entries(predictions)) {
        const confidence = info.confidence;
        if (confidence > bestConfidence) {
          bestClass = label;
          bestConfidence = confidence;
        }
      }

      const predictedSkinType = `${bestClass} (${(bestConfidence * 100).toFixed(2)}%)`;
      setPrediction(predictedSkinType);
      handleProfileChange('skinType', bestClass.toLowerCase());
    } catch (error: any) {
      console.error("Error:", error.message);
      Alert.alert("Something went wrong!", "Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (validateProfile()) {
        setCurrentStep(1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    if (!validateAllQuestions()) {
      return;
    }

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
      setContextSkinConcerns(skinConcerns);
      setContextRoutinePreferences(routinePreferences);

      // Save quiz answers
      await saveQuizAnswers(user.uid, {
        skinType: profileData.skinType,
        waterIntake: profileData.waterIntake.toString(),
        ...quizAnswers,
      });

      // Save to Firestore
      await setDoc(
        doc(db, 'users', user.uid),
        {
          userName: profileData.name,
          skinType: profileData.skinType,
          waterIntake: profileData.waterIntake,
          skinConcerns,
          routinePreferences,
          quizAnswers,
        },
        { merge: true }
      );

      console.log('Onboarding completed');
      router.push('/dashboard/dashboard');
      // router.push('/dashboard/Home');
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
            <Picker.Item label="Unknown" value="unknown" />
          </Picker>
        </View>
      </View>

      {/* Image Upload - Show only if skinType is 'unknown' */}
      {profileData.skinType === 'unknown' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Upload Skin Image to Detect Type</Text>
          <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage} disabled={loading}>
            <Text style={styles.imageUploadButtonText}>{loading ? 'Analyzing...' : 'Choose Image'}</Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />}
          {profileData.imageUri ? (
            <Image source={{ uri: profileData.imageUri }} style={styles.uploadedImage} />
          ) : null}
          {prediction && (
            <Text style={styles.predictionText}>Predicted Skin Type: {prediction}</Text>
          )}
        </View>
      )}

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

  const renderAllQuestionsStep = () => {
    const concernsOptions = ['Acne', 'Dryness', 'Oiliness', 'Aging', 'Sensitivity'];

    return (
      <Animated.View entering={FadeInDown.duration(600)} style={styles.stepContainer}>
        <View style={styles.header}>
          <MaterialIcons name="wb-sunny" size={40} color="#FFB300" />
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Answer these questions to personalize your experience</Text>
        </View>

        {/* Quiz Questions */}
        {quizData.map((q, index) => (
          <Animated.View
            key={q.key}
            entering={FadeInUp.duration(400).delay(index * 100)}
            style={styles.questionSection}
          >
            <Text style={styles.questionText}>{q.question}</Text>
            <View style={styles.optionsContainer}>
              {q.options.map((option) => (
                <TouchableOpacity
                  key={option}
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
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Skin Concerns */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(200)}
          style={styles.questionSection}
        >
          <Text style={styles.questionText}>Skin Concerns (select all that apply)</Text>
          <View style={styles.concernsWrapper}>
            {concernsOptions.map((concern) => (
              <TouchableOpacity
                key={concern}
                style={[
                  styles.concernButton,
                  skinConcerns.includes(concern) && styles.selectedConcernButton,
                ]}
                onPress={() => toggleConcern(concern)}
              >
                <Text
                  style={[
                    styles.concernButtonText,
                    skinConcerns.includes(concern) && styles.selectedConcernButtonText,
                  ]}
                >
                  {concern}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Routine Preferences */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(300)}
          style={styles.questionSection}
        >
          <Text style={styles.questionText}>Routine Preferences</Text>
          <View style={styles.pickerWrapper}>
            <MaterialIcons name="settings" size={24} color="#4CAF50" style={styles.inputIcon} />
            <Picker
              selectedValue={routinePreferences}
              onValueChange={setRoutinePreferences}
              style={styles.picker}
            >
              <Picker.Item label="Natural" value="Natural" />
              <Picker.Item label="Medical" value="Medical" />
              <Picker.Item label="Cosmetic" value="Cosmetic" />
            </Picker>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  const renderProgressBar = () => {
    const totalSteps = 2; // Only 2 steps now
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

        {currentStep === 0 ? renderProfileStep() : renderAllQuestionsStep()}

        <Animated.View entering={FadeInUp.duration(400).delay(600)} style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={currentStep === 0 ? handleNext : handleFinish}
            style={styles.nextButton}
          >
            <LinearGradient colors={['#4CAF50', '#81C784']} style={styles.gradientButton}>
              <Text style={styles.buttonText}>
                {currentStep === 0 ? 'Next' : 'Finish'}
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
  subtitle: { fontSize: 16, fontFamily: 'Poppins-Regular', color: '#666', marginTop: 8, textAlign: 'center' },
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
  questionSection: { width: '100%', marginBottom: 24, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 16, padding: 16 },
  questionText: { fontSize: 18, fontFamily: 'Poppins-SemiBold', color: '#333', marginBottom: 12 },
  optionsContainer: { width: '100%', alignItems: 'center' },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 16, borderRadius: 15, backgroundColor: '#FFFFFF', marginVertical: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  selectedOption: { borderWidth: 2, borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
  optionText: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#333' },
  selectedOptionText: { color: '#4CAF50' },
  concernsWrapper: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  concernButton: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 12, marginVertical: 5, width: '48%', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  selectedConcernButton: { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' },
  concernButtonText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#333' },
  selectedConcernButtonText: { color: '#4CAF50', fontFamily: 'Poppins-SemiBold' },
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
  imageUploadButton: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center' },
  imageUploadButtonText: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#FFFFFF' },
  uploadedImage: { width: 100, height: 100, borderRadius: 12, marginTop: 8, alignSelf: 'center' },
  loadingIndicator: { marginTop: 10 },
  predictionText: { marginTop: 10, fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#4CAF50', textAlign: 'center' },
});