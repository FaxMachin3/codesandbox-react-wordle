import { useState, useEffect } from "react";
import "./styles.css";

const ROW = 6;
const COL = 5;
const EMPTY_CELLS = new Array(5 * 6).fill("");

const dict = [
  "ROUND",
  "HOCUS",
  "ARGUE",
  "SWILL",
  "BOUND",
  "TASTY",
  "PLANT",
  "STEEK",
  "TREAT",
  "PASTE",
  "WIDOW",
  "GRIND",
  "APRIL"
];

const dictSet = new Set(dict);

const generateMatrix = (data = null) => {
  const arr = new Array(ROW).fill("");

  arr.forEach((_, index) => {
    arr[index] = new Array(COL).fill(data);
  });

  return arr;
};

const Cell = ({ cellConfig }) => {
  return (
    <div className={`cell ${cellConfig.customClass}`}>{cellConfig.letter}</div>
  );
};

const Wordle = ({ actualWord }) => {
  const [matrix, setMatrix] = useState(generateMatrix({}));
  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrCol] = useState(0);
  const [guessedWord, setGuessedWord] = useState(null);
  const [guessedWords, setGuessedWords] = useState([]);
  const [guessed, setGuessed] = useState(false);

  useEffect(() => {
    const compareWords = () => {
      let countGuessedLetter = 0;
      for (let i = 0; i < COL; i++) {
        if (actualWord[i] === matrix[currRow - 1][i].letter) {
          matrix[currRow - 1][i].customClass = "green";
          countGuessedLetter += 1;
        } else if (actualWord.includes(matrix[currRow - 1][i].letter)) {
          matrix[currRow - 1][i].customClass = "yellow";
        }
      }

      if (countGuessedLetter === COL) setGuessed(true);
      setMatrix(() => matrix.map((row) => [...row]));
    };

    if (guessedWord) {
      if (!dictSet.has(guessedWord) || guessedWords.includes(guessedWord)) {
        setMatrix((prevMatrix) => {
          if (currRow > 0) {
            prevMatrix[currRow - 1] = prevMatrix[currRow].map(() => ({}));
          }
          return prevMatrix.map((row) => [...row]);
        });
        setCurrRow((prevRow) => prevRow - 1);
      } else {
        if (compareWords()) {
        }
        setGuessedWords((prevGuessedWords) => [
          ...prevGuessedWords,
          guessedWord
        ]);
      }
      setGuessedWord(null);
    }

    const isValidKey = (key) => key.length === 1 && key.match(/[a-z]/i);

    const onKeyDown = (e) => {
      if (
        !isValidKey(e.key) ||
        guessed ||
        guessedWord ||
        currRow >= ROW ||
        currCol >= COL
      )
        return;

      setMatrix((prevMatrix) => {
        const currCellConfig = { ...prevMatrix[currRow][currCol] };
        currCellConfig.letter = e.key.toUpperCase();
        currCellConfig.customClass = "grey";
        prevMatrix[currRow][currCol] = currCellConfig;
        if (currCol === COL - 1) {
          const guessedWord = prevMatrix[currRow].reduce(
            (str, obj) => str + obj.letter,
            ""
          );
          setGuessedWord(guessedWord);
        }
        return prevMatrix.map((row) => [...row]);
      });

      setCurrRow((prevRow) =>
        (currCol + 1) % COL === 0 ? prevRow + 1 : prevRow
      );

      setCurrCol((prevCol) => (prevCol + 1) % COL);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    guessedWord,
    guessedWords,
    guessed,
    actualWord,
    matrix,
    currRow,
    currCol
  ]);

  // const generateCells = () => {
  //   const arr = [];

  //   for (let i = 0; i < ROW; i++) {
  //     for (let j = 0; j < COL; j++) {
  //       arr.push(<Cell key={`${i}-${j}`} cellConfig={matrix[i][j]} />);
  //     }
  //   }

  //   return arr;
  // };

  const onResetButtonClick = () => {
    setMatrix(generateMatrix({}));
    setCurrRow(0);
    setCurrCol(0);
    setGuessedWord(null);
    setGuessedWords([]);
    setGuessed(false);
  };

  return (
    <div className="wordle-container">
      <div className="cell-container">
        {EMPTY_CELLS.map((_, index) => {
          const row = Math.floor(index / COL);
          const col = index % COL;
          return (
            <Cell key={`${row}-${col}`} cellConfig={matrix[row][col] ?? {}} />
          );
        })}
      </div>
      <div>
        <button
          className="reset-button"
          type="reset"
          onClick={onResetButtonClick}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return <Wordle actualWord="GRIND" />;
}
