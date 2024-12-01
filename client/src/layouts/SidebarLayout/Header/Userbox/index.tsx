import { ChangeEvent, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Hidden,
  lighten,
  Popover,
  Typography,
  IconButton,
  TextField,
  FormHelperText,
  InputAdornment
} from '@mui/material';

import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import React from 'react';
import validator from 'validator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import APIservice from 'src/utils/APIservice';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },
  '& .MuiPaper-root': {
    height: '350px'
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

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
       
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        justifyContent="flex-end";
        alignItems="flex-end";
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

const initialDefaultState = {
  oldEmail: '',
  newEmail: '',
  confirmEmail: '',
};

const initialDefaultPasswordState = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function HeaderUserbox() {
  const [userData, setUserData] = useState<any>([]);
  const [isOpen, setOpen] = useState<boolean>(false);

  const [isChageEmailOpen, setIsChangeEmailOpen] = useState<boolean>(false);
  const [changeEmail, setChangeEmail] = React.useState<any>(initialDefaultState);
  const [isChangeEmailValidateError, setIsChangeEmailValidateError] = useState(false);
  const [changeEmailValidateErrorMsg, setChangeEmailValidateErrorMsg] = useState('');
  const [isChangeNewEmailValidateError, setIsChangeNewEmailValidateError] = useState(false);
  const [changeNewEmailValidateErrorMsg, setChangeNewEmailValidateErrorMsg] = useState('');

  const [changePassword, setChangePassword] = React.useState<any>(initialDefaultPasswordState);
  const [isChangePasswordValidateError, setIsChangePasswordValidateError] = useState(false);
  const [changePasswordValidateErrorMsg, setChangePasswordValidateErrorMsg] = useState('');
  const [isChangeNewPasswordValidateError, setIsChangeNewPasswordValidateError] = useState(false);
  const [changeNewPasswordValidateErrorMsg, setChangeNewPasswordValidateErrorMsg] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeNewPassword, setShowChangeNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChagePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);

  React.useEffect(() => {
    getdata();
  }, []);

  const getdata = async () => {
    let credentials = JSON.parse(localStorage.getItem('Credentials'));
    if (credentials && credentials.id) {
      setUserData(credentials);
    }
  };

  const ref = useRef<any>(null);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const navigtelogin = () => {
    localStorage.removeItem('SessionToken');
    localStorage.removeItem('isEnableCustomFields');
    localStorage.removeItem('isUserProfilePicApprove');
    localStorage.removeItem('isEnableFamilyDetails');
    localStorage.removeItem('isEnableAstrologicDetails');
    localStorage.removeItem('isEnableLifeStyles');
    localStorage.removeItem('isEnableCommunity');
    localStorage.removeItem('isEnableSubCommunity');


    navigate('/admin');
  };

  const navigteProfile = () => {
    handleClose();
    navigate('/admin/profile');
  };

  //#region Change Email
  const handleClickChangeEmail = (e: any) => {
    handleClose();
    e.preventDefault();
    let obj = {
      oldEmail: '',
      newEmail: '',
      confirmEmail: '',
    }
    setChangeEmail(obj);
    setIsChangeEmailOpen(true);
  };

  const handleCloseChangeEmail = (e: any) => {
    setIsChangeEmailOpen(false);
  }

  const validateChangeEmail = (e: any) => {
    const { name, value } = e.target;
    if (value) {
      if (validator.isEmail(e.target.value)) {
        setIsChangeEmailValidateError(false);
        setChangeEmailValidateErrorMsg('');
      } else {
        setIsChangeEmailValidateError(true);
        setChangeEmailValidateErrorMsg('Invalid Email');
      }
    } else {
      setIsChangeEmailValidateError(true);
      setChangeEmailValidateErrorMsg('Email is Required');
    }
  };

  const validateChangeNewEmail = (e: any) => {
    const { name, value } = e.target;
    if (value) {
      if (validator.isEmail(e.target.value)) {
        setIsChangeNewEmailValidateError(false);
        setChangeNewEmailValidateErrorMsg('');
      } else {
        setIsChangeNewEmailValidateError(true);
        setChangeNewEmailValidateErrorMsg('Invalid Email');
      }
    } else {
      setIsChangeNewEmailValidateError(true);
      setChangeNewEmailValidateErrorMsg('Email is Required');
    }
  };

  const handleInputDefaultEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setChangeEmail({ ...changeEmail, [name]: value });
  };

  const [isEmailError, setIsEmailError] = useState(false);
  const [confirmEmailValidateErrorMsg, setConfirmEmailValidateErrorMsg] =
    useState('');
  const confirmEmailValidation = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (value) {
      if (!(changeEmail.newEmail === value)) {
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

  const validateEmailForm = (e: any) => {
    e.preventDefault();
    var flag = true;
    if (!changeEmail.newEmail) {
      setIsChangeNewEmailValidateError(true);
      setChangeNewEmailValidateErrorMsg('Email is Required');
      flag = false;
    } else {
      if (validator.isEmail(changeEmail.newEmail)) {
        setIsChangeNewEmailValidateError(false);
        setChangeNewEmailValidateErrorMsg('');
      } else {
        setIsChangeNewEmailValidateError(true);
        setChangeNewEmailValidateErrorMsg('Invalid Email');
        flag = false;
      }
    }
    if (!changeEmail.oldEmail) {
      setIsChangeEmailValidateError(true);
      setChangeEmailValidateErrorMsg('Email is Required');
      flag = false;
    } else {
      if (validator.isEmail(changeEmail.oldEmail)) {
        setIsChangeEmailValidateError(false);
        setChangeEmailValidateErrorMsg('');
      } else {
        setIsChangeEmailValidateError(true);
        setChangeEmailValidateErrorMsg('Invalid Email');
        flag = false;
      }
    }
    if (!changeEmail.confirmEmail) {
      setIsEmailError(true);
      setConfirmEmailValidateErrorMsg('Confirm Email is required');
      flag = false;
    } else {
      if (!(changeEmail.newEmail === changeEmail.confirmEmail)) {
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
    return flag;
  };

  const handleUpdateEmail = async (e: any) => {
    e.preventDefault();
    var flag = validateEmailForm(e);
    if (flag) {
      try {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        const res = await APIservice.httpPost(
          '/api/admin/users/changeEmail',
          changeEmail,
          token,
          refreshToken
        );

        if (res && res.status == 200) {
          setIsChangeEmailOpen(false);
          toast.success("Your Email successully chaged", {
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
        } else if (res.status == 203) {
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
    }
  }
  //#endregion  Change Email

  //#region Change Password
  const handleClickChangePassword = (e: any) => {
    handleClose();
    e.preventDefault();
    let obj = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    setChangePassword(obj);
    setIsChangePasswordOpen(true);
  };

  const handleCloseChangePassword = (e: any) => {
    setIsChangePasswordOpen(false);
  }

  const mediumRegex = new RegExp(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})'
  );
  const ValidateChangePassword = (e: any) => {
    const { name, value } = e.target;
    if (value) {
      if (mediumRegex.test(e.target.value)) {
        setIsChangePasswordValidateError(false);
        setChangePasswordValidateErrorMsg('');
      } else {
        setIsChangePasswordValidateError(true);
        setChangePasswordValidateErrorMsg('Password is Required');
      }
    } else {
      setIsChangePasswordValidateError(true);
      setChangePasswordValidateErrorMsg('Password is Required');
    }
  };

  const ValidateChangeNewPassword = (e: any) => {
    const { name, value } = e.target;
    if (value) {
      if (mediumRegex.test(e.target.value)) {
        setIsChangeNewPasswordValidateError(false);
        setChangeNewPasswordValidateErrorMsg('');
      } else {
        setIsChangeNewPasswordValidateError(true);
        setChangeNewPasswordValidateErrorMsg('Password is Required');
      }
    } else {
      setIsChangeNewPasswordValidateError(true);
      setChangeNewPasswordValidateErrorMsg('Password is not validate');
    }
  };

  const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const confirmPasswordValidation = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (value) {
      if (!(changePassword.newPassword === value)) {
        setIsConfirmPasswordError(true);
        setConfirmPasswordError('Password and confirm password must matched');
      } else {
        setIsConfirmPasswordError(false);
        setConfirmPasswordError('');
      }
    } else {
      setIsConfirmPasswordError(true);
      setConfirmPasswordError('Confirm password is required');
    }
  };

  const handleInputDefaultPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setChangePassword({ ...changePassword, [name]: value });
  };


  const validatePasswordForm = (e: any) => {
    e.preventDefault();
    var flag = true;
    if (!changePassword.newPassword) {
      setIsChangeNewPasswordValidateError(true);
      setChangeNewPasswordValidateErrorMsg('Password is Required');
      flag = false;
    } else {
      if (mediumRegex.test(changePassword.newPassword)) {
        setIsChangeNewPasswordValidateError(false);
        setChangeNewPasswordValidateErrorMsg('');
      } else {
        setIsChangeNewPasswordValidateError(true);
        setChangeNewPasswordValidateErrorMsg('Password is not validate');
        flag = false;
      }
    }
    if (!changePassword.oldPassword) {
      setIsChangePasswordValidateError(true);
      setChangePasswordValidateErrorMsg('Password is Required');
      flag = false;
    } else {
      if (mediumRegex.test(changePassword.oldPassword)) {
        setIsChangePasswordValidateError(false);
        setChangePasswordValidateErrorMsg('');
      } else {
        setIsChangePasswordValidateError(true);
        setChangePasswordValidateErrorMsg('Password is not validate');
        flag = false;
      }
    }
    if (!changePassword.confirmPassword) {
      setIsConfirmPasswordError(true);
      setConfirmPasswordError('Confirm password is required');
      flag = false;
    } else {
      if (!(changePassword.newPassword === changePassword.confirmPassword)) {
        setIsConfirmPasswordError(true);
        setConfirmPasswordError('Password and confirm password must matched');
        flag = false;
      } else {
        setIsConfirmPasswordError(false);
        setConfirmPasswordError('');
      }
    }

    return flag;
  };

  const handleUpdatePassword = async (e: any) => {
    e.preventDefault();
    var flag = validatePasswordForm(e);
    if (flag) {
      try {
        const token = localStorage.getItem('SessionToken');
        const refreshToken = localStorage.getItem('RefreshToken');
        const res = await APIservice.httpPost(
          '/api/admin/users/changePassword',
          changePassword,
          token,
          refreshToken
        );

        if (res && res.status == 200) {
          setIsChangePasswordOpen(false);
          toast.success("Your Password successully chaged", {
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
        } else if (res.status == 203) {
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
    }
  }
  //#endregion Change Password

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        {userData.image ? (
          <Avatar
            variant="rounded"
            alt="profileImage"
            src={process.env.REACT_APP_IMAGE_URL + userData.image}
          />
        ) : (
          <Avatar variant="rounded" alt="profileImage">
            {userData.firstName ? userData.firstName[0] : null}
          </Avatar>
        )}
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {userData.firstName} {userData.lastName}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {userData.roleName}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          {userData.image ? (
            <Avatar
              variant="rounded"
              alt="profileImage"
              src={process.env.REACT_APP_IMAGE_URL + userData.image}
            />
          ) : (
            <Avatar variant="rounded" alt="profileImage">
              {userData.firstName ? userData.firstName[0] : null}
            </Avatar>
          )}
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {userData.firstName} {userData.lastName}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {userData.roleName}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <div style={{ padding: '8px 18px', margin: '5px' }}>
          <span color="primary" style={{ cursor: 'pointer', color: '#0d6efd' }} onClick={navigteProfile}>
            {/* <LockOpenTwoToneIcon sx={{ mr: 1 }} /> */}
            Profile
          </span>
        </div>
        <div style={{ padding: '8px 18px', margin: '5px' }}>
          <span color="primary" style={{ cursor: 'pointer', color: '#0d6efd' }} onClick={handleClickChangeEmail}>
            {/* <LockOpenTwoToneIcon sx={{ mr: 1 }} /> */}
            Change Email
          </span>
        </div>
        <div style={{ padding: '8px 18px', margin: '5px' }}>
          <span color="primary" style={{ cursor: 'pointer', color: '#0d6efd' }} onClick={handleClickChangePassword}>
            {/* <LockOpenTwoToneIcon sx={{ mr: 1 }} /> */}
            Change Password
          </span>
        </div>
        <Divider sx={{ mb: 0 }} />
        {/* <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={navigteProfile}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Profile
          </Button>
        </Box>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={handleClickChangeEmail}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Change Email
          </Button>
        </Box>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={handleClickChangePassword}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Change Password
          </Button>
        </Box>
        <Divider /> */}
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={navigtelogin}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </Popover>
      <div>
        <Dialog
          open={isChageEmailOpen}
          onClose={handleCloseChangeEmail}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
          >
            Change Email
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Your Old Email Address"
              type="text"
              fullWidth
              variant="outlined"
              name="oldEmail"
              value={changeEmail.oldEmail}
              onChange={(e: any) => {
                validateChangeEmail(e);
                handleInputDefaultEmailChange(e);
              }}
              required={true}
            />
            <FormHelperText style={{ color: 'red', height: '22px' }}>
              {isChangeEmailValidateError && changeEmailValidateErrorMsg}
            </FormHelperText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Enter New Email Address"
              type="text"
              fullWidth
              variant="outlined"
              name="newEmail"
              value={changeEmail.newEmail}
              onChange={(e: any) => {
                validateChangeNewEmail(e);
                handleInputDefaultEmailChange(e);
              }}
              required={true}
            />
            <FormHelperText style={{ color: 'red', height: '22px' }}>
              {isChangeNewEmailValidateError && changeNewEmailValidateErrorMsg}
            </FormHelperText>
            <TextField
              fullWidth
              margin="dense"
              label="Confirm Email"
              type="text"
              variant="outlined"
              name="confirmEmail"
              value={changeEmail.confirmEmail}
              onChange={(e: any) => {
                confirmEmailValidation(e);
                handleInputDefaultEmailChange(e);
              }}
              required={true}
            />
            <FormHelperText
              style={{ color: 'red', height: '22px' }}
            >
              {isEmailError &&
                confirmEmailValidateErrorMsg}
            </FormHelperText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseChangeEmail} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
            <Button  disabled={userData?.email === "demo@admin.com"} onClick={handleUpdateEmail} variant="outlined" style={{marginRight: '10px'}}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={isChagePasswordOpen}
          onClose={handleCloseChangePassword}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            sx={{ m: 0, p: 2, fontSize: '20px', fontWeight: 'bolder' }}
          >
            Change Password
          </DialogTitle>
          <DialogContent>
            <TextField
              required
              sx={{ width: '100%', mt: '1%' }}
              name="oldPassword"
              label="Old Password"
              type={showChangePassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowChangePassword(!showChangePassword)}
                      edge="end"
                    >
                      {showChangePassword === true ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              value={changePassword.oldPassword}
              onChange={(e: any) => {
                ValidateChangePassword(e);
                handleInputDefaultPasswordChange(e);
              }}
            />
            <FormHelperText style={{ color: 'red', height: '22px' }}>
              {isChangePasswordValidateError && changePasswordValidateErrorMsg}
            </FormHelperText>
            <TextField
              required
              sx={{ width: '100%', mt: '1%' }}
              name="newPassword"
              label="New Password"
              type={showChangeNewPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowChangeNewPassword(!showChangeNewPassword)}
                      edge="end"
                    >
                      {showChangeNewPassword === true ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              value={changePassword.newPassword}
              onChange={(e: any) => {
                ValidateChangeNewPassword(e);
                handleInputDefaultPasswordChange(e);
              }}
            />
            <FormHelperText style={{ color: 'red', height: '22px' }}>
              {isChangeNewPasswordValidateError && changeNewPasswordValidateErrorMsg}
            </FormHelperText>
            <TextField
              fullWidth
              margin="dense"
              label="Confirm Password"
              type={
                showConfirmPassword === true
                  ? 'text'
                  : 'password'
              }
              variant="outlined"
              name="confirmPassword"
              value={changePassword.confirmPassword}
              onChange={(e: any) => {
                confirmPasswordValidation(e);
                handleInputDefaultPasswordChange(e);
              }}
              required={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="start"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword === true ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </InputAdornment>
                )
              }}
            />
            <FormHelperText
              style={{ color: 'red', height: '22px' }}
            >
              {isConfirmPasswordError &&
                confirmPasswordError}
            </FormHelperText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseChangePassword} variant="outlined" style={{marginRight: '10px'}}>Cancel</Button>
            <Button disabled={userData?.email === "demo@admin.com"} onClick={handleUpdatePassword} variant="outlined" style={{marginRight: '10px'}}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default HeaderUserbox;
