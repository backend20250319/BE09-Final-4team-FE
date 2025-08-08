"use client";

import styles from './ToggleSwitch.module.css';

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label className={styles.toggleSwitch}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.slider}></span>
    </label>
  );
};

export default ToggleSwitch; 