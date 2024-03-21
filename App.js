import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { app, database, auth } from './firebase/firebaseConfig'
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, signOut } from 'firebase/auth'


export default function App() {
  const [enteredEmail, setEnteredEmail] = useState("mathias@test.dk");
  const [enteredPassword, setEnteredPassword] = useState("123456");
  const [userId, setUserId] = useState(null);
  const [enteredText, setEnteredText] = useState("");
  const [documents, setDocuments] = useState([])
 

  useEffect(() => {
    
    const auth_ = getAuth()
    const unsubcribe = onAuthStateChanged(auth_, (currentUser) => {
      if(currentUser) {
        setUserId(currentUser.uid)
        fetchDocuments()
      } else {
        setUserId(null)
      }
    })
    return () => unsubcribe() //kaldes når componenten unmountes
  }, [])


  
  

  async function addDocument() {
    if (!enteredText.trim()) {
      alert("Teksten kan ikke være tom!")
      console.log("Teksten kan ikke være tom.");
      return; // Afslutter funktionen tidligt, hvis betingelsen er sand
    }
    try {
      // Tilføjer dokumentet til Firestore og gemmer referencen
      const docRef = await addDoc(collection(database, userId), {
        text: enteredText
      });
      
      // Opdaterer local state med det nye dokument
      // Bemærk, at vi bruger docRef.id til at få ID'et for det tilføjede dokument
      setDocuments(prevDocuments => [...prevDocuments, { id: docRef.id, text: enteredText }]);
      
      // Nulstil indtastningsfeltet, hvis det ønskes
      setEnteredText("");
    } catch (error) {
      console.log("error addDocument " + error);
    }
  }

  async function fetchDocuments() {
    if (userId) {
      const querySnapshot = await getDocs(collection(database, userId));
      const docsArray = [];
      querySnapshot.forEach((doc) => {
        docsArray.push({ id: doc.id, ...doc.data() });
      });
      setDocuments(docsArray);
    }
  }

  async function login() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);
      setUserId(userCredential.user.uid); 
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  async function signup() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword);
      setUserId(userCredential.user.uid); 
    } catch (error) {
      console.error("Signup error:", error);
    }
  }

  async function sign_out() {
    await signOut(auth)
  }



  return (
    <View style={styles.container}>
      { !userId &&
        <>
          <Text>Login</Text>
          <TextInput
            onChangeText={newText => setEnteredEmail(newText)}
            value={enteredEmail}
          />
          <TextInput
            onChangeText={newText => setEnteredPassword(newText)}
            value={enteredPassword}
          />
          <Button
            title='Log in'
            onPress={login}
          />

          <TextInput
            onChangeText={newText => setEnteredEmail(newText)}
            value={enteredEmail}
          />
          <TextInput
            onChangeText={newText => setEnteredPassword(newText)}
            value={enteredPassword}
          />
          <Button
            title='Signup'
            onPress={signup}
          />
        </>
      }
      {userId && documents.length > 0 && (
        <>
          {documents.map((document) => (
            <View key={document.id} style={{margin: 10}}>
              <Text>{document.text}</Text>
            </View>
          ))}
        </>
      )}

      { userId &&
        <>
          <TextInput
            placeholder="type here" 
            onChangeText={newText => setEnteredText(newText)}
            value={enteredText}
          />
          <Button
            title='Add new Document'
            onPress={addDocument}
          />
          <Button
            title='Sign out'
            onPress={sign_out}
          />
          </>
      }
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
