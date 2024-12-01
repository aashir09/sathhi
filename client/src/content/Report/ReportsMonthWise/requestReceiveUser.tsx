import { useState } from 'react';
import {
  Divider,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  IconButton,
  Grid,
  Box,
  Container,
  Tooltip,
  Drawer,
  List,
  useTheme,
  Button,
  styled,
  TablePagination,
  Breadcrumbs,
  Stack,
  FormGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardHeader,
  Chip,
  Paper
} from '@mui/material';
import APIservice from '../../../utils/APIservice';
import PageTitleWrapper from '../../../components/PageTitleWrapper';
import * as React from 'react';
import { useNavigate } from 'react-router';
import Loader from '../../Loader';
import HomeIcon from '@mui/icons-material/Home';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
// import FileOpenIcon from '@mui/icons-material/FileOpen';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CancelIcon from '@mui/icons-material/Cancel';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import { Link } from 'react-router-dom';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './../../smallScreen.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.colors.alpha.trueWhite[70]};
        position: relative;
        z-index: 7;
        height: 100%;
        padding-bottom: 68px;
`
);

const initial = {
  year: '',
  month: ''
};

const initialState = {
  fromDate: null,
  toDate: null
};

const ReportReceiveUser = () => {
  const [report, setReport] = React.useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [send, setSend] = useState(initial);
  const [sidebarToggle, setSidebarToggle] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>([]);
  const [detail, setDetail] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [row, setRow] = useState<number>(10);
  const [year, setYear] = React.useState<any>([]);
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
  // const [printUser, setPrintUser] = useState<any>([])
  const navigate = useNavigate();

  React.useEffect(() => {
    getData(page, limit);
    getYear();
  }, []);

  const getData = async (startIndex: number, fetchRecord: number) => {
    setIsLoading(true);
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let from = userValue.fromDate ? userValue.fromDate : '';
    let to = userValue.toDate ? userValue.toDate : '';
    let obj = {
      startIndex: startIndex,
      fetchRecord: fetchRecord,
      // "year": send.year,
      // "month": send.month
      fromDate: from,
      toDate: to
    };
    const res = await APIservice.httpPost(
      '/api/admin/report/getMonthlyReceiveProposalUser',
      obj,
      token,
      refreshToken
    );
    setReport(res.recordList);
    setData(res.recordList);
    setRow(res.totalRecords);

    if (res && res.status == 200) {
    } else if (res.status == 401) {
      localStorage.clear();
      navigate('/admin');
    }
    setIsLoading(false);
  };

  const getYear = () => {
    setYear((year.length = 0));
    for (let i = 9; i >= 0; i--) {
      // let previousYear = new Date().getFullYear() - i
      let obj = {
        data: new Date().getFullYear() - i
      };
      year.push(obj);
    }
    setYear(year);
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setSend({
      ...send,
      [name]: value
    });
  };

  const theme = useTheme();

  const toggleSlider = () => {
    setOpen(!open);
  };

  const handleSubmit = () => {
    setOpen(false);
    getData(0, limit);
    setPage(0);
  };

  const handleClear = () => {
    setSend(initial);
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
        userName: arr.userName,
        proposalName: arr.proposalName,
        createdDate: format(new Date(arr.createdDate), dateData)
      };
      return dataDetail;
    });
    setDetail(user);
  };

  const handleSelect = (ranges: any) => {
    const { selection } = ranges;
    setState([selection]);
    userValue.fromDate = ranges.selection.startDate;
    userValue.toDate = ranges.selection.endDate;
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

  const handlePrint = async () => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    const res = await APIservice.httpPost(
      '/api/admin/report/getMonthlyReceiveProposalUser',
      userValue,
      token,
      refreshToken
    );
    if (res && res.status == 200) {
    } else if (res.status == 401) {
      navigate('/admin');
      localStorage.clear();
    }
    let html = `<html>
    <div class="img-container">
    <img src="/Image20221010173301.png" alt="logo" height="30px"/>
    <span>Request Receive User</span>
