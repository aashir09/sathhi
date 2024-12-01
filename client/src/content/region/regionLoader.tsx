import React from 'react';
import './regionLoader.css';

interface Props {
  title: string;
}

const RegionLoader = (props: Props) => {
  const { title } = props;
  return (
    // <div className="loader">
    //     <img className="img" src={loader} alt="" />
    //     <span>{title}</span>
    // </div>
    <div className="region-container">
      <div className="loading-region-spinner"></div>
    </div>
  );
};

export default RegionLoader;