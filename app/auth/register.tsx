import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { InputField } from '../../components/ui/InputField';
import { registerUser } from '../../services/auth';
import { useRouter } from 'expo-router';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const user = await registerUser(email, password);
      if (user) {
        Alert.alert('Success', 'Registration successful!');
        router.push('/auth/login');
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  const handleGoogleRegister = () => {
    // TODO: Implement Google sign-up
    Alert.alert('Info', 'Google sign-up coming soon!');
  };

  const handleFacebookRegister = () => {
    // TODO: Implement Facebook sign-up
    Alert.alert('Info', 'Facebook sign-up coming soon!');
  };

  return (
    <LinearGradient
      colors={['#4FC3F7', '#81D4FA', '#E3F2FD']}
      style={styles.container}
    >
      <Text style={styles.heading}>Join ClimaSkin!</Text>
      <Text style={styles.subheading}>Create your account</Text>

      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        icon={<MaterialIcons name="email" size={24} color="#666" />}
      />
      <InputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
        icon={<MaterialIcons name="lock" size={24} color="#666" />}
      />
      <InputField
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirm your password"
        icon={<MaterialIcons name="lock" size={24} color="#666" />}
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? '#43A047' : '#4CAF50' },
        ]}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>

      <Text style={styles.orText}>Or register with</Text>

      <Pressable
        style={({ pressed }) => [
          styles.socialButton,
          { backgroundColor: pressed ? '#D32F2F' : '#E53935' },
        ]}
        onPress={handleGoogleRegister}
      >
        <FontAwesome name="google" size={24} color="#FFF" />
        <Text style={styles.socialButtonText}>Google</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.socialButton,
          { backgroundColor: pressed ? '#1565C0' : '#1976D2' },
        ]}
        onPress={handleFacebookRegister}
      >
        <MaterialIcons name="facebook" size={24} color="#FFF" />
        <Text style={styles.socialButtonText}>Facebook</Text>
      </Pressable>
    </LinearGradient>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#E3F2FD',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
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
  orText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 8,
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
