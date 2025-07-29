export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female';
  skinType: 'Dry' | 'Oily' | 'Sensitive' | 'Normal';
  climate: 'Sunny' | 'Cold' | 'Rainy' | 'Windy';
}
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
export interface Recommendation {
  title: string;
  description: string;
  products: Product[];
}
