import { UserProfile } from '../types/faceDetection.types';

export interface ProductRecommendation {
  id: string;
  name: string;
  description: string;
  category: string;
  ageGroup: string;
  gender: string;
  skinType: string;
  confidence: number;
}

export class RecommendationEngine {
  static getRecommendations(userProfile: UserProfile): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];
    
    // Age-based recommendations
    const ageGroup = this.getAgeGroup(userProfile.age);
    
    // Gender-based recommendations
    const gender = userProfile.gender;
    
    // Skin type-based recommendations
    const skinType = userProfile.skinType;
    
    // Generate recommendations based on user profile
    const baseRecommendations = [
      {
        id: '1',
        name: 'Hydrating Moisturizer',
        description: 'Perfect for daily hydration and skin protection',
        category: 'Moisturizer',
        ageGroup,
        gender,
        skinType,
        confidence: 0.9,
      },
      {
        id: '2',
        name: 'SPF 50 Sunscreen',
        description: 'Essential daily protection against UV rays',
        category: 'Sunscreen',
        ageGroup,
        gender,
        skinType,
        confidence: 0.95,
      },
      {
        id: '3',
        name: 'Vitamin C Serum',
        description: 'Brightening and anti-aging benefits',
        category: 'Serum',
        ageGroup,
        gender,
        skinType,
        confidence: 0.85,
      },
    ];
    
    return baseRecommendations.filter(rec => 
      rec.ageGroup === ageGroup && 
      (rec.gender === gender || rec.gender === 'unknown') &&
      rec.skinType === skinType
    );
  }

  private static getAgeGroup(age: number): string {
    if (age < 25) return '18-25';
    if (age < 35) return '25-35';
    if (age < 45) return '35-45';
    if (age < 55) return '45-55';
    return '55+';
  }
}
