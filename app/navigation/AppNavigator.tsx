import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/app/auth/login";
import RegisterScreen from "@/app/auth/register";
import CameraScreen from "@/app/camera/CameraScreen";
import Home from "@/app/dashboard/Home";
// import ProfileSetupScreen from "@/app/profile/Userprofile";
// import RecommendationScreen from "../screens/RecommendationScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Camera: undefined;
  Home: undefined;
  Profile: undefined;
  Recommendation: { age: number; gender: string; skinType: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Camera" component={CameraScreen} options={{ title: "Face Detection" }}  />
      <Stack.Screen name="Home" component={Home} options={{headerShown: false }} />
      {/* <Stack.Screen name="Profile" component={ProfileSetupScreen} options={{ title: "User Profile" }} /> */}
    </Stack.Navigator>
  );
}
