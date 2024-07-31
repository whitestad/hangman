import style from './../styles/InfoPanel.module.css';
import ft1 from '../assets/img/ft1.png';
import ft2 from '../assets/img/ft2.png';
import ft3 from '../assets/img/ft3.png';
import ft4 from '../assets/img/ft4.png';
import ft5 from '../assets/img/ft5.png';
import Spinner from "./Spinner.tsx";
import AudioControlButton from './AudioControlButton.tsx';
import ContractComponent from "@components/ContractComponent.tsx";

interface InfoPanelProps {
    isWinner: boolean;
    isLoser: boolean;
    numGuessesRemaining: number;
    score: number;
    bestScore: number;
}

export function InfoPanel({ isWinner, isLoser, numGuessesRemaining, score, bestScore }: InfoPanelProps) {

    return (
        <div className={style.header}>
            <div className={style.infoPanel}>
                {isWinner && <div>You Win!</div>}
                {isLoser && <div>You Lose!</div>}
                <div className={style.recordsFlex}>
                    <span style={{ display: 'none' }}>{numGuessesRemaining}</span>
                    <div style={{display: 'flex', gap: '1rem'}}>Best Score: {bestScore === -1 ? <Spinner size={'20px'} /> : bestScore}</div>
                    <div style={{display: 'flex', gap: '1rem'}}>Score: {score}</div>
                </div>
            </div>

            <ContractComponent></ContractComponent>

            <div className={style.navs}>
                <a href={"https://t.me/hangmansolana"} className={style.nav}><img src={ft1} alt="ft1" /></a>
                <a href={"https://t.me/hangmansolana"} className={style.nav}><img src={ft2} alt="ft2" /></a>
                <a href={"https://t.me/hangmansolana"} className={style.nav}><img src={ft3} alt="ft3" /></a>
                <a href={"https://t.me/hangmansolana"} className={style.nav}><img src={ft4} alt="ft4" /></a>
                <a href={"https://t.me/hangmansolana"} className={style.nav}><img src={ft5} alt="ft5" /></a>

                <AudioControlButton />
            </div>
        </div>
    );
}
