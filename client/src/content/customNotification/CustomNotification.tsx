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
    Paper
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent, useEffect } from 'react';
import Loader1 from '../Loader';
import APIservice from 'src/utils/APIservice';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../content/smallScreen.css';
import 'react-quill/dist/quill.snow.css';
import { FormGroup } from 'react-bootstrap';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1)
    },
    '& .MuiPaper-root': {
        height: '700px'
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
    title: '',
    description: null,
    isSend: false,
    imageUrl: null,
    sendCount: 0
};

const CustomNotification = () => {
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

    const [customNotifications, setCustomNotifications] = React.useState<any[]>([]);
    const [isNameError, setIsNameError] = useState(false);
    const [NameErrorMsg, setNameErrorMsg] = useState('');
    const [isTitleError, setIsTitleError] = useState(false);
    const [TitleErrorMsg, setTitleErrorMsg] = useState('');
    const [isDescriptionError, setIsDescriptionError] = useState(false);
    const [DescriptionErrorMsg, setDescriptionErrorMsg] = useState('');
    const [image, setImage] = React.useState('');
    let [credentail, setCredentail] = useState<any>();

    const [isReadPermission, setIsReadPermission] = useState(true);
    const [isWritePermission, setIsWritePermission] = useState(true);
    const [isEditPermission, setIsEditPermission] = useState(true);
    const [isDeletePermission, setIsDeletePermission] = useState(true);

    const [isConfirmNotification, setConfirmNotification] = useState(false);
 const [isNotificationConfirmation, setIsNotificationConfirmationDialog] = useState(false);

    const [apiUrl, setApiUrl] = useState<any>();


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
                        getdata(page, limit);
                }
            } else {
                getdata(page, limit);
                loadjson();
            }
        }

    }, []);

    const loadjson = async () => {
        let res = await fetch('/admin/variable.json'); // Adjust the file path as needed
        let url = await res.json();
        setApiUrl(url);
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
                    '/api/admin/customNotification/getCustomNotification',
                    obj,
                    token,
                    refreshToken
                );
                setCustomNotifications(res.recordList);
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
                    '/api/admin/customNotification/getCustomNotification',
                    obj,
                    token,
                    refreshToken
                );
                setCustomNotifications(res.recordList);
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

    const handleClickOpenAdd = async () => {
        setV1(initialState);
        setIsOpen(true);
        setIsNameError(false);
        setNameErrorMsg('');
        setIsTitleError(false);
        setTitleErrorMsg('');
        setIsDescriptionError(false);
        setDescriptionErrorMsg('');
        setImage('');
    };

    const handleSwitch = async (id: number, status: number) => {
        let obj = {
            id: id,
            status: status
        };
        setV1(obj);
        setIsCheck(true);
    };

    const handleSwitchCheck = async () => {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
            id: v1.id
        };
        const res = await APIservice.httpPost(
            '/api/admin/customNotification/activeInactiveCustomNotification',
            obj,
            token,
            refreshToken
        );
        setIsCheck(false);
        getdata(page * limit, limit);
    };

    const handleClose = () => {
        setIsCheck(false);
    };

    const handleClickResend = async (obj: any) => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            const res = await APIservice.httpPost(
                '/api/admin/customNotification/sendCustomNotification',
                { "id": obj.id },
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
            }
            setIsLoading(false);

        } catch (error: any) {
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

    const handleClickOpenEdit = (obj: any) => {
        if (obj.imageUrl) setImage( obj.imageUrl);
        else setImage('');
        setV1(obj);
        setIsOpen(true);
        setIsNameError(false);
        setNameErrorMsg('');
        setIsTitleError(false);
        setTitleErrorMsg('');
        setIsDescriptionError(false);
        setDescriptionErrorMsg('');
    }

    const handleCloseCustomNotificationDialog = () => {
        setIsOpen(false);
    };

    const handleInputChange = (arr: any) => {
        const { name, value } = arr.target;
        setV1({ ...v1, [name]: value });
        setIsOpen(true);
    };

    const validateName = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsNameError(false);
            setNameErrorMsg('');
        } else {
            setIsNameError(true);
            setNameErrorMsg('Custom Notification Name is required');
        }
    };
    const validateTitle = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsTitleError(false);
            setTitleErrorMsg('');
        } else {
            setIsTitleError(true);
            setTitleErrorMsg('Custom Notification Title is required');
        }
    };
    const validateDescription = (arr) => {
        let value = arr;
        if (value) {
            setIsDescriptionError(false);
            setDescriptionErrorMsg('');
        } else {
            setIsDescriptionError(true);
            setDescriptionErrorMsg('Custom Notification Description is required');
        }
    };

    const validateForm = (e: any) => {
        e.preventDefault();
        var flag = true;
        if (!v1.name) {
            setIsNameError(true);
            setNameErrorMsg('Custom Notification Name is required');
            flag = false;
        } else {
            setIsNameError(false);
            setNameErrorMsg('');
            // flag = true;
        }
        if (!v1.description) {
            setIsDescriptionError(true);
            setDescriptionErrorMsg('Custom Description is required');
            flag = false;
        } else {
            setIsDescriptionError(false);
            setDescriptionErrorMsg('');
            // flag = true;
        }
        if (!v1.title) {
            setIsTitleError(true);
            setTitleErrorMsg('Custom Notification Title is required');
            flag = false;
        } else {
            setIsTitleError(false);
            setTitleErrorMsg('');
            // flag = true;
        }
        if(!flag){
            setConfirmNotification(false)
        }
        return flag;
    };

    const handleDescriptionChange = (dateVal: string) => {
        setV1({ ...v1, "description": dateVal });
    }

    const onFileChange = (e: any) => {
        const file = e.target.files[0];
        const name = e.target.name;
        const reader = new FileReader();

        reader.onload = () => {
            setImage(reader.result.toString());
            setV1({
                ...v1,
                [name]: reader.result.toString()
            });
        };
        reader.readAsDataURL(file);
    };

    const onImageChange = (e: any) => {
        const { name, value } = e.target;
        setV1({
            ...v1,
            [name]: value
        });
    };

    const handleConfirmationNotification = (element: any) => {
        debugger
        setConfirmNotification(true);
    };

    const handleConfirmNotificationClose = () => {
        debugger
        setIsNotificationConfirmationDialog(false);
        setConfirmNotification(false);
      }

   

    const saveCustomNotification = async (e: any, isSend: boolean) => {
        var flag = validateForm(e);
        if (flag) {
            try {
                setIsLoading(true);
                v1.imageUrl = v1.imageUrl ? v1.imageUrl : null;
                if (v1.id) {
                    const token = localStorage.getItem('SessionToken');
                    const refreshToken = localStorage.getItem('RefreshToken');
                    let val = v1; let pckgs = [];
                    val.isActive = v1.isActive == 1 ? true : false;
                    val.isDelete = v1.isDelete == 1 ? true : false;
                    val.isSend = isSend;
                    const res = await APIservice.httpPost(
                        '/api/admin/customNotification/insertUpdateCustomNotification',
                        val,
                        token,
                        refreshToken
                    );
                    if (res && res.status == 200) {
                        setConfirmNotification(false);
                        setIsOpen(false);
                        getdata(page * limit, limit);
                    } else if (res.status == 401) {
                        navigate('/admin');
                        localStorage.clear();
                    } else if (res.status == 500) {
                        setConfirmNotification(false);
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
                        setConfirmNotification(false);
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
                        setConfirmNotification(false);
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
                        setConfirmNotification(false);
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
                } else {
                    const token = localStorage.getItem('SessionToken');
                    const refreshToken = localStorage.getItem('RefreshToken');
                    let val = v1;
                    val.isSend = isSend;
                    const res = await APIservice.httpPost(
                        '/api/admin/customNotification/insertUpdateCustomNotification',
                        val,
                        token,
                        refreshToken
                    );
                    if (res && res.status == 200) {
                        setPage(0);
                        setConfirmNotification(false);
                        setIsOpen(false);
                        getdata(0, limit);
                    } else if (res.status == 401) {
                        navigate('/admin');
                        localStorage.clear();
                    } else if (res.status == 500) {
                        setConfirmNotification(false);
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
                        setConfirmNotification(false);
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
                        setConfirmNotification(false);
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
                        setConfirmNotification(false);
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
                }
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                setConfirmNotification(false);
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
                <title>Custom Notification</title>
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
                                        Custom Notification
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1.5}>
                                {isWritePermission ? <>
                                    <Grid item>
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
                                            onClick={handleClickOpenAdd}
                                            size="small"
                                        >
                                            <AddTwoToneIcon fontSize="small" />
                                            Create Custom Notification
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
                                            onClick={handleClickOpenAdd}
                                            size="small"
                                        >
                                            <AddTwoToneIcon fontSize="small" />
                                        </Button>
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
                                </> : <></>}

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
                                            {customNotifications && customNotifications.length > 0 ? (
                                                <>
                                                    <TableContainer className="religiontableContainer">
                                                        <Table stickyHeader>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell colSpan={1}>
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
                                                                    <TableCell colSpan={1}>
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
                                                                    <TableCell colSpan={1}>
                                                                        <Typography
                                                                            noWrap
                                                                            style={{
                                                                                fontSize: '13px',
                                                                                fontWeight: 'bold',
                                                                                marginBottom: 'none'
                                                                            }}
                                                                        >
                                                                            Title
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell colSpan={3}>
                                                                        <Typography
                                                                            noWrap
                                                                            style={{
                                                                                fontSize: '13px',
                                                                                fontWeight: 'bold',
                                                                                marginBottom: 'none'
                                                                            }}
                                                                        >
                                                                            Description
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align="right" colSpan={1}>
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
                                                                {customNotifications.map((arr: any, index: number) => {
                                                                    return (
                                                                        <TableRow hover key={arr.id}>
                                                                            <TableCell colSpan={1} >
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
                                                                            <TableCell colSpan={1} >
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
                                                                            <TableCell colSpan={1} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {arr.title}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell colSpan={3} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize', width: '250px' }}
                                                                                >
                                                                                    {arr.description}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell colSpan={1}
                                                                                align="right"
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
                                                                                                    handleClickOpenEdit(arr)
                                                                                                }
                                                                                                data-toggle="modal"
                                                                                                data-target="#exampleModal"
                                                                                            >
                                                                                                <EditTwoToneIcon fontSize="small" />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                        <Tooltip title="Send" arrow>
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
                                                                                                    handleClickResend(arr)
                                                                                                }
                                                                                            >
                                                                                                <ForwardToInboxIcon fontSize="small" />
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
                                                        <Button onClick={handleClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                                        <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchCheck} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>

                                            <div>
                                                <BootstrapDialog
                                                    open={isOpen}
                                                    onClose={handleCloseCustomNotificationDialog}
                                                    PaperProps={{ sx: { height: '40%' } }}
                                                    fullWidth
                                                    maxWidth="md"
                                                >
                                                    <BootstrapDialogTitle
                                                        id="customized-dialog-title"
                                                        onClose={handleCloseCustomNotificationDialog}
                                                    >
                                                        {v1.id ? 'Edit Custom Notification' : 'Add Custom Notification'}
                                                    </BootstrapDialogTitle>
                                                    <DialogContent dividers>
                                                        <div style={{ textAlign: "center" }}>
                                                            <FormGroup
                                                                style={{
                                                                    alignItems: 'center',
                                                                    marginBottom: '10px'
                                                                }}
                                                            >
                                                                <input
                                                                    style={{
                                                                        display: 'none'
                                                                    }}
                                                                    id="icon-button-file"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    name="imageUrl"
                                                                    onChange={(e) => {
                                                                        onFileChange(e);
                                                                    }}
                                                                    className="upload-button"
                                                                />
                                                                <label htmlFor="icon-button-file">
                                                                    {image ? (
                                                                        <img
                                                                            src={image}
                                                                            alt="notification Url"
                                                                            style={{
                                                                                height: '120px',
                                                                                width: 'auto'
                                                                                // borderRadius: '50%',
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src="/dummy.png"
                                                                            alt="notification Url"
                                                                            style={{
                                                                                height: '100px',
                                                                                width: '100px'
                                                                                // borderRadius: '50%',
                                                                            }}
                                                                        />
                                                                    )}
                                                                </label>
                                                            </FormGroup>
                                                        </div>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="name"
                                                            label="Custom Notification Name"
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
                                                        {/* </Grid> */}
                                                        {/* <Grid item xs={12}> */}
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="name"
                                                            label="Custom Notification Title"
                                                            type="text"
                                                            fullWidth
                                                            variant="outlined"
                                                            name="title"
                                                            value={v1.title}
                                                            onChange={(arr) => {
                                                                handleInputChange(arr);
                                                                validateTitle(arr);
                                                            }}
                                                            required={true}
                                                        />
                                                        <FormHelperText
                                                            style={{ color: 'red', height: '22px' }}
                                                        >
                                                            {isTitleError && TitleErrorMsg}
                                                        </FormHelperText>
                                                        <TextField
                                                            id="outlined-multiline-static"
                                                            label="Description"
                                                            multiline
                                                            fullWidth
                                                            rows={4}
                                                            defaultValue=""
                                                            value={v1.description}
                                                            name="description"
                                                            onChange={(arr) => {
                                                                handleInputChange(arr);
                                                                validateDescription(arr);
                                                            }}
                                                            required={true}
                                                        />
                                                        <FormHelperText
                                                            style={{ color: 'red', height: '22px' }}
                                                        >
                                                            {isDescriptionError && DescriptionErrorMsg}
                                                        </FormHelperText>
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
                                                            <Typography>
                                                                <Button onClick={handleCloseCustomNotificationDialog} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                                                {/* <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => { saveCustomNotification(e, true) }} variant="outlined" style={{ marginRight: '10px' }}>Send & Save</Button> */}
                                                                <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => { handleConfirmationNotification(e) }} variant="outlined" style={{ marginRight: '10px' }}>Send & Save</Button>
                                                                <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => { saveCustomNotification(e, false) }} variant="outlined" style={{ marginRight: '10px' }}>Save</Button>

                                                            </Typography>

                                                        </div>
                                                    </Box>
                                                </BootstrapDialog>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Card>
                            <div>
                                <Dialog
                                    open={isConfirmNotification}
                                    onClose={handleConfirmNotificationClose}
                                    fullWidth
                                    maxWidth="xs"
                                >
                                    <DialogTitle
                                        sx={{
                                            m: 0,
                                            p: 2,
                                            fontSize: '16px',
                                            fontWeight: 'bolder',
                                            // borderBottom: '1px solid #ddd'
                                        }}
                                    >
                                        Are you sure you want to send and save this notification?
                                    </DialogTitle>
                                    <DialogContent>


                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleConfirmNotificationClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                        <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => {
                                            saveCustomNotification(e,true)
                                        }} variant="outlined" style={{ marginRight: '10px' }}>Save And Send</Button>
                                        
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default CustomNotification;