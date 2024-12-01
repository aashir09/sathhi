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
    Paper,
    Chip,
    Avatar
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Footer from 'src/components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent, useRef } from 'react';
import APIservice from 'src/utils/APIservice';
import Loader1 from '../Loader';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../smallScreen.css';
import { string } from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './blog.css'
import { Col, FormGroup, Row } from 'react-bootstrap';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Resizer from 'react-image-file-resizer';
import { format } from 'date-fns';


const modules = {
    toolbar: {
        container: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            ['link', 'image', 'video', 'formula'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean']
        ],
    },
};



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1)
    },
    '& .MuiPaper-root': {
        height: '890px'
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
    title: '',
    description: '',
    tags: [],
    authorName: '',
    image: '',
    publishDate: '',

};

function Blog() {

    let [search, setSearch] = useState('');
    const navigate = useNavigate();
    let [credentail, setCredentail] = useState<any>();
    const [v1, setV1] = React.useState<any>(initialState);
    const [blogs, setBlogs] = useState<any>([]);
    const [isOpen, setIsOpen] = React.useState(false);
    let [coverImage, setCoverImage] = React.useState('');
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [row, setRow] = useState<number>(10);
    const [ischeck, setIsCheck] = useState(false);
    const [isdelete, setIsDelete] = useState(false);


    const [isTitleError, setIsTitleError] = useState(false);
    const [titleErrorMsg, setTitleErrorMsg] = useState('');
    const [isDescriptionError, setIsDescriptionError] = useState(false);
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState('');
    const [isTagsError, setIsTagsError] = useState(false);
    const [tagsErrorMsg, setTagsErrorMsg] = useState('');
    const [isImageError, setIsImageError] = useState(false);
    const [imageErrorMsg, setImageErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    let [singleTag, setSingleTag] = useState('')
    let [arrayTags, setArrayTags] = useState<any>([]);
    let [apiUrl, setApiUrl] = useState<any>();

    const [isReadPermission, setIsReadPermission] = useState(true);
    const [isWritePermission, setIsWritePermission] = useState(true);
    const [isEditPermission, setIsEditPermission] = useState(true);
    const [isDeletePermission, setIsDeletePermission] = useState(true);

    let dateFormat: any = "MM/dd/yyyy";
    if (sessionStorage.getItem("DateFormat")) {
        let storedDateFormat: any = sessionStorage.getItem("DateFormat");
        dateFormat = JSON.parse(storedDateFormat);
    }



    // window.onpopstate = () => {
    //   navigate(-1);
    // }

    const editor = useRef(null);

    React.useEffect(() => {
        debugger
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
                    loadjson()
                }
            } else {
                loadData();
                loadjson()
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
        await getData(page, limit);
        setIsOpen(false);
    }

    const getData = async (startIndex: number, fetchRecord: number) => {
        try {
            if (search) {
                const token = localStorage.getItem('SessionToken');
                const refreshToken = localStorage.getItem('RefreshToken');
                let obj = {
                    startIndex: startIndex,
                    fetchRecord: fetchRecord,
                    name: search ? search : ''
                };
                const res = await APIservice.httpPost(
                    '/api/admin/blog/getBlogs',
                    obj,
                    token,
                    refreshToken
                );
                if (res.recordList && res.recordList.length > 0) {
                    for (let i = 0; i < res.recordList.length; i++) {
                        // res.recordList[i].image =  res.recordList[i].image
                        // res.recordList[i].publishDate = new Date(); // Or your date object
                        res.recordList[i].formatdate = new Date(res.recordList[i].publishDate).toLocaleDateString('en-US');
                    }
                }
                setBlogs(res.recordList);
                setRow(res.totalRecords);
                if (res && res.status == 200) {
                    setIsOpen(false);
                } else if (res.status == 401) {
                    localStorage.clear();
                    navigate('/admin');
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
                }
                setIsLoading(false);
            } else {
                setIsLoading(true);
                const token = localStorage.getItem('SessionToken');
                const refreshToken = localStorage.getItem('RefreshToken');
                let obj = {
                    startIndex: startIndex,
                    fetchRecord: fetchRecord
                };
                const res = await APIservice.httpPost(
                    '/api/admin/blog/getBlogs',
                    obj,
                    token,
                    refreshToken
                );

                if (res.recordList && res.recordList.length > 0) {
                    for (let i = 0; i < res.recordList.length; i++) {
                        // res.recordList[i].image =  res.recordList[i].image
                        res.recordList[i].formatdate = new Date(res.recordList[i].publishDate).toLocaleDateString('en-US');
                    }
                }

                setBlogs(res.recordList);
                setRow(res.totalRecords);
                if (res && res.status == 200) {
                    setIsOpen(false);
                } else if (res.status == 401) {
                    localStorage.clear();
                    navigate('/admin');
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
                }
                setIsLoading(false);
            }
        } catch (error) {
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
            setIsLoading(false);
        }
    };


    const validateDescription = (arr) => {
        // const { name, value } = arr.target;
        if (arr) {
            setIsDescriptionError(false);
            setDescriptionErrorMsg('');
        } else {
            setIsDescriptionError(true);
            setDescriptionErrorMsg('Description is required');
        }
    };

    const validateTitle = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsTitleError(false);
            setTitleErrorMsg('');
        } else {
            setIsTitleError(true);
            setTitleErrorMsg('Title is required');
        }
    }

    const ValidateImage = (arr: any) => {
        if (arr.target.value) {
            setIsImageError(false);
            setImageErrorMsg('');
        } else {
            setIsImageError(true);
            setImageErrorMsg('Image is required');
        }
    };

    const validateTags = (arr) => {
        let value = arr;
        if (value) {
            setIsTagsError(false);
            setTagsErrorMsg('');
        } else {
            setIsTagsError(true);
            setTagsErrorMsg('Tag is required');
        }
    };

    const setValidateFromValue = (dateVal: Date) => {

        setV1({ ...v1, "publishDate": dateVal });
    }

    const handleChange = (e: any) => {
        debugger
        const { name, value } = e.target;
        setV1({
            ...v1,
            [name]: value
        });
        setIsOpen(true);
    };

    const handleDescriptionChange = (value) => {
        setV1({ ...v1, description: value });
        console.log(v1)
    };

    const reg = new RegExp('^[a-zA-Z0-9 ]+$');
    const handleAddTags = () => {
        if (reg.test(singleTag)) {
            if (singleTag.trim() !== '') {
                arrayTags = arrayTags ? [...arrayTags] : []
                arrayTags.push(singleTag);
                setArrayTags(arrayTags);
                setSingleTag('');
                console.log(arrayTags)
            }
        }
        else {
            setIsTagsError(true);
            setTagsErrorMsg('Value is invalid.');
        }

    };

    const handleDeleteTags = (indexToRemove) => {
        arrayTags = arrayTags.filter((_, index) => index !== indexToRemove);
        setArrayTags(arrayTags);
        // v1.valueList = arrayValueList
    };

    const handleTagsInputChange = (arr: any) => {
        const { name, value } = arr.target;
        setSingleTag(value);
        setIsOpen(true);
    };

    const onFileChange = (e: any) => {
        const file = e.target.files[0];
        const name = e.target.name;
        const reader = new FileReader();

        reader.onload = () => {
            setCoverImage(reader.result.toString());
            setV1({
                ...v1,
                [name]: reader.result.toString()
            });
        };
        reader.readAsDataURL(file);
    };


    // const onImageChange = (e: any) => {
    //     const { name, value } = e.target;
    //     setV1({
    //         ...v1,
    //         [name]: value
    //     });
    // };

    const handleClickisAdd = async () => {
        setV1(initialState);
        setCoverImage('')
        setIsOpen(true);
        setIsTitleError(false);
        setTitleErrorMsg('');
        setIsImageError(false);
        setImageErrorMsg('');
        setIsDescriptionError(false);
        setDescriptionErrorMsg('');
        setIsTagsError(false);
        setTagsErrorMsg('');
        setSingleTag('');
        setArrayTags([]);
    };

    const handleClickOpenEdit = (obj: any) => {
        debugger
        if (obj.image) {
            setCoverImage( obj.image);
        } else {
            setCoverImage('');
        }

        if (obj.tags && typeof obj.tags === 'string') {
            const valueArray: string[] = obj.tags.includes(';') ? obj.tags.split(';') : [obj.tags];
            obj.tags = valueArray;
        }
        setArrayTags(obj.tags)

        setV1(obj);
        console.log(v1)
        setIsOpen(true);
        setIsTitleError(false);
        setTitleErrorMsg('');
        setIsImageError(false);
        setImageErrorMsg('');
        setIsDescriptionError(false);
        setDescriptionErrorMsg('');
        setIsTagsError(false);
        setTagsErrorMsg('');
    }

    const handleCloseBlogDailog = () => {
        setIsOpen(false);
    };

    const validateForm = (e: any) => {
        e.preventDefault();
        var flag = true;
        if (!v1.title) {
            setIsTitleError(true);
            setTitleErrorMsg('Title is required');
            flag = false;
        } else {
            setIsTitleError(false);
            setTitleErrorMsg('');
        }
        if (!v1.description) {
            setIsDescriptionError(true);
            setDescriptionErrorMsg('Description is required');
            flag = false;
        } else {
            setIsDescriptionError(false);
            setDescriptionErrorMsg('');
        }
        if (!v1.image) {
            setIsImageError(true);
            setImageErrorMsg('Image is required');
            flag = false;
        } else {
            setIsImageError(false);
            setImageErrorMsg('');
        }


        if (v1.tags && v1.tags.length == 0) {
            setIsTagsError(true);
            setTagsErrorMsg('Value list is required');
            flag = false;
        } else {
            setIsTagsError(false);
            setTagsErrorMsg('');
        }

        return flag;
    };


    const saveBlog = async (e: any) => {
        debugger
        v1.tags = arrayTags ? arrayTags : null;

        var flag = validateForm(e);
        if (flag) {
            try {
                setIsLoading(true);
                v1.image = v1.image ? v1.image : null;
                v1.publishDate = v1.publishDate ? v1.publishDate : null;
                v1.authorName = v1.authorName ? v1.authorName : null;
                if (v1.id) {
                    const token = localStorage.getItem('SessionToken');
                    const refreshToken = localStorage.getItem('RefreshToken');
                    let val = v1;
                    val.isActive = v1.isActive == 1 ? true : false;
                    val.isDelete = v1.isDelete == 1 ? true : false;
                    const res = await APIservice.httpPost(
                        '/api/admin/blog/updateBlog',
                        val,
                        token,
                        refreshToken
                    );
                    if (res && res.status == 200) {
                        setIsOpen(false);
                        getData(page * limit, limit);
                        toast.success("Blog Updated Successfully.", {
                            autoClose: 6000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'colored',
                            position: toast.POSITION.TOP_RIGHT
                        });
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
                } else {
                    const token = localStorage.getItem('SessionToken');
                    const refreshToken = localStorage.getItem('RefreshToken');
                    let val = v1;
                    const res = await APIservice.httpPost(
                        '/api/admin/blog/insertBlog',
                        val,
                        token,
                        refreshToken
                    );
                    if (res && res.status == 200) {
                        setPage(0);
                        setIsOpen(false);
                        getData(0, limit);
                        toast.success("Blog Added Successfully.", {
                            autoClose: 6000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'colored',
                            position: toast.POSITION.TOP_RIGHT
                        });
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
            '/api/admin/blog/activeInactiveBlog',
            obj,
            token,
            refreshToken
        );
        setIsCheck(false);
        getData(page * limit, limit);
    };

    const handleDelete = async (id: number) => {
        let obj = {
            id: id
        };
        setV1(obj);
        setIsDelete(true);
    };

    const handleDeleteCheck = async () => {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
            id: v1.id
        };
        const res = await APIservice.httpPost(
            '/api/admin/blog/deleteBlog',
            obj,
            token,
            refreshToken
        );
        setIsDelete(false);
        getData(page * limit, limit);
    };

    const handleClose = () => {
        setIsCheck(false);
        setIsDelete(false)
    };

    const searchData = (e) => {
        setSearch(e.target.value);
        search = e.target.value;
        getData(page, limit);
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

    const handleClickVisible = (element: any) => {
        let id = element?.id;
        navigate(`/admin/blog/view/${id}`);
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
                                    <Typography
                                        color="inherit"
                                        variant="subtitle2"
                                        fontWeight="bold"
                                    >
                                        Blog
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
                                            Create Blog
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
                        </Grid>
                    </Grid>
                </Box>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid>
                    <Grid>
                        <>
                            <Card className="communitycard">
                                <div>
                                    {isLoading ? (
                                        <Loader1 title="Loading..." />
                                    ) : (
                                        <>
                                            <Divider />
                                            {blogs && blogs.length > 0 ? (
                                                <>
                                                    <TableContainer className="communitytableContainer">
                                                        {/* <Table stickyHeader>
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
                                                                            Title
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
                                                                            Tags
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
                                                                            Author Name
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
                                                                {blogs.map((arr: any, index: number) => {
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
                                                                                    {arr.title}
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
                                                                                    {arr.tagNames}
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
                                                                                    {arr.authorName ? arr.authorName : "--"}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell colSpan={1}
                                                                                align="right"
                                                                            >
                                                                                  <Tooltip title="View" arrow>
                                                                                    <IconButton
                                                                                        sx={{
                                                                                            '&:hover': {
                                                                                                background:
                                                                                                    theme.colors.error.lighter
                                                                                            },
                                                                                            color: theme.palette.primary.main
                                                                                        }}
                                                                                        color="inherit"
                                                                                        size="small"
                                                                                        onClick={(e) => {
                                                                                            handleClickVisible(arr);
                                                                                        }}
                                                                                    >
                                                                                        <VisibilityIcon />
                                                                                    </IconButton>
                                                                                </Tooltip>
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
                                                                                        <Tooltip title="Delete" arrow>
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
                                                                                                    handleDelete(arr.id)
                                                                                                }
                                                                                                data-toggle="modal"
                                                                                                data-target="#exampleModal"
                                                                                            >
                                                                                                <DeleteIcon fontSize="small" />
                                                                                            </IconButton>
                                                                                        </Tooltip>

                                                                                    </> : <></>}

                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table> */}
                                                        {/* <Table stickyHeader> */}

                                                        <Row style={{ padding: '25px', width: '100%' }}>
                                                            {blogs.map((arr: any, index: number) => {
                                                                return (
                                                                    <Col hover key={index} sm={12} md={4} style={{ marginBottom: '25px' }}>
                                                                        <Card className='blogCard'>
                                                                            <Typography className='chip-container'>
                                                                                <Chip
                                                                                    label={arr.tags[0]}
                                                                                >
                                                                                    {arr.tags[0]}
                                                                                </Chip>
                                                                            </Typography>
                                                                            <Typography style={{ height: '150px', width: 'auto' }}>
                                                                                {arr.image ? (
                                                                                    <img
                                                                                        src={ arr.image}
                                                                                        alt="blog Url"
                                                                                        style={{
                                                                                            height: '100%',
                                                                                            width: '100%',
                                                                                            objectFit: 'cover'
                                                                                            // borderRadius: '50%',
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <img
                                                                                        src="/dummy.png"
                                                                                        alt="notification Url"
                                                                                        style={{
                                                                                            height: '100%',
                                                                                            width: '100%'
                                                                                            // borderRadius: '50%',
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Typography>
                                                                            <Grid style={{ padding: '13px 0px' }}>
                                                                                <h6>{arr.title}</h6>
                                                                                <Typography className='detail'>
                                                                                    {arr.authorName &&
                                                                                        <span>
                                                                                            &nbsp;{arr.authorName}
                                                                                        </span>
                                                                                    }
                                                                                    {arr.publishDate &&
                                                                                        <span>
                                                                                            {/* &nbsp;&nbsp;{arr.formatdate} */}
                                                                                            &nbsp;&nbsp;{arr.publishDate ? format(new Date(arr.publishDate), dateFormat) : '--'}


                                                                                        </span>
                                                                                    }

                                                                                </Typography>
                                                                                <Typography className='description' dangerouslySetInnerHTML={{ __html: arr.description }} />
                                                                                <Typography style={{ color: 'grey', cursor: 'pointer' }} onClick={(e) => {
                                                                                    handleClickVisible(arr);
                                                                                }}>Read More...</Typography>
                                                                                <Typography className='icon-container'>
                                                                                    {/* <Tooltip title="View" arrow>
                                                                                            <IconButton
                                                                                                sx={{
                                                                                                    '&:hover': {
                                                                                                        background:
                                                                                                            theme.colors.error.lighter
                                                                                                    },
                                                                                                    color: theme.palette.primary.main
                                                                                                }}
                                                                                                color="inherit"
                                                                                                size="small"
                                                                                                onClick={(e) => {
                                                                                                    handleClickVisible(arr);
                                                                                                }}
                                                                                            >
                                                                                                <VisibilityIcon />
                                                                                            </IconButton>
                                                                                        </Tooltip> */}
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
                                                                                            <Tooltip title="Delete" arrow>
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
                                                                                                        handleDelete(arr.id)
                                                                                                    }
                                                                                                    data-toggle="modal"
                                                                                                    data-target="#exampleModal"
                                                                                                >
                                                                                                    <DeleteIcon fontSize="small" />
                                                                                                </IconButton>
                                                                                            </Tooltip>

                                                                                        </> : <></>}

                                                                                </Typography>
                                                                            </Grid>

                                                                        </Card>
                                                                    </Col>
                                                                );
                                                            })}
                                                        </Row>
                                                        {/* </Table> */}
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
                                                    className="communitycard"
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
                                <BootstrapDialog
                                    open={isOpen}
                                    onClose={handleCloseBlogDailog}
                                    PaperProps={{ sx: { height: '40%' } }}
                                    fullWidth
                                    maxWidth="lg"
                                >
                                    <BootstrapDialogTitle
                                        id="customized-dialog-title"
                                        onClose={handleCloseBlogDailog}
                                    >
                                        {v1.id ? 'Edit Blod' : 'Add Blog'}
                                    </BootstrapDialogTitle>


                                    <DialogContent dividers>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <FormGroup style={{ alignItems: 'center' }}>
                                                    <Typography>Cover Image:</Typography>
                                                    <input
                                                        style={{
                                                            display: 'none'
                                                        }}
                                                        id="icon-button-file"
                                                        type="file"
                                                        accept="image/*"
                                                        name="image"
                                                        // value={occupation.imageUrl}
                                                        onChange={(e) => {
                                                            onFileChange(e);
                                                            // onImageChange(e);
                                                            ValidateImage(e);
                                                        }}
                                                    ></input>
                                                    <label htmlFor="icon-button-file" style={{ cursor: 'pointer' }}>
                                                        {coverImage ? (
                                                            <img
                                                                src={coverImage}
                                                                style={{
                                                                    height: '120px',
                                                                    width: 'auto'
                                                                    // borderRadius: '50%',
                                                                }}
                                                            />
                                                        ) : (
                                                            <img
                                                                src="/dummy.png"
                                                                style={{
                                                                    height: '100px',
                                                                    width: '100px'
                                                                    // borderRadius: '50%',
                                                                }}
                                                            />
                                                        )}
                                                    </label>
                                                </FormGroup>
                                                <FormHelperText style={{ color: 'red', height: '22px' }}>
                                                    {isImageError && imageErrorMsg}
                                                </FormHelperText>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="title"
                                                    label="Title"
                                                    type="text"
                                                    fullWidth
                                                    variant="outlined"
                                                    name="title"
                                                    value={v1.title}
                                                    onChange={(arr) => {
                                                        handleChange(arr);
                                                        validateTitle(arr);
                                                    }}
                                                    required={true}
                                                />
                                                <FormHelperText
                                                    style={{ color: 'red', height: '22px' }}
                                                >
                                                    {isTitleError && titleErrorMsg}
                                                </FormHelperText>


                                            </Col>
                                        </Row>
                                        <FormControl fullWidth>
                                            <label>Description:</label>
                                            <div>
                                                <ReactQuill
                                                    theme="snow" // Specify the theme (optional)
                                                    value={v1.description}
                                                    onChange={(arr) => {
                                                        handleDescriptionChange(arr);
                                                        validateDescription(arr);
                                                    }}
                                                    modules={modules}
                                                />
                                            </div>

                                            <FormHelperText style={{ color: 'red', height: '22px' }}>
                                                {isDescriptionError && descriptionErrorMsg}
                                            </FormHelperText>
                                        </FormControl>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="authorname"
                                                    label="AuthorName"
                                                    type="text"
                                                    fullWidth
                                                    variant="outlined"
                                                    name="authorName"
                                                    value={v1.authorName}
                                                    onChange={(arr) => {
                                                        handleChange(arr);
                                                    }}
                                                    required={true}
                                                />

                                            </Col>
                                            <Col xs={12} md={6} style={{ paddingTop: "8px" }}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns} >
                                                    <DatePicker
                                                        label="Publish Date"
                                                        openTo="day"
                                                        views={['year', 'month', 'day']}
                                                        value={v1.publishDate}
                                                        maxDate={v1.validTo}
                                                        onChange={(newValue) => {
                                                            setValidateFromValue(newValue);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </Col>

                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                {/* <Card sx={{ my: 1 }} style={{ height: 'auto' }}>
                                                                <CardHeader title="Value List" /> */}

                                                {/* <InputLabel id="value List" style={{ color: '#223354', fontWeight: '700', fontSize: '15px', margin: '13px 0px' }}>
                                                                        Value List
                                                                    </InputLabel> */}


                                                <FormGroup style={{ display: "flex" }}>
                                                    <TextField
                                                        autoFocus
                                                        margin="dense"
                                                        id="tags"
                                                        label="Tags"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="singleTag"
                                                        value={singleTag}
                                                        onChange={(arr) => {
                                                            handleTagsInputChange(arr);
                                                            validateTags(arr);
                                                        }}
                                                    /><Button
                                                        sx={{ mt: 0.5 }}
                                                        variant="outlined"
                                                        onClick={handleAddTags}
                                                        style={{ border: "0px", borderLeft: '1px solid #ced4da', borderRadius: '0px', margin: '13px 0px 8px -68px' }}>
                                                        Add
                                                    </Button>
                                                </FormGroup>
                                                <FormHelperText
                                                    style={{ color: 'red', height: '22px' }}
                                                >
                                                    {isTagsError && tagsErrorMsg}
                                                </FormHelperText>

                                                {(arrayTags && arrayTags.length > 0) &&
                                                    <Typography style={{ display: 'flex', flexWrap: 'wrap' }}>

                                                        {arrayTags.map((value, index) => (
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
                                                                    onDelete={(e) => {
                                                                        handleDeleteTags(index);
                                                                    }}
                                                                >
                                                                    {value}
                                                                </Chip>
                                                            </Typography>
                                                        ))}
                                                    </Typography>}
                                            </Col>
                                        </Row>
                                    </DialogContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'end',
                                            p: '8px'
                                        }}
                                    >

                                        <Typography>
                                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleCloseBlogDailog} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => { saveBlog(e) }} variant="outlined" style={{ marginRight: '10px' }}>Save</Button>
                                        </Typography>

                                    </Box>
                                </BootstrapDialog>
                            </div>
                            <div>
                                <Dialog
                                    open={ischeck}
                                    onClose={handleClose}
                                    fullWidth
                                    maxWidth="xs"
                                >
                                    <DialogTitle
                                        sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
                                    >
                                        {v1.status === 0 ? 'Inactive' : 'Active'}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText
                                            style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
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
                                <Dialog
                                    open={isdelete}
                                    onClose={handleClose}
                                    fullWidth
                                    maxWidth="xs"
                                >
                                    <DialogTitle
                                        sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
                                    >
                                        Delete
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText
                                            style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
                                        >
                                            Are you sure you want to Delete?

                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                        <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleDeleteCheck} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </>
                    </Grid>
                </Grid>
            </Container >
        </>
    );
}

export default Blog;
