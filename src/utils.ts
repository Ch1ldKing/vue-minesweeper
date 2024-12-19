import type { CellState } from '@/types';
// utils.ts
// 计算指定位置周围的地雷数
const calculateNeighborMines = (board: CellState[][], x: number, y: number, width: number, height: number): number => {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const ny = y + dy;
      const nx = x + dx;
      if (ny >= 0 && ny < height && nx >= 0 && nx < width && board[ny][nx].isMine) {
        count++;
      }
    }
  }
  return count;
};

// 更新指定位置及其周围格子的地雷数
const updateNeighborMines = (board: CellState[][], x: number, y: number, width: number, height: number): void => {
  // 更新3x3范围内所有格子的地雷数
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const ny = y + dy;
      const nx = x + dx;
      if (ny >= 0 && ny < height && nx >= 0 && nx < width && !board[ny][nx].isMine) {
        board[ny][nx].neighborMines = calculateNeighborMines(board, nx, ny, width, height);
      }
    }
  }
};

export const generateBoard = (width: number, height: number, mineCount: number): CellState[][] => {
  // 初始化空棋盘
  const board: CellState[][] = Array(height).fill(null).map(() =>
    Array(width).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0
    }))
  );

  // 随机放置地雷
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    if (!board[y][x].isMine) {
      board[y][x].isMine = true;
      minesPlaced++;
    }
  }

  // 计算每个格子周围的地雷数
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!board[y][x].isMine) {
        board[y][x].neighborMines = calculateNeighborMines(board, x, y, width, height);
      }
    }
  }

  return board;
};

// 处理第一次点击时的地雷移动
export const handleFirstClick = (board: CellState[][], clickX: number, clickY: number, width: number, height: number): void => {
  if (!board[clickY][clickX].isMine) {
    return; // 如果点击位置没有地雷，无需处理
  }

  // 找一个没有地雷的位置来放置被移动的地雷
  let newX, newY;
  do {
    newX = Math.floor(Math.random() * width);
    newY = Math.floor(Math.random() * height);
  } while (board[newY][newX].isMine || (newX === clickX && newY === clickY));

  // 移动地雷
  board[clickY][clickX].isMine = false;
  board[newY][newX].isMine = true;

  // 更新受影响区域的地雷数
  updateNeighborMines(board, clickX, clickY, width, height); // 更新原地雷位置周围
  updateNeighborMines(board, newX, newY, width, height);     // 更新新地雷位置周围
};