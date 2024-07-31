import React, { useState, useRef, useEffect } from 'react';
import styles from '@styles/ContractComponent.module.css';

const ContractComponent: React.FC = () => {
    const contractText = `0000000000000000000000000000`;

    const inputRef = useRef<HTMLInputElement>(null);
    const [copySuccess, setCopySuccess] = useState('');

    const copyToClipboard = () => {
        if (inputRef.current) {
            inputRef.current.select();
            document.execCommand('copy');
            setCopySuccess('Text copied!');

            setTimeout(() => {
                setCopySuccess('');
                return
            }, 1000);
        }
    };

    return (
        <div className={styles.contractContainer}>
            <p className={styles.contractTitle}>contract address</p>
            <div className={styles.contractInputContainer}>
                <input
                    ref={inputRef}
                    value={contractText}
                    readOnly
                    className={styles.contractInput}
                />
                <button
                    onClick={copyToClipboard}
                    className={styles.contractCopyButton}
                >
                    Copy
                </button>
            </div>
            {copySuccess && <p className={styles.copySuccess}>{copySuccess}</p>}
        </div>
    );
};

export default ContractComponent;
