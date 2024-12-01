import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Card,
  Container,
  Grid,
  Button,
  Stack,
  Box,
  Typography,
  FormHelperText,
  IconButton,
  CardContent,
  TextField,
  styled
} from '@mui/material';
import { Col, Form, FormText, Row } from 'react-bootstrap';
import validator from 'validator';
// import Logo from 'src/components/LogoSign';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import APIservice from './../../../utils/APIservice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';


const initialstate = {
  email: ''
};

const Forgetpassword = () => {
  // window.onpopstate = () => {
  //   navigate('/admin');
  // }

  const [forgetPassword, setForgetPassword] = React.useState<any>(initialstate);
  const [isEmailError, setIsEmailError] = useState(false);
  const [confirmEmailValidateErrorMsg, setConfirmEmailValidateErrorMsg] =
    useState('');
  const [user, setUser] = useState<any>([]);

  const navigate = useNavigate();

  const onFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setForgetPassword({ ...forgetPassword, [name]: value });
  };

  const emailRegex = new RegExp(
    " /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/"
  );
  const confirmEmailValidation = (e: any) => {
    const { name, value } = e.target;
    if (value) {
      if (validator.isEmail(e.target.value)) {
        setIsEmailError(false);
        setConfirmEmailValidateErrorMsg('');
      } else {
        setIsEmailError(true);
        setConfirmEmailValidateErrorMsg('Invalid Email');
      }
    } else {
      setIsEmailError(true);
      setConfirmEmailValidateErrorMsg('Please enter email');
    }
  };

  const validateForm = (e: any) => {
    e.preventDefault();
    var flag = true;
    if (!forgetPassword.email) {
      setIsEmailError(true);
      setConfirmEmailValidateErrorMsg('Please enter email');
      flag = false;
    } else {
      if (validator.isEmail(forgetPassword.email)) {
        setIsEmailError(false);
        setConfirmEmailValidateErrorMsg('');
        flag = true;
      } else {
        setIsEmailError(true);
        setConfirmEmailValidateErrorMsg('Invalid Email');
        flag = false;
      }
      return flag;
    }
  };

  const handlesubmit = async (event: any) => {
    event.preventDefault();
    var flag = validateForm(event);
    if (flag) {
      try {
        let obj = {
          email: forgetPassword.email
        };
        const res = await APIservice.httpPost(
          '/api/admin/users/forgotPassword',
          obj
        );
        if (res && res.status == 200) {
          setUser(res.recordList);
          toast.success('Mail Send Successfully', {
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
        } else if (res && res.status === 400) {
          toast.error('Please check the Email', {
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          });
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
      {/* <OverviewWrapper> */}
      <Helmet>
        <title>Matrimony</title>
      </Helmet>
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
                    Forgot Password
                  </Typography>
                  <TextField
                    required
                    sx={{ width: '100%', mt: 3 }}
                    type="email"
                    label="Email"
                    autoFocus
                    name="email"
                    value={forgetPassword.email}
                    onChange={(e: any) => {
                      confirmEmailValidation(e);
                      handleInputChange(e);
                    }}
                  />
                  <FormHelperText style={{ color: 'red', height: '22px' }}>
                    {isEmailError && confirmEmailValidateErrorMsg}
                  </FormHelperText>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    onClick={handlesubmit}
                    style={{ backgroundColor: '#5569ff', fontWeight: 'bolder' }}
                    className="buttonCss"
                  >
                    Send Mail
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
                      Back to login page
                    </RouterLink>
                  </Stack>
                </Form>
              </CardContent>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* </OverviewWrapper> */}
    </div>
  );
};

export default Forgetpassword;
