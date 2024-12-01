import { Helmet } from 'react-helmet-async';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import PageTitleWrapper from '../../components/PageTitleWrapper';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {
  Grid,
  Container,
  Avatar,
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
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
  FormControl,
  InputAdornment,
  TextField,
  Paper,
  colors
} from '@mui/material';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent } from 'react';
import APIservice from 'src/utils/APIservice';
import Loader1 from '../Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './../smallScreen.css';
import { AppUser, AppUserDocuments } from 'src/models/appuser';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function ApplicationsUser() {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [row, setRow] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = React.useState<AppUser[]>([]);
  const [ischeckUnBlock, setIsCheckUnBlock] = useState(false);
  const [unblock, setUnblock] = useState<any>([]);
  let [search, setSearch] = useState('');
  let [credentail, setCredentail] = useState<any>();

  const [isDocumentUpload, setIsDocumentUpload] = useState(false);
  const [userDocuments, setUserDocuments] = React.useState<AppUserDocuments[]>([]);

  const [isReadPermission, setIsReadPermission] = useState(true);
  const [isWritePermission, setIsWritePermission] = useState(true);
  const [isEditPermission, setIsEditPermission] = useState(true);
  const [isDeletePermission, setIsDeletePermission] = useState(true);
  const [isVerifyProfile, setVerifyProfile] = useState(false);
  const [userId, setUserId] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [isUserProfilePicApprove, setUserProfilePicApproval] = useState(false);
  const [isProfileConfirmation, setIsProfileConfirmationDialog] = useState(false);
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState();

  let [apiUrl, setApiUrl] = useState<any>();

  const handleClickVisible = (element: any) => {
    let id = element?.id;
    navigate(`/admin/appuser/view/${id}`);
  };

  const handleVerifyProfilePic = (element: any) => {
    let id = element?.id;
    let imageUrl = element?.imageUrl;
    setUserId(id)
    setVerifyProfile(true);
    setImageUrl(imageUrl)
  };
  const ITEM_HEIGHT = 48;

  React.useEffect(() => {
    let cred = JSON.parse(localStorage.getItem('Credentials'));
    let isUserProfilePicApprove = JSON.parse(localStorage.getItem('isUserProfilePicApprove'));
    setCredentail(cred);
    setUserProfilePicApproval(isUserProfilePicApprove);
    if (cred) {
      if (cred.roleId != 1) {
        let ind = cred.pagePermissions.findIndex((c: any) => c.title === "App Users");
        if (ind >= 0) {
          setIsReadPermission(cred.pagePermissions[ind].isReadPermission);
          setIsWritePermission(cred.pagePermissions[ind].isAddPermission)
          setIsEditPermission(cred.pagePermissions[ind].isEditPermission);
          setIsDeletePermission(cred.pagePermissions[ind].isDeletePermission);

          if (cred.pagePermissions[ind].isReadPermission)
            getData(page, limit);
          loadjson();
        }
      } else {
        getData(page, limit);
        loadjson()
      }
    }
  }, []);

  const dateData = localStorage.getItem('DateFormat');

  const loadjson = async () => {
    let res = await fetch('/admin/variable.json'); // Adjust the file path as needed
    let url = await res.json();
    console.log(url);
    setApiUrl(url);
    apiUrl = url;
  }

  const getData = async (startIndex: number, fetchRecord: number) => {
    try {
      if (search) {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
          startIndex: startIndex,
          fetchRecord: fetchRecord,
          searchString: search ? search : ''
        };
        let res = await APIservice.httpPost(
          '/api/admin/appUsers/getAppUsers',
          obj,
          token,
          refreshToken
        );
        for (let i = 0; i < res.recordList.length; i++) {
          if (res.recordList[i].userDocuments && res.recordList[i].userDocuments.length > 0) {
            res.recordList[i].isDocumentUploaded = true;
            res.recordList[i].isDocumentVerified = true;
            for (let j = 0; j < res.recordList[i].userDocuments.length; j++) {
              res.recordList[i].userDocuments[j].isError = false;
              if (!res.recordList[i].userDocuments[j].isVerified) {
                res.recordList[i].isDocumentVerified = false;
              }
            }
          } else {
            res.recordList[i].isDocumentUploaded = false;
          }
        }
        setUsers(res.recordList);
        setRow(res.totalRecords);
      } else {
        setIsLoading(true);
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
          startIndex: startIndex,
          fetchRecord: fetchRecord
        };
        let res = await APIservice.httpPost(
          '/api/admin/appUsers/getAppUsers',
          obj,
          token,
          refreshToken
        );
        for (let i = 0; i < res.recordList.length; i++) {
          if (res.recordList[i].userDocuments && res.recordList[i].userDocuments.length > 0) {
            res.recordList[i].isDocumentUploaded = true;
            res.recordList[i].isDocumentVerified = true;
            for (let j = 0; j < res.recordList[i].userDocuments.length; j++) {
              res.recordList[i].userDocuments[j].isError = false;
              if (!res.recordList[i].userDocuments[j].isVerified) {
                res.recordList[i].isDocumentVerified = false;
              }
            }
          } else {
            res.recordList[i].isDocumentUploaded = false;
          }
        }
        setUsers(res.recordList);
        setRow(res.totalRecords);
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
  };

  const searchData = (e) => {
    setSearch(e.target.value);
    search = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    getData(page, limit);
  };

  const handleClose = () => {
    setIsCheckUnBlock(false);
  };

  const handleClickUnBlock = async (id: number) => {
    let obj = {
      id: id
    };
    setUnblock(obj);
    setIsCheckUnBlock(true);
  };

  const handleCheckUnBlock = async () => {
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        id: unblock.id,
        status: 0
      };
      const res = await APIservice.httpPost(
        '/api/admin/appUsers/unblockUserRequest',
        obj,
        token,
        refreshToken
      );
      if (res && res.status === 200) {
        setIsCheckUnBlock(false);
        getData(page * limit, limit);
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
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
    getData(newPage * limit, limit);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
    getData(0, parseInt(event.target.value));
  };

  const theme = useTheme();

  const handleClickOpenDoc = async (element: AppUser) => {
    setIsDocumentUpload(true);
    setUserDocuments(element.userDocuments);
  }

  const handleDocumentUploadClose = () => {
    setIsDocumentUpload(false);
  }

  const handleVerifyProfilePicClose = () => {
    setIsProfileConfirmationDialog(false);
    setVerifyProfile(false);
  }

  const handleApprovedDocument = async () => {
    for (let i = 0; i < userDocuments.length; i++) {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        id: userDocuments[i].id,
        isVerified: true,
      };
      let res = await APIservice.httpPost(
        '/api/admin/appUsers/approveDocument',
        obj,
        token,
        refreshToken
      );
      if (res && res.status === 200) {
        handleDocumentUploadClose();
        getData(page, limit);
      }
    }
  }

  const handleVerifyProfile = async () => {
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
      getData(page, limit);
    }
  }

  const handleProfileConfirmation = async (isVerified) => {
    setIsVerified(isVerified);
    setIsProfileConfirmationDialog(true);
    setVerifyProfile(false);
  }
  const [errorArray, setErrorArray] = useState<boolean[]>([]);
  const handleImageError = (ele: AppUserDocuments, index: number) => {
    setErrorArray((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = true;
      return newErrors;
    });
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    debugger
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


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
        <title>App Users</title>
      </Helmet>
      <PageTitleWrapper>
        <Box pt={1.2} pb={1.1} pl={1}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              {/* <Typography variant="h3" component="h3" gutterBottom>
                App Users
              </Typography> */}
              <Stack alignItems="left" justifyContent="space-between">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link to="/admin" style={{ display: 'flex', color: 'black' }}>
                    <HomeIcon />
                  </Link>
                  <Typography
                    variant="subtitle2"
                    color="inherit"
                    style={{ fontWeight: 'bold' }}
                  >
                    {' '}
                    App Users
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Grid>
            <Grid item>
              <FormControl sx={{ mt: { xs: 0, md: 0 } }}>
                <TextField
                  id="outlined-basic"
                  name="searchString"
                  value={search}
                  onChange={(e) => searchData(e)}
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
              <Card className="appcard">
                <div>
                  {isLoading ? (
                    <Loader1 title="Loading..." />
                  ) : (
                    <>
                      <Divider />
                      {isReadPermission && users && users.length > 0 ? (
                        <>
                          <TableContainer className="apptableContainer">
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
                                  <TableCell align="left">
                                    <Typography
                                      noWrap
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        marginBottom: 'none'
                                      }}
                                    >
                                      Name
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        marginBottom: 'none'
                                      }}
                                    >
                                      Email
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        marginBottom: 'none'
                                      }}
                                      noWrap
                                    >
                                      Contact No
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      noWrap
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        marginBottom: 'none'
                                      }}
                                    >
                                      Gender
                                    </Typography>
                                  </TableCell>
                                  {/* <TableCell align="center">Created Date</TableCell> */}
                                  <TableCell align="center">
                                    <Typography
                                      noWrap
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        marginBottom: 'none'
                                      }}
                                    >
                                      Document Status
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
                                {users.map((arr: any, index: number) => {
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
                                      <TableCell align="center">
                                        <Stack
                                          direction="row"
                                          alignItems="center"
                                          spacing={2}
                                        >
                                          {arr.imageUrl ? (
                                            <Avatar
                                              src={
                                                
                                                arr.imageUrl
                                              }

                                            ></Avatar>
                                          ) : (
                                            <Avatar>
                                              {arr.firstName
                                                ? arr.firstName[0]
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
                                            {arr.firstName} {arr.middleName}{' '}
                                            {arr.lastName}
                                          </Typography>
                                        </Stack>
                                        {arr.imageId && arr.isVerifyProfilePic && isUserProfilePicApprove ? <>
                                          <Box sx={{
                                            backgroundColor: '#78b144', padding: '10px', borderRadius: '50%', height: '20px', width: '20px', top: '-16px', position: 'relative', right: '-20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                          }}>
                                            <CheckIcon sx={{ 'font-size': '16px', color: '#fff' }} />
                                          </Box>
                                        </> : <></>}
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography
                                          variant="body1"
                                          fontWeight="bold"
                                          color="text.primary"
                                          gutterBottom
                                          noWrap
                                        >
                                          {arr.email}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography
                                          variant="body1"
                                          fontWeight="bold"
                                          color="text.primary"
                                          gutterBottom
                                          noWrap
                                        >
                                          {arr.contactNo ? arr.contactNo : '--'}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography
                                          variant="body1"
                                          fontWeight="bold"
                                          color="text.primary"
                                          gutterBottom
                                          noWrap
                                        >
                                          {arr.gender}
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
                                          {(arr.isDocumentUploaded) ?
                                            (<>
                                              {isEditPermission ?
                                                <>
                                                  {arr.isDocumentVerified ? <span style={{ color: '#1fb71f' }}>Verified</span> :
                                                    <Button
                                                      sx={{ float: 'right' }}
                                                      className="buttonLarge"
                                                      variant="contained"
                                                      onClick={() => { handleClickOpenDoc(arr) }}
                                                      size="small"
                                                    >Verify Doc</Button>
                                                  }
                                                </>
                                                : <></>
                                              }
                                            </>)
                                            : <span style={{ color: '#ff0000' }}>Not Uploaded</span>}
                                        </Typography>
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        sx={{ diaplay: 'flex' }}
                                      >
                                        <Tooltip title="View" arrow>
                                          <IconButton
                                            sx={{
                                              '&:hover': {
                                                background:
                                                  theme.colors.error.lighter
                                              },
                                              color: theme.palette.primary.main
                                            }}
                                            color="inherit"
                                            size="small"
                                            onClick={(e) => {
                                              handleClickVisible(arr);
                                            }}
                                          >
                                            <VisibilityIcon />
                                          </IconButton>
                                        </Tooltip>
                                        {!arr.isVerifyProfilePic && arr.imageId && isUserProfilePicApprove ? <>
                                          <Tooltip title="Verify User Profile Pic" arrow>
                                            <IconButton
                                              sx={{
                                                '&:hover': {
                                                  background:
                                                    theme.colors.error.lighter
                                                },
                                                color: theme.palette.primary.main
                                              }}
                                              color="inherit"
                                              size="small"
                                              onClick={(e) => {
                                                handleVerifyProfilePic(arr);
                                              }}
                                            >
                                              {/* <HowToRegIcon /> */}
                                              <AdminPanelSettingsIcon />
                                            </IconButton>
                                          </Tooltip>
                                        </> : <></>}
                                        {isEditPermission ? <>
                                          {arr.isDisable === 1 && (
                                            <Tooltip title="Block" arrow>
                                              <IconButton
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
                                                  handleClickUnBlock(arr.id)
                                                }
                                              >
                                                <LockIcon />
                                              </IconButton>
                                            </Tooltip>
                                          )}
                                        </> : <></>}
                                        {/* <IconButton
                                          aria-label="more"
                                          id="long-button"
                                          aria-controls={open ? 'long-menu' : undefined}
                                          aria-expanded={open ? 'true' : undefined}
                                          aria-haspopup="true"
                                          onClick={handleClick}
                                        >
                                          <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                          id="long-menu"
                                          MenuListProps={{
                                            'aria-labelledby': 'long-button',
                                          }}
                                          anchorEl={anchorEl}
                                          open={open}
                                          onClose={handleCloseMenu}
                                          PaperProps={{
                                            style: {
                                              maxHeight: ITEM_HEIGHT * 4.5,
                                              width: '20ch',
                                            },
                                          }}
                                        >
                                          <MenuItem key="view" sx={{ 'padding': '0px' }} selected>
                                            <IconButton
                                              sx={{
                                                '&:hover': {
                                                  background:
                                                    theme.colors.error.lighter
                                                },
                                                color: theme.palette.primary.main,
                                                'font-size': '16px'
                                              }}
                                              color="inherit"
                                              size="small"
                                              onClick={(e) => {
                                                handleClickVisible(arr);
                                              }}
                                            >
                                              <VisibilityIcon sx={{ fontSize: '26px', paddingRight: '10px' }} />View Profile
                                            </IconButton>
                                          </MenuItem>
                                          {!arr.isVerifyProfilePic && arr.imageId && isUserProfilePicApprove && (
                                            <MenuItem key="verify" sx={{ 'padding': '0px' }}>
                                              <IconButton
                                                sx={{
                                                  '&:hover': {
                                                    background:
                                                      theme.colors.error.lighter
                                                  },
                                                  color: theme.palette.primary.main,
                                                  'font-size': '16px'
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={(e) => {
                                                  handleVerifyProfilePic(arr);
                                                }}
                                              >
                                                <HowToRegIcon sx={{ fontSize: '26px', paddingRight: '10px' }} />Verify ProfilePic
                                              </IconButton>
                                            </MenuItem>
                                          )}
                                        </Menu> */}
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
                              count={row} //totalrecord
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
                          className="appcard"
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

              <div>
                <Dialog
                  open={ischeckUnBlock}
                  onClose={handleClose}
                  fullWidth
                  maxWidth="xs"
                >
                  <DialogTitle
                    sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
                  >
                    UnBlock
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
                    >
                      Are you sure you want to UnBlock?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                    <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleCheckUnBlock} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
                  </DialogActions>
                </Dialog>
              </div>

              <div>
                <Dialog
                  open={isDocumentUpload}
                  onClose={handleDocumentUploadClose}
                  fullWidth
                  maxWidth="md"
                >
                  <DialogTitle
                    sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
                  >
                    Documents
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
                    >
                      <Grid container spacing={2}>
                        {userDocuments && userDocuments.length > 0 && userDocuments.map((ele: AppUserDocuments, ind: number) => {
                          return (
                            <Grid key={ele.id} item xs={6}>
                              <div>
                                {errorArray[ind] ? (
                                  <img src="/defaultDocument.jpg" alt="Default Image" style={{ height: 'calc(100vh - 650px)', width: 'auto' }} />
                                ) : (
                                    <img src={ ele.documentUrl} style={{ height: 'calc(100vh - 650px)', width: 'auto' }} onError={() => { handleImageError(ele, ind); ele.isError = true; }}></img>
                                )}
                                <br></br>
                                {ele.documentTypeName}
                              </div>
                            </Grid>
                          )
                        })}
                      </Grid>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDocumentUploadClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                    <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleApprovedDocument} variant="outlined" style={{ marginRight: '10px' }}>Aproved</Button>
                  </DialogActions>
                </Dialog>
              </div>
              <div>
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
                      // <Avatar
                      //   sx={{ margin: 'auto', height: '140px', width: '140px', marginBottom: '10px', marginTop: '10px', borderRadius: '0px' }}
                      //   src={
                      //     process.env
                      //       .REACT_APP_IMAGE_URL +
                      //     imageUrl
                      //   }

                      // ></Avatar>
                    )
                    }

                    {/* <DialogContentText
                      style={{
                        fontSize: '24px',
                        letterSpacing: '0.00938em',
                        textAlign: 'center'
                      }}
                    >
                      Verify Profile
                    </DialogContentText> */}
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
              </div>
              <div>
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
              </div>
            </>
          </Grid>
        </Grid >
      </Container >
      {/* <Footer /> */}
    </>
  );
}

export default ApplicationsUser;
