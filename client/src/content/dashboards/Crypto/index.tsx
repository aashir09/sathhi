import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from './../../../components/PageTitleWrapper';
import HomeIcon from '@mui/icons-material/Home';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import {
  alpha,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import Footer from 'src/components/Footer';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Label from 'src/components/Label';
import LoaderSmallCard from '../loaderDashboard';
import LoaderCard from '../loaderCardDashboard';
import LoaderGraph from '../loaderGraphDashboard';
import APIservice from 'src/utils/APIservice';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { format } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './dashboard.css';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(2, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.07)
    };

    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

const initialState = {
  fromDate: null,
  toDate: null
};

function Dashboard() {
  const theme = useTheme();

  const [user, setUser] = React.useState<any>([]);
  const [blockUser, setBlockUser] = useState<any>([]);
  const [userData, setUserData] = useState<any>([]);
  const [send, setSend] = useState<any>([]);
  const [accept, setAccept] = useState<any>([]);
  const [reject, setReject] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [monthlyProposal, setMonthlyProposal] = React.useState<number>(0);
  const [todayProposal, setTodayProposal] = React.useState<number>(0);
  const [todayRegistration, setTodayRegistration] = React.useState<number>(0);
  const [monthlyRegistration, setMonthlyRegistration] =
    React.useState<number>(0);
  const [userValue, setUserValue] = React.useState<any>(initialState);
  const [chip, setChip] = useState<boolean>(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [month, setMonth] = useState<any>([]);

  const navigate = useNavigate();

  // window.onpopstate = () => {
  //   navigate(1);
  // }

  useEffect(() => {
    getdata();
  }, []);

  const dateData = localStorage.getItem('DateFormat');

  const getdata = async () => {
    debugger
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let from = userValue.fromDate ? userValue.fromDate : '';
      let to = userValue.toDate ? userValue.toDate : '';
      let obj = {
        fromDate: from,
        toDate: to
      };
      const res = await APIservice.httpPost(
        '/api/admin/dashboard/getDashboardData',
        obj,
        token,
        refreshToken
      );
      setUser(res.recordList ? res.recordList[0].recentUserResult : []);
      setMonthlyProposal(res.recordList ? res.recordList[0].monthlyProposal : 0);
      setMonthlyRegistration(res.recordList ? res.recordList[0].monthlyRegistration : 0);
      setTodayProposal(res.recordList ? res.recordList[0].todayProposal : 0);
      setTodayRegistration(res.recordList ? res.recordList[0].todayRegistration : 0);
      setUserData(res.recordList ?
        res.recordList[0].monthlyRegUserCount.map((item: any) => item.count) : []
      );
      setMonth( res.recordList ? 
        res.recordList[0].monthlyRegUserCount.map((item: any) => item.month) : []
      );
      if (res && res.status == 200) {
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
      getPendingBlockUser();
      getProposal();
    } catch (error) {
      console.log(error);
    }
  };

  const getProposal = async () => {
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let from = userValue.fromDate ? userValue.fromDate : '';
      let to = userValue.toDate ? userValue.toDate : '';
      let obj = {
        fromDate: from,
        toDate: to
      };
      const res = await APIservice.httpPost(
        '/api/admin/report/getReceiveProposalReqReport',
        obj,
        token,
        refreshToken
      );
      setAccept(res.recordList.map((item: any) => item.count));
      const res1 = await APIservice.httpPost(
        '/api/admin/report/getSendProposalReqReport',
        obj,
        token,
        refreshToken
      );
      setSend(res1.recordList.map((item: any) => item.count));
      const res2 = await APIservice.httpPost(
        '/api/admin/report/getRejectProposalReqReport',
        obj,
        token,
        refreshToken
      );
      setReject(res2.recordList.map((item: any) => item.count));
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
    setIsLoading(false);
  };

  const series = [
    {
      name: 'Newly Registered User',
      data: userData
    }
  ];

  const options: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    colors: [theme.colors.primary.main],
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      colors: [theme.colors.primary.main],
      width: 3
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: month
    }
  };

  const series1 = [
    {
      name: 'Proposal Accept',
      data: accept
    },
    {
      name: 'Proposal Reject',
      data: reject
    },
    {
      name: 'Proposal Send',
      data: send
    }
  ];

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    labels: ['Proposal Accept', 'Proposal Reject', 'Proposal Send'],
    xaxis: {
      categories: month
    }
  };

  const getPendingBlockUser = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let from = userValue.fromDate ? userValue.fromDate : '';
      let to = userValue.toDate ? userValue.toDate : '';
      let obj = {
        fromDate: from,
        toDate: to,
        status: 'pending'
      };
      const res = await APIservice.httpPost(
        '/api/admin/userBlockRequest/getUserBlockRequest',
        obj,
        token,
        refreshToken
      );
      setBlockUser(res.recordList);
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
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleOpenRangePicker = () => {
    setIsOpen(true);
  };

  const handleCloseDailog = () => {
    setIsOpen(false);
  };

  const handleSelect = (ranges: any) => {
    const { selection } = ranges;
    setState([selection]);
    userValue.fromDate = ranges.selection.startDate;
    userValue.toDate = ranges.selection.endDate;
  };

  const save = () => {
    setIsOpen(false);
    if (userValue.fromDate && userValue.toDate) {
      setChip(true);
    }
    getdata();
  };

  const handleDelete = () => {
    if (userValue.fromDate && userValue.toDate) {
      userValue.fromDate = null;
      userValue.toDate = null;
      setChip(false);
    }
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ]);
    getdata();
  };

  const handleClear = () => {
    userValue.fromDate = null;
    userValue.toDate = null;
    setChip(false);
    setIsOpen(false);
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ]);
    getdata();
  };

  return (
    <>
      <ToastContainer
        style={{ top: '15%', left: '82%' }}
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
        <title> Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <Box pt={1.4} pb={1.45} pl={1.9}>
          <Grid container justifyContent="space-between" alignItems="center">
            {/* <Grid item> */}
            {/* {userData.image ?
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(8),
            height: theme.spacing(8)
          }}
          variant="rounded"
          alt="profileImage"
          src={process.env.REACT_APP_IMAGE_URL + userData.image}
        />: <Avatar
        sx={{
          mr: 2,
          width: theme.spacing(8),
          height: theme.spacing(8)
        }}
        variant="rounded"
        alt="profileImage">{userData.firstName ? userData.firstName[0] : null}</Avatar>} */}
            {/* </Grid> */}
            {/* <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Welcome! {userData.firstName}  {userData.lastName}
        </Typography> */}
            <Grid item>
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
                    Dashboard
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Grid>
            <div>
              {chip === true ? (
                <>
                  <Chip
                    label={
                      format(new Date(userValue.fromDate), dateData) +
                      '-' +
                      format(new Date(userValue.toDate), dateData)
                    }
                    onDelete={(e) => {
                      handleDelete();
                    }}
                  />
                </>
              ) : (
                ''
              )}
            </div>
            <Grid item>
              <Tooltip title="Select Date" arrow>
                <IconButton
                  sx={{
                    '&:hover': {
                      background: theme.colors.primary.lighter
                    },
                    color: theme.palette.primary.main
                  }}
                  color="inherit"
                  size="small"
                  onClick={handleOpenRangePicker}
                >
                  <FilterAltIcon />
                </IconButton>
              </Tooltip>
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
          spacing={10}
        >
          <Grid item lg={12} xs={12}>
            <>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={3} item>
                  <Card
                    sx={{
                      px: 1,
                      height: '201.17px'
                    }}
                  >
                    {isLoading ? (
                      <LoaderSmallCard title="Loading..." />
                    ) : (
                      <>
                        <Link
                          to="/admin/appuser"
                          style={{ textDecoration: 'none', color: '#223354' }}
                        >
                          <CardContent>
                            <AvatarWrapper>
                              <img
                                alt="Today Register"
                                src="https://img.icons8.com/external-flat-geotatah/2x/external-register-training-management-system-flat-flat-geotatah.png"
                              />
                            </AvatarWrapper>
                            <Typography variant="h5" noWrap>
                              Today Register
                            </Typography>
                            <Box
                              sx={{
                                pt: 3
                              }}
                            >
                              <Typography variant="h3" gutterBottom noWrap>
                                {todayRegistration}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Link>
                      </>
                    )}
                  </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                  <Card
                    sx={{
                      px: 1,
                      height: '201.17px'
                    }}
                  >
                    {isLoading ? (
                      <LoaderSmallCard title="Loading..." />
                    ) : (
                      <>
                        <Link
                          to="/admin/appuser"
                          style={{ textDecoration: 'none', color: '#223354' }}
                        >
                          <CardContent>
                            <AvatarWrapper>
                              <img
                                alt="Month Register"
                                src="https://cdn-icons-png.flaticon.com/512/9875/9875512.png"
                              />
                            </AvatarWrapper>
                            <Typography variant="h5" noWrap>
                              Monthly Register
                            </Typography>
                            <Box
                              sx={{
                                pt: 3
                              }}
                            >
                              <Typography variant="h3" gutterBottom noWrap>
                                {monthlyRegistration}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Link>
                      </>
                    )}
                  </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                  <Card
                    sx={{
                      px: 1,
                      height: '201.17px'
                    }}
                  >
                    {isLoading ? (
                      <LoaderSmallCard title="Loading..." />
                    ) : (
                      <>
                        <Link
                          to="/admin/requestSendReport"
                          style={{ textDecoration: 'none', color: '#223354' }}
                        >
                          <CardContent>
                            <AvatarWrapper>
                              <img
                                alt="Today Proposal"
                                src="https://img.icons8.com/external-wanicon-flat-wanicon/2x/external-diamond-ring-gift-box-wanicon-flat-wanicon.png"
                              />
                            </AvatarWrapper>
                            <Typography variant="h5" noWrap>
                              Today Proposal
                            </Typography>
                            <Box
                              sx={{
                                pt: 3
                              }}
                            >
                              <Typography variant="h3" gutterBottom noWrap>
                                {todayProposal}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Link>
                      </>
                    )}
                  </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                  <Card
                    sx={{
                      px: 1,
                      height: '201.17px'
                    }}
                  >
                    {isLoading ? (
                      <LoaderSmallCard title="Loading..." />
                    ) : (
                      <>
                        <Link
                          to="/admin/requestSendReport"
                          style={{ textDecoration: 'none', color: '#223354' }}
                        >
                          <CardContent>
                            <AvatarWrapper>
                              <img
                                alt="Today Proposal"
                                src="https://img.icons8.com/external-others-maxicons/2x/external-proposal-about-love-others-maxicons.png"
                              />
                            </AvatarWrapper>
                            <Typography variant="h5" noWrap>
                              Monthly Proposal
                            </Typography>
                            <Box
                              sx={{
                                pt: 3
                              }}
                            >
                              <Typography variant="h3" gutterBottom noWrap>
                                {monthlyProposal}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Link>
                      </>
                    )}
                  </Card>
                </Grid>
              </Grid>
              <div style={{ marginTop: '27px' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={6}>
                    <Card style={{ height: '439.66px' }}>
                      {isLoading ? (
                        <LoaderGraph title="Loading..." />
                      ) : (
                        <>
                          <CardHeader
                            title={
                              <Link
                                to="/admin/appuser"
                                style={{
                                  textDecoration: 'none',
                                  color: '#223354'
                                }}
                              >
                                Newly Registered User{' '}
                              </Link>
                            }
                            action={
                              <Button
                                variant="contained"
                                size="small"
                                sx={{ margin: '0px 4px' }}
                              >
                                <Link
                                  to="/admin/appuser"
                                  style={{
                                    textDecoration: 'none',
                                    color: 'white'
                                  }}
                                >
                                  {' '}
                                  View All{' '}
                                </Link>
                              </Button>
                            }
                          />
                          <Chart options={options} type="bar" series={series} />
                        </>
                      )}
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Card style={{ height: '439.66px' }}>
                      {isLoading ? (
                        <LoaderGraph title="Loading..." />
                      ) : (
                        <>
                          <CardHeader
                            title={
                              <Link
                                to="/admin/requestSendReport"
                                style={{
                                  textDecoration: 'none',
                                  color: '#223354'
                                }}
                              >
                                Monthly Proposal
                              </Link>
                            }
                            action={
                              <Button
                                variant="contained"
                                size="small"
                                sx={{ margin: '0px 4px' }}
                              >
                                <Link
                                  to="/admin/requestSendReport"
                                  style={{
                                    textDecoration: 'none',
                                    color: 'white'
                                  }}
                                >
                                  {' '}
                                  View All{' '}
                                </Link>
                              </Button>
                            }
                          />
                          <Chart
                            options={chartOptions}
                            type="line"
                            series={series1}
                          />
                        </>
                      )}
                    </Card>
                  </Grid>
                </Grid>
              </div>
              <div style={{ marginTop: '27px' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={6}>
                    <Card style={{ height: '514px' }}>
                      {isLoading ? (
                        <LoaderCard title="Loading..." />
                      ) : (
                        <>
                          <CardHeader
                            title={
                              <Link
                                to="/admin/blockuser"
                                style={{
                                  textDecoration: 'none',
                                  color: '#223354'
                                }}
                              >
                                {' '}
                                Block User{' '}
                              </Link>
                            }
                            action={
                              <Button
                                variant="contained"
                                size="small"
                                sx={{ margin: '0px 4px' }}
                              >
                                <Link
                                  to="/admin/blockuser"
                                  style={{
                                    textDecoration: 'none',
                                    color: 'white'
                                  }}
                                >
                                  {' '}
                                  View All{' '}
                                </Link>
                              </Button>
                            }
                          />
                          <Divider />
                          {blockUser && blockUser.length > 0 ? (
                            <TableContainer
                              style={{ height: '459px' }}
                              // className="dashboard-table"
                            >
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
                                    {/* <TableCell align="center" >Created Date</TableCell> */}
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
                                  {blockUser.map((arr: any, index: number) => {
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
                                            {index + 1}
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
                                        {/* <TableCell align="center" >
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {format(new Date(arr.createdDate), dateData)}
                                          </Typography>
                                        </TableCell> */}
                                        {arr.status === null && (
                                          <TableCell align="right">
                                            <Label color="warning">
                                              Pending
                                            </Label>
                                          </TableCell>
                                        )}
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Paper
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                boxShadow: 'none',
                                height: '459px'
                              }}
                            >
                              <Typography variant="h5" paragraph>
                                Data not Found
                              </Typography>
                            </Paper>
                          )}
                        </>
                      )}
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Card style={{ height: '514px' }}>
                      {isLoading ? (
                        <LoaderCard title="Loading..." />
                      ) : (
                        <>
                          <CardHeader
                            title={
                              <Link
                                to="/admin/appuser"
                                style={{
                                  textDecoration: 'none',
                                  color: '#223354'
                                }}
                              >
                                {' '}
                                New Application User{' '}
                              </Link>
                            }
                            action={
                              <Button
                                variant="contained"
                                size="small"
                                sx={{ margin: '0px 4px' }}
                              >
                                <Link
                                  to="/admin/blockuser"
                                  style={{
                                    textDecoration: 'none',
                                    color: 'white'
                                  }}
                                >
                                  {' '}
                                  View All{' '}
                                </Link>
                              </Button>
                            }
                          />
                          <Divider />
                          {user && user.length > 0 ? (
                            <TableContainer
                              style={{ height: '459px' }}
                              // className="dashboard-table"
                            >
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
                                        Name
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
                                        Contact No
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
                                        Email
                                      </Typography>
                                    </TableCell>
                                    {/* <TableCell>Created Date</TableCell> */}
                                    <TableCell>
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
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {user.map((arr: any, index: number) => {
                                    return (
                                      <TableRow hover key={index}>
                                        <TableCell>
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {index + 1}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                        <TableCell>
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {arr.contactNo}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
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
                                        {/* <TableCell align="center" >
                                            <Typography
                                              variant="body1"
                                              fontWeight="bold"
                                              color="text.primary"
                                              gutterBottom
                                              noWrap
                                            >
                                              {format(new Date(arr.createdDate), dateData)}
                                            </Typography>
                                          </TableCell> */}
                                        <TableCell>
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
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Paper
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                boxShadow: 'none',
                                height: '459px'
                              }}
                            >
                              <Typography variant="h5" paragraph>
                                Data not Found
                              </Typography>
                            </Paper>
                          )}
                        </>
                      )}
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <div>
        <Dialog open={isOpen} onClose={handleCloseDailog}>
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '18px', fontWeight: 'bold' }}
          >
            Select Date
            <IconButton
              aria-label="close"
              onClick={handleCloseDailog}
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
            <DateRangePicker
              className="rangepicker"
              // ranges={[selectionRange]}
              ranges={state}
              onChange={handleSelect}
            />
          </DialogContent>
          <DialogActions sx={{ pl: '24px', pr: '24px' }}>
            <Button onClick={save}>Save</Button>
            <Button onClick={handleClear}>Clear</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default Dashboard;
