import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from '../../components/PageTitleWrapper';
import HomeIcon from '@mui/icons-material/Home';
import '../../content/smallScreen.css';
import { Link, useNavigate } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import { Box, Breadcrumbs, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, styled, useTheme } from '@mui/material';
import APIservice from 'src/utils/APIservice';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import Loader1 from '../appuserViewLoader';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1)
    },
    '& .MuiPaper-root': {
        height: '300px'
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

const UserPackages = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [row, setRow] = useState<number>(10);
    const [isLoading, setIsLoading] = useState(false);
    let [search, setSearch] = useState('');
    let [userId, setUserId] = useState();
    let [activeUserId, setActiveUserId] = useState<number>();
    const [userPackages, setUserPackages] = useState<any>([]);

    const [paymentStatus, setPaymentStatus] = useState<any>(["All", "Success", "Pending", "Failed"]);
    const [packageStatus, setPackageStatus] = useState<any>(["All", "Active", "Override", "Upcomming", "Expired"]);
    let [credentail, setCredentail] = useState<any>();
    const [paymentRefNo, setPaymentRefNo] = useState<string>("");
    const [selectedUserPackage, setSelectedUserPackage] = useState<any>();
    let [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("");
    let [selectedPackageStatus, setSelectedPackageStatus] = useState<string>("");
    const [isActivePackage, setIsActivePackage] = useState(false);

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
                        getUserPackages(page, limit);
                }
            } else {
                getUserPackages(page, limit);
            }
        }
    }, []);

    const dateData = localStorage.getItem('DateFormat');

    const getUserPackages = async (startIndex: number, fetchRecord: number) => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                startIndex: startIndex,
                fetchRecord: fetchRecord,
                userId: userId,
                paymentStatus: selectedPaymentStatus ? selectedPaymentStatus : null,
                packageStatus: selectedPackageStatus ? selectedPackageStatus : null,
                searchString: search ? search : null
            };
            const res = await APIservice.httpPost(
                '/api/admin/appUsers/getUserPackages',
                obj,
                token,
                refreshToken
            );
            if (res && res.status == 200) {
                setUserPackages(res.recordList);
                setRow(res.totalRecords);
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

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setSelectedPaymentStatus(value);
        selectedPaymentStatus = value;
        getUserPackages(page, limit);
    };

    const handleChangePackageStatus = (event: any) => {
        const { name, value } = event.target;
        setSelectedPackageStatus(value);
        selectedPackageStatus = value;
        getUserPackages(page, limit);
    };

    const searchData = (e) => {
        setSearch(e.target.value);
        search = e.target.value;
        getUserPackages(page, limit);
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
        getUserPackages(newPage * limit, limit);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        getUserPackages(0, parseInt(event.target.value));
    };

    const handleOpenActivePackageDialog = async (userPackage: any, _activeUserId: number) => {
        setSelectedUserPackage(userPackage);
        setActiveUserId(_activeUserId);
        setIsActivePackage(true);
    }

    const handleCloseActivePackageDialog = async () => {
        setIsActivePackage(false);
    }

    const handleInputChange = (arr: any) => {
        const { name, value } = arr.target;
        setPaymentRefNo(value);
    };

    const handleActiveUserPackage = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                packageId: selectedUserPackage.id,
                paymentId: selectedUserPackage.paymentId,
                packageDurationId: selectedUserPackage.packageDurationId,
                userId: activeUserId
            };
            const res = await APIservice.httpPost(
                '/api/admin/appUsers/activeUserPackage',
                obj,
                token,
                refreshToken
            );
            if (res && res.status == 200) {
                handleCloseActivePackageDialog();
                getUserPackages(page * limit, limit);
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
    }

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
                <title>User Packages</title>
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
                                        User Packages
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1.5}>
                                <Grid item>
                                    <FormControl
                                        sx={{ minWidth: 150, mt: { xs: 0, md: 0 } }}
                                        size="small"
                                    >
                                        <InputLabel htmlFor="demo-customized-select-label">
                                            Payment Status
                                        </InputLabel>
                                        <Select
                                            labelId="demo-customized-select-label"
                                            id="demo-customized-select"
                                            name="data"
                                            value={selectedPaymentStatus}
                                            label="Payment Status"
                                            onChange={handleChange}
                                        >
                                            {paymentStatus.map((arr: any, ind: number) => (
                                                <MenuItem key={ind} value={arr}>
                                                    {arr}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl
                                        sx={{ minWidth: 150, mt: { xs: 0, md: 0 } }}
                                        size="small"
                                    >

                                        <InputLabel htmlFor="demo-customized-select-label1">
                                            Package Status
                                        </InputLabel>
                                        <Select
                                            labelId="demo-customized-select-label1"
                                            id="demo-customized-select"
                                            name="data"
                                            value={selectedPackageStatus}
                                            label="Payment Status"
                                            onChange={handleChangePackageStatus}
                                        >
                                            {packageStatus.map((arr: any, ind: number) => (
                                                <MenuItem key={ind} value={arr}>
                                                    {arr}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl
                                        sx={{ mt: { xs: 0.3, md: 0.3, lg: 0.3, sm: 0.3 } }}
                                    >
                                        <TextField
                                            // size="small"
                                            id="outlined-basic"
                                            label="Search"
                                            variant="outlined"
                                            name="searchString"
                                            value={search}
                                            onChange={(e) => searchData(e)}
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
                <Card className="religioncard">
                    <div>
                        {isLoading ? (
                            <Loader1 title="Loading..." />
                        ) : (
                            <>
                                <Divider />
                                {userPackages && userPackages.length ? (
                                    <>
                                        <TableContainer className="religiontableContainer">
                                            <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Sr. NO </TableCell>
                                                        <TableCell>User </TableCell>
                                                        <TableCell>Package </TableCell>
                                                        <TableCell>Start Date </TableCell>
                                                        <TableCell>End Date </TableCell>
                                                        <TableCell>Amount </TableCell>
                                                        <TableCell>Status </TableCell>
                                                        <TableCell align="right">
                                                            Action{' '}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {userPackages.map((userPackage: any, index: any) => (
                                                        <TableRow key={userPackage.id}>
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
                                                            <TableCell align="left">
                                                                <Typography
                                                                    variant="body1"
                                                                    fontWeight="bold"
                                                                    color="text.primary"
                                                                    gutterBottom
                                                                    noWrap
                                                                >
                                                                    {userPackage.firstName
                                                                        ? userPackage.firstName + " " + userPackage.lastName + (userPackage.contactNo ? "(" + userPackage.contactNo + ")" : "")
                                                                        : '--'}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                <Typography
                                                                    variant="body1"
                                                                    fontWeight="bold"
                                                                    color="text.primary"
                                                                    gutterBottom
                                                                    noWrap
                                                                >
                                                                    {userPackage.packageName
                                                                        ? userPackage.packageName + "(" + userPackage.value + " Month)"
                                                                        : '--'}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                <Typography
                                                                    variant="body1"
                                                                    fontWeight="bold"
                                                                    color="text.primary"
                                                                    gutterBottom
                                                                    noWrap
                                                                >
                                                                    {userPackage.startDate ? format(
                                                                        new Date(userPackage.startDate),
                                                                        dateData
                                                                    ) : ""}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                <Typography
                                                                    variant="body1"
                                                                    fontWeight="bold"
                                                                    color="text.primary"
                                                                    gutterBottom
                                                                    noWrap
                                                                >
                                                                    {userPackage.endDate ? format(
                                                                        new Date(userPackage.endDate),
                                                                        dateData
                                                                    ) : ""}
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
                                                                    ₹{userPackage.netAmount}
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
                                                                    {userPackage.status === 'Override' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#919eab", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                                                    {userPackage.status === 'Active' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#53bc5b", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                                                    {/* {userPackage.status === 'Shipped' && <Typography sx={{ color: "white", backgroundColor: "#fcde2a" }}>{userPackage.status}</Typography>} */}
                                                                    {userPackage.status === 'Upcomming' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#1565c0", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                                                    {userPackage.status === 'Expired' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#e20700", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                                                    {userPackage.status === 'Pending' && <Typography sx={{ color: "white", textAlign: 'center', backgroundColor: "#fc7b2a", borderRadius: '5px' }}>{userPackage.status}</Typography>}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {isEditPermission ?
                                                                    <Typography
                                                                        variant="body1"
                                                                        fontWeight="bold"
                                                                        color="text.primary"
                                                                        gutterBottom
                                                                        noWrap
                                                                    >
                                                                        {userPackage.status == "Pending" ? <Button
                                                                            style={{ textAlign: 'right' }}
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onClick={(e) => {
                                                                                handleOpenActivePackageDialog(userPackage, userPackage.userId);
                                                                            }}
                                                                        >
                                                                            Active Package
                                                                        </Button> : <></>}

                                                                    </Typography>
                                                                    : <></>}

                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
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
                                            boxShadow: 'none',
                                            height: 'calc(100vh - 453px)'
                                        }}
                                    // className="communitytableContainer"
                                    >
                                        <Typography variant="h5" paragraph>
                                            Data not Found
                                        </Typography>
                                    </Paper>
                                )}
                            </>
                        )}
                    </div>
                    <div>
                        <BootstrapDialog
                            open={isActivePackage}
                            onClose={handleCloseActivePackageDialog}
                            PaperProps={{ sx: { height: '40%' } }}
                            fullWidth
                            maxWidth="md"
                        >
                            <BootstrapDialogTitle
                                id="customized-dialog-title"
                                onClose={handleCloseActivePackageDialog}
                            >
                                Active Dialog
                            </BootstrapDialogTitle>
                            <DialogContent dividers>

                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Payment Refererence No"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    name="name"
                                    value={paymentRefNo}
                                    onChange={(arr) => {
                                        handleInputChange(arr);
                                    }}
                                />
                            </DialogContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    p: '8px'
                                }}
                            >
                                <FormHelperText
                                    style={{
                                        color: 'red',
                                        height: '22px',
                                        margin: 'none',
                                        padding: '8px'
                                    }}
                                >
                                </FormHelperText>
                                <div>
                                    <Button onClick={handleCloseActivePackageDialog} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
                                    <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleActiveUserPackage} variant="outlined" style={{marginRight: '10px'}}>Aproved</Button>

                                </div>
                            </Box>
                            {/* <DialogActions>
                            </DialogActions> */}
                        </BootstrapDialog>
                    </div>
                </Card>
            </Container>
        </div>
    );
};

export default UserPackages;