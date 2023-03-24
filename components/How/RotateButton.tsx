import React from 'react';
import styles from './RotateButton.module.css';

export default class RotateButton extends React.Component {
  render() {
    return (
      <div className={styles.rotateButtonContainer}>
        <button className={styles.rotateButton}>Rotate</button>
      </div>
    );
  }
}
