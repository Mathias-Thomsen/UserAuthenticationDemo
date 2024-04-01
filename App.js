import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { login, signup, signOutUser, addNewDocument, fetchDocuments, subscribeToAuthChanges } from './firebase/useFirebase';

export default function App() {
  const [enteredEmail, setEnteredEmail] = useState("mathias@test.dk");
  const [enteredPassword, setEnteredPassword] = useState("123456");
  const [userId, setUserId] = useState(null);
  const [enteredText, setEnteredText] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
        fetchDocuments(currentUser.uid)
          .then(docsArray => setDocuments(docsArray))
          .catch(error => console.log(error));
      } else {
        setUserId(null);
        setDocuments([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    login(enteredEmail, enteredPassword)
      .then(uid => setUserId(uid))
      .catch(error => console.error(error));
  };

  const handleSignup = () => {
    signup(enteredEmail, enteredPassword)
      .then(uid => setUserId(uid))
      .catch(error => console.error(error));
  };

  const handleAddDocument = () => {
    if (userId) {
      addNewDocument(userId, enteredText)
        .then(docId => {
          setDocuments([...documents, { id: docId, text: enteredText }]);
          setEnteredText(""); // Clear the text field
        })
        .catch(error => console.error(error));
    }
  };

  const handleSignOut = () => {
    signOutUser().then(() => {
      setUserId(null);
      setDocuments([]);
    }).catch(error => console.error(error));
  };

  return (
    <View style={styles.container}>
      {!userId ? (
        <View style={styles.authContainer}>
          <Text style={styles.headerText}>Login or Signup</Text>
          <TextInput style={styles.textInput} placeholder="Email" onChangeText={setEnteredEmail} value={enteredEmail} />
          <TextInput style={styles.textInput} placeholder="Password" onChangeText={setEnteredPassword} secureTextEntry value={enteredPassword} />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
          
        </View>
      ) : (
        <View style={styles.loggedInContainer}>
          <ScrollView style={styles.documentsScrollContainer} showsVerticalScrollIndicator={false}>
            {documents.length > 0 && documents.map((document) => (
              <View key={document.id} style={styles.documentContainer}>
                <Text style={styles.documentText}>{document.text}</Text>
              </View>
            ))}
          </ScrollView>
          <TextInput style={styles.textInput} placeholder="Type here" onChangeText={setEnteredText} value={enteredText} />
          <TouchableOpacity style={styles.button} onPress={handleAddDocument}>
            <Text style={styles.buttonText}>Add new Document</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 20,
  },
  authContainer: {
    alignItems: 'center',
  },
  loggedInContainer: {
    flex: 1,
  },
  documentsScrollContainer: {
    paddingTop: 40,
    flex: 1,
    width: '100%', // Sikrer, at ScrollView fylder bredden
  },
  textInput: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  documentContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E3E3E3',
    marginBottom: 10,
  },
  documentText: {
    color: '#333333',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});
