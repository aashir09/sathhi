import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import ThemeProviderWrapper from './theme/ThemeProvider';
import './App.css';

import { initializeApp } from "firebase/app";
import firebaseConfig from 'src/firebase';
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const content = useRoutes(router);
  const [notification, setNotification] = useState({ title: '', body: '' });


  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    requestPermission();
    listen();
  }, [])

  const requestPermission = () => {
    const messaging = getMessaging();
    getToken(messaging,
      { vapidKey: firebaseConfig.vapidKey }).then(
        (currentToken) => {
          if (currentToken) {
            console.log("we got the token.....");
            console.log(currentToken);
            sessionStorage.setItem("fcmToken", currentToken);
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });
  }

  const CustomToastWithLink = (title: string, description: string) => (
    <div>
      <div>
        {title}
      </div>
      <div>
        {description}
      </div>
    </div>
  );

  const listen = () => {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      toast.info(CustomToastWithLink(payload.notification.title,payload.notification.body), {
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    });
  }

  return (
    <ThemeProviderWrapper>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        {content}
      </LocalizationProvider>
    </ThemeProviderWrapper>
  );
}
export default App;
