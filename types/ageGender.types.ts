export interface AgeGenderPrediction {
  gender: 'male' | 'female' | 'unknown';
  age: number;
  confidence: number;
}

export interface RealTimeDetectionResult {
  faceDetected: boolean;
  predictions: AgeGenderPrediction | null;
  processingTime: number;
}

export interface UserDemographics {
  gender: 'male' | 'female' | 'unknown';
  age: number;
  ageGroup: 'teens' | 'twenties' | 'thirties' | 'forties' | 'fifties' | 'sixties' | 'senior';
  skinType: string;
}

export interface DetectionConfig {
  enableRealTime: boolean;
  detectionInterval: number;
  confidenceThreshold: number;
}
