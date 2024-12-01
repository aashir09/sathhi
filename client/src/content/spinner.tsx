import React from 'react';
import './spinner.css';

interface Props {
  title: string;
}

const Loader = (props: Props) => {
  const { title } = props;
  return (
    // <div className="loader">
    //     <img className="img" src={loader} alt="" />
    //     <span>{title}</span>
    // </div>
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default Loader;
