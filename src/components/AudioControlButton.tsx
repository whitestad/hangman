import React, { useState, useEffect } from 'react';
import playIcon from '@assets/play.png';
import pauseIcon from '@assets/pause.png';
import styles from '@styles/AudioControlButton.module.css';

interface AudioControlButtonProps {
    audio: HTMLAudioElement;
}

const AudioControlButton: React.FC<AudioControlButtonProps> = ({ audio }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        audio.loop = true;
    }, [audio]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
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
