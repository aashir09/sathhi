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
    FormHelperText,
    Stack,
    TextField,
    Typography,
    useTheme,
    FormControl,
    FormControlLabel,
    FormLabel,
    RadioGroup,
    Radio,
    FormGroup
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent, useEffect } from 'react';
import Loader1 from '../Loader';
import APIservice from 'src/utils/APIservice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../content/smallScreen.css';
import 'react-quill/dist/quill.snow.css';
import { Col, Form, Row } from 'react-bootstrap';

import NoEncryptionGmailerrorredIcon from '@mui/icons-material/NoEncryptionGmailerrorred';
import LockIcon from '@mui/icons-material/Lock';
import { UserCredential } from 'src/models/userCredential';
import validator from 'validator';
import QRCode from 'react-qr-code';
import LockResetIcon from '@mui/icons-material/LockReset';

const styles = {
    heading4: `text-base text-ct-blue-600 font-medium border-b mb-2`,
    orderedList: `space-y-1 text-sm list-decimal`,
};


const Profile = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isloading, setIsLoading] = useState(false);
    const [userValue, setUserValue] = useState<UserCredential>()
    const [image, setImage] = React.useState('');
    const [isGenderError, setGenderError] = useState(false);
    const [GenderErrorMsg, setGenderErrorMsg] = useState('');
    const [isUserError, setUserError] = useState(false);
    const [UserErrorMsg, setUserErrorMsg] = useState('');
    const [ischeck, setIsCheck] = useState(false);

    const [qrcodeUrl, setqrCodeUrl] = useState("");
    const [base32, setBase32] = useState("");
    const [is2FAQRCode, setIs2FAQRCode] = useState(false);
    let [credentail, setCredentail] = useState<any>();

    useEffect(() => {
        let credentail = JSON.parse(localStorage.getItem("Credentials")) as UserCredential;
        setCredentail(credentail);
        if (credentail) {
            credentail.confirmEmail = credentail.email;
            if (credentail.image) setImage(process.env.REACT_APP_IMAGE_URL + credentail.image);
            setUserValue(credentail);
        }
    }, []);

    const handleEnableTwoFactorAuth = async () => {
        setIsCheck(true);
    };

    const handleCloseTwoFactorAuth = () => {
        setIsCheck(false);
    };

    const onFileChange = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setImage(reader.result.toString());
        };
        reader.readAsDataURL(file);
    };

    const onImageChange = (e: any) => {
        const { name, value } = e.target;
        setUserValue({
            ...userValue,
            [name]: value
        });
    };

    const handlechange = (e: any) => {
        const { name, value } = e.target;
        setUserValue({
            ...userValue,
            [name]: value
        });
    };

    const [isFirstNameError, setFirstNameError] = useState(false);
    const [firstNameErrorMsg, setFirstNameErrorMsg] = useState('');
    const validateFirstName = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value) {
            if (validator.isAlpha(value)) {
                setFirstNameError(false);
                setFirstNameErrorMsg('');
            } else {
                setFirstNameError(true);
                setFirstNameErrorMsg('Only alphabet');
            }
        } else {
            setFirstNameError(true);
            setFirstNameErrorMsg('Firstname is required');
        }
    };

    const [isMiddleNameError, setMiddleNameError] = useState(false);
    const [middleNameErrorMsg, setMiddleNameErrorMsg] = useState('');
    const validateMiddleName = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value) {
            if (validator.isAlpha(value)) {
                setMiddleNameError(false);
                setMiddleNameErrorMsg('');
            } else {
                setMiddleNameError(true);
                setMiddleNameErrorMsg('Only alphabet');
            }
        } else {
            setMiddleNameError(true);
            setMiddleNameErrorMsg('Middlename is required');
        }
    };

    const [isLastNameError, setLastNameError] = useState(false);
    const [lastNameErrorMsg, setLastNameErrorMsg] = useState('');
    const validateLastName = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value) {
            if (validator.isAlpha(value)) {
                setLastNameError(false);
                setLastNameErrorMsg('');
            } else {
                setLastNameError(true);
                setLastNameErrorMsg(' Only alphabet');
            }
        } else {
            setLastNameError(true);
            setLastNameErrorMsg('Lastname is required');
        }
    };

    const [isEmailValidateError, setIsEmailValidateError] = useState(false);
    const [emailValidateErrorMsg, setEmailValidateErrorMsg] = useState('');
    const validateEmail = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value) {
            if (validator.isEmail(value)) {
                setIsEmailValidateError(false);
                setEmailValidateErrorMsg('');
            } else {
                setIsEmailValidateError(true);
                setEmailValidateErrorMsg('Invalid email');
            }
        } else {
            setIsEmailValidateError(true);
            setEmailValidateErrorMsg('Email is required');
        }
    };

    const [isEmailError, setIsEmailError] = useState(false);
    const [confirmEmailValidateErrorMsg, setConfirmEmailValidateErrorMsg] = useState('');
    const confirmEmailValidation = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value) {
            if (!(userValue?.email === value)) {
                setIsEmailError(true);
                setConfirmEmailValidateErrorMsg('Email and confirm email must matched');
            } else {
                setIsEmailError(false);
                setConfirmEmailValidateErrorMsg('');
            }
        } else {
            setIsEmailError(true);
            setConfirmEmailValidateErrorMsg('Confirm email is required');
        }
    };

    const phoneRegex = new RegExp(
        '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
    );
    const [isPhoneValidateError, setIsPhoneValidateError] = useState(false);
    const [phoneValidateErrorMsg, setPhoneValidateErrorMsg] = useState('');
    const ValidatePhone = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value) {
            if (!phoneRegex.test(event.target.value)) {
                setIsPhoneValidateError(true);
                setPhoneValidateErrorMsg('Contact No must be 10 digit');
            } else {
                setIsPhoneValidateError(false);
                setPhoneValidateErrorMsg('');
            }
        } else {
            setIsPhoneValidateError(true);
            setPhoneValidateErrorMsg('Contact No is required');
        }
    };

    const validateGender = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value) {
            setGenderError(false);
            setGenderErrorMsg('');
        } else {
            setGenderError(true);
            setGenderErrorMsg('Gender is required');
        }
    };

    const validateForm = (e: any) => {
        e.preventDefault();
        var flag = true;
        if (!userValue?.firstName) {
            setFirstNameError(true);
            setFirstNameErrorMsg('Firstname is required');
            flag = false;
        } else {
            if (validator.isAlpha(userValue?.firstName)) {
                setFirstNameError(false);
                setFirstNameErrorMsg('');
            } else {
                setFirstNameError(true);
                setFirstNameErrorMsg('Only alphabet');
                flag = false;
            }
        }
        if (!userValue?.middleName) {
            setMiddleNameError(true);
            setMiddleNameErrorMsg('Middlename is required');
            flag = false;
        } else {
            if (validator.isAlpha(userValue?.middleName)) {
                setMiddleNameError(false);
                setMiddleNameErrorMsg('');
            } else {
                setMiddleNameError(true);
                setMiddleNameErrorMsg('Only alphabet');
                flag = false;
            }
        }
        if (!userValue?.lastName) {
            setLastNameError(true);
            setLastNameErrorMsg('Lastname is required');
            flag = false;
        } else {
            if (validator.isAlpha(userValue?.lastName)) {
                setLastNameError(false);
                setLastNameErrorMsg('');
            } else {
                setLastNameError(true);
                setLastNameErrorMsg(' Only alphabet');
                flag = false;
            }
        }
        if (!userValue?.email) {
            setIsEmailValidateError(true);
            setEmailValidateErrorMsg('Email is required');
            flag = false;
        } else {
            if (validator.isEmail(userValue?.email)) {
                setIsEmailValidateError(false);
                setEmailValidateErrorMsg('');
            } else {
                setIsEmailValidateError(true);
                setEmailValidateErrorMsg('Invalid email');
                flag = false;
            }
        }
        if (!userValue?.confirmEmail) {
            setIsEmailError(true);
            setConfirmEmailValidateErrorMsg('Confirm Email is required');
            flag = false;
        } else {
            if (!(userValue?.email === userValue?.confirmEmail)) {
                setIsEmailError(true);
                setConfirmEmailValidateErrorMsg(
                    'Email and confirm email must matched'
                );
                flag = false;
            } else {
                setIsEmailError(false);
                setConfirmEmailValidateErrorMsg('');
            }
        }
        if (!userValue?.contactNo) {
            setIsPhoneValidateError(true);
            setPhoneValidateErrorMsg('Contact No is required');
            flag = false;
        } else {
            if (!phoneRegex.test(userValue?.contactNo)) {
                setIsPhoneValidateError(true);
                setPhoneValidateErrorMsg('Contact No must be 10 digit');
                flag = false;
            } else {
                setIsPhoneValidateError(false);
                setPhoneValidateErrorMsg('');
            }
        }
        if (!userValue?.gender) {
            setGenderError(true);
            setGenderErrorMsg('Gender is required ');
            flag = false;
        } else {
            setGenderError(false);
            setGenderErrorMsg('');
        }
        return flag;
    };

    const saveUsers = async (e: any) => {
        var flag = validateForm(e);
        if (flag) {
            try {
                if (userValue?.id) {
                    //Update
                    const token = localStorage.getItem('SessionToken');
                    const refreshToken = localStorage.getItem('RefreshToken');
                    let val = {
                        id: userValue?.id,
                        image: image ? image : null,
                        firstName: userValue?.firstName,
                        middleName: userValue?.middleName,
                        lastName: userValue?.lastName,
                        email: userValue?.email,
                        contactNo: userValue?.contactNo,
                        gender: userValue?.gender
                    };
                    const res = await APIservice.httpPost(
                        '/api/admin/users/updateUser',
                        val,
                        token,
                        refreshToken
                    );
                    if (res && res.status == 200) {
                        let credentail = userValue;
                        localStorage.setItem("Credentials", JSON.stringify(credentail));
                    } else if (res.status == 401) {
                        navigate('/admin');
                        localStorage.clear();
                    } else if (res.status == 203 || res.status == 400) {
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
            } catch (error: any) {
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

    const handleUpdateAuthenticationStatus = async (e: any) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            const res = await APIservice.httpPost(
                '/api/admin/users/updateAuthenticationStatus',
                { "isTwoFactorEnable": !userValue.isTwoFactorEnable },
                token,
                refreshToken
            );
            if (res.status === 200) {
                if (!userValue.isTwoFactorEnable) {
                    setIs2FAQRCode(true);
                    setqrCodeUrl(res.recordList[0].otpAuthUrl);
                    setBase32(res.recordList[0].baseSecret);
                }

                let credentail = userValue;
                credentail.isTwoFactorEnable = !userValue.isTwoFactorEnable
                localStorage.setItem("Credentials", JSON.stringify(credentail));
                handleCloseTwoFactorAuth();

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
    }

    const handleCloseQRCode = (e: any) => {
        setIs2FAQRCode(false);
    }

    const [errorArray, setErrorArray] = useState<boolean[]>([]);
    const handleImageError = (ele: any, index: number) => {
        setErrorArray((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors[index] = true;
            return newErrors;
        });
    }

    const handleResetTwoFactorAuth = async (e: any) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('SessionToken');
            const refreshToken = localStorage.getItem('RefreshToken');
            const res = await APIservice.httpPost(
                '/api/admin/users/resetAuthenticationOTP',
                {},
                token,
                refreshToken
            );
            if (res.status === 200) {
                //if (!userValue.isTwoFactorEnable) {
                setIs2FAQRCode(true);
                setqrCodeUrl(res.recordList[0].otpAuthUrl);
                setBase32(res.recordList[0].baseSecret);
                //}

                // let credentail = userValue;
                // credentail.isTwoFactorEnable = !userValue.isTwoFactorEnable
                // localStorage.setItem("Credentials", JSON.stringify(credentail));
                handleCloseTwoFactorAuth();

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
    }

    return (
        <div>
            <ToastContainer
                style={{ top: '8.5%', right: '0%' }}
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
                <title>Profile</title>
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
                                        Profile
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1.5}>
                                <Grid item>
                                    {credentail?.email === "demo@admin.com" ? <></> : <>
                                        {userValue?.isTwoFactorEnable ?
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
                                                onClick={handleResetTwoFactorAuth}
                                                size="small"
                                            ><LockResetIcon></LockResetIcon>Reset 2FA</Button>
                                            : <></>
                                        }
                                        {userValue?.isTwoFactorEnable ?
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
                                                onClick={handleResetTwoFactorAuth}
                                                size="small"
                                            ><LockResetIcon></LockResetIcon></Button>
                                            : <></>
                                        }
                                    </>
                                    }
                                </Grid>
                                <Grid item>
                                    {credentail?.email === "demo@admin.com" ? <></> : <>
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
                                                },
                                                width: "150px"
                                            }}
                                            variant="contained"
                                            onClick={handleEnableTwoFactorAuth}
                                            size="small"
                                        >
                                            {userValue?.isTwoFactorEnable ?
                                                <>
                                                    <NoEncryptionGmailerrorredIcon></NoEncryptionGmailerrorredIcon>Disabled 2FA
                                                </>
                                                :
                                                <>
                                                    <LockIcon></LockIcon>Enable 2FA
                                                </>
                                            }
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
                                            onClick={handleEnableTwoFactorAuth}
                                            size="small"
                                        >
                                            {userValue?.isTwoFactorEnable ?
                                                <>
                                                    <NoEncryptionGmailerrorredIcon></NoEncryptionGmailerrorredIcon>
                                                </>
                                                :
                                                <>
                                                    <LockIcon></LockIcon>
                                                </>
                                            }
                                        </Button>
                                    </>
                                    }
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
                                        <Box p={1}>
                                            <Form style={{ height: 'calc(100vh - 300px)' }}>
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
                                                        name="image"
                                                        onChange={(e) => {
                                                            onFileChange(e);
                                                            onImageChange(e);
                                                        }}
                                                        className="upload-button"
                                                    />
                                                    <label htmlFor="icon-button-file">
                                                        {image ? (
                                                            <div>
                                                                {errorArray[0] ? (
                                                                    <img src="/userLogo.png" alt="Default Image" style={{
                                                                        height: '100px',
                                                                        width: '100px'
                                                                        // borderRadius: '50%',
                                                                    }} />
                                                                ) : (
                                                                    <img
                                                                        src={image}
                                                                        alt="userProfile"
                                                                        style={{
                                                                            height: '100px',
                                                                            width: '100px'
                                                                            // borderRadius: '50%',
                                                                        }}
                                                                        onError={() => { handleImageError(image, 0); }}
                                                                    />
                                                                    //   <img src={process.env.REACT_APP_IMAGE_URL + ele.documentUrl} style={{ height: 'calc(100vh - 650px)', width: 'auto' }} onError={() => { handleImageError(ele, ind); ele.isError = true; }}></img>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src="/userLogo.png"
                                                                alt="userProfile"
                                                                style={{
                                                                    height: '100px',
                                                                    width: '100px'
                                                                    // borderRadius: '50%',
                                                                }}
                                                            />
                                                        )}
                                                    </label>
                                                </FormGroup>
                                                <Row>
                                                    <Col sm>
                                                        <TextField
                                                            fullWidth
                                                            margin="dense"
                                                            label="Firstname"
                                                            type="text"
                                                            variant="outlined"
                                                            name="firstName"
                                                            value={userValue?.firstName}
                                                            onChange={(e: any) => {
                                                                validateFirstName(e);
                                                                handlechange(e);
                                                            }}
                                                            required={true}
                                                        />
                                                        <FormHelperText
                                                            style={{ color: 'red', height: '22px' }}
                                                        >
                                                            {isFirstNameError && firstNameErrorMsg}
                                                        </FormHelperText>
                                                    </Col>
                                                    <Col sm>
                                                        <TextField
                                                            fullWidth
                                                            margin="dense"
                                                            label="Middlename"
                                                            type="text"
                                                            variant="outlined"
                                                            name="middleName"
                                                            value={userValue?.middleName}
                                                            onChange={(e: any) => {
                                                                validateMiddleName(e);
                                                                handlechange(e);
                                                            }}
                                                            required={true}
                                                        />
                                                        <FormHelperText
                                                            style={{ color: 'red', height: '22px' }}
                                                        >
                                                            {isMiddleNameError && middleNameErrorMsg}
                                                        </FormHelperText>
                                                    </Col>
                                                    <Col sm>
                                                        <TextField
                                                            fullWidth
                                                            margin="dense"
                                                            label="Lastname"
                                                            type="text"
                                                            variant="outlined"
                                                            name="lastName"
                                                            value={userValue?.lastName}
                                                            onChange={(e: any) => {
                                                                validateLastName(e);
                                                                handlechange(e);
                                                            }}
                                                            required={true}
                                                        />
                                                        <FormHelperText
                                                            style={{ color: 'red', height: '22px' }}
                                                        >
                                                            {isLastNameError && lastNameErrorMsg}
                                                        </FormHelperText>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            margin="dense"
                                                            label="Email"
                                                            type="text"
                                                            variant="outlined"
                                                            name="email"
                                                            value={userValue?.email}
                                                            onChange={(e: any) => {
                                                                validateEmail(e);
                                                                handlechange(e);
                                                            }}
                                                            required={true}
                                                        />
                                                        <FormHelperText
                                                            style={{ color: 'red', height: '22px' }}
                                                        >
                                                            {isEmailValidateError &&
                                                                emailValidateErrorMsg}
                                                        </FormHelperText>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            margin="dense"
                                                            label="Confirm Email"
                                                            type="text"
                                                            variant="outlined"
                                                            name="confirmEmail"
                                                            value={userValue?.confirmEmail}
                                                            onChange={(e: any) => {
                                                                confirmEmailValidation(e);
                                                                handlechange(e);
                                                            }}
                                                            required={true}
                                                        />
                                                        <FormHelperText
                                                            style={{ color: 'red', height: '22px' }}
                                                        >
                                                            {isEmailError &&
                                                                confirmEmailValidateErrorMsg}
                                                        </FormHelperText>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            margin="dense"
                                                            id="name"
                                                            label="Contact No"
                                                            type="text"
                                                            variant="outlined"
                                                            name="contactNo"
                                                            value={userValue?.contactNo}
                                                            onChange={(e: any) => {
                                                                ValidatePhone(e);
                                                                handlechange(e);
                                                            }}
                                                            required={true}
                                                        />
                                                        <FormHelperText
                                                            style={{ color: 'red', height: '22px' }}
                                                        >
                                                            {isPhoneValidateError &&
                                                                phoneValidateErrorMsg}
                                                        </FormHelperText>
                                                    </Col>
                                                    <Col xs={12} md={6}>
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
                                                                    checked={userValue?.gender === 'Female'}
                                                                    onChange={(e: any) => {
                                                                        validateGender(e);
                                                                        handlechange(e);
                                                                    }}
                                                                    control={<Radio />}
                                                                    label="Female"
                                                                />
                                                                <FormControlLabel
                                                                    name="gender"
                                                                    value="Male"
                                                                    checked={userValue?.gender === 'Male'}
                                                                    onChange={(e: any) => {
                                                                        validateGender(e);
                                                                        handlechange(e);
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
                                                    </Col>
                                                </Row>
                                            </Form>
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
                                                    {isUserError && UserErrorMsg}
                                                </FormHelperText>
                                                <Button disabled={credentail?.email === "demo@admin.com"} onClick={saveUsers}>Save</Button>
                                            </Box>
                                            <div>
                                                <Dialog
                                                    open={ischeck}
                                                    onClose={handleCloseTwoFactorAuth}
                                                    fullWidth
                                                    maxWidth="xs"
                                                >
                                                    <DialogTitle
                                                        sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
                                                    >
                                                        {userValue?.isTwoFactorEnable ? 'Inactive Two Factor Authentication' : 'Active Two Factor Authentication'}
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText
                                                            style={{ fontSize: '1rem', letterSpacing: '0.00938em' }}
                                                        >
                                                            {userValue?.isTwoFactorEnable
                                                                ? 'Are you sure you want to Inactive Two Factor Authentication?'
                                                                : 'Are you sure you want to Active Two Factor Authentication?'}
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleCloseTwoFactorAuth}>Cancel</Button>
                                                        <Button onClick={handleUpdateAuthenticationStatus}>Yes</Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                            <div>
                                                <Dialog
                                                    open={is2FAQRCode}
                                                    onClose={handleCloseQRCode}
                                                    fullWidth
                                                    maxWidth="xs">
                                                    <DialogTitle
                                                        sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
                                                    >
                                                        Two-Factor Authentication
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <h4 className={styles.heading4}>
                                                            Configuring Google Authenticator or Authy
                                                        </h4>
                                                        <div className={styles.orderedList}>
                                                            <li>
                                                                Install Google Authenticator (IOS - Android) or Authy (IOS -
                                                                Android).
                                                            </li>
                                                            <li>In the authenticator app, select "+" icon.</li>
                                                            <li>
                                                                Select "Scan a barcode (or QR code)" and use the phone's camera
                                                                to scan this barcode.
                                                            </li>
                                                        </div>
                                                        <div>
                                                            <h4 className={styles.heading4}>Scan QR Code</h4>
                                                            <div className="flex justify-center">
                                                                <QRCode value={qrcodeUrl} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className={styles.heading4}>Or Enter Code Into Your App</h4>
                                                            <p className="text-sm">SecretKey: {base32} (Base32 encoded)</p>
                                                        </div>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleCloseQRCode}>Close</Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                        </Box>

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

export default Profile;