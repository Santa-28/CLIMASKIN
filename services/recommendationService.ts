// import { UserDemographics } from '../types/ageGender.types';

// export interface ProductRecommendation {
//   id: string;
//   name: string;
//   category: string;
//   brand: string;
//   price: number;
//   rating: number;
//   imageUrl: string;
//   description: string;
//   ingredients: string[];
//   suitableFor: {
//     genders: string[];
//     ageGroups: string[];
//     skinTypes: string[];
//   };
//   usageInstructions: string[];
//   benefits: string[];
// }

// export class RecommendationService {
//   private productDatabase: ProductRecommendation[] = [];

//   constructor() {
//     this.initializeProductDatabase();
//   }

//   private initializeProductDatabase() {
//     this.productDatabase = [
//       // Skincare products organized by demographics
//       {
//         id: '1',
//         name: 'Gentle Hydrating Cleanser',
//         category: 'cleanser',
//         brand: 'DermCare',
//         price: 24.99,
//         rating: 4.5,
//         imageUrl: '/products/cleanser1.jpg',
//         description: 'Gentle daily cleanser suitable for sensitive skin',
//         ingredients: ['Hyaluronic Acid', 'Ceramides', 'Glycerin'],
//         suitableFor: {
//           genders: ['male', 'female'],
//           ageGroups: ['teens', 'twenties', 'thirties', 'forties'],
//           skinTypes: ['dry', 'sensitive', 'normal']
//         },
//         usageInstructions: ['Use morning and night', 'Massage gently', 'Rinse with lukewarm water'],
//         benefits: ['Hydrates skin', 'Removes impurities', 'Maintains skin barrier']
//       },
//       {
//         id: '2',
//         name: 'Anti-Aging Retinol Serum',
//         category: 'serum',
//         brand: 'AgeDefy',
//         price: 45.99,
//         rating: 4.7,
//         imageUrl: '/products/serum1.jpg',
//         description: 'Powerful anti-aging serum with encapsulated retinol',
//         ingredients: ['Retinol', 'Niacinamide', 'Peptides'],
//         suitableFor: {
//           genders: ['male', 'female'],
//           ageGroups: ['thirties', 'forties', 'fifties', 'sixties', 'senior'],
//           skinTypes: ['normal', 'combination', 'oily']
//         },
//         usageInstructions: ['Apply at night', 'Start with 2-3 times per week', 'Always use SPF during day'],
//         benefits: ['Reduces fine lines', 'Improves skin texture', 'Boosts collagen production']
//       },
//       {
//         id: '3',
//         name: 'Oil-Control Mattifying Moisturizer',
//         category: 'moisturizer',
//         brand: 'ClearSkin',
//         price: 28.99,
//         rating: 4.3,
//         imageUrl: '/products/moisturizer1.jpg',
//         description: 'Lightweight moisturizer for oily and acne-prone skin',
//         ingredients: ['Salicylic Acid', 'Niacinamide', 'Zinc PCA'],
//         suitableFor: {
//           genders: ['male', 'female'],
//           ageGroups: ['teens', 'twenties', 'thirties'],
//           skinTypes: ['oily', 'combination', 'acne-prone']
//         },
//         usageInstructions: ['Apply twice daily', 'Use after cleansing', 'Avoid eye area'],
//         benefits: ['Controls oil production', 'Prevents breakouts', 'Provides hydration without greasiness']
//       },
//       {
//         id: '4',
//         name: 'Brightening Vitamin C Serum',
//         category: 'serum',
//         brand: 'GlowLab',
//         price: 38.99,
//         rating: 4.6,
//         imageUrl: '/products/vitaminc1.jpg',
//         description: 'High-potency vitamin C serum for brightening and even skin tone',
//         ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Ferulic Acid'],
//         suitableFor: {
//           genders: ['male', 'female'],
//           ageGroups: ['twenties', 'thirties', 'forties', 'fifties'],
//           skinTypes: ['all', 'dull', 'uneven']
//         },
//         usageInstructions: ['Apply in morning', 'Use after cleansing', 'Follow with moisturizer'],
//         benefits: ['Brightens complexion', 'Fades dark spots', 'Provides antioxidant protection']
//       },
//       {
//         id: '5',
//         name: 'Gentle Exfoliating Toner',
//         category: 'toner',
//         brand: 'PureSkin',
//         price: 22.99,
//         rating: 4.4,
//         imageUrl: '/products/toner1.jpg',
//         description: 'Alcohol-free toner with AHA/BHA for gentle exfoliation',
//         ingredients: ['Glycolic Acid', 'Lactic Acid', 'Witch Hazel'],
//         suitableFor: {
//           genders: ['male', 'female'],
//           ageGroups: ['teens', 'twenties', 'thirties', 'forties'],
//           skinTypes: ['normal', 'combination', 'oily']
//         },
//         usageInstructions: ['Apply after cleansing', 'Use 2-3 times per week', 'Avoid sensitive areas'],
//         benefits: ['Removes dead skin cells', 'Unclogs pores', 'Improves skin texture']
//       }
//     ];
//   }

//   getPersonalizedRecommendations(userProfile: UserDemographics): ProductRecommendation[] {
//     const recommendations = this.productDatabase.filter(product => 
//       this.isProductSuitable(product, userProfile)
//     );

//     // Sort by relevance score
//     return this.sortByRelevance(recommendations, userProfile);
//   }

//   private isProductSuitable(product: ProductRecommendation, userProfile: UserDemographics): boolean {
//     return (
//       product.suitableFor.genders.includes(userProfile.gender) &&
//       product.suitableFor.ageGroups.includes(userProfile.ageGroup) &&
//       product.suitableFor.skinTypes.includes(userProfile.skinType)
//     );
//   }

//   private sortByRelevance(products: ProductRecommendation[], userProfile: UserDemographics): ProductRecommendation[] {
//     return products.sort((a, b) => {
//       // Priority based on age group
//       const ageRelevance = this.calculateAgeRelevance(a, userProfile.ageGroup);
//       const skinTypeRelevance = this.calculateSkinTypeRelevance(a, userProfile.skinType);
      
//       return (ageRelevance + skinTypeRelevance) - (this.calculateAgeRelevance(b, userProfile.ageGroup) + this.calculateSkinTypeRelevance(b, userProfile.skinType));
//     });
//   }

//   private calculateAgeRelevance(product: ProductRecommendation, ageGroup: string): number {
//     const ageIndex = product.suitableFor.ageGroups.indexOf(ageGroup);
//     return ageIndex !== -1 ? product.suitableFor.ageGroups.length - ageIndex : 0;
//   }

//   private calculateSkinTypeRelevance(product: ProductRecommendation, skinType: string): number {
//     return product.suitableFor.skinTypes.includes(skinType) ? 2 : 0;
//   }

//   getRoutineRecommendations(userProfile: UserDemographics): {
//     morning: ProductRecommendation[];
//     evening: ProductRecommendation[];
//   } {
//     const allRecommendations = this.getPersonalizedRecommendations(userProfile);
    
//     return {
//       morning: allRecommendations.filter(p => 
//         ['cleanser', 'toner', 'moisturizer', 'sunscreen'].includes(p.category)
//       ),
//       evening: allRecommendations.filter(p => 
//         ['cleanser', 'serum', 'moisturizer'].includes(p.category)
//       )
//     };
//   }
// }