</div>
<div class="date-container">
<div>`;
    html += userValue.fromDate
      ? `<p>` +
        format(new Date(userValue.fromDate), dateData) +
        `</p>
  </div>
  <div>
  <p>    -    </p>
  </div>
  <div>`
      : '';
    html +=
      `<p>` +
      (userValue.toDate ? format(new Date(userValue.toDate), dateData) : '') +
      `</p>
  </div>
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
    text-align: left;
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
      <th class="th2">Proposal Sender</th>
      <th class="th3">Proposal Receiver</th>
      <th class="th4">Date</th>
    </thead>
    <tbody>`;
    for (let i = 0; i < res.recordList.length; i++) {
      html +=
        `<tr>
          <td class="td1">` +
        (i + 1) +
        `</td>
          <td class="td2">` +
        res.recordList[i].userName +
        ` </td>
         <td class="td3">` +
        res.recordList[i].proposalName +
        ` </td>
         <td class="td4">` +
        format(new Date(res.recordList[i].createdDate), dateData) +
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

  const handleLimitChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
    getData(0, parseInt(event.target.value));
  };

  const sideList = () => (
    <>
      <div style={{ height: 'calc(100vh - 122px)', overflow: 'auto' }}>
        <Stack spacing={3} sx={{ m: 2, backgroundColor: 'white' }}>
          <FormGroup>
            <FormControl fullWidth className="mb-3">
              <InputLabel htmlFor="demo-customized-select-label">
                Year
              </InputLabel>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                name="year"
                value={send.year}
                label="Year"
                onChange={handleChange}
              >
                {year.map((arr: any) => (
                  <MenuItem key={arr.data} value={arr.data}>
                    {arr.data}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth className="mb-3">
              <InputLabel htmlFor="demo-customized-select-label">
                Month
              </InputLabel>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                name="month"
                value={send.month}
                label="Month"
                onChange={handleChange}
              >
                <MenuItem value="January">January</MenuItem>
                <MenuItem value="February">February</MenuItem>
                <MenuItem value="March">March</MenuItem>
                <MenuItem value="April">April</MenuItem>
                <MenuItem value="May">May</MenuItem>
                <MenuItem value="June">June</MenuItem>
                <MenuItem value="July">July</MenuItem>
                <MenuItem value="August">August</MenuItem>
                <MenuItem value="September">September</MenuItem>
                <MenuItem value="October">October</MenuItem>
                <MenuItem value="November">November</MenuItem>
                <MenuItem value="December">December</MenuItem>
              </Select>
            </FormControl>
          </FormGroup>
        </Stack>
      </div>
      <Box sx={{ p: 2, position: 'absolute', bottom: '50px', width: '100%' }}>
        <Button fullWidth variant="contained" onClick={handleSubmit}>
          Search
        </Button>
      </Box>
      <Box sx={{ p: 2, position: 'absolute', bottom: '0px', width: '100%' }}>
        <Button fullWidth variant="contained" onClick={handleClear}>
          Clear
        </Button>
      </Box>
    </>
  );

  return (
    <>
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
        <title>Proposal Receive User</title>
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
              {/* <Typography variant="h3" component="h3" gutterBottom>
                    Proposal Receive User
                  </Typography> */}
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
                    Proposal Receive User
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
                    data={detail}
                    filename={'ReportSend.csv'}
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
              {/* <Tooltip title="Filter" arrow>
                <IconButton
                  sx={{
                    '&:hover': { background: theme.colors.primary.lighter },
                    color: theme.palette.primary.main
                  }}
                  color="inherit"
                  size="small"
                  onClick={toggleSlider}
                >
                  {!sidebarToggle ? (
                    <FilterAltIcon fontSize="medium" />
                  ) : (
                    <CloseTwoToneIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip> */}
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
                {isLoading ? (
                  <Loader title="Loading..." />
                ) : (
                  <>
                    <Drawer
                      open={open}
                      anchor="right"
                      onClose={toggleSlider}
                      PaperProps={{
                        sx: { width: 280, border: 'none', overflow: 'auto' }
                      }}
                    >
                      {sideList()}
                    </Drawer>
                    <Divider />
                    {report && report.length > 0 ? (
                      <>
                        <Divider />
                        <TableContainer className="userProposalTableContainer">
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">
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
                                {/* <TableCell align='center' >Month</TableCell> */}
                                <TableCell align="center">
                                  <Typography
                                    noWrap
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: 'bold',
                                      marginBottom: 'none'
                                    }}
                                  >
                                    Proposal Sender
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
                                    proposal Receiver
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
                                    Date
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <>
                                {report.map((arr: any, index: number) => {
                                  return (
                                    <TableRow hover key={index}>
                                      <TableCell align="center">
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
                                      {/* <TableCell align='center' >
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                          >
                                            {arr.month}
                                          </Typography>
                                        </TableCell> */}
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
                                          {arr.proposalName}
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
                                          {format(
                                            new Date(arr.createdDate),
                                            dateData
                                          )}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </>
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
              // sx={{ fontSize: "2px", color: "grey", position: 'absolute', right: 3, top: 12 }}
              // onClick={handleCloseDailog}
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
    </>
  );
};

export default ReportReceiveUser;
