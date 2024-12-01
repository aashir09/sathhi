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
import { format } from 'date-fns'

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
    code: '',
    type: '',
    value: 0,
    maxUsage: null,
    userUsage: null,
    validFrom: null,
    validTo: null,
    maxDiscountAmount: null,
    description: null,
    termsCondition: null,
    packages: []
};

const Coupons = () => {
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
    const [coupons, setCoupons] = React.useState<CouponsModel[]>([]);
    const [selectedPackages, setSelectedPackages] = useState<any>([]);
    const [packages, setPackages] = useState<Packages[]>([]);
    const [isCouponError, setIsCouponErrorError] = useState(false);
    const [couponErrorMsg, setCouponErrorMsg] = useState('');
    const [isNameError, setNameError] = useState(false);
    const [NameErrorMsg, setNameErrorMsg] = useState('');
    const [isCodeError, setCodeError] = useState(false);
    const [CodeErrorMsg, setCodeErrorMsg] = useState('');
    const [isDiscountTypeError, setDiscountTypeError] = useState(false);
    const [DiscountTypeErrorMsg, setDiscountTypeErrorMsg] = useState('');
    const [isDiscountValueError, setDiscountValueError] = useState(false);
    const [DiscountValueErrorMsg, setDiscountValueErrorMsg] = useState('');
    const [isMaximumDiscountAmountError, setMaximumDiscountAmountError] = useState(false);
    const [MaximumDiscountAmountErrorMsg, setMaximumDiscountAmountErrorMsg] = useState('');
    const [isMaxUsageError, setMaxUsageError] = useState(false);
    const [MaxUsageErrorMsg, setMaxUsageErrorMsg] = useState('');
    const [isUserUsageError, setUserUsageError] = useState(false);
    const [UserUsageErrorMsg, setUserUsageErrorMsg] = useState('');
    const [isPackagesError, setPackagesError] = useState(false);
    const [PackagesErrorMsg, setPackagesErrorMsg] = useState('');
    let [credentail, setCredentail] = useState<any>();
    let dateFormat: any = "MM/dd/yyyy";
    let todayDate: any = new Date();
    if (sessionStorage.getItem("DateFormat")) {
        let storedDateFormat: any = sessionStorage.getItem("DateFormat");
        dateFormat = JSON.parse(storedDateFormat);
    }

    useEffect(() => {
        let cred = JSON.parse(localStorage.getItem('Credentials'));
        setCredentail(cred);
        getdata(page, limit);
        getPackages();
    }, []);

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
                    '/api/admin/coupons/getCoupons',
                    obj,
                    token,
                    refreshToken
                );
                setCoupons(res.recordList);
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
                    '/api/admin/coupons/getCoupons',
                    obj,
                    token,
                    refreshToken
                );
                setCoupons(res.recordList);
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

    const getPackages = async () => {
        try {
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            const res = await APIservice.httpPost(
                '/api/admin/package/getPackageName',
                {},
                token,
                refreshToken
            );
            setPackages(res.recordList);
            if (res.status === 200) {
            } else if (res && res.status === 401) {
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
        } catch (error) {
            console.log(error);
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
        setNameError(false);
        setNameErrorMsg('');
        setCodeError(false);
        setCodeErrorMsg('');
        setDiscountTypeError(false);
        setDiscountTypeErrorMsg('');
        setDiscountValueError(false);
        setDiscountValueErrorMsg('');
        setMaximumDiscountAmountError(false);
        setMaximumDiscountAmountErrorMsg('');
        setMaxUsageError(false);
        setMaxUsageErrorMsg('');
        setUserUsageError(false);
        setUserUsageErrorMsg('');
        setPackagesError(false);
        setPackagesErrorMsg('');

        setIsCouponErrorError(false);
        setCouponErrorMsg('');
        setSelectedPackages([]);
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
            '/api/admin/coupons/activeInactiveCoupon',
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

    const handleClickOpenEdit = (obj: any) => {
        debugger
        let packages = [];
        if (obj && obj.packages && obj.packages.length) {
            for (let i = 0; i < obj.packages.length; i++) {
                let obj1 = {
                    id: obj.packages[i].packageId,
                    masterId: obj.packages[i].id,
                    name: obj.packages[i].packageName,
                }
                packages.push(obj1);
            }
            setSelectedPackages(packages);
        } else {
            setSelectedPackages([]);
        }
        obj.packages = packages.map(c => c.id);
        setV1(obj);
        setIsOpen(true);
        setNameError(false);
        setNameErrorMsg('');
        setCodeError(false);
        setCodeErrorMsg('');
        setDiscountTypeError(false);
        setDiscountTypeErrorMsg('');
        setDiscountValueError(false);
        setDiscountValueErrorMsg('');
        setMaximumDiscountAmountError(false);
        setMaximumDiscountAmountErrorMsg('');
        setMaxUsageError(false);
        setMaxUsageErrorMsg('');
        setUserUsageError(false);
        setUserUsageErrorMsg('');
        setPackagesError(false);
        setPackagesErrorMsg('');
        setIsCouponErrorError(false);
        setCouponErrorMsg('');
    };

    const handleAddPackages = async () => {
        let pack = [];
        console.log(selectedPackages);
        let data = selectedPackages;
        if (data && data.length > 0) {
            if (v1.packages && v1.packages.length > 0) {
                for (let i = 0; i < v1.packages.length; i++) {
                    let obj1 = packages.find(c => c.id == v1.packages[i]);
                    let ind = data.findIndex(c => c.id == v1.packages[i]);
                    let obj = {
                        masterId: ind >= 0 ? data[ind].masterId : 0,
                        id: v1.packages[i],
                        name: obj1.name
                    }

                    pack.push(obj);
                }
            }
        } else {
            if (v1.packages && v1.packages.length > 0) {
                for (let i = 0; i < v1.packages.length; i++) {
                    let obj = packages.find(c => c.id == v1.packages[i]);

                    pack.push(obj);
                }
            }
        }
        setSelectedPackages(pack);
    };

    const handleDeletePackages = (e: any) => {
        const data = selectedPackages.filter(
            (d: any) => d.id !== e.id
        );
        setSelectedPackages(data);
        let data1 = v1.packages.filter(
            (d: any) => d !== e.id
        );
        let obj = {
            id: v1.id,
            name: v1.name,
            code: v1.code,
            type: v1.type,
            value: v1.value,
            maxUsage: v1.maxUsage,
            userUsage: v1.userUsage,
            validFrom: v1.validFrom,
            validTo: v1.validTo,
            maxDiscountAmount: v1.maxDiscountAmount,
            description: v1.description,
            termsCondition: v1.termsCondition,
            packages: data1
        };
        setV1(obj);
        // handleClickOpenEdit(obj);
    };

    const handleCloseCouponDialog = () => {
        setIsOpen(false);
    };

    const handleInputChange = (arr: any) => {
        const { name, value } = arr.target;
        setV1({ ...v1, [name]: value });
        setIsOpen(true);
    };

    const setValidateFromValue = (dateVal: Date) => {
        setV1({ ...v1, "validFrom": dateVal });
    }

    const setValidateToValue = (dateVal: Date) => {
        setV1({ ...v1, "validTo": dateVal });
    }

    const handleDescriptionChange = (dateVal: string) => {
        setV1({ ...v1, "description": dateVal });
    }

    const handleTermsConditionChange = (dateVal: string) => {
        setV1({ ...v1, "termsCondition": dateVal });
    }

    const validateName = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setNameError(false);
            setNameErrorMsg('');
        } else {
            setNameError(true);
            setNameErrorMsg('Coupon Name is required');
        }
    };
    const validateCode = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setCodeError(false);
            setCodeErrorMsg('');
        } else {
            setCodeError(true);
            setCodeErrorMsg('Coupon Code is required');
        }
    };

    const validateDiscountType = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setDiscountTypeError(false);
            setDiscountTypeErrorMsg('');
        } else {
            setDiscountTypeError(true);
            setDiscountTypeErrorMsg('Coupon Type is required');
        }
    };

    const reg = new RegExp(/^[0-9]\d*(\.\d+)?$$/);
    const validateDiscountValue = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            if (reg.test(value)) {
                setDiscountValueError(false);
                setDiscountValueErrorMsg('');
            } else {
                setDiscountValueError(true);
                setDiscountValueErrorMsg('Coupon Value is allow only digit');
            }
        } else {
            setDiscountValueError(true);
            setDiscountValueErrorMsg('Coupon Value is required');
        }
    };

    const validateMaximumDiscountAmountValue = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            if (reg.test(value)) {
                setMaximumDiscountAmountError(false);
                setMaximumDiscountAmountErrorMsg('');
            } else {
                setMaximumDiscountAmountError(true);
                setMaximumDiscountAmountErrorMsg('Maximum Discount Amount is allow only digit');
            }
        } else {

        }
    };

    const validateMaxUsageValue = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            if (reg.test(value)) {
                setMaxUsageError(false);
                setMaxUsageErrorMsg('');
            } else {
                setMaxUsageError(true);
                setMaxUsageErrorMsg('Max Usage is allow only digit');
            }
        } else {

        }
    };

    const validateUserUsageValue = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            if (reg.test(value)) {
                setUserUsageError(false);
                setUserUsageErrorMsg('');
            } else {
                setUserUsageError(true);
                setUserUsageErrorMsg('User Usage is allow only digit');
            }
        } else {

        }
    };

    const handlePackageChange = (arr: any) => {
        const { name, value } = arr.target;
        setV1({ ...v1, [name]: value });
        setIsOpen(true);
    };

    const validatePackages = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setPackagesError(false);
            setPackagesErrorMsg('');
        } else {
            setPackagesError(true);
            setPackagesErrorMsg('Packages is required');
        }
    };

    const validateForm = (e: any) => {
        e.preventDefault();
        var flag = true;
        if (!v1.name) {
            setNameError(true);
            setNameErrorMsg('Coupon Name is required');
            flag = false;
        } else {
            setNameError(false);
            setNameErrorMsg('');
        }
        if (!v1.code) {
            setCodeError(true);
            setCodeErrorMsg('Coupon Code is required');
            flag = false;
        } else {
            setCodeError(false);
            setCodeErrorMsg('');
        }
        if (!v1.type) {
            setDiscountTypeError(true);
            setDiscountTypeErrorMsg('Coupon Type is required');
            flag = false;
        } else {
            setDiscountTypeError(false);
            setDiscountTypeErrorMsg('');
        }
        if (!v1.value) {
            setDiscountValueError(true);
            setDiscountValueErrorMsg('Coupon Value is required');
            flag = false;
        } else {
            if (reg.test(v1.value)) {
                setDiscountValueError(false);
                setDiscountValueErrorMsg('');
            } else {
                setDiscountValueError(true);
                setDiscountValueErrorMsg('Coupon Value is allow only digit');
                flag = false;
            }
        }
        return flag;
    };

    const saveCoupon = async (e: any) => {
        debugger
        var flag = validateForm(e);
        if (flag) {
            try {
                if (v1.id) {
                    const token = localStorage.getItem('SessionToken');
                    const refreshToken = localStorage.getItem('RefreshToken');
                    let val = v1; let pckgs = [];
                    v1.isActive = v1.isActive == 1 ? true : false;
                    v1.isDelete = v1.isDelete == 1 ? true : false;
                    for (let i = 0; i < selectedPackages.length; i++) {
                        let obj = {
                            packageId: selectedPackages[i].id,
                            id: selectedPackages[i].masterId
                        }
                        pckgs.push(obj)
                    }
                    val.packages = pckgs;
                    const res = await APIservice.httpPost(
                        '/api/admin/coupons/insertUpdateCoupon',
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
                        setIsCouponErrorError(true);
                        setCouponErrorMsg('Coupon already exists!');
                    }
                } else {
                    const token = localStorage.getItem('SessionToken');
                    const refreshToken = localStorage.getItem('RefreshToken');
                    let val = v1;
                    let pckgs = [];
                    for (let i = 0; i < selectedPackages.length; i++) {
                        let obj = {
                            packageId: selectedPackages[i].id,
                            id: 0
                        }
                        pckgs.push(obj)
                    }
                    val.packages = pckgs;

                    const res = await APIservice.httpPost(
                        '/api/admin/coupons/insertUpdateCoupon',
                        val,
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
                        setIsCouponErrorError(true);
                        setCouponErrorMsg('Coupon Code already exists!');
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
                <title>Coupons</title>
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
                                        Coupons
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1.5}>
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
                                        Create Coupon
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
                                            {coupons && coupons.length > 0 ? (
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
                                                                            Sr. No
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
                                                                            Code
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
                                                                            Valid From
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
                                                                            Valid Till
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
                                                                {coupons.map((arr: any, index: number) => {
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
                                                                                    {arr.code}
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
                                                                                    {arr.validFrom ? format(new Date(arr.validFrom), dateFormat) : '--'}
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
                                                                                    {arr.validTo ? format(new Date(arr.validTo), dateFormat) : '--'}

                                                                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff0000', paddingTop: '12px', marginLeft: '20px' }}> {(format(new Date(arr.validTo), dateFormat) < format(new Date(todayDate), dateFormat)) && 'expired'}</span>
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="right"
                                                                                sx={{ display: 'flex' }}
                                                                            >
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
                                                    onClose={handleCloseCouponDialog}
                                                    PaperProps={{ sx: { height: '40%' } }}
                                                    fullWidth
                                                    maxWidth="lg"
                                                >
                                                    <BootstrapDialogTitle
                                                        id="customized-dialog-title"
                                                        onClose={handleCloseCouponDialog}
                                                    >
                                                        {v1.id ? 'Edit Coupon' : 'Add Coupon'}
                                                    </BootstrapDialogTitle>
                                                    <DialogContent dividers>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="name"
                                                                    label="Coupon Name"
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
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="name"
                                                                    label="Coupon Code"
                                                                    type="text"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    name="code"
                                                                    value={v1.code}
                                                                    onChange={(arr) => {
                                                                        handleInputChange(arr);
                                                                        validateCode(arr);
                                                                    }}
                                                                    required={true}
                                                                />
                                                                <FormHelperText
                                                                    style={{ color: 'red', height: '22px' }}
                                                                >
                                                                    {isCodeError && CodeErrorMsg}
                                                                </FormHelperText>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <FormControl
                                                                    sx={{ width: { lg: '100%' } }}
                                                                >
                                                                    <InputLabel id="demo-multiple-name-label">
                                                                        Discount Type *
                                                                    </InputLabel>
                                                                    <Select
                                                                        labelId="demo-multiple-name-label"
                                                                        id="demo-multiple-name"
                                                                        multiple={false}
                                                                        name="type"
                                                                        value={v1.type || []}
                                                                        onChange={(e) => {
                                                                            handleInputChange(e);
                                                                            validateDiscountType(e);
                                                                        }}
                                                                        label="Discount Type *"
                                                                        MenuProps={MenuProps}
                                                                        required={true}
                                                                    >

                                                                        <MenuItem value="Percentage">Percentage</MenuItem>
                                                                        <MenuItem value="Amount">Amount</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormHelperText style={{ color: 'red', height: '22px' }}>
                                                                    {isDiscountTypeError && DiscountTypeErrorMsg}
                                                                </FormHelperText>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="name"
                                                                    label="Coupon Value"
                                                                    type="text"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    name="value"
                                                                    value={v1.value}
                                                                    onChange={(arr) => {
                                                                        handleInputChange(arr);
                                                                        validateDiscountValue(arr);
                                                                    }}
                                                                    required={true}
                                                                />
                                                                <FormHelperText
                                                                    style={{ color: 'red', height: '22px' }}
                                                                >
                                                                    {isDiscountValueError && DiscountValueErrorMsg}
                                                                </FormHelperText>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="name"
                                                                    label="Max Usage"
                                                                    type="text"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    name="maxUsage"
                                                                    value={v1.maxUsage}
                                                                    onChange={(arr) => {
                                                                        handleInputChange(arr);
                                                                        validateMaxUsageValue(arr);
                                                                    }}
                                                                />
                                                                <FormHelperText
                                                                    style={{ color: 'red', height: '22px' }}
                                                                >
                                                                    {isMaxUsageError && MaxUsageErrorMsg}
                                                                </FormHelperText>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="name"
                                                                    label="User Usage"
                                                                    type="text"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    name="userUsage"
                                                                    value={v1.userUsage}
                                                                    onChange={(arr) => {
                                                                        handleInputChange(arr);
                                                                        validateUserUsageValue(arr);
                                                                    }}
                                                                />
                                                                <FormHelperText
                                                                    style={{ color: 'red', height: '22px' }}
                                                                >
                                                                    {isUserUsageError && UserUsageErrorMsg}
                                                                </FormHelperText>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                    <DatePicker
                                                                        label="Valid From"
                                                                        openTo="day"
                                                                        views={['year', 'month', 'day']}
                                                                        value={v1.validFrom}
                                                                        maxDate={v1.validTo}
                                                                        onChange={(newValue) => {
                                                                            setValidateFromValue(newValue);
                                                                        }}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                    />
                                                                </LocalizationProvider>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                    <DatePicker
                                                                        label="Valid To"
                                                                        openTo="day"
                                                                        views={['year', 'month', 'day']}
                                                                        value={v1.validTo}
                                                                        minDate={v1.validFrom}
                                                                        onChange={(newValue) => {
                                                                            setValidateToValue(newValue);
                                                                        }}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                    />
                                                                </LocalizationProvider>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="name"
                                                                    label="Max Discount Amount"
                                                                    type="text"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    name="maxDiscountAmount"
                                                                    value={v1.maxDiscountAmount}
                                                                    onChange={(arr) => {
                                                                        handleInputChange(arr);
                                                                        validateMaximumDiscountAmountValue(arr);
                                                                    }}
                                                                />
                                                                <FormHelperText
                                                                    style={{ color: 'red', height: '22px' }}
                                                                >
                                                                    {isMaximumDiscountAmountError && MaximumDiscountAmountErrorMsg}
                                                                </FormHelperText>
                                                            </Grid>
                                                            <Grid item xs={6}>

                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <CardHeader title="Packages" />
                                                                <Row style={{ paddingLeft: '2%', paddingRight: '2%' }}>
                                                                    <Col sm>
                                                                        <FormControl
                                                                            sx={{ width: { lg: 265, md: 265, sm: 265, xs: 200 } }}
                                                                        >
                                                                            <InputLabel id="demo-multiple-name-label">
                                                                                Packages
                                                                            </InputLabel>
                                                                            <Select
                                                                                labelId="demo-multiple-name-label"
                                                                                id="demo-multiple-name"
                                                                                multiple={true}
                                                                                name="packages"
                                                                                value={v1.packages || []}
                                                                                onChange={(e) => {
                                                                                    handlePackageChange(e);
                                                                                    validatePackages(e);
                                                                                }}
                                                                                label="Premium Facility"
                                                                                MenuProps={MenuProps}
                                                                                required={true}
                                                                            >
                                                                                {packages.map((arr: any) => (
                                                                                    <MenuItem key={arr.id} value={arr.id}>
                                                                                        {arr.name}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormHelperText style={{ color: 'red', height: '22px' }}>
                                                                            {isPackagesError && PackagesErrorMsg}
                                                                        </FormHelperText>
                                                                    </Col>
                                                                    <Col sm>
                                                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                            <Button
                                                                                sx={{ mt: 0.5 }}
                                                                                variant="outlined"
                                                                                onClick={handleAddPackages}
                                                                            >
                                                                                Add
                                                                            </Button>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{ marginBottom: '9px' }}>
                                                                    {selectedPackages.map((arr: any) => (
                                                                        <Col
                                                                            lg={3}
                                                                            md={4}
                                                                            sm={6}
                                                                            xs={12}
                                                                            key={arr.id}
                                                                            style={{
                                                                                paddingLeft: '4%',
                                                                                paddingTop: '1.4%',
                                                                                paddingBottom: '1.4%'
                                                                            }}
                                                                        >
                                                                            <Chip
                                                                                label={arr.name}
                                                                                onDelete={(e) => {
                                                                                    handleDeletePackages(arr);
                                                                                }}
                                                                            >
                                                                                {arr.name}
                                                                            </Chip>
                                                                        </Col>
                                                                    ))}
                                                                </Row>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <InputLabel id="demo-multiple-name-label">
                                                                    Description
                                                                </InputLabel>
                                                                <ReactQuill
                                                                    theme="snow"
                                                                    value={v1.description}
                                                                    onChange={(e) => { handleDescriptionChange(e) }}
                                                                    modules={modules}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <InputLabel id="demo-multiple-name-label">
                                                                    Terms of use
                                                                </InputLabel>
                                                                <ReactQuill
                                                                    theme="snow"
                                                                    value={v1.termsCondition}
                                                                    onChange={(e) => { handleTermsConditionChange(e) }}
                                                                    modules={modules}
                                                                />
                                                            </Grid>
                                                        </Grid>
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
                                                            {isCouponError && couponErrorMsg}
                                                        </FormHelperText>
                                                        <Typography>
                                                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleCloseCouponDialog} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={saveCoupon} variant="outlined" style={{ marginRight: '10px' }}>Save</Button>
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

export default Coupons;