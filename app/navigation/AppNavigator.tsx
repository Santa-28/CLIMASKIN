import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/app/auth/login";
import RegisterScreen from "@/app/auth/register";
import CameraScreen from "@/app/camera/CameraScreen";
import SkinTypeScreen from "@/app/skinType/SkinTypeScreen";


export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Camera: undefined;
  Home: undefined;
  SkinType: undefined;
  Profile: undefined;
  Recommendation: { age: number; gender: string; skinType: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }}  />
      <Stack.Screen name="SkinType" component={SkinTypeScreen} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}
