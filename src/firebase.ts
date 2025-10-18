import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore'; 
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCNkieCeAm2AVEzaGMAgFnFhGs6HRlQzgk",
  authDomain: "movie-explorer-93d29.firebaseapp.com",
  projectId: "movie-explorer-93d29",
  storageBucket: "movie-explorer-93d29.appspot.com",
  messagingSenderId: "414840706834",
  appId: "1:414840706834:web:35cb9aeeafee109a18c5cb",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth(); // Auth object
const signOut = () => auth.signOut();

export { db, auth, signOut } // Export auth along with db
