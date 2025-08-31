// features/profile/components/SkinTypeSelector.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SkinType } from "@/types/profileTypes";

interface Props {
  selected: SkinType | null;
  onSelect: (type: SkinType) => void;
}

const SKIN_TYPES: SkinType[] = ["Dry", "Oily", "Combination", "Normal", "Sensitive"];

export default function SkinTypeSelector({ selected, onSelect }: Props) {
  return (
    <View className="mt-4">
      <Text className="text-lg font-semibold mb-2">Select Your Skin Type</Text>
      <View className="flex-row flex-wrap gap-2">
        {SKIN_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => onSelect(type)}
            className={`px-4 py-2 rounded-xl border ${
              selected === type ? "bg-blue-500 border-blue-600" : "bg-gray-200 border-gray-400"
            }`}
          >
            <Text className={`${selected === type ? "text-white" : "text-black"}`}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
