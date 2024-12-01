import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from '../../../components/PageTitleWrapper';
import {
    Grid,
    Container,
    Box,
    Breadcrumbs,
    Card,
    Dialog,
    DialogTitle,
    IconButton,
    Stack,
    TableContainer,
    Typography,
    useTheme,
    styled,
    Chip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useState, ChangeEvent, useEffect } from 'react';
import Loader1 from '../.././Loader';
import APIservice from 'src/utils/APIservice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../content/smallScreen.css';
import 'react-quill/dist/quill.snow.css';
// import './../manageCustomFields.css'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Tab } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
import './blogDetail.css'

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


const initialState = {
    id: 0,
    title: '',
    description: '',
    tags: [],
    authorName: '',
    image: '',
    publishDate: null,
};

const CustomFieldDetail = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isloading, setIsLoading] = useState(false);
    // const [customNotifications, setCustomNotifications] = React.useState<any[]>([]);
    let [blog, setBlog] = React.useState<any>([]);
    const [fieldName, setFieldName] = React.useState<any>('');

    let [credentail, setCredentail] = useState<any>();
    let [apiUrl, setApiUrl] = useState<any>();


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
                    loadjson();

                }
            } else {
                loadData();
                loadjson();

            }
        }

    }, []);

    const loadjson = async () => {
        let res = await fetch('/admin/variable.json'); // Adjust the file path as needed
        let url = await res.json();
        setApiUrl(url);
        apiUrl = url;
    }

    const loadData = async () => {
        await getdata();
    }

    const getdata = async () => {
        debugger
        try {

            setIsLoading(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                id: vId.id
            };
            const res = await APIservice.httpPost(
                '/api/admin/blog/getBlogDetail',
                obj,
                token,
                refreshToken
            );
            res.recordList[0].image =  res.recordList[0].image;
            
            res.recordList[0].publishDate = new Date(); // Or your date object
            res.recordList[0].formatedate = res.recordList[0].publishDate.toLocaleDateString('en-US'); // Specify locale (optional)
            
            // console.log(formattedDate)
            setBlog(res.recordList);

            if (res && res.status == 200) {
            } else if (res.status == 401) {
                navigate('/admin');
                localStorage.clear();
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
            // }
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
                <title>Blog</title>
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
                                        to="/admin/blog"
                                        style={{
                                            display: 'flex',
                                            color: 'black',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        Blog
                                    </Link>
                                    <Typography
                                        variant="subtitle2"
                                        color="inherit"
                                        fontWeight="bold"
                                    > Detail</Typography>
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
                            {/* <TabContext value={value}> */}
                                {/* <Box
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
                                </Box> */}
                                <Typography style={{ height: 'calc(-248px + 100vh)', overflowX: 'hidden', padding: '30px 13%', textAlign: 'justify' }}>
                                    {isloading ? (
                                        <Loader1 title="Loading..." />
                                    ) : (
                                        <>
                                            <TableContainer style={{overflowX: 'hidden'}}>
                                                {blog.map((ele: any, index: any) => (
                                                    <div key={index}>
                                                        <Grid container>
                                                            <Grid item xs={12} sm={12} md={12}>
                                                                {(ele.tags && ele.tags.length > 0) &&
                                                                    <Typography style={{ display: 'flex', flexWrap: 'wrap' }}>

                                                                        {ele.tags.map((value, index) => (
                                                                            <Typography
                                                                                key={index}
                                                                                style={{
                                                                                    // paddingLeft: '4%',
                                                                                    // paddingTop: '1.4%',
                                                                                    paddingBottom: '1.4%',
                                                                                    paddingRight: '1.4%',

                                                                                }}
                                                                            >
                                                                                <Chip
                                                                                    key={index}
                                                                                    label={value}
                                                                                >
                                                                                    {value}
                                                                                </Chip>
                                                                            </Typography>
                                                                        ))}
                                                                    </Typography>}
                                                                <h3 style={{fontWeight: '600', fontSize: '26px' , marginTop: '15px'}}>{ele.title}</h3>
                                                                <Typography className='author-name'>
                                                                    {ele.authorName &&
                                                                        <span>
                                                                            By&nbsp;{ele.authorName}
                                                                        </span>
                                                                    }
                                                                    {ele.publishDate &&
                                                                        <span>
                                                                            &nbsp;&nbsp;Publish on&nbsp;{ele.formatedate}
                                                                        </span>
                                                                    }

                                                                </Typography>

                                                                <Row>
                                                                    <Col xs={12} md={12}>
                                                                        <Typography style={{ height: '270px', width: 'auto', marginTop: '20px'  }}>
                                                                            {ele.image ? (
                                                                                <img
                                                                                    src={ele.image}
                                                                                    alt="notification Url"
                                                                                    style={{
                                                                                        height: '100%',
                                                                                        width: '100%',
                                                                                        objectFit: 'contain'
                                                                                        // borderRadius: '50%',
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <img
                                                                                    src="/dummy.png"
                                                                                    alt="notification Url"
                                                                                    style={{
                                                                                        height: '200px',
                                                                                        width: '200px'
                                                                                        // borderRadius: '50%',
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </Typography>
                                                                    </Col>
                                                                   
                                                                </Row>

                                                                <Row style={{marginTop: '40px'}}>
                                                                    <Typography dangerouslySetInnerHTML={{ __html: ele.description }} className='detail-description'/>
                                                                </Row>

                                                            </Grid>

                                                        </Grid>

                                                    </div>
                                                ))}
                                            </TableContainer>
                                        </>
                                    )}
                                </Typography>
                            {/* </TabContext> */}
                        </Card>

                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default CustomFieldDetail;