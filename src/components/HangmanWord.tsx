type HangmanWordProps = {
  guessedLetters: string[]
  wordToGuess: string
  revealWord: boolean
}

export function HangmanWord({guessedLetters, wordToGuess, revealWord = false}: HangmanWordProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: ".25em",
        fontSize: "6rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontFamily: "monospace"
      }}
    >
      {wordToGuess.split("").map((letter, index) => (
        <span style={{ borderBottom: ".1em solid var(--color-1)" }} key={index}>
          <span
            style={{
              visibility: guessedLetters.includes(letter) || revealWord
                ? "visible"
                : "hidden",
              color: (!guessedLetters.includes(letter) && revealWord) ? "var(--error-color)" : "var(--color-1)"
            }}
          >
            {letter}
          </span>
        </span>
      ))}
    </div>
  )
}
