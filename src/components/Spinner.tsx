import styles from '../styles/Spinner.module.css';

const Spinner = ({size = '50px'}) => {
    return (
        <div className={styles.spinnerContainer} >
            <div className={styles.spinner} style={{width: size, height: size}}></div>
        </div>
    );
};

export default Spinner;
