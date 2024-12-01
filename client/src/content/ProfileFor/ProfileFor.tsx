import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from '../../components/PageTitleWrapper';
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
    styled,
    FormControl,
    InputAdornment,
    Paper,
    Checkbox,
    InputLabel,
    Select,
    MenuItem,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent } from 'react';
import Loader1 from '../Loader';
import APIservice from 'src/utils/APIservice';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../smallScreen.css';

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
    // '& .MuiPaper-root': {
    //     height: '300px'
    // },
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
    gender: null
};

function ProfileFor() {
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [row, setRow] = useState<number>(10);
    const [profileFor, setProfileFor] = React.useState<any>([]);
    const [v1, setV1] = React.useState<any>(initialState);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [ischeck, setIsCheck] = useState(false);
    const [isProfileForError, setIsProfileForErrorError] = useState(false);
    const [profileForErrorMsg, setProfileForErrorMsg] = useState('');
    let [search, setSearch] = useState('');

    const [isReadPermission, setIsReadPermission] = useState(true);
    const [isWritePermission, setIsWritePermission] = useState(true);
    const [isEditPermission, setIsEditPermission] = useState(true);
    const [isDeletePermission, setIsDeletePermission] = useState(true);

    const navigate = useNavigate();

    const [isNameError, setNameError] = useState(false);
    const [NameErrorMsg, setNameErrorMsg] = useState('');
    const [isGenderError, setGenderError] = useState(false);
    const [GenderErrorMsg, setGenderErrorMsg] = useState('');

    let [credentail, setCredentail] = useState<any>();

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
        await getdata(page, limit);
        setIsOpen(false);
    }

    const reg = new RegExp(/^[a-zA-Z_ ]+$/);
    const validateName = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            if (reg.test(arr.target.value)) {
                setNameError(false);
                setNameErrorMsg('');
            } else {
                setNameError(true);
                setNameErrorMsg('Alphabet and space allowed');
            }
        } else {
            setNameError(true);
            setNameErrorMsg('Religion is required');
        }
    };

    const validateGender = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        // if (value) {
        setGenderError(false);
        setGenderErrorMsg('');
        // } else {
        //   setGenderError(true);
        //   setGenderErrorMsg('Gender is required');
        // }
    };

    const validateForm = (e: any) => {
        e.preventDefault();
        var flag = true;
        if (!v1.name) {
            setNameError(true);
            setNameErrorMsg('Religion is required');
            flag = false;
        } else {
            if (reg.test(v1.name)) {
                setNameError(false);
                setNameErrorMsg('');
                flag = true;
            } else {
                setNameError(true);
                setNameErrorMsg('Alphabet and space allowed');
                flag = false;
            }
        }
        return flag;
    };

    const handleCloseReligionDialog = () => {
        setIsOpen(false);
    };

    const handleClickisAdd = async () => {
        setV1(initialState);
        setIsOpen(true);
        setNameError(false);
        setNameErrorMsg('');
        setGenderError(false);
        setGenderErrorMsg('');
        setIsProfileForErrorError(false);
        setProfileForErrorMsg('');
    };

    const handleClickisEdit = (no: number, st: string, gender?: string) => {
        let obj = {
            id: no,
            name: st,
            gender: gender
        };
        setV1(obj);
        setIsOpen(true);
        setNameError(false);
        setNameErrorMsg('');
        setGenderError(false);
        setGenderErrorMsg('');
        setIsProfileForErrorError(false);
        setProfileForErrorMsg('');
    };

    const editReligionDialog = (arr: any) => {
        setV1(arr);
        setIsOpen(true);
    };

    const handleSwitch = async (id: number, status: number) => {
        let obj = {
            id: id,
            status: status
        };
        setV1(obj);
        setIsCheck(true);
    };

    const handleClose = () => {
        setIsCheck(false);
    };

    const handleSwitchCheck = async () => {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
            id: v1.id
        };
        const res = await APIservice.httpPost(
            '/api/admin/profileFor/activeInactiveProfileFor',
            obj,
            token,
            refreshToken
        );
        setIsCheck(false);
        getdata(page * limit, limit);
    };

    const handleInputChange = (arr: any) => {
        const { name, value } = arr.target;
        setV1({ ...v1, [name]: value });
        setIsOpen(true);
    };

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     //setChecked(event.target.checked);
    //     const name = event.target.name;
    //     setV1({ ...v1, [name]: event.target.checked});
    //     setIsOpen(true);
    // };

    const getdata = async (startIndex: number, fetchRecord: number) => {
        debugger
        try {
            if (search) {
                const token = localStorage.getItem('SessionToken');
                const refreshToken = localStorage.getItem('RefreshToken');
                let obj = {
                    startIndex: startIndex,
                    fetchRecord: fetchRecord,
                    name: search ? search : '',
                    isActive: null
                };
                const res = await APIservice.httpPost(
                    '/api/admin/profileFor/getProfileFor',
                    obj,
                    token,
                    refreshToken
                );
                setProfileFor(res.recordList);
                setRow(res.totalRecords);
            } else {
                setIsLoading(true);
                const token = localStorage.getItem('SessionToken');
                const refreshToken = localStorage.getItem('RefreshToken');
                let obj = {
                    startIndex: startIndex,
                    fetchRecord: fetchRecord
                };
                const res = await APIservice.httpPost(
                    '/api/admin/profileFor/getProfileFor',
                    obj,
                    token,
                    refreshToken
                );
                setProfileFor(res.recordList);
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

    const saveProfileFor = async (e: any) => {
        debugger
        var flag = validateForm(e);
        if (flag) {
            try {
                if (v1.id) {
                    const token = localStorage.getItem('SessionToken');
                    const refreshToken = localStorage.getItem('RefreshToken');
                    let val = {
                        id: v1.id,
                        name: v1.name,
                        gender: v1.gender
                    };
                    const res = await APIservice.httpPost(
                        '/api/admin/profileFor/insertUpdateProfileFor',
                        val,
                        token,
                        refreshToken
                    );
                    if (res && res.status == 200) {
                        setIsOpen(false);
                        getdata(page * limit, limit);
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
                    } else if (res.status == 203) {
                        setIsProfileForErrorError(true);
                        setProfileForErrorMsg('Profile for already exists!');
                    }
                } else {
                    const token = localStorage.getItem('SessionToken');
                    const refreshToken = localStorage.getItem('RefreshToken');
                    const res = await APIservice.httpPost(
                        '/api/admin/profileFor/insertUpdateProfileFor',
                        v1,
                        token,
                        refreshToken
                    );
                    if (res && res.status == 200) {
                        setPage(0);
                        setIsOpen(false);
                        getdata(0, limit);
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
                    } else if (res.status == 203) {
                        setIsProfileForErrorError(true);
                        setProfileForErrorMsg('Profile for already exists!');
                    }
                }
            } catch (error: any) {
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
        }
    };

    const searchData = (e) => {
        setSearch(e.target.value);
        search = e.target.value;
        getdata(page, limit);
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
                <title>Profile For</title>
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
                                        Profile For
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Grid>
                        <Grid item>
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
                                            Create Profile For
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
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <>
                            <Card className="religioncard">
                                <div>
                                    {isloading ? (
                                        <Loader1 title="Loading..." />
                                    ) : (
                                        <>
                                            <Divider />
                                            {profileFor && profileFor.length > 0 ? (
                                                <>
                                                    <TableContainer className="religiontableContainer">
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
                                                                            Sr. NO
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
                                                                            Gender
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
                                                                            Actions
                                                                        </Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {profileFor.map((arr: any, index: number) => {
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
                                                                            <TableCell>
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {arr.name}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {arr.gender ? arr.gender : '--'}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="right"
                                                                            >
                                                                                {isEditPermission ? <>
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
                                                                                    <Tooltip title="Edit" arrow>
                                                                                        <IconButton
                                                                                            disabled={credentail?.email === "demo@admin.com"}
                                                                                            sx={{
                                                                                                '&:hover': {
                                                                                                    background:
                                                                                                        theme.colors.primary.lighter
                                                                                                },
                                                                                                color: theme.palette.primary.main
                                                                                            }}
                                                                                            color="inherit"
                                                                                            size="small"
                                                                                            onClick={(e) =>
                                                                                                handleClickisEdit(
                                                                                                    arr.id,
                                                                                                    arr.name,
                                                                                                    arr.gender
                                                                                                )
                                                                                            }
                                                                                            data-toggle="modal"
                                                                                            data-target="#exampleModal"
                                                                                        >
                                                                                            <EditTwoToneIcon fontSize="small" />
                                                                                        </IconButton>
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
                                                    className="religioncard"
                                                >
                                                    <Typography variant="h5" paragraph>
                                                        Data not Found
                                                    </Typography>
                                                </Paper>
                                            )}
                                            <div>
                                                <Dialog
                                                    open={ischeck}
                                                    onClose={handleClose}
                                                    fullWidth
                                                    maxWidth="xs"
                                                >
                                                    <DialogTitle
                                                        sx={{
                                                            m: 0,
                                                            p: 2,
                                                            fontSize: '20px',
                                                            fontWeight: 'bolder'
                                                        }}
                                                    >
                                                        {v1.status === 0 ? 'Inactive' : 'Active'}
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText
                                                            style={{
                                                                fontSize: '1rem',
                                                                letterSpacing: '0.00938em'
                                                            }}
                                                        >
                                                            {v1.status === 0
                                                                ? 'Are you sure you want to Active?'
                                                                : 'Are you sure you want to Inactive?'}
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
                                                        <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchCheck} variant="outlined" style={{marginRight: '10px'}}>Yes</Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>

                                            <div>
                                                <BootstrapDialog
                                                    open={isOpen}
                                                    onClose={handleCloseReligionDialog}
                                                    PaperProps={{ sx: { height: '40%' } }}
                                                    fullWidth
                                                    maxWidth="xs"
                                                >
                                                    <BootstrapDialogTitle
                                                        id="customized-dialog-title"
                                                        onClose={handleCloseReligionDialog}
                                                    >
                                                        {v1.id ? 'Edit Profile For' : 'Add Profile For'}
                                                    </BootstrapDialogTitle>
                                                    <DialogContent dividers>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="name"
                                                            label="Profile For"
                                                            type="text"
                                                            fullWidth
                                                            variant="outlined"
                                                            name="name"
                                                            value={v1.name}
                                                            onChange={(arr) => {
                                                                handleInputChange(arr);
                                                                validateName(arr);
                                                            }}
                                                            required={true}
                                                        />
                                                        <FormHelperText
                                                            style={{ color: 'red', height: '22px' }}
                                                        >
                                                            {isNameError && NameErrorMsg}
                                                        </FormHelperText>
                                                        {/* <FormControl
                                                            sx={{ width: { lg: 265, md: 265, sm: 265, xs: 200 } }}
                                                        >
                                                            <InputLabel id="demo-multiple-name-label">
                                                                Premium Facility
                                                            </InputLabel>
                                                            <Select
                                                                labelId="demo-multiple-name-label"
                                                                id="gender"
                                                                multiple={true}
                                                                name="gender"
                                                                value={['male', 'female']}
                                                                onChange={(arr) => {
                                                                    handleChange(arr);
                                                                    validateGender(arr);
                                                                }}
                                                                label="Premium Facility"
                                                                MenuProps={MenuProps}
                                                                required={true}
                                                            >
                                                                <MenuItem value="male">Male</MenuItem>
                                                                <MenuItem value="female">Female</MenuItem>
                                                            </Select>
                                                        </FormControl> */}

                                                        <FormControl style={{ verticalAlign: 'sub' }}>
                                                            <FormLabel id="demo-radio-buttons-group-label">
                                                                Gender
                                                            </FormLabel>
                                                            <RadioGroup
                                                                row
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel
                                                                    name="gender"
                                                                    value="Female"
                                                                    checked={v1.gender === 'Female'}
                                                                    onChange={(e: any) => {
                                                                        validateGender(e);
                                                                        handleInputChange(e);
                                                                    }}
                                                                    control={<Radio />}
                                                                    label="Female"
                                                                />
                                                                <FormControlLabel
                                                                    name="gender"
                                                                    value="Male"
                                                                    checked={v1.gender === 'Male'}
                                                                    onChange={(e: any) => {
                                                                        validateGender(e);
                                                                        handleInputChange(e);
                                                                    }}
                                                                    control={<Radio />}
                                                                    label="Male"
                                                                />
                                                            </RadioGroup>
                                                            <FormHelperText
                                                                style={{ color: 'red', height: '22px' }}
                                                            >
                                                                {isGenderError && GenderErrorMsg}
                                                            </FormHelperText>
                                                        </FormControl>
                                                        {/* Required <Checkbox
                                                            checked={v1.isRequired}
                                                            onChange={handleChange}
                                                            name="isRequired"
                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                        /> */}
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
                                                            {isProfileForError && profileForErrorMsg}
                                                        </FormHelperText>
                                                        <Typography>
                                                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleCloseReligionDialog} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
                                                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={saveProfileFor} variant="outlined" style={{marginRight: '10px'}}>Save</Button>
                                                        </Typography>

                                                    </Box>
                                                </BootstrapDialog>
                                            </div>
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

export default ProfileFor;
