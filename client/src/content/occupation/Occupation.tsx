import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Card,
  FormControl,
  Grid,
  Container,
  Box,
  Breadcrumbs,
  Button,
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
  FormGroup,
  Avatar,
  InputAdornment,
  Paper
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent } from 'react';
import APIservice from 'src/utils/APIservice';
import Loader1 from '../Loader';
import { Form } from 'react-bootstrap';
import Resizer from 'react-image-file-resizer';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../smallScreen.css';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },
  '& .MuiPaper-root': {
    height: '380px'
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
  imageUrl: ''
};

function Occupation() {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [row, setRow] = useState<number>(10);
  const [occupations, setOccupations] = React.useState<any>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [occupation, setOccupation] = React.useState<any>(initialState);
  const [isNameError, setNameError] = useState(false);
  const [NameErrorMsg, setNameErrorMsg] = useState('');
  const [ischeck, setIsCheck] = useState(false);
  const [isOccupationError, setOccupationError] = useState(false);
  const [OccupationErrorMsg, setOccupationErrorMsg] = useState('');
  let [image, setImage] = React.useState('');
  const [isImageError, setIsImageError] = useState(false);
  const [ImageErrorMsg, setImageErrorMsg] = useState('');
  let [search, setSearch] = useState('');
  let [credentail, setCredentail] = useState<any>();

  const [isReadPermission, setIsReadPermission] = useState(true);
  const [isWritePermission, setIsWritePermission] = useState(true);
  const [isEditPermission, setIsEditPermission] = useState(true);
  const [isDeletePermission, setIsDeletePermission] = useState(true);

  let [apiUrl, setApiUrl] = useState<any>();

  const navigate = useNavigate();

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
          loadjson()
        }
      } else {
        loadData();
        loadjson();
      }
    }

  }, []);

  const loadjson = async () => {
    let res = await fetch('/admin/variable.json'); // Adjust the file path as needed
    let url = await res.json();
    setApiUrl(url);
    apiUrl = url;
  }

  const loadData = async () => {
    await getData(page, limit);
    setIsOpen(false);
  }

  const reg = new RegExp(/^[a-zA-Z_ ]+$/);
  const validateName = (arr: any) => {
    const { value } = arr.target;
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
      setNameErrorMsg('Occupation is required');
    }
  };

  const ValidateImage = (arr: any) => {
    if (arr.target.value) {
      setIsImageError(false);
      setImageErrorMsg('');
    } else {
      setIsImageError(true);
      setImageErrorMsg('Image is required');
    }
  };

  const validateForm = (e: any) => {
    e.preventDefault();
    let flag = true;
    if (!occupation.name) {
      setNameError(true);
      setNameErrorMsg('Occupation is required');
      flag = false;
    } else {
      if (reg.test(occupation.name)) {
        setNameError(false);
        setNameErrorMsg('');
      } else {
        setNameError(true);
        setNameErrorMsg('Alphabet and space allowed');
        flag = false;
      }
    }
    if (image) {
      setIsImageError(false);
      setImageErrorMsg('');
    } else {
      setIsImageError(true);
      setImageErrorMsg('Image is required');
      flag = false;
    }
    return flag;
  };

  const handleCloseOccupationDailog = () => {
    setIsOpen(false);
  };

  const handleClickisAdd = async () => {
    setOccupation(initialState);
    setNameError(false);
    setNameErrorMsg('');
    setIsOpen(true);
    setOccupationError(false);
    setOccupationErrorMsg('');
    setImage('');
    setIsImageError(false);
    setImageErrorMsg('');
  };

  const handleClickisEdit = (element: any) => {
    let obj = {
      id: element.id,
      name: element.name,
      img: element.imageUrl
    };
    if (element.imageUrl) {
      setImage( element.imageUrl);
    } else {
      setImage('');
    }
    setOccupation(obj);
    setNameError(false);
    setNameErrorMsg('');
    setOccupationError(false);
    setOccupationErrorMsg('');
    setIsOpen(true);
    setIsImageError(false);
    setImageErrorMsg('');
  };

  const handleClose = () => {
    setIsCheck(false);
  };

  const handleSwitch = async (id: number, status: number) => {
    let obj = {
      id: id,
      status: status
    };
    setOccupation(obj);
    setIsCheck(true);
  };

  const handleSwitchCheck = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: occupation.id
    };
    const res = await APIservice.httpPost(
      '/api/admin/occupation/activeInactiveOccupation',
      obj,
      token,
      refreshToken
    );
    setIsCheck(false);
    getData(page * limit, limit);
  };

  const OccupationDialog = (arr: any) => {
    const { name, value } = arr.target;
    setOccupation({ ...occupation, [name]: value });
    setIsOpen(true);
    setOccupationError(false);
    setOccupationErrorMsg('');
  };

  const getData = async (startIndex: number, fetchRecord: number) => {
    try {
      if (search) {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
          startIndex: startIndex,
          fetchRecord: fetchRecord,
          name: search ? search : ''
        };
        const res = await APIservice.httpPost(
          '/api/admin/occupation/getOccupation',
          obj,
          token,
          refreshToken
        );
        // if(res.recordList && res.recordList.length > 0){
        //   for(let i = 0 ; i< res.recordList.length; i++){
        //     res.recordList[i].imageUrl = 
        //   }
        // }
        setOccupations(res.recordList);
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
          '/api/admin/occupation/getOccupation',
          obj,
          token,
          refreshToken
        );
        setOccupations(res.recordList);
        setRow(res.totalRecords);
        if (res && res.status == 200) {
          setIsOpen(false);
        } else if (res.status == 401) {
          localStorage.clear();
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
        setIsLoading(false);
      }
    } catch (error) {
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
      setIsLoading(false);
    }
  };

  const saveOccupation = async (e: any) => {
    let flag = validateForm(e);
    if (flag) {
      try {
        if (occupation.id) {
          if (image.includes("http://")) {
            const parts = image.split('/');
            const finalIamgeURL = parts.slice(parts.indexOf('content')).join('/');
            image = finalIamgeURL;
            setImage(finalIamgeURL);
          }
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          let val = {
            id: occupation.id,
            name: occupation.name,
            imageUrl: image
          };
          const res = await APIservice.httpPost(
            '/api/admin/occupation/insertUpdateOccupation',
            val,
            token,
            refreshToken
          );
          if (res && res.status == 200) {
            getData(page * limit, limit);
            setIsOpen(false);
          } else if (res.status == 401) {
            localStorage.clear();
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
          } else if (res.status == 203) {
            setOccupationError(true);
            setOccupationErrorMsg('Occupation already exists!');
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
          }
        } else {
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          occupation.imageUrl = image;
          const res = await APIservice.httpPost(
            '/api/admin/occupation/insertUpdateOccupation',
            occupation,
            token,
            refreshToken
          );
          if (res && res.status == 200) {
            setPage(0);
            setIsOpen(false);
            getData(0, limit);
          } else if (res.status == 401) {
            localStorage.clear();
            navigate('/admin');
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
            setOccupationError(true);
            setOccupationErrorMsg('Occupation already exists!');
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
          }
        }
      } catch (error: any) {
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
    }
  };

  const onFileChange = async (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result.toString());
    };
    reader.readAsDataURL(file);
    let ext = file.type.split('/')[1];
    await resizeFile(file, ext);
  };

  const resizeFile = async (file: any, ext: string) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        200,
        200,
        ext,
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64'
      );
    });

  const onImageChange = (e: any) => {
    const { name, value } = e.target;
    setOccupation({
      ...occupation,
      [name]: value
    });
  };

  const searchData = (e: any) => {
    setSearch(e.target.value);
    search = e.target.value;
    getData(page, limit);
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

  return (
    <>
      <Helmet>
        <title>Occupation</title>
      </Helmet>
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
                    Occupation
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
                      <AddTwoToneIcon fontSize="small" /> Create Occupation
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
              <Card className="communitycard">
                <div>
                  {isLoading ? (
                    <Loader1 title="Loading..." />
                  ) : (
                    <>
                      <Divider />
                      {occupations && occupations.length > 0 ? (
                        <>
                          <TableContainer className="communitytableContainer">
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
                                      Occupation
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
                                {occupations.map((arr: any, index: number) => {
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
                                              alt="occupation"
                                            ></Avatar>
                                          ) : (
                                            <Avatar>
                                              {arr.name ? arr.name[0] : null}
                                            </Avatar>
                                          )}
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
                                        </Stack>
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        sx={{
                                          padding: '20px'
                                        }}
                                      >
                                        {isEditPermission ? <>
                                          <Tooltip
                                            title={
                                              arr.isActive === 0
                                                ? 'Inactive'
                                                : 'Active'
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
                                          <Tooltip title="Edit " arrow>
                                            <IconButton
                                              disabled={credentail?.email === "demo@admin.com"}
                                              sx={{
                                                '&:hover': {
                                                  background:
                                                    theme.colors.error.lighter
                                                },
                                                color: theme.palette.primary.main
                                              }}
                                              color="inherit"
                                              size="small"
                                              onClick={(e) =>
                                                handleClickisEdit(arr)
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
                          className="communitycard"
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
                  open={ischeck}
                  onClose={handleClose}
                  fullWidth
                  maxWidth="xs"
                >
                  <DialogTitle
                    sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
                  >
                    {occupation.status === 0 ? 'Inactive' : 'Active'}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
                    >
                      {occupation.status === 0
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
              <>
                <BootstrapDialog
                  open={isOpen}
                  onClose={handleCloseOccupationDailog}
                  PaperProps={{ sx: { height: '40%' } }}
                  fullWidth
                  maxWidth="xs"
                >
                  <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleCloseOccupationDailog}
                  >
                    {occupation.id ? 'Edit Occupation' : 'Add Occupation'}
                  </BootstrapDialogTitle>
                  <DialogContent dividers>
                    <Form>
                      <FormGroup style={{ alignItems: 'center' }}>
                        <input
                          style={{
                            display: 'none'
                          }}
                          id="icon-button-file"
                          type="file"
                          accept="image/*"
                          name="imageUrl"
                          // value={occupation.imageUrl}
                          onChange={(e) => {
                            onFileChange(e);
                            onImageChange(e);
                            ValidateImage(e);
                          }}
                        ></input>
                        <label htmlFor="icon-button-file">
                          {image ? (
                            <img
                              src={image}
                              style={{
                                height: '100px',
                                width: '100px'
                                // borderRadius: '50%',
                              }}
                            />
                          ) : (
                            <img
                              src="/userLogo.png"
                              style={{
                                height: '100px',
                                width: '100px'
                                // borderRadius: '50%',
                              }}
                            />
                          )}
                        </label>
                      </FormGroup>
                      <FormHelperText style={{ color: 'red', height: '22px' }}>
                        {isImageError && ImageErrorMsg}
                      </FormHelperText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Occupation"
                        type="text"
                        fullWidth
                        variant="outlined"
                        name="name"
                        value={occupation.name}
                        onChange={(arr) => {
                          OccupationDialog(arr);
                          validateName(arr);
                        }}
                        required={true}
                      />
                      <FormHelperText style={{ color: 'red', height: '22px' }}>
                        {isNameError && NameErrorMsg}
                      </FormHelperText>
                    </Form>
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
                      {isOccupationError && OccupationErrorMsg}
                    </FormHelperText>
                    <Typography>
                      <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleCloseOccupationDailog} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                      <Button disabled={credentail?.email === "demo@admin.com"} onClick={saveOccupation} variant="outlined" style={{ marginRight: '10px' }}>Save</Button>
                    </Typography>

                  </Box>
                </BootstrapDialog>
              </>
            </>
          </Grid>
        </Grid>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

export default Occupation;
