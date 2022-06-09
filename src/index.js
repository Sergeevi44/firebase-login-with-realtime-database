import './sass/main.scss';
import './js/register-form';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
const refs = {
  singinForm: document.getElementById('register-form'),
  singinBtn: document.getElementById('register-btn1'),
};

const firebaseConfig = {
  apiKey: 'AIzaSyDo1183-PB_7A9qygtI9_TfvjKvLJSyPDA',
  authDomain: 'test-firebase-377da.firebaseapp.com',
  databaseURL: 'https://test-firebase-377da-default-rtdb.firebaseio.com',
  projectId: 'test-firebase-377da',
  storageBucket: 'test-firebase-377da.appspot.com',
  messagingSenderId: '1000137961183',
  appId: '1:1000137961183:web:a6ceb146b1a5991749c36a',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Get a reference to the database service
const database = getDatabase(app);
const provider = new GoogleAuthProvider();

refs.singinForm.addEventListener('submit', onRegisterFormSubmit);
refs.singinBtn.addEventListener('click', googleSingIn);

function onRegisterFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      writeUserData(user.uid, name, user.email);
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

function writeUserData(userId, name, email) {
  set(ref(database, 'users/' + userId), {
    username: name,
    email: email,
  });
}

function googleSingIn(e) {
  e.preventDefault();
  signInWithPopup(auth, provider)
    .then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log(token);
      // The signed-in user info.
      const user = result.user;
      console.log(user);
      writeUserData(user.uid, user.displayName, user.email);
      // ...
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}
