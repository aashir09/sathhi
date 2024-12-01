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
    InputLabel,
    Select,
    MenuItem,
    Chip
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent, useEffect } from 'react';
import Loader1 from '../Loader';
import APIservice from 'src/utils/APIservice';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../content/smallScreen.css';
import 'react-quill/dist/quill.snow.css';
import { CardHeader, Col, FormGroup, Row } from 'react-bootstrap';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import './manageCustomFields.css'
import DeleteIcon from '@mui/icons-material/Delete';
import { object } from 'prop-types';

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
    valueList: null,
    textLength: null,
    completeprofilesectioname: null
};

const ManageCustomFields = () => {
    const card = {
        height: 'auto',
        padding: '10px',
        boxShadow: '0px 0px 4px rgba(159, 162, 191, .18), 0px 0px 2px rgba(159, 162, 191, 0.32)',
        borderRadius: '5px',
        marginBottom: '30px'
    };


    const navigate = useNavigate();
    const theme = useTheme();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [row, setRow] = useState<number>(10);
    const [v1, setV1] = React.useState<any>(initialState);
    let [singleValueOfValueList, setSingleValueOfValueList] = useState('')
    let [arrayValueList, setArrayValueList] = useState<any>([]);

    let [singleValueOfDefaultValue, setSingleValueOfDefaultValue] = useState('')
    let [arrayDefaultValue, setArrayDefaultValue] = useState<any>([]);

    const [isOpen, setIsOpen] = React.useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [ischeck, setIsCheck] = useState(false);
    let [search, setSearch] = useState('');
    const [isDel, setIsDel] = useState(false);

    // const [customNotifications, setCustomNotifications] = React.useState<any[]>([]);
    const [customFields, setCustomFields] = React.useState<any[]>([]);
    const [valueType, setValueType] = useState<any>([]);
    // const [customFields, setCustomFields] = React.useState<any>(initialState);
    const [isNameError, setIsNameError] = useState(false);
    const [NameErrorMsg, setNameErrorMsg] = useState('');
    const [isDisplayNameError, setIsDisplayNameError] = useState(false);
    const [DisplayNameErrorMsg, setDisplayNameErrorMsg] = useState('');
    const [isMappedFieldNameError, setIsMappedFieldNameError] = useState(false);
    const [MappedFieldNameErrorMsg, setMappedFieldNameErrorMsg] = useState('');
    const [isDescriptionError, setIsDescriptionError] = useState(false);
    const [DescriptionErrorMsg, setDescriptionErrorMsg] = useState('');
    const [isValueTypeError, setIsValueTypeError] = useState(false);
    const [ValueTypeErrorMsg, setValueTypeErrorMsg] = useState('');
    const [isDefaultValueError, setIsDefaultValueError] = useState(false);
    const [DefaultValueErrorMsg, setDefaultValueErrorMsg] = useState('');
    const [isValueListError, setIsValueListError] = useState(false);
    const [ValueListErrorMsg, setValueListErrorMsg] = useState('');
    const [isTextLengthError, setIsTextLengthError] = useState(false);
    const [TextLengthErrorMsg, setTextLengthErrorMsg] = useState('');
    const [isSectionError, setIsSectionError] = useState(false);
    const [SectionErrorMsg, setSectionErrorMsg] = useState('');

    const [image, setImage] = React.useState('');
    let [credentail, setCredentail] = useState<any>();

    const [isReadPermission, setIsReadPermission] = useState(true);
    const [isWritePermission, setIsWritePermission] = useState(true);
    const [isEditPermission, setIsEditPermission] = useState(true);
    const [isDeletePermission, setIsDeletePermission] = useState(true);
    const profileSection = [
        // { value: 'Profile For', label: 'Profile For' },
        { value: 'Basic Details', label: 'Basic Details' },
        { value: 'Personal Details', label: 'Personal Details' },
        { value: 'Community Details', label: 'Community Details' },
        { value: 'Address Details', label: 'Address Details' },
        { value: 'Education & Career Details', label: 'Education & Career Details' },
        { value: 'Other Details', label: 'Other Details' },
        { value: 'About Me', label: 'About Me' },
        { value: 'Expectations', label: 'Expectations' },

    ];

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
        await getdata(page, limit);
        await getValueType();
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
                    '/api/admin/manageCustomFields/getCustomfields',
                    obj,
                    token,
                    refreshToken
                );
                setCustomFields(res.recordList);
                setRow(res.totalRecords);
                for (let i = 0; i < customFields.length; i++) {
                    customFields[i].valueList = customFields[i].valueList.join('; ')
                }


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
                    '/api/admin/manageCustomFields/getCustomfields',
                    obj,
                    token,
                    refreshToken
                );
                setCustomFields(res.recordList);
                for (let i = 0; i < customFields.length; i++) {
                    customFields[i].valueList = customFields[i].valueList.join('; ')
                }


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

    const getValueType = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            const res = await APIservice.httpPost(
                '/api/admin/manageCustomFields/getCustomfieldValueType',
                {},
                token,
                refreshToken
            );
            setValueType(res.recordList);
            if (res && res.status === 200) {
            } else if (res && res.status === 401) {
                localStorage.clear();
                navigate('/admin');
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
        setIsLoading(false);
    };

    const reg = new RegExp('^[a-zA-Z0-9 ]+$');

    const handleAddValueList = () => {
        if (reg.test(singleValueOfValueList)) {
            if (singleValueOfValueList.trim() !== '') {
                arrayValueList = arrayValueList ? [...arrayValueList] : []
                arrayValueList.push(singleValueOfValueList);
                setArrayValueList(arrayValueList);
                setSingleValueOfValueList('');
                console.log(arrayValueList)
            }
        }
        else {
            setIsValueListError(true);
            setValueListErrorMsg('Value is invalid.');
        }

    };

    const handleDeleteValueList = (indexToRemove) => {
        arrayValueList = arrayValueList.filter((_, index) => index !== indexToRemove);
        setArrayValueList(arrayValueList);
        // v1.valueList = arrayValueList
    };

    const handleAddDefaultValue = () => {
        if (reg.test(singleValueOfDefaultValue)) {

            if (singleValueOfDefaultValue.trim() !== '') { 
                arrayDefaultValue = arrayDefaultValue ? [...arrayDefaultValue] : []
                arrayDefaultValue.push(singleValueOfDefaultValue);
                setArrayDefaultValue(arrayDefaultValue);
                setSingleValueOfDefaultValue('');
                console.log(arrayDefaultValue)
            }

        } else {
            setIsDefaultValueError(true);
            setDefaultValueErrorMsg('Default value is invalid.');

        }


    };

    const handleDeleteDefaultValue = (indexToRemove) => {
        arrayDefaultValue = arrayDefaultValue.filter((_, index) => index !== indexToRemove);
        setArrayDefaultValue(arrayDefaultValue)
        // setArrayDefaultValue(updatedDefaultValueChips);
        // arrayDefaultValue = updatedDefultValueChips
        // v1.defaultValue = arrayDefaultValue
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
        setIsDisplayNameError(false);
        setDisplayNameErrorMsg('');
        setIsMappedFieldNameError(false);
        setMappedFieldNameErrorMsg('');
        setIsDescriptionError(false);
        setDescriptionErrorMsg('');
        setIsValueTypeError(false);
        setValueTypeErrorMsg('');
        setIsDefaultValueError(false);
        setDefaultValueErrorMsg('');
        setIsValueListError(false);
        setValueListErrorMsg('');
        setIsTextLengthError(false);
        setTextLengthErrorMsg('');
        setArrayValueList([]);
        setSingleValueOfValueList('')
        setArrayDefaultValue([]);
        setSingleValueOfDefaultValue('')
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
            '/api/admin/manageCustomFields/toggleActiveCustomField',
            obj,
            token,
            refreshToken
        );
        setIsCheck(false);
        getdata(page * limit, limit);
    };

    const handleClose = () => {
        setIsCheck(false);
        setIsDel(false)
    };

    const handleOpenDeleteDialog = (arr: any, arr1: any) => {
        let obj = {
            id: arr,
            packageDurationId: arr1
        };
        setV1(obj);
        setIsDel(true);
    };



    const handleClickOpenEdit = (obj: any) => {
        debugger
        // if (obj.imageUrl) setImage(process.env.REACT_APP_BASEURL + '/'+ + obj.imageUrl);
        // else setImage('');
        if (obj.valueList && typeof obj.valueList === 'string') {
            const valueArray: string[] = obj.valueList.includes(';') ? obj.valueList.split(';') : [obj.valueList];
            obj.valueList = valueArray;
        }
        setArrayValueList(obj.valueList)

        if (obj.defaultValue && typeof obj.defaultValue === 'string' && obj.valueTypeId === 10) {
            const defaultValueArray: string[] = obj.defaultValue.includes(';') ? obj.defaultValue.split(';') : [obj.defaultValue];
            obj.defaultValue = defaultValueArray;
        }
        setArrayDefaultValue(obj.defaultValue)

        setV1(obj);
        console.log(v1)
        setIsOpen(true);
        setIsNameError(false);
        setNameErrorMsg('');
        setIsDisplayNameError(false);
        setDisplayNameErrorMsg('');
        setIsMappedFieldNameError(false);
        setMappedFieldNameErrorMsg('');
        setIsDescriptionError(false);
        setDescriptionErrorMsg('');
        setIsValueTypeError(false);
        setValueTypeErrorMsg('');
        setIsDefaultValueError(false);
        setDefaultValueErrorMsg('');
        setIsValueListError(false);
        setValueListErrorMsg('');
    }

    const handleCloseCustomNotificationDialog = () => {
        setIsOpen(false);
    };

    const handleInputChange = (arr: any) => {
        const { name, value } = arr.target;
        setV1({ ...v1, [name]: value });
        setIsOpen(true);
    };

    const handleFieldNameChange = (arr: any) => {
        const { name, value } = arr.target;
        let mappedFieldName = value.replace(/\s+/g, '_');
        mappedFieldName = mappedFieldName.charAt(0).toLowerCase() + mappedFieldName.slice(1);
        setV1({
            ...v1,
            [name]: value,
            mappedFieldName: mappedFieldName
        });
        setIsOpen(true);
    }

    const handleMappedFieldNameChange = (arr: any) => {
        const { name, value } = arr.target;
        let mappedFieldName = value.replace(/\s+/g, '_');
        mappedFieldName = mappedFieldName.charAt(0).toLowerCase() + mappedFieldName.slice(1);
        setV1({ ...v1, [name]: mappedFieldName });
        setIsOpen(true);
    }

    const handleValueListInputChange = (arr: any) => {
        const { name, value } = arr.target;
        setSingleValueOfValueList(value);
        setIsOpen(true);
    };
    const handleDefaultValueInputChange = (arr: any) => {
        const { name, value } = arr.target;
        setSingleValueOfDefaultValue(value);
        setIsOpen(true);
    };

    const validateName = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsNameError(false);
            setNameErrorMsg('');
        } else {
            setIsNameError(true);
            setNameErrorMsg('Custom Field Name is required');
        }
    };
    const validateDisplayName = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsDisplayNameError(false);
            setDisplayNameErrorMsg('');
        } else {
            setIsDisplayNameError(true);
            setDisplayNameErrorMsg('Custom field is required');
        }
    };

    const mediumRegex = new RegExp('^[a-zA-Z0-9_]*$');
    const validateMappedFieldName = (arr) => {
        const { name, value } = arr.target;
      
        if (value) {
            if (mediumRegex.test(arr.target.value)) {
                setIsMappedFieldNameError(false);
                setMappedFieldNameErrorMsg('');
            } else {
                setIsMappedFieldNameError(true);
                setMappedFieldNameErrorMsg('Special characters are not allowed');
            }

        } else {
            setIsMappedFieldNameError(true);
            setMappedFieldNameErrorMsg('Mapped field name is required');
        }
    };

    const validateDescription = (arr) => {
        let value = arr;
        if (value) {
            setIsDescriptionError(false);
            setDescriptionErrorMsg('');
        } else {
            setIsDescriptionError(true);
            setDescriptionErrorMsg('Description is required');
        }
    };

    const validateValueType = (arr) => {
        let value = arr;
        if (value) {
            setIsValueTypeError(false);
            setValueTypeErrorMsg('');
        } else {
            setIsValueTypeError(true);
            setValueTypeErrorMsg('Value type is required');
        }
    };

    const validateTextLength = (arr) => {
        let value = arr
        if (value < "65535" && value > "0") {
            setIsTextLengthError(false);
            setTextLengthErrorMsg('');
        } else {
            setIsTextLengthError(true);
            setTextLengthErrorMsg('Length must be between 0 - 65535');
        }
    }

    const validateSection = (arr) => {
        let value = arr;
        if (value) {
            setIsSectionError(false);
            setSectionErrorMsg('');
        } else {
            setIsSectionError(true);
            setSectionErrorMsg('Section Value is Required');
        }
    };


    const validateDefaultValue = (arr) => {

        let value = arr;
        if (value) {
            setIsDefaultValueError(false);
            setDefaultValueErrorMsg('');

        } else {
            setIsDefaultValueError(true);
            setDefaultValueErrorMsg('Default Value is required');
        }
    };

    const validateDefaultValueList = (arr) => {
        // let value = arr;
        const { name, value } = arr.target
        if (value) {
            setIsDefaultValueError(false);
            setDefaultValueErrorMsg('');
        } else {
            setIsDefaultValueError(true);
            setDefaultValueErrorMsg('Value List is required');
        }
    }

    const validateValueList = (arr) => {
        let value = arr;
        if (value) {
            setIsValueListError(false);
            setValueListErrorMsg('');
        } else {
            setIsValueListError(true);
            setValueListErrorMsg('Value List is required');
        }
    };


    const handleSwitchIsRequired = (e: any) => {
        const { name, checked } = e.target;

        setV1({
            ...v1,
            "isRequired": checked//value === "on" ? true : false
        });
    }

    const handleSwitchAllowInSearch = (e: any) => {
        const { name, checked } = e.target;

        setV1({
            ...v1,
            "allowInSearch": checked//value === "on" ? true : false
        });
    }

    const handleSwitchAllowInFilter = (e: any) => {
        const { name, checked } = e.target;

        setV1({
            ...v1,
            "allowInFilter": checked//value === "on" ? true : false
        });
    }

    const handleSwitchAllowIncompleteProfile = (e: any) => {
        const { name, checked } = e.target;

        setV1({
            ...v1,
            allowIncompleteProfile: checked//value === "on" ? true : false
        });

    }

    const handleSwitchAllowInPreferences = (e: any) => {
        const { name, checked } = e.target;

        setV1({
            ...v1,
            "allowInPreferences": checked//value === "on" ? true : false
        });
    }



    const validateForm = (e: any) => {
        e.preventDefault();
        var flag = true;
        if (!v1.name) {
            setIsNameError(true);
            setNameErrorMsg('Custom field name is required');
            flag = false;
        } else {
            setIsNameError(false);
            setNameErrorMsg('');
        }
        if (!v1.displayName) {
            setIsDisplayNameError(true);
            setDisplayNameErrorMsg('Custom field display Name is required');
            flag = false;
        } else {
            setIsDisplayNameError(false);
            setDisplayNameErrorMsg('');
        }
        if (!v1.mappedFieldName) {
            setIsMappedFieldNameError(true);
            setMappedFieldNameErrorMsg('Mapped field name is required');
            flag = false;
        } else {
            setIsMappedFieldNameError(false);
            setMappedFieldNameErrorMsg('');
        }
        // if (!v1.description) {
        //     setIsDescriptionError(true);
        //     setDescriptionErrorMsg('Custom Description Title is required');
        //     flag = false;
        // } else {
        //     setIsDescriptionError(false);
        //     setDescriptionErrorMsg('');
        //     flag = true;
        // }
        if (!v1.valueTypeId) {
            setIsValueTypeError(true);
            setValueTypeErrorMsg('Custom value type is required');
            flag = false;
        } else {
            setIsValueTypeError(false);
            setValueTypeErrorMsg('');
            if (v1.valueTypeId == 1) {
                if (!v1.textLength) {
                    setIsTextLengthError(true);
                    setTextLengthErrorMsg('Text length is required');
                    flag = false;
                } else {
                    setIsTextLengthError(false);
                    setTextLengthErrorMsg('');
                }

            } else if (v1.valueTypeId == 3 || v1.valueTypeId == 10) {
                if (v1.valueList && v1.valueList.length == 0) {
                    setIsValueListError(true);
                    setValueListErrorMsg('Value list is required');
                    flag = false;
                } else {
                    setIsValueListError(false);
                    setValueListErrorMsg('');
                }
            }
            // else {
            //     flag = true;
            // }
            // flag = true;
        }
        // if (!v1.defaultValue) {
        //     setIsDefaultValueError(true);
        //     setDefaultValueErrorMsg('Custom value type is required');
        //     flag = false;
        // } else {
        //     setIsDefaultValueError(false);
        //     setDefaultValueErrorMsg('');
        //     flag = true;
        // }

        if (v1.allowIncompleteProfile == true) {
            if (!v1.completeprofilesectioname) {
                setIsSectionError(true);
                setSectionErrorMsg(' Section is required');
                flag = false;
            } else {
                setIsSectionError(false);
                setSectionErrorMsg('');
            }
        }
        // if (!v1.valueList) {
        //     setIsValueListError(true);
        //     setValueListErrorMsg('Custom value type is required');
        //     flag = false;
        // } else {
        //     setIsValueListError(false);
        //     setValueListErrorMsg('');
        //     flag = true;
        // }
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

    const handleIsDeleteDialog = async () => {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        let obj = {
            id: v1.id,
            mappedFieldName: v1.mappedFieldName
        };
        const res = await APIservice.httpPost(
            '/api/admin/manageCustomFields/removeCustomfields',
            obj,
            token,
            refreshToken
        );
        if (res && res.status === 200) {
            toast.error(res.recordList, {
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
        }
        setIsDel(false);
        getdata(page * limit, limit);
    };

    const saveCustomField = async (e: any, isSend: boolean) => {
        if (arrayDefaultValue && Array.isArray(arrayDefaultValue) && v1.valueTypeId == 10) {
            arrayDefaultValue = arrayDefaultValue.join(';');
            v1.defaultValue = arrayDefaultValue;
        }
        v1.defaultValue = v1.defaultValue ? v1.defaultValue : null;
        v1.valueList = arrayValueList ? arrayValueList : null
        var flag = validateForm(e);
        if (flag) {
            try {
                // if (arrayDefaultValue && Array.isArray(arrayDefaultValue) && v1.valueTypeId == 10) {
                //     arrayDefaultValue = arrayDefaultValue.join(';');
                //     v1.defaultValue = arrayDefaultValue;
                // }
                // v1.defaultValue = v1.defaultValue ? v1.defaultValue : null;
                // v1.valueList = arrayValueList ? arrayValueList : null
                if (v1.id) {
                    const token = localStorage.getItem('SessionToken');
                    const refreshToken = localStorage.getItem('RefreshToken');
                    let val = v1;
                    v1.isRequired = v1.isRequired == 1 ? true : false;
                    v1.allowInSearch = v1.allowInSearch == 1 ? true : false;
                    v1.allowInFilter = v1.allowInFilter == 1 ? true : false;
                    v1.allowIncompleteProfile = v1.allowIncompleteProfile == 1 ? true : false;
                    v1.allowInPreferences = v1.allowInPreferences == 1 ? true : false;
                    v1.isActive = v1.isActive == 1 ? true : false;
                    v1.isDelete = v1.isDelete == 1 ? true : false;
                    const res = await APIservice.httpPost(
                        '/api/admin/manageCustomFields/insertUpdateCustomField',
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
                    } else if (res.status == 203) {
                        setIsMappedFieldNameError(true);
                        setMappedFieldNameErrorMsg('Field already exists!');
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
                    // v1.valueList = arrayValueList
                    let val = v1;
                    // val = {
                    //     startIndex: startIndex,
                    //     fetchRecord: fetchRecord,
                    //     firstName: searchInput ? searchInput : ''
                    //   };

                    const res = await APIservice.httpPost(
                        '/api/admin/manageCustomFields/insertUpdateCustomField',
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
                    } else if (res.status == 203) {
                        setIsMappedFieldNameError(true);
                        setMappedFieldNameErrorMsg('Field already exists!');
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

        setV1({
            ...v1,
            "valueList": arrayValueList
        });
        console.log(v1)
    };

    const handleClickVisible = (element: any) => {
        let id = element?.id;
        navigate(`/admin/manage-custom-fields/view/${id}`);
    };

    // const truncateDescription = (description) => {
    //     debugger
    //     if (!description) return '-';
    //     const words = description.split(' ');
    //     if (words.length <= 4) return description;
    //     return words.slice(0, 4).join(' ') + '...';
    //   };

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
                <title>Manage Custom Field</title>
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
                                        Manage Custom Fields
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
                                            Create Custom Field
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
                                            {customFields && customFields.length > 0 ? (
                                                <>
                                                    <TableContainer className="religiontableContainer">
                                                        <Table stickyHeader>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell colSpan={3}>
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
                                                                    <TableCell colSpan={3}>
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
                                                                    <TableCell colSpan={3}>
                                                                        <Typography
                                                                            noWrap
                                                                            style={{
                                                                                fontSize: '13px',
                                                                                fontWeight: 'bold',
                                                                                marginBottom: 'none'
                                                                            }}
                                                                        >
                                                                            DisplayName
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
                                                                            Mapped Field Name
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
                                                                            className='description'
                                                                        >
                                                                            Description
                                                                        </Typography>
                                                                    </TableCell>
                                                                    {/* <TableCell colSpan={3}>
                                                                        <Typography
                                                                            noWrap
                                                                            style={{
                                                                                fontSize: '13px',
                                                                                fontWeight: 'bold',
                                                                                marginBottom: 'none'
                                                                            }}
                                                                        >
                                                                            Value Type
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
                                                                            Default Value
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
                                                                            Value List
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
                                                                            IsRequired
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
                                                                            Allow In Search
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
                                                                            Allow In Filter
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
                                                                            Allow In CompleteProfile
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
                                                                            Allow In Preference
                                                                        </Typography>
                                                                    </TableCell> */}

                                                                    <TableCell align="right" colSpan={3}>
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
                                                                {customFields.map((arr: any, index: number) => {
                                                                    return (
                                                                        <TableRow hover key={arr.id}>
                                                                            <TableCell colSpan={3} >
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
                                                                            <TableCell colSpan={3} >
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
                                                                            <TableCell colSpan={3} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {arr.displayName}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell colSpan={3} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {arr.mappedFieldName}
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
                                                                                    {arr.description ? arr.description : '-'}
                                                                                    {/* {truncateDescription(arr.description)} */}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            {/* <TableCell colSpan={3} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {arr.valueTypeName}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell colSpan={3} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {arr.defaultValue ? arr.defaultValue : '-'}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell colSpan={3} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >

                                                                                    {arr.valueList ? arr.valueList.join(',') : '-'}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell colSpan={3} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {arr.isRequired ? 'yes' : 'no'}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell colSpan={3} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {arr.allowInSearch ? 'yes' : 'no'}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell colSpan={3} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {arr.allowInFilter ? 'yes' : 'no'}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell colSpan={3} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {(arr.allowIncompleteProfile == 1) ? 'yes' : 'no'}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell colSpan={3} >
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    fontWeight="bold"
                                                                                    color="text.primary"
                                                                                    gutterBottom
                                                                                    noWrap
                                                                                    sx={{ textTransform: 'capitalize' }}
                                                                                >
                                                                                    {arr.allowInPreferences ? 'yes' : 'no'}
                                                                                </Typography>
                                                                            </TableCell> */}


                                                                            <TableCell colSpan={3}
                                                                                align="right" style={{ whiteSpace: 'nowrap' }}
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

                                                                                    </> : <></>}
                                                                                {isDeletePermission ?
                                                                                    <Tooltip title="Delete" arrow>
                                                                                        <IconButton
                                                                                            disabled={credentail?.email === "demo@admin.com"}
                                                                                            sx={{
                                                                                                '&:hover': { background: theme.colors.error.lighter },
                                                                                                color: theme.palette.primary.main
                                                                                            }}
                                                                                            color="inherit" size="small"
                                                                                            onClick={(e) => handleOpenDeleteDialog(arr.id, arr.mappedFieldName)}>
                                                                                            <DeleteIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                    : <></>}

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
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold', color: '#ff0000', paddingTop: '12px' }}>
                                                                {/* Note: Changes will reflect to app after restart it. */}
                                                                Note: The changes will be visible in the app once restart it. Please restart the App  to see the updates.
                                                            </Typography>
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                                        <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchCheck} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>

                                            <div>
                                                <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
                                                    <DialogTitle
                                                        sx={{ m: 0, p: 2, fontSize: '18px', fontWeight: 'bold' }}
                                                    >
                                                        {v1.id ? 'Edit Custom Field' : 'Add Custom Field'}
                                                        <IconButton
                                                            aria-label="close"
                                                            onClick={handleCloseCustomNotificationDialog}
                                                            sx={{
                                                                position: 'absolute',
                                                                right: 13,
                                                                top: 13,
                                                                color: (theme) => theme.palette.grey[500]
                                                            }}
                                                        >
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </DialogTitle>

                                                    <DialogContent dividers>
                                                        <Row>
                                                            <Col xs={12} md={6}>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="name"
                                                                    label="Custom Field Name"
                                                                    type="text"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    name="name"
                                                                    value={v1.name}
                                                                    onChange={(arr) => {
                                                                        handleFieldNameChange(arr);
                                                                        validateName(arr);
                                                                    }}
                                                                    required={true}
                                                                    disabled={v1.id ? true : false}
                                                                />
                                                                <FormHelperText
                                                                    style={{ color: 'red', height: '22px' }}
                                                                >
                                                                    {isNameError && NameErrorMsg}
                                                                </FormHelperText>


                                                            </Col>
                                                            <Col xs={12} md={6}>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="displayName"
                                                                    label="Custom Field Disply Name"
                                                                    type="text"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    name="displayName"
                                                                    value={v1.displayName}
                                                                    onChange={(arr) => {
                                                                        handleInputChange(arr);
                                                                        validateDisplayName(arr);
                                                                    }}
                                                                    required={true}
                                                                />
                                                                <FormHelperText
                                                                    style={{ color: 'red', height: '22px' }}
                                                                >
                                                                    {isDisplayNameError && DisplayNameErrorMsg}
                                                                </FormHelperText>

                                                            </Col>

                                                        </Row>
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
                                                        <Row>
                                                            <Col xs={12} md={6}>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="mappedFieldName"
                                                                    label="Mapped Field Name"
                                                                    type="text"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    name="mappedFieldName"
                                                                    value={v1.mappedFieldName}
                                                                    onChange={(arr) => {
                                                                        handleMappedFieldNameChange(arr);
                                                                        validateMappedFieldName(arr);
                                                                    }}
                                                                    required={true}
                                                                    disabled={v1.id ? true : false}
                                                                />
                                                                <FormHelperText
                                                                    style={{ color: 'red', height: '22px' }}
                                                                >
                                                                    {isMappedFieldNameError && MappedFieldNameErrorMsg}
                                                                </FormHelperText>
                                                            </Col>
                                                            <Col xs={12} md={6}>
                                                                <FormControl
                                                                    sx={{ width: { lg: 265, md: 265, sm: 265, xs: 200 } }}
                                                                >
                                                                    <InputLabel id="demo-multiple-name-label">
                                                                        Value Type
                                                                    </InputLabel>
                                                                    <Select
                                                                        labelId="demo-multiple-name-label"
                                                                        id="demo-multiple-name"
                                                                        multiple={false}
                                                                        name="valueTypeId"
                                                                        value={v1.valueTypeId || []}
                                                                        onChange={(arr) => {
                                                                            handleInputChange(arr);
                                                                            validateValueType(arr);
                                                                        }}
                                                                        label="Value Type"
                                                                        MenuProps={MenuProps}
                                                                        required={true}
                                                                        disabled={v1.id ? true : false}
                                                                    >
                                                                        {valueType.map((arr: any) => (
                                                                            <MenuItem key={arr.id} value={arr.id}>
                                                                                {arr.valueTypeName}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormHelperText style={{ color: 'red', height: '22px' }}>
                                                                    {isValueTypeError && ValueTypeErrorMsg}
                                                                </FormHelperText>
                                                            </Col>




                                                        </Row>
                                                        {/* </Grid> */}
                                                        {/* <Grid item xs={12}> */}

                                                        {/* <TextField
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
                                                        </FormHelperText> */}
                                                        <Row>

                                                            {/* <Col xs={12} md={6}>
                                                                <FormControl
                                                                    sx={{ width: { lg: 265, md: 265, sm: 265, xs: 200 } }}
                                                                >
                                                                    <InputLabel id="demo-multiple-name-label">
                                                                        Value Type
                                                                    </InputLabel>
                                                                    <Select
                                                                        labelId="demo-multiple-name-label"
                                                                        id="demo-multiple-name"
                                                                        multiple={false}
                                                                        name="valueTypeId"
                                                                        value={v1.valueTypeId || []}
                                                                        onChange={(arr) => {
                                                                            handleInputChange(arr);
                                                                            validateValueType(arr);
                                                                        }}
                                                                        label="Value Type"
                                                                        MenuProps={MenuProps}
                                                                        required={true}
                                                                        disabled={v1.id ? true : false}
                                                                    >
                                                                        {valueType.map((arr: any) => (
                                                                            <MenuItem key={arr.id} value={arr.id}>
                                                                                {arr.valueTypeName}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormHelperText style={{ color: 'red', height: '22px' }}>
                                                                    {isValueTypeError && ValueTypeErrorMsg}
                                                                </FormHelperText>

                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="name"
                                                                    label="Default Value"
                                                                    type="text"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    name="defaultValue"
                                                                    value={v1.defaultValue}
                                                                    onChange={(arr) => {
                                                                        handleInputChange(arr);
                                                                        validateDefaultValue(arr);
                                                                    }}
                                                                    required={true}
                                                                />
                                                                <FormHelperText
                                                                    style={{ color: 'red', height: '22px' }}
                                                                >
                                                                    {isDefaultValueError && DefaultValueErrorMsg}
                                                                </FormHelperText>
                                                            </Col> */}
                                                            {/* <Col xs={12} md={6}>
                                                                <TextField
                                                                    autoFocus
                                                                    margin="dense"
                                                                    id="displayName"
                                                                    label="Value List"
                                                                    type="text"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    name="name"
                                                                    value={v1.valueList}
                                                                    onChange={(arr) => {
                                                                        handleInputChange(arr);
                                                                        validateValueList(arr);
                                                                    }}
                                                                    required={true}
                                                                />
                                                                <FormHelperText
                                                                    style={{ color: 'red', height: '22px' }}
                                                                >
                                                                    {isValueListError && ValueListErrorMsg}
                                                                </FormHelperText>
                                                            </Col> */}

                                                        </Row>
                                                        <Row>
                                                            <Col xs={12} md={6}>
                                                                {(v1.valueTypeId !== 10) ?
                                                                    <>

                                                                        <TextField
                                                                            autoFocus
                                                                            margin="dense"
                                                                            id="defaultValue"
                                                                            label="Default Value"
                                                                            type="text"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            name="defaultValue"
                                                                            value={v1.defaultValue}
                                                                            onChange={(arr) => {
                                                                                handleInputChange(arr);
                                                                                validateDefaultValue(arr);
                                                                            }}
                                                                            required={true}
                                                                        />
                                                                        <FormHelperText
                                                                            style={{ color: 'red', height: '22px' }}
                                                                        >
                                                                            {isDefaultValueError && DefaultValueErrorMsg}
                                                                        </FormHelperText>

                                                                    </> :
                                                                    <>

                                                                        <Row>
                                                                            <FormGroup style={{ display: "flex" }}>
                                                                                <TextField
                                                                                    autoFocus
                                                                                    margin="dense"
                                                                                    id="defaultValuet"
                                                                                    label="Default Value"
                                                                                    type="text"
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    name="singleValueOfDefaultValue"
                                                                                    value={singleValueOfDefaultValue}
                                                                                    onChange={(arr) => {
                                                                                        arr.target.value = arr.target.value === "" ? null : arr.target.value
                                                                                        handleDefaultValueInputChange(arr);
                                                                                        // handleInputChange(arr);
                                                                                        validateDefaultValueList(arr);
                                                                                    }}
                                                                                /><Button
                                                                                    sx={{ mt: 0.5 }}
                                                                                    variant="outlined"
                                                                                    onClick={handleAddDefaultValue}
                                                                                    style={{ border: "0px", borderLeft: '1px solid #ced4da', borderRadius: '0px', margin: '13px 0px 8px -68px' }}>
                                                                                    Add
                                                                                </Button>
                                                                            </FormGroup>
                                                                            <FormHelperText
                                                                                style={{ color: 'red', height: '22px' }}
                                                                            >
                                                                                {isDefaultValueError && DefaultValueErrorMsg}
                                                                            </FormHelperText>
                                                                        </Row>
                                                                        {/* <Col lg={1}
                                                                        md={1}
                                                                        sm={1}
                                                                        xs={1}>
                                                                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                                                                            <Button
                                                                                sx={{ mt: 0.5 }}
                                                                                variant="outlined"
                                                                                onClick={handleAddValueList}
                                                                            >
                                                                                Add
                                                                            </Button>
                                                                        </div>
                                                                    </Col> */}
                                                                        {(arrayDefaultValue && arrayDefaultValue.length > 0) && <Card style={card}>
                                                                            <Row>

                                                                                {arrayDefaultValue.map((value, index) => (
                                                                                    <Col
                                                                                        lg={3}
                                                                                        md={4}
                                                                                        sm={6}
                                                                                        xs={12}
                                                                                        key={index}
                                                                                        label={value}
                                                                                        style={{
                                                                                            // paddingLeft: '4%',
                                                                                            // paddingTop: '1.4%',
                                                                                            paddingBottom: '1.4%'
                                                                                        }}
                                                                                    >
                                                                                        <Chip
                                                                                            key={index}
                                                                                            label={value}
                                                                                            onDelete={(e) => {
                                                                                                handleDeleteDefaultValue(index);
                                                                                            }}
                                                                                        >
                                                                                            {value}
                                                                                        </Chip>
                                                                                    </Col>
                                                                                ))}
                                                                            </Row></Card>}

                                                                        {/* <Divider /> */}
                                                                        {/* </Card> */}
                                                                    </>
                                                                }
                                                            </Col>


                                                            {(v1.valueTypeId == 3 || v1.valueTypeId == 10) &&
                                                                <>
                                                                    <Col xs={12} md={6}>
                                                                        {/* <Card sx={{ my: 1 }} style={{ height: 'auto' }}>
                                                                <CardHeader title="Value List" /> */}
                                                                        <Row >
                                                                            {/* <InputLabel id="value List" style={{ color: '#223354', fontWeight: '700', fontSize: '15px', margin: '13px 0px' }}>
                                                                        Value List
                                                                    </InputLabel> */}


                                                                            <FormGroup style={{ display: "flex" }}>
                                                                                <TextField
                                                                                    autoFocus
                                                                                    margin="dense"
                                                                                    id="value List"
                                                                                    label="Value List"
                                                                                    type="text"
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    name="singleValueOfValueList"
                                                                                    value={singleValueOfValueList}
                                                                                    onChange={(arr) => {
                                                                                        handleValueListInputChange(arr);
                                                                                        validateValueList(arr);
                                                                                    }}
                                                                                /><Button
                                                                                    sx={{ mt: 0.5 }}
                                                                                    variant="outlined"
                                                                                    onClick={handleAddValueList}
                                                                                    style={{ border: "0px", borderLeft: '1px solid #ced4da', borderRadius: '0px', margin: '13px 0px 8px -68px' }}>
                                                                                    Add
                                                                                </Button>
                                                                            </FormGroup>
                                                                            <FormHelperText
                                                                                style={{ color: 'red', height: '22px' }}
                                                                            >
                                                                                {isValueListError && ValueListErrorMsg}
                                                                            </FormHelperText>

                                                                            {/* <Col lg={2}
                                                                        md={2}
                                                                        sm={2}
                                                                        xs={2}>
                                                                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                                                                            <Button
                                                                                sx={{ mt: 0.5 }}
                                                                                variant="outlined"
                                                                                onClick={handleAddValueList}
                                                                            >
                                                                                Add
                                                                            </Button>
                                                                        </div>
                                                                    </Col> */}
                                                                        </Row>
                                                                        {(arrayValueList && arrayValueList.length > 0) && <Card style={card}>
                                                                            <Row>

                                                                                {arrayValueList.map((value, index) => (
                                                                                    <Col
                                                                                        lg={3}
                                                                                        md={4}
                                                                                        sm={6}
                                                                                        xs={12}
                                                                                        key={index}
                                                                                        label={value}
                                                                                        style={{
                                                                                            // paddingLeft: '4%',
                                                                                            // paddingTop: '1.4%',
                                                                                            paddingBottom: '1.4%'
                                                                                        }}
                                                                                    >
                                                                                        <Chip
                                                                                            key={index}
                                                                                            label={value}
                                                                                            onDelete={(e) => {
                                                                                                handleDeleteValueList(index);
                                                                                            }}
                                                                                        >
                                                                                            {value}
                                                                                        </Chip>
                                                                                    </Col>
                                                                                ))}
                                                                            </Row></Card>}
                                                                        {/* <Divider /> */}
                                                                        {/* </Card> */} </Col>
                                                                </>
                                                            }



                                                            {(v1.valueTypeId == 1) &&
                                                                <Col xs={12} md={6}>
                                                                    <TextField
                                                                        autoFocus
                                                                        margin="dense"
                                                                        id="textLength"
                                                                        label="Text length"
                                                                        type="number"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        name="textLength"
                                                                        value={v1.textLength}
                                                                        onChange={(arr) => {
                                                                            const inputValue = parseInt(arr.target.value);
                                                                            handleInputChange(arr);
                                                                            validateTextLength(inputValue);


                                                                        }}
                                                                        inputProps={{ maxLength: 3 }}
                                                                        disabled={v1.id ? true : false}
                                                                    />
                                                                    <FormHelperText
                                                                        style={{ color: 'red', height: '22px' }}
                                                                    >
                                                                        {isTextLengthError && TextLengthErrorMsg}
                                                                    </FormHelperText>
                                                                </Col>}
                                                        </Row>
                                                        <Row>
                                                            <Col xs={12} md={6}>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={6} sm={6} md={6}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                Is Required {' '}
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={6} md={6}>
                                                                            <Box>
                                                                                <Switch
                                                                                    checked={
                                                                                        (v1.isRequired) ? true : false
                                                                                    }
                                                                                    onClick={(e) =>
                                                                                        handleSwitchIsRequired(e)
                                                                                    }
                                                                                    inputProps={{
                                                                                        'aria-label': 'controlled'
                                                                                    }}
                                                                                />                                                                   </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                {/* Is Required <Switch
                                                                    checked={
                                                                        (v1.isRequired) ? true : false
                                                                    }
                                                                    onClick={(e) =>
                                                                        handleSwitchIsRequired(e)
                                                                    }
                                                                    inputProps={{
                                                                        'aria-label': 'controlled'
                                                                    }}
                                                                /> */}
                                                            </Col>
                                                            <Col xs={12} md={6}>
                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={6} sm={6} md={6}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                Allow In Search {' '}
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={6} md={6}>
                                                                            <Box>
                                                                                <Switch
                                                                                    checked={
                                                                                        (v1.allowInSearch) ? true : false
                                                                                    }
                                                                                    onClick={(e) =>
                                                                                        handleSwitchAllowInSearch(e)
                                                                                    }
                                                                                    inputProps={{
                                                                                        'aria-label': 'controlled'
                                                                                    }}
                                                                                />                                                                   </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                {/* Allow In Search <Switch
                                                                    checked={
                                                                        (v1.allowInSearch) ? true : false
                                                                    }
                                                                    onClick={(e) =>
                                                                        handleSwitchAllowInSearch(e)
                                                                    }
                                                                    inputProps={{
                                                                        'aria-label': 'controlled'
                                                                    }}
                                                                /> */}

                                                            </Col>
                                                            <Col xs={12} md={6}>

                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={6} sm={6} md={6}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                Allow In Filter {' '}
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={6} md={6}>
                                                                            <Box>
                                                                                <Switch
                                                                                    checked={
                                                                                        (v1.allowInFilter) ? true : false
                                                                                    }
                                                                                    onClick={(e) =>
                                                                                        handleSwitchAllowInFilter(e)
                                                                                    }
                                                                                    inputProps={{
                                                                                        'aria-label': 'controlled'
                                                                                    }}
                                                                                />                                                                    </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                {/* Allow In Filter <Switch
                                                                    checked={
                                                                        (v1.allowInFilter) ? true : false
                                                                    }
                                                                    onClick={(e) =>
                                                                        handleSwitchAllowInFilter(e)
                                                                    }
                                                                    inputProps={{
                                                                        'aria-label': 'controlled'
                                                                    }}
                                                                /> */}
                                                            </Col>

                                                            <Col xs={12} md={6}>

                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={6} sm={6} md={6}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                Allow In Preferences {' '}
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={6} md={6}>
                                                                            <Box>
                                                                                <Switch
                                                                                    checked={
                                                                                        (v1.allowInPreferences) ? true : false
                                                                                    }
                                                                                    onClick={(e) =>
                                                                                        handleSwitchAllowInPreferences(e)
                                                                                    }
                                                                                    inputProps={{
                                                                                        'aria-label': 'controlled'
                                                                                    }}
                                                                                />                                                                     </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                {/* Allow In Preferences <Switch
                                                                    checked={
                                                                        (v1.allowInPreferences) ? true : false
                                                                    }
                                                                    onClick={(e) =>
                                                                        handleSwitchAllowInPreferences(e)
                                                                    }
                                                                    inputProps={{
                                                                        'aria-label': 'controlled'
                                                                    }}
                                                                /> */}
                                                            </Col>
                                                            <Col xs={12} md={6}>


                                                                <Typography gutterBottom variant="h6">
                                                                    <Grid container>
                                                                        <Grid item xs={6} sm={6} md={6}>
                                                                            <Box display="flex" alignItems="flex-start">
                                                                                Allow In CompleteProfile{' '}
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={6} md={6}>
                                                                            <Box>
                                                                                <Switch
                                                                                    checked={
                                                                                        (v1.allowIncompleteProfile) ? true : false
                                                                                    }
                                                                                    onClick={(e) =>
                                                                                        handleSwitchAllowIncompleteProfile(e)
                                                                                    }
                                                                                    inputProps={{
                                                                                        'aria-label': 'controlled'
                                                                                    }}
                                                                                />                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Typography>
                                                                {/* Allow In CompleteProfile <Switch
                                                                        checked={
                                                                            (v1.allowIncompleteProfile) ? true : false
                                                                        }
                                                                        onClick={(e) =>
                                                                            handleSwitchAllowIncompleteProfile(e)
                                                                        }
                                                                        inputProps={{
                                                                            'aria-label': 'controlled'
                                                                        }}
                                                                    /> */}

                                                            </Col>
                                                        </Row>
                                                        {/* <Row style={{ marginTop: "20px" }}>



                                                        </Row> */}
                                                        {(v1.allowIncompleteProfile == true) &&
                                                            <Row style={{ marginTop: "5px" }}>
                                                                <Col xs={12} md={6}>
                                                                    <FormControl
                                                                        sx={{ width: { lg: 265, md: 265, sm: 265, xs: 200 } }}
                                                                    >
                                                                        <InputLabel id="demo-multiple-name-label">
                                                                            Section
                                                                        </InputLabel>
                                                                        <Select
                                                                            labelId="demo-multiple-name-label"
                                                                            id="demo-multiple-name"
                                                                            multiple={false}
                                                                            name="completeprofilesectioname"
                                                                            value={v1.completeprofilesectioname || []}
                                                                            onChange={(arr) => {
                                                                                handleInputChange(arr);
                                                                                validateSection(arr);
                                                                            }}
                                                                            label="Value Type"
                                                                            MenuProps={MenuProps}
                                                                            required={true}
                                                                        >
                                                                            {profileSection.map((arr: any) => (
                                                                                <MenuItem key={arr.value} value={arr.value}>
                                                                                    {arr.value}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <FormHelperText style={{ color: 'red', height: '22px' }}>
                                                                        {isSectionError && SectionErrorMsg}
                                                                    </FormHelperText>
                                                                </Col>
                                                            </Row>}
                                                    </DialogContent>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            p: '8px'
                                                        }}
                                                    >
                                                        {/* <FormHelperText
                                                            style={{
                                                                color: 'red',
                                                                height: '22px',
                                                                margin: 'none',
                                                                padding: '8px'
                                                            }}
                                                        >
                                                        </FormHelperText>  */}
                                                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#ff0000', padding: '10px' }}>
                                                            {/* Note: Changes will reflect to app after restart it. */}
                                                            Note: The changes will be visible in the app once restart it. Please restart the App  to see the updates.
                                                        </Typography>
                                                        <div>
                                                            <Button onClick={handleCloseCustomNotificationDialog} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => { saveCustomField(e, false) }} variant="outlined" style={{ marginRight: '10px' }}>Save</Button>
                                                        </div>
                                                    </Box>
                                                </Dialog>
                                            </div>
                                            <div>
                                                <Dialog open={isDel} onClose={handleClose} fullWidth maxWidth="xs">
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
                                                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold', color: '#ff0000', paddingTop: '12px' }}>
                                                                {/* Note: Changes will reflect to app after restart it. */}
                                                                Note: The changes will be visible in the app once restart it. Please restart the App  to see the updates.
                                                            </Typography>
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                                        <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleIsDeleteDialog} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
                                                    </DialogActions>
                                                </Dialog>
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

export default ManageCustomFields;