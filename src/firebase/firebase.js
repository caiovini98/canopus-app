import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPZQvPg1twcLJVDOLTT0dVviHY8LWcEG4",
  authDomain: "canopus-desafio.firebaseapp.com",
  projectId: "canopus-desafio",
  storageBucket: "canopus-desafio.appspot.com",
  messagingSenderId: "195800039598",
  appId: "1:195800039598:web:2056821df20a3db0976d3f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
