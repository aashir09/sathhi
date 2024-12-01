import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from '../../../components/PageTitleWrapper';
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
    InputLabel,
    Select,
    MenuItem,
    Chip
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useState, ChangeEvent, useEffect } from 'react';
import Loader1 from '../.././Loader';
import APIservice from 'src/utils/APIservice';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../content/smallScreen.css';
import 'react-quill/dist/quill.snow.css';
import { CardHeader, Col, FormGroup, Row } from 'react-bootstrap';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
// import './../manageCustomFields.css'
import DeleteIcon from '@mui/icons-material/Delete';
import { object } from 'prop-types';
import './CustomFieldDetail.css';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Tab } from '@mui/material';

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
    displayName: '',
    mappedFieldName: '',
    description: null,
    valueTypeId: 0,
    isRequired: false,
    allowInSearch: false,
    allowInFilter: false,
    allowIncompleteProfile: false,
    allowInPreferences: false,
    defaultValue: null,
    valueList: [],
    textLength: null,
    completeprofilesectioname: null
};

const CustomFieldDetail = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isloading, setIsLoading] = useState(false);
    // const [customNotifications, setCustomNotifications] = React.useState<any[]>([]);
    let [customField, setCustomField] = React.useState<any>([]);
    const [fieldName, setFieldName] = React.useState<any>('');


    let [credentail, setCredentail] = useState<any>();

    const [isReadPermission, setIsReadPermission] = useState(true);
    const [isWritePermission, setIsWritePermission] = useState(true);
    const [isEditPermission, setIsEditPermission] = useState(true);
    const [isDeletePermission, setIsDeletePermission] = useState(true);

    const vId = useParams();

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

    }, []);

    const loadData = async () => {
        await getdata();
    }

    const getdata = async () => {
        debugger
        try {
            // if (search) {
            //     const token = localStorage.getItem('SessionToken');
            //     const refreshToken = localStorage.getItem('RefreshToken');

            //     let obj = {
            //       id: vId.id
            //     };
            //     const res = await APIservice.httpPost(
            //         '/api/admin/manageCustomFields/getCustomfieldDetail',
            //         obj,
            //         token,
            //         refreshToken
            //     );
            //     setCustomFieldDeatil(res.recordList);
            //     setRow(res.totalRecords);
            //     for (let i = 0; i < customFieldDetail.length; i++) {
            //         customFieldDetail[i].valueList = customFieldDetail[i].valueList.join(', ')
            //     }
            // } else {
            setIsLoading(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                id: vId.id
            };
            const res = await APIservice.httpPost(
                '/api/admin/manageCustomFields/getCustomfieldDetail',
                obj,
                token,
                refreshToken
            );
            setCustomField(res.recordList);
            customField = res.recordList;
            if (customField[0].valueList !== null && customField[0].valueList !== '') {
                customField[0].valueList = customField[0].valueList.join(', ')
            }
            customField[0].defaultValue = customField[0].defaultValue.replace(/;/g, ',');
            setFieldName(customField[0].displayName)

            // for (let i = 0; i < customFieldDetail.length; i++) {
            //     customFieldDetail[i].valueList = customFieldDetail[i].valueList.join(', ')
            // }

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
            // }
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

    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
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
                <title>Custom Fields</title>
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
                                    <Link
                                        to="/admin/manage-custom-fields"
                                        style={{
                                            display: 'flex',
                                            color: 'black',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        Manage Custom Fields
                                    </Link>
                                    <Typography
                                        variant="subtitle2"
                                        color="inherit"
                                        fontWeight="bold"
                                    >
                                        {fieldName}
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

                        <Card className="religioncard" style={{ height: 'calc(100vh - 228px)' }}>
                            <TabContext value={value}>
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: 'divider',
                                        padding: '16px',
                                        paddingLeft: '16px',
                                        overflowX: 'auto'
                                    }}
                                >
                                    <TabList
                                        onChange={handleChange}
                                        aria-label="scrollable force tabs example"
                                        variant="scrollable"
                                    //  scrollButtons
                                    // allowScrollButtonsMobile
                                    >
                                        <Tab label="Detail" value="1" />

                                    </TabList>
                                </Box>
                                <TabPanel value='1'>
                                    {isloading ? (
                                        <Loader1 title="Loading..." />
                                    ) : (
                                        <>
                                            <TableContainer style={{ height: 'calc(100vh - 353px)', }}>
                                                {customField.map((field: any, index: any) => (
                                                    <div key={index}>
                                                        <h3 style={{ padding: '0px 0px 16px 0px', fontWeight:'600',fontSize:'24px' }}>{field.displayName}</h3>
                                                        <Grid container>
                                                            <Grid item xs={12} sm={12} md={12}>

                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Name</b>{' '}
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {field.name ? field.name : '--'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>

                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Diaply Name </b>{' '}
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {field.displayName ? field.displayName : '--'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                {' '}
                                                                                <b>mapped Field</b>{' '}
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {' '}
                                                                                {field.mappedFieldName ? field.mappedFieldName : '--'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Description </b>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {' '}
                                                                                {field.description ? field.description : '--'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Value Type</b>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {field.valueTypeName ? field.valueTypeName : '--'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Section</b>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {field.completeprofilesectioname ? field.completeprofilesectioname : '--'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Default Value</b>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {field.defaultValue ? field.defaultValue : '--'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Value List</b>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {field.valueList ? field.valueList : '--'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                <Typography gutterBottom variant="h6" >
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Is Required</b>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {(field.isRequired == 1) ? 'Yes' : 'No'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Allow in Filter</b>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {(field.allowInFilter == 1) ? 'Yes' : 'No'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Allow in Complete Profile</b>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {(field.allowIncompleteProfile == 1) ? 'Yes' : 'No'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Allow In Preferences</b>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {(field.allowInPreferences == 1) ? 'Yes' : 'No'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={3} md={3}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                <b>Allow In Search</b>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={9} md={9}>
                                                                            <Box>
                                                                                {(field.allowInSearch == 1) ? 'Yes' : 'No'}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>

                                                            </Grid>
                                                            {/* <Grid item xs={12} sm={6} md={6}>
                                                    <Box style={{ padding: '16px' }}>
                                                       
                                                    </Box>
                                                </Grid> */}
                                                        </Grid>

                                                        {/* <Grid item xs={12} sm={6} md={6}>
                                                <Box style={{ padding: '16px' }}>
                                                    <Typography gutterBottom variant="h6">
                                                        <Box display="flex" alignItems="flex-start">
                                                            <b>User Wallet Amount </b>
                                                            <Box sx={{ pl: 2.2 }}>
                                                                ₹ {user.userWalletAmount
                                                                    ? user.userWalletAmount
                                                                    : '0.00'}
                                                            </Box>
                                                        </Box>
                                                    </Typography>
                                                </Box>
                                            </Grid> */}

                                                    </div>
                                                ))}
                                            </TableContainer>
                                        </>
                                    )}
                                </TabPanel>
                            </TabContext>
                        </Card>

                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default CustomFieldDetail;