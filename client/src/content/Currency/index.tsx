import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from './../../components/PageTitleWrapper';
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
  IconButton,
  Stack,
  Switch,
  TableContainer,
  Tooltip,
  Typography,
  useTheme,
  styled,
  Paper,
  Accordion,
  AccordionSummary,
  Checkbox,
  Chip,
  CardContent,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent, useEffect } from 'react';
import APIservice from 'src/utils/APIservice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../content/smallScreen.css';
import 'react-quill/dist/quill.snow.css';
import { Currency as CurrencyModel } from 'src/models/currency';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CardHeader, Col, Row, Table } from 'react-bootstrap';
// import { Label } from '@mui/icons-material';
import Label from 'src/components/Label';

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ]
  }
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },
  '& .MuiPaper-root': {
    height: '600px'
  }
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
  code: '',
  symbol: '',
  value: 0,
  isDefault: null
};

const Currency = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [row, setRow] = useState<number>(10);
  const [v1, setV1] = React.useState<any>(initialState);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [ischeck, setIsCheck] = useState(false);
  let [search, setSearch] = useState('');
  const [currencies, setCurrencies] = React.useState<CurrencyModel[]>([]);
  let [credentail, setCredentail] = useState<any>();
  let [defCurrency, setDefCurrency] = useState<any>();

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
    // let cred = JSON.parse(localStorage.getItem('Credentials'));
    // setCredentail(cred);
    // getdata(page, limit);
  }, []);


  const loadData = async () => {
    await getdata(page, limit);
    setIsOpen(false);
  }

  const getdata = async (startIndex: number, fetchRecord: number) => {
    try {
      if (search) {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
          startIndex: startIndex,
          fetchRecord: fetchRecord,
          isActive: null,
          searchString: search ? search : ''
        };
        const res = await APIservice.httpPost(
          '/api/admin/currencies/getCurrencies',
          obj,
          token,
          refreshToken
        );
        setCurrencies(res.recordList);
        setRow(res.totalRecords);
      } else {
        setIsLoading(true);
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
          startIndex: startIndex,
          fetchRecord: fetchRecord,
          isActive: null
        };
        const res = await APIservice.httpPost(
          '/api/admin/currencies/getCurrencies',
          obj,
          token,
          refreshToken
        );
        setCurrencies(res.recordList);
        setRow(res.totalRecords);
        if (res && res.status == 200) {
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
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
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


  const handleSwitch = async (id: number, status: number, defCurr ? :any) => {
    debugger
    let obj = {
      id: id,
      status: status
    };
    setV1(obj);
    setDefCurrency(defCurr);
    setIsCheck(true);
  };

  const handleSwitchCheck = async () => {
    debugger
    const token = localStorage.getItem('SessionToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    let obj = {
      id: v1.id,
      isDefault: !v1.status
    };
    const res = await APIservice.httpPost(
      '/api/admin/currencies/setDefaultCurrency',
      obj,
      token,
      refreshToken
    );
    setIsCheck(false);
    getdata(page * limit, limit);
    console.log(defCurrency)
    if (res && res.status == 200) {
      localStorage.setItem('DefaultCurrency', JSON.stringify(defCurrency));
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
    }
  };

  const handleClose = () => {
    setIsCheck(false);
  };

  return (
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
        <title>Currency</title>
      </Helmet>
      <PageTitleWrapper>
        <Box pt={1.1} pb={1.1} pl={1}>
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
                    Currency
                  </Typography>
                </Breadcrumbs>
              </Stack>
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
            <Card style={{ height: 'calc(100vh - 228px)' }}>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                { }
                {currencies && currencies.length > 0 ? (
                  <>
                    <TableContainer className="premiumAccounttableContainer">
                      <Table>
                        <TableBody>
                          {currencies.map((arr: any, index: number) => {
                            return (
                              <TableRow hover key={arr.id}>
                                <TableCell>
                                  <Grid sx={{py : 2 , px: 1}}>
                                  <Grid container justifyContent="space-between">

                                    <Grid
                                      item
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                      }}
                                    >

                                      <Typography
                                        sx={{
                                          fontSize: '17px',
                                          fontWeight: 'bold',
                                          textTransform: 'capitalize',
                                          color: '#495fff',
                                          paddingRight: '10px',
                                          display: 'block'
                                        }}
                                      >

                                        {`${arr.name} (${arr.symbol} : ${arr.code})`}
                                      </Typography>

                                    </Grid>

                                    <Grid
                                      item
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                      }}
                                    >
                                      {isEditPermission ? <>

                                        {(arr.isDefault == 0) ? (


                                          <Button
                                            style={{ padding: '5px 14px', width: '150px' }}
                                            variant={'contained'}
                                            onClick={(e) => handleSwitch(arr.id, arr.isDefault === 0 ? 0 : 1,arr)}
                                            disabled={credentail?.email === 'demo@admin.com'}
                                          >
                                            {'Set as Default'}
                                          </Button>) :
                                          (

                                            <div style={{
                                              textTransform: 'uppercase',
                                              fontWeight: 'bold'
                                            }}>
                                              <Label color="success">
                                                {'Default Currency'}
                                              </Label>
                                            </div>
                                          )}

                                      </> : <></>}
                                    </Grid>
                                  </Grid>
                                  <Typography style={{ 'display': 'flex', 'flexWrap': 'wrap', paddingBottom: '0px' }}>
                                    {arr.paymentGateways.map((data: any) => (
                                      <Typography
                                        key={data.id}
                                        style={{
                                          paddingRight: '1.4%',
                                          paddingTop: '1.4%'
                                        }}
                                      >
                                        <Chip
                                          label={data.paymentGateway}

                                        >
                                          {arr.name}
                                        </Chip>
                                      </Typography>
                                    ))}
                                  </Typography>
                                  </Grid>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>

                        {/* {currencies.map((arr: any, index: number) => (
                          <Accordion key={arr.id} sx={{ mt: 1 }}>
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: '#495fff' }} />
                              }
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              sx={{
                                bgcolor: '#c7cdfd',
                                display: 'flex',
                                justifyContent: 'space-between'
                              }}
                            >
                              <Grid container justifyContent="space-between">
                                <Grid
                                  item
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  Name: {arr.name}
                                  <Typography
                                    sx={{
                                      fontSize: '17px',
                                      fontWeight: 'bold',
                                      textTransform: 'capitalize',
                                      color: '#495fff',
                                      paddingRight: '10px',
                                      display: 'block'
                                    }}
                                  >
                                    Name: {arr.name}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '17px',
                                      fontWeight: 'bold',
                                      textTransform: 'capitalize',
                                      color: '#495fff',
                                      paddingRight: '10px',
                                      display: 'block'
                                    }}
                                  >
                                    Symbol: {arr.symbol}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '17px',
                                      fontWeight: 'bold',
                                      textTransform: 'capitalize',
                                      color: '#495fff',
                                      paddingRight: '10px',
                                      display: 'block'
                                    }}
                                  >
                                    Code: {arr.code}
                                  </Typography>
                                </Grid>

                                <Grid
                                  item
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  {isEditPermission ? <>
                                  <Tooltip
                                    title="Click to save as a default"
                                    arrow
                                  >
                                  { (arr.isDefault == 0) ?(


                                  <Button
                                    sx={{ minWidth: 155 }}
                                    variant={ 'contained'}
                                    onClick={(e) => handleSwitch(arr.id, arr.isDefault === 0 ? 0 : 1)}
                                    disabled={credentail?.email === 'demo@admin.com'}
                                  >
                                    {'Set as Default'}
                                  </Button>):
                                  (
                                    <Typography variant="body1" style={{'color': '#fff','padding': '0px 24px','fontWeight': '700'}}>
                                    {'Default Currency'}
                                  </Typography>
                                  )}
                                  </Tooltip>
                                  </> : <></>}
                                </Grid>
                              </Grid>
                            </AccordionSummary>
                            {arr.paymentGateways &&
                              arr.paymentGateways.length > 0 ? (
                              <Grid

                                sx={{
                                  marginLeft: '10px'
                                }}
                              >
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                  <Typography
                                    sx={{
                                      fontSize: '17px',
                                      fontWeight: 'bold',
                                      textTransform: 'capitalize',
                                      display: 'block'
                                    }}
                                  >
                                    Payment Gateway
                                  </Typography>
                                </Grid>
                                {arr.paymentGateways.map(
                                  (data: any, dIndex: number) => (
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={12}
                                      lg={12}
                                      key={data.id}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: '17px',
                                          fontWeight: 'bold',
                                          textTransform: 'capitalize'
                                          // color: '#495fff'
                                        }}
                                      >
                                        {dIndex + 1} {data.paymentGateway}
                                        <br />
                                      </Typography>
                                    </Grid>
                                  )
                                )}
                                <Typography style={{ marginBottom: '9px','display':'flex','flexWrap':'wrap' }}>
                                  {arr.paymentGateways.map((data: any) => (
                                    <Typography
                                      key={data.id}
                                      style={{
                                        paddingLeft: '4%',
                                        paddingTop: '1.4%',
                                        paddingBottom: '1.4%'
                                      }}
                                    >
                                      <Chip
                                        label={data.paymentGateway}

                                      >
                                        {arr.name}
                                      </Chip>
                                    </Typography>
                                  ))}
                                </Typography>
                              </Grid>
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
                                style={{ height: 'calc(100vh - 359px)' }}
                              >
                                <Typography variant="h5" paragraph>
                                  Data not Found
                                </Typography>
                              </Paper>
                            )}
                          </Accordion>
 ))} */}

                      </Table>
                    </TableContainer>
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
                    className="premiumAccounttableContainer"
                  >
                    <Typography variant="h5" paragraph>
                      Data not Found
                    </Typography>
                  </Paper>
                )}
              </Box>
              {/* </CardContent> */}
            </Card>
          </Grid>
        </Grid>
      </Container>
      <div>
        <Dialog open={ischeck} onClose={handleClose} fullWidth maxWidth="xs">

          {(v1.status == 0) ? (
            <>
              <DialogTitle
                sx={{ m: 0, p: 1, fontSize: '20px', fontWeight: 'bolder' }}
              >
                {'Set Default'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
                >
                  {'Are you sure you want to set as default currency?'
                  }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}  variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
                <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchCheck}  variant="outlined" style={{marginRight: '10px'}}>Yes</Button>
              </DialogActions>
            </>) :
            (
              <><DialogContent sx={{ mt: 2, pb: 1 }}>
                <DialogContentText
                  style={{ fontSize: '1rem', letterSpacing: '0.00938em', marginTop: '1' }}
                >
                  {'There must be one currency set as default'}
                </DialogContentText>
              </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}  variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
                </DialogActions>
              </>
            )
          }
        </Dialog>
      </div>

      <div>
      </div>
    </div>
  );
};

export default Currency;
