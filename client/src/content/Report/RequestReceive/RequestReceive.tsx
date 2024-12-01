import {
  Box,
  Breadcrumbs,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
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
  useTheme
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from '../../../components/PageTitleWrapper';
import HomeIcon from '@mui/icons-material/Home';
import PrintIcon from '@mui/icons-material/Print';
// import FileOpenIcon from '@mui/icons-material/FileOpen';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent } from 'react';
import APIservice from 'src/utils/APIservice';
import Loader from '../../Loader';
import { CSVLink } from 'react-csv';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../smallScreen.css';

const RequestReceive = () => {
  const [data, setData] = React.useState<any>([]);
  const [data1, setData1] = React.useState<any>([]);
  const [isloading, setIsLoading] = React.useState(false);
  const [row, setRow] = useState<number>(10);
  const [page, setPage] = React.useState<number>(0);
  const [limit, setLimit] = React.useState<number>(10);
  const [printUser, setPrintUser] = useState<any>([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    getdata(page, limit);
  }, []);

  const getdata = async (startIndex: number, fetchRecord: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        startIndex: startIndex,
        fetchRecord: fetchRecord
      };
      const res = await APIservice.httpPost(
        '/api/admin/report/getTopProposalReceiveReqReport',
        obj,
        token,
        refreshToken
      );
      setData(res.recordList);
      setRow(res.totalRecords);
      if (res && res.status == 200) {
      } else if (res.status == 401) {
        navigate('/admin');
        localStorage.clear();
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

  const DataSend = () => {
    const user = data.map((arr: any, index: number) => {
      const dataDetail = {
        Id: index + 1,
        Name: arr.firstName + ' ' + arr.lastName,
        'Request Receive': arr.receiveRequest,
        Gender: arr.gender
      };
      return dataDetail;
    });
    setData1(user);
  };

  const handlePrint = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    const res = await APIservice.httpPost(
      '/api/admin/report/getTopProposalReceiveReqReport',
      {},
      token,
      refreshToken
    );
    setPrintUser(res.recordList);
    if (res && res.status == 200) {
    } else if (res.status == 401) {
      navigate('/admin');
      localStorage.clear();
    }
    let html = `<html>
        <div class="img-container">
        <img src="/Image20221010173301.png" alt="logo" height="30px"/>
        <span>Top Request Receive</span>
    </div>

      <body  onload="window.print(); window.close();">
      <style>
      .img-container {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-Bottom: 20px;
      }

      span{
        font-size: 30px;
        padding-Left: 5px;
      }
      .date-container {
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      table {
         border-collapse: collapse;
        border: 1px solid black;
        width: 100%;
      }

      .th1 {
        border-top: 0px;
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        text-align: center;
        padding: 8px;
      }


      .th2 {
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        text-align: center;
        padding: 8px;
      }

      .th3 {
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        text-align: center;
        padding: 8px;
      }

      .th4 {
        border-bottom: 1px solid black;
        text-align: center;
        padding: 8px;
      }

      .td1 {
        border-right: 1px solid black;
        text-align: center;
        padding: 8px;
      }

      .td2 {
        border-right: 1px solid black;
        text-align: left;
        padding: 8px;
      }
      .td3 {
        border-right: 1px solid black;
        text-align: center;
        padding: 8px;
      }

      .td4 {
          text-align: center;
          padding: 8px;
        }

        tr:nth-child(even) {background-color: #f2f2f2;}
        </style>
        <table>
        <Divider/>
    <thead>
      <th class="th1">#</th>
      <th class="th2">Name</th>
      <th class="th3">Request Receive</th>
      <th class="th4">Gender</th>
    </thead>
    <tbody>`;
    for (let i = 0; i < res.recordList.length; i++) {
      html +=
        `<tr>
          <td class="td1">` +
        (i + 1) +
        `</td>
          <td class="td2">` +
        res.recordList[i].firstName +
        ' ' +
        res.recordList[i].lastName +
        `</td>
          <td class="td3">` +
        res.recordList[i].receiveRequest +
        ` </td>
         <td class="td4">` +
        res.recordList[i].gender +
        ` </td>
         </tr>`;
    }
    html += `</tbody>
      </table>
     </body>
    </html >`;

    let frame1 = document.createElement('iframe');
    frame1.name = 'frame1';
    frame1.style.position = 'absolute';
    frame1.style.top = '-1000000px';
    document.body.appendChild(frame1);
    frame1.contentWindow.document.open();
    frame1.contentWindow.document.write(html);
    frame1.contentWindow.document.close();
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
    // eslint-disable-next-line
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
        <title>Top Requests Received</title>
      </Helmet>
      <PageTitleWrapper>
        <Box pt={1.3} pb={1.2} pl={1}>
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
                    color="inherit"
                    variant="subtitle2"
                    fontWeight="bold"
                  >
                    Top Requests Received
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Grid>
            <Grid item>
              <Tooltip title="Print" arrow>
                <IconButton
                  sx={{
                    '&:hover': { background: theme.colors.primary.lighter },
                    color: theme.palette.primary.main,
                    marginTop: '3px'
                  }}
                  color="inherit"
                  size="small"
                  onClick={handlePrint}
                >
                  <PrintIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export File" arrow>
                <IconButton
                  sx={{
                    '&:hover': { background: theme.colors.primary.lighter },
                    color: theme.palette.primary.main
                  }}
                  color="inherit"
                  size="small"
                  onClick={DataSend}
                >
                  <CSVLink
                    data={data1}
                    filename={'RequestReceiveReport.csv'}
                    style={{
                      '&:hover': { background: theme.colors.primary.lighter },
                      color: theme.palette.primary.main
                    }}
                  >
                    <UploadFileRoundedIcon />
                  </CSVLink>
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
          spacing={3}
        >
          <Grid item xs={12}>
            <Card className="userProposalcard">
              <div>
                {isloading ? (
                  <Loader title="Loading..." />
                ) : (
                  <>
                    <Divider />
                    {data && data.length > 0 ? (
                      <>
                        <TableContainer className="userProposalTableContainer">
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
                                    Id
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
                                    Request Receive
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
                                    Gender
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {data.map((arr: any, index) => {
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
                                      >
                                        {arr.firstName} {arr.lastName}
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
                                        {arr.receiveRequest}
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
                                        {arr.gender}
                                      </Typography>
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
                        className="userProposalTableContainer"
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
      {/* <Footer /> */}
    </div>
  );
};

export default RequestReceive;
