// Importer nødvendige Firebase moduler
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyClmwnUppm7Y2An1SNNsG4OXsX8kgVlI9Q",

  authDomain: "userauthenticationdemo-79887.firebaseapp.com",

  projectId: "userauthenticationdemo-79887",

  storageBucket: "userauthenticationdemo-79887.appspot.com",

  messagingSenderId: "871397763524",

  appId: "1:871397763524:web:8a1b9f4da23a118c621c91"

};


// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore
const database = getFirestore(app);


// Initialiser Firebase Auth baseret på platform
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export { app, database, auth };