import type { CellState } from '@/types';
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
        board[y][x].neighborMines = count;
      }
    }
  }

  return board;
};
