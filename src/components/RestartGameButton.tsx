import styles from "../styles/ResetButton.module.css"

type RestartGameButtonProps = {
  isGameOver: boolean
  isWinner: boolean
  resetGame: () => void
}

export function RestartGameButton({ isGameOver, isWinner, resetGame }: RestartGameButtonProps) {
  if (!isGameOver) return

  return (
    <button
      onClick={resetGame}
      className={`
        ${styles.resetButton}
        ${isWinner ? styles.resetButtonWinner : styles.resetButtonLoser}
      `}
    >{isWinner ? "New Game" : "Try Again"}</button>
  )
}
