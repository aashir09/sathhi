import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
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
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent } from 'react';
import APIservice from 'src/utils/APIservice';
import Loader from '../../Loader';
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './../../smallScreen.css';

const initialState = {
  fromDate: null,
  toDate: null
};

const SystemBlockedUsers = () => {
  const [data, setData] = React.useState<any>([]);
  const [data1, setData1] = React.useState<any>([]);
  const [isloading, setIsLoading] = React.useState(false);
  const [row, setRow] = useState<number>(10);
  const [page, setPage] = React.useState<number>(0);
  const [limit, setLimit] = React.useState<number>(10);
  const [printUser, setPrintUser] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [select, setSelect] = useState<boolean>(false);
  const [chip, setChip] = useState<boolean>(false);
  const [userValue, setUserValue] = React.useState<any>(initialState);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const dateData = localStorage.getItem('DateFormat');
  const navigate = useNavigate();

  React.useEffect(() => {
    getData(page, limit);
  }, []);

  const getData = async (startIndex: number, fetchRecord: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let from = userValue.fromDate ? userValue.fromDate : '';
      let to = userValue.toDate ? userValue.toDate : '';
      let obj = {
        startIndex: startIndex,
        fetchRecord: fetchRecord,
        fromDate: from,
        toDate: to
      };
      const res = await APIservice.httpPost(
        '/api/admin/report/getSystemBlockedUsers',
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

  const handleSelect = (ranges: any) => {
    const { selection } = ranges;
    setState([selection]);
    userValue.fromDate = ranges.selection.startDate;
    userValue.toDate = ranges.selection.endDate;
  };

  const handleOpenRangePicker = () => {
    setIsOpen(true);
  };

  const handleCloseDailog = () => {
    setIsOpen(false);
  };

  const save = () => {
    setIsOpen(false);
    if (userValue.fromDate && userValue.toDate) {
      setChip(true);
    }
    getData(0, limit);
  };

  const handleDelete = () => {
    if (userValue.fromDate && userValue.toDate) {
      userValue.fromDate = null;
      userValue.toDate = null;
      setChip(false);
    }
    // handleSearch();
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ]);
    getData(0, limit);
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
    getData(0, limit);
  };

  const DataSend = () => {
    const user = data.map((arr: any, index: number) => {
      const dataDetail = {
        Id: index + 1,
        Name: arr.firstName + ' ' + arr.lastName,
        Email: arr.email,
        ContactNo: arr.contactNo,
        Gender: arr.gender,
        'Modified Date': format(new Date(arr.modifiedDate), dateData)
      };
      return dataDetail;
    });
    setData1(user);
  };

  const handlePrint = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    const res = await APIservice.httpPost(
      '/api/admin/report/getSystemBlockedUsers',
      userValue,
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
        <span>System Blocked User</span>
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
        border-right: 1px solid black;
        text-align: center;
        padding: 8px;
      }
      .th5 {
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        text-align: center;
        padding: 8px;
      }

      .th6 {
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
        text-align: left;
        padding: 8px;
      }

      .td4 {
        border-right: 1px solid black;
        text-align: center;
        padding: 8px;
      }
      .td5 {
        border-right: 1px solid black;
        text-align: center;
        padding: 8px;
      }

      .td6 {
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
      <th class="th3">Email</th>
      <th class="th4">ContactNo</th>
      <th class="th5">Gender</th>
      <th class="th6">Modified Date</th>
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
        res.recordList[i].email +
        ` </td>
         <td class="td4">` +
        res.recordList[i].contactNo +
        ` </td>
         <td class="td5">` +
        res.recordList[i].gender +
        ` </td>
         <td class="td6">` +
        format(new Date(res.recordList[i].modifiedDate), dateData) +
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
    getData(newPage * limit, limit);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
    getData(0, parseInt(event.target.value));
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
        <title>System Blocked User</title>
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
                    System Blocked User
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
                    filename={'SystemBlockedUser.csv'}
                    style={{
                      '&:hover': { background: theme.colors.primary.lighter },
                      color: theme.palette.primary.main
                    }}
                  >
                    <UploadFileRoundedIcon />
                  </CSVLink>
                </IconButton>
              </Tooltip>
              <Tooltip title="Select Date" arrow>
                <IconButton
                  sx={{
                    '&:hover': { background: theme.colors.primary.lighter },
                    color: theme.palette.primary.main,
                    marginTop: '3px'
                  }}
                  color="inherit"
                  size="small"
                  onClick={handleOpenRangePicker}
                >
                  <DateRangeIcon />
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
                        <TableContainer className="userProposalTableContainer" >
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
                                    Email
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
                                    ContactNo
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
                                <TableCell>
                                  <Typography
                                    noWrap
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: 'bold',
                                      marginBottom: 'none'
                                    }}
                                  >
                                    Modified Date
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
                                        {arr.email}
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
                                        {arr.gender}
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
                                        {format(
                                          new Date(arr.modifiedDate),
                                          dateData
                                        )}
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
                        className="userProposalcard"
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
                top: 10,
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
    </div>
  );
};

export default SystemBlockedUsers;
