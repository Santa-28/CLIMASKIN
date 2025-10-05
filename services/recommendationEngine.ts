import { UserProfile } from '../types/faceDetection.types';
import { Product, products } from '../constants/product';

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  main: string; // e.g., 'Clear', 'Clouds', 'Rain'
}

export interface ProductRecommendation {
  id: string;
  name: string;
  description: string;
  category: string;
  ageGroup: string;
  gender: string;
  skinType: string;
  confidence: number;
  weatherReason?: string;
  skinTypeReason?: string;
}

export class RecommendationEngine {
  static getRecommendations(
    userProfile: UserProfile,
    weatherData?: WeatherData,
    selectedCategory?: string
  ): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];

    // Age-based recommendations
    const ageGroup = this.getAgeGroup(userProfile.age);

    // Gender-based recommendations
    const gender = userProfile.gender;

    // Skin type-based recommendations
    const skinType = userProfile.skinType;

    // Weather-based recommendations
    const weatherCondition = this.getWeatherCondition(weatherData);

    // Filter products based on criteria
    let filteredProducts = products.filter(product => {
      // Filter by skin type compatibility
      const skinTypeMatch = product.suitableFor.includes('All Skin Types') ||
                           product.suitableFor.some(skin => skin.includes(skinType));

      // Filter by weather compatibility if weather data is available
      let weatherMatch = true;
      if (weatherData && product.weatherCompatibility) {
        weatherMatch = this.isWeatherCompatible(product, weatherCondition);
      }

      // Filter by selected category if specified
      const categoryMatch = !selectedCategory || product.type === selectedCategory;

      return skinTypeMatch && weatherMatch && categoryMatch;
    });

    // Convert products to recommendations with confidence scoring
    filteredProducts.forEach(product => {
      const confidence = this.calculateConfidence(product, userProfile, weatherData, weatherCondition);
      const reasons = this.getRecommendationReasons(product, weatherCondition, skinType);

      recommendations.push({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.type,
        ageGroup,
        gender,
        skinType,
        confidence,
        weatherReason: reasons.weatherReason,
        skinTypeReason: reasons.skinTypeReason,
      });
    });

    // Sort by confidence score (highest first)
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  private static getWeatherCondition(weatherData?: WeatherData): string {
    if (!weatherData) return 'normal';

    const temp = weatherData.temperature;
    const humidity = weatherData.humidity;
    const main = weatherData.main.toLowerCase();

    if (main.includes('rain') || main.includes('snow')) return 'wet';
    if (temp > 30) return 'hot';
    if (temp < 10) return 'cold';
    if (humidity > 70) return 'humid';
    if (humidity < 30) return 'dry';

    return 'normal';
  }

  private static isWeatherCompatible(product: Product, weatherCondition: string): boolean {
    if (!product.weatherCompatibility) return true;

    switch (weatherCondition) {
      case 'hot':
        return product.weatherCompatibility.hot === true;
      case 'cold':
        return product.weatherCompatibility.cold === true;
      case 'humid':
        return product.weatherCompatibility.humid === true;
      case 'dry':
        return product.weatherCompatibility.dry === true;
      case 'wet':
        return product.weatherCompatibility.humid === true; // Wet weather is similar to humid
      default:
        return true;
    }
  }

  private static calculateConfidence(
    product: Product,
    userProfile: UserProfile,
    weatherData?: WeatherData,
    weatherCondition?: string
  ): number {
    let confidence = 0.5; // Base confidence

    // Skin type compatibility (40% weight)
    if (product.suitableFor.includes('All Skin Types')) {
      confidence += 0.4;
    } else if (product.suitableFor.some(skin => skin.includes(userProfile.skinType))) {
      confidence += 0.3;
    }

    // Weather compatibility (30% weight)
    if (weatherData && product.weatherCompatibility && weatherCondition) {
      if (this.isWeatherCompatible(product, weatherCondition)) {
        confidence += 0.3;
      }
    }

    // Age appropriateness (20% weight)
    const ageGroup = this.getAgeGroup(userProfile.age);
    // Add age-based scoring logic here if needed

    // Product type preference (10% weight)
    // Add logic based on user's routine preferences if available

    return Math.min(confidence, 1.0); // Cap at 1.0
  }

  private static getRecommendationReasons(
    product: Product,
    weatherCondition: string,
    skinType: string
  ): { weatherReason?: string; skinTypeReason?: string } {
    const reasons: { weatherReason?: string; skinTypeReason?: string } = {};

    // Weather-based reason
    if (product.weatherCompatibility) {
      switch (weatherCondition) {
        case 'hot':
          if (product.weatherCompatibility.hot) {
            reasons.weatherReason = `Perfect for hot weather - ${product.type.toLowerCase()} helps maintain skin balance`;
          }
          break;
        case 'cold':
          if (product.weatherCompatibility.cold) {
            reasons.weatherReason = `Ideal for cold weather - provides necessary protection and hydration`;
          }
          break;
        case 'humid':
          if (product.weatherCompatibility.humid) {
            reasons.weatherReason = `Great for humid conditions - helps control excess moisture`;
          }
          break;
        case 'dry':
          if (product.weatherCompatibility.dry) {
            reasons.weatherReason = `Excellent for dry weather - provides essential moisture barrier`;
          }
          break;
      }
    }

    // Skin type reason
    if (product.suitableFor.includes('All Skin Types')) {
      reasons.skinTypeReason = `Suitable for all skin types including ${skinType}`;
    } else {
      const suitableTypes = product.suitableFor.filter(type => type !== 'All Skin Types');
      reasons.skinTypeReason = `Specifically formulated for ${suitableTypes.join(', ')} skin`;
    }

    return reasons;
  }

  private static getAgeGroup(age: number): string {
    if (age < 25) return '18-25';
    if (age < 35) return '25-35';
    if (age < 45) return '35-45';
    if (age < 55) return '45-55';
    return '55+';
  }
}
