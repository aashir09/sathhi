import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from '../../components/PageTitleWrapper';
import {
  Grid,
  Container,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  InputAdornment,
  TextField,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent } from 'react';
import Label from 'src/components/Label';
import APIservice from 'src/utils/APIservice';
import Loader1 from '../Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../smallScreen.css';

function ApplicationsUserBlock() {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [row, setRow] = useState<number>(10);
  let [status, setStatus] = useState<any>();
  const [blockUsers, setBlockUsers] = React.useState<any>([]);
  let [searchInput, setSearchInput] = React.useState<any>('');
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
            getData(page, limit);
        }
      } else {
        getData(page, limit);
      }
    }
  }, []);

  const handleChange = async (e: any) => {
    status = e.target.value;
    setStatus(e.target.value);
    await getData(page, limit);
  };

  const getData = async (startIndex: number, fetchRecord: number) => {
    try {
      if (searchInput) {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
          startIndex: startIndex,
          fetchRecord: fetchRecord,
          status: status ? status : 'all',
          userName: searchInput ? searchInput : '',
          blockReqUserName: searchInput ? searchInput : ''
        };
        const res = await APIservice.httpPost(
          '/api/admin/userBlockRequest/getUserBlockRequest',
          obj,
          token,
          refreshToken
        );
        setBlockUsers(res.recordList);
        setRow(res.totalRecords);
      } else {
        setIsLoading(true);
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
          startIndex: startIndex,
          fetchRecord: fetchRecord,
          status: status ? status : 'all'
        };
        const res = await APIservice.httpPost(
          '/api/admin/userBlockRequest/getUserBlockRequest',
          obj,
          token,
          refreshToken
        );
        setBlockUsers(res.recordList);
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

  const handleClickAccept = async (id: number) => {
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        id: id,
        status: 1
      };
      const res = await APIservice.httpPost(
        '/api/admin/userBlockRequest/updateUserBlockRequest',
        obj,
        token,
        refreshToken
      );
      getData(0, limit);

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

  const handleClickReject = async (id: number) => {
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        id: id,
        status: 0
      };
      const res = await APIservice.httpPost(
        '/api/admin/userBlockRequest/updateUserBlockRequest',
        obj,
        token,
        refreshToken
      );
      getData(0, limit);

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

  const searchData = (e) => {
    setSearchInput(e.target.value);
    searchInput = e.target.value;
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
        <title>Block Users</title>
      </Helmet>
      <PageTitleWrapper>
        <div>
          <Box pt={1.2} pb={1.1} pl={1}>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={1.5}
            >
              <Grid item>
                <Stack alignItems="left" justifyContent="space-between">
                  <Breadcrumbs aria-label="breadcrumb">
                    <Link
                      to="/admin"
                      style={{ display: 'flex', color: 'black' }}
                    >
                      <HomeIcon />
                    </Link>
                    <Typography
                      variant="subtitle2"
                      color="inherit"
                      style={{ fontWeight: 'bold' }}
                    >
                      Block Users
                    </Typography>
                  </Breadcrumbs>
                </Stack>
              </Grid>
              <Grid item>
                <Grid container spacing={1.5}>
                  <Grid item>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      sx={{
                        mt: { xs: 0, md: 0 },
                        width: 'none',
                        minWidth: '150px'
                      }}
                    >
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={status || 'All'}
                        defaultValue
                        onChange={handleChange}
                        label="Status"
                        autoWidth
                        size="small"
                      >
                        <MenuItem key="Approved" value="Approved">
                          Approved
                        </MenuItem>
                        <MenuItem key="Rejected" value="Rejected">
                          Rejected
                        </MenuItem>
                        <MenuItem key="Pending" value="Pending">
                          Pending
                        </MenuItem>
                        <MenuItem key="All" value="All">
                          All
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl sx={{ mt: { xs: 0, md: 0 } }}>
                      <TextField
                        id="outlined-basic"
                        label="Search"
                        variant="outlined"
                        name="searchInput"
                        value={searchInput}
                        size="small"
                        onChange={(e) => searchData(e)}
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
        </div>
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
              <Card className="blockUsercard">
                <div>
                  {isLoading ? (
                    <Loader1 title="Loading..." />
                  ) : (
                    <>
                      <Divider />
                      {blockUsers && blockUsers.length > 0 ? (
                        <>
                          <TableContainer className="blockUsertableContainer">
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
                                  <TableCell align="center">
                                    <Typography
                                      noWrap
                                      style={{
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        marginBottom: 'none'
                                      }}
                                    >
                                      Request From User
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
                                      Request For User
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
                                      Reason
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
                                      Status
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {blockUsers.map((arr: any, index: number) => {
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
                                          {arr.userName}
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
                                          {arr.blockReqUserName}
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
                                          {arr.reason}
                                        </Typography>
                                      </TableCell>
                                      {arr.status === null ? (
                                        <TableCell align="right">
                                          <Box>
                                            {isEditPermission ? <>
                                              <Button
                                                size="small"
                                                variant="outlined"
                                                disabled={credentail?.email === "demo@admin.com"}
                                                onClick={(e) =>
                                                  handleClickAccept(arr.id)
                                                }
                                                sx={{
                                                  mt: { xs: 1, md: 0 },
                                                  width: '93.38px'
                                                }}
                                              >
                                                Approve
                                              </Button>
                                              <Button
                                                size="small"
                                                variant="outlined"
                                                disabled={credentail?.email === "demo@admin.com"}
                                                onClick={(e) =>
                                                  handleClickReject(arr.id)
                                                }
                                                sx={{
                                                  mt: { xs: 1, md: 0 },
                                                  width: '93.38px',
                                                  ml: 1
                                                }}
                                              >
                                                Reject
                                              </Button>
                                            </> : <></>}
                                          </Box>
                                        </TableCell>
                                      ) : (
                                        <TableCell align="right">
                                          {arr.status === 0 ? (
                                            <Label color="error">
                                              Rejected
                                            </Label>
                                          ) : (
                                            <Label color="success">
                                              Approved
                                            </Label>
                                          )}
                                        </TableCell>
                                      )}
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Box p={2}>
                            <TablePagination
                              component="div"
                              count={row} //totalrecords
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
                          className="blockUsercard"
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
            </>
          </Grid>
        </Grid>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

export default ApplicationsUserBlock;
