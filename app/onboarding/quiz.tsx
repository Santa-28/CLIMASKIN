// import React, { useState } from "react";
// import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
// import { useRouter } from "expo-router";
// import { LinearGradient } from "expo-linear-gradient";
// import { MaterialIcons } from "@expo/vector-icons";
// import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
// import { getAuth } from "firebase/auth";
// import { saveQuizAnswers } from "../../services/quizService";

// const quizData = [
//   {
//     question: "What is your skin type?",
//     options: ["Oily", "Dry", "Combination", "Normal"],
//     key: "skinType",
//   },
//   {
//     question: "How often are you exposed to sunlight?",
//     options: ["Rarely", "1-2 hours daily", "More than 2 hours", "Always"],
//     key: "sunExposure",
//   },
//   {
//     question: "Do you live in a humid climate?",
//     options: ["Yes", "No"],
//     key: "humidity",
//   },
//   {
//     question: "How much water do you drink daily?",
//     options: ["< 1L", "1-2L", "2-3L", "> 3L"],
//     key: "waterIntake",
//   },
// ];

// export default function QuizScreen() {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const router = useRouter();

//   const handleOptionPress = (option: string) => {
//     const key = quizData[currentQuestion].key;
//     setAnswers((prev) => ({ ...prev, [key]: option }));
//   };

//   const handleNext = async () => {
//     if (currentQuestion < quizData.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     } else {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;

//         if (!user) {
//           throw new Error("User not authenticated");
//         }

//         await saveQuizAnswers(user.uid, answers);
//         console.log("Quiz Completed and saved", answers);
//         // router.push("");
//         router.push("/dashboard/dashboard");
//       } catch (error: any) {
//         console.error("Failed to save quiz:", error.message);
//         // Optional: Show a UI alert or toast
//       }
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   const q = quizData[currentQuestion];

//   return (
//     <LinearGradient
//       colors={["#4FC3F7", "#81D4FA", "#E3F2FD"]}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <Animated.View entering={FadeInDown.duration(600)}>
//           <MaterialIcons
//             name="wb-sunny"
//             size={60}
//             color="#FFB300"
//             style={styles.icon}
//           />
//           <Text style={styles.heading}>{q.question}</Text>
//           <Text style={styles.subheading}>
//             Question {currentQuestion + 1} of {quizData.length}
//           </Text>
//         </Animated.View>

//         <View style={styles.progressContainer}>
//           {quizData.map((_, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.progressDot,
//                 index <= currentQuestion
//                   ? styles.activeDot
//                   : styles.inactiveDot,
//               ]}
//             />
//           ))}
//         </View>

//         <View style={styles.optionsContainer}>
//           {q.options.map((option, index) => (
//             <Animated.View
//               key={option}
//               entering={FadeInUp.duration(400).delay(index * 100)}
//             >
//               <Pressable
//                 onPress={() => handleOptionPress(option)}
//                 style={({ pressed }) => [
//                   styles.option,
//                   answers[q.key] === option && styles.selectedOption,
//                   pressed && styles.pressedOption,
//                 ]}
//               >
//                 <View style={styles.optionContent}>
//                   <Text
//                     style={[
//                       styles.optionText,
//                       answers[q.key] === option && styles.selectedOptionText,
//                     ]}
//                   >
//                     {option}
//                   </Text>
//                 </View>
//                 {answers[q.key] === option && (
//                   <MaterialIcons
//                     name="check-circle"
//                     size={24}
//                     color="#4CAF50"
//                   />
//                 )}
//               </Pressable>
//             </Animated.View>
//           ))}
//         </View>

//         <Animated.View
//           entering={FadeInUp.duration(400).delay(q.options.length * 100 + 200)}
//           style={styles.buttonContainer}
//         >
//           <Pressable
//             onPress={handlePrevious}
//             disabled={currentQuestion === 0}
//             style={({ pressed }) => [
//               styles.navButton,
//               currentQuestion === 0 && styles.disabledButton,
//               pressed && currentQuestion > 0 && styles.pressedButton,
//             ]}
//           >
//             <Text style={styles.navButtonText}>Previous</Text>
//           </Pressable>

//           <Pressable
//             onPress={handleNext}
//             style={({ pressed }) => [
//               styles.nextButton,
//               pressed && styles.pressedButton,
//             ]}
//           >
//             <LinearGradient
//               colors={["#4CAF50", "#81C784"]}
//               style={styles.gradientButton}
//             >
//               <Text style={styles.buttonText}>
//                 {currentQuestion === quizData.length - 1 ? "Submit" : "Next"}
//               </Text>
//             </LinearGradient>
//           </Pressable>
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
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 40,
//     paddingHorizontal: 24,
//   },
//   icon: {
//     alignSelf: "center",
//     marginBottom: 16,
//   },
//   heading: {
//     fontSize: 28,
//     fontFamily: "Poppins-Bold",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginBottom: 8,
//     textShadowColor: "rgba(0, 0, 0, 0.2)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//   },
//   subheading: {
//     fontSize: 16,
//     fontFamily: "Poppins-Regular",
//     color: "#E3F2FD",
//     textAlign: "center",
//     marginBottom: 24,
//   },
//   progressContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 24,
//   },
//   progressDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginHorizontal: 4,
//   },
//   activeDot: {
//     backgroundColor: "#4CAF50",
//   },
//   inactiveDot: {
//     backgroundColor: "#B0BEC5",
//   },
//   optionsContainer: {
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   option: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//     padding: 16,
//     borderRadius: 15,
//     backgroundColor: "#FFFFFF",
//     marginVertical: 8,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   selectedOption: {
//     borderWidth: 2,
//     borderColor: "#4CAF50",
//     backgroundColor: "#E8F5E9",
//   },
//   pressedOption: {
//     backgroundColor: "#F5F5F5",
//   },
//   optionContent: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   optionText: {
//     fontSize: 18,
//     fontFamily: "Poppins-SemiBold",
//     color: "#333",
//   },
//   selectedOptionText: {
//     color: "#4CAF50",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     marginTop: 16,
//   },
//   navButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "#4CAF50",
//     backgroundColor: "transparent",
//   },
//   nextButton: {
//     width: 150,
//     borderRadius: 25,
//     overflow: "hidden",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   pressedButton: {
//     transform: [{ scale: 0.95 }],
//   },
//   gradientButton: {
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   buttonText: {
//     fontSize: 18,
//     fontFamily: "Poppins-SemiBold",
//     color: "#FFFFFF",
//   },
//   navButtonText: {
//     fontSize: 16,
//     fontFamily: "Poppins-SemiBold",
//     color: "#4CAF50",
//   },
// });
