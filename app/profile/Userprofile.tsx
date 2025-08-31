// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialIcons } from '@expo/vector-icons';
// import Slider from '@react-native-community/slider';
// import { Picker } from '@react-native-picker/picker';
// import { useRouter } from 'expo-router';
// import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
// import { useUser } from '../context/UserContext';

// export default function ProfileScreen() {
//   const [skinType, setSkinType] = useState('normal');
//   const [waterIntake, setWaterIntake] = useState(2);
//   const [name, setName] = useState('');
//   const router = useRouter();
//   const { setUserName } = useUser();

//   // Animation for button pulse
//   const pulse = useSharedValue(1);
//   const animatedButtonStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: pulse.value }],
//   }));

//   React.useEffect(() => {
//     pulse.value = withRepeat(withTiming(1.05, { duration: 1000 }), -1, true);
//   }, []);

//   const handleSave = () => {
//     setUserName(name); // Save name to context
//     // Save user profile -> backend / local storage
//     // router.push('/dashboard/Home');
//     // router.push('/dashboard/dashboard');
//     // router.push('/camera/CameraScreen');
//     router.push("../onboarding/CombinedOnboarding"); // ✅ Navigate to combined onboarding

//   };

//   return (
//     <LinearGradient colors={['#4FC3F7', '#81D4FA', '#E3F2FD']} style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <Animated.View entering={FadeInUp.duration(800).springify().damping(12).stiffness(90)} style={styles.card}>
//           <View style={styles.header}>
//             <MaterialIcons name="person-add" size={40} color="#FFB300" />
//             <Text style={styles.title}>Setup Your Profile ✨</Text>
//             <Text style={styles.subtitle}>Personalize your ClimaSkin experience</Text>
//           </View>

//           {/* Name */}
//           <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.inputContainer}>
//             <Text style={styles.label}>Name</Text>
//             <View style={styles.inputWrapper}>
//               <MaterialIcons name="person" size={24} color="#4CAF50" style={styles.inputIcon} />
//               <TextInput
//                 value={name}
//                 onChangeText={setName}
//                 placeholder="Enter your name"
//                 style={styles.textInput}
//                 placeholderTextColor="#999"
//               />
//             </View>
//           </Animated.View>

//           {/* Skin Type */}
//           <Animated.View entering={FadeInUp.duration(400).delay(400)} style={styles.inputContainer}>
//             <Text style={styles.label}>Skin Type</Text>
//             <View style={styles.pickerWrapper}>
//               <MaterialIcons name="water-drop" size={24} color="#4CAF50" style={styles.inputIcon} />
//               <Picker
//                 selectedValue={skinType}
//                 onValueChange={(value) => setSkinType(value)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Normal" value="normal" />
//                 <Picker.Item label="Oily" value="oily" />
//                 <Picker.Item label="Dry" value="dry" />
//                 <Picker.Item label="Combination" value="combination" />
//                 <Picker.Item label="Sensitive" value="sensitive" />
//               </Picker>
//             </View>
//           </Animated.View>

//           {/* Water Intake */}
//           <Animated.View entering={FadeInUp.duration(400).delay(600)} style={styles.inputContainer}>
//             <Text style={styles.label}>Daily Water Intake (liters)</Text>
//             <View style={styles.sliderWrapper}>
//               <MaterialIcons name="local-drink" size={24} color="#4CAF50" style={styles.inputIcon} />
//               <Slider
//                 minimumValue={0}
//                 maximumValue={5}
//                 step={0.5}
//                 value={waterIntake}
//                 onValueChange={setWaterIntake}
//                 minimumTrackTintColor="#4CAF50"
//                 maximumTrackTintColor="#E0E0E0"
//                 thumbTintColor="#FFB300"
//                 style={styles.slider}
//               />
//             </View>
//             <Text style={styles.sliderValue}>{waterIntake} L / day</Text>
//           </Animated.View>

//           {/* Save Button */}
//           <Animated.View entering={FadeInUp.duration(400).delay(800)} style={[styles.buttonContainer, animatedButtonStyle]}>
//             <TouchableOpacity onPress={handleSave}>
//               <LinearGradient colors={['#4CAF50', '#81C784']} style={styles.button}>
//                 <Text style={styles.buttonText}>Save & Continue</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </Animated.View>
//         </Animated.View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   card: {
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: 24,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.4)',
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontFamily: 'Poppins-Bold',
//     color: '#333',
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   subtitle: {
//     fontSize: 16,
//     fontFamily: 'Poppins-Regular',
//     color: '#666',
//     marginTop: 8,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontFamily: 'Poppins-SemiBold',
//     color: '#333',
//     marginBottom: 8,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//   },
//   inputIcon: {
//     marginRight: 8,
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 16,
//     fontFamily: 'Poppins-Regular',
//     color: '#333',
//     paddingVertical: 12,
//   },
//   pickerWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//   },
//   picker: {
//     flex: 1,
//     fontFamily: 'Poppins-Regular',
//     color: '#333',
//   },
//   sliderWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   slider: {
//     flex: 1,
//     height: 40,
//   },
//   sliderValue: {
//     fontSize: 14,
//     fontFamily: 'Poppins-Regular',
//     color: '#333',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   buttonContainer: {
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   button: {
//     paddingVertical: 15,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontSize: 18,
//     fontFamily: 'Poppins-Bold',
//     color: '#FFFFFF',
//   },
// });