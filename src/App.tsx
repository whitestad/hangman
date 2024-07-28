import { useState, useEffect, useCallback } from "react";
import wordList from "@assets/wordList.json";
import { HangmanDrawing } from "@components/HangmanDrawing";
import { HangmanWord } from "@components/HangmanWord";
import { InfoPanel } from "@components/InfoPanel";
import { Keyboard } from "@components/Keyboard";
import { RestartGameButton } from "@components/RestartGameButton";
import NicknameModal from "@components/NicknameModal";
import Leaderboard from '@components/Leaderboard';
import Spinner from "@components/Spinner";
import AudioControlButton from "@components/AudioControlButton";
import { db } from "@/firebaseConfig";
import { collection, query, getDocs, where, doc, updateDoc } from "firebase/firestore";

// Функция для выбора нового слова, исключая последние 10 угаданных слов
function getWordToGuess(excludeWords: string[]) {
  let newWord;
  do {
    newWord = wordList[Math.floor(Math.random() * wordList.length)];
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
  const [bestScore, setBestScore] = useState<number>(0);
  const [hasProcessedWin, setHasProcessedWin] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBestScore, setLoadingBestScore] = useState(true);

  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter));
  const maxGuesses = 6;
  const isLoser = incorrectLetters.length >= maxGuesses;
  const isWinner = wordToGuess.replace(/ /g, '').split("").every(letter => guessedLetters.includes(letter));
  const numGuessesRemaining = maxGuesses - incorrectLetters.length;
  const isGameOver = isLoser || isWinner;

  const successAudio = new Audio("../assets/success.wav");
  const failAudio = new Audio("../assets/oof.wav");
  const winnerAudio = new Audio("../assets/win.wav");
  const loserAudio = new Audio("../assets/lose.wav");

  const music = new Audio("../assets/music.mp3");

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isWinner || isLoser) return;

    if (wordToGuess.includes(letter)) {
      successAudio.play();
    } else {
      failAudio.play();
    }

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
    setLoadingBestScore(false);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("nickname");
    if (savedUser) {
      const checkUserExists = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("nickname", "==", savedUser));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setUser(savedUser);
          fetchBestScore(savedUser);
        } else {
          localStorage.removeItem("nickname");
          setUser(null);
          setLoadingBestScore(false);
        }
        setLoadingUser(false);
      };
      checkUserExists();
    } else {
      setLoadingUser(false);
      setLoadingBestScore(false);
    }
  }, [fetchBestScore]);

  useEffect(() => {
    if (isWinner && !hasProcessedWin) {
      winnerAudio.play();

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
      loserAudio.play();
      setScore(0);

      // Обновить историю последних 10 слов и сохранить в localStorage
      setLast10Words(prev => {
        const newLast10Words = [wordToGuess, ...prev].slice(0, 10);
        localStorage.setItem("last10Words", JSON.stringify(newLast10Words));
        return newLast10Words;
      });
    }
  }, [isWinner, isLoser, bestScore, hasProcessedWin, score, user, wordToGuess]);

  if (loadingUser || loadingBestScore) {
    return <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: '100vh',
    }}>
      <Spinner size={'100px'} />
    </div>
  }

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
          <AudioControlButton audio={music} />
        </div>
      </>
  );
}

export default App;
