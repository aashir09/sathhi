import {
  Button,
  Card,
  Stack,
  Typography,
  FormHelperText,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Box,
  styled,
  Link,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Tooltip,
  Avatar,
  CircularProgress
} from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Form, Container, Col, Row, InputGroup } from 'react-bootstrap';
import { ChangeEvent, useEffect, useState } from 'react';
import APIservice from '../../../utils/APIservice';
import validator from 'validator';
import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../dashboards/Crypto/dashboard.css';
import Logo from 'src/components/LogoSign';
import { Helmet } from 'react-helmet-async';
import LoaderLogin from './LoaderLogin';
import QRCode from 'react-qr-code';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
// import { saveAs } from 'file-saver';

const OverviewWrapper = styled(Box)(
  () => `
    overflow: auto;
    flex: 1;
    overflow-x: hidden;
    align-items: center;
`
);
const steps = ['MYSQL Configuration', 'Setup Database', 'Setup Complete'];
const initialState = {
  email: '',
  password: ''
};

const initialDefaultState = {
  email: '',
};

const initialDefaultPasswordState = {
  password: '',
};

const initialAuthenticationCodeState = {
  twoFactorCode: '',
};

const initialHostState = {
  'MYSQL_HOST': '',
  'MYSQL_DATABASE': 'matrimony_app',
  'MYSQL_USER': '',
  'MYSQL_PASSWORD': '',
  'MYSQL_PORT': '',
  'password': '',
  'username': 'matrimony_user'
};


const styles = {
  heading4: `text-base text-ct-blue-600 font-medium border-b mb-2`,
  orderedList: `space-y-1 text-sm list-decimal`,
};

