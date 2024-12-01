import React, { ChangeEvent, useEffect } from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Col, Form, FormText, InputGroup, Row } from 'react-bootstrap';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import APIservice from 'src/utils/APIservice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  password: '',
  confirmPassword: '',
  id: '',
  token: ''
};

const Reset = () => {
  const [reset, setReset] = React.useState<any>(initialState);
  const [userId, setUserId] = useState('');
  const [isPasswordValidateError, setIsPasswordValidateError] = useState(false);
  const [passwordValidateErrorMsg, setPasswordValidateErrorMsg] = useState('');
  const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const navigate = useNavigate();

  const onFormSubmit = (e) => {
    e.preventDefault();
  };

  const notify = () => {
    toast.success('Password Reset Successfully!', {
      position: 'top-right',
      autoClose: 6000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    });
  };

  let { token } = useParams();

  useEffect(() => {
    getdata();
  }, []);

  const getdata = async () => {
    try {
      const res = await APIservice.httpPost(
        '/api/admin/users/verifyforgotPasswordLink',
        { token }
      );
      setUserId(res.recordList[0].userId);
      if (res && res.status == 200) {
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setReset({ ...reset, [name]: value });
  };

  const mediumRegex = new RegExp(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{7,})'
  );
  const ValidatePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (value) {
      if (!mediumRegex.test(event.target.value)) {
        setIsPasswordValidateError(true);
        setPasswordValidateErrorMsg('Password must be 8 character and number');
      } else {
        setIsPasswordValidateError(false);
        setPasswordValidateErrorMsg('');
      }
    } else {
      setIsPasswordValidateError(true);
      setPasswordValidateErrorMsg('Please enter password');
    }
  };

  const confirmPasswordValidation = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (value) {
      if (!(reset.password === value)) {
        setIsConfirmPasswordError(true);
        setConfirmPasswordError('Password and Confirm Password is not same');
      } else {
        setIsConfirmPasswordError(false);
        setConfirmPasswordError('');
      }
    } else {
      setIsConfirmPasswordError(true);
      setConfirmPasswordError('Please enter confirm password');
    }
  };

  const validateForm = (event: any) => {
    event.preventDefault();
    var flag = true;
    if (!reset.password) {
      setIsPasswordValidateError(true);
      setPasswordValidateErrorMsg('Please enter password');
      flag = false;
    } else {
      if (mediumRegex.test(reset.password)) {
        setIsPasswordValidateError(false);
        setPasswordValidateErrorMsg('');
        flag = true;
      } else {
        setIsPasswordValidateError(true);
        setPasswordValidateErrorMsg('Password must be 8 character and number');
        flag = false;
      }
    }
    if (!reset.confirmPassword) {
      setIsConfirmPasswordError(true);
      setConfirmPasswordError('Please enter confirm password');
      flag = false;
    } else {
      if (!(reset.confirmPassword === reset.password)) {
        setIsConfirmPasswordError(true);
        setConfirmPasswordError('Password and Confirm Password is not same');
      } else {
        setIsConfirmPasswordError(false);
        setConfirmPasswordError('');
      }
    }
    return flag;
  };

  const handlesubmit = async (event: any) => {
    event.preventDefault();
    var flag = validateForm(event);
    if (flag) {
      try {
        let obj = {
          id: userId,
          token: token,
          password: reset.password
        };
        const res = await APIservice.httpPost(
          '/api/admin/users/resetPassword',
          obj
        );
        setReset(res.recordList);
        if (res && res.status == 200) {
          toast.success('Password Reset Successfully!', {
            position: 'top-right',
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          });
          setTimeout(() => {
            navigate('/admin');
          }, 4000);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Container>
        <Row
          className=" d-flex justify-content-center align-items-center"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <Col md={8} lg={6} xs={12} style={{ maxWidth: '500px' }}>
            {/* {token ? ( */}
            <div
              style={{
                height: '72px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img src="/Image20221010173301.png" height="50" alt="Logo" />
            </div>
            <Card sx={{ borderRadius: '10px' }}>
              <CardContent style={{ padding: '24px' }}>
                <Form onSubmit={onFormSubmit}>
                  <Typography
                    align="center"
                    fontSize="25px"
                    fontWeight="bolder"
                    className="mb-3"
                  >
                    Reset Password
                  </Typography>
                  <TextField
                    required
                    sx={{ width: '100%' }}
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword === true ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    name="password"
                    value={reset.password}
                    onChange={(event: any) => {
                      ValidatePassword(event);
                      handleInputChange(event);
                    }}
                  />
                  <FormHelperText style={{ color: 'red', height: '22px' }}>
                    {isPasswordValidateError && passwordValidateErrorMsg}
                  </FormHelperText>
                  <TextField
                    required
                    sx={{ width: '100%' }}
                    label="Confirm Password"
                    type={showPassword1 ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword1(!showPassword1)}
                            edge="end"
                          >
                            {showPassword1 === true ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    name="confirmPassword"
                    value={reset.confirmPassword}
                    onChange={(event: any) => {
                      confirmPasswordValidation(event);
                      handleInputChange(event);
                    }}
                  />
                  <FormHelperText style={{ color: 'red', height: '22px' }}>
                    {isConfirmPasswordError && confirmPasswordError}
                  </FormHelperText>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handlesubmit}
                    style={{ backgroundColor: '#5569ff', fontWeight: 'bolder' }}
                    className="buttonCss"
                  >
                    Submit
                  </Button>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    sx={{ my: 1 }}
                  >
                    <RouterLink
                      to="/"
                      className="forgotPasswordFont"
                      style={{
                        color: '#5569ff',
                        textDecoration: 'none',
                        justifyContent: 'flex-end',
                        fontSize: '15px'
                      }}
                    >
                      Back to login page?
                    </RouterLink>
                  </Stack>
                </Form>
              </CardContent>
            </Card>
            {/* ) : (
              <Card sx={{ p: 10, mb: 10, borderRadius: 12 }}>
                The Token has already been Used
              </Card>
            )} */}
          </Col>
        </Row>
      </Container>
    </div>
    // </div>
  );
};

export default Reset;
