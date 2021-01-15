import React from 'react';
import PropTypes from 'prop-types';
import styles from './progress-bar.module.css';

function ProgressBar({ isActive }) {
  return (
    <React.Fragment>
      {isActive && (
        <div
          className={`warning progress ${styles.progress}`}
          role="progressbar"
        >
          <div className={`progress-meter ${styles.meter}`} />
        </div>
      )}
    </React.Fragment>
  );
}

ProgressBar.defaultProps = {
  isActive: false
};

ProgressBar.propTypes = {
  isActive: PropTypes.bool
};

export default ProgressBar;
