const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => board;

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    DisplayController.renderBoard();
  };

  const updateBoard = (index, marker) => {
    if (board[index] === '') {
      board[index] = marker;
      return true;
    }
    return false;
  };

  return {
    getBoard,
    resetBoard,
    updateBoard,
  };
})();

// Player Factory
const player = (name, marker) => {
  return { name, marker };
};

// Game Module
const game = (() => {
  const player1 = player('Player 1', 'X');
  const player2 = player('Player 2', 'O');
  let currentPlayer = player1;
  let isActive = true;  

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getCurrentPlayer = () => currentPlayer;

  const checkWin = () => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winPatterns.some(pattern => {
      const [a, b, c] = pattern;
      return (
        gameBoard.getBoard()[a] === currentPlayer.marker &&
        gameBoard.getBoard()[a] === gameBoard.getBoard()[b] &&
        gameBoard.getBoard()[a] === gameBoard.getBoard()[c]
      );
    });
  };

  const checkTie = () => gameBoard.getBoard().every(cell => cell !== '');

  const playRound = index => {
    if (!isActive) return;  

    if (gameBoard.updateBoard(index, currentPlayer.marker)) {
      const finalTitle = document.querySelector('#finalResult');
      if (checkWin()) {
        finalTitle.textContent = `${currentPlayer.name} Wins!`;
        finalTitle.style.color = 'green';
        isActive = false;  
      } else if (checkTie()) {
        finalTitle.textContent = "It's a tie!";
        finalTitle.style.color = 'blue';
        isActive = false;  
      } else {
        switchPlayer();
      }
    } else {
      const finalTitle = document.querySelector('#finalResult');
      finalTitle.textContent = 'Cell already occupied!';
    }
  };

  const resetGame = () => {
    isActive = true;  
    gameBoard.resetBoard();
    document.querySelector('#finalResult').textContent = '';  
  };

  return {
    playRound,
    getCurrentPlayer,
    resetGame, 
  };
})();

// DOM Manipulation Module
const DisplayController = (() => {
  const cells = document.querySelectorAll('.cell');

  const renderBoard = () => {
    const board = gameBoard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  // Set up event listeners once
  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      game.playRound(index);
      renderBoard();
    });
  });

  // Reset button logic
  const resetBtn = document.querySelector("#resetBtn");
  resetBtn.addEventListener('click', () => {
    game.resetGame();
    renderBoard();
  });

  renderBoard();  

  return {
    renderBoard,  
  };
})();
