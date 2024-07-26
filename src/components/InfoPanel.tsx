
interface InfoPanelProps {
    isWinner: boolean
    isLoser: boolean
    numGuessesRemaining: number
    score: number
    bestScore: number
}

export function InfoPanel({ isWinner, isLoser, numGuessesRemaining, score, bestScore }: InfoPanelProps) {
    return (
        <div className={'infoPanel'}>
            {isWinner && <div>You Win!</div>}
            {isLoser && <div>You Lose!</div>}
            <div>Best Score: {bestScore}</div>
            <div>Score: {score}</div>
        </div>
    )
}
