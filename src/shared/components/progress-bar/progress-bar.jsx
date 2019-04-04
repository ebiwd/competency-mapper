import React from 'react';
import PropTypes from 'prop-types';
import styles from './progress-bar.css';

function ProgressBar({ isActive }) {
    return (
        <div className={styles.base}>

        </div>
    );
}

ProgressBar.defaultProps = {
    isActive: false
};

ProgressBar.propTypes = {
    isActive: PropTypes.boolean
};

export default ProgressBar;
