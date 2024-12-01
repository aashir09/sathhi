import React from 'react';
import './LoaderLogin.css';

interface Props {
  title: string;
}

const LoaderLogin = (props: Props) => {
  const { title } = props;
  return (
    // <div className="loader">
    //     <img className="img" src={loader} alt="" />
    //     <span>{title}</span>
    // </div>
    <div className="login-container">
      <div className="loading-login-spinner"></div>
    </div>
  );
};

export default LoaderLogin;
