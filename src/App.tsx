import { useState, useEffect, useCallback } from "react";
import words from "./assets/wordList.json";
import { HangmanDrawing } from "./components/HangmanDrawing";
import { HangmanWord } from "./components/HangmanWord";
import { InfoPanel } from "./components/InfoPanel";
import { Keyboard } from "./components/Keyboard";
import { RestartGameButton } from "./components/RestartGameButton";
import NicknameModal from "./components/NicknameModal";
import Leaderboard from "./components/Leaderboard";
import { db } from "./firebaseConfig";
import { collection, query, getDocs, updateDoc, where, doc } from "firebase/firestore";

// Функция для выбора нового слова, исключая последние 10 угаданных слов
function getWordToGuess(excludeWords: string[]) {
  let newWord;
  do {
    newWord = words[Math.floor(Math.random() * words.length)];
  } while (excludeWords.includes(newWord));
  return newWord;
}

function App() {
  // Инициализация состояния с использованием localStorage
  const [last10Words, setLast10Words] = useState<string[]>(() => {
    const savedWords = localStorage.getItem("last10Words");
    return savedWords ? JSON.parse(savedWords) : [];
  });

  const [wordToGuess, setWordToGuess] = useState(() => getWordToGuess(last10Words));
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(-1);
  const [hasProcessedWin, setHasProcessedWin] = useState(false);
  const [user, setUser] = useState<string | null>(() => localStorage.getItem("nickname"));

  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter));
  const maxGuesses = 6;
  const isLoser = incorrectLetters.length >= maxGuesses;
  const isWinner = wordToGuess.replace(/ /g, '').split("").every(letter => guessedLetters.includes(letter));
  const numGuessesRemaining = maxGuesses - incorrectLetters.length;
  const isGameOver = isLoser || isWinner;

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isWinner || isLoser) return;

    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters, isWinner, isLoser, wordToGuess]);

  const resetGame = useCallback(() => {
    setGuessedLetters([]);
    const newWord = getWordToGuess(last10Words);
    setWordToGuess(newWord);
    setHasProcessedWin(false);
  }, [last10Words]);

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

      // Обновить историю последних 10 слов и сохранить в localStorage
      setLast10Words(prev => {
        const newLast10Words = [wordToGuess, ...prev].slice(0, 10);
        localStorage.setItem("last10Words", JSON.stringify(newLast10Words));
        return newLast10Words;
      });


    } else if (isLoser) {
      setScore(0);

      // Обновить историю последних 10 слов и сохранить в localStorage
      setLast10Words(prev => {
        const newLast10Words = [wordToGuess, ...prev].slice(0, 10);
        localStorage.setItem("last10Words", JSON.stringify(newLast10Words));
        return newLast10Words;
      });
    }
  }, [isWinner, isLoser, bestScore, hasProcessedWin, score, user, wordToGuess]);

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
          <HangmanDrawing numBadGuesses={incorrectLetters.length} />
          <HangmanWord
              revealWord={isLoser}
              guessedLetters={guessedLetters}
              wordToGuess={wordToGuess}
          />
          <div style={{ alignSelf: "stretch", maxWidth: "min(100%, 92vw)" }} >
            <Keyboard
                isGameOver={isGameOver}
                activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))}
                inactiveLetters={incorrectLetters}
                addGuessedLetter={addGuessedLetter}
            />
          </div>
          <RestartGameButton isGameOver={isGameOver} isWinner={isWinner} resetGame={resetGame} />
          <Leaderboard />
        </div>
      </>
  );
}

export default App;
