import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from '../../components/PageTitleWrapper';
import {
  Grid,
  Container,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormHelperText,
  IconButton,
  Stack,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  FormControl,
  InputAdornment,
  Paper,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent } from 'react';
import Loader1 from '../Loader';
import APIservice from 'src/utils/APIservice';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../smallScreen.css';
import { Religion } from 'src/models/religion';
import { Community } from 'src/models/community';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },
  '& .MuiPaper-root': {
    height: '410px'
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{ m: 0, p: 2, fontSize: '18px', fontWeight: 'bold' }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 13,
            top: 13,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const initialState = {
  id: 0,
  name: '',
  religionId: 0,
  communityId: 0
};

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

function SubCommunity() {
  const [religions, setReligions] = React.useState<Religion[]>([]);
  const [communities, setCommunities] = React.useState<Community[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [row, setRow] = useState<number>(10);
  const [subCommunities, setSubCommunities] = React.useState<any>([]);
  const [v1, setV1] = React.useState<any>(initialState);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [ischeck, setIsCheck] = useState(false);
  const [isSubCommunityError, setSubCommunityError] = useState(false);
  const [subCommunityErrorMsg, setSubCommunityErrorMsg] = useState('');
  let [search, setSearch] = useState('');
  const [isReligionError, setIsReligionError] = useState(false);
  const [isReligionErrorMsg, setIsReligionErrorMsg] = useState('');
  const [isCommunityError, setIsCommunityError] = useState(false);
  const [isCommunityErrorMsg, setIsCommunityErrorMsg] = useState('');
  let [credentail, setCredentail] = useState<any>();

  const [isReadPermission, setIsReadPermission] = useState(true);
  const [isWritePermission, setIsWritePermission] = useState(true);
  const [isEditPermission, setIsEditPermission] = useState(true);
  const [isDeletePermission, setIsDeletePermission] = useState(true);

  const navigate = useNavigate();

  const [isNameError, setNameError] = useState(false);
  const [NameErrorMsg, setNameErrorMsg] = useState('');

  // window.onpopstate = () => {
  //   navigate(-1);
  // }

  React.useEffect(() => {
    let cred = JSON.parse(localStorage.getItem('Credentials'));
    setCredentail(cred);
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
    await getReligionData();
    //getCommunityData();
    await getdata(page, limit);
    setIsOpen(false);
  }

  const getReligionData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      const res = await APIservice.httpPost(
        '/api/admin/religion/getReligion',
        {
          isActive: true
        },
        token,
        refreshToken
      );
      if (res && res.status == 200) {
        setIsLoading(false);
        setReligions(res.recordList);
      } else {
        setIsLoading(false);
        setReligions([]);
      }
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

  const getCommunityData = async (id?: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      const res = await APIservice.httpPost(
        '/api/admin/community/getCommunity',
        {
          isActive: true,
          religionId: id ? id : 0
        },
        token,
        refreshToken
      );
      if (res && res.status == 200) {
        setIsLoading(false);
        setCommunities(res.recordList);
      } else {
        setIsLoading(false);
        setCommunities([]);
      }
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

  const reg = new RegExp(/^[a-zA-Z_ ]+$/);
  const validateName = (arr) => {
    const { name, value } = arr.target;
    if (value) {
      if (reg.test(arr.target.value)) {
        setNameError(false);
        setNameErrorMsg('');
      } else {
        setNameError(true);
        setNameErrorMsg('Alphabet and space allowed');
      }
    } else {
      setNameError(true);
      setNameErrorMsg('Sub Community is required');
    }
  };

  const validateReligion = (arr) => {
    debugger
    const { name, value } = arr.target;
    if (value) {
      setIsReligionError(false);
      setIsReligionErrorMsg('');
    } else {
      setIsReligionError(true);
      setIsReligionErrorMsg('Religion is required');
    }
  };

  const validateCommunity = (arr) => {
    const { name, value } = arr.target;
    if (value) {
      setIsCommunityError(false);
      setIsCommunityErrorMsg('');
    } else {
      setIsCommunityError(true);
      setIsCommunityErrorMsg('Community is required');
    }
  };

  const validateForm = (e: any) => {
    e.preventDefault();
    var flag = true;
    if (!v1.name) {
      setNameError(true);
      setNameErrorMsg('Sub Community is required');
      flag = false;
    } else {
      if (reg.test(v1.name)) {
        setNameError(false);
        setNameErrorMsg('');
        flag = true;
      } else {
        setNameError(true);
        setNameErrorMsg('Alphabet and space allowed');
        flag = false;
      }
    }
    if (!v1.religionId) {
      setIsReligionError(true);
      setIsReligionErrorMsg('Religion is required');
      flag = false;
    }
    if (!v1.communityId) {
      setIsCommunityError(true);
      setIsCommunityErrorMsg('Community is required');
      flag = false;
    }
    return flag;
  };

  const handleCloseSubCommunityDialog = () => {
    setIsOpen(false);
  };

  const handleClickisAdd = async () => {
    setV1(initialState);
    setIsOpen(true);
    setNameError(false);
    setNameErrorMsg('');
    setIsReligionError(false);
    setIsReligionErrorMsg('');
    setIsCommunityError(false);
    setIsCommunityErrorMsg('');
    setSubCommunityError(false);
    setSubCommunityErrorMsg('');
  };

  const handleClickisEdit = async (no: number, st: string, religionId: number, communityId: number) => {
    if (religionId) {
      await getCommunityData(religionId);
    }
    let obj = {
      id: no,
      name: st,
      religionId: religionId,
      communityId: communityId
    };
    setV1(obj);
    setIsOpen(true);
    setNameError(false);
    setNameErrorMsg('');
    setIsReligionError(false);
    setIsReligionErrorMsg('');
    setIsCommunityError(false);
    setIsCommunityErrorMsg('');
    setSubCommunityError(false);
    setSubCommunityErrorMsg('');
  };

  const handleInputChange = (arr: any) => {
    const { name, value } = arr.target;
    setV1({ ...v1, [name]: value });
  };

  const handleReligionChange = async (e: any) => {
    const { name, value } = e.target;
    setV1({
      ...v1,
      [name]: value,
      communityId: 0,
    });
    await getCommunityData(value);
  };

  const handleCommunityChange = async (e: any) => {
    const { name, value } = e.target;
    setV1({
      ...v1,
      [name]: value
    });
  };

  const handleSwitch = async (id: number, status: number) => {
    let obj = {
      id: id,
      status: status
    };
    setV1(obj);
    setIsCheck(true);
  };

  const handleClose = () => {
    setIsCheck(false);
  };

  const handleSwitchCheck = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: v1.id
    };
    const res = await APIservice.httpPost(
      '/api/admin/subCommunity/activeInactiveSubCommunity',
      obj,
      token,
      refreshToken
    );
    setIsCheck(false);
    getdata(page * limit, limit);
  };

  const getdata = async (startIndex: number, fetchRecord: number) => {
    try {
      setIsLoading(true);
      if (search) {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
          startIndex: startIndex,
          fetchRecord: fetchRecord,
          name: search ? search : ''
        };
        const res = await APIservice.httpPost(
          '/api/admin/subCommunity/getSubCommunity',
          obj,
          token,
          refreshToken
        );
        setSubCommunities(res.recordList);
        setRow(res.totalRecords);
      } else {
        setIsLoading(true);
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
          startIndex: startIndex,
          fetchRecord: fetchRecord
        };
        const res = await APIservice.httpPost(
          '/api/admin/subCommunity/getSubCommunity',
          obj,
          token,
          refreshToken
        );
        setSubCommunities(res.recordList);
        setRow(res.totalRecords);
        if (res && res.status == 200) {
          setIsOpen(false);
        } else if (res.status == 401) {
          navigate('/admin');
          localStorage.clear();
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
        setIsLoading(false);
      }
    } catch (error) {
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
  };

  const saveSubCommunity = async (e: any) => {
    var flag = validateForm(e);
    if (flag) {
      try {
        if (v1.id) {
          //Update
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          let val = {
            id: v1.id,
            name: v1.name,
            religionId: v1.religionId,
            communityId: v1.communityId
          };
          const res = await APIservice.httpPost(
            '/api/admin/subCommunity/insertUpdateSubCommunity',
            val,
            token,
            refreshToken
          );
          if (res && res.status == 200) {
            getdata(page * limit, limit);
            setIsOpen(false);
          } else if (res.status == 401) {
            navigate('/admin');
            localStorage.clear();
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
          } else if (res.status == 203) {
            setSubCommunityError(true);
            setSubCommunityErrorMsg('Sub Community already exists!');
          }
        } else {
          //insert
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          const res = await APIservice.httpPost(
            '/api/admin/subCommunity/insertUpdateSubCommunity',
            v1,
            token,
            refreshToken
          );

          if (res && res.status == 200) {
            setPage(0);
            setIsOpen(false);
            getdata(0, limit);
          } else if (res.status == 401) {
            navigate('/admin');
            localStorage.clear();
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
          } else if (res.status == 203) {
            setSubCommunityError(true);
            setSubCommunityErrorMsg('Sub Community already exists!');
          }
        }
      } catch (error: any) {
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
    }
  };

  const searchData = (e) => {
    setSearch(e.target.value);
    search = e.target.value;
    getdata(page, limit);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
    getdata(newPage * limit, limit);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
    getdata(0, parseInt(event.target.value));
  };

  const theme = useTheme();

  return (
    <>
      <ToastContainer
        style={{ top: '10%', left: '80%' }}
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
        <title>Sub Community</title>
      </Helmet>
      <PageTitleWrapper>
        <Box p={1}>
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
                    Sub Community
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Grid>
            <Grid item>
              <Grid container spacing={1.5}>
                <Grid item>
                  {isWritePermission ? <>
                    <Button
                      className="buttonLarge"
                      sx={{
                        mt: {
                          xs: 0,
                          md: 0,
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8.3px',
                          top: '3px'
                        }
                      }}
                      variant="contained"
                      onClick={handleClickisAdd}
                      size="small"
                    >
                      <AddTwoToneIcon fontSize="small" /> Create Sub Community
                    </Button>
                    <Button
                      className="button"
                      sx={{
                        mt: {
                          xs: 0,
                          md: 0,
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8.3px',
                          top: '3px'
                        }
                      }}
                      variant="contained"
                      onClick={handleClickisAdd}
                      size="small"
                    >
                      <AddTwoToneIcon fontSize="small" />
                    </Button>
                  </> : <></>}

                </Grid>
                <Grid item>
                  <FormControl
                    sx={{ mt: { xs: 0.3, md: 0.3, lg: 0.3, sm: 0.3 } }}
                  >
                    <TextField
                      name="searchString"
                      value={search}
                      onChange={(e) => searchData(e)}
                      // size="small"
                      id="outlined-basic"
                      label="Search"
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
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
            <>
              <Card className="scommunitycard">
                <div>
                  {isloading ? (
                    <Loader1 title="Loading..." />
                  ) : (
                    <>
                      <Divider />
                      {subCommunities && subCommunities.length > 0 ? (
                        <>
                          <TableContainer className="scommunitytableContainer">
                            <Table stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      noWrap
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        marginBottom: 'none'
                                      }}
                                    >
                                      Sr. No
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      noWrap
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        marginBottom: 'none'
                                      }}
                                    >
                                      Religion
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      noWrap
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        marginBottom: 'none'
                                      }}
                                    >
                                      Community
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      noWrap
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        marginBottom: 'none'
                                      }}
                                    >
                                      Sub Community
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography
                                      noWrap
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        marginBottom: 'none'
                                      }}
                                    >
                                      Actions
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {subCommunities.map((arr: any, index: number) => {
                                  return (
                                    <TableRow hover key={arr.id}>
                                      <TableCell>
                                        <Typography
                                          variant="body1"
                                          fontWeight="bold"
                                          color="text.primary"
                                          gutterBottom
                                          noWrap
                                        >
                                          {page * limit + index + 1}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography
                                          variant="body1"
                                          fontWeight="bold"
                                          color="text.primary"
                                          gutterBottom
                                          noWrap
                                          sx={{ textTransform: 'capitalize' }}
                                        >
                                          {arr.religionName}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography
                                          variant="body1"
                                          fontWeight="bold"
                                          color="text.primary"
                                          gutterBottom
                                          noWrap
                                          sx={{ textTransform: 'capitalize' }}
                                        >
                                          {arr.communityName}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography
                                          variant="body1"
                                          fontWeight="bold"
                                          color="text.primary"
                                          gutterBottom
                                          noWrap
                                          sx={{ textTransform: 'capitalize' }}
                                        >
                                          {arr.name}
                                        </Typography>
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                      >
                                        {isEditPermission ? <>
                                          <Tooltip
                                            title={
                                              arr.isActive === 0
                                                ? 'Inactive'
                                                : 'active'
                                            }
                                            arrow
                                          >
                                            <Switch
                                              disabled={credentail?.email === "demo@admin.com"}
                                              checked={
                                                arr.isActive === 0 ? false : true
                                              }
                                              onClick={(e) =>
                                                handleSwitch(arr.id, arr.isActive)
                                              }
                                              inputProps={{
                                                'aria-label': 'controlled'
                                              }}
                                            />
                                          </Tooltip>
                                          <Tooltip title="Edit" arrow>
                                            <IconButton
                                              disabled={credentail?.email === "demo@admin.com"}
                                              sx={{
                                                '&:hover': {
                                                  background:
                                                    theme.colors.primary.lighter
                                                },
                                                color: theme.palette.primary.main
                                              }}
                                              color="inherit"
                                              size="small"
                                              onClick={(e) =>
                                                handleClickisEdit(
                                                  arr.id,
                                                  arr.name,
                                                  arr.religionId,
                                                  arr.communityId
                                                )
                                              }
                                            >
                                              <EditTwoToneIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        </> : <></>}

                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Box p={2}>
                            <TablePagination
                              component="div"
                              count={row}
                              onPageChange={handlePageChange}
                              onRowsPerPageChange={handleLimitChange}
                              page={page}
                              rowsPerPage={limit}
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
                            boxShadow: 'none'
                          }}
                          className="scommunitycard"
                        >
                          <Typography variant="h5" paragraph>
                            Data not Found
                          </Typography>
                        </Paper>
                      )}
                      <div>
                        <Dialog
                          open={ischeck}
                          onClose={handleClose}
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
                            {v1.status === 0 ? 'Inactive' : 'Active'}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText
                              style={{
                                fontSize: '1rem',
                                letterSpacing: '0.00938em'
                              }}
                            >
                              {v1.status === 0
                                ? 'Are you sure you want to Active?'
                                : 'Are you sure you want to Inactive?'}
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchCheck} variant="outlined" style={{marginRight: '10px'}}>Yes</Button>
                          </DialogActions>
                        </Dialog>
                      </div>

                      <div>
                        <BootstrapDialog
                          open={isOpen}
                          onClose={handleCloseSubCommunityDialog}
                          PaperProps={{ sx: { height: '40%' } }}
                          fullWidth
                          maxWidth="xs"
                        >
                          <BootstrapDialogTitle
                            id="customized-dialog-title"
                            onClose={handleCloseSubCommunityDialog}
                          >
                            {v1.id ? 'Edit Sub Community' : 'Add Sub Community'}
                          </BootstrapDialogTitle>
                          <DialogContent dividers>
                            <FormControl
                              sx={{ width: { lg: '100%' } }}
                            >
                              <InputLabel id="demo-multiple-name-label">
                                Religion *
                              </InputLabel>
                              <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple={false}
                                name="religionId"
                                value={v1.religionId || []}
                                onChange={(e) => {
                                  handleReligionChange(e);
                                  validateReligion(e);
                                }}
                                label="Religion"
                                MenuProps={MenuProps}
                                required={true}
                              >
                                {religions.map((arr: any) => (
                                  <MenuItem key={arr.id} value={arr.id}>
                                    {arr.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormHelperText style={{ color: 'red', height: '22px' }}>
                              {isReligionError && isReligionErrorMsg}
                            </FormHelperText>
                            <FormControl
                              sx={{ width: { lg: '100%' } }}
                            >
                              <InputLabel id="demo-multiple-name-label">
                                Community *
                              </InputLabel>
                              <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple={false}
                                name="communityId"
                                value={v1.communityId || []}
                                onChange={(e) => {
                                  handleCommunityChange(e);
                                  validateCommunity(e);
                                }}
                                label="Community"
                                MenuProps={MenuProps}
                                required={true}
                              >
                                {communities.map((arr: any) => (
                                  <MenuItem key={arr.id} value={arr.id}>
                                    {arr.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormHelperText style={{ color: 'red', height: '22px' }}>
                              {isCommunityError && isCommunityErrorMsg}
                            </FormHelperText>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="Sub Community"
                              type="text"
                              fullWidth
                              variant="outlined"
                              name="name"
                              value={v1.name}
                              onChange={(arr) => {
                                handleInputChange(arr);
                                validateName(arr);
                              }}
                              required={true}
                            />
                            <FormHelperText
                              style={{ color: 'red', height: '22px' }}
                            >
                              {isNameError && NameErrorMsg}
                            </FormHelperText>
                          </DialogContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              p: '8px'
                            }}
                          >
                            <FormHelperText
                              style={{
                                color: 'red',
                                height: '22px',
                                margin: 'none',
                                padding: '8px 0px'
                              }}
                            >
                              {isSubCommunityError && subCommunityErrorMsg}
                            </FormHelperText>
                            <Typography>
                              <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleCloseSubCommunityDialog} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
                              <Button disabled={credentail?.email === "demo@admin.com"} onClick={saveSubCommunity} variant="outlined" style={{marginRight: '10px'}}>Save</Button>
                            </Typography>

                          </Box>
                        </BootstrapDialog>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </>
          </Grid>
        </Grid>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

export default SubCommunity;
