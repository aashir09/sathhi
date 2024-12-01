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
    Select,
    InputLabel,
    MenuItem,
    CardHeader,
    Chip
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent, useEffect } from 'react';
import Loader1 from '../Loader';
import APIservice from 'src/utils/APIservice';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../content/smallScreen.css';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Coupons as CouponsModel } from 'src/models/coupons';
import { Packages } from 'src/models/package';
import { Col, Row } from 'react-bootstrap';
import de from 'date-fns/esm/locale/de/index.js';

const modules = {
    toolbar: {
        container: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ],
    },
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
    name: '',
    jsonData: "",
    description: "",
    useInWallet: null,
    useInCheckout: null,
    useInAndroid: null,
    useInApple: null
};

const PaymentGateway = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [row, setRow] = useState<number>(10);
    const [v1, setV1] = React.useState<any>(initialState);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [ischeck, setIsCheck] = useState(false);
    const [isPaymentGatewayDialog, setClosePaymentGateway] = useState(false);
    let [defaultCurrencyPaymentGateway, setDefaultCurrencyPaymentGateway] = useState<any>([]);
    let [search, setSearch] = useState('');
    const [paymentGateways, setPaymentGateway] = React.useState<any>(initialState);
    const [selectedPackages, setSelectedPackages] = useState<any>([]);
    const [packages, setPackages] = useState<Packages[]>([]);
    let [credentail, setCredentail] = useState<any>();
    const [formData, setFormData] = useState({});
    const [jsonData, setJsonData] = useState({});
    const [isDefault, setIsDefault] = useState(false);
    let [defaultCurrency, setDefaultCurrency] = useState<any>('');



    const [isReadPermission, setIsReadPermission] = useState(true);
    const [isWritePermission, setIsWritePermission] = useState(true);
    const [isEditPermission, setIsEditPermission] = useState(true);
    const [isDeletePermission, setIsDeletePermission] = useState(true);


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


        // setCredentail(cred);
        // getdata(page, limit);
        // getDefaultCurrencyPaymentGateway();
    }, []);

    const loadData = async () => {
        getdata(page, limit);
        getDefaultCurrencyPaymentGateway();
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
                    searchString: search ? search : '',
                };
                const res = await APIservice.httpPost(
                    '/api/admin/paymentGateways/getpaymentGateway',
                    obj,
                    token,
                    refreshToken
                );
                setPaymentGateway(res.recordList);
                setRow(res.totalRecords);
            } else {
                setIsLoading(true);
                const token = localStorage.getItem('SessionToken');
                const refreshToken = localStorage.getItem('RefreshToken');
                let obj = {
                    startIndex: startIndex,
                    fetchRecord: fetchRecord,
                    isActive: null,
                };
                const res = await APIservice.httpPost(
                    '/api/admin/paymentGateways/getpaymentGateway',
                    obj,
                    token,
                    refreshToken
                );
                setPaymentGateway(res.recordList);
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

    const getDefaultCurrencyPaymentGateway = async () => {
        try {
            debugger
            setIsLoading(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                isDefaultCurrencyPaymentGateway: true
            };
            const res = await APIservice.httpPost(
                '/api/admin/currencies/getCurrencies',
                obj,
                token,
                refreshToken
            );
            setDefaultCurrencyPaymentGateway(res.recordList[0].paymentGateways);
            defaultCurrencyPaymentGateway = res.recordList[0].paymentGateways;
            setDefaultCurrency(res.recordList[0].name);
            defaultCurrency = res.recordList[0].name
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

    const savePaymentGateway = async () => {
        debugger
        // const token = localStorage.getItem('SessionToken');
        // const refreshToken = localStorage.getItem('RefreshToken');
        // let obj = {
        //     id: v1.id,
        //     jsonData: JSON.stringify(formData),
        //     description: v1.description
        // };
        // const res = await APIservice.httpPost(
        //     '/api/admin/paymentGateways/updatePaymentGateway',
        //     obj,
        //     token,
        //     refreshToken
        // );

        try {
            {
                setIsLoading(true);
                const token = localStorage.getItem('SessionToken');
                const refreshToken = localStorage.getItem('RefreshToken');
                let obj = {
                    id: v1.id,
                    jsonData: JSON.stringify(formData),
                    description: v1.description
                };
                const res = await APIservice.httpPost(
                    '/api/admin/paymentGateways/updatePaymentGateway',
                    obj,
                    token,
                    refreshToken
                );
                setV1({});
                setFormData({});
                setJsonData({});
                if (res && res.status == 200) {

                    setIsOpen(false);
                    setClosePaymentGateway(false)
                    getdata(page, limit);
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


    }


    const handleSwitch = async (id: number, status: number, flag: string, DefaultPaymentGateway?: boolean) => {
        debugger
        if (DefaultPaymentGateway == true) {
            const isGatewayInList = defaultCurrencyPaymentGateway.some(gateway => gateway.paymentGatewayId === id);

            if (isGatewayInList == false && status == 0) {
                setIsDefault(false);
            } else {
                let obj = {
                    id: id,
                    status: status,
                    flag: flag
                };
                setV1(obj);
                setIsDefault(true);
            }

        }
        else {
            let obj = {
                id: id,
                status: status,
                flag: flag
            };
            setV1(obj);
            setIsDefault(true);
        }
        setIsCheck(true);
    };

    const handleSwitchCheck = async () => {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
            id: v1.id,
            isActive: !v1.status,
            flag: v1.flag
        };
        const res = await APIservice.httpPost(
            '/api/admin/paymentGateways/activeInActivePaymentGateway',
            obj,
            token,
            refreshToken
        );
        setIsCheck(false);
        setIsDefault(true);
        getdata(page * limit, limit);
    };

    const handleClose = () => {
        setIsCheck(false);
    };

    const handleClosePaymentGatewayDialog = () => {
        setClosePaymentGateway(false)
    }

    const handleClickisEdit = async (id: number, name: string, jsonData?: string, description?: string) => {
        debugger
        let obj = {
            id: id,
            jsonData: JSON.parse(jsonData),
            name: name,
            description: description
        };
        setV1(obj);
        // setJsonData(obj.jsonData);
        // setFormData({
        //     ...formData,
        //     ...obj.jsonData,
        // });
        setClosePaymentGateway(true);
        setFormData({});
        if (jsonData != null) {
            setJsonData(obj.jsonData);
            setFormData({
                ...formData,
                ...obj.jsonData,
            });
        }
        else {
            setFormData({
                ...formData,
                ...v1.description,
            });
        }

    };

    const handleInputChange = (key, value) => {
        debugger
        setFormData({
            ...formData,
            [key]: value,
        });
    };
    const handleEditorInputChange = (name, content) => {
        setFormData({});
        // Assuming v1 is your state object containing the description
        setV1({
            ...v1,
            [name]: content
        });
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
                <title>Payment Gateways</title>
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
                                        Payment Gateways
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1.5}>
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
                                            {paymentGateways && paymentGateways.length > 0 ? (
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
                                                                                marginBottom: 'none',
                                                                                textAlign: 'center'
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
                                                                                marginBottom: 'none',
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
                                                                                marginBottom: 'none',
                                                                                textAlign: 'center'
                                                                            }}
                                                                        >
                                                                            Use In Wallet
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography
                                                                            noWrap
                                                                            style={{
                                                                                fontSize: '13px',
                                                                                fontWeight: 'bold',
                                                                                marginBottom: 'none',
                                                                                textAlign: 'center'
                                                                            }}
                                                                        >
                                                                            Use In Checkout
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography
                                                                            noWrap
                                                                            style={{
                                                                                fontSize: '13px',
                                                                                fontWeight: 'bold',
                                                                                marginBottom: 'none',
                                                                                textAlign: 'center'
                                                                            }}
                                                                        >
                                                                            Use In Android
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography
                                                                            noWrap
                                                                            style={{
                                                                                fontSize: '13px',
                                                                                fontWeight: 'bold',
                                                                                marginBottom: 'none',
                                                                                textAlign: 'center'
                                                                            }}
                                                                        >
                                                                            Use In Apple
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography
                                                                            noWrap
                                                                            style={{
                                                                                fontSize: '13px',
                                                                                fontWeight: 'bold',
                                                                                marginBottom: 'none',
                                                                                textAlign: 'center'
                                                                            }}
                                                                        >
                                                                            Is Active
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Typography
                                                                            noWrap
                                                                            style={{
                                                                                fontSize: '13px',
                                                                                fontWeight: 'bold',
                                                                                marginBottom: 'none',
                                                                                textAlign: 'center'
                                                                            }}
                                                                        >
                                                                            Actions
                                                                        </Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {paymentGateways.map((arr: any, index: number) => {
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
                                                                            <TableCell
                                                                                align="center"
                                                                            >
                                                                                {isEditPermission ?
                                                                                    <>
                                                                                        {(arr.useInWallet == 0 || arr.useInWallet == 1) && (
                                                                                            <Tooltip
                                                                                                title={
                                                                                                    arr.useInWallet === 0
                                                                                                        ? 'Inactive'
                                                                                                        : 'Active'
                                                                                                }
                                                                                                arrow
                                                                                            >

                                                                                                <Switch
                                                                                                    disabled={credentail?.email === "demo@admin.com"}
                                                                                                    checked={
                                                                                                        arr.useInWallet === 0 ? false : true
                                                                                                    }
                                                                                                    onClick={(e) =>
                                                                                                        handleSwitch(arr.id, arr.useInWallet, 'useInWallet')
                                                                                                    }
                                                                                                    inputProps={{
                                                                                                        'aria-label': 'controlled'
                                                                                                    }}
                                                                                                />
                                                                                            </Tooltip>
                                                                                        )
                                                                                        }</> :
                                                                                    <></>
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center"
                                                                            >{isEditPermission ?
                                                                                <>
                                                                                    {(arr.useInCheckout == 0 || arr.useInCheckout == 1) && (
                                                                                        <Tooltip
                                                                                            title={
                                                                                                arr.useInCheckout === 0
                                                                                                    ? 'Inactive'
                                                                                                    : 'Active'
                                                                                            }
                                                                                            arrow
                                                                                        >
                                                                                            <Switch
                                                                                                disabled={credentail?.email === "demo@admin.com"}
                                                                                                checked={
                                                                                                    arr.useInCheckout === 0 ? false : true
                                                                                                }
                                                                                                onClick={(e) =>
                                                                                                    handleSwitch(arr.id, arr.useInCheckout, 'useInCheckout')
                                                                                                }
                                                                                                inputProps={{
                                                                                                    'aria-label': 'controlled'
                                                                                                }}
                                                                                            />
                                                                                        </Tooltip>
                                                                                    )}</> :
                                                                                <></>
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center"
                                                                            >{isEditPermission ?
                                                                                <>
                                                                                    {(arr.useInAndroid == 0 || arr.useInAndroid == 1) && (
                                                                                        <Tooltip
                                                                                            title={
                                                                                                arr.useInAndroid === 0
                                                                                                    ? 'Inactive'
                                                                                                    : 'Active'
                                                                                            }
                                                                                            arrow
                                                                                        >
                                                                                            <Switch
                                                                                                disabled={credentail?.email === "demo@admin.com"}
                                                                                                checked={
                                                                                                    arr.useInAndroid === 0 ? false : true
                                                                                                }
                                                                                                onClick={(e) =>
                                                                                                    handleSwitch(arr.id, arr.useInAndroid, 'useInAndroid')
                                                                                                }
                                                                                                inputProps={{
                                                                                                    'aria-label': 'controlled'
                                                                                                }}
                                                                                            />
                                                                                        </Tooltip>
                                                                                    )}</> :
                                                                                <></>
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center"
                                                                            >
                                                                                {isEditPermission ?
                                                                                    <>
                                                                                        {(arr.useInApple == 0 || arr.useInApple == 1) && (
                                                                                            <Tooltip
                                                                                                title={
                                                                                                    arr.useInApple === 0
                                                                                                        ? 'Inactive'
                                                                                                        : 'Active'
                                                                                                }
                                                                                                arrow
                                                                                            >
                                                                                                <Switch
                                                                                                    disabled={credentail?.email === "demo@admin.com"}
                                                                                                    checked={
                                                                                                        arr.useInApple === 0 ? false : true
                                                                                                    }
                                                                                                    onClick={(e) =>
                                                                                                        handleSwitch(arr.id, arr.useInApple, 'useInApple')
                                                                                                    }
                                                                                                    inputProps={{
                                                                                                        'aria-label': 'controlled'
                                                                                                    }}
                                                                                                />
                                                                                            </Tooltip>
                                                                                        )}</> :
                                                                                    <></>
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center"
                                                                            >
                                                                                {isEditPermission ?
                                                                                    <>
                                                                                        <Tooltip
                                                                                            title={
                                                                                                arr.isActive === 0
                                                                                                    ? 'Inactive'
                                                                                                    : 'Active'
                                                                                            }
                                                                                            arrow
                                                                                        >
                                                                                            <Switch
                                                                                                disabled={credentail?.email === "demo@admin.com" || arr.name === 'Wallet'}
                                                                                                checked={
                                                                                                    arr.isActive === 0 ? false : true
                                                                                                }
                                                                                                onClick={(e) =>
                                                                                                    handleSwitch(arr.id, arr.isActive, 'isActive', true)
                                                                                                }
                                                                                                inputProps={{
                                                                                                    'aria-label': 'controlled'
                                                                                                }}
                                                                                            />
                                                                                        </Tooltip>
                                                                                    </> :
                                                                                    <></>
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center"
                                                                            >

                                                                                {/* <Tooltip
                                                                                    title={
                                                                                        arr.isActive === 0
                                                                                            ? 'Inactive'
                                                                                            : 'Active'
                                                                                    }
                                                                                    arrow
                                                                                > */}

                                                                                {/* <Switch
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
                                                                                    /> */}
                                                                                {/* </Tooltip> */}
                                                                                {(arr.jsonData || arr.name == "ManualPayment") && (
                                                                                    <Tooltip title="Edit PaymentGateway" arrow>
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
                                                                                            onClick={(e) => {
                                                                                                handleClickisEdit(
                                                                                                    arr.id,
                                                                                                    arr.name,
                                                                                                    arr.jsonData,
                                                                                                    arr.description
                                                                                                )
                                                                                            }
                                                                                            }
                                                                                            data-toggle="modal"
                                                                                            data-target="#exampleModal"
                                                                                        >
                                                                                            <EditTwoToneIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                )}
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
                                                    {(isDefault == true) ? (
                                                        <>
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
                                                        </>) : (
                                                        <>

                                                            <DialogContent>
                                                                <DialogContentText
                                                                    style={{
                                                                        fontSize: '1rem',
                                                                        letterSpacing: '0.00938em'
                                                                    }}
                                                                >
                                                                    {`This paymentGateway does not support the default currency ${defaultCurrency}.`}
                                                                </DialogContentText>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={handleClose} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
                                                            </DialogActions>
                                                        </>)
                                                    }
                                                </Dialog>
                                            </div>
                                            <div>
                                                <BootstrapDialog
                                                    open={isPaymentGatewayDialog}
                                                    onClose={handleClosePaymentGatewayDialog}
                                                    PaperProps={{ sx: { height: '40%' } }}
                                                    fullWidth
                                                    maxWidth="xs"
                                                >
                                                    <BootstrapDialogTitle
                                                        id="customized-dialog-title"
                                                        onClose={handleClosePaymentGatewayDialog}
                                                    >
                                                        {(v1.name !== "ManualPayment") ?
                                                            <> Edit {v1.name} PaymentGateway</>
                                                            :
                                                            <> Edit {v1.name}</>
                                                        }

                                                    </BootstrapDialogTitle>
                                                    <DialogContent dividers>
                                                        <form onSubmit={savePaymentGateway}>
                                                            {/* {Array.isArray(v1.jsonData) && ( */}

                                                            {/* {Object.entries(jsonData)(([key, defaultValue]) => (
                                                                <div key={key}>
                                                                    <label htmlFor={key}>{key}</label>
                                                                    <input
                                                                        type="text"
                                                                        id={key}
                                                                        name={key}
                                                                        value={formData[key] || defaultValue}
                                                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                                                    />
                                                                </div>
                                                            ))
                                                            } */}
                                                            {/* )} */}

                                                            {/* {Object.entries(jsonData).map(([key, defaultValue]) => (
                                                                ((key == "MnualPayment") ?
                                                                    <TextField key={key}
                                                                        autoFocus
                                                                        margin="dense"
                                                                        id="name"
                                                                        label={key}
                                                                        type="text"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        name={key}
                                                                        value={formData[key] || defaultValue}
                                                                        onChange={(arr) => {
                                                                            handleInputChange(key, arr.target.value);
                                                                        }}
                                                                        required={true}
                                                                    /> :
                                                                    <ReactQuill
                                                                        theme="snow"
                                                                        value={formData[key] || defaultValue}
                                                                        onChange={(content) => { handleInputChange(key, content); }}
                                                                        modules={modules}
                                                                    />
                                                                )

                                                                // <div key={key}>
                                                                //     <label htmlFor={key}>{key}</label>
                                                                //     <input
                                                                //         type="text"
                                                                //         id={key}
                                                                //         name={key}
                                                                //         value={formData[key] || defaultValue}
                                                                //         onChange={(e) => handleInputChange(key, e.target.value)}
                                                                //     />
                                                                // </div>
                                                            ))} */}

                                                            {(v1.name !== "ManualPayment") ? (
                                                                <>
                                                                    {Object.entries(jsonData).map(([key, defaultValue]) => (
                                                                        <TextField
                                                                            key={key}
                                                                            autoFocus
                                                                            margin="dense"
                                                                            id="name"
                                                                            label={key}
                                                                            type="text"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            name={key}
                                                                            value={formData[key] || defaultValue}
                                                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                                                            required={true}
                                                                        />
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <ReactQuill
                                                                    theme="snow"
                                                                    value={v1.description}
                                                                    onChange={(content) => { handleEditorInputChange('description', content); }}
                                                                    modules={modules}
                                                                />
                                                            )}

                                                            {/* <button type="submit">Submit</button> */}
                                                        </form>
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
                                                                padding: '8px 0px'
                                                            }}
                                                        >
                                                        </FormHelperText>
                                                        <Typography>
                                                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleClosePaymentGatewayDialog} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
                                                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={savePaymentGateway} variant="outlined" style={{marginRight: '10px'}}>Save</Button>
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
        </div>
    );
};

export default PaymentGateway;