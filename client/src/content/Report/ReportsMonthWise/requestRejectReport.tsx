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
  SelectChangeEvent,
  IconButton,
  Grid,
  Box,
  Container,
  Tooltip,
  useTheme,
  Breadcrumbs,
  Stack,
  CardHeader,
  Paper
} from '@mui/material';

import * as React from 'react';
import APIservice from 'src/utils/APIservice';
import { useNavigate } from 'react-router';
import Loader from '../../Loader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import HomeIcon from '@mui/icons-material/Home';
import PrintIcon from '@mui/icons-material/Print';
// import FileOpenIcon from '@mui/icons-material/FileOpen';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { CSVLink } from 'react-csv';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import { Link } from 'react-router-dom';
import './../../smallScreen.css';

const initialState = {
  data: ''
};

const ReportReject = () => {
  const [report, setReport] = React.useState<any>([]);
  let [selectedYear, setSelectedYear] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [year, setYear] = React.useState<any>([]);
  const navigate = useNavigate();

  const notify = () => {
    toast.error('Name Already Exists!', {
      autoClose: 6000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    });
  };

  React.useEffect(() => {
    getCurrentYear();
    getYear();
  }, []);

  const getCurrentYear = () => {
    let currentYear = new Date().getFullYear();
    getData(currentYear);
    let date = currentYear.toString();
    selectedYear.data = date;
  };

  const getYear = () => {
    setYear((year.length = 0));
    for (let i = 9; i >= 0; i--) {
      let obj = {
        data: new Date().getFullYear() - i
      };
      year.push(obj);
    }
    setYear(year);
  };

  const getData = async (currentYear: any) => {
    setIsLoading(true);
    if (currentYear) {
      const token = localStorage.getItem('SessionToken');
      const refreshToken = localStorage.getItem('RefreshToken');
      let obj = {
        year: currentYear
      };
      const res = await APIservice.httpPost(
        '/api/admin/report/getRejectProposalReqReport',
        obj,
        token,
        refreshToken
      );
      setReport(res.recordList);

      if (res && res.status == 200) {
      } else if (res.status == 401) {
        localStorage.clear();
        navigate('/admin');
      } else if (res.status == 400) {
        {
          notify();
        }
      }
      setIsLoading(false);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setSelectedYear({
      ...selectedYear,
      [name]: value
    });
    getData(value);
    selectedYear.data = value;
  };

  const handlePrint = async (currentYear: any) => {
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      year: currentYear
    };
    const res = await APIservice.httpPost(
      '/api/admin/report/getRejectProposalReqReport',
      obj,
      token,
      refreshToken
    );
    if (res && res.status == 200) {
    } else if (res.status == 401) {
      localStorage.clear();
      navigate('/admin');
    }
    let html = `<html>
    <div class="img-container">
    <img src="/Image20221010173301.png" alt="logo" height="30px"/>
    <span>Request Reject</span>
</div>
<div class="date-container">
<div>`;
    html +=
      `<p> Year - ` +
      currentYear +
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
      text-align: center;
      padding: 8px;
    }

  tr:nth-child(even) {background-color: #f2f2f2;}
  </style>
  <table>
  <thead>
  <th class="th1">#</th>
    <th class="th2">Month</th>
    <th class="th3">Count</th>
  </thead>
  <tbody>`;
    for (let i = 0; i < res.recordList.length; i++) {
      html +=
        `<tr>
        <td class="td1">` +
        (i + 1) +
        `</td>
        <td class="td2">` +
        res.recordList[i].month +
        `</td>
        <td class="td3">` +
        res.recordList[i].count +
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

  const theme = useTheme();

  return (
    <>
      <ToastContainer
        style={{ top: '9%', left: '80%' }}
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
        <title>Proposal Request Reject</title>
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
                    color="inherit"
                    variant="subtitle2"
                    fontWeight="bold"
                  >
                    Proposal Request Reject
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
                  onClick={(e) => {
                    handlePrint(selectedYear.data);
                  }}
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
                >
                  <CSVLink
                    data={report}
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
              <FormControl
                sx={{ minWidth: 150, mt: { xs: 0, md: 0 } }}
                size="small"
              >
                <InputLabel htmlFor="demo-customized-select-label">
                  Year
                </InputLabel>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  name="data"
                  value={selectedYear.data}
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
            <div>
              <Card className="requestReportcard">
                <div>
                  {isLoading ? (
                    <Loader title="Loading..." />
                  ) : (
                    <>
                      <Divider />
                      {report && report.length > 0 ? (
                        <TableContainer className="requestReportTableContainer" style={{ overflowX: 'hidden' }}>
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">Month</TableCell>
                                <TableCell align="right">Count</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {report.map((arr: any, index: number) => {
                                return (
                                  // eslint-disable-next-line react/jsx-key
                                  <TableRow hover key={index}>
                                    <TableCell align="center">
                                      <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        color="text.primary"
                                        gutterBottom
                                        noWrap
                                      >
                                        {arr.month}
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
                                        {arr.count}
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
                            boxShadow: 'none'
                          }}
                          className="requestReportTableContainer"
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
            </div>
          </Grid>
        </Grid>
      </Container>
      {/* <Footer /> */}
    </>
  );
};

export default ReportReject;
function ddlvalue(label: any) {
  throw new Error('Function not implemented.');
}
