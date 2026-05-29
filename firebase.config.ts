import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSkb1h7UdmPDpaQSuYnkHA21nnm3jZFmc",
  authDomain: "bilyart-e9e21.firebaseapp.com",
  projectId: "bilyart-e9e21",
  storageBucket: "bilyart-e9e21.firebasestorage.app",
  messagingSenderId: "891000829082",
  appId: "1:891000829082:web:d7c92c6e875e809391db23",
  measurementId: "G-S2N4J5MWP9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);