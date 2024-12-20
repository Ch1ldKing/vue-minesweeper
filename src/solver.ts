// solver.ts
import type { CellState } from './types';

interface CellInfo {
  x: number;
  y: number;
  unknownNeighbors: number;
  mineNeighbors: number;
  flaggedNeighbors: number;
}

export class MinesweeperSolver {
  private board: CellState[][];
  private width: number;
  private height: number;

  constructor(board: CellState[][], width: number, height: number) {
    this.board = board;
    this.width = width;
    this.height = height;
  }

  // 获取一个格子周围的所有未知格子
  private getUnknownNeighbors(x: number, y: number): {x: number, y: number}[] {
    const neighbors: {x: number, y: number}[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          if (!this.board[ny][nx].isRevealed && !this.board[ny][nx].isFlagged) {
            neighbors.push({x: nx, y: ny});
          }
        }
      }
    }
    return neighbors;
  }

  // 获取一个格子周围的已标记地雷数量
  private getFlaggedNeighborCount(x: number, y: number): number {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          if (this.board[ny][nx].isFlagged) {
            count++;
          }
        }
      }
    }
    return count;
  }

  // 分析每个已知格子
  private analyzeCells(): CellInfo[] {
    const cellsInfo: CellInfo[] = [];
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.board[y][x];
        if (cell.isRevealed && !cell.isMine && cell.neighborMines > 0) {
          const unknownNeighbors = this.getUnknownNeighbors(x, y);
          const flaggedNeighbors = this.getFlaggedNeighborCount(x, y);
          
          if (unknownNeighbors.length > 0) {
            cellsInfo.push({
              x,
              y,
              unknownNeighbors: unknownNeighbors.length,
              mineNeighbors: cell.neighborMines,
              flaggedNeighbors
            });
          }
        }
      }
    }
    
    return cellsInfo;
  }

  // 寻找安全的格子
  public findSafeMoves(): {x: number, y: number}[] {
    const safeMoves: {x: number, y: number}[] = [];
    const cellsInfo = this.analyzeCells();

    // 策略1：如果周围的未知格子数量等于地雷总数减去已标记数量，则其他未知格子都是安全的
    for (const cellInfo of cellsInfo) {
      const remainingMines = cellInfo.mineNeighbors - cellInfo.flaggedNeighbors;
      if (remainingMines === 0 && cellInfo.unknownNeighbors > 0) {
        const safeNeighbors = this.getUnknownNeighbors(cellInfo.x, cellInfo.y);
        safeMoves.push(...safeNeighbors);
      }
    }

    // 如果没有找到确定安全的格子，使用概率策略
    if (safeMoves.length === 0) {
      const probableMove = this.findProbableSafeMove();
      if (probableMove) {
        safeMoves.push(probableMove);
      }
    }

    // 删除重复的移动
    return Array.from(new Set(safeMoves.map(m => `${m.x},${m.y}`)))
      .map(coord => {
        const [x, y] = coord.split(',').map(Number);
        return {x, y};
      });
  }

  // 寻找最可能安全的格子
  private findProbableSafeMove(): {x: number, y: number} | null {
    const cellsInfo = this.analyzeCells();
    let bestProbability = 1;
    let bestMove = null;

    for (const cellInfo of cellsInfo) {
      const unknownNeighbors = this.getUnknownNeighbors(cellInfo.x, cellInfo.y);
      const remainingMines = cellInfo.mineNeighbors - cellInfo.flaggedNeighbors;
      const probability = remainingMines / unknownNeighbors.length;

      if (probability < bestProbability) {
        bestProbability = probability;
        bestMove = unknownNeighbors[0]; // 选择第一个未知邻居
      }
    }

    // 如果没有找到任何可能的移动，随机选择一个未探索的格子
    if (!bestMove) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          if (!this.board[y][x].isRevealed && !this.board[y][x].isFlagged) {
            return {x, y};
          }
        }
      }
    }

    return bestMove;
  }
}