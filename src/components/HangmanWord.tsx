import styles from "../styles/HangmanWord.module.css"


type HangmanWordProps = {
  guessedLetters: string[]
  wordToGuess: string
  revealWord: boolean
}

export function HangmanWord({guessedLetters, wordToGuess, revealWord = false}: HangmanWordProps) {
  return (
    <div className={styles.container}
    >
      {wordToGuess.split("").map((letter, index) => (
          letter != ' ' ?
              <span className={styles.box} key={index}>
              <span
                  className={styles.letter}
                  style={{
                      visibility: guessedLetters.includes(letter) || revealWord
                          ? "visible"
                          : "hidden",
                      color: (!guessedLetters.includes(letter) && revealWord) ? "var(--error-color)" : "var(--color-1)"
                  }}
              >
                {letter}
              </span>
            </span >
              :
              <span className={styles.spaceLetter} key={index}> </span>
      ))}
    </div>
  )
}
