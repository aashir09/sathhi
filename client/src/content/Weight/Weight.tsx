import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
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
  Paper
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent } from 'react';
import APIservice from 'src/utils/APIservice';
import Loader1 from '../Loader';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../smallScreen.css';
import de from 'date-fns/esm/locale/de/index.js';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },
  '& .MuiPaper-root': {
    height: '260px'
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
  name: ''
};

function Weight() {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [row, setRow] = useState<number>(10);
  const [weights, setWeights] = React.useState<any>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [weight, setWeight] = React.useState<any>(initialState);
  const [isNameError, setNameError] = useState(false);
  const [NameErrorMsg, setNameErrorMsg] = useState('');
  const [ischeck, setIsCheck] = useState(false);
  const [isWeightError, setWeightError] = useState(false);
  const [WeightErrorMsg, setWeightErrorMsg] = useState('');
  let [search, setSearch] = useState('');
  const navigate = useNavigate();
  let [credentail, setCredentail] = useState<any>();

  const [isReadPermission, setIsReadPermission] = useState(true);
  const [isWritePermission, setIsWritePermission] = useState(true);
  const [isEditPermission, setIsEditPermission] = useState(true);
  const [isDeletePermission, setIsDeletePermission] = useState(true);

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
    getData(page, limit);
    setIsOpen(false);
  }

  // const reg = new RegExp('^(\\d{1,3}(\\.\\d{0,3})?|\\.\\d{1,3})$');
  const reg = new RegExp('^[0-9]{1,3}$');

  const validateName = (arr: any) => {
    const { name, value } = arr.target;
    if (value) {
      if (reg.test(arr.target.value)) {
        setNameError(false);
        setNameErrorMsg('');
      } else {
        setNameError(true);
        setNameErrorMsg('Weight is not valid ');
      }
    } else {
      setNameError(true);
      setNameErrorMsg('Weight is required');
    }
  };

  const validateForm = (e: any) => {
    e.preventDefault();
    var flag = true;
    if (!weight.name) {
      setNameError(true);
      setNameErrorMsg('Weight is required');
      flag = false;
    } else {
      if (reg.test(weight.name)) {
        setNameError(false);
        setNameErrorMsg('');
        flag = true;
      } else {
        setNameError(true);
        setNameErrorMsg('Only 3 digit numbers allowed');
        flag = false;
      }
    }
    return flag;
  };

  const handleCloseWeightDailog = () => {
    setIsOpen(false);
  };

  const handleClickisAdd = async () => {
    setWeight(initialState);
    setNameError(false);
    setNameErrorMsg('');
    setIsOpen(true);
    setWeightError(false);
    setWeightErrorMsg('');
  };

  const handleClickisEdit = (no: number, st: string) => {
    let obj = {
      id: no,
      name: st
    };
    setWeight(obj);
    setNameError(false);
    setNameErrorMsg('');
    setWeightError(false);
    setWeightErrorMsg('');
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsCheck(false);
  };

  const handleSwitch = async (id: number, status: number) => {
    let obj = {
      id: id,
      status: status
    };
    setWeight(obj);
    setIsCheck(true);
  };

  const handleSwitchCheck = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: weight.id
    };
    const res = await APIservice.httpPost(
      '/api/admin/weight/activeInactiveWeight',
      obj,
      token,
      refreshToken
    );
    setIsCheck(false);
    getData(page * limit, limit);
  };

  const WeightDialog = (arr: any) => {
    const { name, value } = arr.target;
    setWeight({ ...weight, [name]: value });
    setIsOpen(true);
    setWeightError(false);
    setWeightErrorMsg('');
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
          '/api/admin/weight/getWeight',
          obj,
          token,
          refreshToken
        );
        setWeights(res.recordList);
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
          '/api/admin/weight/getWeight',
          obj,
          token,
          refreshToken
        );
        setWeights(res.recordList);
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

  const saveWeight = async (e: any) => {
    debugger
    var flag = validateForm(e);
    if (flag) {
      try {
        if (weight.id) {
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          let val = { id: weight.id, name: weight.name };
          const res = await APIservice.httpPost(
            '/api/admin/weight/insertUpdateWeight',
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
            setWeightError(true);
            setWeightErrorMsg('Weight already exists!');
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
          const res = await APIservice.httpPost(
            '/api/admin/weight/insertUpdateWeight',
            weight,
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
            setWeightError(true);
            setWeightErrorMsg('Weight already exists!');
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
    }
  };

  const searchData = (e) => {
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
        <title>Weight</title>
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
                    color="inherit"
                    variant="subtitle2"
                    fontWeight="bold"
                  >
                    Weight
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
                      <AddTwoToneIcon fontSize="small" />
                      Create Weight
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
              <Card className="heightcard">
                <div>
                  {isLoading ? (
                    <Loader1 title="Loading..." />
                  ) : (
                    <>
                      <Divider />
                      {weights && weights.length > 0 ? (
                        <>
                          <TableContainer className="heighttableContainer">
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
                                      Sr. NO
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
                                      Weight in kg
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
                                {weights.map((arr: any, index: number) => {
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
                                        <Typography
                                          variant="body1"
                                          fontWeight="bold"
                                          color="text.primary"
                                          gutterBottom
                                          noWrap
                                        >
                                          {arr.name} kg
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
                                                handleClickisEdit(
                                                  arr.id,
                                                  arr.name
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
                          className="heightcard"
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
                    {weight.status === 0 ? 'Inactive' : 'Active'}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
                    >
                      {weight.status === 0
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
                  onClose={handleCloseWeightDailog}
                  PaperProps={{ sx: { height: '40%' } }}
                  fullWidth
                  maxWidth="xs"
                >
                  <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleCloseWeightDailog}
                  >
                    {weight.id ? 'Edit Weight' : 'Add Weight'}
                  </BootstrapDialogTitle>
                  <DialogContent dividers>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Weight in kg"
                      type="text"
                      fullWidth
                      variant="outlined"
                      name="name"
                      value={weight.name}
                      onChange={(arr) => {
                        WeightDialog(arr);
                        validateName(arr);
                      }}
                      required={true}
                    />
                    <FormHelperText style={{ color: 'red', height: '22px' }}>
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
                      {isWeightError && WeightErrorMsg}
                    </FormHelperText>
                    <Typography>
                      <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleCloseWeightDailog} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
                      <Button disabled={credentail?.email === "demo@admin.com"} onClick={saveWeight} variant="outlined" style={{marginRight: '10px'}}>Save</Button>
                    </Typography>

                  </Box>
                </BootstrapDialog>
              </div>
            </>
          </Grid>
        </Grid>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

export default Weight;
