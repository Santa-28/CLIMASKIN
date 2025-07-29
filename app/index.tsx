// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#4FC3F7', '#81D4FA', '#E3F2FD']}
      style={styles.container}
    >
      <View style={styles.content}>
        <MaterialIcons name="wb-sunny" size={80} color="#FFB300" />
        <Text style={styles.title}>Welcome to ClimaSkin</Text>
        <Text style={styles.subtitle}>Predict weather, protect your skin!</Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#43A047' : '#4CAF50' },
          ]}
          onPress={() => router.push('../auth/login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#1976D2' : '#2196F3' },
          ]}
          onPress={() => router.push('/auth/register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#E3F2FD',
    marginBottom: 32,
  },
  button: {
    width: 200,
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});