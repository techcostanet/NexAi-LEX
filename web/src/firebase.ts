import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Configuração do Google Firebase / Cloud Firestore
// Os valores podem ser carregados via variáveis de ambiente Vite (VITE_FIREBASE_...)
// ou utilizar o projeto padrão NexAi-LEX na nuvem Google.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForGoogleCloudLexSaaS2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nexai-lex.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nexai-lex",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nexai-lex.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "23616077470",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:23616077470:web:nexai-lex-web-2026"
};

// Inicialização segura de única instância
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db: Firestore = getFirestore(app);

export default app;
