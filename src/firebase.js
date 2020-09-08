import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCoVtqCkd01JPH628GwdVH4cmY2iBxKvLk",
    authDomain: "instagram-clone-3c3dd.firebaseapp.com",
    databaseURL: "https://instagram-clone-3c3dd.firebaseio.com",
    projectId: "instagram-clone-3c3dd",
    storageBucket: "instagram-clone-3c3dd.appspot.com",
    messagingSenderId: "588757475852",
    appId: "1:588757475852:web:412d1e2539a6f26406c429",
    measurementId: "G-BR9DQT5VCY"
  });

  const db=firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db,auth, storage};