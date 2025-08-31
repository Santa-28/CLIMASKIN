// features/profile/services/profileService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "../types/profileTypes";

const PROFILE_KEY = "user_profile";

export async function saveProfile(profile: UserProfile) {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function getProfile(): Promise<UserProfile | null> {
  const data = await AsyncStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}
