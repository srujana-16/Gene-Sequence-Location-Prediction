import React from 'react';
import './DataVisualization.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/img/statewise_distribution.png';
import '../assets/img/statewise_accuracy.png';

// This component houses the code for the Data Visualization page that shows the statewise distribution of the dataset 
// and the prediction accuracy of the model. This page is only for a quick glance at additional information, and does not
// add any functionality to the application.

const DataVisualization = () => {
  return (
    <div className="dashboard">
      <div className="translucent-container">
        <div className='rectangular-plot'>
          <div className="box">
            <img src={require('../assets/img/statewise_distribution.png')} alt="Statewise Distribution" style={
              {
                objectFit: 'contain',
                height: '100%',
                width: '100%',
              }
            } />
            <div className="box2">
              <div className="info">
                <h1>70151</h1>
                <p>Dataset Size</p>
              </div>
            </div>
          </div>
        </div>
        <div className='rectangular-plot'>
          <div className="box">
            <img src={require('../assets/img/statewise_accuracy.png')} alt="Statewise Accuracy" style={
              {
                objectFit: 'contain',
                height: '100%',
                width: '100%',
              }
            } />
            <div className="box2">
              <div className="info">
                <h1>94.82%</h1>
                <p>Prediction Accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
