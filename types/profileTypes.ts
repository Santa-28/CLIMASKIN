// features/profile/types/profileTypes.ts

export type SkinType = 'Dry' | 'Oily' | 'Combination' | 'Normal' | 'Sensitive';

export interface UserProfile {
  name?: string;
  age?: number;
  gender?: string;
  skinType: SkinType;
  waterIntake: number; // liters/day
}
