// services/feedbackService.ts
import { db } from '../config/firebaseconfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const saveFeedback = async (userId: string, rating: number, text: string) => {
  try {
    await addDoc(collection(db, 'feedback'), {
      userId,
      rating,
      text,
      submittedAt: Timestamp.now(),
    });
    console.log('Feedback saved successfully');
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
};