function Login() {
  const [login, setLogin] = React.useState<any>(initialState);
  const [isEmailValidateError, setIsEmailValidateError] = useState(false);
  const [emailValidateErrorMsg, setEmailValidateErrorMsg] = useState('');
  const [isPasswordValidateError, setIsPasswordValidateError] = useState(false);
  const [passwordValidateErrorMsg, setPasswordValidateErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [changeEmail, setChangeEmail] = React.useState<any>(initialDefaultState);
  const [isChangeEmailValidateError, setIsChangeEmailValidateError] = useState(false);
  const [changeEmailValidateErrorMsg, setChangeEmailValidateErrorMsg] = useState('');
  const [isChangeEmail, setIsChangeEmail] = useState(false);

  const [changePassword, setChangePassword] = React.useState<any>(initialDefaultPasswordState);
  const [isChangePasswordValidateError, setIsChangePasswordValidateError] = useState(false);
  const [changePasswordValidateErrorMsg, setChangePasswordValidateErrorMsg] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [is2FAQRCode, setIs2FAQRCode] = useState(false);
  const [is2FAEnter, setIs2FAEnter] = useState(false);
  const [isConfiguration, setIsConfiguration] = useState(false);
  const [isUrlErrorMsg, setIsUrlErrorMsg] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [isTakeHostData, setIsTakeHostData] = useState(false);
  const [hostData, setHostInput] = React.useState<any>(initialHostState);

  const [email, setEmail] = useState('');

  const [isAuthenticationCodeError, setIsAuthenticationCodeErrorError] = useState(false);
  const [authenticationCodeErrorMsg, setAuthenticationCodeErrorMsg] = useState('');
  const [authenticationCode, setAuthenticationCode] = React.useState<any>(initialAuthenticationCodeState);

  const [refreshToken, setRefreshToken] = useState<any>();
  const [sessionToken, setSessionToken] = useState<any>();
  const [userId, setUserId] = useState<any>();
  const [crendientials, setCrendientials] = useState<any>();
  const [defaultCurrency, setDefaultCurrency] = useState<any>();

  const [qrcodeUrl, setqrCodeUrl] = useState("");
  const [base32, setBase32] = useState("");
  const [isTested, setIsTeseted] = useState(false);
  const [version, setVersion] = useState(null);
  const [isInstallSuccessfully, setIsInstallSucessfully] = useState(false)
  const [ismasterData, setIsMasterData] = useState(false);
  const [isSampleData, setIsSampleData] = useState(false);
  const [isSetupdatabase, setIsSetUpDatabase] = useState(false);
  const [databaseState, setDatabaseState] = useState('creating');
  const [masterdataState, setMasterdataState] = useState('creating');
  const [sampledataState, setSampledataState] = useState('creating');
  let [isInstallMasterData, setIsInstallMasterData] = useState(false);
  const [isPreviousVersionInstalled, setPreviousVersionInstalled] = useState('false');
  const [isAPIUrlValidation, setIsAPIUrlValidation] = useState(false);
  const [isHostRequired, setIsHostRequired] = useState(false);
  const [isUserRequired, setIsUserRequired] = useState(false);
  const [isPORTRequired, setIsPortRequired] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isVersionSelectionRequired, setIsVersionRequired] = useState(false);
  const [isDatabaseSelectionRequired, setIsDatabaseRequired] = useState(false);
  let [isInstalledSampleData, setIsInstallSampleData] = useState(false);
  let [databases, setDatabases] = useState([]);
  const [isCreatedatabaseUser, setIsCreateDatabaseUser] = useState(false);
  const [isRestartServerRequired, setIsRestartServerRequired] = useState(true);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const onFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLogin({ ...login, [name]: value });
  };

  const validateEmail = (e: any) => {
    const { name, value } = e.target;
    if (value) {
      // if (validator.isEmail(e.target.value)) {
      setIsEmailValidateError(false);
      setEmailValidateErrorMsg('');
      // } else {
      //   setIsEmailValidateError(true);
      //   setEmailValidateErrorMsg('Invalid Email');
      // }
    } else {
      setIsEmailValidateError(true);
      setEmailValidateErrorMsg('Email is Required');
    }
  };

  const handleCopy = () => {
    const cred = "UserName:" + this.userName + "\n" + "Password:" + this.password;
    navigator.clipboard.writeText(cred).then(() => {
      alert('Text copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const mediumRegex = new RegExp(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})'
  );
  const ValidatePassword = (e: any) => {
    const { name, value } = e.target;
    if (value) {
      // if (mediumRegex.test(e.target.value)) {
      setIsPasswordValidateError(false);
      setPasswordValidateErrorMsg('');
      // } else {
      //   setIsPasswordValidateError(true);
      //   setPasswordValidateErrorMsg('The password must be more than 8 characters and contain both letters and numbers.');
      // }
    } else {
      setIsPasswordValidateError(true);
      setPasswordValidateErrorMsg('Password is Required');
    }
  };

  const validateForm = (event: any) => {
    event.preventDefault();
    var flag = true;
    if (!login.email) {
      setIsEmailValidateError(true);
      setEmailValidateErrorMsg('Email is Required');
      flag = false;
    } else {
      if (validator.isEmail(login.email)) {
        setIsEmailValidateError(false);
        setEmailValidateErrorMsg('');
        flag = true;
      } else {
        setIsEmailValidateError(true);
        setEmailValidateErrorMsg('Invalid Email');
        flag = false;
      }
    }
    if (!login.password) {
      setIsPasswordValidateError(true);
      setPasswordValidateErrorMsg('Password is Required');
      flag = false;
    } else {
      if (mediumRegex.test(login.password)) {
        setIsPasswordValidateError(false);
        setPasswordValidateErrorMsg('');
        flag = true;
      } else {
        setIsPasswordValidateError(true);
        setPasswordValidateErrorMsg('Password is Required');
        flag = false;
      }
    }
    return flag;
  };

  useEffect(() => {
  
    getConfiguration();
    // console.log(APIservice.config.apiUrl);

    // if (APIservice.config && APIservice.config.apiUrl === '<Your_API_Url>') {
    //   setIsConfiguration(true);
    //   setIsLogin(false)
    // }
    // else {
    //   loadJson();
    //   // getConfiguration();
    // }

  }, []);

  const loadJson = async () => {
    try {
      // const response = await fetch('/admin/variable.json');

      // if (!response.ok) {
      //   console.log("File does not exist or is not accessible.");
      //   return;
      // }

      // const contentType = response.headers.get('content-type');
      // if (!contentType || !contentType.includes('application/json')) {
      //   console.log("File does not exist or is not in JSON format.");
      //   return;
      // }

      // const jsonData = await response.json();

      // if (Object.keys(jsonData).length > 0) {
      //   if (jsonData.REACT_APP_BASEURL == '<YOUR_API_URL>') {
      //     setIsConfiguration(true);
      //   }
      //   else {
      //     setApiUrl(jsonData.REACT_APP_BASEURL);
      //     getConfiguration();
      //   }
      // } else {
      //   console.log("File exists but has no data.");
      // }
    } catch (error) {
      console.error("Error checking file data:", error);
    }
    // debugger;
    // const response = await fetch('/variable.json'); // Adjust the file path as needed
    // if (response && response.status == 200) {
    //   const data = await response.json();
    //   if (Object.keys(data).length > 0) {
    //     setApiUrl(data.REACT_APP_BASEURL);
    //   }

    // }
    // const response = await fetch('/variable.json');
    // const jsonData = await response.json();
    // if (Object.keys(jsonData).length > 0) {
    //   setApiUrl(jsonData.REACT_APP_BASEURL);
    // } else {
    //  setActiveStep(0);
    // }
    // const data = await response.json();

    // setApiUrl(data.REACT_APP_BASEURL);
    // const response = await fetch('/variable.json');

    // if (!response.ok) {
    //   console.log("File does not exist or is not accessible.");
    //   return;
    // }

    // const contentType = response.headers.get('content-type');
    // if (!contentType || !contentType.includes('application/json')) {
    //   console.log("File does not exist or is not in JSON format.");
    //   return;
    // }

    // const jsonData = await response.json();

    // if (Object.keys(jsonData).length > 0) {
    //   setApiUrl(jsonData.REACT_APP_BASEURL)
    // } else {
    //   console.log("File exists but has no data.");
    // }
  }


  const handlesubmit = async (event: any) => {
    event.preventDefault();
    var flag = validateForm(event);
    if (flag) {
      try {
        const res = await APIservice.httpPost('/api/admin/users/login', login);
        if (res && res.status == 200) {
          setEmail(login.email);
          setRefreshToken(res.recordList[0].refreshToken);
          setSessionToken(res.recordList[0].token);
          setUserId(res.recordList[0].id);
          let detail: any;
          detail = res.recordList[0];
          setCrendientials(res.recordList[0]);
          localStorage.setItem('DefaultCurrency', JSON.stringify(res.recordList[0].defaultCurrency[0]));
          let isFirstLogin = JSON.parse(localStorage.getItem('isFirstLogin'));
          // if(!isFirstLogin) {

          // }
          isFirstLogin = (isFirstLogin == false) ? false : true;
          if (login.email === "admin@admin.com" && isFirstLogin) {
            setIsLogin(false);
            setIsChangeEmail(true);
            setIsChangePassword(false);
            setIs2FAOpen(false);
            setIs2FAQRCode(false);
            setIs2FAEnter(false);
          } else if (login.password === "Demo@1234" && isFirstLogin) {
            setIsLogin(false);
            setIsChangeEmail(false);
            setIsChangePassword(true);
            setIs2FAOpen(false);
            setIs2FAQRCode(false);
            setIs2FAEnter(false);
          } else {
            if (detail.isTwoFactorEnable) {
              //Enable 2FA
              setIsLogin(false);
              setIsChangeEmail(false);
              setIsChangePassword(false);
              setIs2FAQRCode(false);
              setIs2FAEnter(false);
              setIs2FAOpen(true);
            } else {
              if (detail.isTwoFactorEnable == false) {
                localStorage.setItem('RefreshToken', res.recordList[0].refreshToken);
                localStorage.setItem('SessionToken', res.recordList[0].token);
                localStorage.setItem('UserId', res.recordList[0].id);
                localStorage.setItem('Credentials', JSON.stringify(res.recordList[0]));
                localStorage.setItem('DefaultCurrency', JSON.stringify(res.recordList[0].defaultCurrency[0]));
                localStorage.setItem('isFirstLogin', JSON.stringify(false));
                // if (detail.roleId === 3 && detail.pagePermissions.length === 0) {
                //   navigate('/nopagepermission');
                // }
                // else {
                //   navigate('/admin/dashboard');
                // }
                // navigate('/admin/dashboard');
                updateFCMToken();
                const token = localStorage.getItem('SessionToken');
                const refreshToken = localStorage.getItem('RefreshToken');
                let response = await APIservice.httpPost(
                  '/api/admin/systemflags/getAdminSystemFlag',
                  {},
                  token,
                  refreshToken
                );
                console.log(response.recordList);

                let data = response.recordList[0].systemFlag[0].value;
                localStorage.setItem('DateFormat', data);

                let profilePicApproveIndex = response.recordList[0].systemFlag.findIndex(c => c.name === 'isUserProfilePicApprove');
                let isUserProfilePicApprove = response.recordList[0].systemFlag[profilePicApproveIndex].value;
                localStorage.setItem('isUserProfilePicApprove', isUserProfilePicApprove);
                // let customFieldIndex = response.recordList[4].group[0].systemFlag.findIndex(c => c.name === 'isEnableCustomFields');
                // let isEnableCustomFields = response.recordList[4].group[0].systemFlag[customFieldIndex].value;
                // localStorage.setItem('isEnableCustomFields', isEnableCustomFields);
                let _data = response.recordList;
                if (_data && _data.length > 0) {
                  for (let i = 0; i < _data.length; i++) {
                    for (let j = 0; j < _data[i].group.length; j++) {
                      if (_data[i].group[j].systemFlag && _data[i].group[j].systemFlag.length > 0) {
                        let customFieldIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableCustomFields');
                        if (customFieldIndex >= 0) {
                          let isEnableCustomFields = _data[i].group[j].systemFlag[customFieldIndex].value;
                          localStorage.setItem('isEnableCustomFields', isEnableCustomFields);
                        }

                        let profilePicApproveIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isUserProfilePicApprove');
                        if (profilePicApproveIndex >= 0) {
                          let isUserProfilePicApprove = _data[i].group[j].systemFlag[profilePicApproveIndex].value;
                          localStorage.setItem('isUserProfilePicApprove', isUserProfilePicApprove);
                        }

                        let familyIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableFamilyDetails');
                        if (familyIndex >= 0) {
                          let isEnableFamilyDetails = _data[i].group[j].systemFlag[familyIndex].value;
                          localStorage.setItem('isEnableFamilyDetails', isEnableFamilyDetails);
                        }

                        let astroIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableAstrologicDetails');
                        if (astroIndex >= 0) {
                          let isEnableAstrologicDetails = _data[i].group[j].systemFlag[astroIndex].value;
                          localStorage.setItem('isEnableAstrologicDetails', isEnableAstrologicDetails);
                        }

                        let lifeStyleIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableLifeStyles');
                        if (lifeStyleIndex >= 0) {
                          let isEnableLifeStyles = _data[i].group[j].systemFlag[lifeStyleIndex].value;
                          localStorage.setItem('isEnableLifeStyles', isEnableLifeStyles);
                        }

                        let communityIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableCommunity');
                        if (communityIndex >= 0) {
                          let isEnableCommunity = _data[i].group[j].systemFlag[communityIndex].value;
                          localStorage.setItem('isEnableCommunity', isEnableCommunity);
                        }

                        let subCommunityIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableSubCommunity');
                        if (subCommunityIndex >= 0) {
                          let isEnableSubCommunity = _data[i].group[j].systemFlag[subCommunityIndex].value;
                          localStorage.setItem('isEnableSubCommunity', isEnableSubCommunity);
                        }
                      }
                    }

                    if (_data[i].systemFlag && _data[i].systemFlag.length > 0) {
                      let customFieldIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableCustomFields');
                      if (customFieldIndex >= 0) {
                        let isEnableCustomFields = _data[i].systemFlag[customFieldIndex].value;
                        localStorage.setItem('isEnableCustomFields', isEnableCustomFields);
                      }

                      let profilePicApproveIndex = _data[i].systemFlag.findIndex(c => c.name === 'isUserProfilePicApprove');
                      if (profilePicApproveIndex >= 0) {
                        let isUserProfilePicApprove = _data[i].systemFlag[profilePicApproveIndex].value;
                        localStorage.setItem('isUserProfilePicApprove', isUserProfilePicApprove);
                      }

                      let familyIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableFamilyDetails');
                      if (familyIndex >= 0) {
                        let isEnableFamilyDetails = _data[i].systemFlag[familyIndex].value;
                        localStorage.setItem('isEnableFamilyDetails', isEnableFamilyDetails);
                      }

                      let astroIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableAstrologicDetails');
                      if (astroIndex >= 0) {
                        let isEnableAstrologicDetails = _data[i].systemFlag[astroIndex].value;
                        localStorage.setItem('isEnableAstrologicDetails', isEnableAstrologicDetails);
                      }

                      let lifeStyleIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableLifeStyles');
                      if (lifeStyleIndex >= 0) {
                        let isEnableLifeStyles = _data[i].systemFlag[lifeStyleIndex].value;
                        localStorage.setItem('isEnableLifeStyles', isEnableLifeStyles);
                      }

                      let communityIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableCommunity');
                      if (communityIndex >= 0) {
                        let isEnableCommunity = _data[i].systemFlag[communityIndex].value;
                        localStorage.setItem('isEnableCommunity', isEnableCommunity);
                      }

                      let subCommunityIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableSubCommunity');
                      if (subCommunityIndex >= 0) {
                        let isEnableSubCommunity = _data[i].systemFlag[subCommunityIndex].value;
                        localStorage.setItem('isEnableCommunity', isEnableSubCommunity);
                      }

                    }

                  }
                }
                if (detail.roleId === 3 && detail.pagePermissions.length === 0) {
                  navigate('/admin/nopagepermission');
                }
                else {
                  if (detail.roleId === 3 && detail.pagePermissions.length > 0) {
                    let index = (detail.pagePermissions.length - 1)
                    let page: any = detail.pagePermissions[index];
                    navigate(page.path)
                  }
                  else {
                    navigate('/admin/dashboard');
                  }
                }
              } else {
                //Setup 2FA
                setIsLogin(false);
                setIsChangeEmail(false);
                setIsChangePassword(false);
                setIs2FAOpen(true);
                setIs2FAQRCode(false);
                setIs2FAEnter(false);
              }
            }
          }
        } else if (res && res.status == 500) {
          toast.error('User does not exists!', {
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          });
        } else if (res.message === 'Password Mismatch') {
          toast.error('Invalid Credentials!', {
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          });
        }
      } catch (error: any) {
        console.error(error);
      }
    }
    history.go(1);
  };

  const updateFCMToken = async () => {
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      const fcmToken = sessionStorage.getItem('fcmToken');
      let response = await APIservice.httpPost(
        '/api/admin/users/updateFCMToken',
        { "fcmToken": fcmToken },
        token,
        refreshToken
      );
    } catch (error: any) {
      toast.error(error.message, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
    }
  }

  const validateChangeEmail = (e: any) => {
    const { name, value } = e.target;
    if (value) {
      if (validator.isEmail(e.target.value)) {
        setIsChangeEmailValidateError(false);
        setChangeEmailValidateErrorMsg('');
      } else {
        setIsChangeEmailValidateError(true);
        setChangeEmailValidateErrorMsg('Invalid Email');
      }
    } else {
      setIsChangeEmailValidateError(true);
      setChangeEmailValidateErrorMsg('Email is Required');
    }
  };

  const handleInputDefaultEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setChangeEmail({ ...changeEmail, [name]: value });
  };

  const handleupdateEmail = async (event: any) => {
    event.preventDefault();
    try {
      const token = sessionToken;//localStorage.getItem('SessionToken');
      // const refreshToken = localStorage.getItem('RefreshToken');
      const res = await APIservice.httpPost(
        '/api/admin/users/updateEmail',
        { "email": changeEmail.email },
        token,
        refreshToken
      );
      if (res.status === 200) {
        setEmail(changeEmail.email);
        setIsLogin(false);
        setIsChangeEmail(false);
        setIsChangePassword(true);
      } else if (res && res.status === 401) {
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
    } catch (error) {
      console.log(error);
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

  const skipUpdateEmail = async (event: any) => {
    setIsLogin(false);
    setIsChangeEmail(false);
    setIsChangePassword(true);
  }

  const ValidateChangePassword = (e: any) => {
    const { name, value } = e.target;
    if (value) {
      if (mediumRegex.test(e.target.value)) {
        setIsChangePasswordValidateError(false);
        setChangePasswordValidateErrorMsg('');
      } else {
        setIsChangePasswordValidateError(true);
        setChangePasswordValidateErrorMsg('Password is Required');
      }
    } else {
      setIsChangePasswordValidateError(true);
      setChangePasswordValidateErrorMsg('Password is Required');
    }
  };

  const handleInputDefaultPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setChangePassword({ ...changePassword, [name]: value });
  };

  const handleupdatePassword = async (event: any) => {
    event.preventDefault();
    try {
      const token = sessionToken;//localStorage.getItem('SessionToken');
      //const refreshToken = localStorage.getItem('RefreshToken');
      const res = await APIservice.httpPost(
        '/api/admin/users/updatePassword',
        { "password": changePassword.password },
        token,
        refreshToken
      );
      if (res.status === 200) {
        localStorage.setItem('isFirstLogin', JSON.stringify(false));
        setIsLogin(false);
        setIsChangeEmail(false);
        setIsChangePassword(false);
        setIs2FAOpen(true);
        setIs2FAQRCode(false);
        setIs2FAEnter(false);
      } else if (res && res.status === 401) {
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
    } catch (error) {
      console.log(error);
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

  const backUpdatePassword = async (event: any) => {
    setIsLogin(false);
    setIsChangeEmail(true);
    setIsChangePassword(false);
  }

  const skipUpdatePassword = async (event: any) => {
    localStorage.setItem('RefreshToken', refreshToken);
    localStorage.setItem('SessionToken', sessionToken);
    localStorage.setItem('UserId', userId);
    localStorage.setItem('Credentials', JSON.stringify(crendientials));
    localStorage.setItem('isFirstLogin', JSON.stringify(false));
    // navigate('/admin/dashboard');
    updateFCMToken();
    const token = sessionToken;
    let response = await APIservice.httpPost(
      '/api/admin/systemflags/getAdminSystemFlag',
      {},
      token,
      refreshToken
    );
    let data = response.recordList[0].systemFlag[0].value;
    localStorage.setItem('DateFormat', data);
    let _data = response.recordList;
    if (_data && _data.length > 0) {
      for (let i = 0; i < _data.length; i++) {
        for (let j = 0; j < _data[i].group.length; j++) {
          if (_data[i].group[j].systemFlag && _data[i].group[j].systemFlag.length > 0) {
            let customFieldIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableCustomFields');
            if (customFieldIndex >= 0) {
              let isEnableCustomFields = _data[i].group[j].systemFlag[customFieldIndex].value;
              localStorage.setItem('isEnableCustomFields', isEnableCustomFields);
            }

            let profilePicApproveIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isUserProfilePicApprove');
            if (profilePicApproveIndex >= 0) {
              let isUserProfilePicApprove = _data[i].group[j].systemFlag[profilePicApproveIndex].value;
              localStorage.setItem('isUserProfilePicApprove', isUserProfilePicApprove);
            }

            let familyIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableFamilyDetails');
            if (familyIndex >= 0) {
              let isEnableFamilyDetails = _data[i].group[j].systemFlag[familyIndex].value;
              localStorage.setItem('isEnableFamilyDetails', isEnableFamilyDetails);
            }

            let astroIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableAstrologicDetails');
            if (astroIndex >= 0) {
              let isEnableAstrologicDetails = _data[i].group[j].systemFlag[astroIndex].value;
              localStorage.setItem('isEnableAstrologicDetails', isEnableAstrologicDetails);
            }

            let lifeStyleIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableLifeStyles');
            if (lifeStyleIndex >= 0) {
              let isEnableLifeStyles = _data[i].group[j].systemFlag[lifeStyleIndex].value;
              localStorage.setItem('isEnableLifeStyles', isEnableLifeStyles);
            }

            let communityIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableCommunity');
            if (communityIndex >= 0) {
              let isEnableCommunity = _data[i].group[j].systemFlag[communityIndex].value;
              localStorage.setItem('isEnableCommunity', isEnableCommunity);
            }

            let subCommunityIndex = _data[i].group[j].systemFlag.findIndex(c => c.name === 'isEnableSubCommunity');
            if (subCommunityIndex >= 0) {
              let isEnableSubCommunity = _data[i].group[j].systemFlag[subCommunityIndex].value;
              localStorage.setItem('isEnableSubCommunity', isEnableSubCommunity);
            }
          }
        }

        if (_data[i].systemFlag && _data[i].systemFlag.length > 0) {
          let customFieldIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableCustomFields');
          if (customFieldIndex >= 0) {
            let isEnableCustomFields = _data[i].systemFlag[customFieldIndex].value;
            localStorage.setItem('isEnableCustomFields', isEnableCustomFields);
          }

          let profilePicApproveIndex = _data[i].systemFlag.findIndex(c => c.name === 'isUserProfilePicApprove');
          if (profilePicApproveIndex >= 0) {
            let isUserProfilePicApprove = _data[i].systemFlag[profilePicApproveIndex].value;
            localStorage.setItem('isUserProfilePicApprove', isUserProfilePicApprove);
          }

          let familyIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableFamilyDetails');
          if (familyIndex >= 0) {
            let isEnableFamilyDetails = _data[i].systemFlag[familyIndex].value;
            localStorage.setItem('isEnableFamilyDetails', isEnableFamilyDetails);
          }

          let astroIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableAstrologicDetails');
          if (astroIndex >= 0) {
            let isEnableAstrologicDetails = _data[i].systemFlag[astroIndex].value;
            localStorage.setItem('isEnableAstrologicDetails', isEnableAstrologicDetails);
          }

          let lifeStyleIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableLifeStyles');
          if (lifeStyleIndex >= 0) {
            let isEnableLifeStyles = _data[i].systemFlag[lifeStyleIndex].value;
            localStorage.setItem('isEnableLifeStyles', isEnableLifeStyles);
          }

          let communityIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableCommunity');
          if (communityIndex >= 0) {
            let isEnableCommunity = _data[i].systemFlag[communityIndex].value;
            localStorage.setItem('isEnableCommunity', isEnableCommunity);
          }

          let subCommunityIndex = _data[i].systemFlag.findIndex(c => c.name === 'isEnableSubCommunity');
          if (subCommunityIndex >= 0) {
            let isEnableSubCommunity = _data[i].systemFlag[subCommunityIndex].value;
            localStorage.setItem('isEnableCommunity', isEnableSubCommunity);
          }

        }

      }
    }
    // let profilePicApproveIndex = response.recordList[0].systemFlag.findIndex(c => c.name === 'isUserProfilePicApprove');
    // let isUserProfilePicApprove = response.recordList[0].systemFlag[profilePicApproveIndex].value
    // localStorage.setItem('isUserProfilePicApprove', isUserProfilePicApprove)
    // let customFieldIndex = response.recordList[4].group[0].systemFlag.findIndex(c => c.name === 'isEnableCustomFields');
    // let isEnableCustomFields = response.recordList[4].group[0].systemFlag[customFieldIndex].value;
    // localStorage.setItem('isEnableCustomFields', isEnableCustomFields);
    if (crendientials.roleId === 3 && crendientials.pagePermissions.length === 0) {
      navigate('/admin/nopagepermission');
    }
    else {
      navigate('/admin/dashboard');
    }
  }

  const handleSetup2FA = async (e: any) => {
    e.preventDefault();
    try {
      const token = sessionToken;
      const res = await APIservice.httpPost(
        '/api/admin/users/generateOTP',
        {},
        token,
        refreshToken
      );
      if (res.status === 200) {
        let cred = crendientials;
        cred.isTwoFactorEnable = 1;
        setCrendientials(cred);
        setqrCodeUrl(res.recordList[0].otpAuthUrl);
        setBase32(res.recordList[0].baseSecret);
        setIs2FAOpen(false);
        setIs2FAQRCode(true);
        setIs2FAEnter(false);
      } else if (res && res.status === 401) {
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
    } catch (error) {
      console.log(error);
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

  const remindTwoFactor = async (e: any) => {
    //null
    e.preventDefault();
    try {
      const token = sessionToken
      //const refreshToken = localStorage.getItem('RefreshToken');
      const res = await APIservice.httpPost(
        '/api/admin/users/updateAuthenticationStatus',
        { "isTwoFactorEnable": null },
        token,
        refreshToken
      );
      if (res.status === 200) {
        localStorage.setItem('RefreshToken', refreshToken);
        localStorage.setItem('SessionToken', sessionToken);
        localStorage.setItem('UserId', userId);
        localStorage.setItem('Credentials', JSON.stringify(crendientials));

        let permissionDetail = JSON.parse(localStorage.getItem('Credentials'));
        if (permissionDetail.roleId === 3 && permissionDetail.pagePermissions.length === 0) {
          navigate('/admin/nopagepermission');
        }
        else {
          navigate('/admin/dashboard');
        }


        // navigate('/admin/dashboard');
        updateFCMToken();
        const token = sessionToken;
        let response = await APIservice.httpPost(
          '/api/admin/systemflags/getAdminSystemFlag',
          {},
          token,
          refreshToken
        );
        let data = response.recordList[0].systemFlag[0].value;
        localStorage.setItem('DateFormat', data);
      } else if (res && res.status === 401) {
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
    } catch (error) {
      console.log(error);
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

  const skipTwoFactor = async (e: any) => {
    //false
    e.preventDefault();
    try {
      const token = sessionToken;//localStorage.getItem('SessionToken');
      // const refreshToken = localStorage.getItem('RefreshToken');
      const res = await APIservice.httpPost(
        '/api/admin/users/updateAuthenticationStatus',
        { "isTwoFactorEnable": false },
        token,
        refreshToken
      );
      if (res.status === 200) {
        localStorage.setItem('RefreshToken', refreshToken);
        localStorage.setItem('SessionToken', sessionToken);
        localStorage.setItem('UserId', userId);
        localStorage.setItem('Credentials', JSON.stringify(crendientials));
        let permissionDetail = JSON.parse(localStorage.getItem('Credentials'));
        if (permissionDetail.roleId === 3 && permissionDetail.pagePermissions.length === 0) {
          navigate('/admin/nopagepermission');
        }
        else {
          navigate('/admin/dashboard');
        }

        // navigate('/admin/dashboard');
        updateFCMToken();
        const token = sessionToken;
        let response = await APIservice.httpPost(
          '/api/admin/systemflags/getAdminSystemFlag',
          {},
          token,
          refreshToken
        );
        let data = response.recordList[0].systemFlag[0].value;
        localStorage.setItem('DateFormat', data);
      } else if (res && res.status === 401) {
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
    } catch (error) {
      console.log(error);
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

  const validateTwoFactorCode = (e: any) => {
    const { name, value } = e.target;
    if (value) {
      setIsAuthenticationCodeErrorError(false);
      setAuthenticationCodeErrorMsg('');

    } else {
      setIsAuthenticationCodeErrorError(true);
      setAuthenticationCodeErrorMsg('Email is Required');
    }
  };

  const handleInputTwoFactorCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAuthenticationCode({ ...authenticationCode, [name]: value });
  };

  const handleVerifyAuthenticateCode = async (e: any) => {
    e.preventDefault();
    try {
      const token = sessionToken;
      const res = await APIservice.httpPost(
        '/api/admin/users/validateOTP',
        { "token": authenticationCode.twoFactorCode },
        token,
        refreshToken
      );
      if (res.status === 200) {
        localStorage.setItem('RefreshToken', refreshToken);
        localStorage.setItem('SessionToken', sessionToken);
        localStorage.setItem('UserId', userId);
        localStorage.setItem('Credentials', JSON.stringify(crendientials));
        localStorage.setItem('isFirstLogin', JSON.stringify(false));
        navigate('/admin/dashboard');
        updateFCMToken();
        const token = sessionToken;
        let response = await APIservice.httpPost(
          '/api/admin/systemflags/getAdminSystemFlag',
          {},
          token,
          refreshToken
        );
        let data = response.recordList[0].systemFlag[0].value;
        localStorage.setItem('DateFormat', data);
      } else if (res && res.status === 401) {
        //navigate('/admin');
        toast.error("Invalid Code", {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
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
      console.log(error);
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

  const handleConfigurationChange = (e: any) => {
    setApiUrl(e.target.value);
    setIsAPIUrlValidation(false);
    setIsVerified(false);
  }

  const handleApiConfiguration = () => {
    if (apiUrl) {
      setActiveStep(1);
    }
  }

  const handleChange = (e) => {
    setPreviousVersionInstalled(e.target.value);
    setVersion(null);
  }

  const handleLoadUrl = async (e) => {
    const response = await fetch('/admin/variable.json'); // Adjust the file path as needed
    const data = await response.json();
    setApiUrl(data.REACT_APP_BASEURL);
    setIsUrlErrorMsg(false);
  }
  const handleConfiguration = async (e: any) => {
    e.preventDefault();
    if (!apiUrl) {
      setIsAPIUrlValidation(true);
    }
    else {
      setIsLoading(true);
      // data.REACT_APP_BASEURL = apiUrl;
      // const data1 = JSON.stringify(data)
      APIservice.config.apiUrl = apiUrl;
      getConfiguration();
    }
  }

  const handleCreateDatabaseUser = (e: any) => {
    setIsCreateDatabaseUser(e.target.checked)
  }

  const getConfiguration = async () => {
    try {
      const res = await APIservice.httpPost(
        '/api/admin/configuration/getConfiguration',
        {},
      );
      if (res && res.status == 200) {
        // const text = "This is the content of the file.";
        setIsTakeHostData(res.recordList[0].isTakeHostDetail);
        if (res.recordList[0].isTakeHostDetail) {
          setIsConfiguration(true);
          setIsLogin(false);
          setActiveStep(0);
        }
        setIsVerified(true);
        setIsLoading(false);
        // if (apiUrl !== '')
        //   localStorage.setItem('REACT_APP_BASEURL', apiUrl);
        // const blob = new Blob(['Hello, world!'], { type: 'text/plain;charset=utf-8' });
        // saveAs(blob, '../hello.txt');
        // fileSa
        // const emptyBlob = new Blob([], { type: 'text/plain' });
        // saveAs(emptyBlob, 'variable.json');

        // const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        // saveAs(blob, 'variable.json');
      }
      else if (res.status == 500) {
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
      setIsLoading(false);
      setIsConfiguration(true);
      setIsLogin(false);
      setIsVerified(false);
      setIsUrlErrorMsg(true);
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

  // const removeFile = async () => {
  //   try {
  //     // Make a fetch request to your server to delete the file
  //     const response = await fetch(`variable.json`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json'
  //         // You might need to include additional headers, such as authorization tokens
  //       }
  //     });

  //     if (response.ok) {
  //       console.log(`File "${fileName}" has been removed.`);
  //     } else {
  //       console.error('Failed to remove file.');
  //     }
  //   } catch (error) {
  //     console.error('An error occurred while removing the file:', error);
  //   }
  // }

  const handleHostInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setHostInput({ ...hostData, [name]: value });
    setIsLoading(false);
    setIsTeseted(false);
  };



  const handleUpdateHostData = async (e: any) => {
    if (!hostData.MYSQL_HOST) {
      setIsHostRequired(true)
    }
    if (!hostData.MYSQL_USER) {
      setIsUserRequired(true)
    }
    if (!hostData.MYSQL_PORT) {
      setIsPortRequired(true)
    }
    // if (!hostData.MYSQL_PASSWORD) {
    //   setIsPasswordRequired(true)
    // }
    else {
      setIsHostRequired(false);
      setIsPasswordRequired(false);
      setIsUserRequired(false);
      setIsPortRequired(false);
      setIsLoading(true);
      e.preventDefault();
      // data.REACT_APP_BASEURL = apiUrl;
      const res = await APIservice.httpPost(
        '/api/admin/configuration/testConnection',
        hostData,
      );
      if (res.status === 200) {
        setIsLogin(true);
        setIsTakeHostData(false);
        setIsTeseted(true);
        setIsLoading(false);
        setDatabases(res.recordList);
      }
      else if (res && res.status == 401) {
        setIsLoading(false);
        toast.error("Invalid Code", {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 500) {
        setIsLoading(false);
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
        setIsLoading(false);
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
        setIsLoading(false);
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
        setIsLoading(false);
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
    }
  }

  const handlehost = async () => {
    setActiveStep(1);
  }

  const handleErrorBack = async () => {
    setActiveStep(1);
    setIsSetUpDatabase(false);
    setIsInstallSucessfully(true);
    setIsLoading(false);
    setIsTeseted(false);
  }

  const databaseConfiguration = async (e: any) => {
    setIsInstallSucessfully(false);
    if (!version && isPreviousVersionInstalled !== 'false') {
      setIsVersionRequired(true);
    }
    if (!hostData.MYSQL_DATABASE) {
      setIsDatabaseRequired(true);
    }
    else {
      setActiveStep(2);
      setIsSetUpDatabase(true);
      setDatabaseState('creating');
      setIsVersionRequired(false);
      setIsDatabaseRequired(false);
      setIsLoading(true);
      e.preventDefault();
      // data.REACT_APP_BASEURL = apiUrl;
      let data1 = {
        'version': isPreviousVersionInstalled ? version : null,
        'MYSQL_DATABASE': hostData.MYSQL_DATABASE,
        'isCreateDatabaseUser': isCreatedatabaseUser,
        'username': hostData.username,
        'password': hostData.password
      }
      const res = await APIservice.httpPost(
        '/api/admin/configuration/databaseConfiguration',
        data1,
      );
      if (res.status === 200) {
        setUserName(res.recordList[0].email);
        setPassword("admin1234");
        setDatabaseState('created');
        if (ismasterData) {
          setIsInstallMasterData(true);
          isInstallMasterData = true;
          let data1 = {
            'version': version,
          }
          const res = await APIservice.httpPost(
            '/api/admin/configuration/installMasterData',
            data1,
          );
          if (res && res.status == 200) {
            setIsInstallMasterData(true);
            isInstallMasterData = true;
            setMasterdataState('created')
          }
        }
        if (isSampleData) {

          let data1 = {
            'version': version
          }
          const res = await APIservice.httpPost(
            '/api/admin/configuration/installSampleData',
            data1,
          );
          if (res && res.status == 200) {
            setIsInstallSampleData(true)
            isInstalledSampleData = true;
            setSampledataState('created')
          }
        }
        // setIsLogin(true);

        if (ismasterData || isSampleData) {
          if (ismasterData && (isInstallMasterData == true)) {
            setIsInstallSucessfully(true);
          }
          if (isSampleData && (isInstalledSampleData == true)) {
            setIsInstallSucessfully(true);
          }
        }
        else {
          setIsInstallSucessfully(true);
        }
        setIsTakeHostData(false);
        setIsTeseted(true);
        setIsLoading(false);

      }
      else if (res && res.status == 401) {
        setDatabaseState('Error');
        setActiveStep(1);
        toast.error("Invalid Code", {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
      } else if (res.status == 500) {
        setDatabaseState('Error');
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
        setDatabaseState('Error');
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
        setDatabaseState('Error');
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
        setDatabaseState('Error');
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
    }
  }

  const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setHostInput({ ...hostData, ['password']: password });
    // hostData.password = password;
  }
  const handleGotoLogin = async () => {
    const res = await APIservice.httpPost(
      '/api/admin/configuration/restartConnection',
      hostData,
    );
    if (res.status === 200) {
      if (res.recordList == false) {
        toast.warning('Please restart your API server before loggin in.', {
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          position: toast.POSITION.TOP_RIGHT
        });
        setIsRestartServerRequired(true);
      }
      else {
        setIsRestartServerRequired(false);
        setIsLogin(true);
        setIsConfiguration(false)
        if (!version) {
          setLogin({ 'email': userName, 'password': password });
        }
      }
    }
  }

  const installMasterData = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    // data.REACT_APP_BASEURL = apiUrl;
    const res = await APIservice.httpPost(
      '/api/admin/configuration/installMasterData',
      hostData,
    );
    if (res.status === 200) {
      setIsLogin(true);
      setIsTakeHostData(false);
      setIsTeseted(true);
      setIsLoading(false);
    }
    else if (res && res.status == 401) {
      toast.error("Invalid Code", {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        position: toast.POSITION.TOP_RIGHT
      });
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
  }

  const handleVersionChange = async (e: any) => {
    setVersion(e.target.value)
  }

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleInstallMasterData = (e: any) => {
    setIsMasterData(e.target.checked)
  }

  const handleInstallSampleData = (e: any) => {
    setIsSampleData(e.target.checked)
  }

  const handleBack = () => {
    if (activeStep === 1) {
      setActiveStep(0);
    }
    else {
      setActiveStep(1);
    }
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <OverviewWrapper>
        <Helmet>
          <title>Matrimony</title>
        </Helmet>
        <Container>
          {!isConfiguration && (
            <Row
              className="d-flex justify-content-center align-items-center"
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%'
              }}
            >

              <Col md={8} lg={6} xs={12} style={{ maxWidth: '500px' }}>
                <div style={{ height: '72px' }}>
                  <Logo />
                  {/* <img src="/Image20221010173301.png" height="50" alt="logo" /> */}
                </div>
                <Card style={{ borderRadius: '10px' }}>
                  <CardContent style={{ padding: '24px' }}>
                    {isLogin &&
                      <Form onSubmit={onFormSubmit}>
                        <Typography
                          className="mb-3"
                          align="center"
                          fontSize="25px"
                          fontWeight="bolder"
                        >
                          Login
                        </Typography>
                        <TextField
                          required
                          type="email"
                          sx={{ width: '100%', mt: 3 }}
                          name="email"
                          label="Email"
                          autoFocus
                          value={login.email}
                          onChange={(e: any) => {
                            validateEmail(e);
                            handleInputChange(e);
                          }}
                        />
                        <FormHelperText style={{ color: 'red', height: '22px' }}>
                          {isEmailValidateError && emailValidateErrorMsg}
                        </FormHelperText>
                        <TextField
                          required
                          sx={{ width: '100%', mt: '1%' }}
                          name="password"
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword === true ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          value={login.password}
                          onChange={(e: any) => {
                            ValidatePassword(e);
                            handleInputChange(e);
                          }}
                        />

                        <FormHelperText style={{ color: 'red', height: '22px' }}>
                          {isPasswordValidateError && passwordValidateErrorMsg}
                        </FormHelperText>

                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          onClick={handlesubmit}
                          style={{ fontWeight: 'bolder', marginTop: '1%' }}
                        >
                          <div>
                            {isLoading ? (
                              <LoaderLogin title="Loading..." />
                            ) : (
                              'LOGIN'
                            )}
                          </div>
                        </Button>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="flex-end"
                          sx={{ my: 1 }}
                        >
                          <RouterLink
                            to="/forgotpassword"
                            style={{
                              color: '#5569ff',
                              textDecoration: 'none',
                              justifyContent: 'flex-end',
                              fontSize: '15px'
                            }}
                          >
                            Forgot password?
                          </RouterLink>
                        </Stack>
                      </Form>
                    }
                    {isChangeEmail && <>
                      <Form>
                        <Typography
                          className="mb-3"
                          align="center"
                          fontSize="25px"
                          fontWeight="bolder"
                        >
                          Change Default Email
                        </Typography>
                        <TextField
                          required
                          type="email"
                          sx={{ width: '100%', mt: 3 }}
                          name="email"
                          label="Email"
                          autoFocus
                          value={changeEmail.email}
                          onChange={(e: any) => {
                            validateChangeEmail(e);
                            handleInputDefaultEmailChange(e);
                          }}
                        />
                        <FormHelperText style={{ color: 'red', height: '22px' }}>
                          {isChangeEmailValidateError && changeEmailValidateErrorMsg}
                        </FormHelperText>

                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          onClick={handleupdateEmail}
                          style={{ fontWeight: 'bolder', marginTop: '1%' }}
                        >
                          <div>
                            {isLoading ? (
                              <LoaderLogin title="Loading..." />
                            ) : (
                              'Change Email'
                            )}
                          </div>
                        </Button>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-evenly"
                          sx={{ my: 1 }}
                        >
                          <Link style={{
                            color: '#5569ff',
                            textDecoration: 'none',
                            justifyContent: 'flex-end',
                            fontSize: '15px',
                            cursor: 'pointer'
                          }} onClick={skipUpdateEmail}>Skip</Link>
                        </Stack>
                      </Form>
                    </>}
                    {isChangePassword && <>
                      <Form>
                        <Typography
                          className="mb-3"
                          align="center"
                          fontSize="25px"
                          fontWeight="bolder"
                        >
                          Change Default Password
                        </Typography>
                        <TextField
                          required
                          sx={{ width: '100%', mt: '1%' }}
                          name="password"
                          label="Password"
                          type={showChangePassword ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowChangePassword(!showChangePassword)}
                                  edge="end"
                                >
                                  {showChangePassword === true ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          value={changePassword.password}
                          onChange={(e: any) => {
                            ValidateChangePassword(e);
                            handleInputDefaultPasswordChange(e);
                          }}
                        />
                        <FormHelperText style={{ color: 'red', height: '22px' }}>
                          {isChangePasswordValidateError && changePasswordValidateErrorMsg}
                        </FormHelperText>
                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          onClick={handleupdatePassword}
                          style={{ fontWeight: 'bolder', marginTop: '1%' }}
                        >
                          <div>
                            {isLoading ? (
                              <LoaderLogin title="Loading..." />
                            ) : (
                              'Change Password'
                            )}
                          </div>
                        </Button>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-evenly"
                          sx={{ my: 1 }}
                        >
                          <Link style={{
                            color: '#5569ff',
                            textDecoration: 'none',
                            justifyContent: 'flex-end',
                            fontSize: '15px',
                            cursor: 'pointer'
                          }} onClick={backUpdatePassword}>Back</Link>
                          <Link style={{
                            color: '#5569ff',
                            textDecoration: 'none',
                            justifyContent: 'flex-end',
                            fontSize: '15px',
                            cursor: 'pointer'
                          }} onClick={skipUpdatePassword}>Skip</Link>
                        </Stack>
                      </Form>
                    </>}
                    {is2FAOpen &&
                      <Form>
                        <Typography
                          className="mb-3"
                          align="center"
                          fontSize="25px"
                          fontWeight="bolder"
                        >
                          Set Up Two-Factor Authentication
                        </Typography>
                        <Typography
                          noWrap
                          style={{
                            fontSize: '15px',
                            fontWeight: 'bold',
                            marginBottom: 'none'
                          }}
                        >
                          Send Authentication Code to your login Email
                        </Typography>
                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          disabled={login?.email === "demo@admin.com"}
                          onClick={handleSetup2FA}
                          style={{ fontWeight: 'bolder', marginTop: '1%' }}
                        >
                          <div>
                            {isLoading ? (
                              <LoaderLogin title="Loading..." />
                            ) : (
                              'Setup 2FA'
                            )}
                          </div>
                        </Button>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-evenly"
                          sx={{ my: 1 }}
                        >
                          <Link style={{
                            color: '#5569ff',
                            textDecoration: 'none',
                            justifyContent: 'flex-end',
                            fontSize: '15px',
                            cursor: 'pointer'
                          }} onClick={remindTwoFactor}>Remind me Later</Link>
                          {login?.email === "demo@admin.com" ? <>
                            Skip For Now
                          </> :
                            <Link style={{
                              color: '#5569ff',
                              textDecoration: 'none',
                              justifyContent: 'flex-end',
                              fontSize: '15px',
                              cursor: 'pointer'
                            }} onClick={skipTwoFactor}>Skip For Now</Link>
                          }
                        </Stack>
                      </Form>
                    }
                    {is2FAQRCode &&
                      <Form>
                        <Typography
                          className="mb-3"
                          align="center"
                          fontSize="25px"
                          fontWeight="bolder"
                        >
                          Two-Factor Authentication
                        </Typography>
                        <h4 className={styles.heading4}>
                          Configuring Google Authenticator or Authy
                        </h4>
                        <div className={styles.orderedList}>
                          <li>
                            Install Google Authenticator (IOS - Android) or Authy (IOS -
                            Android).
                          </li>
                          <li>In the authenticator app, select "+" icon.</li>
                          <li>
                            Select "Scan a barcode (or QR code)" and use the phone's camera
                            to scan this barcode.
                          </li>
                        </div>
                        <div>
                          <h4 className={styles.heading4}>Scan QR Code</h4>
                          <div className="flex justify-center">
                            <QRCode value={qrcodeUrl} />
                          </div>
                        </div>
                        <div>
                          <h4 className={styles.heading4}>Or Enter Code Into Your App</h4>
                          <p className="text-sm">SecretKey: {base32} (Base32 encoded)</p>
                        </div>

                        <TextField
                          required
                          type="text"
                          sx={{ width: '100%', mt: 3 }}
                          name="twoFactorCode"
                          label="Authentication Code"
                          autoFocus
                          value={authenticationCode.twoFactorCode}
                          onChange={(e: any) => {
                            validateTwoFactorCode(e);
                            handleInputTwoFactorCodeChange(e);
                          }}
                        />
                        <FormHelperText style={{ color: 'red', height: '22px' }}>
                          {isAuthenticationCodeError && authenticationCodeErrorMsg}
                        </FormHelperText>

                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          onClick={handleVerifyAuthenticateCode}
                          style={{ fontWeight: 'bolder', marginTop: '1%' }}
                        >
                          <div>
                            {isLoading ? (
                              <LoaderLogin title="Loading..." />
                            ) : (
                              'Authenticate'
                            )}
                          </div>
                        </Button>

                      </Form>
                    }
                    {is2FAEnter &&
                      <Form>
                        <Typography
                          className="mb-3"
                          align="center"
                          fontSize="25px"
                          fontWeight="bolder"
                        >
                          Two-Factor Authentication
                        </Typography>
                        <Typography
                          noWrap
                          style={{
                            fontSize: '15px',
                            fontWeight: 'bold',
                            marginBottom: 'none'
                          }}
                        >
                          Enter Authentication Code
                        </Typography>
                        <TextField
                          required
                          type="text"
                          sx={{ width: '100%', mt: 3 }}
                          name="twoFactorCode"
                          label="Authentication Code"
                          autoFocus
                          value={authenticationCode.twoFactorCode}
                          onChange={(e: any) => {
                            validateTwoFactorCode(e);
                            handleInputTwoFactorCodeChange(e);
                          }}
                        />
                        <FormHelperText style={{ color: 'red', height: '22px' }}>
                          {isAuthenticationCodeError && authenticationCodeErrorMsg}
                        </FormHelperText>

                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          onClick={handleVerifyAuthenticateCode}
                          style={{ fontWeight: 'bolder', marginTop: '1%' }}
                        >
                          <div>
                            {isLoading ? (
                              <LoaderLogin title="Loading..." />
                            ) : (
                              'Authenticate'
                            )}
                          </div>
                        </Button>

                      </Form>
                    }
                    {/* {isConfiguration &&
                    <Form onSubmit={handleConfiguration}>
                      <Typography
                        className="mb-3"
                        align="center"
                        fontSize="25px"
                        fontWeight="bolder"
                      >
                        Configuration
                      </Typography>
                      <TextField
                        required
                        type="text"
                        sx={{ width: '100%', mt: 3 }}
                        name="apiUrl"
                        label="apiUrl"
                        autoFocus
                        value={apiUrl}
                        onChange={(e: any) => {
                          handleConfigurationChange(e);
                        }}
                      />
                      <FormHelperText style={{ color: 'red', height: '22px' }}>
                        {isEmailValidateError && emailValidateErrorMsg}
                      </FormHelperText>
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        onClick={handleConfiguration}
                        style={{ fontWeight: 'bolder', marginTop: '1%' }}
                      >
                        <div>
                          {isLoading ? (
                            <LoaderLogin title="Loading..." />
                          ) : (
                            'Submit'
                          )}
                        </div>
                      </Button>

                    </Form>
                  }
                  {isTakeHostData &&
                    <Form onSubmit={handleUpdateHostData}>
                      <Typography
                        className="mb-3"
                        align="center"
                        fontSize="25px"
                        fontWeight="bolder"
                      >
                        Host Configuration
                      </Typography>
                      <TextField
                        required
                        type="text"
                        sx={{ width: '100%', mt: 3 }}
                        name="MYSQL_HOST"
                        label="MYSQL_HOST"
                        autoFocus
                        value={hostData.MYSQL_HOST}
                        onChange={(e: any) => {
                          handleHostInputChange(e);
                        }}
                      />
                      <TextField
                        required
                        type="text"
                        sx={{ width: '100%', mt: 3 }}
                        name="MYSQL_DATABASE"
                        label="MYSQL_DATABASE"
                        autoFocus
                        value={hostData.MYSQL_DATABASE}
                        onChange={(e: any) => {
                          handleHostInputChange(e);
                        }}
                      />
                      <TextField
                        required
                        type="text"
                        sx={{ width: '100%', mt: 3 }}
                        name="MYSQL_USER"
                        label="MYSQL_USER"
                        autoFocus
                        value={hostData.MYSQL_USER}
                        onChange={(e: any) => {
                          handleHostInputChange(e);
                        }}
                      />
                      <TextField
                        required
                        type="password"
                        sx={{ width: '100%', mt: 3 }}
                        name="MYSQL_PASSWORD"
                        label="MYSQL_PASSWORD"
                        autoFocus
                        value={hostData.MYSQL_PASSWORD}
                        onChange={(e: any) => {
                          handleHostInputChange(e);
                        }}
                      />
               
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        onClick={handleUpdateHostData}
                        style={{ fontWeight: 'bolder', marginTop: '1%' }}
                      >
                        <div>
                          {isLoading ? (
                            <LoaderLogin title="Loading..." />
                          ) : (
                            'Submit'
                          )}
                        </div>
                      </Button>

                    </Form>
                  } */}

                  </CardContent>
                </Card>
              </Col>
            </Row>
          )}
          {(isConfiguration || isTakeHostData) &&
            <>
              {/* <div style={{ height: '72px', marginTop: "20px" }}>
                <Logo />
              </div> */}
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <img src="/admin/Image20221010173301.png" height="50" alt="logo" />
              </div>
              <Typography sx={{ textAlign: 'center', fontSize: '36px', marginTop: "11px", fontWeight: "600", marginBottom: "20px", color: "#596bfa" }}>
                Welcome to Matrimony Configuration
              </Typography>
              <Typography sx={{ textAlign: 'center', fontSize: '12px', fontWeight: "600px", marginBottom: "20px" }}>
                Please follow below steps to setup
              </Typography >

              <Row>
                <Col md={3} lg={3} xs={12}></Col>
                <Col md={6} lg={6} xs={12}>
                  <Card sx={{
                    padding: '10px', marginTop: "10px", margin: 'auto', minHeight: 'calc(100vh - 240px)', position: 'relative', paddingBottom: '80px'

                  }}>
                    <Row>
                      <Col md={12} lg={12} xs={12}>
                        <Box sx={{ width: '100%' }}>

                          <Stepper activeStep={activeStep} style={{ margin: '0px auto 30px auto' }}>
                            {steps.map((label, index) => {
                              const stepProps: { completed?: boolean } = {};
                              const labelProps: {
                                optional?: React.ReactNode;
                              } = {};

                              if (isStepSkipped(index)) {
                                stepProps.completed = false;
                              }
                              return (
                                <Step key={label} {...stepProps}>
                                  <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                              );
                            })}
                          </Stepper>
                          {activeStep === steps.length ? (
                            <React.Fragment>
                              <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleReset}>Reset</Button>
                              </Box>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              {activeStep == 0 && (
                                <>
                                  <Form >
                                    <div>
                                      <TextField
                                        required
                                        type="text"
                                        sx={{ width: '100%' }}
                                        name="MYSQL_HOST"
                                        label="Host Name"
                                        autoFocus
                                        value={hostData.MYSQL_HOST}
                                        onChange={(e: any) => {
                                          handleHostInputChange(e);
                                        }} />
                                      {isHostRequired && (
                                        <FormHelperText style={{ color: 'red', height: '22px' }}>
                                          HostName is required
                                        </FormHelperText>
                                      )}
                                      <TextField
                                        required
                                        type="text"
                                        sx={{ width: '100%', mt: 3 }}
                                        name="MYSQL_USER"
                                        label="User Name"
                                        autoFocus
                                        value={hostData.MYSQL_USER}
                                        onChange={(e: any) => {
                                          handleHostInputChange(e);
                                        }} />
                                      {isUserRequired && (
                                        <FormHelperText style={{ color: 'red', height: '22px' }}>
                                          UserName is required
                                        </FormHelperText>
                                      )}
                                      <TextField
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        sx={{ width: '100%', mt: 3 }}
                                        name="MYSQL_PASSWORD"
                                        label="Password"
                                        autoFocus
                                        value={hostData.MYSQL_PASSWORD}
                                        onChange={(e: any) => {
                                          handleHostInputChange(e);
                                        }}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                              >
                                                {showPassword === true ? (
                                                  <VisibilityIcon />
                                                ) : (
                                                  <VisibilityOffIcon />
                                                )}
                                              </IconButton>
                                            </InputAdornment>
                                          )
                                        }} />
                                      <TextField
                                        required
                                        type="text"
                                        sx={{ width: '100%', mt: 3 }}
                                        name="MYSQL_PORT"
                                        label="PORT"
                                        autoFocus
                                        value={hostData.MYSQL_PORT}
                                        onChange={(e: any) => {
                                          handleHostInputChange(e);
                                        }} />
                                      {isPORTRequired && (
                                        <FormHelperText style={{ color: 'red', height: '22px' }}>
                                          PORT is required
                                        </FormHelperText>
                                      )}
                                    </div>

                                  </Form>
                                  <div style={{ position: 'absolute', bottom: '20px', width: '96%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                    <Button
                                      fullWidth
                                      type="button"
                                      variant="contained"
                                      onClick={handleUpdateHostData}
                                      style={{ fontWeight: 'bolder' }}
                                      disabled={isTested && !isLoading}
                                    >
                                      <div>
                                        {(!isTested && !isLoading) && 'Test Connection'}
                                        {isLoading && 'Testing'}
                                        {isTested && !isLoading && 'Connection Established'}
                                      </div>
                                    </Button>
                                    <Button
                                      fullWidth
                                      type="submit"
                                      variant="contained"
                                      style={{ fontWeight: 'bolder' }}
                                      disabled={!isTested}
                                      onClick={handlehost}
                                    // onClick={handleUpdateHostData}
                                    >
                                      <div>
                                        {isLoading ? (
                                          <LoaderLogin title="Loading..." />
                                        ) : (
                                          'Save & Next'
                                        )}
                                      </div>
                                    </Button>
                                  </div></>


                              )}
                              {activeStep == 1 &&
                                <>
                                  {/* <Card sx={{
                                        padding: '10px', marginTop: "20px", maxWidth: '500px', margin: 'auto', height: 'calc(100vh - 390px)',
                                        overflow: 'auto'
                                      }}> */}
                                  {/* <Typography
                                          className="mb-3"
                                          align="center"
                                          fontSize="25px"
                                          fontWeight="bolder"
                                        >
                                          Database Configuration
                                        </Typography> */}
                                  <Form onSubmit={databaseConfiguration}>
                                    <FormLabel id="demo-radio-buttons-group-label" sx={{ display: 'inline-block' }} >
                                      Previous version Installed?
                                    </FormLabel>
                                    <RadioGroup
                                      row
                                      aria-labelledby="demo-radio-buttons-group-label"
                                      name="radio-buttons-group"
                                    >
                                      <FormControlLabel
                                        name="previousVersionInstalled"
                                        value="true"
                                        checked={isPreviousVersionInstalled === 'true'}
                                        onChange={(e: any) => {
                                          handleChange(e);
                                        }}
                                        control={<Radio />}
                                        label="Yes"
                                        sx={{ display: 'inline-block' }}
                                      />
                                      <FormControlLabel
                                        name="previousVersionInstalled"
                                        value="false"
                                        checked={isPreviousVersionInstalled === 'false'}
                                        onChange={(e: any) => {
                                          handleChange(e);
                                        }}
                                        control={<Radio />}
                                        label="No"
                                        sx={{ display: 'inline-block' }}
                                      />
                                    </RadioGroup>
                                    {isPreviousVersionInstalled == 'true' && <>
                                      {/* <Typography sx={{ display: 'inline', width: '50%' }}>
                                    Select Version Installed  <Tooltip
                                      title='Please Select version carefully'
                                    >
                                      <InfoIcon sx={{ 'font-size': '16px!important', display: 'inline' }} />
                                    </Tooltip>
                                  </Typography> */}
                                      <InputLabel id="demo-multiple-name-label" style={{ margin: '8px 0px 10px 0px' }}>
                                        Select Version Installed
                                        <Tooltip
                                          title='Please Select version carefully'
                                        >
                                          <InfoIcon sx={{ 'font-size': '16px!important', display: 'inline' }} />
                                        </Tooltip>
                                      </InputLabel>
                                      < FormControl
                                        sx={{ width: '100%', display: 'inline' }}
                                      >
                                        <Select
                                          labelId="demo-multiple-name-label"
                                          id="demo-multiple-name"
                                          multiple={false}
                                          name="version"
                                          onChange={handleVersionChange}
                                          required
                                          label="Select Version"
                                          style={{ width: '100%' }}
                                        >
                                          <MenuItem value='1.0'>
                                            v1.0
                                          </MenuItem>
                                          <MenuItem value='1.1'>
                                            v1.1
                                          </MenuItem>
                                          <MenuItem value='1.2'>
                                            v1.2
                                          </MenuItem>
                                          <MenuItem value='1.3'>
                                            v1.3
                                          </MenuItem>
                                          <MenuItem value='1.4'>
                                            v1.4
                                          </MenuItem>
                                          <MenuItem value='1.5'>
                                            v1.5
                                          </MenuItem>
                                        </Select>
                                        {isVersionSelectionRequired && (
                                          <FormHelperText style={{ color: 'red', height: '22px' }}>
                                            'Version is required'
                                          </FormHelperText>
                                        )}
                                      </FormControl>
                                      {/* <Tooltip
                                        title='Please Select version carefully'
                                      >
                                        <InfoIcon sx={{ 'font-size': '16px!important', display: 'inline' }} />
                                      </Tooltip> */}
                                    </>
                                    }
                                    {/* <TextField
                                      required
                                      type="text"
                                      sx={{ width: '100%', mt: 3 }}
                                      name="MYSQL_DATABASE"
                                      label="Database Name"
                                      autoFocus
                                      value={hostData.MYSQL_DATABASE}
                                      onChange={(e: any) => {
                                        handleHostInputChange(e);
                                      }}
                                    /> */}
                                    {isPreviousVersionInstalled == 'false' &&
                                      < TextField
                                        required
                                        type="text"
                                        sx={{ width: '100%', mt: 3 }}
                                        name="MYSQL_DATABASE"
                                        label="Database Name"
                                        autoFocus
                                        value={hostData.MYSQL_DATABASE}
                                        onChange={(e: any) => {
                                          handleHostInputChange(e);
                                        }}
                                      />
                                    }
                                    {isPreviousVersionInstalled == 'true' &&
                                      <div style={{ marginTop: '20px' }}>
                                        <Typography sx={{ color: 'red', fontWeight: 'bold' }}>
                                          Note: Please first take backup of your database
                                        </Typography>
                                      </div>
                                    }
                                    {isPreviousVersionInstalled == 'false' &&
                                      <div style={{ marginTop: '10px', borderBottom: '1px solid #ddd' }}>
                                        <Checkbox
                                          // onChange={(e) =>
                                          //   handleCreateDatabaseUser(e)
                                          // }
                                          onChange={handleCreateDatabaseUser}
                                          inputProps={{ 'aria-label': 'controlled' }}
                                          style={{ padding: '9px 0px' }}
                                        />Do you want to create database user?
                                      </div>
                                    }
                                    {isCreatedatabaseUser && isPreviousVersionInstalled == 'false' &&
                                      <>
                                        <TextField
                                          required
                                          type="text"
                                          sx={{ width: '100%', mt: 3 }}
                                          name="username"
                                          label="UserName"
                                          autoFocus
                                          value={hostData.username}
                                          onChange={(e: any) => {
                                            handleHostInputChange(e);
                                          }}
                                        />
                                        <TextField
                                          required
                                          type={showPassword ? 'text' : 'password'}
                                          sx={{ width: '100%', mt: 3 }}
                                          name="password"
                                          label="Password"
                                          autoFocus
                                          value={hostData.password}
                                          onChange={(e: any) => {
                                            handleHostInputChange(e);
                                          }}
                                          InputProps={{
                                            endAdornment: (
                                              <InputAdornment position="end">
                                                <IconButton
                                                  onClick={() => setShowPassword(!showPassword)}
                                                  edge="end"
                                                >
                                                  {showPassword === true ? (
                                                    <VisibilityIcon />
                                                  ) : (
                                                    <VisibilityOffIcon />
                                                  )}
                                                </IconButton>
                                              </InputAdornment>
                                            )
                                          }}
                                        />
                                        <Button
                                          fullWidth
                                          type="button"
                                          variant="contained"
                                          onClick={generatePassword}
                                          style={{ fontWeight: 'bolder', marginTop: '5%', width: '50%' }}
                                        >Generate Random Password</Button>
                                      </>}
                                    {isPreviousVersionInstalled == 'false' ? (<>
                                      {/* < TextField
                                            required
                                            type="text"
                                            sx={{ width: '100%', mt: 3 }}
                                            name="MYSQL_DATABASE"
                                            label="Database Name"
                                            autoFocus
                                            value={hostData.MYSQL_DATABASE}
                                            onChange={(e: any) => {
                                              handleHostInputChange(e);
                                            }}
                                          /> */}
                                      <div style={{ marginTop: '10px' }}>
                                        <Checkbox
                                          onChange={handleInstallMasterData}
                                          inputProps={{ 'aria-label': 'controlled' }}
                                          style={{ padding: '9px 0px' }}
                                        />Install Master Data
                                      </div>
                                      {isPreviousVersionInstalled == 'false' && <>
                                        <Checkbox
                                          onChange={handleInstallSampleData}
                                          style={{ padding: '9px 0px' }}
                                          inputProps={{ 'aria-label': 'controlled' }}
                                          disabled={!ismasterData}
                                        />Install Sample Data
                                      </>
                                      }
                                    </>
                                    ) : (<>
                                      {databases && databases.length > 0 ? (<>
                                        <InputLabel id="demo-multiple-name-label" style={{ margin: '8px 0px 10px 0px' }}>
                                          Select Databse
                                          <Tooltip
                                            title='Please Select version carefully'
                                          >
                                            <InfoIcon sx={{ 'font-size': '16px!important', display: 'inline' }} />
                                          </Tooltip>
                                        </InputLabel>
                                        < FormControl
                                          sx={{ width: '100%', display: 'inline' }}
                                        >
                                          <Select
                                            labelId="demo-multiple-name-label"
                                            id="demo-multiple-dataabse"
                                            multiple={false}
                                            name="MYSQL_DATABASE"
                                            onChange={(e: any) => {
                                              handleHostInputChange(e);
                                            }}
                                            required
                                            label="Select Database"
                                            style={{ width: '100%' }}
                                          >
                                            {databases.map((arr: any, index: number) => {
                                              return (
                                                <MenuItem value={arr.Database
                                                } key={arr.Database}>
                                                  {arr.Database}
                                                </MenuItem>
                                              )
                                            })}
                                          </Select>
                                          {isDatabaseSelectionRequired && (
                                            <FormHelperText style={{ color: 'red', height: '22px' }}>
                                              'Database is required'
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                        <div style={{ marginTop: '10px' }}>
                                          <Checkbox
                                            onChange={handleInstallMasterData}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            style={{ padding: '9px 0px' }}
                                          />Install MasterData
                                        </div>
                                        {isPreviousVersionInstalled == 'false' && <>
                                          <Checkbox
                                            onChange={handleInstallSampleData}
                                            style={{ padding: '9px 0px' }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            disabled={!ismasterData}
                                          />Install SampleData
                                        </>
                                        }
                                      </>
                                      ) : (
                                        <Typography sx={{ color: 'red', marginTop: "20px", marginBottom: "20px" }}>No Database Found with your MYSQL Server Configuration Please Go back and again configure with your server</Typography>
                                      )
                                      }
                                    </>
                                    )}
                                  </Form>
                                  <div style={{ position: 'absolute', bottom: '20px', width: '96%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                    <Button
                                      fullWidth
                                      type="submit"
                                      variant="contained"
                                      disabled={!hostData.MYSQL_DATABASE}
                                      onClick={databaseConfiguration}
                                      style={{ fontWeight: 'bolder', marginTop: '1%' }}
                                    >
                                      <div>
                                        {isLoading ? (
                                          <LoaderLogin title="Loading..." />
                                        ) : (
                                          'Save & Configure'
                                        )}
                                      </div>
                                    </Button>
                                    <Button
                                      fullWidth

                                      color="inherit"

                                      onClick={handleBack}
                                      sx={{ mr: 1 }}
                                      variant="outlined"
                                    >
                                      Back
                                    </Button>
                                  </div>
                                  {/* </Card> */}
                                  {/* {isSetupdatabase && (
                              <Typography>
                                Database Creating
                              </Typography>
                            )}
                            {isInstallMasterData && (
                              <Typography>
                                Installing MasterData
                              </Typography>
                            )}
                            {isInstalledSampleData && (
                              <Typography>
                                Installing SampleData
                              </Typography>
                            )} */}
                                </>
                              }
                              {activeStep == 2 &&
                                <>
                                  <Typography style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>

                                    {!isInstallSuccessfully &&
                                      <>
                                        <Typography style={{ marginBottom: '10px' }}>
                                          Please wait while we are installing the database
                                        </Typography>
                                      </>

                                    }
                                    <Typography>
                                      {(databaseState === 'creating') ?
                                        <>
                                          <Typography style={{ margin: '10px 5px', fontSize: '18px' }}>
                                            <CircularProgress thickness={1} style={{ height: '18px', width: '18px', marginRight: '20px' }} />
                                            Creating Database...
                                          </Typography>

                                        </> :
                                        <>
                                          {(isSetupdatabase && databaseState === 'created') ? (
                                            <Typography style={{ margin: '10px 5px', fontSize: '18px' }}>
                                              <CheckCircleIcon style={{ color: '#78b144', marginRight: '10px' }} />
                                              Database Created
                                            </Typography>
                                          ) :
                                            (<Typography style={{ margin: '10px 5px', fontSize: '18px' }}>
                                              <CancelIcon style={{ color: 'red', marginRight: '10px' }} />
                                              Error in database creation
                                            </Typography>)}</>

                                      }

                                      {(ismasterData) &&
                                        <>
                                          {(masterdataState === 'creating' && databaseState !== 'Error') ?
                                            <>
                                              <Typography style={{ margin: '10px 5px', fontSize: '18px' }}>
                                                {/* <CircularProgress color="primary" /> */}
                                                <CircularProgress thickness={1} style={{ height: '18px', width: '18px', marginRight: '20px' }} />
                                                Installing MasterData...
                                              </Typography>

                                            </> :
                                            <>
                                              {(ismasterData && isInstallMasterData) ? (
                                                <Typography style={{ margin: '10px 5px', fontSize: '18px' }}>
                                                  <CheckCircleIcon style={{ color: '#78b144', marginRight: '10px' }} />
                                                  MasterData Installed
                                                </Typography>
                                              ) :
                                                (<Typography style={{ margin: '10px 5px', fontSize: '18px' }}>
                                                  <CancelIcon style={{ color: 'red', marginRight: '10px' }} />
                                                  Error in installing Masterdata
                                                </Typography>)}
                                            </>

                                          }
                                        </>}

                                      {(isSampleData) &&
                                        <>
                                          {(sampledataState === 'creating' && databaseState !== 'Error') ?
                                            <>
                                              <Typography style={{ margin: '10px 5px', fontSize: '18px' }}>
                                                <CircularProgress thickness={1} style={{ height: '18px', width: '18px', marginRight: '20px' }} />

                                                Installing SampleData...
                                              </Typography>

                                            </> :
                                            <>
                                              {(isSampleData && isInstalledSampleData) ? (
                                                <Typography style={{ margin: '10px 5px', fontSize: '18px' }}>
                                                  <CheckCircleIcon style={{ color: '#78b144', marginRight: '10px' }} />
                                                  SampleData Installed
                                                </Typography>
                                              ) :
                                                (<Typography style={{ margin: '10px 5px', fontSize: '18px' }}>
                                                  <CancelIcon style={{ color: 'red', marginRight: '10px' }} />
                                                  Error in installing SampleData
                                                </Typography>)}

                                            </>
                                          }
                                        </>}

                                    </Typography>
                                    {(databaseState === 'Error') && (
                                      <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        onClick={handleErrorBack}
                                        style={{ fontWeight: 'bolder', marginTop: '2%', width: '15%' }}
                                      >
                                        Back
                                      </Button>
                                    )

                                    }
                                    {isInstallSuccessfully &&
                                      <>
                                        <Typography style={{ fontSize: '42px', textAlign: 'center', fontWeight: '900', marginTop: '10px', color: '#78b144' }}>
                                          Congratulations!
                                        </Typography>
                                        <Typography style={{ fontSize: '17px', textAlign: 'center', fontWeight: '600', margin: '40px 0px' }}>
                                          Your configuration process has been successfully completed. Below are your credentials. We appreciate your cooperation in this matter and look forward to your continued success with our services.
                                        </Typography>
                                        <Typography style={{ fontSize: '19px', textAlign: 'center', fontWeight: '600', marginTop: '10px', color: 'red' }}>
                                          Please restart API(Nodejs APP) - Check documentation
                                        </Typography>
                                        {!version && <>
                                          <Box style={{ border: "1px solid #ddd", marginTop: '20px', padding: '8px', width: '300px' }}>
                                            <Button
                                              type="button"
                                              variant="contained"
                                              style={{ fontWeight: 'bolder', width: '15%', float: 'right', right: '-10px', top: '-10px', padding: '3px', minWidth: '0px' }}
                                              onClick={handleCopy}
                                            >
                                              <ContentCopyIcon />
                                            </Button>
                                            <Typography style={{ fontSize: '14px', marginTop: '10px' }}>
                                              Username : {userName}
                                            </Typography>
                                            <Typography style={{ fontSize: '14px' }}>
                                              Password: {password}
                                            </Typography>
                                          </Box>
                                        </>
                                        }
                                        <div style={{ position: 'absolute', bottom: '20px', width: '96%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                          <Button
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            onClick={handleGotoLogin}
                                            style={{ fontWeight: 'bolder', marginTop: '5%' }}
                                          >
                                            Go To Login
                                          </Button>
                                        </div>
                                      </>}
                                  </Typography>
                                </>}

                              {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
                              {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, paddingLeft: '63.5%' }}> */}
                              {/* {activeStep != 0 && (
                                      <Button
                                        className="button"
                                        color="inherit"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                        variant="outlined"
                                      >
                                        Back
                                      </Button>
                                    )} */}
                              {/* <Box sx={{ flex: '1 1 auto' }} /> */}
                              {/* {isStepOptional(activeStep) && (
                              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                              </Button>
                            )} */}
                              {/* <Button onClick={handleNext}>
                              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button> */}
                              {/* </Box> */}
                            </React.Fragment>
                          )}
                        </Box>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col md={3} lg={3} xs={12}></Col>
              </Row>
            </>
          }
        </Container>
      </OverviewWrapper >
    </div >
  );
}

export default Login;
