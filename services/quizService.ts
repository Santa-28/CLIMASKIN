// services/quizService.ts
import { db } from '../config/firebaseconfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const saveQuizAnswers = async (userId: string, answers: Record<string, string>) => {
  try {
    await addDoc(collection(db, 'quizResponses'), {
      userId,
      answers,
      submittedAt: Timestamp.now(),
    });
    console.log('Quiz saved successfully');
  } catch (error) {
    console.error('Error saving quiz:', error);
  }
};
