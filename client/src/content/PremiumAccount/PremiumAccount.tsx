import {
  Box,
  Breadcrumbs,
  Typography,
  Grid,
  Stack,
  Container,
  Card,
  CardContent,
  FormControl,
  Select,
  InputLabel,
  Button,
  TextField,
  FormHelperText,
  MenuItem,
  useTheme,
  Chip,
  Divider,
  InputAdornment,
  TableContainer,
  Tooltip,
  IconButton,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  CardHeader,
  Paper,
  Tabs,
  Accordion,
  AccordionSummary
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import HomeIcon from '@mui/icons-material/Home';
import PercentIcon from '@mui/icons-material/Percent';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import Text from 'src/components/Text';
import Loader1 from '../Loader';
import APIservice from 'src/utils/APIservice';
import { Col, Row } from 'react-bootstrap';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../smallScreen.css';
import { TrainRounded } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const initialState = {
  id: 0,
  name: '',
  baseAmount: '',
  weightage: '',
  facility: '',
  premiumFacilityId: '',
  duration: '',
  discount: ''
};

const PremiumAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('0');
  const [ischeck, setIsCheck] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDel, setIsDel] = useState(false);
  const [premiumAccount, setPremiumAccount] = useState<any>(initialState);
  const [packages, setPackages] = useState<any>([]);
  const [premiumFacility, setPremiumFacility] = useState<any>([]);
  const [duration, setDuration] = useState<any>([]);
  const [timeDuration, setTimeDuration] = useState<any>([]);
  const [isValueError, setIsValueError] = useState(false);
  const [isValueErrorMsg, setIsValueErrorMsg] = useState('');
  const [isNameError, setIsNameError] = useState(false);
  const [isNameErrorMsg, setIsNameErrorMsg] = useState('');
  const [isNumError, setIsNumError] = useState(false);
  const [isNumErrorMsg, setIsNumErrorMsg] = useState('');
  const [isWeightageError, setIsWeightageError] = useState(false);
  const [isWeightageErrorMsg, setIsWeightageErrorMsg] = useState('');
  const [isFacilityError, setIsFacilityError] = useState(false);
  const [isFacilityErrorMsg, setIsFacilityErrorMsg] = useState('');
  const [isDurationError, setIsDurationError] = useState(false);
  const [isDurationErrorMsg, setIsDurationErrorMsg] = useState('');
  const [isPackageError, setPackageError] = useState(false);
  const [PackageErrorMsg, setPackageErrorMsg] = useState('');
  const [premium, setPremium] = useState<any>([]);
  let [credentail, setCredentail] = useState<any>();
  let [defaultCurrencySymbol, setDefaultCurrencySymbol] = useState<any>();
  const [isOpenInstruction, setIsOpenInstruction] = useState(false);

  const [isReadPermission, setIsReadPermission] = useState(true);
  const [isWritePermission, setIsWritePermission] = useState(true);
  const [isEditPermission, setIsEditPermission] = useState(true);
  const [isDeletePermission, setIsDeletePermission] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    debugger
    let cred = JSON.parse(localStorage.getItem('Credentials'));
    setCredentail(cred);
    let defaultCurr = JSON.parse(localStorage.getItem('DefaultCurrency'));
    setDefaultCurrencySymbol(defaultCurr ? defaultCurr.symbol : '₹');
    defaultCurrencySymbol = defaultCurr ? defaultCurr.symbol : '₹';
    if (cred) {
      if (cred.roleId != 1) {
        let ind = cred.pagePermissions.findIndex((c: any) => c.title === "Block Users");
        if (ind >= 0) {
          setIsReadPermission(cred.pagePermissions[ind].isReadPermission);
          setIsWritePermission(cred.pagePermissions[ind].isAddPermission)
          setIsEditPermission(cred.pagePermissions[ind].isEditPermission);
          setIsDeletePermission(cred.pagePermissions[ind].isDeletePermission);

          if (cred.pagePermissions[ind].isReadPermission)
            loadData();
        }
      } else {
        loadData();
      }
    }
  }, []);

  const loadData = async () => {
    await getData();
    await getTimeDuration();
    await getPremiumFacility();
  }

  const reg = new RegExp(/^\d+\.?\d*$/);
  const validateDecimalNumber = (arr: any) => {
    const { name, value } = arr.target;
    if (value) {
      if (reg.test(arr.target.value)) {
        setIsValueError(false);
        setIsValueErrorMsg('');
      } else {
        setIsValueError(true);
        setIsValueErrorMsg('Only Number with one decimal point');
      }
    } else {
      setIsValueError(true);
      setIsValueErrorMsg('Discount is required');
    }
  };

  const reg2 = new RegExp(/^[a-zA-Z_ ]+$/);
  const ValidateName = (arr) => {
    const { name, value } = arr.target;
    if (value) {
      if (reg2.test(arr.target.value)) {
        setIsNameError(false);
        setIsNameErrorMsg('');
      } else {
        setIsNameError(true);
        setIsNameErrorMsg('Alphabet and space allowed');
      }
    } else {
      setIsNameError(true);
      setIsNameErrorMsg('Name is required');
    }
  };

  const reg1 = new RegExp('^[0-9]*$');
  const validateNumber = (arr: any) => {
    const { name, value } = arr.target;
    if (value) {
      if (reg1.test(arr.target.value)) {
        setIsNumError(false);
        setIsNumErrorMsg('');
      } else {
        setIsNumError(true);
        setIsNumErrorMsg('Only number is allowed');
      }
    } else {
      setIsNumError(true);
      setIsNumErrorMsg('Base amount is required');
    }
  };

  const validateWeightage = (arr: any) => {
    const { name, value } = arr.target;
    if (value) {
      if (reg1.test(arr.target.value)) {
        setIsWeightageError(false);
        setIsWeightageErrorMsg('');
      } else {
        setIsWeightageError(true);
        setIsWeightageErrorMsg('Only number is allowed');
      }
    } else {
      setIsWeightageError(true);
      setIsWeightageErrorMsg('Weightage is required');
    }
  };

  const validateDuration = (arr: any) => {
    const { name, value } = arr.target;
    if (value) {
      setIsDurationError(false);
      setIsDurationErrorMsg('');
    } else {
      setIsDurationError(true);
      setIsDurationErrorMsg('Time duration is required');
    }
  };

  const validateFacility = (arr: any) => {
    const { name, value } = arr.target;
    if (value) {
      setIsFacilityError(false);
      setIsFacilityErrorMsg('');
    } else {
      setIsFacilityError(true);
      setIsFacilityErrorMsg('Premium facility is required');
    }
  };

  const validateForm = (e: any) => {
    debugger
    e.preventDefault();
    var flag = true;
    if (!premiumAccount.discount) {
      setIsValueError(true);
      setIsValueErrorMsg('Discount is required');
      flag = false;
    } else {
      if (reg.test(premiumAccount.discount)) {
        setIsValueError(false);
        setIsValueErrorMsg('');
      } else {
        setIsValueError(true);
        setIsValueErrorMsg('Only number with one decimal point ');
        flag = false;
      }
    }
    if (premiumAccount.name) {
      setIsNameError(false);
      setIsNameErrorMsg('');
    } else {
      setIsNameError(true);
      setIsNameErrorMsg('Name is required');
      flag = false;
    }
    if (!premiumAccount.baseAmount) {
      setIsNumError(true);
      setIsNumErrorMsg('Base amount is required');
      flag = false;
    } else {
      if (reg1.test(premiumAccount.baseAmount)) {
        setIsNumError(false);
        setIsNumErrorMsg('');
      } else {
        setIsNumError(true);
        setIsNumErrorMsg('Only number is allowed');
        flag = false;
      }
    }
    if (!premiumAccount.facility) {
      setIsFacilityError(true);
      setIsFacilityErrorMsg('Premium facility is required');
      flag = false;
    } else {
      setIsFacilityError(false);
      setIsFacilityErrorMsg('');
    }
    if (!premiumAccount.duration) {
      setIsDurationError(true);
      setIsDurationErrorMsg('Time duration is required');
      flag = false;
    } else {
      setIsDurationError(false);
      setIsDurationErrorMsg('');
    }
    return flag;
  };

  const handleChange1 = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setIsCheck(false);
    setIsOpen(false);
    setIsDel(false);
  };

  const handleSwitch = (id: number, status: number) => {
    let obj = {
      id: id,
      status: status
    };
    setPremiumAccount(obj);
    setIsCheck(true);
  };

  const handleSwitchCheck = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: premiumAccount.id
    };
    const res = await APIservice.httpPost(
      '/api/admin/package/activeInactivePackage',
      obj,
      token,
      refreshToken
    );
    setIsCheck(false);
    await getData();
  };

  const handleOpenDeleteDialog = (arr: any, arr1: any) => {
    debugger
    let obj = {
      id: arr,
      packageDurationId: arr1
    };
    setPremiumAccount(obj);
    setIsDel(true);
  };

  const handleIsDeleteDialog = async () => {
    debugger
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: premiumAccount.id,
      packageDurationId: premiumAccount.packageDurationId
    };
    const res = await APIservice.httpPost(
      '/api/admin/package/deletePackage',
      obj,
      token,
      refreshToken
    );
    if (res && res.status === 200) {
      toast.error(res.recordList, {
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
    }
    setIsDel(false);
    getData();
  };

  const handleAddToOpenDialog = () => {
    debugger
    setIsNameError(false);
    setIsNameErrorMsg('');
    setIsNumError(false);
    setIsNumErrorMsg('');
    setIsValueError(false);
    setIsValueErrorMsg('');
    setPackageError(false);
    setPackageErrorMsg('');
    setIsFacilityError(false);
    setIsFacilityErrorMsg('');
    setIsDurationError(false);
    setIsDurationErrorMsg('');
    setPremiumAccount(initialState);
    setIsOpen(true);
    setPremiumFacility([]);
    setDuration([]);
  };

  const handleEditToOenDialog = (
    id: number,
    str: string,
    no: number,
    wa: number,
    str1: any,
    no1: any,
    str2: any
  ) => {
    //for facility to add in edit dialog
    let facility = [];
    if (str2 && str2.length) {
      for (let index = 0; index < str2.length; index++) {
        let data = {
          premiumFacilityId: str2[index],
          name: premium.find((c) => c.id == str2[index]).name
        };
        facility.push(data);
      }
      setPremiumFacility(facility);
    } else {
      setPremiumFacility([]);
    }
    let obj = {
      id: id,
      name: str,
      baseAmount: no,
      weightage: wa,
      duration: str1,
      discount: no1,
      facility: str2
    };
    setPremiumAccount(obj);
    setIsOpen(true);
    setIsNameError(false);
    setIsNameErrorMsg('');
    setIsValueError(false);
    setIsValueErrorMsg('');
    setPackageError(false);
    setPackageErrorMsg('');
    setIsFacilityError(false);
    setIsFacilityErrorMsg('');
    setIsDurationError(false);
    setIsDurationErrorMsg('');
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPremiumAccount({
      ...premiumAccount,
      [name]: value
    });
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      const res = await APIservice.httpPost(
        '/api/admin/package/getpackage',
        {},
        token,
        refreshToken
      );
      setPackages(res.recordList);
      if (res.status === 200) {
      } else if (res && res.status === 401) {
        navigate('/admin');
      } else if (res.status == 500) {
        setIsOpen(false);
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
        setIsOpen(false);
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
        setIsOpen(false);
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
        setIsOpen(false);
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
      setIsLoading(false);
      setIsOpen(false);
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
    setIsLoading(false);
  };

  const getPremiumFacility = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      const res = await APIservice.httpPost(
        '/api/admin/premiumFacility/getPremiumFacility',
        {},
        token,
        refreshToken
      );
      setPremium(res.recordList);
      if (res && res.status === 200) {
      } else if (res && res.status === 401) {
        localStorage.clear();
        navigate('/admin');
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleAddFacility = async () => {
    let facility = [];
    if (premiumAccount.facility && premiumAccount.facility.length > 0) {
      for (let index = 0; index < premiumAccount.facility.length; index++) {
        let data = {
          premiumFacilityId: premiumAccount.facility[index],
          name: premium.find((c) => c.id == premiumAccount.facility[index]).name
        };
        facility.push(data);
      }
      setPremiumFacility(facility);
    }
  };

  const handleDeleteFaciliity = (e: any) => {
    const data = premiumFacility.filter(
      (d: any) => d.premiumFacilityId !== e.premiumFacilityId
    );
    setPremiumFacility(data);
    let data1 = premiumAccount.facility.filter(
      (d: any) => d !== e.premiumFacilityId
    );
    let obj = {
      facility: data1
    };
    setPremiumAccount(obj);
    handleEditToOenDialog(
      premiumAccount.id,
      premiumAccount.name,
      premiumAccount.baseAmount,
      premiumAccount.weightage,
      premiumAccount.duration,
      premiumAccount.discount,
      data1
    );
  };

  const getTimeDuration = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      const res = await APIservice.httpPost(
        '/api/admin/timeDuration/getTimeDuration',
        {},
        token,
        refreshToken
      );
      setTimeDuration(res.recordList);
      if (res && res.status === 200) {
      } else if (res && res.status === 401) {
        localStorage.clear();
        navigate('/admin');
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleAddDuration = () => {
    let dataDuration = [];
    if (premiumAccount.duration && premiumAccount.discount) {
      let data = {
        timeDurationId: premiumAccount.duration,
        value: timeDuration.find((c) => c.id == premiumAccount.duration).value,
        discount: premiumAccount.discount
      };
      dataDuration.push(data);
      let ind = duration.findIndex(
        (c: any) => c.timeDurationId === premiumAccount.duration
      );
      if (ind > -1) {
        setPackageError(true);
        setPackageErrorMsg('Enter month already exists');
      } else {
        let data1 = [...duration, ...dataDuration];
        setDuration(data1);
        setPackageError(true);
        setPackageErrorMsg('');
      }
    } else {
      setPackageError(true);
      setPackageErrorMsg('Select both time duration and discount');
    }
  };

  const handleDeleteDuration = (e: any) => {
    const data = duration.filter(
      (d: any) => d.timeDurationId !== e.timeDurationId
    );
    setDuration(data);
    if (e.timeDurationId === premiumAccount.duration) {
      premiumAccount.duration = '';
      // setPremiumAccount(premiumAccount.duration)
    }
    if (e.discount === premiumAccount.discount) {
      premiumAccount.discount = '';
      // setPremiumAccount(premiumAccount.discount)
    }
  };

  const savePremiumAccount = async (e: any) => {
    debugger
    let flag = validateForm(e);
    if (
      (flag && premiumFacility.length && premiumAccount.discount.length) ||
      duration.length
    ) {
      try {
        if (premiumAccount.id) {
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          let obj = {
            id: premiumAccount.id,
            name: premiumAccount.name,
            baseAmount: premiumAccount.baseAmount,
            weightage: premiumAccount.weightage,
            facility: premiumFacility,
            timeDurationId: premiumAccount.duration,
            discount: premiumAccount.discount
          };
          const res = await APIservice.httpPost(
            '/api/admin/package/updatePackage',
            obj,
            token,
            refreshToken
          );
          if (res && res.status === 200) {
            setIsOpen(false);
            getData();
          } else if (res && res.status == 203) {
            setPackageError(true);
            setPackageErrorMsg(res.message);
          } else if (res && res.status === 401) {
            navigate('/admin');
            localStorage.clear();
          } else if (res && res.status === 500) {
            setPackageError(true);
            setPackageErrorMsg(res.message);
          } else if (res && res.status === 400) {
            setPackageError(true);
            setPackageErrorMsg(res.message);
          } else if (res && res.status === 300) {
            setPackageError(true);
            setPackageErrorMsg(res.message);
          }
        } else {
          let val = {
            id: premiumAccount.id,
            name: premiumAccount.name,
            baseAmount: premiumAccount.baseAmount,
            weightage: premiumAccount.weightage,
            facility: premiumFacility,
            duration: duration
          };
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');

          const res = await APIservice.httpPost(
            '/api/admin/package/insertPackage',
            val,
            token,
            refreshToken
          );
          if (res && res.status == 200) {
            setIsOpen(false);
            getData();
          } else if (res && res.status == 203) {
            setPackageError(true);
            setPackageErrorMsg(res.message);
          } else if (res.status == 401) {
            navigate('/admin');
            localStorage.clear();
          } else if (res && res.status === 500) {
            setPackageError(true);
            setPackageErrorMsg(res.message);
          } else if (res && res.status === 400) {
            setPackageError(true);
            setPackageErrorMsg(res.message);
          } else if (res && res.status === 300) {
            setPackageError(true);
            setPackageErrorMsg(res.message);
          }
        }
      } catch (error) {
        console.log(error);
        setIsOpen(false);
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
    } else {
      setPackageError(true);
      setPackageErrorMsg(
        'Please click on add button to insert premium facility and time duration'
      );
    }
  };

  const theme = useTheme();

  const handleOpenInstruction = async (e) => {
    e.preventDefault();
    setIsOpenInstruction(true);
  }

  const handleCloseInstruction = async (e) => {
    setIsOpenInstruction(false);
  }

  return (
    <div>
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
      <Helmet>
        <title>Packages</title>
      </Helmet>
      <PageTitleWrapper>
        <Box pt={1.1} pb={1.1} pl={1}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Stack alignItems="left" justifyContent="space-between">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link to="/admin" style={{ display: 'flex', color: 'black' }}>
                    <HomeIcon />
                  </Link>
                  <Typography
                    variant="subtitle2"
                    color="inherit"
                    fontWeight="bold"
                  >
                    Packages
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Grid>
            <Grid item>
              {isWritePermission ? <>
                <Button
                  className="buttonLarge"
                  sx={{ lineHeight: '2.04' }}
                  variant="contained"
                  onClick={handleAddToOpenDialog}
                  size="small"
                >
                  <AddTwoToneIcon fontSize="small" />
                  Create Package
                </Button>
                <Button
                  className="button"
                  sx={{ lineHeight: '2.04' }}
                  variant="contained"
                  onClick={handleAddToOpenDialog}
                  size="small"
                >
                  <AddTwoToneIcon fontSize="small" />
                </Button>
              </> : <></>}
            </Grid>
          </Grid>
        </Box>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card style={{ padding: '10px' }}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography sx={{ fontSize: '17px', fontWeight: 'bold', color: '#ff0000', padding: '10px' }}>
                    Note: Your package duration and name must be same as package created in Google Play Console and App Store(Apple Developer Account)
                  </Typography>
                </Grid>
                <Grid item>
                  <Tooltip title="Instruction " arrow>
                    <IconButton
                      disabled={credentail?.email === "demo@admin.com"}
                      sx={{
                        '&:hover': { background: theme.colors.error.lighter },
                        color: theme.palette.primary.main, padding: '10px'
                      }}
                      color="inherit" size="small"
                      onClick={(e) => { handleOpenInstruction(e) }}
                    >
                      <PriorityHighIcon></PriorityHighIcon>
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                {/* <TabContext value={value}>
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
                      onChange={handleChange1}
                      variant="scrollable"
                      // scrollButtons
                      // allowScrollButtonsMobile
                      aria-label="scrollable force tabs example"
                    >
                      {packages.map((arr: any, index: number) => (
                        <Tab
                          label={arr.value + ' months'}
                          value={index + ''}
                          key={index + ''}
                        />
                      ))}
                    </TabList>
                  </Box>
                  <TableContainer style={{ height: 'calc(100vh - 305px)' }} >
                    {packages.map((arr: any, indexs: number) => (
                      <TabPanel value={indexs + ''} key={indexs + ''}>
                        <div>
                          {isLoading ? (
                            <Loader1 title="Loading..." />
                          ) : (
                            <>
                              {arr.package && arr.package.length > 0 ? (
                                <Grid container>
                                  {arr.package.map(
                                    (data: any, dIndex: number) => (
                                      <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={3}
                                        lg={4}
                                        key={data.id}
                                      >
                                        <Card
                                          sx={{ m: 2, height: '400px' }}
                                          key={data.id}
                                        >
                                          <CardContent sx={{ height: '350px' }}>
                                            <Typography
                                              variant="body1"
                                              gutterBottom
                                              style={{
                                                padding: '16px',
                                                fontSize: '17px',
                                                fontWeight: 'bold'
                                              }}
                                            >
                                              {data.name}
                                            </Typography>
                                            {data.discount ? (
                                              <>
                                                <Box
                                                  sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    pt: 1
                                                  }}
                                                >
                                                  <Typography
                                                    variant="h3"
                                                    sx={{
                                                      pr: 1
                                                    }}
                                                  >
                                                    ₹
                                                    {data.baseAmount *
                                                      data.value -
                                                      data.baseAmount *
                                                      data.value *
                                                      (data.discount / 100)}
                                                  </Typography>
                                                  <Text color="success">
                                                    <b>-{data.discount}%</b>
                                                  </Text>
                                                </Box>
                                                <Typography
                                                  sx={{
                                                    color: 'red',
                                                    textDecoration:
                                                      'line-through',
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                    ml: '-68px'
                                                  }}
                                                >
                                                  ₹
                                                  {data.baseAmount * data.value}
                                                </Typography>
                                              </>
                                            ) : (
                                              <Box
                                                sx={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  py: 1
                                                }}
                                              >
                                                <Typography
                                                  variant="h3"
                                                  sx={{
                                                    pr: 4,
                                                    mb: 1
                                                    // textDecoration:"line-through"
                                                  }}
                                                >
                                                  {data.baseAmount * data.value}{' '}
                                                  ₹
                                                </Typography>
                                              </Box>
                                            )}
                                            <Typography
                                              sx={{ pt: 3, fontWeight: 'bold' }}
                                            >
                                              Our packages includes all the
                                              below given facilities so you can
                                              start making bonds.
                                            </Typography>

                                            {data.facility.map(
                                              (facilities: any) => (
                                                <>
                                                  <Typography
                                                    key={facilities.id}
                                                    style={{
                                                      marginTop: '10px'
                                                    }}
                                                  >
                                                    <TripOriginIcon
                                                      style={{
                                                        fontSize: '12px'
                                                      }}
                                                    />{' '}
                                                    {facilities.name}
                                                  </Typography>
                                                </>
                                              )
                                            )}
                                          </CardContent>
                                          <DialogActions>
                                            <Tooltip
                                              title={
                                                data.isActive === 0
                                                  ? 'Inactive'
                                                  : 'Active'
                                              }
                                              arrow
                                            >
                                              <Switch
                                                disabled={credentail?.email === "demo@admin.com"}
                                                checked={
                                                  data.isActive === 0
                                                    ? false
                                                    : true
                                                }
                                                onClick={(e) =>
                                                  handleSwitch(
                                                    data.id,
                                                    data.isActive
                                                  )
                                                }
                                                inputProps={{
                                                  'aria-label': 'controlled'
                                                }}
                                              />
                                            </Tooltip>
                                            <Tooltip title="Edit " arrow>
                                              <IconButton
                                                disabled={credentail?.email === "demo@admin.com"}
                                                sx={{
                                                  '&:hover': {
                                                    background:
                                                      theme.colors.error.lighter
                                                  },
                                                  color:
                                                    theme.palette.primary.main
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={(e) =>
                                                  handleEditToOenDialog(
                                                    data.id,
                                                    data.name,
                                                    data.baseAmount,
                                                    data.timeDurationId,
                                                    data.discount,
                                                    data.facility.map(
                                                      (val: any) =>
                                                        val.premiumFacilityId
                                                    )
                                                  )
                                                }
                                              >
                                                <EditTwoToneIcon fontSize="small" />
                                              </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete" arrow>
                                              <IconButton
                                                disabled={credentail?.email === "demo@admin.com"}
                                                sx={{
                                                  '&:hover': {
                                                    background:
                                                      theme.colors.error.lighter
                                                  },
                                                  color:
                                                    theme.palette.primary.main
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={(e) =>
                                                  handleOpenDeleteDialog(
                                                    data.id,
                                                    data.packageDurationId
                                                  )
                                                }
                                              >
                                                <DeleteIcon fontSize="small" />
                                              </IconButton>
                                            </Tooltip>
                                          </DialogActions>
                                        </Card>
                                      </Grid>
                                    )
                                  )}
                                </Grid>
                              ) : (
                                <Paper
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    boxShadow: 'none'
                                  }}
                                  style={{ height: 'calc(100vh - 359px)' }}
                                >
                                  <Typography variant="h5" paragraph>
                                    Data not Found
                                  </Typography>
                                </Paper>
                              )}
                            </>
                          )}
                        </div>
                      </TabPanel>
                    ))}
                  </TableContainer>
                </TabContext> */}
                {packages && packages.length > 0 ? (
                  <>
                    <TableContainer className="premiumAccounttableContainer">
                      {packages.map((arr: any, index: number) => (
                        <Accordion key={arr.id} sx={{ mt: 1 }}>
                          <AccordionSummary
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: '#495fff' }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                              bgcolor: '#c7cdfd',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Grid container justifyContent="space-between">
                              <Grid
                                item
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: '17px',
                                    fontWeight: 'bold',
                                    textTransform: 'capitalize',
                                    color: '#495fff'
                                  }}
                                >
                                  {arr.name}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: '17px',
                                    fontWeight: 'bold',
                                    textTransform: 'capitalize',
                                    color: '#495fff',
                                    paddingRight: '10px'
                                  }}
                                >
                                  Weightage-{arr.weightage}
                                </Typography>
                              </Grid>
                            </Grid>
                          </AccordionSummary>
                          {arr.package && arr.package.length > 0 ?
                            <Grid container>
                              {arr.package.map(
                                (data: any, dIndex: number) => (
                                  <Grid item xs={12} sm={6} md={3} lg={4} key={data.id}>
                                    <Card
                                      sx={{ m: 2, height: '400px' }}
                                      key={data.id}
                                    >
                                      <CardContent sx={{ height: '350px' }}>
                                        <Typography variant="body1" gutterBottom style={{ padding: '16px', fontSize: '17px', fontWeight: 'bold' }}>
                                          {data.name} - {data.value} Month
                                        </Typography>
                                        {data.discount ? (
                                          <>
                                            <Box sx={{
                                              display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 1
                                            }}>
                                              <Typography variant="h3" sx={{ pr: 1 }}>
                                                {defaultCurrencySymbol} {data.baseAmount * data.value - data.baseAmount * data.value * (data.discount / 100)}
                                              </Typography>
                                              {(data.discount != 0) &&
                                                <Text color="success">
                                                  <b>-{data.discount}%</b>
                                                </Text>
                                              }
                                              {/* <Text color="success">
                                                <b>-{data.discount}%</b>
                                              </Text> */}
                                            </Box>

                                            {(data.discount != 0) &&

                                              <Typography sx={{ color: 'red', textDecoration: 'line-through', fontWeight: 'bold', textAlign: 'center', ml: '-68px' }}>
                                                {defaultCurrencySymbol} {data.baseAmount * data.value}
                                              </Typography>

                                            }
                                            {/* <Typography sx={{ color: 'red', textDecoration: 'line-through', fontWeight: 'bold', textAlign: 'center', ml: '-68px' }}>
                                            {defaultCurrencySymbol} {data.baseAmount * data.value}
                                            </Typography> */}
                                          </>
                                        ) : (
                                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1 }}>
                                            <Typography variant="h3" sx={{ pr: 4, mb: 1 }}>
                                              {defaultCurrencySymbol} {data.baseAmount * data.value}{' '}
                                            </Typography>
                                          </Box>
                                        )}
                                        <Typography sx={{ pt: 3, fontWeight: 'bold' }}>
                                          Our packages includes all the below given facilities so you can start making bonds.
                                        </Typography>

                                        {data.facility.map(
                                          (facilities: any) => (
                                            <>
                                              <Typography key={facilities.id} style={{ marginTop: '10px' }}>
                                                <TripOriginIcon style={{ fontSize: '12px' }} />
                                                {' '}{facilities.name}
                                              </Typography>
                                            </>
                                          )
                                        )}
                                      </CardContent>
                                      <DialogActions>
                                        {isEditPermission ? <>
                                          <Tooltip title={data.isActive === 0 ? 'Inactive' : 'Active'} arrow>
                                            <Switch
                                              disabled={credentail?.email === "demo@admin.com"}
                                              checked={data.isActive === 0 ? false : true}
                                              onClick={(e) => handleSwitch(data.id, data.isActive)}
                                              inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                          </Tooltip>
                                          <Tooltip title="Edit " arrow>
                                            <IconButton
                                              disabled={credentail?.email === "demo@admin.com"}
                                              sx={{
                                                '&:hover': { background: theme.colors.error.lighter },
                                                color: theme.palette.primary.main
                                              }}
                                              color="inherit" size="small"
                                              onClick={(e) =>
                                                handleEditToOenDialog(data.id, data.name, data.baseAmount, data.weightage, data.timeDurationId, data.discount, data.facility.map((val: any) => val.premiumFacilityId))
                                              }>
                                              <EditTwoToneIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        </> : <></>}
                                        {isDeletePermission ?
                                          <Tooltip title="Delete" arrow>
                                            <IconButton
                                              disabled={credentail?.email === "demo@admin.com"}
                                              sx={{
                                                '&:hover': { background: theme.colors.error.lighter },
                                                color: theme.palette.primary.main
                                              }}
                                              color="inherit" size="small"
                                              onClick={(e) => handleOpenDeleteDialog(data.id, data.packageDurationId)}>
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                          : <></>}
                                      </DialogActions>
                                    </Card>
                                  </Grid>
                                )
                              )}
                            </Grid>
                            : (
                              <Paper
                                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', verticalAlign: 'middle', boxShadow: 'none' }}
                                style={{ height: '100px' }}
                              >
                                <Typography variant="h5" paragraph>
                                  Data not Found
                                </Typography>
                              </Paper>
                            )}
                        </Accordion>
                      ))}
                    </TableContainer>
                  </>
                ) : (
                  <Paper
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      boxShadow: 'none'
                    }}
                    className="premiumAccounttableContainer"
                  >
                    <Typography variant="h5" paragraph>
                      Data not Found
                    </Typography>
                  </Paper>
                )}
              </Box>
              {/* </CardContent> */}
            </Card>
          </Grid>
        </Grid>
      </Container>
      <div>
        <Dialog open={ischeck} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
          >
            {premiumAccount.status === 0 ? 'Inactive' : 'Active'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
            >
              {premiumAccount.status === 0
                ? 'Are you sure you want to Active?'
                : 'Are you sure you want to Inactive?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchCheck} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={isDel} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
          >
            Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
            >
              Are you sure you want to Delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleIsDeleteDialog} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '18px', fontWeight: 'bold' }}
          >
            {premiumAccount.id ? 'Edit Package' : 'Add Package'}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 13,
                top: 13,
                color: (theme) => theme.palette.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Row>
              <Col sm>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Name"
                  type="text"
                  variant="outlined"
                  required={true}
                  name="name"
                  value={premiumAccount.name}
                  onChange={(e: any) => {
                    handleChange(e);
                    ValidateName(e);
                  }}
                />
                <FormHelperText style={{ color: 'red', height: '22px' }}>
                  {isNameError && isNameErrorMsg}
                </FormHelperText>
              </Col>
              <Col sm>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Base Amount"
                  type="text"
                  variant="outlined"
                  required={true}
                  name="baseAmount"
                  value={premiumAccount.baseAmount}
                  onChange={(e) => {
                    validateNumber(e);
                    handleChange(e);
                  }}
                />
                <FormHelperText style={{ color: 'red', height: '22px' }}>
                  {isNumError && isNumErrorMsg}
                </FormHelperText>
              </Col>
              <Col sm>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Weightage"
                  type="text"
                  variant="outlined"
                  required={true}
                  name="weightage"
                  value={premiumAccount.weightage}
                  onChange={(e) => {
                    validateWeightage(e);
                    handleChange(e);
                  }}
                />
                <FormHelperText style={{ color: 'red', height: '22px' }}>
                  {isWeightageError && isWeightageErrorMsg}
                </FormHelperText>
              </Col>
            </Row>
            <Card sx={{ my: 1 }}>
              <CardHeader title="Premium Facility" />
              <Row style={{ paddingLeft: '2%', paddingRight: '2%' }}>
                <Col sm>
                  <FormControl
                    sx={{ width: { lg: 265, md: 265, sm: 265, xs: 200 } }}
                  >
                    <InputLabel id="demo-multiple-name-label">
                      Premium Facility
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      multiple={true}
                      name="facility"
                      value={premiumAccount.facility || []}
                      onChange={(e) => {
                        handleChange(e);
                        validateFacility(e);
                      }}
                      label="Premium Facility"
                      MenuProps={MenuProps}
                      required={true}
                    >
                      {premium.map((arr: any) => (
                        <MenuItem key={arr.id} value={arr.id}>
                          {arr.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormHelperText style={{ color: 'red', height: '22px' }}>
                    {isFacilityError && isFacilityErrorMsg}
                  </FormHelperText>
                </Col>
                <Col sm>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      sx={{ mt: 0.5 }}
                      variant="outlined"
                      onClick={handleAddFacility}
                    >
                      Add
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row style={{ marginBottom: '9px' }}>
                {premiumFacility.map((arr: any) => (
                  <Col
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    key={arr.premiumFacilityId}
                    style={{
                      paddingLeft: '4%',
                      paddingTop: '1.4%',
                      paddingBottom: '1.4%'
                    }}
                  >
                    <Chip
                      label={arr.name}
                      onDelete={(e) => {
                        handleDeleteFaciliity(arr);
                      }}
                    >
                      {arr.name}
                    </Chip>
                  </Col>
                ))}
              </Row>
              {/* <Divider /> */}
            </Card>
            <Card sx={{ my: 4 }}>
              <CardHeader title="Time Duration & Discount" />
              <Row style={{ paddingLeft: '2%', paddingRight: '2%' }}>
                <Col lg={4} md={4} sm={4} xs={12}>
                  {premiumAccount.id ? (
                    <FormControl
                      fullWidth
                      style={{ marginTop: '8px', marginBottom: '4px' }}
                    >
                      <InputLabel id="demo-multiple-checkbox-label">
                        Time Duration
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="duration"
                        value={premiumAccount.duration}
                        onChange={handleChange}
                        label="Time Duration"
                        required={true}
                        disabled={true}
                      >
                        {timeDuration.map((option: any) => (
                          <MenuItem value={option.id} key={option.id}>
                            {option.value} months
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <>
                      <FormControl
                        fullWidth
                        style={{ marginTop: '8px', marginBottom: '4px' }}
                      >
                        <InputLabel id="demo-multiple-checkbox-label">
                          Time Duration
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          name="duration"
                          value={premiumAccount.duration}
                          onChange={(e) => {
                            handleChange(e);
                            validateDuration(e);
                          }}
                          label="Time Duration"
                          required={true}
                        >
                          {timeDuration.map((option: any) => (
                            <MenuItem value={option.id} key={option.id}>
                              {option.value} months
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormHelperText style={{ color: 'red', height: '22px' }}>
                        {isDurationError && isDurationErrorMsg}
                      </FormHelperText>
                    </>
                  )}
                </Col>
                <Col lg={4} md={4} sm={4} xs={12}>
                  <FormControl>
                    <TextField
                      fullWidth
                      margin="dense"
                      id="name"
                      label="Discount"
                      type="text"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <PercentIcon />
                          </InputAdornment>
                        )
                      }}
                      required={true}
                      name="discount"
                      value={
                        premiumAccount.discount ? premiumAccount.discount : ''
                      }
                      onChange={(e) => {
                        validateDecimalNumber(e);
                        handleChange(e);
                      }}
                    />
                    <FormHelperText style={{ color: 'red', height: '22px' }}>
                      {isValueError && isValueErrorMsg}
                    </FormHelperText>
                  </FormControl>
                </Col>
                {!premiumAccount.id && (
                  <Col lg={4} md={4} sm={4} xs={12}>
                    <div
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button
                        // size="small"
                        sx={{ mt: 1.5 }}
                        variant="outlined"
                        onClick={handleAddDuration}
                      >
                        Add
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>
              <Row style={{ marginBottom: '9px' }}>
                {duration.map((arr: any) => (
                  <Col
                    lg={4}
                    md={4}
                    sm={6}
                    xs={12}
                    key={arr.timeDurationId}
                    style={{
                      paddingLeft: '4%',
                      paddingTop: '1.4%',
                      paddingBottom: '1.4%'
                    }}
                  >
                    <Chip
                      label={arr.value + ' months' + ',' + arr.discount + '%'}
                      onDelete={(e) => {
                        handleDeleteDuration(arr);
                      }}
                      style={{ width: '136px', maxWidth: 'none' }}
                    />
                    {/* {arr.discount ? <Chip label={arr.discount + "%"} onDelete={(e) => { handleDeleteDuration(arr.timeDurationId) }}>{arr.discount}</Chip> : " "} */}
                  </Col>
                ))}
              </Row>
            </Card>
          </DialogContent>
          <DialogContent
            sx={{ display: 'flex', justifyContent: 'space-between', p: '8px' }}
          >
            <FormHelperText
              style={{
                color: 'red',
                height: '22px',
                margin: 'none',
                padding: '8px'
              }}
            >
              {isPackageError && PackageErrorMsg}
            </FormHelperText>
              <Typography>
                <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                <Button disabled={credentail?.email === "demo@admin.com"} onClick={savePremiumAccount} variant="outlined" style={{ marginRight: '10px' }}>Save</Button>
              </Typography>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Dialog open={isOpenInstruction} onClose={handleCloseInstruction} fullWidth maxWidth="md">
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
          >
            Instruction and Restriction for Creating package
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
            >
              <Typography variant="h4" gutterBottom>
                Steps to Create Package in Google Play Console
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                1). Registered/Login Google play console developer account and Create App using below link<br />
                <a href='https://support.google.com/googleplay/android-developer/answer/9859152?hl=en#zippy=%2Cfind-your-apk-files%2Cmaximum-size-limit%2Cconfigure-play-app-signing%2Capp-version-requirements-for-play-console' rel="noreferrer" target="_blank">
                  Create and set up your app
                </a><br />
                2). After creating App you can see your created app in home page.<br />
                3). Select your created App and select <b>Subscriptions</b> under <b>Monitize</b> menu from left panel.<br />
                4). Click on <b>Create subscription</b> button, and give <b>ProductId</b> and <b>Name</b> of the subscription<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#ff0000" }}>Note:</span> Here Paroduct Id must be same as your created package name and duration<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#ff0000" }}>eg:</span> if you create package namely <b>Premium</b> with duration <b>3 Month</b>, <b>6 Month</b> and <b>12 Month</b> then you need to create <b>3 subscriptions</b><br></br>
                &nbsp;&nbsp;&nbsp;&nbsp;1. ProductId : Premium_3, Name : Premium 3<br></br>
                &nbsp;&nbsp;&nbsp;&nbsp;2. ProductId : Premium_6, Name : Premium 6<br></br>
                &nbsp;&nbsp;&nbsp;&nbsp;3. ProductId : Premium_12, Name : Premium 12<br></br>
                5). After creating subscription click on view Subscription, It will open Subscription detail<br />
                6). In Subscription detail you need to add Base Plan, for that you need to click on <b>Add Base Plan</b> button under <b>Base plans and offers</b>, It will redirect to new page <br />
                7). In Add base plan page you need to give unique base plan id, Select Prepaid as Type and duration of that subscription.
                8). Click on <b>set prices</b> besides <b>Price and availability</b>, Select Country for subscription availability and set base amount.
                9). Click on Save button and then click on Activate button.
                10). Now your subscription successfully added.
              </Typography>
              <hr />
              <Typography variant="h4" gutterBottom>
                Steps to Create Package in Apple App Store
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                1). Registered/Login Apple developer account and Create App using below link<br />
                <a href='https://docs.flutter.dev/deployment/ios' rel="noreferrer" target="_blank">Create and set up your app</a><br />
                2). After creating App you can see your created app in App page
                3). Select your created App and select <b>Subscriptions</b> under <b>Features</b> menu from left panel.<br />
                4). Click on <b>Manage</b> link under <b>Non-Renewing Subscriptions</b><br />
                5). Click on (+)Plus Icon and give <b>Reference Name</b> and <b>ProductId</b> of the subscription<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#ff0000" }}>Note:</span> Here Paroduct Id must be same as your created package name and duration<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#ff0000" }}>eg:</span> if you create package namely <b>Premium</b> with duration <b>3 Month</b>, <b>6 Month</b> and <b>12 Month</b> then you need to create <b>3 subscriptions</b><br></br>
                &nbsp;&nbsp;&nbsp;&nbsp;1. ProductId : Premium_3, Reference Name : Premium 3<br></br>
                &nbsp;&nbsp;&nbsp;&nbsp;2. ProductId : Premium_6, Reference Name : Premium 6<br></br>
                &nbsp;&nbsp;&nbsp;&nbsp;3. ProductId : Premium_12, Reference Name : Premium 12<br></br>
                6). After Creating Subscription, click on it to add price and availability detail<br></br>
                7). Click on <b>Add Availabily</b> button under <b>Availability</b> to add country for subscription availability <br></br>
                8). Click on <b>Add Pricing button</b> under <b>Price Schedule</b> to add country for subscription availability <br></br>
                8). Select Base Country Region and amount in In-App Purchase Pricing Dialog and click on Next button <br></br>
                9). If you want to change prices according to country you can change here(in Country or Region Prices) and click on Next <br></br>
                10). Click on <b>Confirm</b> button to add prices. <br></br>
                11). Click on <b>Save</b> button on the top right corner to save changes.<br></br>

              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInstruction} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PremiumAccount;
