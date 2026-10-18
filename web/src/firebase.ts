import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Configuração oficial do Google Firebase / Cloud Firestore
// Vinculado ao App Web 'NexAi-LEX' (App ID: 1:23616077470:web:e4b60ba65eb1ea9838858f)
// e Banco de Dados Cloud Firestore no projeto oficial 'nexai-lex'.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA0gsfxXdMYZHo0ZXPHScd1uhBKTp_9ZPc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nexai-lex.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nexai-lex",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nexai-lex.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "23616077470",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:23616077470:web:e4b60ba65eb1ea9838858f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SC4QK8T0VX"
};

// Inicialização segura de única instância do Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Instância oficial do Cloud Firestore
export const db: Firestore = getFirestore(app);

// Instância oficial do Firebase Authentication
export const auth: Auth = getAuth(app);

export default app;

