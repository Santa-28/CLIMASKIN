// features/profile/components/WaterIntakeInput.tsx
import React from "react";
import { View, Text, TextInput } from "react-native";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function WaterIntakeInput({ value, onChange }: Props) {
  return (
    <View className="mt-4">
      <Text className="text-lg font-semibold mb-2">Daily Water Intake (Liters)</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="e.g., 2.5"
        keyboardType="numeric"
        className="border border-gray-400 rounded-xl px-4 py-2"
      />
    </View>
  );
}
