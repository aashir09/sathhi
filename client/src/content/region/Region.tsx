import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from '../../components/PageTitleWrapper';
import { ToastContainer, toast } from 'react-toastify';
import { Box, Breadcrumbs, Button, Card, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormGroup, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography, styled, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import LoaderSmallCard from '../dashboards/loaderDashboard';
import RegionLoader from './regionLoader';
import '../../content/smallScreen.css';
import AddIcon from '@mui/icons-material/Add';
import APIservice from 'src/utils/APIservice';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Country } from 'src/models/country';
import { States } from 'src/models/state';
import { Districts } from 'src/models/districts';
import { Cities } from 'src/models/cities';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CSVLink } from 'react-csv';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1)
    },
    '& .MuiPaper-root': {
        minHeight: '500px'
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

const initialCountryState = {
    id: 0,
    name: "",
    isoCode: "",
    isoCode3: "",
    dialCode: "",
    isActive: true,
    isDelete: false,
    createdDate: null,
    modifiedDate: null,
    isDefult: false
}
const initialState = {
    id: 0,
    name: "",
    countryId: 0,
    code: null,
    isActive: true,
    isDelete: false,
    createdDate: null,
    modifiedDate: null,
    countryName: null
}
const initialDistrictState = {
    id: 0,
    stateId: 0,
    name: "",
    isActive: true,
    isDelete: false,
    createdDate: null,
    modifiedDate: null,
    countryId: 0,
    countryName: null,
    stateName: null
}
const initialCityState = {
    id: 0,
    districtId: 0,
    name: "",
    pincode: '',
    isActive: true,
    isDelete: false,
    createdDate: null,
    modifiedDate: null,
    countryId: 0,
    countryName: null,
    stateId: 0,
    stateName: null,
    districtName: null
}

const Region = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isLoadingCountry, setIsLoadingCountry] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [row, setRow] = useState<number>(10);
    const [countries, setCountries] = useState<Country[]>([]);
    const [allCountries, setAllCountries] = useState<Country[]>([]);
    let [selectCountry, setSelectCountry] = useState<Country>()
    const [country, setCountry] = useState<Country>(initialCountryState);
    const [isOpenCountry, setIsOpenCountry] = useState<boolean>(false);
    const [isNameError, setIsNameError] = useState<boolean>(false);
    const [nameErrorMsg, setNameErrorMsg] = useState<string>("");
    const [isIsoCodeError, setIsoCodeError] = useState<boolean>(false);
    const [isoCodeErrorMsg, setIsoCodeErrorMsg] = useState<string>("");
    const [isIsoCode3Error, setIsoCode3Error] = useState<boolean>(false);
    const [isoCode3ErrorMsg, setIsoCode3ErrorMsg] = useState<string>("");
    const [isCountryDialCodeError, setCountryDialCodeError] = useState<boolean>(false);
    const [CountryDialCodeErrorMsg, setCountryDialCodeErrorMsg] = useState<string>("");
    const [isCheckCountry, setIsCheckCountry] = useState(false);

    const [isLoadingState, setIsLoadingState] = useState<boolean>(false);
    const [pageState, setPageState] = useState<number>(0);
    const [limitState, setLimitState] = useState<number>(10);
    const [rowState, setRowState] = useState<number>(10);
    const [states, setStates] = useState<States[]>([]);
    const [allStates, setAllStates] = useState<States[]>([]);
    let [selectState, setSelectState] = useState<States>();
    const [state, setState] = useState<States>(initialState);
    const [isOpenState, setIsOpenState] = useState<boolean>(false);
    const [isStateNameError, setIsStateNameError] = useState<boolean>(false);
    const [stateNameErrorMsg, setStateNameErrorMsg] = useState<string>("");
    const [isCountryIdError, setIsCountryIdError] = useState<boolean>(false);
    const [countryIdErrorMsg, setCountryIdErrorMsg] = useState<string>("");
    const [isCheckState, setIsCheckState] = useState(false);

    const [isLoadingDistrict, setIsLoadingDistrict] = useState<boolean>(false);
    const [pageDistrict, setPageDistrict] = useState<number>(0);
    const [limitDistrict, setLimitDistrict] = useState<number>(10);
    const [rowDistrict, setRowDistrict] = useState<number>(10);
    const [districts, setDistricts] = useState<Districts[]>([]);
    const [allDistricts, setAllDistricts] = useState<Districts[]>([]);
    let [selectDistrict, setSelectDistrict] = useState<Districts>();
    const [district, setDistrict] = useState<Districts>(initialDistrictState);
    const [isOpenDistrict, setIsOpenDistrict] = useState<boolean>(false);
    const [isDistrictNameError, setIsDistrictNameError] = useState<boolean>(false);
    const [districtNameErrorMsg, setDistrictNameErrorMsg] = useState<string>("");
    const [isStateIdError, setIsStateIdError] = useState<boolean>(false);
    const [stateIdErrorMsg, setStateIdErrorMsg] = useState<string>("");
    const [isCheckDistrict, setIsCheckDistrict] = useState(false);

    const [isLoadingCity, setIsLoadingCity] = useState<boolean>(false);
    const [pageCity, setPageCity] = useState<number>(0);
    const [limitCity, setLimitCity] = useState<number>(10);
    const [rowCity, setRowCity] = useState<number>(10);
    const [cities, setCities] = useState<Cities[]>([]);
    let [selectCity, setSelectCity] = useState<Cities>();
    const [city, setCity] = useState<Cities>(initialCityState);
    const [isOpenCity, setIsOpenCity] = useState<boolean>(false);
    const [isCityNameError, setIsCityNameError] = useState<boolean>(false);
    const [cityNameErrorMsg, setCityNameErrorMsg] = useState<string>("");
    const [isPincodeError, setIsPincodeError] = useState<boolean>(false);
    const [pincodeErrorMsg, setPincodeErrorMsg] = useState<string>("");
    const [isDistrictIdError, setIsDistrictIdError] = useState<boolean>(false);
    const [districtIdErrorMsg, setDistrictIdErrorMsg] = useState<string>("");
    const [isCheckCity, setIsCheckCity] = useState(false);
    let [credentail, setCredentail] = useState<any>();

    const [downloadSample, setDownloadSample] = useState<any[]>([]);
    const [regionData, setRegionData] = useState<any[]>([]);

    const inputFile: any = useRef(null);
    const fileReader = new FileReader();

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
                        loadData();
                }
            } else {
                loadData();
            }
        }

    }, []);

    const loadData = async () => {

        setSelectCountry(new Country());
        setSelectState(new States());
        setSelectDistrict(new Districts());
        setSelectCity(new Cities());

        await getCountry(page, limit);
        await getState(pageState, limitState);
        await getDistrict(pageDistrict, limitDistrict);
        await getCity(pageCity, limitCity);
    }

    //#region Country
    const getCountry = async (startIndex: number, fetchRecord: number) => {
        try {
            setIsLoadingCountry(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                startIndex: startIndex,
                fetchRecord: fetchRecord
            };
            const res = await APIservice.httpPost(
                '/api/admin/region/getCountries',
                obj,
                token,
                refreshToken
            );
            if (res.recordList && res.recordList.length > 0) {
                for (let i = 0; i < res.recordList.length; i++) {
                    res.recordList[i].isActive = res.recordList[i].isActive ? true : false;
                    res.recordList[i].isDelete = res.recordList[i].isDelete ? true : false;
                }
            }
            setCountries(res.recordList);
            setRow(res.totalRecords);
            const res1 = await APIservice.httpPost(
                '/api/admin/region/getCountries',
                {},
                token,
                refreshToken
            );
            setAllCountries(res1.recordList);
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
            setIsLoadingCountry(false);
        } catch (error) {
            setIsLoadingCountry(false);
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

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
        getCountry(newPage * limit, limit);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
        setPage(0);
        getCountry(0, parseInt(event.target.value));
    };

    const handleClickOpenCountryDialog = (e: any) => {
        clearCountryError();
        setCountry(initialCountryState);
        setIsOpenCountry(true);
    }

    const handleClickCloseCountryDialog = () => {
        clearCountryError();
        setCountry(initialCountryState);
        setIsOpenCountry(false);
    }

    const clearCountryError = () => {
        setIsNameError(false);
        setNameErrorMsg('');
        setIsoCodeError(false);
        setIsoCodeErrorMsg('');
        setIsoCode3Error(false);
        setIsoCode3ErrorMsg('');
        setCountryDialCodeError(false);
        setCountryDialCodeErrorMsg('');
    }

    const handleInputChange = (arr: any) => {
        const { name, value } = arr.target;
        setCountry({ ...country, [name]: value });
    };

    const validateName = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsNameError(false);
            setNameErrorMsg('');
        } else {
            setIsNameError(true);
            setNameErrorMsg('Country Name is required');
        }
    };

    const validateIsoCode = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsoCodeError(false);
            setIsoCodeErrorMsg('');
        } else {
            setIsoCodeError(true);
            setIsoCodeErrorMsg('Country ISO Code is required');
        }
    };

    const validateIso3Code = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsoCode3Error(false);
            setIsoCode3ErrorMsg('');
        } else {
            setIsoCode3Error(true);
            setIsoCode3ErrorMsg('Country ISO Code is required');
        }
    };

    const validateCountryDialCode = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setCountryDialCodeError(false);
            setCountryDialCodeErrorMsg('');
        } else {
            setCountryDialCodeError(true);
            setCountryDialCodeErrorMsg('Country Dial Code is required');
        }
    };

    const validateCountry = () => {
        let flag = true;
        if (country.name) {
            setIsNameError(false);
            setNameErrorMsg('');
        } else {
            flag = false
            setIsNameError(true);
            setNameErrorMsg('Country Name is required');
        }
        if (country.isoCode) {
            setIsoCodeError(false);
            setIsoCodeErrorMsg('');
        } else {
            flag = false
            setIsoCodeError(true);
            setIsoCodeErrorMsg('Country ISO Code is required');
        }
        if (country.isoCode3) {
            setIsoCode3Error(false);
            setIsoCode3ErrorMsg('');
        } else {
            flag = false
            setIsoCode3Error(true);
            setIsoCode3ErrorMsg('Country ISO Code is required');
        }
        if (country.dialCode) {
            setCountryDialCodeError(false);
            setCountryDialCodeErrorMsg('');
        } else {
            flag = false
            setCountryDialCodeError(true);
            setCountryDialCodeErrorMsg('Country Dial Code is required');
        }
        return flag;
    }

    const savecountry = async (e: any) => {
        e.preventDefault();
        let flag = validateCountry();
        if (flag) {
            try {
                setIsLoadingCountry(true);
                const token = localStorage.getItem('SessionToken');
                const refreshToken = localStorage.getItem('RefreshToken');
                if (country.id) {
                    let res = await APIservice.httpPost('/api/admin/region/updateCountry', country, token, refreshToken);
                    if (res && res.status == 200) {
                        // await getCountry(page, limit);
                        await getCountry(page, limit);
                        await getState(pageState, limitState);
                        await getDistrict(pageDistrict, limitDistrict);
                        await getCity(pageCity, limitCity);
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
                    handleClickCloseCountryDialog();
                } else {
                    let res = await APIservice.httpPost('/api/admin/region/insertCountry', country, token, refreshToken);
                    if (res && res.status == 200) {
                        // await getCountry(page, limit);
                        await getCountry(page, limit);
                        await getState(pageState, limitState);
                        await getDistrict(pageDistrict, limitDistrict);
                        await getCity(pageCity, limitCity);
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
                    handleClickCloseCountryDialog();
                }
                setIsLoadingCountry(false);
            } catch (error) {
                setIsLoadingCountry(false);
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
    }

    const handleSwitchCountry = (item: Country) => {
        setCountry(item);
        setIsCheckCountry(true);
    }

    const handleCloseSwitchCountry = () => {
        setCountry(initialCountryState);
        setIsCheckCountry(false);
    }

    const handleSwitchCountryCheck = async (e: any) => {
        e.preventDfault();
        try {
            setIsLoadingCountry(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let res = await APIservice.httpPost('/api/admin/region/insertCountry', country, token, refreshToken);
            if (res && res.status == 200) {
                await getCountry(page, limit);
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
            handleCloseSwitchCountry();
            setIsLoadingCountry(false);
        } catch (error) {
            setIsLoadingCountry(false);
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

    const handleClickOpenEditCountryDialog = (item: Country) => {
        debugger
        item.isDefult = item.isDefult ? true : false
        clearCountryError();
        setCountry(item);
        setIsOpenCountry(true);
    }

    const isSelected = (id: number) => (selectCountry && selectCountry?.id === id) ? true : false;
    const handleLoadState = async (e: any, item: Country) => {
        let country = countries;
        let ind = country.findIndex(c => c.id == item.id);
        let _ind = (selectCountry?.id === country[ind].id);
        setSelectState(new States());
        setSelectDistrict(new Districts());
        setSelectCity(new Cities());
        if (_ind) {
            let obj = new Country();
            setSelectCountry(obj);
            await getState(0, limitState);
            await getDistrict(0, limitDistrict);
            await getCity(0, limitCity);
        } else {
            setSelectCountry(country[ind]);
            await getState(0, limitState, country[ind].id);
            await getDistrict(0, limitDistrict, null, country[ind].id);
            await getCity(0, limitCity, null, null, country[ind].id);
        }
    }
    //#endregion Country

    //#region State
    const getState = async (startIndex: number, fetchRecord: number, countryId?: number) => {
        try {
            setIsLoadingState(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                startIndex: startIndex,
                fetchRecord: fetchRecord,
                countryId: countryId
            };
            const res = await APIservice.httpPost(
                '/api/admin/region/getStates',
                obj,
                token,
                refreshToken
            );
            if (res.recordList && res.recordList.length > 0) {
                for (let i = 0; i < res.recordList.length; i++) {
                    res.recordList[i].isActive = res.recordList[i].isActive ? true : false;
                    res.recordList[i].isDelete = res.recordList[i].isDelete ? true : false;
                }
            }
            setStates(res.recordList);
            setRowState(res.totalRecords);
            // const res1 = await APIservice.httpPost(
            //     '/api/admin/region/getStates',
            //     {},
            //     token,
            //     refreshToken
            // );
            // setAllStates(res1.recordList);
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
            setIsLoadingState(false);
        } catch (error) {
            setIsLoadingState(false);
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

    const handleStatePageChange = (event: any, newPage: number): void => {
        setPageState(newPage);
        getState(newPage * limitState, limitState);
    };

    const handleStateLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimitState(parseInt(event.target.value));
        setPageState(0);
        getState(0, parseInt(event.target.value));
    };

    const handleClickOpenStateDialog = (e: any) => {
        clearStateError();
        setState(initialState);
        setIsOpenState(true);

    }

    const handleClickCloseStateDialog = () => {
        clearStateError();
        setState(initialState);
        setIsOpenState(false);
    }

    const clearStateError = () => {
        setIsStateNameError(false);
        setStateNameErrorMsg('');
        setIsCountryIdError(false);
        setCountryIdErrorMsg('');
    }

    const handleInputStateChange = (arr: any) => {
        const { name, value } = arr.target;
        setState({ ...state, [name]: value });
    };

    const validateStateName = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsStateNameError(false);
            setStateNameErrorMsg('');
        } else {
            setIsStateNameError(true);
            setStateNameErrorMsg('State Name is required');
        }
    };

    const validateStateCountryId = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsCountryIdError(false);
            setCountryIdErrorMsg('');
        } else {
            setIsCountryIdError(true);
            setCountryIdErrorMsg('Country is required');
        }
    };

    const validateState = () => {
        let flag = true;
        if (state.countryId) {
            setIsCountryIdError(false);
            setCountryIdErrorMsg('');
        } else {
            setIsCountryIdError(true);
            setCountryIdErrorMsg('Country is required');
        }
        if (state.name) {
            setIsStateNameError(false);
            setStateNameErrorMsg('');
        } else {
            setIsStateNameError(true);
            setStateNameErrorMsg('State Name is required');
        }
        return flag;
    }

    const saveState = async (e: any) => {
        e.preventDefault();
        let flag = validateState();
        if (flag) {
            try {
                setIsLoadingState(true);
                const token = localStorage.getItem('SessionToken');
                const refreshToken = localStorage.getItem('RefreshToken');
                if (state.id) {
                    let res = await APIservice.httpPost('/api/admin/region/updateState', state, token, refreshToken);
                    if (res && res.status == 200) {
                        // await getState(pageState, limitState);

                        await getCountry(page, limit);
                        await getState(pageState, limitState);
                        await getDistrict(pageDistrict, limitDistrict);
                        await getCity(pageCity, limitCity);
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
                    handleClickCloseStateDialog();
                } else {
                    let res = await APIservice.httpPost('/api/admin/region/insertState', state, token, refreshToken);
                    if (res && res.status == 200) {
                        // await getState(pageState, limitState);
                        await getCountry(page, limit);
                        await getState(pageState, limitState);
                        await getDistrict(pageDistrict, limitDistrict);
                        await getCity(pageCity, limitCity);
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
                    handleClickCloseStateDialog();
                }
                setIsLoadingState(false);
            } catch (error) {
                setIsLoadingState(false);
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
    }

    const handleSwitchState = (item: States) => {
        setState(item);
        setIsCheckState(true);
    }

    const handleCloseSwitchState = () => {
        setCountry(initialCountryState);
        setIsCheckCountry(false);
    }

    const handleSwitchStateCheck = async (e: any) => {
        e.preventDfault();
        try {
            setIsLoadingState(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let res = await APIservice.httpPost('/api/admin/region/activeInactiveState', state, token, refreshToken);
            setIsLoadingState(false);
            if (res && res.status == 200) {
                await getState(pageState, limitState);
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
        } catch (error) {
            setIsLoadingState(false);
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

    const handleClickOpenEditStateDialog = (item: States) => {
        clearStateError();
        setState(item);
        setIsOpenState(true);
    }

    const isSelectedState = (id: number) => (selectState && selectState?.id === id) ? true : false;
    const handleLoadDistrict = async (e: any, item: States) => {
        let state = states;
        let ind = state.findIndex(c => c.id == item.id);
        let _ind = (selectState?.id === state[ind].id);
        setSelectDistrict(new Districts());
        setSelectCity(new Cities());
        if (_ind) {
            let obj = new States();
            setSelectState(obj);
            let countryId = selectCountry.id ? selectCountry.id : null;
            await getDistrict(0, limitDistrict, null, countryId);
            await getCity(0, limitCity, null, null, countryId);
        } else {
            setSelectState(state[ind]);
            await getDistrict(0, limitDistrict, state[ind].id);
            await getCity(0, limitCity, null, state[ind].id, null);
        }
    }
    //#endregion State

    //#region  District
    const getDistrict = async (startIndex: number, fetchRecord: number, stateId?: number, countryId?: number) => {
        try {
            setIsLoadingDistrict(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                startIndex: startIndex,
                fetchRecord: fetchRecord,
                stateId: stateId,
                countryId: countryId
            };
            const res = await APIservice.httpPost(
                '/api/admin/region/getDistricts',
                obj,
                token,
                refreshToken
            );
            if (res.recordList && res.recordList.length > 0) {
                for (let i = 0; i < res.recordList.length; i++) {
                    res.recordList[i].isActive = res.recordList[i].isActive ? true : false;
                    res.recordList[i].isDelete = res.recordList[i].isDelete ? true : false;
                }
            }
            setDistricts(res.recordList);
            setRowDistrict(res.totalRecords);
            // const res1 = await APIservice.httpPost(
            //     '/api/admin/region/getDistricts',
            //     {},
            //     token,
            //     refreshToken
            // );
            // setAllDistricts(res1.recordList);
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
            setIsLoadingDistrict(false);
        } catch (error) {
            setIsLoadingDistrict(false);
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

    const handleDistrictPageChange = (event: any, newPage: number): void => {
        setPageDistrict(newPage);
        getDistrict(newPage * limitDistrict, limitDistrict);
    };

    const handleDistrictLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimitDistrict(parseInt(event.target.value));
        setPageDistrict(0);
        getDistrict(0, parseInt(event.target.value));
    };

    const handleClickOpenDistrictDialog = (e: any) => {
        clearDistrictError();
        setDistrict(initialDistrictState);
        setIsOpenDistrict(true);
    }

    const handleClickCloseDistrictDialog = () => {
        clearDistrictError();
        setDistrict(initialDistrictState);
        setIsOpenDistrict(false);
    }

    const clearDistrictError = () => {
        setIsDistrictNameError(false);
        setDistrictNameErrorMsg('');
        setIsCountryIdError(false);
        setCountryIdErrorMsg('');
        setIsStateIdError(false);
        setStateIdErrorMsg('');
    }

    const handleInputDistrictChange = (arr: any) => {
        const { name, value } = arr.target;
        setDistrict({ ...district, [name]: value });
    };

    const validateDistrictName = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsDistrictNameError(false);
            setDistrictNameErrorMsg('');
        } else {
            setIsDistrictNameError(true);
            setDistrictNameErrorMsg('District Name is required');
        }
    };

    const validateDistrictStateId = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsStateIdError(false);
            setStateIdErrorMsg('');
        } else {
            setIsStateIdError(true);
            setStateIdErrorMsg('State is required');
        }
    };

    const validateDistrictCountryId = async (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsCountryIdError(false);
            setCountryIdErrorMsg('');
        } else {
            setIsCountryIdError(true);
            setCountryIdErrorMsg('Country is required');
        }
        try {
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                countryId: value
            };
            const res1 = await APIservice.httpPost(
                '/api/admin/region/getStates',
                obj,
                token,
                refreshToken
            );
            setAllStates(res1.recordList);
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
        }
    };

    const validateDistrict = () => {
        let flag = true;
        if (district.countryId) {
            setIsCountryIdError(false);
            setCountryIdErrorMsg('');
        } else {
            flag = false;
            setIsCountryIdError(true);
            setCountryIdErrorMsg('Country is required');
        }
        if (district.stateId) {
            setIsStateIdError(false);
            setStateIdErrorMsg('');
        } else {
            setIsStateIdError(true);
            setStateIdErrorMsg('State is required');
        }
        if (district.name) {
            setIsDistrictNameError(false);
            setDistrictNameErrorMsg('');
        } else {
            setIsDistrictNameError(true);
            setDistrictNameErrorMsg('District Name is required');
        }
        return flag;
    }

    const saveDistrict = async (e: any) => {
        e.preventDefault();
        let flag = validateDistrict();
        if (flag) {
            try {
                setIsLoadingDistrict(true);
                const token = localStorage.getItem('SessionToken');
                const refreshToken = localStorage.getItem('RefreshToken');
                if (district.id) {
                    let res = await APIservice.httpPost('/api/admin/region/updateDistrict', district, token, refreshToken);
                    if (res && res.status == 200) {
                        // await getDistrict(pageDistrict, limitDistrict);
                        await getCountry(page, limit);
                        await getState(pageState, limitState);
                        await getDistrict(pageDistrict, limitDistrict);
                        await getCity(pageCity, limitCity);
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
                    handleClickCloseDistrictDialog();
                } else {
                    let res = await APIservice.httpPost('/api/admin/region/insertDistrict', district, token, refreshToken);
                    if (res && res.status == 200) {
                        // await getDistrict(pageDistrict, limitDistrict);
                        await getCountry(page, limit);
                        await getState(pageState, limitState);
                        await getDistrict(pageDistrict, limitDistrict);
                        await getCity(pageCity, limitCity);
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
                    handleClickCloseDistrictDialog();
                }
                setIsLoadingDistrict(false);
            } catch (error) {
                setIsLoadingDistrict(false);
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
    }

    const handleSwitchDistrict = (item: Districts) => {
        setDistrict(item);
        setIsCheckDistrict(true);
    }

    const handleCloseSwitchDistrict = () => {
        setDistrict(initialDistrictState);
        setIsCheckDistrict(false);
    }

    const handleSwitchDistrictCheck = async (e: any) => {
        e.preventDfault();
        try {
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            setIsLoadingDistrict(true);
            let res = await APIservice.httpPost('/api/admin/region/activeInactiveDistrict', district, token, refreshToken);
            setIsLoadingDistrict(false);
            if (res && res.status == 200) {
                await getDistrict(pageDistrict, limitDistrict);
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
        } catch (error) {
            setIsLoadingDistrict(false);
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

    const handleClickOpenEditDistrictDialog = async (item: Districts) => {
        clearDistrictError();
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');

        let obj = {
            countryId: item.countryId
        };
        const res1 = await APIservice.httpPost(
            '/api/admin/region/getStates',
            obj,
            token,
            refreshToken
        );
        setAllStates(res1.recordList);
        setDistrict(item);
        setIsOpenDistrict(true);
    }

    const isSelectedDistrict = (id: number) => (selectDistrict && selectDistrict?.id === id) ? true : false;
    const handleLoadCity = async (e: any, item: Districts) => {
        let district = districts;
        let ind = district.findIndex(c => c.id == item.id);
        let _ind = (selectDistrict?.id === district[ind].id);
        setSelectCity(new Cities());
        if (_ind) {
            let obj = new Districts();
            let countryId = selectCountry.id ? selectCountry.id : null;
            let stateId = selectState.id ? selectState.id : null;
            setSelectDistrict(obj);
            await getCity(0, limitCity, null, stateId, countryId);
        } else {
            setSelectDistrict(district[ind]);
            await getCity(0, limitCity, district[ind].id);
        }
    }
    //#endregion District

    //#region City
    const getCity = async (startIndex: number, fetchRecord: number, districtId?: number, stateId?: number, countryId?: number) => {
        try {
            setIsLoadingCity(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                startIndex: startIndex,
                fetchRecord: fetchRecord,
                districtId: districtId,
                stateId: stateId,
                countryId: countryId
            };
            const res = await APIservice.httpPost(
                '/api/admin/region/getCities',
                obj,
                token,
                refreshToken
            );
            if (res.recordList && res.recordList.length > 0) {
                for (let i = 0; i < res.recordList.length; i++) {
                    res.recordList[i].isActive = res.recordList[i].isActive ? true : false;
                    res.recordList[i].isDelete = res.recordList[i].isDelete ? true : false;
                }
            }
            setCities(res.recordList);
            setRowCity(res.totalRecords);
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
            setIsLoadingCity(false);
        } catch (error) {
            setIsLoadingCity(false);
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

    const handleCityPageChange = (event: any, newPage: number): void => {
        setPageCity(newPage);
        getCity(newPage * limitCity, limitCity);
    };

    const handleCityLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimitCity(parseInt(event.target.value));
        setPageCity(0);
        getCity(0, parseInt(event.target.value));
    };

    const handleClickOpenCityDialog = (e: any) => {
        clearCityError();
        setCity(initialCityState);
        setIsOpenCity(true);
    }

    const handleClickCloseCityDialog = () => {
        clearCityError();
        setCity(initialCityState);
        setIsOpenCity(false);
    }

    const clearCityError = () => {
        setIsCityNameError(false);
        setCityNameErrorMsg('');
        setIsCountryIdError(false);
        setCountryIdErrorMsg('');
        setIsStateIdError(false);
        setStateIdErrorMsg('');
        setIsDistrictIdError(false);
        setDistrictIdErrorMsg('');
    }

    const handleInputCityChange = (arr: any) => {
        const { name, value } = arr.target;
        setCity({ ...city, [name]: value });
    };

    const validateCityName = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsCityNameError(false);
            setCityNameErrorMsg('');
        } else {
            setIsCityNameError(true);
            setCityNameErrorMsg('City Name is required');
        }
    };

    const validateCityPincode = (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsPincodeError(false);
            setPincodeErrorMsg('');
        } else {
            setIsPincodeError(true);
            setPincodeErrorMsg('City Pincode is required');
        }
    };

    const validateDistrictId = async (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsDistrictIdError(false);
            setDistrictIdErrorMsg('');
        } else {
            setIsDistrictIdError(true);
            setDistrictIdErrorMsg('District is required');
        }
    };

    const validateCityStateId = async (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsStateIdError(false);
            setStateIdErrorMsg('');
        } else {
            setIsStateIdError(true);
            setStateIdErrorMsg('State is required');
        }

        try {
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                stateId: value
            };
            const res1 = await APIservice.httpPost(
                '/api/admin/region/getDistricts',
                obj,
                token,
                refreshToken
            );
            setAllDistricts(res1.recordList);
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
        }
    };

    const validateCityCountryId = async (arr) => {
        const { name, value } = arr.target;
        if (value) {
            setIsCountryIdError(false);
            setCountryIdErrorMsg('');
        } else {
            setIsCountryIdError(true);
            setCountryIdErrorMsg('Country is required');
        }

        try {
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            let obj = {
                countryId: value
            };
            const res1 = await APIservice.httpPost(
                '/api/admin/region/getStates',
                obj,
                token,
                refreshToken
            );
            setAllStates(res1.recordList);
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
        }
    };

    const validateCity = () => {
        let flag = true;
        if (city.countryId) {
            setIsCountryIdError(false);
            setCountryIdErrorMsg('');
        } else {
            flag = false;
            setIsCountryIdError(true);
            setCountryIdErrorMsg('Country is required');
        }
        if (city.stateId) {
            setIsStateIdError(false);
            setStateIdErrorMsg('');
        } else {
            flag = false;
            setIsStateIdError(true);
            setStateIdErrorMsg('State is required');
        }
        if (city.districtId) {
            setIsDistrictIdError(false);
            setDistrictIdErrorMsg('');
        } else {
            flag = false;
            setIsDistrictIdError(true);
            setDistrictIdErrorMsg('District is required');
        }
        if (city.pincode) {
            setIsPincodeError(false);
            setPincodeErrorMsg('');
        } else {
            flag = false;
            setIsPincodeError(true);
            setPincodeErrorMsg('City Pincode is required');
        }
        if (city.name) {
            setIsCityNameError(false);
            setCityNameErrorMsg('');
        } else {
            flag = false;
            setIsCityNameError(true);
            setCityNameErrorMsg('City Name is required');
        }
        return flag;
    }

    const saveCity = async (e: any) => {
        e.preventDefault();
        let flag = validateCity();
        if (flag) {
            try {
                setIsLoadingCity(true);
                const token = localStorage.getItem('SessionToken');
                const refreshToken = localStorage.getItem('RefreshToken');
                if (city.id) {
                    let res = await APIservice.httpPost('/api/admin/region/updateCity', city, token, refreshToken);
                    if (res && res.status == 200) {
                        // await getCity(pageCity, limitCity);

                        await getCountry(page, limit);
                        await getState(pageState, limitState);
                        await getDistrict(pageDistrict, limitDistrict);
                        await getCity(pageCity, limitCity);
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
                } else {
                    let res = await APIservice.httpPost('/api/admin/region/insertCity', city, token, refreshToken);
                    if (res && res.status == 200) {
                        // await getCity(pageCity, limitCity);
                        await getCountry(page, limit);
                        await getState(pageState, limitState);
                        await getDistrict(pageDistrict, limitDistrict);
                        await getCity(pageCity, limitCity);
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
                }
                handleClickCloseCityDialog();
                setIsLoadingCity(false);
            } catch (error) {
                setIsLoadingCity(false);
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
    }

    const handleSwitchCity = (item: Cities) => {
        setCity(item);
        setIsCheckCity(true);
    }

    const handleCloseSwitchCity = () => {
        setCity(initialCityState);
        setIsCheckCity(false);
    }

    const handleSwitchCityCheck = async (e: any) => {
        e.preventDfault();
        try {
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            setIsLoadingCity(true);
            let res = await APIservice.httpPost('/api/admin/region/activeInactiveCity', city, token, refreshToken);
            setIsLoadingCity(false);
            if (res && res.status == 200) {
                await getCity(pageCity, limitCity);
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
        } catch (error) {
            setIsLoadingCity(false);
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

    const handleClickOpenEditCityDialog = async (item: Cities) => {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');

        let obj2 = {
            countryId: item.countryId
        };
        const res2 = await APIservice.httpPost(
            '/api/admin/region/getStates',
            obj2,
            token,
            refreshToken
        );
        setAllStates(res2.recordList);

        let obj = {
            districtId: item.districtId
        };
        const res1 = await APIservice.httpPost(
            '/api/admin/region/getDistricts',
            obj,
            token,
            refreshToken
        );
        setAllDistricts(res1.recordList);
        clearCityError();
        setCity(item);
        setIsOpenCity(true);
    }
    //#endregion City

    //#region CSV
    const handleClickDownloadSample = () => {
        let data = [{
            countryId: 0,//set 0 if you want to insert new country other wise leave as it is after download actual file
            countryName: "",
            isoCode: "",
            isoCode3: "",
            dialCode: "",
            stateId: 0,//set 0 if you want to insert new State other wise leave as it is after download actual file
            stateName: "",
            districtId: 0,//set 0 if you want to insert new district other wise leave as it is after download actual file
            districtName: "",
            cityId: 0,//set 0 if you want to insert new City other wise leave as it is after download actual file
            cityName: "",
            pincode: ""
        }, {
            countryId: 0,//set 0 if you want to insert new country other wise leave as it is after download actual file
            countryName: "",
            isoCode: "",
            isoCode3: "",
            dialCode: "",
            stateId: 0,//set 0 if you want to insert new State other wise leave as it is after download actual file
            stateName: "",
            districtId: 0,//set 0 if you want to insert new district other wise leave as it is after download actual file
            districtName: "",
            cityId: 0,//set 0 if you want to insert new City other wise leave as it is after download actual file
            cityName: "",
            pincode: ""
        }]
        setDownloadSample(data);

    }

    const handleClickDownloadRegion = async (e: any) => {
        e.preventDefault();
        try {
            setIsLoadingCity(true);
            setIsLoadingDistrict(true);
            setIsLoadingState(true);
            setIsLoadingCountry(true);
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            const res = await APIservice.httpPost(
                '/api/admin/region/getAllRegionData',
                {},
                token,
                refreshToken
            );
            if (res && res.status == 200) {
                let csvData = ConvertToCSV(res.recordList, ['countryId', 'countryName', 'isoCode', 'isoCode3', 'dialCode', 'stateId', 'stateName', 'districtId', 'districtName', 'cityId', 'cityName', 'pincode']);

                let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
                let dwldLink = document.createElement("a");
                let url = URL.createObjectURL(blob);
                let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
                if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
                    dwldLink.setAttribute("target", "_blank");
                }
                dwldLink.setAttribute("href", url);
                let fileName = 'Region_' + new Date().getDate() + "-" + new Date().getMonth() + 1 + "-" + new Date().getFullYear() + "-" + new Date().getTime();
                dwldLink.setAttribute("download", fileName + ".csv");
                dwldLink.style.visibility = "hidden";
                document.body.appendChild(dwldLink);
                dwldLink.click();
                document.body.removeChild(dwldLink);
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
            setIsLoadingCity(false);
            setIsLoadingDistrict(false);
            setIsLoadingState(false);
            setIsLoadingCountry(false);
        } catch (error) {
            setIsLoadingCity(false);
            setIsLoadingDistrict(false);
            setIsLoadingState(false);
            setIsLoadingCountry(false);
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

    const ConvertToCSV = (data, fields) => {
        let array = typeof data != 'object' ? JSON.parse(data) : data;
        let str = '';
        // str += "Sale Order On Date " + this.parameter.dateFrom.getDate() + "/" + (this.parameter.dateFrom.getMonth() + 1) + "/" + this.parameter.dateFrom.getFullYear() + " " + ((new Date(this.parameter.dateFrom)).getHours() < 10 ? '0' : '') + this.parameter.dateFrom.getHours() + ":" + ((new Date(this.parameter.dateFrom)).getMinutes() < 10 ? '0' : '') + this.parameter.dateFrom.getMinutes() + " TO " + (this.parameter.dateFrom.getDate()) + "/" + (this.parameter.dateFrom.getMonth() + 1) + "/" + this.parameter.dateFrom.getFullYear() + " " + ((new Date(this.parameter.dateTo)).getHours() < 10 ? '0' : '') + this.parameter.dateTo.getHours() + ":" + ((new Date(this.parameter.dateTo)).getMinutes() < 10 ? '0' : '') + this.parameter.dateTo.getMinutes() + '\r\n';
        let row = '';
        for (let index in fields) {
            row += fields[index] + ',';
        }
        row = row.slice(0, -1);
        let line = ''
        str += row + '\r\n';
        console.log(array.length);

        for (let i = 0; i < array.length; i++) {
            line += '\n' + array[i].countryId + ", " + array[i].countryName + ", " + array[i].isoCode + ", " + array[i].isoCode3 + ", " + array[i].dialCode + ", " + array[i].stateId + ", " + array[i].stateName + ", " + array[i].districtId + ", " + array[i].districtName + ", " + array[i].cityId + ", " + array[i].cityName + ", " + array[i].pincode;
        }
        str += line + '\r\n';
        return str;
    }

    const handleClickUploadRegion = () => {
        inputFile.current.click();
    }

    const handleFile = (e: any) => {
        let file = e.target.files[0];
        if (file) {
            fileReader.onload = async () => {
                const csvOutput = fileReader.result;
                const lines = csvOutput.toString().split("\n");
                const headers = lines[0].split(",");
                const result = [];

                console.log(lines);
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i]) {
                        const obj = {};
                        const currentLine = lines[i].split(",");

                        for (let j = 0; j < headers.length; j++) {
                            obj[headers[j].trim()] = currentLine[j].trim();
                        }

                        result.push(obj);
                    }
                }
                if (result && result.length > 0) {
                    try {
                        setIsLoadingCity(true);
                        setIsLoadingDistrict(true);
                        setIsLoadingState(true);
                        setIsLoadingCountry(true);
                        const token = localStorage.getItem('SessionToken');
                        const refreshToken = localStorage.getItem('RefreshToken');
                        const res = await APIservice.httpPost(
                            '/api/admin/region/updateRegionData',
                            { data: result },
                            token,
                            refreshToken
                        );
                        if (res && res.status == 200) {
                            loadData();
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
                        setIsLoadingCity(false);
                        setIsLoadingDistrict(false);
                        setIsLoadingState(false);
                        setIsLoadingCountry(false);
                    } catch (error) {
                        setIsLoadingCity(false);
                        setIsLoadingDistrict(false);
                        setIsLoadingState(false);
                        setIsLoadingCountry(false);
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

            fileReader.readAsText(file);
        }
    }
    //#endregion CSV

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
                <title>Region</title>
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
                                        Region
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1.5}>
                                {isReadPermission ? <>
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
                                            onClick={handleClickDownloadSample}
                                            size="small"
                                        >
                                            <CSVLink
                                                data={downloadSample}
                                                filename={'sample.csv'}
                                                style={{
                                                    '&:hover': { background: theme.colors.primary.lighter },
                                                    color: "white", textDecoration: "none"
                                                }}
                                            >
                                                <CloudDownloadIcon fontSize="small" />&nbsp;
                                                Download Sample
                                            </CSVLink>
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
                                            onClick={handleClickDownloadSample}
                                            size="small"
                                        >
                                            <CSVLink
                                                data={downloadSample}
                                                filename={'sample.csv'}
                                                style={{
                                                    '&:hover': { background: theme.colors.primary.lighter },
                                                    color: "white", textDecoration: "none"
                                                }}
                                            >
                                                <CloudDownloadIcon fontSize="small" />
                                            </CSVLink>
                                        </Button>
                                    </Grid>
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
                                            onClick={handleClickDownloadRegion}
                                            size="small"
                                        >
                                            <CSVLink
                                                data={regionData}
                                                filename={'region.csv'}
                                                style={{
                                                    '&:hover': { background: theme.colors.primary.lighter },
                                                    color: "white", textDecoration: "none"
                                                }}
                                            >
                                                <CloudDownloadIcon fontSize="small" />&nbsp;
                                                Download
                                            </CSVLink>
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
                                            onClick={handleClickDownloadRegion}
                                            size="small"
                                        >
                                            <CSVLink
                                                data={regionData}
                                                filename={'region.csv'}
                                                style={{
                                                    '&:hover': { background: theme.colors.primary.lighter },
                                                    color: "white", textDecoration: "none"
                                                }}
                                            >
                                                <CloudDownloadIcon fontSize="small" />
                                            </CSVLink>
                                        </Button>
                                    </Grid>
                                </> : <></>}
                                {isWritePermission ?
                                    <Grid item>
                                        <input style={{ display: 'none', }} ref={inputFile} accept=".csv" type="file" onChange={handleFile} />
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
                                            onClick={handleClickUploadRegion}
                                            size="small"
                                        >
                                            <CloudUploadIcon fontSize="small" />&nbsp;
                                            Upload
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
                                            onClick={handleClickUploadRegion}
                                            size="small"
                                        >
                                            <CloudUploadIcon fontSize="small" />
                                        </Button>
                                    </Grid>
                                    : <></>}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Card className="religioncard">
                    <Grid container>
                        <Grid item lg={3} md={4} sm={6} xs={12} style={{ borderRight: '1px Solid #9f9f9f' }}>
                            {isLoadingCountry ? <RegionLoader title="Loading Country"></RegionLoader> :
                                <div className='region-div'>
                                    <TableContainer className="country-tableContainer-list" >
                                        <Table stickyHeader aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: '#212B36' }}>Country</TableCell>
                                                    <TableCell align="right">
                                                        {isWritePermission ?
                                                            <Button
                                                                variant="contained"
                                                                // sx={{ color: '#1565c0' }}
                                                                color="inherit"
                                                                size="small"
                                                                onClick={handleClickOpenCountryDialog}
                                                            >
                                                                <AddIcon fontSize="small" />
                                                            </Button>
                                                            : <></>}

                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {countries.map((item: Country, index: number) => {
                                                    const labelId = `enhanced-table-checkbox-${index}`;
                                                    const isItemSelected = isSelected(item.id);
                                                    return (
                                                        <TableRow hover key={item.id} role="checkbox" aria-checked tabIndex={-1} sx={{ cursor: "pointer" }} selected={isItemSelected}>
                                                            <TableCell style={{ cursor: 'pointer' }} onClick={(e) => handleLoadState(e, item)}>
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    color="text.primary"
                                                                    noWrap
                                                                    sx={{ textTransform: 'capitalize', fontSize: '12px' }}
                                                                >
                                                                    <Checkbox
                                                                        color="primary"
                                                                        checked={isItemSelected}
                                                                        inputProps={{
                                                                            'aria-labelledby': labelId,
                                                                        }}
                                                                        style={{ padding: '0px 10px' }}
                                                                    />
                                                                    {item.name}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {isEditPermission ? <>
                                                                    <div style={{ display: "flex" }}>
                                                                        <Tooltip title={(item.isActive) ? "Active" : "Inactive"} arrow
                                                                        >
                                                                            <Switch
                                                                                checked={!item.isActive ? false : true}
                                                                                onClick={(e) => { handleSwitchCountry(item) }}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                                sx={{ color: '#1565c0' }}
                                                                            />
                                                                        </Tooltip>
                                                                        <IconButton
                                                                            sx={{ color: '#1565c0' }}
                                                                            color="inherit"
                                                                            size="small"
                                                                            onClick={(e) => handleClickOpenEditCountryDialog(item)}
                                                                        >
                                                                            <EditTwoToneIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </div>
                                                                </> : <></>}

                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                        {/* <Table stickyHeader aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: '#212B36' }}>Country</TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            variant="contained"
                                                            color="inherit"
                                                            size="small"
                                                            onClick={handleClickOpenCountryDialog}
                                                        >
                                                            <AddIcon fontSize="small" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {countries.map((item: Country, index: number) => {
                                                    const labelId = `enhanced-table-checkbox-${index}`;
                                                    const isItemSelected = isSelected(item.id);
                                                    return (
                                                        <TableRow
                                                            key={item.name}
                                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                                            style={{ background: isItemSelected ? '#d0d2d9' : '#fff' }}
                                                        >
                                                            <TableCell style={{ cursor: 'pointer', padding: '0px' }} onClick={(e) => handleLoadState(e, item)} component="th" scope="row">
                                                                {item.name}
                                                            </TableCell>
                                                            <TableCell sx={{ padding: '0px' }}>
                                                                <IconButton
                                                                    sx={{ color: '#1565c0' }}
                                                                    color="inherit"
                                                                    size="small"
                                                                    onClick={(e) => handleClickOpenEditCountryDialog(item)}
                                                                >
                                                                    <EditTwoToneIcon fontSize="small" />
                                                                </IconButton>
                                                                <Tooltip title={(item.isActive) ? "Active" : "Inactive"} arrow
                                                                >
                                                                    <Switch
                                                                        checked={!item.isActive ? false : true}
                                                                        onClick={(e) => { handleSwitchCountry(item) }}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                        sx={{ color: '#1565c0' }}
                                                                    />
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table> */}
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={row}
                                        onPageChange={handlePageChange}
                                        onRowsPerPageChange={handleLimitChange}
                                        page={page}
                                        rowsPerPage={limit}
                                        rowsPerPageOptions={[10, 20, 30, 40]}
                                    />
                                </div>
                            }
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12} style={{ borderRight: '1px Solid #9f9f9f' }}>
                            {/* <Card className="religioncard"> */}
                            {isLoadingState ? <RegionLoader title="Loading State"></RegionLoader> :
                                <>
                                    <TableContainer className="country-tableContainer-list" >
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: '#212B36' }}>State</TableCell>
                                                    <TableCell align="right">
                                                        {isWritePermission ?
                                                            <Button
                                                                variant="contained"
                                                                color="inherit"
                                                                size="small"
                                                                onClick={handleClickOpenStateDialog}
                                                            >
                                                                <AddIcon fontSize="small" />
                                                            </Button>
                                                            : <></>}

                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {states.map((item: States, index: number) => {
                                                    const labelId = `enhanced-table-checkbox-${index}`;
                                                    const isItemSelected = isSelectedState(item.id);
                                                    return (
                                                        <TableRow hover key={item.id} role="checkbox" aria-checked tabIndex={-1} sx={{ cursor: "pointer" }} selected={isItemSelected}>
                                                            <TableCell colSpan={1} style={{ cursor: 'pointer' }} onClick={(e) => handleLoadDistrict(e, item)}>
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    color="text.primary"
                                                                    noWrap
                                                                    sx={{ textTransform: 'capitalize', fontSize: '12px' }}
                                                                >
                                                                    <Checkbox
                                                                        color="primary"
                                                                        checked={isItemSelected}
                                                                        inputProps={{
                                                                            'aria-labelledby': labelId,
                                                                        }}
                                                                        style={{ padding: '0px 10px' }}
                                                                    />
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography sx={{ color: "grey", fontSize: "10px", marginLeft: "39px", marginTop: "-10px" }} variant="body2"> ({item.countryName})</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {isEditPermission ?
                                                                    <div style={{ display: "flex" }}>
                                                                        <Tooltip title={(item.isActive) ? "Active" : "Inactive"} arrow
                                                                        >
                                                                            <Switch
                                                                                checked={!item.isActive ? false : true}
                                                                                onClick={(e) => { handleSwitchState(item) }}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                                sx={{ color: '#1565c0' }}
                                                                            />
                                                                        </Tooltip>
                                                                        <IconButton
                                                                            sx={{ color: '#1565c0' }}
                                                                            color="inherit"
                                                                            size="small"
                                                                            onClick={(e) => handleClickOpenEditStateDialog(item)}
                                                                        >
                                                                            <EditTwoToneIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </div>
                                                                    : <></>}

                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={rowState}
                                        onPageChange={handleStatePageChange}
                                        onRowsPerPageChange={handleStateLimitChange}
                                        page={pageState}
                                        rowsPerPage={limitState}
                                        rowsPerPageOptions={[10, 20, 30, 40]}
                                    />
                                </>
                            }
                            {/* </Card> */}
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12} style={{ borderRight: '1px Solid #9f9f9f' }}>
                            {/* <Card className="religioncard"> */}
                            {isLoadingDistrict ? <RegionLoader title="Loading District"></RegionLoader> :
                                <>
                                    <TableContainer className="country-tableContainer-list" >
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: '#212B36' }}>District</TableCell>
                                                    <TableCell align="right">
                                                        {isWritePermission ?
                                                            <Button
                                                                variant="contained"
                                                                // sx={{ color: '#1565c0' }}
                                                                color="inherit"
                                                                size="small"
                                                                onClick={handleClickOpenDistrictDialog}
                                                            >
                                                                <AddIcon fontSize="small" />
                                                            </Button>
                                                            : <></>}

                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {districts.map((item: Districts, index: number) => {
                                                    const labelId = `enhanced-table-checkbox-${index}`;
                                                    const isItemSelected = isSelectedDistrict(item.id);
                                                    return (
                                                        <TableRow hover key={item.id} role="checkbox" aria-checked tabIndex={-1} sx={{ cursor: "pointer" }} selected={isItemSelected}>
                                                            <TableCell colSpan={1} style={{ cursor: 'pointer' }} onClick={(e) => handleLoadCity(e, item)}>
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    color="text.primary"
                                                                    noWrap
                                                                    sx={{ textTransform: 'capitalize', fontSize: '12px' }}
                                                                >
                                                                    <Checkbox
                                                                        color="primary"
                                                                        checked={isItemSelected}
                                                                        inputProps={{
                                                                            'aria-labelledby': labelId,
                                                                        }}
                                                                        style={{ padding: '0px 10px' }}
                                                                    />
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography sx={{ color: "grey", fontSize: "10px", marginLeft: "39px", marginTop: "-10px" }} variant="body2"> ({item.countryName}-{item.stateName})</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {isEditPermission ?
                                                                    <div style={{ display: "flex" }}>
                                                                        <Tooltip title={(item.isActive) ? "Active" : "Inactive"} arrow
                                                                        >
                                                                            <Switch
                                                                                checked={!item.isActive ? false : true}
                                                                                onClick={(e) => { handleSwitchDistrict(item) }}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                                sx={{ color: '#1565c0' }}
                                                                            />
                                                                        </Tooltip>
                                                                        <IconButton
                                                                            sx={{ color: '#1565c0' }}
                                                                            color="inherit"
                                                                            size="small"
                                                                            onClick={(e) => handleClickOpenEditDistrictDialog(item)}
                                                                        >
                                                                            <EditTwoToneIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </div>
                                                                    : <></>}

                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={rowDistrict}
                                        onPageChange={handleDistrictPageChange}
                                        onRowsPerPageChange={handleDistrictLimitChange}
                                        page={pageDistrict}
                                        rowsPerPage={limitDistrict}
                                        rowsPerPageOptions={[10, 20, 30, 40]}
                                    />
                                </>
                            }
                            {/* </Card> */}
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12} style={{ borderRight: '1px Solid #9f9f9f' }}>
                            {/* <Card className="religioncard"> */}
                            {isLoadingCity ? <RegionLoader title="Loading City"></RegionLoader> :
                                <>
                                    <TableContainer className="country-tableContainer-list" >
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: '#212B36' }}>City</TableCell>
                                                    <TableCell align="right">
                                                        {isWritePermission ?
                                                            <Button
                                                                variant="contained"
                                                                // sx={{ color: '#1565c0' }}
                                                                color="inherit"
                                                                size="small"
                                                                onClick={handleClickOpenCityDialog}
                                                            >
                                                                <AddIcon fontSize="small" />
                                                            </Button>
                                                            : <></>}

                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {cities.map((item: Cities, index: number) => {
                                                    const labelId = `enhanced-table-checkbox-${index}`;
                                                    return (
                                                        <TableRow hover key={item.id} role="checkbox" aria-checked tabIndex={-1} sx={{ cursor: "pointer" }}>
                                                            <TableCell colSpan={1} style={{ cursor: 'pointer' }}>
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    color="text.primary"
                                                                    noWrap
                                                                    sx={{ textTransform: 'capitalize', fontSize: '12px' }}
                                                                >
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography sx={{ color: "grey", fontSize: "10px", marginLeft: "0px", marginTop: "-5px" }} variant="body2"> ({item.countryName}-{item.stateName}-{item.districtName})</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {isEditPermission ?
                                                                    <div style={{ display: 'flex' }}>
                                                                        <Tooltip title={(item.isActive) ? "Active" : "Inactive"} arrow
                                                                        >
                                                                            <Switch
                                                                                checked={!item.isActive ? false : true}
                                                                                onClick={(e) => { handleSwitchCity(item) }}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                                sx={{ color: '#1565c0' }}
                                                                            />
                                                                        </Tooltip>
                                                                        <IconButton
                                                                            sx={{ color: '#1565c0' }}
                                                                            color="inherit"
                                                                            size="small"
                                                                            onClick={(e) => handleClickOpenEditCityDialog(item)}
                                                                        >
                                                                            <EditTwoToneIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </div>
                                                                    : <></>}

                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={rowCity}
                                        onPageChange={handleCityPageChange}
                                        onRowsPerPageChange={handleCityLimitChange}
                                        page={pageCity}
                                        rowsPerPage={limitCity}
                                        rowsPerPageOptions={[10, 20, 30, 40]}
                                    />
                                </>
                            }
                            {/* </Card> */}
                        </Grid>
                    </Grid>
                </Card>
                <div>
                    <Dialog
                        open={isCheckCountry}
                        onClose={handleCloseSwitchCountry}
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
                            {country.isActive ? 'Inactive' : 'Active'}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                style={{
                                    fontSize: '1rem',
                                    letterSpacing: '0.00938em'
                                }}
                            >
                                {country.isActive
                                    ? 'Are you sure you want to Active?'
                                    : 'Are you sure you want to Inactive?'}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseSwitchCountry} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchCountryCheck} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <BootstrapDialog
                        open={isOpenCountry}
                        onClose={handleClickCloseCountryDialog}
                        PaperProps={{ sx: { height: '40%' } }}
                        fullWidth
                        maxWidth="xs"
                    >
                        <BootstrapDialogTitle
                            id="customized-dialog-title"
                            onClose={handleClickCloseCountryDialog}
                        >
                            {country.id ? 'Edit Country' : 'Add Country'}
                        </BootstrapDialogTitle>
                        <DialogContent dividers>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Country Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                name="name"
                                value={country.name}
                                onChange={(arr) => {
                                    handleInputChange(arr);
                                    validateName(arr);
                                }}
                                required={true}
                            />
                            <FormHelperText
                                style={{ color: 'red', height: '22px' }}
                            >
                                {isNameError && nameErrorMsg}
                            </FormHelperText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="isoCode"
                                label="Country ISO Code"
                                type="text"
                                fullWidth
                                variant="outlined"
                                name="isoCode"
                                value={country.isoCode}
                                onChange={(arr) => {
                                    handleInputChange(arr);
                                    validateIsoCode(arr);
                                }}
                                required={true}
                            />
                            <FormHelperText
                                style={{ color: 'red', height: '22px' }}
                            >
                                {isIsoCodeError && isoCodeErrorMsg}
                            </FormHelperText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="isoCode3"
                                label="Country ISO Code3"
                                type="text"
                                fullWidth
                                variant="outlined"
                                name="isoCode3"
                                value={country.isoCode3}
                                onChange={(arr) => {
                                    handleInputChange(arr);
                                    validateIso3Code(arr);
                                }}
                                required={true}
                            />
                            <FormHelperText
                                style={{ color: 'red', height: '22px' }}
                            >
                                {isIsoCode3Error && isoCode3ErrorMsg}
                            </FormHelperText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="dialCode"
                                label="Country Dial Code"
                                type="text"
                                fullWidth
                                variant="outlined"
                                name="dialCode"
                                value={country.dialCode}
                                onChange={(arr) => {
                                    handleInputChange(arr);
                                    validateCountryDialCode(arr);
                                }}
                            />
                            <FormHelperText
                                style={{ color: 'red', height: '22px' }}
                            >
                                {isCountryDialCodeError && CountryDialCodeErrorMsg}
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
                                <Button onClick={handleClickCloseCountryDialog} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => { savecountry(e) }} variant="outlined" style={{ marginRight: '10px' }}>Save</Button>
                            </div>
                        </Box>
                    </BootstrapDialog>
                </div>
                <div>
                    <Dialog
                        open={isCheckState}
                        onClose={handleCloseSwitchState}
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
                            {state.isActive ? 'Inactive' : 'Active'}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                style={{
                                    fontSize: '1rem',
                                    letterSpacing: '0.00938em'
                                }}
                            >
                                {state.isActive
                                    ? 'Are you sure you want to Active?'
                                    : 'Are you sure you want to Inactive?'}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseSwitchState} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchStateCheck} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <BootstrapDialog
                        open={isOpenState}
                        onClose={handleClickCloseStateDialog}
                        PaperProps={{ sx: { height: '40%' } }}
                        fullWidth
                        maxWidth="xs"
                    >
                        <BootstrapDialogTitle
                            id="customized-dialog-title"
                            onClose={handleClickCloseStateDialog}
                        >
                            {state.id ? 'Edit State' : 'Add State'}
                        </BootstrapDialogTitle>
                        <DialogContent dividers>
                            <FormControl
                                sx={{ width: { lg: '100%' } }}
                            >
                                <InputLabel id="demo-multiple-name-label">
                                    Country *
                                </InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    multiple={false}
                                    name="countryId"
                                    value={state.countryId}
                                    onChange={(e) => {
                                        handleInputStateChange(e);
                                        validateStateCountryId(e);
                                    }}
                                    label="Country"
                                    MenuProps={MenuProps}
                                    required={true}
                                >
                                    {allCountries.map((arr: any) => (
                                        <MenuItem key={arr.id} value={arr.id}>
                                            {arr.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormHelperText style={{ color: 'red', height: '22px' }}>
                                {isCountryIdError && countryIdErrorMsg}
                            </FormHelperText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="State Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                name="name"
                                value={state.name}
                                onChange={(arr) => {
                                    handleInputStateChange(arr);
                                    validateStateName(arr);
                                }}
                                required={true}
                            />
                            <FormHelperText
                                style={{ color: 'red', height: '22px' }}
                            >
                                {isStateNameError && stateNameErrorMsg}
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
                                <Button onClick={handleClickCloseStateDialog} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => { saveState(e) }} variant="outlined" style={{ marginRight: '10px' }}>Save</Button>
                            </div>
                        </Box>
                    </BootstrapDialog>
                </div>
                <div>
                    <Dialog
                        open={isCheckDistrict}
                        onClose={handleCloseSwitchDistrict}
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
                            {state.isActive ? 'Inactive' : 'Active'}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                style={{
                                    fontSize: '1rem',
                                    letterSpacing: '0.00938em'
                                }}
                            >
                                {state.isActive
                                    ? 'Are you sure you want to Active?'
                                    : 'Are you sure you want to Inactive?'}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseSwitchDistrict} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchDistrictCheck} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <BootstrapDialog
                        open={isOpenDistrict}
                        onClose={handleClickCloseDistrictDialog}
                        PaperProps={{ sx: { height: '40%' } }}
                        fullWidth
                        maxWidth="xs"
                    >
                        <BootstrapDialogTitle
                            id="customized-dialog-title"
                            onClose={handleClickCloseDistrictDialog}
                        >
                            {district.id ? 'Edit District' : 'Add District'}
                        </BootstrapDialogTitle>
                        <DialogContent dividers>
                            <FormControl
                                sx={{ width: { lg: '100%' } }}
                            >
                                <InputLabel id="demo-multiple-name-label">
                                    Country *
                                </InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    multiple={false}
                                    name="countryId"
                                    value={district.countryId}
                                    onChange={(e) => {
                                        handleInputDistrictChange(e);
                                        validateDistrictCountryId(e);
                                    }}
                                    label="Country"
                                    MenuProps={MenuProps}
                                    required={true}
                                >
                                    {allCountries.map((arr: any) => (
                                        <MenuItem key={arr.id} value={arr.id}>
                                            {arr.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormHelperText style={{ color: 'red', height: '22px' }}>
                                {isCountryIdError && countryIdErrorMsg}
                            </FormHelperText>
                            <FormControl
                                sx={{ width: { lg: '100%' } }}
                            >
                                <InputLabel id="demo-multiple-name-label">
                                    State *
                                </InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    multiple={false}
                                    name="stateId"
                                    value={district.stateId}
                                    onChange={(e) => {
                                        handleInputDistrictChange(e);
                                        validateDistrictStateId(e);
                                    }}
                                    label="State"
                                    MenuProps={MenuProps}
                                    required={true}
                                >
                                    {allStates.map((arr: any) => (
                                        <MenuItem key={arr.id} value={arr.id}>
                                            {arr.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormHelperText style={{ color: 'red', height: '22px' }}>
                                {isStateIdError && stateIdErrorMsg}
                            </FormHelperText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="District Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                name="name"
                                value={district.name}
                                onChange={(arr) => {
                                    handleInputDistrictChange(arr);
                                    validateDistrictName(arr);
                                }}
                                required={true}
                            />
                            <FormHelperText
                                style={{ color: 'red', height: '22px' }}
                            >
                                {isDistrictNameError && districtNameErrorMsg}
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
                                <Button onClick={handleClickCloseDistrictDialog} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => { saveDistrict(e) }} variant="outlined" style={{ marginRight: '10px' }}>Save</Button>
                            </div>
                        </Box>
                    </BootstrapDialog>
                </div>
                <div>
                    <Dialog
                        open={isCheckCity}
                        onClose={handleCloseSwitchCity}
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
                            {city.isActive ? 'Inactive' : 'Active'}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                style={{
                                    fontSize: '1rem',
                                    letterSpacing: '0.00938em'
                                }}
                            >
                                {state.isActive
                                    ? 'Are you sure you want to Active?'
                                    : 'Are you sure you want to Inactive?'}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseSwitchCity} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                            <Button disabled={credentail?.email === "demo@admin.com"} onClick={handleSwitchCityCheck} variant="outlined" style={{ marginRight: '10px' }}>Yes</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <BootstrapDialog
                        open={isOpenCity}
                        onClose={handleClickCloseCityDialog}
                        PaperProps={{ sx: { height: '40%' } }}
                        fullWidth
                        maxWidth="xs"
                    >
                        <BootstrapDialogTitle
                            id="customized-dialog-title"
                            onClose={handleClickCloseCityDialog}
                        >
                            {city.id ? 'Edit City' : 'Add City'}
                        </BootstrapDialogTitle>
                        <DialogContent dividers>
                            <FormControl
                                sx={{ width: { lg: '100%' } }}
                            >
                                <InputLabel id="demo-multiple-name-label">
                                    Country *
                                </InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    multiple={false}
                                    name="countryId"
                                    value={city.countryId}
                                    onChange={(e) => {
                                        handleInputCityChange(e);
                                        validateCityCountryId(e);
                                    }}
                                    label="Country"
                                    MenuProps={MenuProps}
                                    required={true}
                                >
                                    {allCountries.map((arr: any) => (
                                        <MenuItem key={arr.id} value={arr.id}>
                                            {arr.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormHelperText style={{ color: 'red', height: '22px' }}>
                                {isCountryIdError && countryIdErrorMsg}
                            </FormHelperText>
                            <FormControl
                                sx={{ width: { lg: '100%' } }}
                            >
                                <InputLabel id="demo-multiple-name-label">
                                    State *
                                </InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    multiple={false}
                                    name="stateId"
                                    value={city.stateId}
                                    onChange={(e) => {
                                        handleInputCityChange(e);
                                        validateCityStateId(e);
                                    }}
                                    label="State"
                                    MenuProps={MenuProps}
                                    required={true}
                                >
                                    {allStates.map((arr: any) => (
                                        <MenuItem key={arr.id} value={arr.id}>
                                            {arr.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormHelperText style={{ color: 'red', height: '22px' }}>
                                {isStateIdError && stateIdErrorMsg}
                            </FormHelperText>
                            <FormControl
                                sx={{ width: { lg: '100%' } }}
                            >
                                <InputLabel id="demo-multiple-name-label">
                                    District *
                                </InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    multiple={false}
                                    name="districtId"
                                    value={city.districtId}
                                    onChange={(e) => {
                                        handleInputCityChange(e);
                                        validateDistrictId(e);
                                    }}
                                    label="District"
                                    MenuProps={MenuProps}
                                    required={true}
                                >
                                    {allDistricts.map((arr: any) => (
                                        <MenuItem key={arr.id} value={arr.id}>
                                            {arr.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormHelperText style={{ color: 'red', height: '22px' }}>
                                {isDistrictIdError && districtIdErrorMsg}
                            </FormHelperText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="City Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                name="name"
                                value={city.name}
                                onChange={(arr) => {
                                    handleInputCityChange(arr);
                                    validateCityName(arr);
                                }}
                                required={true}
                            />
                            <FormHelperText
                                style={{ color: 'red', height: '22px' }}
                            >
                                {isCityNameError && cityNameErrorMsg}
                            </FormHelperText>

                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="City Pincode/Postalcode"
                                type="text"
                                fullWidth
                                variant="outlined"
                                name="pincode"
                                value={city.pincode}
                                onChange={(arr) => {
                                    handleInputCityChange(arr);
                                    validateCityPincode(arr);
                                }}
                                required={true}
                            />
                            <FormHelperText
                                style={{ color: 'red', height: '22px' }}
                            >
                                {isPincodeError && pincodeErrorMsg}
                            </FormHelperText>
                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold', color: '#ff0000', paddingTop: '12px' }}>
                                Note: If postalcode/pincode is not available then please add 00000.
                            </Typography>

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
                                    <Button onClick={handleClickCloseCityDialog} variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
                                    <Button disabled={credentail?.email === "demo@admin.com"} onClick={(e) => { saveCity(e) }} variant="outlined" style={{ marginRight: '10px' }}>Save</Button>
                                </Typography>

                            </div>
                        </Box>
                    </BootstrapDialog>
                </div>
            </Container>
        </div>
    );
};

export default Region;