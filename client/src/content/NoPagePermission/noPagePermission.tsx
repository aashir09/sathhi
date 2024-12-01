import {
  Button,
  Card,
  Stack,
  Typography,
  FormHelperText,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Box,
  styled,
  Link
} from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Form, Container, Col, Row, InputGroup } from 'react-bootstrap';
import { ChangeEvent, useEffect, useState } from 'react';

import validator from 'validator';
import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../dashboards/Crypto/dashboard.css';
import Logo from 'src/components/LogoSign';
import { Helmet } from 'react-helmet-async';

import QRCode from 'react-qr-code';

const OverviewWrapper = styled(Box)(
  () => `
      overflow: auto;
      flex: 1;
      overflow-x: hidden;
      align-items: center;
  `
);

const initialState = {
  email: '',
  password: ''
};

const initialDefaultState = {
  email: '',
};

const initialDefaultPasswordState = {
  password: '',
};

const initialAuthenticationCodeState = {
  twoFactorCode: '',
};

const styles = {
  heading4: `text-base text-ct-blue-600 font-medium border-b mb-2`,
  orderedList: `space-y-1 text-sm list-decimal`,
};

function NoPagePermission() {
  const [login, setLogin] = React.useState<any>(initialState);
  const [isEmailValidateError, setIsEmailValidateError] = useState(false);
  const [emailValidateErrorMsg, setEmailValidateErrorMsg] = useState('');
  const [isPasswordValidateError, setIsPasswordValidateError] = useState(false);
  const [passwordValidateErrorMsg, setPasswordValidateErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [changeEmail, setChangeEmail] = React.useState<any>(initialDefaultState);
  const [isChangeEmailValidateError, setIsChangeEmailValidateError] = useState(false);
  const [changeEmailValidateErrorMsg, setChangeEmailValidateErrorMsg] = useState('');
  const [isChangeEmail, setIsChangeEmail] = useState(false);

  const [changePassword, setChangePassword] = React.useState<any>(initialDefaultPasswordState);
  const [isChangePasswordValidateError, setIsChangePasswordValidateError] = useState(false);
  const [changePasswordValidateErrorMsg, setChangePasswordValidateErrorMsg] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [is2FAQRCode, setIs2FAQRCode] = useState(false);
  const [is2FAEnter, setIs2FAEnter] = useState(false);

  const [email, setEmail] = useState('');

  const [isAuthenticationCodeError, setIsAuthenticationCodeErrorError] = useState(false);
  const [authenticationCodeErrorMsg, setAuthenticationCodeErrorMsg] = useState('');
  const [authenticationCode, setAuthenticationCode] = React.useState<any>(initialAuthenticationCodeState);

  const [refreshToken, setRefreshToken] = useState<any>();
  const [sessionToken, setSessionToken] = useState<any>();
  const [userId, setUserId] = useState<any>();
  const [crendientials, setCrendientials] = useState<any>();
  const [defaultCurrency, setDefaultCurrency] = useState<any>();

  const [qrcodeUrl, setqrCodeUrl] = useState("");
  const [base32, setBase32] = useState("");


  const onFormSubmit = (e) => {
    e.preventDefault();
  };


  useEffect(() => {
    if (localStorage.getItem('Credentials')) {

    }
  }, []);

  const handleRedirect = async (e: any) => {
    localStorage.clear();
    navigate('/admin');
  }



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
      <OverviewWrapper>
        <Helmet>
          <title>Matrimony</title>
        </Helmet>
        <Container>
          <Row
            className="d-flex justify-content-center align-items-center"
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <Col md={8} lg={6} xs={12} style={{ maxWidth: '500px' }}>
              <div style={{ height: '72px' }}>
                <Logo />
              </div>
              <Card style={{ borderRadius: '10px' }}>
                <CardContent>
                  <Typography className="mb-3"
                    align="center"
                    fontSize="20px"
                    fontWeight="bolder" style={{ "textAlign": "center", "padding": "10px 0px", "marginBottom": "20px" }}>
                   You do not have a permission to access admin panel.
                  </Typography>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    onClick={handleRedirect}
                    style={{ fontWeight: 'bolder', marginTop: '1%' }}
                  >Back</Button>
                </CardContent>

              </Card>
            </Col>
          </Row>
        </Container>
      </OverviewWrapper>
    </div>
  );
}

export default NoPagePermission;
