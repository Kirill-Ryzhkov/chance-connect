import React from 'react';
import '../../assets/css/arrow.css';

const Arrow = () => {
  return (
    <div className="arrow-container">
      <div className="content">
        <div className="tap-card md:text-3xl sm:text-2xl">
          Tap your card
        </div>
        <div className="arrow">
          <span className="arrow-body"></span>
          <span className="arrow-head"></span>
        </div>
      </div>
    </div>
  );
};

export default Arrow;