import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from '../../components/PageTitleWrapper';
import {
  Grid,
  Container,
  Box,
  Breadcrumbs,
  Stack,
  Typography,
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
  useTheme,
  FormControl,
  InputAdornment,
  Paper
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import Loader1 from 'src/content/Loader';
import { useState, useEffect, ChangeEvent } from 'react';
import APIservice from 'src/utils/APIservice';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../smallScreen.css';

const initialState = {
  id: 0,
  name: ''
};

function Employment() {
  const [isLoading, setisLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState<number>(10);
  const [row, setRow] = useState<number>(10);
  const [Employments, setEmployments] = useState<any>([]);
  const [employment, setEmployment] = useState<any>(initialState);
  const [ischeck, setIsCheck] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEmploymentsError, setEmploymentsError] = useState(false);
  const [EmploymentsErrorMsg, setEmploymentsErrorMsg] = useState('');
  let [search, setSearch] = useState('');
  let [credentail, setCredentail] = useState<any>();

  const navigate = useNavigate();

  const [isNameError, setNameError] = useState(false);
  const [NameErrorMsg, setNameErrorMsg] = useState('');

  const [isReadPermission, setIsReadPermission] = useState(true);
  const [isWritePermission, setIsWritePermission] = useState(true);
  const [isEditPermission, setIsEditPermission] = useState(true);
  const [isDeletePermission, setIsDeletePermission] = useState(true);

  useEffect(() => {
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
      setNameErrorMsg('Employment is required');
    }
  };

  const validateForm = (e: any) => {
    e.preventDefault();
    var flag = true;
    if (!employment.name) {
      setNameError(true);
      setNameErrorMsg('Employment is required');
      flag = false;
    } else {
      if (reg.test(employment.name)) {
        setNameError(false);
        setNameErrorMsg('');
        flag = true;
      } else {
        setNameError(true);
        setNameErrorMsg('Alphabet and space allowed');
        flag = false;
      }
    }
    return flag;
  };

  const getData = async (startIndex: number, fetchRecord: number) => {
    if (search) {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        startIndex: startIndex,
        fetchRecord: fetchRecord,
        name: search ? search : ''
      };
      const res = await APIservice.httpPost(
        '/api/admin/employmentType/getEmploymentType',
        obj,
        token,
        refreshToken
      );
      setEmployments(res.recordList);
      setRow(res.totalRecords);
    } else {
      setisLoading(true);
      try {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
          startIndex: startIndex,
          fetchRecord: fetchRecord
        };
        const res = await APIservice.httpPost(
          '/api/admin/employmentType/getEmploymentType',
          obj,
          token,
          refreshToken
        );
        setEmployments(res.recordList);
        setRow(res.totalRecords);
        if (res && res.status === 200) {
        } else if (res && res.status === 401) {
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
        setisLoading(false);
      }
      setisLoading(false);
    }
  };

  const handleSwitch = (id: number, status: number) => {
    let obj = {
      id: id,
      status: status
    };
    setEmployment(obj);
    setIsCheck(true);
  };

  const handleClose = () => {
    setIsCheck(false);
    setIsOpen(false);
  };

  const handleSwitchCheck = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: employment.id
    };
    const res = await APIservice.httpPost(
      '/api/admin/employmentType/activeInactiveEmploymentType',
      obj,
      token,
      refreshToken
    );
    setIsCheck(false);
    getData(page * limit, limit);
  };

  const handleChange = (arr: any) => {
    const { name, value } = arr.target;
    setEmployment({ ...employment, [name]: value });
    setIsOpen(true);
    setEmploymentsError(false);
    setEmploymentsErrorMsg('');
  };

  const handleClickisAdd = async () => {
    setEmployment(initialState);
    setIsOpen(true);
    setNameError(false);
    setNameErrorMsg('');
    setEmploymentsError(false);
    setEmploymentsErrorMsg('');
  };

  const handleClickisEdit = (no: number, st: string) => {
    let obj = {
      id: no,
      name: st
    };
    setEmployment(obj);
    setIsOpen(true);
    setNameError(false);
    setNameErrorMsg('');
    setEmploymentsError(false);
    setEmploymentsErrorMsg('');
  };

  const saveEmployment = async (arr: any) => {
    let flag = validateForm(arr);
    try {
      if (flag) {
        if (employment.id) {
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          let val = {
            id: employment.id,
            name: employment.name
          };
          const res = await APIservice.httpPost(
            '/api/admin/employmentType/insertUpdateEmploymentType',
            val,
            token,
            refreshToken
          );
          if (res && res.status === 200) {
            setIsOpen(false);
            getData(page * limit, limit);
          } else if (res && res.status === 401) {
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
          } else if (res && res.status === 203) {
            setEmploymentsError(true);
            setEmploymentsErrorMsg('Employment already exists!');
          }
        } else {
          const token = localStorage.getItem('SessionToken');
          const refreshToken = localStorage.getItem('RefreshToken');
          const res = await APIservice.httpPost(
            '/api/admin/employmentType/insertUpdateEmploymentType',
            employment,
            token,
            refreshToken
          );
          if (res && res.status == 200) {
            getData(0, limit);
            setPage(0);
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
            setEmploymentsError(true);
            setEmploymentsErrorMsg('Employment already exists!');
          }
        }
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
        <title>Employment</title>
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
                    Employment
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
                      <AddTwoToneIcon fontSize="small" /> Create Employment
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
                      id="outlined-basic"
                      label="Search"
                      name="searchString"
                      value={search}
                      onChange={(e) => searchData(e)}
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
                      {Employments && Employments.length > 0 ? (
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
                                      Sr. NO
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
                                      Employment
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
                                {Employments.map((arr: any, index: any) => (
                                  <TableRow key={arr.id} hover>
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
                                        <Tooltip title="Edit" arrow>
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
                                              handleClickisEdit(arr.id, arr.name)
                                            }
                                          >
                                            <EditTwoToneIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </> : <></>}

                                    </TableCell>
                                  </TableRow>
                                ))}
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
                            {employment.status === 0 ? 'Inactive' : 'Active'}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText
                              style={{
                                fontSize: '1rem',
                                letterSpacing: '0.00938em'
                              }}
                            >
                              {employment.status === 0
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
                        <Dialog
                          open={isOpen}
                          onClose={handleClose}
                          PaperProps={{ sx: { height: '40%' } }}
                          fullWidth
                          maxWidth="xs"
                        >
                          <DialogTitle
                            sx={{
                              m: 0,
                              p: 2,
                              fontSize: '18px',
                              fontWeight: 'bold'
                            }}
                          >
                            {employment.id
                              ? 'Edit Employment '
                              : 'Add Employment'}
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
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="Employment"
                              type="text"
                              fullWidth
                              variant="outlined"
                              name="name"
                              value={employment.name}
                              onChange={(arr) => {
                                handleChange(arr);
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
                              padding: '8px'
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
                              {isEmploymentsError && EmploymentsErrorMsg}
                            </FormHelperText>
                            <Typography>
                              <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleClose} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
                              <Button disabled={credentail?.email === "demo@admin.com"} onClick={saveEmployment} variant="outlined" style={{marginRight: '10px'}}>Save</Button>
                            </Typography>

                          </Box>
                        </Dialog>
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

export default Employment;
