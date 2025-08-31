// app/onboarding/SkinCareQuestions.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { db } from '@/config/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function SkinCareQuestions() {
  // ✅ renamed setter here
  const [skinConcerns, setLocalSkinConcerns] = useState<string[]>([]);
  const [routinePreferences, setLocalRoutinePreferences] = useState('Natural');
  const router = useRouter();
  // ✅ keep context setters as they are
  const { setSkinConcerns, setRoutinePreferences, userName } = useUser();

  const toggleConcern = (concern: string) => {
    setLocalSkinConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const handleSave = async () => {
    if (skinConcerns.length === 0) {
      Alert.alert('Error', 'Please select at least one skin concern.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'You must be logged in to save your preferences.');
      return;
    }

    try {
      // Save to Firestore
      await setDoc(
        doc(db, 'users', user.uid),
        {
          userName,
          skinConcerns,
          routinePreferences,
        },
        { merge: true }
      );

      // ✅ Update context
      setSkinConcerns(skinConcerns);
      setRoutinePreferences(routinePreferences);

      router.push('/dashboard/dashboard');
    } catch (error: any) {
      console.error('Error saving questions:', error);
      Alert.alert('Error', `Failed to save preferences: ${error.message}`);
    }
  };

  const concernsOptions = ['Acne', 'Dryness', 'Oiliness', 'Aging', 'Sensitivity'];

  return (
    <LinearGradient colors={['#4FC3F7', '#81D4FA', '#E3F2FD']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          entering={FadeInUp.duration(800).springify().damping(12).stiffness(90)}
          style={styles.card}
        >
          <View style={styles.header}>
            <MaterialIcons name="face" size={40} color="#FFB300" />
            <Text style={styles.title}>Extra Skincare Details</Text>
            <Text style={styles.subtitle}>Help us tailor your routine</Text>
          </View>

          {/* Skin Concerns */}
          <Animated.View
            entering={FadeInUp.duration(400).delay(200)}
            style={styles.inputContainer}
          >
            <Text style={styles.label}>Skin Concerns (select all that apply)</Text>
            <View style={styles.concernsWrapper}>
              {concernsOptions.map((concern) => (
                <TouchableOpacity
                  key={concern}
                  style={[
                    styles.concernButton,
                    skinConcerns.includes(concern) && styles.selectedConcern,
                  ]}
                  onPress={() => toggleConcern(concern)}
                >
                  <Text style={styles.concernText}>{concern}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Routine Preferences */}
          <Animated.View
            entering={FadeInUp.duration(400).delay(400)}
            style={styles.inputContainer}
          >
            <Text style={styles.label}>Routine Preferences</Text>
            <View style={styles.pickerWrapper}>
              <MaterialIcons name="settings" size={24} color="#4CAF50" style={styles.inputIcon} />
              <Picker
                selectedValue={routinePreferences}
                onValueChange={setLocalRoutinePreferences}
                style={styles.picker}
              >
                <Picker.Item label="Natural" value="Natural" />
                <Picker.Item label="Organic" value="Organic" />
                <Picker.Item label="Fragrance-Free" value="Fragrance-Free" />
              </Picker>
            </View>
          </Animated.View>

          {/* Save Button */}
          <Animated.View
            entering={FadeInUp.duration(400).delay(600)}
            style={styles.buttonContainer}
          >
            <TouchableOpacity onPress={handleSave}>
              <LinearGradient colors={['#4CAF50', '#81C784']} style={styles.button}>
                <Text style={styles.buttonText}>Save & Finish</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontFamily: 'Poppins-Bold', color: '#333' },
  subtitle: { fontSize: 16, fontFamily: 'Poppins-Regular', color: '#666', marginTop: 8 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#333', marginBottom: 8 },
  concernsWrapper: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  concernButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 10,
    marginVertical: 5,
    width: '48%',
    alignItems: 'center',
  },
  selectedConcern: { backgroundColor: '#4CAF50' },
  concernText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#333' },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 8 },
  picker: { flex: 1, fontFamily: 'Poppins-Regular', color: '#333' },
  buttonContainer: { borderRadius: 16, overflow: 'hidden' },
  button: { paddingVertical: 15, paddingHorizontal: 24, alignItems: 'center' },
  buttonText: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
});
