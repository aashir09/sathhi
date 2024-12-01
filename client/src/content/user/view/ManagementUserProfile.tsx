import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  useTheme

} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Grid, Tab } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import * as React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import HomeIcon from '@mui/icons-material/Home';
import PageTitleWrapper from '../../../components/PageTitleWrapper';
import APIservice from '../../../utils/APIservice';
import { useState } from 'react';
import Loader1 from '../../appuserViewLoader';
import { format } from 'date-fns';
import Footer from 'src/components/Footer';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppUserDocuments } from 'src/models/appuser';
import CheckIcon from '@mui/icons-material/Check';
import HowToRegIcon from '@mui/icons-material/HowToReg';

function ManagementUserProfile() {
  const card = {
    height: 'auto',
    padding: '14px',
    boxShadow: '0px 0px 4px rgba(159, 162, 191, .18), 0px 0px 2px rgba(159, 162, 191, 0.32)',
    borderRadius: '5px',
    marginBottom: '20px',
    width: '360px'
  };
  const heading = {
    fontWeight: '700',
    fontSize: '20px',
    marginBottom: '10px'
  }
  const [users, setUsers] = React.useState<any>([]);
  const [userFav, setUserFav] = React.useState<any>([]);
  const [reqSend, setReqSend] = React.useState<any>([]);
  const [reqGet, setReqGet] = React.useState<any>([]);
  const [blockUser, setBlockUser] = React.useState<any>([]);
  const [userPackages, setUserPackages] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = useState<number>(0);
  const [limitSend, setLimitSend] = useState<number>(10);
  const [limitGot, setLimitGot] = useState<number>(10);
  const [limitFav, setLimitFav] = useState<number>(10);
  const [limitblock, setLimitBlock] = useState<number>(10);
  const [limitUserPackages, setLimitUserPackages] = useState<number>(10);
  const [rowSend, setRowSend] = useState<number>(10);
  const [rowGot, setRowGot] = useState<number>(10);
  const [rowFav, setRowFav] = useState<number>(10);
  const [rowBlock, setRowBlock] = useState<number>(10);
  const [rowUserPackages, setRowUserPackages] = useState<number>(10);
  const [firstName, setFirstName] = useState<any>([]);
  const [middleName, setMiddleName] = useState<any>([]);
  const [lastName, setLastName] = useState<any>([]);
  let [credentail, setCredentail] = useState<any>();
  const [isActivePackage, setIsActivePackage] = React.useState(false);
  const [paymentRefNo, setPaymentRefNo] = React.useState<string>("");
  const [selectedUserPackageId, setSelectedUserPackageId] = React.useState<number>(0);
  const [isUserProfilePicApprove, setUserProfilePicApproval] = useState(false);
  const navigate = useNavigate();
  const [isVerifyProfile, setVerifyProfile] = useState(false);
  const [userId, setUserId] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [isVerified, setIsVerified] = useState();
  const [isProfileConfirmation, setIsProfileConfirmationDialog] = useState(false);
  const [maritalStauts, setMaritalStatus] = React.useState<string>("");

  const [isDocumentVerification, setIsDocumentVerification] = useState(false);
  const [isNotificationConfirmation, setIsDocumentVerificationDialog] = useState(false);
  const [verificationDocument, setVerificationDocument] = useState<any>();
  const [isEnableFamilyDetails, setIsEnableFamilyDetails] = useState(true);
  const [isEnableAstrologicDetails, setIsEnableAstrologicDetails] = useState(true);
  const [isEnableLifeStyles, setIsEnableLifeStyles] = useState(true);


  const vId = useParams();

  let [apiUrl, setApiUrl] = useState<any>();

  // window.onpopstate = () => {
  //   navigate(-1);
  // }

  React.useEffect(() => {
    let cred = JSON.parse(localStorage.getItem('Credentials'));
    let isUserProfilePicApprove = JSON.parse(localStorage.getItem('isUserProfilePicApprove'));
    setCredentail(cred);
    setUserProfilePicApproval(isUserProfilePicApprove);

    let isEnableFamilyDetails = JSON.parse(localStorage.getItem('isEnableFamilyDetails'));
    setIsEnableFamilyDetails(isEnableFamilyDetails);

    let isEnableAstrologicDetails = JSON.parse(localStorage.getItem('isEnableFamilyDetails'));
    setIsEnableAstrologicDetails(isEnableAstrologicDetails);

    let isEnableLifeStyles = JSON.parse(localStorage.getItem('isEnableLifeStyles'));
    setIsEnableLifeStyles(isEnableLifeStyles);
    
    getData();
    loadjson();
  }, []);
  const theme = useTheme();
  const dateData = localStorage.getItem('DateFormat');

  const loadjson = async () => {
    let res = await fetch('/admin/variable.json'); // Adjust the file path as needed
    let url = await res.json();
    setApiUrl(url);
    apiUrl = url;

  }

  const getData = async () => {
    debugger
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        userId: vId.id
      };
      const res = await APIservice.httpPost(
        '/api/admin/appUsers/viewAppUserPerDetail',
        obj,
        token,
        refreshToken
      );

      if (res.recordList && res.recordList.userDetail && res.recordList.userDetail.length > 0 && res.recordList.userDetail[0].customFields && res.recordList.userDetail[0].customFields.length > 0) {
        for (let index = 0; index < res.recordList.userDetail[0].customFields.length; index++) {
          if (Array.isArray(res.recordList.userDetail[0].customFields[index].value)) {
            res.recordList.userDetail[0].customFields[index].value = res.recordList.userDetail[0].customFields[index].value.join(', ')
          }
        }
      }
      setUsers(res.recordList.userDetail);
      sessionStorage.setItem(
        'FirstName',
        res.recordList.userDetail[0].firstName ? res.recordList.userDetail[0].firstName : ''
      );
      sessionStorage.setItem(
        'MiddleName',
        res.recordList.userDetail[0].middleName ? res.recordList.userDetail[0].middleName : ''
      );
      sessionStorage.setItem(
        'LastName',
        res.recordList.userDetail[0].lastName ? res.recordList.userDetail[0].lastName : ''
      );

      if (res && res.status == 200) {

        //   let filterMaritalStatus = apiUrl.maritalStatus.filter((c: any) => c.id == res.recordList.userDetail[0].maritalStatusId);
        //   setMaritalStatus(filterMaritalStatus[0].name);


        //   let pMaritalStatus;

        //   if (res.recordList.userDetail[0].pMaritalStatusId && typeof res.recordList.userDetail[0].pMaritalStatusId === 'string') {
        //     res.recordList.userDetail[0].pMaritalStatusId = res.recordList.userDetail[0].pMaritalStatusId.includes(',') ? res.recordList.userDetail[0].pMaritalStatusId.split(";") : [res.recordList.userDetail[0].pMaritalStatusId];
        // }

        //   for (let i = 0; i < res.recordList.userDetail[0].pMaritalStatusId.length; i++) {
        //     let filterMaritalStatus = apiUrl.maritalStatus.filter((c: any) => c.id == res.recordList.userDetail[0].pMaritalStatusId[i]);
        //     pMaritalStatus.push(filterMaritalStatus.name)
        //   }

      //   console.log(pMaritalStatus)

      } else if (res.status == 401) {
        localStorage.clear();
        navigate('/admin');
      } else if (res.status == 500) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 400) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 300) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 404) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      }
      setIsLoading(false);
      getName();
    } catch (error) {
      setIsLoading(false);
      toast.error(error, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === '2') {
      sendRequest(page, limitSend);
    } else if (newValue === '3') {
      gotRequest(page, limitGot);
    } else if (newValue === '4') {
      fav(page, limitFav);
    } else if (newValue === '5') {
      getBlockUser(page, limitblock);
    } else if (newValue === '6') {
      getUserPackages(page, limitUserPackages);
    }
  };

  const handleViewClick = (id: number) => {
    navigate(`/admin/appuser/view/${id}`);
    window.location.reload();
  };

  const getName = () => {
    let fName = sessionStorage.getItem('FirstName');
    let mName = sessionStorage.getItem('MiddleName');
    let lName = sessionStorage.getItem('LastName');
    if ((fName && lName) || mName) {
      setFirstName(fName);
      setMiddleName(mName);
      setLastName(lName);
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
    sendRequest(newPage * limitSend, limitSend);
  };

  const handlePageChangeGetRequest = (event: any, newPage: number): void => {
    setPage(newPage);
    gotRequest(newPage * limitGot, limitGot);
  };

  const handlePageChangeUserFavourite = (event: any, newPage: number): void => {
    setPage(newPage);
    fav(newPage * limitFav, limitFav);
  };

  const handlePageChangeBlockUser = (event: any, newPage: number): void => {
    setPage(newPage);
    getBlockUser(newPage * limitblock, limitblock);
  };

  const handlePageChangeUserPackage = (event: any, newPage: number): void => {
    setPage(newPage);
    getUserPackages(newPage * limitUserPackages, limitUserPackages);
  };

  const handleLimitChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLimitSend(parseInt(event.target.value));
    setLimitGot(parseInt(event.target.value));
    setLimitFav(parseInt(event.target.value));
    setLimitBlock(parseInt(event.target.value));
    setPage(0);
    sendRequest(0, parseInt(event.target.value));
    gotRequest(0, parseInt(event.target.value));
    fav(0, parseInt(event.target.value));
    getBlockUser(0, parseInt(event.target.value));
  };

  const sendRequest = async (startIndex: number, fetchRecord: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        startIndex: startIndex,
        fetchRecord: fetchRecord,
        userId: vId.id
      };
      const res = await APIservice.httpPost(
        '/api/admin/appUsers/viewAppUserSendRequest',
        obj,
        token,
        refreshToken
      );
      setReqSend(res.recordList.userDetail);
      setRowSend(res.totalRecords);
      if (res && res.status == 200) {
      } else if (res.status == 401) {
        localStorage.clear();
        navigate('/admin');
      } else if (res.status == 500) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 400) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 300) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 404) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const gotRequest = async (startIndex: number, fetchRecord: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        startIndex: startIndex,
        fetchRecord: fetchRecord,
        userId: vId.id
      };
      const res = await APIservice.httpPost(
        '/api/admin/appUsers/viewAppUserGotRequest',
        obj,
        token,
        refreshToken
      );
      setReqGet(res.recordList.userDetail);
      setRowGot(res.totalRecords);
      if (res && res.status == 200) {
      } else if (res.status == 401) {
        localStorage.clear();
        navigate('/admin');
      } else if (res.status == 500) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 400) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 300) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 404) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const fav = async (startIndex: number, fetchRecord: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        startIndex: startIndex,
        fetchRecord: fetchRecord,
        userId: vId.id
      };
      const res = await APIservice.httpPost(
        '/api/admin/appUsers/viewAppUserFavourites',
        obj,
        token,
        refreshToken
      );
      setUserFav(res.recordList.userDetail);
      setRowFav(res.totalRecords);
      if (res && res.status == 200) {
      } else if (res.status == 401) {
        localStorage.clear();
        navigate('/admin');
      } else if (res.status == 500) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 400) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 300) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 404) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const getBlockUser = async (startIndex: number, fetchRecord: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        startIndex: startIndex,
        fetchRecord: fetchRecord,
        userId: vId.id
      };
      const res = await APIservice.httpPost(
        '/api/admin/appUsers/viewBlockUser',
        obj,
        token,
        refreshToken
      );
      setBlockUser(res.recordList.userDetail);
      setRowBlock(res.totalRecords);
      if (res && res.status == 200) {
      } else if (res.status == 401) {
        localStorage.clear();
        navigate('/admin');
      } else if (res.status == 500) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 400) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 300) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 404) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const getUserPackages = async (startIndex: number, fetchRecord: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        startIndex: startIndex,
        fetchRecord: fetchRecord,
        userId: vId.id
      };
      const res = await APIservice.httpPost(
        '/api/admin/appUsers/getUserPackages',
        obj,
        token,
        refreshToken
      );
      if (res && res.status == 200) {
        setUserPackages(res.recordList.userDetail);
        setRowUserPackages(res.totalRecords);
      } else if (res.status == 401) {
        localStorage.clear();
        navigate('/admin');
      } else if (res.status == 500) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 400) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 300) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 404) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const [errorArray, setErrorArray] = useState<boolean[]>([]);
  const handleImageError = (ele: AppUserDocuments, index: number) => {
    setErrorArray((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = true;
      return newErrors;
    });
  };

  const handleClickOpenDoc = async (doc: AppUserDocuments) => {
    debugger
    setIsDocumentVerification(true);
    setVerificationDocument(doc)
  }

  const handleDocumentVerificationClose = () => {
    setIsDocumentVerificationDialog(false);
    setIsDocumentVerification(false)
  }

  const handleApprovedDocument = async () => {
    debugger
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      // id: doc.id,
      id: verificationDocument.id,
      isVerified: true,
    };
    let res = await APIservice.httpPost(
      '/api/admin/appUsers/approveDocument',
      obj,
      token,
      refreshToken
    );

    if (res && res.status === 200) {
      getData();
    }
    setIsDocumentVerification(false)
  }

  const handleOpenActivePackageDialog = async (userPackageId: number) => {
    setSelectedUserPackageId(userPackageId);
    setIsActivePackage(true);
  }

  const handleCloseActivePackageDialog = async () => {
    setIsActivePackage(false);
  }

  const handleInputChange = (arr: any) => {
    const { name, value } = arr.target;
    setPaymentRefNo(value);
  };

  const handleProfileConfirmation = async (isVerified) => {
    debugger
    setIsVerified(isVerified);
    setIsProfileConfirmationDialog(true);
    setVerifyProfile(false);
  }

  const handleActiveUserPackage = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        packageId: selectedUserPackageId,
        userId: vId.id
      };
      const res = await APIservice.httpPost(
        '/api/admin/appUsers/activeUserPackage',
        obj,
        token,
        refreshToken
      );
      if (res && res.status == 200) {
        getUserPackages(page * limitUserPackages, limitUserPackages);
      } else if (res.status == 401) {
        localStorage.clear();
        navigate('/admin');
      } else if (res.status == 500) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 400) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 300) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 404) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  const handleVerifyProfilePic = (element: any) => {
    debugger
    let id = element?.id;
    let imageUrl = element?.imageUrl;
    setUserId(id)
    setVerifyProfile(true);
    setIsProfileConfirmationDialog(false);
    setImageUrl(imageUrl)
  };

  const handleVerifyProfilePicClose = () => {
    debugger
    setIsProfileConfirmationDialog(false);
    setVerifyProfile(false);
  }

  const handleVerifyProfile = async () => {
    try {
      debugger
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        id: userId,
        isVerified: isVerified
      };
      let res = await APIservice.httpPost(
        '/api/admin/appUsers/verifyUserProfilePic',
        obj,
        token,
        refreshToken
      );
      if (res && res.status === 200) {
        handleVerifyProfilePicClose();
        let msg = `Profile ` + (isVerified ? 'Approved' : 'Rejected')
        toast.success(msg);
        getData();
      } else if (res.status == 401) {
        navigate('/admin');
        localStorage.clear();
      } else if (res.status == 500) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 400) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 300) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 404) {
        toast.error(res.message, {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } catch (error) {
      toast.error(error, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  return (
    <>
      <ToastContainer
        style={{ top: '8.5%', right: '0%' }}
        // position="top-right"
        autoClose={6000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <PageTitleWrapper>
        <Box py={1.9} pl={1}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Stack alignItems="left" justifyContent="space-between">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link to="/admin" style={{ display: 'flex', color: 'black' }}>
                    <HomeIcon />
                  </Link>
                  <Link
                    to="/admin/appuser"
                    style={{
                      display: 'flex',
                      color: 'black',
                      textDecoration: 'none'
                    }}
                  >
                    App Users
                  </Link>
                  {/* <Typography color="inherit" >View</Typography> */}
                  <Typography
                    variant="subtitle2"
                    color="inherit"
                    fontWeight="bold"
                  >
                    {firstName} {lastName}
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          // alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card style={{ minHeight: 'calc(100vh - 228px)' }}>
              <TabContext value={value}>
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    padding: '16px',
                    paddingLeft: '16px',
                    overflowX: 'auto'
                  }}
                >
                  <TabList
                    onChange={handleChange}
                    aria-label="scrollable force tabs example"
                    variant="scrollable"
                  //  scrollButtons
                  // allowScrollButtonsMobile
                  >
                    <Tab label="Profile" value="1" />
                    <Tab label="Send Request" value="2" />
                    <Tab label="Got Request" value="3" />
                    <Tab label="Favourites" value="4" />
                    <Tab label="Block User" value="5" />
                    <Tab label="Purchase Packages" value="6" />
                    <Tab label="Documents" value="7" />
                  </TabList>
                </Box>

                <TabPanel value="1">
                  {isLoading ? (
                    <Loader1 title="Loading..." />
                  ) : (
                    <>
                      <TableContainer style={{ minHeight: 'calc(100vh - 353px)', padding: "2px" }}>
                        {users.map((user: any, index: any) => (
                          <div key={index}>
                            <Grid container>
                              <Grid item xs={12} sm={4} md={4} style={{ paddingRight: "25px" }}>
                                <Typography gutterBottom style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                                  {user.imageUrl ? (
                                    <Avatar
                                      src={
                                        
                                        user.imageUrl
                                      }
                                      sx={{
                                        height: '150px',
                                        width: '150px',
                                        marginBottom: '1%'
                                      }}
                                    ></Avatar>
                                  ) : (
                                    <Avatar
                                      sx={{ height: '150px', width: '150px' }}
                                    >
                                      {user.firstName
                                        ? user.firstName[0]
                                        : null}
                                    </Avatar>
                                  )}
                                </Typography>
                                {user.imageId && user.isVerifyProfilePic && isUserProfilePicApprove ? <>
                                  <Box sx={{
                                    backgroundColor: '#78b144', padding: '10px', borderRadius: '50%', height: '20px', width: '20px', top: '-55px', position: 'relative', right: '-62%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>
                                    <CheckIcon sx={{ 'font-size': '16px', color: '#fff' }} />
                                  </Box>
                                </> : <></>}


                                {!user.isVerifyProfilePic && user.imageId && isUserProfilePicApprove ? <>
                                  <Typography style={{ textAlign: "center", marginBottom: " 20px" }}>
                                    <Button
                                      style={{ textAlign: 'right' }}
                                      variant="contained"
                                      size="small"
                                      onClick={(e) => {
                                        handleVerifyProfilePic(user);
                                      }}
                                    >
                                      Verify Profile
                                    </Button></Typography>
                                  <Dialog
                                    open={isVerifyProfile}
                                    onClose={handleVerifyProfilePicClose}
                                    fullWidth
                                    maxWidth="xs"
                                  >
                                    <DialogTitle
                                      sx={{
                                        m: 0,
                                        p: 2,
                                        fontSize: '16px',
                                        fontWeight: 'bolder',
                                        // borderBottom: '1px solid #ddd'
                                      }}
                                    >
                                      Verify User Profile
                                    </DialogTitle>
                                    <DialogContent>
                                      {imageUrl && (
                                        <Box sx={{ height: '230px', width: '170px', margin: 'auto', marginBottom: '10px', marginTop: '10px' }}>
                                          <img style={{ 'height': '100%', 'width': '100%', objectFit: 'contain' }} src={
                                            
                                            imageUrl
                                          }></img>
                                        </Box>

                                      )
                                      }


                                    </DialogContent>
                                    <DialogActions>
                                      <Button onClick={handleVerifyProfilePicClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                      <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => {
                                        handleProfileConfirmation(true);
                                      }} variant="outlined" style={{ marginRight: '10px' }}>Approve</Button>
                                      <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => {
                                        handleProfileConfirmation(false);
                                      }} variant="outlined" style={{ marginRight: '10px' }}>Reject</Button>
                                    </DialogActions>
                                  </Dialog>
                                  <Dialog
                                    open={isProfileConfirmation}
                                    onClose={handleVerifyProfilePicClose}
                                    fullWidth
                                    maxWidth="xs"
                                  >
                                    <DialogTitle
                                      sx={{
                                        m: 0,
                                        p: 2,
                                        fontSize: '20px',
                                        fontWeight: 'bolder'
                                      }}
                                    >
                                    </DialogTitle>
                                    <DialogContent>
                                      <DialogContentText
                                        style={{

                                          letterSpacing: '0.00938em'
                                        }}
                                      >
                                        <Typography sx={{ paddingLeft: "10px", fontSize: '1rem', }}>
                                          Are You sure you want to  {isVerified ?
                                            <Typography style={{ display: 'inline' }}>
                                              Approve
                                            </Typography>
                                            :
                                            <Typography style={{ display: 'inline' }}>
                                              Reject
                                            </Typography>
                                          }  user profile Image?</Typography>


                                        {!isVerified && (
                                          <Typography style={{ paddingLeft: "10px", color: '#ff0000', paddingTop: '10px', fontSize: '12px', fontWeight: '600' }}>Note: If You Reject this request the image will also remove from system
                                          </Typography>
                                        )}
                                      </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                      <Button onClick={handleVerifyProfilePicClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                      <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => {
                                        handleVerifyProfile();
                                      }} variant="outlined" style={{ marginRight: '10px' }}>Confirm</Button>
                                    </DialogActions>
                                  </Dialog>
                                </> : <></>}
                                <Card style={card}>
                                  <h4 style={heading}>Basic Details</h4>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>First name</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.firstName ? user.firstName : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Middle Name</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.middleName ? user.middleName : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Last Name</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.lastName ? user.lastName : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          {' '}
                                          <b>Gender</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {' '}
                                          {user.gender ? user.gender : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Birthdate </b>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {' '}
                                          {format(
                                            new Date(user.birthDate),
                                            dateData
                                          )
                                            ? format(
                                              new Date(user.birthDate),
                                              dateData
                                            )
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  {(user.customFields && user.customFields?.length > 0) &&
                                    <>
                                      {user.customFields.map((customfield: any, ind: any) => (


                                        <div key={ind}>
                                          {customfield.completeprofilesectioname == "Basic Details" &&
                                            <Grid container>
                                              <Grid item xs={12} sm={5} md={5}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <b>{customfield.displayName}</b>{' '}
                                                    {/* <Box sx={{ pl: 9.1 }}>
                                              {customfield.value}
                                            </Box> */}
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={12} sm={7} md={7}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <Box>
                                                      {customfield.value ? customfield.value : '--'}
                                                    </Box>
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                            </Grid>}
                                        </div>
                                      ))}</>}

                                </Card>
                                <Card style={card}>
                                  <h4 style={heading}>Personal Details</h4>


                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Marital Status</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {maritalStauts
                                            ? maritalStauts
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Have Children</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.haveChildren == 1 ? 'Yes' : 'No'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>No Of Children</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.noOfChildren ? user.noOfChildren : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Height</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.height ? user.height : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Weight</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.weight ? user.weight : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Have Specs</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.haveSpecs == 1 ? 'Yes' : 'No'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Any Disability</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.anyDisability ? user.anyDisability : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Blood Group</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.bloodGroup ? user.bloodGroup : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Complexion</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.complexion ? user.complexion : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Languages</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.languages ? user.languages : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Body Type</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.bodyType ? user.bodyType : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Eye Color</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.eyeColor ? user.eyeColor : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>About Me</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.aboutMe ? user.aboutMe : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>


                                  {(user.customFields && user.customFields?.length > 0) &&
                                    <>
                                      {user.customFields.map((customfield: any, ind: any) => (


                                        <div key={ind}>
                                          {customfield.completeprofilesectioname == "Personal Details" &&
                                            <Grid container>
                                              <Grid item xs={12} sm={5} md={5}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <b>{customfield.displayName}</b>{' '}
                                                    {/* <Box sx={{ pl: 9.1 }}>
                                              {customfield.value}
                                            </Box> */}
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={12} sm={7} md={7}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <Box>
                                                      {customfield.value ? customfield.value : '--'}
                                                    </Box>
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                            </Grid>}
                                        </div>
                                      ))}</>}

                                </Card>
                                {isEnableFamilyDetails == true &&
                                  <Card style={card}>
                                    <h4 style={heading}>Family detail</h4>

                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Family Type</b>{' '}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box>
                                            {user.familyType ? user.familyType : '--'}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>
                                    {user.fatherDetails &&
                                      <>
                                        <b style={{ marginTop: '5px', fontSize: '1rem' }}>Father Detail :</b>
                                        <Typography gutterBottom variant="h6">
                                          <Grid container>
                                            <Grid item xs={12} sm={5} md={5}>
                                              <Box display="flex" alignItems="flex-start">
                                                <b>Name</b>{' '}
                                              </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={7} md={7}>
                                              <Box>
                                                {user.fatherDetails.name ? user.fatherDetails.name : '--'}
                                              </Box>
                                            </Grid>
                                          </Grid>
                                        </Typography>
                                        <Typography gutterBottom variant="h6">
                                          <Grid container>
                                            <Grid item xs={12} sm={5} md={5}>
                                              <Box display="flex" alignItems="flex-start">
                                                <b>Occupation</b>{' '}
                                              </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={7} md={7}>
                                              <Box>
                                                {user.fatherDetails.occupation ? user.fatherDetails.occupation : '--'}
                                              </Box>
                                            </Grid>
                                          </Grid>
                                        </Typography>
                                        <Typography gutterBottom variant="h6">
                                          <Grid container>
                                            <Grid item xs={12} sm={5} md={5}>
                                              <Box display="flex" alignItems="flex-start">
                                                <b>Education</b>{' '}
                                              </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={7} md={7}>
                                              <Box>
                                                {user.fatherDetails.education ? user.fatherDetails.education : '--'}
                                              </Box>
                                            </Grid>
                                          </Grid>
                                        </Typography>
                                        <Typography gutterBottom variant="h6">
                                          <Grid container>
                                            <Grid item xs={12} sm={5} md={5}>
                                              <Box display="flex" alignItems="flex-start">
                                                <b>Is Alive</b>{' '}
                                              </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={7} md={7}>
                                              <Box>
                                                {user.fatherDetails.isAlive ? 'Yes' : 'No'}
                                              </Box>
                                            </Grid>
                                          </Grid>
                                        </Typography>
                                      </>
                                    }

                                    {user.motherDetails && <>
                                      <b style={{ marginTop: '5px', fontSize: '1rem' }}>Mother Detail :</b>
                                      <Typography gutterBottom variant="h6">
                                        <Grid container>
                                          <Grid item xs={12} sm={5} md={5}>
                                            <Box display="flex" alignItems="flex-start">
                                              <b>Name</b>{' '}
                                            </Box>
                                          </Grid>
                                          <Grid item xs={12} sm={7} md={7}>
                                            <Box>
                                              {user.motherDetails.name ? user.motherDetails.name : '--'}
                                            </Box>
                                          </Grid>
                                        </Grid>
                                      </Typography>
                                      <Typography gutterBottom variant="h6">
                                        <Grid container>
                                          <Grid item xs={12} sm={5} md={5}>
                                            <Box display="flex" alignItems="flex-start">
                                              <b>Occupation</b>{' '}
                                            </Box>
                                          </Grid>
                                          <Grid item xs={12} sm={7} md={7}>
                                            <Box>
                                              {user.motherDetails.occupation ? user.motherDetails.occupation : '--'}
                                            </Box>
                                          </Grid>
                                        </Grid>
                                      </Typography>
                                      <Typography gutterBottom variant="h6">
                                        <Grid container>
                                          <Grid item xs={12} sm={5} md={5}>
                                            <Box display="flex" alignItems="flex-start">
                                              <b>Education</b>{' '}
                                            </Box>
                                          </Grid>
                                          <Grid item xs={12} sm={7} md={7}>
                                            <Box>
                                              {user.motherDetails.education ? user.motherDetails.education : '--'}
                                            </Box>
                                          </Grid>
                                        </Grid>
                                      </Typography>
                                      <Typography gutterBottom variant="h6">
                                        <Grid container>
                                          <Grid item xs={12} sm={5} md={5}>
                                            <Box display="flex" alignItems="flex-start">
                                              <b>Is Alive</b>{' '}
                                            </Box>
                                          </Grid>
                                          <Grid item xs={12} sm={7} md={7}>
                                            <Box>
                                              {user.motherDetails.isAlive ? 'Yes' : 'No'}
                                            </Box>
                                          </Grid>
                                        </Grid>
                                      </Typography>
                                    </>
                                    }
                                    {(user.familyDetail && user.familyDetail?.length > 0) &&
                                      <>
                                        {user.familyDetail.map((data: any, ind: any) => (
                                          <div key={ind}>
                                            <b style={{ marginTop: '5px', fontSize: '1rem' }}>{data.memberType}{data.memberSubType} Detail:</b>
                                            <Typography gutterBottom variant="h6">
                                              <Grid container>
                                                <Grid item xs={12} sm={5} md={5}>
                                                  <Box display="flex" alignItems="flex-start">
                                                    <b>Name</b>{' '}
                                                  </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={7} md={7}>
                                                  <Box>
                                                    {data.name ? data.name : '--'}
                                                  </Box>
                                                </Grid>
                                              </Grid>
                                            </Typography>
                                            <Typography gutterBottom variant="h6">
                                              <Grid container>
                                                <Grid item xs={12} sm={5} md={5}>
                                                  <Box display="flex" alignItems="flex-start">
                                                    <b>Occupation</b>{' '}
                                                  </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={7} md={7}>
                                                  <Box>
                                                    {data.occupation ? data.occupation : '--'}
                                                  </Box>
                                                </Grid>
                                              </Grid>
                                            </Typography>
                                            <Typography gutterBottom variant="h6">
                                              <Grid container>
                                                <Grid item xs={12} sm={5} md={5}>
                                                  <Box display="flex" alignItems="flex-start">
                                                    <b>Education</b>{' '}
                                                  </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={7} md={7}>
                                                  <Box>
                                                    {data.education ? data.education : '--'}
                                                  </Box>
                                                </Grid>
                                              </Grid>
                                            </Typography>
                                            <Typography gutterBottom variant="h6">
                                              <Grid container>
                                                <Grid item xs={12} sm={5} md={5}>
                                                  <Box display="flex" alignItems="flex-start">
                                                    <b>Is Alive</b>{' '}
                                                  </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={7} md={7}>
                                                  <Box>
                                                    {data.isAlive ? 'Yes' : 'No'}
                                                  </Box>
                                                </Grid>
                                              </Grid>
                                            </Typography>
                                          </div>
                                        ))}</>}


                                    {(user.customFields && user.customFields?.length > 0) &&
                                      <>
                                        {user.customFields.map((customfield: any, ind: any) => (


                                          <div key={ind}>
                                            {customfield.completeprofilesectioname == "Community Details" &&
                                              <Grid container>
                                                <Grid item xs={12} sm={5} md={5}>
                                                  <Typography gutterBottom variant="h6">
                                                    <Box display="flex" alignItems="flex-start">
                                                      <b>{customfield.displayName}</b>{' '}
                                                      {/* <Box sx={{ pl: 9.1 }}>
                                              {customfield.value}
                                            </Box> */}
                                                    </Box>
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={7} md={7}>
                                                  <Typography gutterBottom variant="h6">
                                                    <Box display="flex" alignItems="flex-start">
                                                      <Box>
                                                        {customfield.value ? customfield.value : '--'}
                                                      </Box>
                                                    </Box>
                                                  </Typography>
                                                </Grid>
                                              </Grid>}
                                          </div>
                                        ))}</>}

                                  </Card>
                                }
                              </Grid>
                              <Grid item xs={12} sm={4} md={4} style={{ paddingRight: "25px" }}>

                                <Card style={card}>
                                  <h4 style={heading}>Community Details</h4>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Religion</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.religion ? user.religion : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Community</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.community ? user.community : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>SubCommunity</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.subCommunity ? user.subCommunity : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Mother Tongue</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.motherTongue ? user.motherTongue : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  {(user.customFields && user.customFields?.length > 0) &&
                                    <>
                                      {user.customFields.map((customfield: any, ind: any) => (


                                        <div key={ind}>
                                          {customfield.completeprofilesectioname == "Community Details" &&
                                            <Grid container>
                                              <Grid item xs={12} sm={5} md={5}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <b>{customfield.displayName}</b>{' '}
                                                    {/* <Box sx={{ pl: 9.1 }}>
                                              {customfield.value}
                                            </Box> */}
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={12} sm={7} md={7}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <Box>
                                                      {customfield.value ? customfield.value : '--'}
                                                    </Box>
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                            </Grid>}
                                        </div>
                                      ))}</>}

                                </Card>
                                <Card style={card}>
                                  <h4 style={heading}>Address Details</h4>

                                  {user.permanentAddress ? (
                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Permanent Address</b>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box>
                                            {user.permanentAddress.addressLine1},{user.permanentAddress.addressLine2},
                                            {user.permanentAddress.cityName}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>
                                  ) : (
                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Permanent Address</b>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box> -- </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>
                                  )}

                                  {user.currentAddress ? (
                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Current Address</b>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box>
                                            {user.currentAddress.addressLine1},{user.currentAddress.addressLine2},
                                            {user.currentAddress.cityName}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>
                                  ) : (
                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Permanent Address</b>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box> -- </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>
                                  )}

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Native Place</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.nativePlace ? user.nativePlace : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Citizenship</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.citizenship ? user.citizenship : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Willing to go to Abroad</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.willingToGoAbroad == 1 ? 'Yes' : 'No'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Visa Status</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.visaStatus ? user.visaStatus : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>


                                  {(user.customFields && user.customFields?.length > 0) &&
                                    <>
                                      {user.customFields.map((customfield: any, ind: any) => (


                                        <div key={ind}>
                                          {customfield.completeprofilesectioname == "Address Details" &&
                                            <Grid container>
                                              <Grid item xs={12} sm={5} md={5}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <b>{customfield.displayName}</b>{' '}
                                                    {/* <Box sx={{ pl: 9.1 }}>
                                              {customfield.value}
                                            </Box> */}
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={12} sm={7} md={7}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <Box>
                                                      {customfield.value ? customfield.value : '--'}
                                                    </Box>
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                            </Grid>}
                                        </div>
                                      ))}</>}

                                </Card>
                                <Card style={card}>
                                  <h4 style={heading}>Education & Career Details</h4>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Education Type</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.educationType ? user.educationType : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Education</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.education ? user.education : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Education Medium</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.educationMedium ? user.educationMedium : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Is working </b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.areYouWorking == 1 ? 'Yes' : 'NO'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Occupation</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.occupation ? user.occupation : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Business Name</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.businessName ? user.businessName : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Designation</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.designation ? user.designation : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Working With</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.employmentType ? user.employmentType : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Company Name</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.companyName ? user.companyName : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Annual Income</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.annualIncome
                                            ? user.annualIncome
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>

                                  {(user.customFields && user.customFields?.length > 0) &&
                                    <>
                                      {user.customFields.map((customfield: any, ind: any) => (


                                        <div key={ind}>
                                          {customfield.completeprofilesectioname == "Education & Career Details" &&
                                            <Grid container>
                                              <Grid item xs={12} sm={5} md={5}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <b>{customfield.displayName}</b>{' '}
                                                    {/* <Box sx={{ pl: 9.1 }}>
                                              {customfield.value}
                                            </Box> */}
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={12} sm={7} md={7}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <Box>
                                                      {customfield.value}
                                                    </Box>
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                            </Grid>}
                                        </div>
                                      ))}</>}

                                </Card>

                                {isEnableLifeStyles == true &&
                                  <Card style={card}>
                                    <h4 style={heading}>Life Style</h4>

                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Diet </b>{' '}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box>
                                            {user.diet ? user.diet : '--'}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>

                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Smoking</b>{' '}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box>
                                            {user.smoking ? user.smoking : '--'}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>

                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Drink</b>{' '}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box>
                                            {user.drinking ? user.drinking : '--'}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>

                                    {(user.customFields && user.customFields?.length > 0) &&
                                      <>
                                        {user.customFields.map((customfield: any, ind: any) => (


                                          <div key={ind}>
                                            {customfield.completeprofilesectioname == "Basic Details" &&
                                              <Grid container>
                                                <Grid item xs={12} sm={5} md={5}>
                                                  <Typography gutterBottom variant="h6">
                                                    <Box display="flex" alignItems="flex-start">
                                                      <b>{customfield.displayName}</b>{' '}
                                                      {/* <Box sx={{ pl: 9.1 }}>
                                              {customfield.value}
                                            </Box> */}
                                                    </Box>
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={7} md={7}>
                                                  <Typography gutterBottom variant="h6">
                                                    <Box display="flex" alignItems="flex-start">
                                                      <Box>
                                                        {customfield.value ? customfield.value : '--'}
                                                      </Box>
                                                    </Box>
                                                  </Typography>
                                                </Grid>
                                              </Grid>}
                                          </div>
                                        ))}</>}

                                  </Card>
                                }

                                {isEnableAstrologicDetails == true &&
                                  <Card style={card}>
                                    <h4 style={heading}>Astrologic Details</h4>

                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Horoscope Belief</b>{' '}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box>
                                            {user.horoscopeBelief == 1 ? 'Yes' : 'No'}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>

                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Birth Country</b>{' '}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box>
                                            {user.birthCountryName ? user.birthCountryName : '--'}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>

                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Birth City</b>{' '}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box>
                                            {user.birthCityName ? user.birthCityName : '--'}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>
                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Zodiac Sign</b>{' '}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box>
                                            {user.zodiacSign ? user.zodiacSign : '--'}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>
                                    <Typography gutterBottom variant="h6">
                                      <Grid container>
                                        <Grid item xs={12} sm={5} md={5}>
                                          <Box display="flex" alignItems="flex-start">
                                            <b>Time Of Birth</b>{' '}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={7} md={7}>
                                          <Box>
                                            {user.timeOfBirth ? user.timeOfBirth : '--'}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>

                                    {(user.customFields && user.customFields?.length > 0) &&
                                      <>
                                        {user.customFields.map((customfield: any, ind: any) => (


                                          <div key={ind}>
                                            {customfield.completeprofilesectioname == "Basic Details" &&
                                              <Grid container>
                                                <Grid item xs={12} sm={5} md={5}>
                                                  <Typography gutterBottom variant="h6">
                                                    <Box display="flex" alignItems="flex-start">
                                                      <b>{customfield.displayName}</b>{' '}
                                                      {/* <Box sx={{ pl: 9.1 }}>
                                              {customfield.value}
                                            </Box> */}
                                                    </Box>
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={7} md={7}>
                                                  <Typography gutterBottom variant="h6">
                                                    <Box display="flex" alignItems="flex-start">
                                                      <Box>
                                                        {customfield.value ? customfield.value : '--'}
                                                      </Box>
                                                    </Box>
                                                  </Typography>
                                                </Grid>
                                              </Grid>}
                                          </div>
                                        ))}</>}

                                  </Card>
                                }

                              </Grid>

                              <Grid item xs={12} sm={4} md={4} style={{ paddingRight: "25px" }}>
                                <Card style={card}>
                                  <h4 style={heading}>Partner Preference</h4>

                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>From Age</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pFromAge
                                            ? user.pFromAge
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>To Age</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pToAge
                                            ? user.pToAge
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>From Height</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pFromHeight
                                            ? user.pFromHeight
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>To Height</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pToHeight
                                            ? user.pToHeight
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Marital Status</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pmaritalStatus
                                            ? user.pMaritalStatus
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Profile With Children</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pProfileWithChildren == 0
                                            ? "Doesn's Matter"
                                            : (user.pProfileWithChildren == 1 ? 'yes' : 'No')}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Preferred Family Type</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pFamilyType
                                            ? user.pFamilyType
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Religion</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pReligions
                                            ? user.pReligions
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                               
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Mother Tongue</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pMotherTongue
                                            ? user.pMotherTongue
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Country Living in</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pCountries
                                            ? user.pCountries
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Communities</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pCommunities
                                            ? user.pCommunities
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>States</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pStates
                                            ? user.pStates
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>City</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pCity
                                            ? user.pCity
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Qualification</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pEducationType
                                            ? user.pEducationType
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Education Medium</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pEducationMedium
                                            ? user.pEducationMedium
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Profession</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pOccupation
                                            ? user.pOccupation
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Annual Income</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pAnnualIncome
                                            ? user.pAnnualIncome
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Diet</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pDiet
                                            ? user.pDiet
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Complexion</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pComplexion
                                            ? user.pComplexion.join(',')
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Body Type</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pBodyType
                                            ? user.pBodyType.join(',')
                                            : '--'}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Smoking Acceptance</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pSmokingAcceptance && (user.pSmokingAcceptance == 0)
                                            ? "Doesn'r matter"
                                            : (user.pSmokingAcceptance == 1 ? 'Yes' : 'No')}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Alcohol Acceptance</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pAlcoholAcceptance && (user.pAlcoholAcceptance == 0)
                                            ? "Doesn'r matter"
                                            : (user.pAlcoholAcceptance == 1 ? 'Yes' : 'No')}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>
                                  <Typography gutterBottom variant="h6">
                                    <Grid container>
                                      <Grid item xs={12} sm={5} md={5}>
                                        <Box display="flex" alignItems="flex-start">
                                          <b>Disability Acceptance</b>{' '}
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12} sm={7} md={7}>
                                        <Box>
                                          {user.pDisabilityAcceptance && (user.pDisabilityAcceptance == 0)
                                            ? "Doesn'r matter"
                                            : (user.pDisabilityAcceptance == 1 ? 'Yes' : 'No')}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Typography>


                                  {(user.customFields && user.customFields?.length > 0) &&
                                    <>
                                      {user.customFields.map((customfield: any, ind: any) => (


                                        <div key={ind}>
                                          {customfield.completeprofilesectioname == "Address Details" &&
                                            <Grid container>
                                              <Grid item xs={12} sm={5} md={5}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <b>{customfield.displayName}</b>{' '}
                                                    {/* <Box sx={{ pl: 9.1 }}>
                                              {customfield.value}
                                            </Box> */}
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={12} sm={7} md={7}>
                                                <Typography gutterBottom variant="h6">
                                                  <Box display="flex" alignItems="flex-start">
                                                    <Box>
                                                      {customfield.value ? customfield.value : '--'}
                                                    </Box>
                                                  </Box>
                                                </Typography>
                                              </Grid>
                                            </Grid>}
                                        </div>
                                      ))}</>}

                                </Card>

                              </Grid>
                            </Grid>

                            {/* <Grid item xs={12} sm={6} md={6}>
                              <Box style={{ padding: '16px' }}>
                                <Typography gutterBottom variant="h6">
                                  <Box display="flex" alignItems="flex-start">
                                    <b>User Wallet Amount </b>
                                    <Box sx={{ pl: 2.2 }}>
                                      ₹ {user.userWalletAmount
                                        ? user.userWalletAmount
                                        : '0.00'}
                                    </Box>
                                  </Box>
                                </Typography>
                              </Box>
                            </Grid> */}

                          </div>
                        ))}
                      </TableContainer>
                    </>
                  )}
                </TabPanel>
                <TabPanel value="2">
                  <Card style={{ height: 'calc(100vh - 377px)', margin: '1%' }}>
                    <div>
                      {isLoading ? (
                        <Loader1 title="Loading..." />
                      ) : (
                        <>
                          {reqSend && reqSend.length ? (
                            <>
                              <TableContainer
                                style={{
                                  height: 'calc(100vh - 453px)',
                                  overflow: 'auto'
                                }}
                              >
                                <Table stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Sr. No </TableCell>
                                      <TableCell> Name </TableCell>
                                      <TableCell>Contact No </TableCell>
                                      <TableCell>Email </TableCell>
                                      <TableCell>Date </TableCell>
                                      <TableCell align="right">
                                        Action{' '}
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {reqSend.map((user: any, index: any) => (
                                      <TableRow key={user.id}>
                                        <TableCell>
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {page * limitSend + index + 1}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={2}
                                          >
                                            {user.imageUrl ? (
                                              <Avatar
                                                src={
                                                  
                                                  user.imageUrl
                                                }
                                              ></Avatar>
                                            ) : (
                                              <Avatar>
                                                {user.firstName
                                                  ? user.firstName[0]
                                                  : null}
                                              </Avatar>
                                            )}
                                            <Typography
                                              variant="body1"
                                              fontWeight="bold"
                                              color="text.primary"
                                              gutterBottom
                                              noWrap
                                            >
                                              {user.firstName
                                                ? user.firstName
                                                : null}{' '}
                                              {user.lastName}
                                            </Typography>
                                          </Stack>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {user.contactNo
                                              ? user.contactNo
                                              : '--'}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {user.email}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {format(
                                              new Date(user.createdDate),
                                              dateData
                                            )}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            <Button
                                              style={{ textAlign: 'right' }}
                                              variant="outlined"
                                              size="small"
                                              onClick={(e) => {
                                                handleViewClick(
                                                  user.proposalUserId
                                                );
                                              }}
                                            >
                                              View Profile
                                            </Button>
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <Box p={2}>
                                <TablePagination
                                  component="div"
                                  count={rowSend} //totalrecords
                                  onPageChange={handlePageChange}
                                  onRowsPerPageChange={handleLimitChange}
                                  page={page}
                                  rowsPerPage={limitSend}
                                  rowsPerPageOptions={[10, 20, 30, 40]}
                                />
                              </Box>
                            </>
                          ) : (
                            <Paper
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                boxShadow: 'none',
                                height: 'calc(100vh - 453px)'
                              }}
                            // className="communitytableContainer"
                            >
                              <Typography variant="h5" paragraph>
                                Data not Found
                              </Typography>
                            </Paper>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                </TabPanel>
                <TabPanel value="3">
                  <Card style={{ height: 'calc(100vh - 377px)', margin: '1%' }}>
                    <div>
                      {isLoading ? (
                        <Loader1 title="Loading..." />
                      ) : (
                        <>
                          {reqGet && reqGet.length ? (
                            <>
                              <TableContainer
                                style={{
                                  height: 'calc(100vh - 453px)',
                                  overflow: 'auto'
                                }}
                              >
                                <Table stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Sr. NO </TableCell>
                                      <TableCell> Name </TableCell>
                                      <TableCell>Contact No </TableCell>
                                      <TableCell>Email </TableCell>
                                      <TableCell>Date </TableCell>
                                      <TableCell align="right">
                                        Action{' '}
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {reqGet.map((user: any, index: any) => (
                                      <TableRow key={user.id}>
                                        <TableCell>
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {page * limitGot + index + 1}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={2}
                                          >
                                            {user.imageUll ? (
                                              <Avatar
                                                src={
                                                  apiUrl.RREACT_APP_BASEURL + '/' +
                                                  user.imageUrl
                                                }
                                              ></Avatar>
                                            ) : (
                                              <Avatar>
                                                {user.firstName
                                                  ? user.firstName[0]
                                                  : null}
                                              </Avatar>
                                            )}
                                            <Typography
                                              variant="body1"
                                              fontWeight="bold"
                                              color="text.primary"
                                              gutterBottom
                                              noWrap
                                            >
                                              {user.firstName} {user.lastName}
                                            </Typography>
                                          </Stack>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {user.contactNo
                                              ? user.contactNo
                                              : '--'}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {user.email}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {format(
                                              new Date(user.createdDate),
                                              dateData
                                            )}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            <Button
                                              style={{ textAlign: 'right' }}
                                              variant="outlined"
                                              size="small"
                                              onClick={(e) => {
                                                handleViewClick(user.userId);
                                              }}
                                            >
                                              View Profile
                                            </Button>
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <Box p={2}>
                                <TablePagination
                                  component="div"
                                  count={rowGot} //totalrecords
                                  onPageChange={handlePageChangeGetRequest}
                                  onRowsPerPageChange={handleLimitChange}
                                  page={page}
                                  rowsPerPage={limitGot}
                                  rowsPerPageOptions={[10, 20, 30, 40]}
                                />
                              </Box>
                            </>
                          ) : (
                            <Paper
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                boxShadow: 'none',
                                height: 'calc(100vh - 453px)'
                              }}
                            // className="communitytableContainer"
                            >
                              <Typography variant="h5" paragraph>
                                Data not Found
                              </Typography>
                            </Paper>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                </TabPanel>
                <TabPanel value="4">
                  <Card style={{ height: 'calc(100vh - 377px)', margin: '1%' }}>
                    <div>
                      {isLoading ? (
                        <Loader1 title="Loading..." />
                      ) : (
                        <>
                          {userFav && userFav.length ? (
                            <>
                              <TableContainer
                                style={{
                                  height: 'calc(100vh - 453px)',
                                  overflow: 'auto'
                                }}
                              >
                                <Table stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Sr. NO </TableCell>
                                      <TableCell> Name </TableCell>
                                      <TableCell>Contact No </TableCell>
                                      <TableCell>Email </TableCell>
                                      <TableCell>Date </TableCell>
                                      <TableCell align="right">
                                        Action{' '}
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {userFav.map((user: any, index: any) => (
                                      <TableRow key={user.id}>
                                        <TableCell>
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {page * limitFav + index + 1}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={2}
                                          >
                                            {user.imageUrl ? (
                                              <Avatar
                                                src={
                                                  
                                                  user.imageUrl
                                                }
                                              ></Avatar>
                                            ) : (
                                              <Avatar>
                                                {user.firstName
                                                  ? user.firstName[0]
                                                  : null}
                                              </Avatar>
                                            )}
                                            <Typography
                                              variant="body1"
                                              fontWeight="bold"
                                              color="text.primary"
                                              gutterBottom
                                              noWrap
                                            >
                                              {user.firstName
                                                ? user.firstName
                                                : null}{' '}
                                              {user.lastName}
                                            </Typography>
                                          </Stack>
                                        </TableCell>
                                        {/* <TableCell>
                                              <Typography variant="h4" gutterBottom >
                                              </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                              <Typography variant="h4" gutterBottom >
                                              </Typography>
                                            </TableCell> */}
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {user.contactNo
                                              ? user.contactNo
                                              : '--'}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {user.email}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {format(
                                              new Date(user.createdDate),
                                              dateData
                                            )}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            <Button
                                              style={{ textAlign: 'right' }}
                                              variant="outlined"
                                              size="small"
                                              onClick={(e) => {
                                                handleViewClick(user.favUserId);
                                              }}
                                            >
                                              View Profile
                                            </Button>
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <Box p={2}>
                                <TablePagination
                                  component="div"
                                  count={rowFav} //totalrecords
                                  onPageChange={handlePageChangeUserFavourite}
                                  onRowsPerPageChange={handleLimitChange}
                                  page={page}
                                  rowsPerPage={limitFav}
                                  rowsPerPageOptions={[10, 20, 30, 40]}
                                />
                              </Box>
                            </>
                          ) : (
                            <Paper
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                boxShadow: 'none',
                                height: 'calc(100vh - 453px)'
                              }}
                            // className="communitytableContainer"
                            >
                              <Typography variant="h5" paragraph>
                                Data not Found
                              </Typography>
                            </Paper>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                </TabPanel>
                <TabPanel value="5">
                  <Card style={{ height: 'calc(100vh - 377px)', margin: '1%' }}>
                    <div>
                      {isLoading ? (
                        <Loader1 title="Loading..." />
                      ) : (
                        <>
                          {blockUser && blockUser.length ? (
                            <>
                              <TableContainer
                                style={{
                                  height: 'calc(100vh - 453px)',
                                  overflow: 'auto'
                                }}
                              >
                                <Table stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Sr. NO </TableCell>
                                      <TableCell> Name </TableCell>
                                      <TableCell>Contact No </TableCell>
                                      <TableCell>Email </TableCell>
                                      <TableCell>Date </TableCell>
                                      <TableCell align="right">
                                        Action{' '}
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {blockUser.map((user: any, index: any) => (
                                      <TableRow key={user.id}>
                                        <TableCell>
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {page * limitblock + index + 1}
                                          </Typography>
                                        </TableCell>
                                        {user.firstName ? (
                                          <TableCell>
                                            <Stack
                                              direction="row"
                                              alignItems="center"
                                              spacing={2}
                                            >
                                              {user.imageUrl ? (
                                                <Avatar
                                                  src={
                                                    
                                                    user.imageUrl
                                                  }
                                                ></Avatar>
                                              ) : (
                                                <Avatar>
                                                  {user.firstName
                                                    ? user.firstName[0]
                                                    : null}
                                                </Avatar>
                                              )}
                                              <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                              >
                                                {user.firstName} {user.lastName}
                                              </Typography>
                                            </Stack>
                                          </TableCell>
                                        ) : (
                                          <TableCell>
                                            <Stack
                                              direction="row"
                                              alignItems="center"
                                              spacing={2}
                                            >
                                              {user.imageUrl ? (
                                                <Avatar
                                                  src={
                                                    
                                                    user.imageUrl
                                                  }
                                                ></Avatar>
                                              ) : (
                                                <Avatar>
                                                  {user.firstName
                                                    ? user.firstName[0]
                                                    : null}
                                                </Avatar>
                                              )}
                                              <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                              >
                                                --
                                              </Typography>
                                            </Stack>
                                          </TableCell>
                                        )}
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {user.contactNo
                                              ? user.contactNo
                                              : '--'}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {user.email}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {format(
                                              new Date(user.createdDate),
                                              dateData
                                            )}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            <Button
                                              style={{ textAlign: 'right' }}
                                              variant="outlined"
                                              size="small"
                                              onClick={(e) => {
                                                handleViewClick(
                                                  user.userBlockId
                                                );
                                              }}
                                            >
                                              View Profile
                                            </Button>
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <Box p={2}>
                                <TablePagination
                                  component="div"
                                  count={rowBlock} //totalrecords
                                  onPageChange={handlePageChangeBlockUser}
                                  onRowsPerPageChange={handleLimitChange}
                                  page={page}
                                  rowsPerPage={limitblock}
                                  rowsPerPageOptions={[10, 20, 30, 40]}
                                />
                              </Box>
                            </>
                          ) : (
                            <Paper
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                boxShadow: 'none',
                                height: 'calc(100vh - 453px)'
                              }}
                            // className="communitytableContainer"
                            >
                              <Typography variant="h5" paragraph>
                                Data not Found
                              </Typography>
                            </Paper>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                </TabPanel>
                <TabPanel value="6">
                  <Card style={{ height: 'calc(100vh - 377px)', margin: '1%' }}>
                    <div>
                      {isLoading ? (
                        <Loader1 title="Loading..." />
                      ) : (
                        <>
                          {userPackages && userPackages.length ? (
                            <>
                              <TableContainer
                                style={{
                                  height: 'calc(100vh - 453px)',
                                  overflow: 'auto'
                                }}
                              >
                                <Table stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Sr. NO </TableCell>
                                      <TableCell>Package </TableCell>
                                      <TableCell>Start Date </TableCell>
                                      <TableCell>End Date </TableCell>
                                      <TableCell>Amount </TableCell>
                                      <TableCell>Status </TableCell>
                                      <TableCell align="right">
                                        Action{' '}
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {userPackages.map((userPackage: any, index: any) => (
                                      <TableRow key={userPackage.id}>
                                        <TableCell>
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {page * limitUserPackages + index + 1}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {userPackage.packageName
                                              ? userPackage.packageName + "(" + userPackage.value + " Month)"
                                              : '--'}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {format(
                                              new Date(userPackage.startDate),
                                              dateData
                                            )}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {format(
                                              new Date(userPackage.endDate),
                                              dateData
                                            )}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            ₹{userPackage.netAmount}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {userPackage.status === 'Override' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#919eab", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                            {userPackage.status === 'Active' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#53bc5b", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                            {/* {userPackage.status === 'Shipped' && <Typography sx={{ color: "white", backgroundColor: "#1565c0" }}>{userPackage.status}</Typography>} */}
                                            {userPackage.status === 'Upcomming' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#fcde2a", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                            {userPackage.status === 'Expired' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#e20700", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                            {userPackage.status === 'Pending' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#fc7b2a", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {userPackage.status == "pending" ? <Button
                                              style={{ textAlign: 'right' }}
                                              variant="outlined"
                                              size="small"
                                              onClick={(e) => {
                                                handleOpenActivePackageDialog(
                                                  userPackage.id
                                                );
                                              }}
                                            >
                                              Active Package
                                            </Button> : <></>}

                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <Box p={2}>
                                <TablePagination
                                  component="div"
                                  count={rowUserPackages} //totalrecords
                                  onPageChange={handlePageChangeUserPackage}
                                  onRowsPerPageChange={handleLimitChange}
                                  page={page}
                                  rowsPerPage={limitblock}
                                  rowsPerPageOptions={[10, 20, 30, 40]}
                                />
                              </Box>
                            </>
                          ) : (
                            <Paper
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                boxShadow: 'none',
                                height: 'calc(100vh - 453px)'
                              }}
                            // className="communitytableContainer"
                            >
                              <Typography variant="h5" paragraph>
                                Data not Found
                              </Typography>
                            </Paper>
                          )}
                        </>
                      )}
                    </div>
                    <div>
                      <Dialog
                        open={isActivePackage}
                        onClose={handleCloseActivePackageDialog}
                        fullWidth
                        maxWidth="md"
                      >
                        <DialogTitle
                          sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
                        >
                          Active Dialog
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText
                            style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
                          >
                            <Grid container spacing={2}>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Payment Refererence No"
                                type="text"
                                fullWidth
                                variant="outlined"
                                name="name"
                                value={paymentRefNo}
                                onChange={(arr) => {
                                  handleInputChange(arr);
                                }}
                              />
                            </Grid>
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseActivePackageDialog} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                          <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleActiveUserPackage} variant="outlined" style={{ marginRight: '10px' }}>Aproved</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </Card>
                </TabPanel>
                <TabPanel value="7">
                  <div>
                    {users.map((user: any, index: any) => (
                      <div key={index}>
                        <div>
                          {user.userDocuments && user.userDocuments.length > 0 &&
                            <>
                              <h3>Documents</h3>
                              <Grid container>
                                {user.userDocuments.map((doc: AppUserDocuments, index: number) => (
                                  <Grid key={doc.id} item style={{ width: "30%" }}>

                                    {/* {doc.documentTypeName} */}
                                    <div style={{ marginRight: '10px' }}>
                                      {errorArray[index] ? (
                                        <img src="/defaultDocument.jpg" alt="Default Image" style={{ height: 'calc(100vh - 738px)', marginRight: '10px', objectFit: 'cover', width: '100%' }} />
                                      ) : (
                                        <a href={ doc.documentUrl} target="_blank" rel="noopener noreferrer">
                                          <img src={ doc.documentUrl} style={{ height: 'calc(100vh - 738px)', marginRight: '10px', objectFit: 'cover', width: '100%' }} onError={() => { handleImageError(doc, index); doc.isError = true; }}></img>
                                        </a>
                                      )}
                                      <br></br>
                                      {doc.documentTypeName}
                                      <br></br>
                                      {!doc.isVerified ?
                                        // <Button className="buttonLarge" disabled={credentail?.email === "demo@admin.com"}
                                        //   variant="contained" size="small" onClick={() => { handleApprovedDocument(doc) }}>Verify</Button>
                                        <Button className="buttonLarge" disabled={credentail?.email === "demo@admin.com"}
                                          variant="contained" size="small" onClick={() => { handleClickOpenDoc(doc) }}>Verify</Button>
                                        : <span style={{ color: '#1fb71f' }}>Verified</span>
                                      }
                                      <Button className="buttonLarge" disabled={credentail?.email === "demo@admin.com"}
                                        variant="contained" size="small" style={{ marginLeft: '10px' }}>
                                        <a href={ doc.documentUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>
                                          View
                                        </a>
                                      </Button>
                                    </div>
                                  </Grid>

                                ))}
                              </Grid>
                            </>
                          }

                        </div>
                      </div>
                    ))}

                  </div>

                  {/* <Card style={{ height: 'calc(100vh - 377px)', margin: '1%' }}>
                    <div>
                      {isLoading ? (
                        <Loader1 title="Loading..." />
                      ) : (
                        <>
                          {userPackages && userPackages.length ? (
                            <>
                              <TableContainer
                                style={{
                                  height: 'calc(100vh - 453px)',
                                  overflow: 'auto'
                                }}
                              >
                                <Table stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Id </TableCell>
                                      <TableCell>Package </TableCell>
                                      <TableCell>Start Date </TableCell>
                                      <TableCell>End Date </TableCell>
                                      <TableCell>Amount </TableCell>
                                      <TableCell>Status </TableCell>
                                      <TableCell align="right">
                                        Action{' '}
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {userPackages.map((userPackage: any, index: any) => (
                                      <TableRow key={userPackage.id}>
                                        <TableCell>
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {page * limitUserPackages + index + 1}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {userPackage.packageName
                                              ? userPackage.packageName + "(" + userPackage.value + " Month)"
                                              : '--'}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {format(
                                              new Date(userPackage.startDate),
                                              dateData
                                            )}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {format(
                                              new Date(userPackage.endDate),
                                              dateData
                                            )}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            ₹{userPackage.netAmount}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {userPackage.status === 'Override' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#919eab", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                            {userPackage.status === 'Active' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#53bc5b", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                            {userPackage.status === 'Expired' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#e20700", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                            {userPackage.status === 'Pending' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#fc7b2a", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {userPackage.status == "pending" ? <Button
                                              style={{ textAlign: 'right' }}
                                              variant="outlined"
                                              size="small"
                                              onClick={(e) => {
                                                handleOpenActivePackageDialog(
                                                  userPackage.id
                                                );
                                              }}
                                            >
                                              Active Package
                                            </Button> : <></>}

                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <Box p={2}>
                                <TablePagination
                                  component="div"
                                  count={rowUserPackages}
                                  onPageChange={handlePageChangeUserPackage}
                                  onRowsPerPageChange={handleLimitChange}
                                  page={page}
                                  rowsPerPage={limitblock}
                                  rowsPerPageOptions={[10, 20, 30, 40]}
                                />
                              </Box>
                            </>
                          ) : (
                            <Paper
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                boxShadow: 'none',
                                height: 'calc(100vh - 453px)'
                              }}
                            >
                              <Typography variant="h5" paragraph>
                                Data not Found
                              </Typography>
                            </Paper>
                          )}
                        </>
                      )}
                    </div>
                    <div>
                      <Dialog
                        open={isActivePackage}
                        onClose={handleCloseActivePackageDialog}
                        fullWidth
                        maxWidth="md"
                      >
                        <DialogTitle
                          sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
                        >
                          Active Dialog
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText
                            style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
                          >
                            <Grid container spacing={2}>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Payment Refererence No"
                                type="text"
                                fullWidth
                                variant="outlined"
                                name="name"
                                value={paymentRefNo}
                                onChange={(arr) => {
                                  handleInputChange(arr);
                                }}
                              />
                            </Grid>
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseActivePackageDialog}>Cancel</Button>
                          <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleActiveUserPackage}>Aproved</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </Card> */}
                </TabPanel>
              </TabContext>
            </Card>
            <div>
              <Dialog
                open={isDocumentVerification}
                onClose={handleDocumentVerificationClose}
                fullWidth
                maxWidth="xs"
              >
                <DialogTitle
                  sx={{
                    m: 0,
                    p: 2,
                    fontSize: '16px',
                    fontWeight: 'bolder',
                    // borderBottom: '1px solid #ddd'
                  }}
                >
                  Are you sure you want to approve this document?
                </DialogTitle>
                <DialogContent>


                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDocumentVerificationClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                  <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => {
                    handleApprovedDocument()
                  }} variant="outlined" style={{ marginRight: '10px' }}>Verify</Button>

                </DialogActions>
              </Dialog>
            </div>
          </Grid>
        </Grid>
      </Container >
      {/* <div>
        <Dialog
          open={isVerifyProfile}
          onClose={handleVerifyProfilePicClose}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              fontSize: '20px',
              fontWeight: 'bolder'
            }}
          >
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{
                fontSize: '1rem',
                letterSpacing: '0.00938em'
              }}
            >
              Are You sure you want to verify user profile?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleVerifyProfilePicClose}>Cancel</Button>
            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleVerifyProfile}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div> */}
    </>
  );
}

export default ManagementUserProfile;
