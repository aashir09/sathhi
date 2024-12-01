import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Switch,
  Tooltip,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Divider,
  TableContainer,
  TablePagination,
  Paper
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Link, useNavigate } from 'react-router-dom';
import Label from 'src/components/Label';
import Loader1 from '../Loader';
import APIservice from 'src/utils/APIservice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../smallScreen.css';

const SuccessStory = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [row, setRow] = useState<number>(10);
  const [user, setUser] = useState<any>([]);
  const [ischeck, setIsCheck] = useState(false);
  const [successStory, setSuccessStory] = useState<any>('');
  let [maritalStatus, setMaritalStatus] = useState<any>();
  let [credentail, setCredentail] = useState<any>();

  const [isReadPermission, setIsReadPermission] = useState(true);
  const [isWritePermission, setIsWritePermission] = useState(true);
  const [isEditPermission, setIsEditPermission] = useState(true);
  const [isDeletePermission, setIsDeletePermission] = useState(true);

  let [apiUrl, setApiUrl] = useState<any>();

  const navigate = useNavigate();

  useEffect(() => {
    let cred = JSON.parse(localStorage.getItem('Credentials'));
    setCredentail(cred);
    //getData(page, limit);
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
          loadjson();
        }
      } else {
        getData(page, limit);
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

  const handleChange = async (e: any) => {
    maritalStatus = e.target.value;
    setMaritalStatus(e.target.value);
    await getData(0, limit);
  };

  const getData = async (startIndex: number, fetchRecord: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        startIndex: startIndex,
        fetchRecord: fetchRecord,
        maritalStatus: maritalStatus ? maritalStatus : null
      };
      const res = await APIservice.httpPost(
        '/api/admin/successStories/getSuccessStories',
        obj,
        token,
        refreshToken
      );
      setUser(res.recordList);
      setRow(res.totalRecords);
      if (res && res.status === 200) {
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
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleCloseSwitch = () => {
    setIsCheck(false);
  };

  const handleSwitch = async (id: number, status: any) => {
    let obj = {
      id: id,
      status: status
    };
    setSuccessStory(obj);
    setIsCheck(true);
  };

  const handleCheckSwitch = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: successStory.id
    };
    const res = await APIservice.httpPost(
      '/api/admin/successStories/activeInactiveSuccessStories',
      obj,
      token,
      refreshToken
    );
    setIsCheck(false);
    getData(0, limit);
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
        <title>Success Story</title>
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
                    Success Story
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Grid>
            <Grid item>
              <FormControl variant="outlined" sx={{ minWidth: '150px' }}>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  name="status"
                  value={maritalStatus}
                  defaultValue
                  onChange={handleChange}
                  label="Marital Status"
                  autoWidth
                  size="small"
                >
                  <MenuItem key="all" value="All">
                    All
                  </MenuItem>
                  <MenuItem key="Engaged" value="Engaged">
                    Engaged
                  </MenuItem>
                  <MenuItem key="Married" value="Married">
                    Married
                  </MenuItem>
                </Select>
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
            <Card className="Successcard">
              <div>
                {isLoading ? (
                  <Loader1 title="Loading..." />
                ) : (
                  <>
                    <Divider />
                    {user && user.length > 0 ? (
                      <>
                        <TableContainer className="SuccessContainer">
                          <Grid container spacing={3} sx={{ p: 3 }}>
                            {user.map((arr: any, index: number) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={index}
                              >
                                <Card sx={{ height: '250px' }}>
                                  <CardHeader
                                    action={
                                      <div
                                        style={{
                                          textTransform: 'uppercase',
                                          fontWeight: 'bold'
                                        }}
                                      >
                                        {arr.maritalStatus === 'engaged' ? (
                                          <Label color="primary">
                                            {arr.maritalStatus}
                                          </Label>
                                        ) : (
                                          <Label color="success">
                                            {arr.maritalStatus}
                                          </Label>
                                        )}
                                      </div>
                                    }
                                  />
                                  <CardContent
                                    sx={{ paddingBottom: 'none', height: 155 }}
                                  >
                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                      sx={{ textAlign: 'center' }}
                                    >
                                      <Box>
                                        {arr.userImage ? (
                                          <img
                                            src={

                                              arr.userImage
                                            }
                                            alt="users"
                                            width="100px"
                                            height="100px"
                                            style={{ borderRadius: '50px' , objectFit: 'cover'}}
                                          />
                                        ) : (
                                          <img
                                            src="/userLogo.png"
                                            alt="users"
                                            width="100px"
                                            height="100px"
                                            style={{ borderRadius: '50px', objectFit: 'cover' }}
                                          />
                                        )}
                                        <Typography>
                                          {arr.userFName} {arr.userLName}
                                        </Typography>
                                        <Typography>{arr.userCity}</Typography>
                                      </Box>
                                      <Box>
                                        {arr.partnerImage ? (
                                          <img
                                            src={

                                              arr.partnerImage
                                            }
                                            alt="users"
                                            width="100px"
                                            height="100px"
                                            style={{ borderRadius: '50px', objectFit: 'cover' }}
                                          />
                                        ) : (
                                          <img
                                            src="/userLogo.png"
                                            alt="users"
                                            width="100px"
                                            height="100px"
                                            style={{ borderRadius: '50px', objectFit: 'cover' }}
                                          />
                                        )}
                                        <Typography>
                                          {arr.partnerFName} {arr.partnerLName}
                                        </Typography>
                                        <Typography>
                                          {arr.partnerCity}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  </CardContent>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'flex-end'
                                    }}
                                  >
                                    {isEditPermission ?

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
                                      : <></>}
                                  </div>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
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
                          // height: 'calc(100vh - 241px)'
                        }}
                        className="Successcard"
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
          </Grid>
        </Grid>
      </Container>
      <div>
        <Dialog
          open={ischeck}
          onClose={handleCloseSwitch}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
          >
            {successStory.status === 0 ? 'Inactive' : 'Active'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
            >
              {successStory.status === 0
                ? 'Are you sure you want to Active?'
                : 'Are you sure you want to Inactive?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSwitch} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleCheckSwitch} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default SuccessStory;
