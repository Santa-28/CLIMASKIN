import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { fetchWeather } from '@/services/weatherapi';

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes('clear')) return 'wb-sunny';
  if (desc.includes('cloud')) return 'cloud';
  if (desc.includes('rain') || desc.includes('shower')) return 'umbrella';
  if (desc.includes('thunder')) return 'bolt';
  if (desc.includes('snow')) return 'ac-unit';
  return 'wb-sunny'; // Fallback icon (must be a valid MaterialIcons name)
};

export default function WeatherCard() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Animation for pulsing icon
  const pulse = useSharedValue(1);
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  useEffect(() => {
    // Pulse animation loop
    pulse.value = withRepeat(withTiming(1.1, { duration: 1000 }), -1, true);

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const data = await fetchWeather(location.coords.latitude, location.coords.longitude);
      setWeather(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View entering={FadeInUp.duration(600)} style={animatedIconStyle}>
          <MaterialIcons name="wb-sunny" size={60} color="#FFB300" />
        </Animated.View>
        <Text style={styles.loadingText}>Fetching Weather...</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to fetch weather data</Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.cardContainer}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
        style={styles.card}
      >
        <View style={styles.header}>
          <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
            <MaterialIcons
              name={getWeatherIcon(weather.weather[0].description)}
              size={48}
              color="#FFB300"
            />
          </Animated.View>
          <Animated.Text entering={FadeInUp.duration(400).delay(400)} style={styles.title}>
            Current Weather
          </Animated.Text>
        </View>

        <Animated.View entering={FadeInUp.duration(400).delay(600)} style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-pin" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Location: {weather.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="thermostat" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Temperature: {weather.main.temp}°C</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="water-drop" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Humidity: {weather.main.humidity}%</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="cloud" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>
              Condition: {weather.weather[0].description}
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 24,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#D32F2F',
    textAlign: 'center',
  },
  cardContainer: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  card: {
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent for glassmorphism
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  infoContainer: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    marginLeft: 8,
  },
});