import styles from "../styles/Keyboard.module.css"

const KEYS = Array.from({ length: 26 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i))

type KeyboardProps = {
  isGameOver?: boolean
  activeLetters: string[]
  inactiveLetters: string[]
  addGuessedLetter: (letter: string) => void
}

export function Keyboard({ activeLetters, inactiveLetters, addGuessedLetter, isGameOver = false }: KeyboardProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(75px, 1fr))", gap: ".5rem" }}>
      {KEYS.map(key => {
        const isActive = activeLetters.includes(key)
        const isInactive = inactiveLetters.includes(key)

        return (
          <button
            onClick={() => addGuessedLetter(key)}
            className={`
              ${styles.btn}
              ${isActive ? styles.active : ""}
              ${isInactive ? styles.inactive : ""}
            `}
            disabled={isInactive || isActive || isGameOver}
            key={key}
          >
            {key}
          </button>
        )
      })}
    </div>
  )
}

