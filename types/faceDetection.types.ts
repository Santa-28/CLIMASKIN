export interface FaceDetectionResult {
  gender: 'male' | 'female' | 'unknown';
  age: number;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface FaceDetectionState {
  isDetecting: boolean;
  detectedFace: FaceDetectionResult | null;
  error: string | null;
}

export interface CameraPermissionState {
  hasPermission: boolean | null;
  isLoading: boolean;
}

export interface UserProfile {
  gender: 'male' | 'female' | 'unknown';
  age: number;
  skinType: string;
}

