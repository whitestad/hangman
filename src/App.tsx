import { useState, useEffect, useCallback } from "react";
import words from "./assets/wordList.json";
import { HangmanDrawing } from "./components/HangmanDrawing.tsx";
import { HangmanWord } from "./components/HangmanWord.tsx";
import { InfoPanel } from "./components/InfoPanel.tsx";
import { Keyboard } from "./components/Keyboard.tsx";
import { RestartGameButton } from "./components/RestartGameButton.tsx";
import NicknameModal from "./components/NicknameModal";
import Leaderboard from "./components/Leaderboard";
import { db } from "./firebaseConfig";
import { collection, query, getDocs, updateDoc, where, doc } from "firebase/firestore";

function getWordToGuess() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWordToGuess());
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [hasProcessedWin, setHasProcessedWin] = useState(false);
  const [user, setUser] = useState<string | null>(() => localStorage.getItem("nickname"));

  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter));
  const maxGuesses = 6;
  const isLoser = incorrectLetters.length >= maxGuesses;
  const isWinner = wordToGuess.replace(' ', '').split("").every(letter => guessedLetters.includes(letter));
  const numGuessesRemaining = maxGuesses - incorrectLetters.length;
  const isGameOver = isLoser || isWinner;

  /*const successAudio = new Audio("../assets/success.wav");
  const failAudio = new Audio("../assets/oof.wav");
  const winnerAudio = new Audio("../assets/win.wav");
  const loserAudio = new Audio("../assets/lose.wav");*/

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isWinner || isLoser) return;

    /*if (wordToGuess.includes(letter)) {
      successAudio.play();
    } else {
      failAudio.play();
    }*/

    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters, isWinner, isLoser, wordToGuess]);

  const resetGame = useCallback(() => {
    setGuessedLetters([]);
    setWordToGuess(getWordToGuess());
    setHasProcessedWin(false);
  }, []);

  const fetchBestScore = useCallback(async (nickname: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("nickname", "==", nickname));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      setBestScore(userDoc.data().score);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchBestScore(user);
    }
  }, [user, fetchBestScore]);

  useEffect(() => {
    if (isWinner && !hasProcessedWin) {
      // winnerAudio.play();

      const newScore = score + 1;
      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);

        if (user) {
          const updateUserScore = async () => {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("nickname", "==", user));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              await updateDoc(doc(db, "users", userDoc.id), { score: newScore });
            }
          };
          updateUserScore();
        }
      }

      setHasProcessedWin(true);
    } else if (isLoser) {
      // loserAudio.play();
      setScore(0);
    }
  }, [isWinner, isLoser, bestScore, hasProcessedWin, score, user]);

  // useEffect(() => {
  //   const handler = (e: KeyboardEvent) => {
  //     const key = e.key;
  //
  //     e.preventDefault();
  //
  //     if (key.match(/^[a-z]$/)) {
  //       addGuessedLetter(key);
  //     } else if (isGameOver && key == "Enter") {
  //       resetGame();
  //     }
  //   };
  //
  //   document.addEventListener("keypress", handler);
  //
  //   return () => {
  //     document.removeEventListener("keypress", handler);
  //   };
  // }, [guessedLetters, addGuessedLetter, isGameOver, resetGame]);

  if (!user) {
    return <NicknameModal setUser={setUser} />;
  }

  return (
      <>
        <InfoPanel
            isWinner={isWinner}
            isLoser={isLoser}
            numGuessesRemaining={numGuessesRemaining}
            score={score}
            bestScore={bestScore}
        />
        <div
            style={{
              maxWidth: "800px",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              margin: "0 auto",
              alignItems: "center",
            }}
        >

          <HangmanDrawing numBadGuesses={incorrectLetters.length}/>
          <HangmanWord
              revealWord={isLoser}
              guessedLetters={guessedLetters}
              wordToGuess={wordToGuess}
          />
          <div style={{alignSelf: "stretch", maxWidth: "min(100%, 92vw)"}} >
            <Keyboard
                isGameOver={isGameOver}
                activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))}
                inactiveLetters={incorrectLetters}
                addGuessedLetter={addGuessedLetter}
            />
          </div>
          <RestartGameButton isGameOver={isGameOver} isWinner={isWinner} resetGame={resetGame}/>
          <Leaderboard/>
        </div>
      </>
  );
}

export default App;
