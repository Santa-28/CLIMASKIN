import React, { useState } from "react";
import { View, Text, Button, Image, ActivityIndicator, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

// Define the response structure from Roboflow
interface PredictionResponse {
  predictions: {
    [key: string]: {
      class_id: number;
      confidence: number;
    };
  };
}

export default function SkinTypeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick image from gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets[0].base64) {
      setImageUri(pickerResult.assets[0].uri);
      classifySkinType(pickerResult.assets[0].base64);
    }
  };

  // Send image to Roboflow API
  const classifySkinType = async (base64Image: string) => {
    try {
      setLoading(true);
      setPrediction(null);

      const response = await axios.post<PredictionResponse>(
        "https://serverless.roboflow.com/skin-type-tgow5/1",
        base64Image,
        {
          params: { api_key: "JFfjlaDDlbFKWcAGYBy3" }, // replace with your API key
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log("Full Response:", response.data);

      // Extract highest confidence class
      const predictions = response.data.predictions;
      let bestClass = "";
      let bestConfidence = 0;

      for (const [label, info] of Object.entries(predictions)) {
        const confidence = info.confidence;
        if (confidence > bestConfidence) {
          bestClass = label;
          bestConfidence = confidence;
        }
      }

      setPrediction(`${bestClass} (${(bestConfidence * 100).toFixed(2)}%)`);
    } catch (error: any) {
      console.error("Error:", error.message);
      alert("Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick Image & Predict" onPress={pickImage} />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />}

      {prediction && (
        <Text style={styles.predictionText}>
          Predicted Skin Type: {prediction}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  imagePreview: { width: 200, height: 200, marginTop: 20, borderRadius: 10 },
  predictionText: { marginTop: 20, fontSize: 18, fontWeight: "600" },
});

