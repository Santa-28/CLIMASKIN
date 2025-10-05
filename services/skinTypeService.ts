// import axios from 'axios';

// const API_URL = 'https://serverless.roboflow.com/skin-type-tgow5/1';
// const API_KEY = 'JFfjlaDDlbFKWcAGYBy3';

// export interface SkinTypeResponse {
//   predictions: Record<string, { confidence: number }>;
// }

// export async function classifySkinType(imageBase64: string): Promise<SkinTypeResponse> {
//   try {
//     const response = await axios.post(
//       API_URL,
//       new URLSearchParams({ image: imageBase64 }).toString(),
//       {
//         params: { api_key: API_KEY },
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       }
//     );
//     return response.data as SkinTypeResponse;
//   } catch (error) {
//     console.error('Error classifying skin type:', error);
//     throw error;
//   }
// }
