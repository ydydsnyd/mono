import React from 'react';
import styles from './DemoButton.module.css';

export default class DemoButton extends React.Component {
    render() {
        return (
            <div className={styles.demoContainer}>
                <button className={styles.demoButton}>Increment</button>
            </div>
        );
    }
}