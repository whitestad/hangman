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
        fontSize: "3rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        // fontFamily: "monospace"
      }}
    >
      {wordToGuess.split("").map((letter, index) => (
          letter != ' ' ?
              <span style={{
                      borderBottom: "5px solid var(--color-1)",
                      borderRadius: '2px'
                  }} key={index}>
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
              :
              <span style={{width: '1.25rem'}}> </span>
      ))}
    </div>
  )
}
