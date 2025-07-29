// config/firebaseconfig.ts
// ✅ Firebase Configuration for React Native App

import { initializeApp } from 'firebase/app';
import { getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// ✅ Firebase Config

const firebaseConfig = {
  apiKey: "AIzaSyAMC-uThsOO5fKq52EzL1W0_gCTOOEPqHs",
  authDomain: "climaskin-44d8e.firebaseapp.com",
  projectId: "climaskin-44d8e",
  storageBucket: "climaskin-44d8e.appspot.com", // ❗️Fix: 'firebasestorage.app' ➝ 'appspot.com'
  messagingSenderId: "645622999631",
  appId: "1:645622999631:web:a009d5c2e07ca2fd20583a"
};

// ✅ Initialize Firebase

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Export Firebase Auth instance
export const auth = getAuth(app);
// ✅ Export Firestore instance
export const db = getFirestore(app);
