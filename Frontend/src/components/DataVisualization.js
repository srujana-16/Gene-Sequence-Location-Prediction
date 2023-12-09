import React from 'react';
import './DataVisualization.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/img/statewise_distribution.png';
import '../assets/img/statewise_accuracy.png';

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
