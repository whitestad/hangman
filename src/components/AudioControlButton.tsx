import React, { useState, useEffect } from 'react';
import playIcon from '@assets/play.png';
import pauseIcon from '@assets/pause.png'
import styles from '@styles/AudioControlButton.module.css';

const music = new Audio("../assets/music.m4a");


const AudioControlButton: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        music.loop = true;
        music.play().then(r => console.log(r)).catch(e => {
            setIsPlaying(false);
        });
    }, [music]);

    const togglePlayPause = () => {
        if (isPlaying) {
            music.pause();
        } else {
            music.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <button className={styles.button} onClick={togglePlayPause}>
            <img src={isPlaying ? pauseIcon : playIcon} alt="Play/Pause" className={styles.icon} />
        </button>
    );
};

export default AudioControlButton;
