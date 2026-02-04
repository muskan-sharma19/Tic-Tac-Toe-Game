import React from 'react';
import { useState } from "react";
import "./styles.css";
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function checkWinner(board) {
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : "Draw";
}

function getBestMove(board) {
  let bestScore = -Infinity;
  let move;

  board.forEach((cell, index) => {
    if (!cell) {
      board[index] = "O";
      const score = minimax(board, 0, false);
      board[index] = null;
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  return move;
}

function minimax(board, depth, isMaximizing) {
  const result = checkWinner(board);
  if (result === "O") return 10 - depth;
  if (result === "X") return depth - 10;
  if (result === "Draw") return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    board.forEach((cell, index) => {
      if (!cell) {
        board[index] = "O";
        bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
        board[index] = null;
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    board.forEach((cell, index) => {
      if (!cell) {
        board[index] = "X";
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
        board[index] = null;
      }
    });
    return bestScore;
  }
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    const result = checkWinner(newBoard);
    setBoard(newBoard);

    if (!result) {
      const aiMove = getBestMove(newBoard);
      if (aiMove !== undefined) newBoard[aiMove] = "O";
    }

    const finalResult = checkWinner(newBoard);
    setWinner(finalResult);
    setBoard([...newBoard]);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
  };

  return (
    <div className="game-container">
  <h1 className="game-title">Tic Tac Toe (You: X, AI: O)</h1>

  <div className="board">
    {board.map((cell, i) => (
      <button
        key={i}
        className="cell"
        onClick={() => handleClick(i)}
        disabled={cell || winner}
      >
        {cell}
      </button>
    ))}
  </div>

  {winner && <p className="result">{winner === "Draw" ? "It's a draw!" : `${winner} wins!`}</p>}

  <button className="restart-btn" onClick={resetGame}>
    Restart
  </button>
</div>

   
  );
}



