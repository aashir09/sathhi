import React from 'react';
import './loaderDashboard.css';

interface Props {
  title: string;
}

const LoaderGraph = (props: Props) => {
  const { title } = props;
  return (
    // <div className="loader">
    //     <img className="img" src={loader} alt="" />
    //     <span>{title}</span>
    // </div>
    <div className="graph-container">
      <div className="loading-graph-spinner"></div>
    </div>
  );
};

export default LoaderGraph;
