import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";
// import TabNavigator from "./TabNavigator"

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />  
    </NavigationContainer>
  );
}
