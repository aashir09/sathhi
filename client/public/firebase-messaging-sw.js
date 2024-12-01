importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBp6FGfVtxruUJADm_FNgxg2cdDkJcDkt8",
   authDomain: "matrimony-firebase-admin.firebaseapp.com",
   projectId: "matrimony-firebase-admin",
   storageBucket: "matrimony-firebase-admin.firebasestorage.app",
   messagingSenderId: "533731017401",
   appId: "1:533731017401:web:3716617e64e14449495168",
   measurementId: "G-098DJWX4ZY"
};

// Initialize Firebase app if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Optional: Background message handler
messaging.onBackgroundMessage((message) => {
  console.log("Received background message:", message);

  // Customize notification if needed
  const notificationTitle = message.notification?.title || "Background Notification";
  const notificationOptions = {
    body: message.notification?.body,
    icon: "/firebase-logo.png", // Specify a valid icon URL or path if needed
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
