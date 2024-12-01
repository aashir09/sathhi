import React from 'react';
import './appuserviewLoader.css';

interface Props {
  title: string;
}

const Loader1 = (props: Props) => {
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

export default Loader1;
