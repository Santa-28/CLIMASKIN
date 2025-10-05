import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useUser } from '../../app/context/UserContext';
import { WeatherData } from '../../services/recommendationEngine';

interface ProductReminderProps {
  weatherData?: WeatherData;
}

interface ReminderItem {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  type: 'weather' | 'routine' | 'skincare';
}

export default function ProductReminder({ weatherData }: ProductReminderProps) {
  const { skinType, waterIntake, routinePreferences } = useUser();
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [showReminders, setShowReminders] = useState(true);

  // Animation for pulsing notification icon
  const pulse = useSharedValue(1);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  useEffect(() => {
    // Start pulsing animation
    pulse.value = withRepeat(
      withTiming(1.2, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const generateReminders = () => {
    const newReminders: ReminderItem[] = [];

    // Weather-based reminders
    if (weatherData) {
      const temp = weatherData.temperature;
      const humidity = weatherData.humidity;
      const main = weatherData.main.toLowerCase();

      if (temp > 30) {
        newReminders.push({
          id: 'sunscreen-hot',
          title: 'Sun Protection Alert!',
          message: 'High temperature detected! Don\'t forget to apply sunscreen before going out.',
          time: 'Now',
          icon: 'wb-sunny',
          type: 'weather',
        });
      }

      if (humidity > 70) {
        newReminders.push({
          id: 'oil-control-humid',
          title: 'Humidity Care',
          message: 'High humidity can cause excess oil. Consider using oil-control products.',
          time: 'Daily',
          icon: 'opacity',
          type: 'weather',
        });
      }

      if (temp < 10) {
        newReminders.push({
          id: 'moisturize-cold',
          title: 'Cold Weather Care',
          message: 'Cold weather can dry out your skin. Apply extra moisturizer today.',
          time: 'Morning',
          icon: 'ac-unit',
          type: 'weather',
        });
      }
    }

    // Skin type based reminders
    if (skinType) {
      switch (skinType.toLowerCase()) {
        case 'dry':
          newReminders.push({
            id: 'hydrate-dry-skin',
            title: 'Hydration Reminder',
            message: 'Your dry skin needs extra hydration. Apply moisturizer 2-3 times daily.',
            time: '3x Daily',
            icon: 'water-drop',
            type: 'skincare',
          });
          break;
        case 'oily':
          newReminders.push({
            id: 'cleanse-oily-skin',
            title: 'Cleansing Reminder',
            message: 'Cleanse your face twice daily to control excess oil production.',
            time: '2x Daily',
            icon: 'soap',
            type: 'skincare',
          });
          break;
        case 'combination':
          newReminders.push({
            id: 'balance-combination',
            title: 'Skin Balance',
            message: 'Use different products for T-zone and dry areas of your combination skin.',
            time: 'Daily',
            icon: 'balance',
            type: 'skincare',
          });
          break;
      }
    }

    // Water intake reminder
    if (waterIntake && waterIntake < 8) {
      newReminders.push({
        id: 'water-intake',
        title: 'Stay Hydrated!',
        message: `You've set ${waterIntake} cups as your goal. Remember to drink water throughout the day!`,
        time: 'Every 2 hours',
        icon: 'local-drink',
        type: 'routine',
      });
    }

    // Routine preference reminder
    if (routinePreferences) {
      newReminders.push({
        id: 'routine-preference',
        title: 'Your Routine',
        message: `Stick to your ${routinePreferences} routine for best results.`,
        time: 'Daily',
        icon: 'schedule',
        type: 'routine',
      });
    }

    setReminders(newReminders.slice(0, 3)); // Limit to 3 reminders
  };

  useEffect(() => {
    generateReminders();
  }, [skinType, waterIntake, routinePreferences, weatherData]);

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return 'wb-sunny';
      case 'skincare':
        return 'spa';
      case 'routine':
        return 'schedule';
      default:
        return 'notifications';
    }
  };

  const getReminderColor = (type: string) => {
    switch (type) {
      case 'weather':
        return '#FFB300';
      case 'skincare':
        return '#4CAF50';
      case 'routine':
        return '#9C27B0';
      default:
        return '#4FC3F7';
    }
  };

  const dismissReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const dismissAllReminders = () => {
    Alert.alert(
      'Dismiss All',
      'Are you sure you want to dismiss all reminders?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dismiss All',
          onPress: () => setReminders([]),
          style: 'destructive'
        }
      ]
    );
  };

  if (reminders.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeInUp.duration(800)} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Animated.View style={[styles.notificationIcon, animatedIconStyle]}>
            <MaterialIcons name="notifications-active" size={24} color="#FF5722" />
          </Animated.View>
          <Text style={styles.title}>Personal Reminders</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowReminders(!showReminders)}
          style={styles.toggleButton}
        >
          <MaterialIcons
            name={showReminders ? "expand-less" : "expand-more"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {showReminders && (
        <Animated.View entering={FadeInUp.duration(400)}>
          {reminders.map((reminder, index) => (
            <Animated.View
              key={reminder.id}
              entering={FadeInUp.duration(400).delay(index * 100)}
              style={styles.reminderItem}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                style={styles.reminderGradient}
              >
                <View style={styles.reminderHeader}>
                  <View style={styles.reminderIconContainer}>
                    <MaterialIcons
                      name={getReminderIcon(reminder.type) as any}
                      size={20}
                      color={getReminderColor(reminder.type)}
                    />
                  </View>
                  <View style={styles.reminderContent}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <Text style={styles.reminderMessage}>{reminder.message}</Text>
                    <View style={styles.reminderFooter}>
                      <MaterialIcons name="schedule" size={14} color="#666" />
                      <Text style={styles.reminderTime}>{reminder.time}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => dismissReminder(reminder.id)}
                    style={styles.dismissButton}
                  >
                    <MaterialIcons name="close" size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}

          {reminders.length > 1 && (
            <TouchableOpacity
              onPress={dismissAllReminders}
              style={styles.dismissAllButton}
            >
              <Text style={styles.dismissAllText}>Dismiss All</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
  },
  toggleButton: {
    padding: 4,
  },
  reminderItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  reminderGradient: {
    borderRadius: 16,
  },
  reminderHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  reminderIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  reminderMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  reminderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTime: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#999999',
    marginLeft: 4,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  dismissAllButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    marginTop: 8,
  },
  dismissAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
  },
});
