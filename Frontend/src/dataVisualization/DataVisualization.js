import React from 'react';
import './DataVisualization.css';

const DataVisualization = () => {
  return (
    <div className="dashboard">
      <div className="translucent-container">
        <div className="box rectangular-plot">
          <h2>Plot 1</h2>
        </div>
        <div className="box">
          <h2>Plot 2</h2>
        </div>
        <div className="box">
          <h2>Plot 3</h2>
        </div>
        <div className="box text-content"> 
          <h2>Text Content</h2>
          <p>Any other information ig?</p>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
