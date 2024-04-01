import { app, database, auth } from './firebaseConfig'; // Ret denne sti til din faktiske konfigurationsfil
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, getAuth } from 'firebase/auth';
import { addDoc, collection, getDocs } from 'firebase/firestore';

// Login funktion
export const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user.uid; 
    } catch (error) {
      throw error;
    }
  };
  
  // Signup funktion
  export const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user.uid; 
    } catch (error) {
      throw error;
    }
  };
  
  // Sign out funktion
  export const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };
  
  // Tilføjer et nyt dokument
  export const addNewDocument = async (userId, text) => {
    try {
      const docRef = await addDoc(collection(database, userId), { text });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };
  
  // Henter dokumenter
  export const fetchDocuments = async (userId) => {
    try {
      const querySnapshot = await getDocs(collection(database, userId));
      const docsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return docsArray;
    } catch (error) {
      throw error;
    }
  };
  
  // Abonnerer på autentifikationsændringer
  export const subscribeToAuthChanges = (handleAuthChange) => {
    const auth_ = getAuth();
    return onAuthStateChanged(auth_, handleAuthChange);
  };