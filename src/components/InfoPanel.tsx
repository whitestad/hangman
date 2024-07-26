import style from './../styles/InfoPanel.module.css'

import ft1 from '../assets/img/ft1.png';
import ft2 from '../assets/img/ft2.png';
import ft3 from '../assets/img/ft3.png';
import ft4 from '../assets/img/ft4.png';
import ft5 from '../assets/img/ft5.png';

interface InfoPanelProps {
    isWinner: boolean
    isLoser: boolean
    numGuessesRemaining: number
    score: number
    bestScore: number
}

export function InfoPanel({ isWinner, isLoser, numGuessesRemaining, score, bestScore }: InfoPanelProps) {
    return (
        <div className={style.header}>
            <div className={style.infoPanel}>
                {isWinner && <div>You Win!</div>}
                {isLoser && <div>You Lose!</div>}
                <div className={style.recordsFlex}>
                    <span style={{display: 'none'}}>{numGuessesRemaining}</span>
                    <div>Best Score: {bestScore}</div>
                    <div>Score: {score}</div>
                </div>
            </div>

            <div className={style.navs}>
                <a href={"/"} className={style.nav}><img src={ft1}></img></a>
                <a href={"/"} className={style.nav}><img src={ft2}></img></a>
                <a href={"/"} className={style.nav}><img src={ft3}></img></a>
                <a href={"/"} className={style.nav}><img src={ft4}></img></a>
                <a href={"/"} className={style.nav}><img src={ft5}></img></a>
            </div>
        </div>
    )
}
