// src/screens/CameraScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, Dimensions, Modal, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useUser } from "../context/UserContext";
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseconfig';

const API_KEY = "2LJbWFec6fWIyd0vl2AJ2HGPb6LNK3YM";
const API_SECRET = "sKMm97ris1tdCnWfl2--XvdLiJnge9fm";
const API_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CameraScreen() {
  const { setAge, setGender } = useUser();
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [faces, setFaces] = useState<any[]>([]);
  const [photoDims, setPhotoDims] = useState<{ w: number; h: number } | null>(null);
  const [result, setResult] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const captureAndDetect = async () => {
    if (!cameraRef.current) return;
    try {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      setPhotoDims({ w: photo.width, h: photo.height });

      const formData = new FormData();
      formData.append("api_key", API_KEY);
      formData.append("api_secret", API_SECRET);
      formData.append("image_base64", photo.base64 || "");
      formData.append("return_attributes", "age,gender");

      const response = await fetch(API_URL, { method: "POST", body: formData });
      const data = await response.json();

      if (data.faces && data.faces.length > 0) {
        const attributes = data.faces[0].attributes;
        const detected = { age: attributes.age.value, gender: attributes.gender.value };
        setResult(detected);
        setFaces(data.faces.map((f: any) => f.face_rectangle));
        setAge(detected.age);
        setGender(detected.gender);

        // Optionally save to Firestore
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          try {
            await setDoc(doc(db, 'users', user.uid), {
              age: detected.age,
              gender: detected.gender,
            }, { merge: true });
          } catch (error) {
            console.error('Error saving to Firestore:', error);
          }
        }

        setModalVisible(true);
      } else {
        Alert.alert("No Face Detected", "Please try again!");
      }
    } catch (err) {
      console.error("❌ Face++ error:", err);
      Alert.alert("Error", "Face detection failed.");
    } finally {
      setLoading(false);
    }
  };

  const scaleFaceBox = (face: any) => {
    if (!photoDims) return face;
    const scaleX = SCREEN_WIDTH / photoDims.w;
    const scaleY = SCREEN_HEIGHT / photoDims.h;
    return {
      top: face.top * scaleY,
      left: face.left * scaleX,
      width: face.width * scaleX,
      height: face.height * scaleY,
    };
  };

  if (!permission) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission is required</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="front" ref={cameraRef}>
        {faces.map((face, i) => {
          const box = scaleFaceBox(face);
          return <View key={i} style={[styles.faceBox, box]} />;
        })}
      </CameraView>

      <View style={styles.controls}>
        {loading ? <ActivityIndicator size="large" color="blue" /> : <Button title="Detect Age & Gender" onPress={captureAndDetect} />}
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Detection Result</Text>
            {result && (
              <>
                <Text style={styles.modalText}>Age: {result.age}</Text>
                <Text style={styles.modalText}>Gender: {result.gender}</Text>
              </>
            )}
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.push("/onboarding/CombinedOnboarding");
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  controls: { position: "absolute", bottom: 40, alignSelf: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  faceBox: { position: "absolute", borderWidth: 3, borderColor: "limegreen", borderRadius: 6 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: 260, backgroundColor: "#fff", borderRadius: 12, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  modalText: { fontSize: 16, marginBottom: 8 },
  modalButton: { marginTop: 16, backgroundColor: "#007AFF", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 8 },
});
