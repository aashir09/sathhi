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

function RegistrationScreen() {
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [row, setRow] = useState<number>(10);
    const [screens, setScreens] = React.useState<any>([]);
    const [screen, setScreen] = React.useState<any>(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisableCheck, setIsDisableCheck] = useState(false);
    const [isSkippableCheck, setIsSkippableCheck] = useState(false);

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
    }

    const getData = async (startIndex: number, fetchRecord: number) => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                startIndex: startIndex,
                fetchRecord: fetchRecord
            };
            const res = await APIservice.httpPost(
                '/api/admin/registrationScreen/getRegistrationScreen',
                obj,
                token,
                refreshToken
            );
            setScreens(res.recordList);
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


    const handleClose = () => {
        setIsDisableCheck(false);
        setIsSkippableCheck(false)
    };

    const handleDisableSwitch = async (id: number, status: number) => {
        let obj = {
            id: id,
            status: status
        };
        setScreen(obj);
        setIsDisableCheck(true);
    };

    const handleDisableSwitchCheck = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                id: screen.id
            };
            const res = await APIservice.httpPost(
                '/api/admin/registrationScreen/toggleDisableScreen',
                obj,
                token,
                refreshToken
            );
            setIsDisableCheck(false);
            getData(page * limit, limit);
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

    const handleSkippableSwitch = async (id: number, status: number) => {
        let obj = {
            id: id,
            status: status
        };
        setScreen(obj);
        setIsSkippableCheck(true);
    };

    const handleSkippableSwitchCheck = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                id: screen.id
            };
            const res = await APIservice.httpPost(
                '/api/admin/registrationScreen/toggleSkipScreen',
                obj,
                token,
                refreshToken
            );
            setIsSkippableCheck(false);
            getData(page * limit, limit);
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
                <title>Registration Screens</title>
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
                                        Registration Screen
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Grid>
                        {/* <Grid item>
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
                      Create Height
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
            </Grid> */}
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
                                            {screens && screens.length > 0 ? (
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
                                                                            Name
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
                                                                            Disable
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
                                                                            Skip
                                                                        </Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {screens.map((arr: any, index: number) => {
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
                                                                                    {arr.name}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="right"
                                                                            >
                                                                                {(isEditPermission && arr.canDisable) ? <>
                                                                                    <Tooltip
                                                                                        title={
                                                                                            arr.isDisable === 0
                                                                                                ? 'Disable'
                                                                                                : 'Enable'
                                                                                        }
                                                                                        arrow
                                                                                    >
                                                                                        <Switch
                                                                                            disabled={credentail?.email === "demo@admin.com"}
                                                                                            checked={
                                                                                                arr.isDisable === 0 ? false : true
                                                                                            }
                                                                                            onClick={(e) =>
                                                                                                handleDisableSwitch(arr.id, arr.isDisable)
                                                                                            }
                                                                                            inputProps={{
                                                                                                'aria-label': 'controlled'
                                                                                            }}
                                                                                        />
                                                                                    </Tooltip>

                                                                                </> : <></>}

                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="right"
                                                                            >
                                                                                {isEditPermission ? <>
                                                                                    <Tooltip
                                                                                        title={
                                                                                            arr.isSkippable === 0
                                                                                                ? 'Enable Skip'
                                                                                                : 'Disable Skip'
                                                                                        }
                                                                                        arrow
                                                                                    >
                                                                                        <Switch
                                                                                            disabled={credentail?.email === "demo@admin.com"}
                                                                                            checked={
                                                                                                arr.isSkippable === 0 ? false : true
                                                                                            }
                                                                                            onClick={(e) =>
                                                                                                handleSkippableSwitch(arr.id, arr.isSkippable)
                                                                                            }
                                                                                            inputProps={{
                                                                                                'aria-label': 'controlled'
                                                                                            }}
                                                                                        />
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
                                    open={isDisableCheck}
                                    onClose={handleClose}
                                    fullWidth
                                    maxWidth="xs"
                                >
                                    <DialogTitle
                                        sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
                                    >
                                        {screen.status === 0 ? 'Inactive' : 'Active'}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText
                                            style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
                                        >
                                            {screen.status === 0
                                                ? 'Are you sure you want to Disable?'
                                                : 'Are you sure you want to Enable?'}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                        <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleDisableSwitchCheck} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>

                            <div>
                                <Dialog
                                    open={isSkippableCheck}
                                    onClose={handleClose}
                                    fullWidth
                                    maxWidth="xs"
                                >
                                    <DialogTitle
                                        sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
                                    >
                                        {screen.status === 0 ? 'Inactive' : 'Active'}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText
                                            style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
                                        >
                                            {screen.status === 0
                                                ? 'Are you sure you want to Disable Skip?'
                                                : 'Are you sure you want to Enable Skip?'}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                        <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSkippableSwitchCheck} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </>
                    </Grid>
                </Grid>
            </Container>
            {/* <Footer /> */}
        </>
    );
}

export default RegistrationScreen;
