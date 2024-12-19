import { ref, computed } from 'vue';
import { generateBoard } from '../utils';
import type { CellState } from '@/types';

export const useGame = (width: number, height: number, mineCount: number) => {
  const board = ref(generateBoard(width, height, mineCount));
  const gameOver = ref(false);
  const gameWon = ref(false);
  const isFirstClick = ref(true);

  const remainingMines = computed(() => {
    let flagged = 0;
    board.value.forEach(row => {
      row.forEach(cell => {
        if (cell.isFlagged) flagged++;
      });
    });
    return mineCount - flagged;
  });

  const revealCell = (x: number, y: number) => {
    if (gameOver.value || gameWon.value || board.value[y][x].isFlagged) {
      return;
    }

    // 如果是第一次点击，重新生成游戏板
    if (isFirstClick.value) {
      // 创建临时棋盘，直到成功找到一个有效的布局
      let newBoard: CellState[][];
      do {
        newBoard = generateBoard(width, height, mineCount);
      } while (newBoard[y][x].isMine || newBoard[y][x].neighborMines > 0);
      
      board.value = newBoard;
      isFirstClick.value = false;
    }

    const cell = board.value[y][x];
    if (cell.isMine) {
      cell.isRevealed = true;
      gameOver.value = true;
      return;
    }

    if (!cell.isRevealed) {
      cell.isRevealed = true;
      
      // 如果是空格子，递归展开周围的格子
      if (cell.neighborMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              revealCell(nx, ny);
            }
          }
        }
      }
    }

    checkWinCondition();
  };

  const toggleFlag = (x: number, y: number) => {
    if (!gameOver.value && !gameWon.value && !board.value[y][x].isRevealed) {
      board.value[y][x].isFlagged = !board.value[y][x].isFlagged;
    }
  };

  const checkWinCondition = () => {
    let allNonMinesRevealed = true;
    board.value.forEach(row => {
      row.forEach(cell => {
        if (!cell.isMine && !cell.isRevealed) {
          allNonMinesRevealed = false;
        }
      });
    });
    gameWon.value = allNonMinesRevealed;
  };

  const resetGame = () => {
    board.value = generateBoard(width, height, mineCount);
    gameOver.value = false;
    gameWon.value = false;
    isFirstClick.value = true;
  };

  return {
    board,
    gameOver,
    gameWon,
    remainingMines,
    revealCell,
    toggleFlag,
    resetGame
  };
};