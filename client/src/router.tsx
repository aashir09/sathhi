import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';
import SidebarLayout from 'src/layouts/SidebarLayout/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';
// import Loader from './content/spinner';
import Protected from './content/protected';
import SuspenseLoader from './components/SuspenseLoader';
//import UserPackages from './content/userPackage/UserPackages';

const Loader = (Component) => (props) => (
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

const isEnableCustomField = localStorage.getItem('isEnableCustomFields') ? JSON.parse(localStorage.getItem('isEnableCustomFields')) : null;
const isEnableSubCommunity = localStorage.getItem('isEnableSubCommunity') ? JSON.parse(localStorage.getItem('isEnableSubCommunity')) : null;
const isEnableCommunity = localStorage.getItem('isEnableCommunity') ? JSON.parse(localStorage.getItem('isEnableCommunity')) : null;

const Overview = Loader(lazy(() => import('src/content/overview/Login/Login')));
const NoPagePermission = Loader(lazy(() => import('src/content/NoPagePermission/noPagePermission')));
const Forgetpassword = Loader(lazy(() => import('src/content/overview/forgetpassword/forgetpassword')));
const Reset = Loader(lazy(() => import('src/content/overview/reset/reset')));

const Dashboard = Loader(lazy(() => import('src/content/dashboards/Crypto')));
const AppLink = Loader(lazy(() => import('src/content/appLink/appLink')));
const Userlist = Loader(lazy(() => import('src/content/UserList/UserList')));
const User = Loader(lazy(() => import('src/content/user/ApplicationsUser')));
const UserView = Loader(lazy(() => import(`src/content/user/view/ManagementUserProfile`)));
const UserBlock = Loader(lazy(() => import('src/content/block/ApplicationsUserBlock')));
const Premium = Loader(lazy(() => import('src/content/Premium/Premium')));
const TimeDuration = Loader(lazy(() => import('src/content/timeDuration/TimeDuration')));
const PremiumAccount = Loader(lazy(() => import('src/content/PremiumAccount/PremiumAccount')));
const ApplicationsUser = Loader(lazy(() => import('src/content/Report/AppUser/ApplicationUser')));

const RequestSend = Loader(lazy(() => import('src/content/Report/RequestSend/RequestSend')));
const RequestReceive = Loader(lazy(() => import('src/content/Report/RequestReceive/RequestReceive')));
const PremiumAppUser = Loader(lazy(() => import('src/content/Report/PremiumAppUser/PremiumAppUser')));
const SystemBlockedUsers = Loader(lazy(() => import('src/content/Report/SystemBlockedUsers/SystemBlockedUsers')));
const ReportSend = Loader(lazy(() => import('src/content/Report/ReportsMonthWise/requestSendReport')));
const ReportAccept = Loader(lazy(() => import('src/content/Report/ReportsMonthWise/requestAcceptReport')));
const ReportReject = Loader(lazy(() => import('src/content/Report/ReportsMonthWise/requestRejectReport')));
const ReportReceiveUser = Loader(lazy(() => import('src/content/Report/ReportsMonthWise/requestReceiveUser')));
const ReportRejectUser = Loader(lazy(() => import('src/content/Report/ReportsMonthWise/requestRejectUser')));

const ReportSendUser = Loader(lazy(() => import('src/content/Report/ReportsMonthWise/requestSendUser')));
const DocumentType = Loader(lazy(() => import('src/content/DocumentType/DocumentType')));
const Religion = Loader(lazy(() => import('src/content/Religion/Religion')));
const Community = Loader(lazy(() => import('src/content/Community/Community')));
const Subcommunity = Loader(lazy(() => import('src/content/Subcommunity/SubCommunity')));
const Marital = Loader(lazy(() => import('src/content/Marital/MaritalStatus')));
const Employment = Loader(lazy(() => import('src/content/Employment/Employment')));
const Occupation = Loader(lazy(() => import('src/content/occupation/Occupation')));
const EducationType = Loader(lazy(() => import('src/content/educationType/educationType')))
const Education = Loader(lazy(() => import('src/content/education/Education')));
const EducationMedium = Loader(lazy(() => import('src/content/educationMedium/educationMedium')))
const Diet = Loader(lazy(() => import('src/content/diet/Diet')));
const Height = Loader(lazy(() => import('src/content/height/Height')));
const Income = Loader(lazy(() => import('src/content/income/Income')));
const ProfileFor = Loader(lazy(() => import('src/content/ProfileFor/ProfileFor')));
const Weight = Loader(lazy(() => import('src/content/Weight/Weight')));

const UserPackages = Loader(lazy(() => import('src/content/userPackage/UserPackages')));
const Region = Loader(lazy(() => import('src/content/region/Region')));
const CustomNotification = Loader(lazy(() => import('src/content/customNotification/CustomNotification')));
const Question = Loader(lazy(() => import('src/content/question/Question')));
const SuccessStory = Loader(lazy(() => import('src/content/successStory/SuccessStory')));
const Feedback = Loader(lazy(() => import('src/content/FeedBack/feedback')));
const Coupons = Loader(lazy(() => import('src/content/coupons/Coupons')));
const Profiles = Loader(lazy(() => import('src/content/profile/Profile')));
const Setting = Loader(lazy(() => import('src/content/setAPI/Setting')));
const Currency = Loader(lazy(() => import('src/content/Currency')));
const PaymentGateway = Loader(lazy(() => import('src/content/PaymentGateway')));
const ManageCustomFields = Loader(lazy(() => import('src/content/ManageCustomFields/manageCustomFields')));
const CustomFieldDetail = Loader(lazy(() => import('src/content/ManageCustomFields/view/CustomFieldDetail')));
const Blog = Loader(lazy(() => import('src/content/blog/blog')));
const BlogDetail = Loader(lazy(() => import('src/content/blog/view/blogDetail')));
const ResgistrationScreen = Loader(lazy(() => import('src/content/registrationScreen/registrationScreen')))
var isLoggedIn = localStorage.getItem('SessionToken');
// element: <Protected exact Component={isLoggedIn ? Dashboard : Overview} />

const routes: RouteObject[] = [
  {
    path: '/admin',
    element: <BaseLayout />,
    children: [
      {
        path: '/admin',
        element: <Overview />
        // element: {!isLoggedIn ? <Overview /> : Dashboard}
      },
      {
        path: 'overview',
        element: <Navigate to="/admin" replace />
        // element: <Protected exact Component={!isLoggedIn ? <Navigate to="/" replace /> : Dashboard} />
      }
    ]
  },
  {
    path: '/admin',
    element: <BaseLayout />,
    children: [
      {
        path: 'forgotpassword',
        element: <Forgetpassword />
        // element: {!isLoggedIn ? <Overview /> : Dashboard}
      },
      {
        path: 'forgotpassword',
        element: <Navigate to="/forgotpassword" replace />
        // element: <Protected exact Component={!isLoggedIn ? <Navigate to="/" replace /> : Dashboard} />
      }

    ]
  },
  {
    path: '/admin',
    element: <BaseLayout />,
    children: [
      {
        path: 'nopagepermission',
        element: <NoPagePermission />
        // element: {!isLoggedIn ? <Overview /> : Dashboard}
      },
      {
        path: 'nopagepermission',
        element: <Navigate to="/admin/nopagepermission" replace />
        // element: <Protected exact Component={!isLoggedIn ? <Navigate to="/" replace /> : Dashboard} />
      }

    ]
  },
  {
    path: '/admin',
    element: <BaseLayout />,
    children: [
      {
        path: 'reset-password/:token',
        element: <Reset />
        // element: {!isLoggedIn ? <Overview /> : Dashboard}
      },
      {
        path: 'reset-password/:token',
        element: <Navigate to="/reset-password/:token" replace />
        // element: <Protected exact Component={!isLoggedIn ? <Navigate to="/" replace /> : Dashboard} />
      }
    ]
  },
  {
    path: '/admin',
    element: <SidebarLayout />,
    children: [
      {
        path: '/admin',
        element: <Navigate to="dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Protected Component={Dashboard} Title="Dashboard" />
      },
      {
        path: 'appuser',
        element: <Protected Component={User} Title="App Users" />
      },
      {
        path: 'appuser/view/:id',
        element: <Protected Component={UserView} Title="App Users" />
      },
      {
        path: 'blockuser',
        element: <Protected Component={UserBlock} Title="Block Users" />
      },
      {
        path: 'users',
        element: <Protected Component={Userlist} Title="Admin Users" />
      },
      {
        path: 'premiumaccount',
        element: <Protected Component={PremiumAccount} Title="Packages" />
      },
      {
        path: 'premiumfacility',
        element: <Protected Component={Premium} Title="Facilities" />
      },
      {
        path: 'timeduration',
        element: <Protected Component={TimeDuration} Title="Duration" />
      },

      {
        path: 'document-type',
        element: <Protected Component={DocumentType} Title="Document Type" />
      },
      {
        path: 'profile-for',
        element: <Protected Component={ProfileFor} Title="Profile For" />
      },
      {
        path: 'religion',
        element: <Protected Component={Religion} Title="Religion" />
      },
      {
        path: 'community',
        element: (isEnableCommunity == 1 || isEnableCommunity == true)
          ?
          (<Protected Component={Community} Title="Community" />) : (
            <Navigate to="/admin/nopagepermission" replace />
          )
      },
      {
        path: 'subcommunity',
        element: (isEnableCommunity == 1 || isEnableCommunity == true) && (isEnableSubCommunity == 1 || isEnableSubCommunity == true) ? (<Protected Component={Subcommunity} Title="Sub Community" />) : (
          <Navigate to="/admin/nopagepermission" replace />
        )
      },
      {
        path: 'maritalstatus',
        element: <Protected Component={Marital} Title="Marital Status" />
      },
      {
        path: 'employment',
        element: <Protected Component={Employment} Title="Employment" />
      }, ,
      {
        path: 'occupation',
        element: <Protected Component={Occupation} Title="Occupation" />
      },
      {
        path: 'educationtype',
        element: <Protected Component={EducationType} Title="EducationType" />
      },
      {
        path: 'education',
        element: <Protected Component={Education} Title="Education" />
      },
      {
        path: 'education',
        element: <Protected Component={Education} Title="Education" />
      },
      {
        path: 'educationmedium',
        element: <Protected Component={EducationMedium} Title="Education Medium" />
      },
      {
        path: 'diet',
        element: <Protected Component={Diet} Title="Diet" />
      },
      {
        path: 'height',
        element: <Protected Component={Height} Title="Height" />
      },
      {
        path: 'income',
        element: <Protected Component={Income} Title="Annual income" />
      },
      {
        path: 'currency',
        element: <Protected Component={Currency} Title="Currency" />
      },
      {
        path: 'paymentGateway',
        element: <Protected Component={PaymentGateway} Title="Payment Gateway" />
      },
      {
        path: 'weight',
        element: <Protected Component={Weight} Title="Weight" />
      },

      {
        path: 'requestSendReport',
        element: <Protected Component={ReportSend} Title="Proposal Request Send" />
      },
      {
        path: 'requestAcceptReport',
        element: <Protected Component={ReportAccept} Title="Proposal Request Accept" />
      },
      {
        path: 'requestRejectReport',
        element: <Protected Component={ReportReject} Title="Proposal Request Reject" />
      },
      {
        path: 'requestReceiveUser',
        element: <Protected Component={ReportReceiveUser} Title="Proposal Receive User" />
      },
      {
        path: 'requestRejectUser',
        element: <Protected Component={ReportRejectUser} Title="Proposal Reject User" />
      },
      {
        path: 'requestSendUser',
        element: <Protected Component={ReportSendUser} Title="Proposal Send User" />
      },
      {
        path: 'requestsend',
        element: <Protected Component={RequestSend} Title="Top Request Send" />
      },
      {
        path: 'requestreceive',
        element: <Protected Component={RequestReceive} Title="Top Request Receive" />
      },
      {
        path: 'applicationuser',
        element: <Protected Component={ApplicationsUser} auth={true} Title="Application User" />
      },
      {
        path: 'premiumAppUser',
        element: <Protected Component={PremiumAppUser} Title="Premium App User" />
      },
      {
        path: 'systemBlockedUser',
        element: <Protected Component={SystemBlockedUsers} Title="System Blocked User" />
      },

      {
        path: 'user-packages',
        element: <Protected Component={UserPackages} Title="Customer Packages" />
      },
      {
        path: 'region',
        element: <Protected Component={Region} Title="Region" />
      },
      {
        path: 'custom-notification',
        element: <Protected Component={CustomNotification} Title="Custom Notification" />
      },
      {
        path: 'FAQs',
        element: <Protected Component={Question} Title="FAQs" />
      },
      {
        path: 'successStory',
        element: <Protected Component={SuccessStory} Title="Success Story" />
      },
      {
        path: 'feedback',
        element: <Protected Component={Feedback} Title="Feedback" />
      },
      {
        path: 'setting',
        element: <Protected Component={Setting} Title="Setting" />
      },

      {
        path: 'coupon',
        element: <Protected Component={Coupons} Title="coupon" />
      },
      {
        path: 'profile',
        element: <Protected Component={Profiles} Title="Profile" />
      },
      {
        path: 'region',
        element: <Protected Component={Region} Title="Region" />
      },
      {
        path: 'currency',
        element: <Protected Component={Currency} Title="Currency" />
      },
      {
        path: 'paymentGateway',
        element: <Protected Component={PaymentGateway} Title="PaymentGateway" />
      },
      {
        path: 'manage-custom-fields',
        element: isEnableCustomField ? (
          <Protected Component={ManageCustomFields} Title="Manage Custom Fields" />
        ) : (
          // Redirect or display an error message if isEnableCustomField is false
          <Navigate to="/admin/nopagepermission" replace /> // Or any other desired action
        )
      },
      {
        path: 'manage-custom-fields/view/:id',
        element: <Protected Component={CustomFieldDetail} Title="Custom Fields Detail" />
      },
      {
        path: 'blog',
        element: <Protected Component={Blog} Title="Blogs" />
      },
      {
        path: 'blog/view/:id',
        element: <Protected Component={BlogDetail} Title="Blog Detail" />
      },
      {
        path: 'registrationScreen',
        element: <Protected Component={ResgistrationScreen} Title="Resgistration Screen" />
      }
    ]
  }
];

export default routes;
