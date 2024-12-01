importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");


//Using singleton breaks instantiating messaging()
// App firebase = FirebaseWeb.instance.app;

const firebaseConfig = {
  apiKey: "AIzaSyBp6FGfVtxruUJADm_FNgxg2cdDkJcDkt8",
  authDomain: "matrimony-firebase-admin.firebaseapp.com",
  projectId: "matrimony-firebase-admin",
  storageBucket: "matrimony-firebase-admin.firebasestorage.app",
  messagingSenderId: "533731017401",
  appId: "1:533731017401:web:3716617e64e14449495168",
  measurementId: "G-098DJWX4ZY"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Optional:
messaging.onBackgroundMessage((message) => {
  console.log("onBackgroundMessage", message);
});
