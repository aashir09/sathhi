import React from 'react';
import './loaderDashboard.css';

interface Props {
  title: string;
}

const LoaderSmallCard = (props: Props) => {
  const { title } = props;
  return (
    // <div className="loader">
    //     <img className="img" src={loader} alt="" />
    //     <span>{title}</span>
    // </div>
    <div className="smallcard-container">
      <div className="loading-smallcard-spinner"></div>
    </div>
  );
};

export default LoaderSmallCard;
