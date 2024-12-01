import { HelmetProvider } from 'react-helmet-async';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Outlet, Route, Routes, HashRouter } from 'react-router-dom';
import 'nprogress/nprogress.css';
import App from 'src/App';
import SidebarProvider  from 'src/contexts/SidebarContext';
import * as serviceWorker from 'src/serviceWorker';
import Reset from './content/overview/reset/reset';
import Forgetpassword from './content/overview/forgetpassword/forgetpassword';
import reportWebVitals from './reportWebVitals';


// ReactDOM.render(
//   <HelmetProvider>
//     <SidebarProvider>
//       {/* <BrowserRouter basename='/tothePoint_login'> */}
//       <BrowserRouter>
//         {/* <HashRouter> */}
//         <Routes >
//           <Route path="/reset-password/:token" element={<Reset />} />
//           <Route path="/forgotpassword" element={<Forgetpassword />} />
//         </ Routes>
//         <Outlet />
//         <App />
//         {/* </HashRouter> */}
//       </BrowserRouter>
//     </SidebarProvider>
//   </HelmetProvider>,
//   document.getElementById('root')
// );

// serviceWorker.unregister();


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
     <HelmetProvider>
    <SidebarProvider>
     <BrowserRouter>
        <Routes >
          <Route path="/reset-password/:token" element={<Reset />} />
          <Route path="/forgotpassword" element={<Forgetpassword />} />
        </ Routes>
        <Outlet />
        <App />
      </BrowserRouter>
    </SidebarProvider>
  </HelmetProvider>,
  </React.StrictMode>
);

reportWebVitals();