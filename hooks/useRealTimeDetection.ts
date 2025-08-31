// import { Camera } from 'expo-camera';
// import { useEffect, useRef, useState } from 'react';
// import { AgeGenderService } from '../services/ageGenderService';
// import { UserDemographics } from '../src/face-detection/services/types/ageGender.types';

// export const useRealTimeDetection = () => {
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [detectedData, setDetectedData] = useState<UserDemographics | null>(null);
//   const [error, setError] = useState<string | null>(null);
  
//   const ageGenderService = useRef(new AgeGenderService()).current;

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   useEffect(() => {
//     if (hasPermission && !isDetecting) {
//       startRealTimeDetection();
//     }
//   }, [hasPermission]);

//   const startRealTimeDetection = async () => {
//     if (!hasPermission) {
//       setError('Camera permission not granted');
//       return;
//     }

//     setIsDetecting(true);
//     setError(null);

//     // Simulate real-time detection
//     const detectionInterval = setInterval(async () => {
//       try {
//         const mockFaceData = {
//           brightness: 0.8,
//           sharpness: 0.9,
//           size: 0.7
//         };

//         const prediction = await ageGenderService.detectAgeAndGender(mockFaceData);
        
//         if (prediction.confidence > 0.7) {
//           const demographics: UserDemographics = {
//             gender: prediction.gender,
//             age: prediction.age,
//             ageGroup: categorizeAgeGroup(prediction.age),
//             skinType: 'normal'
//           };

//           setDetectedData(demographics);
//           setIsDetecting(false);
//           clearInterval(detectionInterval);
//         }
//       } catch (error) {
//         setError(error instanceof Error ? error.message : 'Detection failed');
//         setIsDetecting(false);
//         clearInterval(detectionInterval);
//       }
//     }, 2000);

//     return () => clearInterval(detectionInterval);
//   };

//   const stopDetection = () => {
//     setIsDetecting(false);
//   };

//   const categorizeAgeGroup = (age: number): UserDemographics['ageGroup'] => {
//     if (age < 20) return 'teens';
//     if (age < 30) return 'twenties';
//     if (age < 40) return 'thirties';
//     if (age < 50) return 'forties';
//     if (age < 60) return 'fifties';
//     if (age < 70) return 'sixties';
//     return 'senior';
//   };

//   return {
//     hasPermission,
//     isDetecting,
//     detectedData,
//     error,
//     startDetection,
//     stopDetection
//   };
// };
