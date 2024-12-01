import React from 'react';
import './loaderDashboard.css';

interface Props {
  title: string;
}

const LoaderCard = (props: Props) => {
  const { title } = props;
  return (
    // <div className="loader">
    //     <img className="img" src={loader} alt="" />
    //     <span>{title}</span>
    // </div>
    <div className="card-container">
      <div className="loading-card-spinner"></div>
    </div>
  );
};

export default LoaderCard;
