// solver.ts
import type { CellState } from './types';

interface CellInfo {
  x: number;
  y: number;
  cell: CellState;
  unknownNeighbors: Array<{x: number, y: number}>;
  flaggedNeighbors: number;
  value: number;
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

  private getNeighborInfo(x: number, y: number): CellInfo {
    const cell = this.board[y][x];
    const unknownNeighbors: Array<{x: number, y: number}> = [];
    let flaggedNeighbors = 0;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          const neighbor = this.board[ny][nx];
          if (neighbor.isFlagged) {
            flaggedNeighbors++;
          } else if (!neighbor.isRevealed) {
            unknownNeighbors.push({x: nx, y: ny});
          }
        }
      }
    }

    return {
      x,
      y,
      cell,
      unknownNeighbors,
      flaggedNeighbors,
      value: cell.neighborMines
    };
  }

  private getAllNumberedCells(): CellInfo[] {
    const numberedCells: CellInfo[] = [];
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.board[y][x];
        if (cell.isRevealed && !cell.isMine && cell.neighborMines > 0) {
          numberedCells.push(this.getNeighborInfo(x, y));
        }
      }
    }

    return numberedCells;
  }

  // 找出确定是地雷的格子
  private findDefiniteMines(): Array<{x: number, y: number}> {
    const mines = new Set<string>();
    const numberedCells = this.getAllNumberedCells();

    for (const info of numberedCells) {
      const remainingMines = info.value - info.flaggedNeighbors;
      if (remainingMines > 0 && remainingMines === info.unknownNeighbors.length) {
        info.unknownNeighbors.forEach(pos => {
          if (!this.board[pos.y][pos.x].isFlagged) {
            mines.add(`${pos.x},${pos.y}`);
          }
        });
      }
    }

    return Array.from(mines).map(pos => {
      const [x, y] = pos.split(',').map(Number);
      return {x, y};
    });
  }

  // 找出确定安全的格子
  private findDefiniteSafeCells(): Array<{x: number, y: number}> {
    const safeCells = new Set<string>();
    const numberedCells = this.getAllNumberedCells();

    for (const info of numberedCells) {
      if (info.value === info.flaggedNeighbors && info.unknownNeighbors.length > 0) {
        info.unknownNeighbors.forEach(pos => {
          if (!this.board[pos.y][pos.x].isRevealed && !this.board[pos.y][pos.x].isFlagged) {
            safeCells.add(`${pos.x},${pos.y}`);
          }
        });
      }
    }

    return Array.from(safeCells).map(pos => {
      const [x, y] = pos.split(',').map(Number);
      return {x, y};
    });
  }

  // 计算每个未知格子的地雷概率
  private calculateProbabilities(): Map<string, number> {
    const probabilities = new Map<string, number>();
    const counts = new Map<string, number>();
    const numberedCells = this.getAllNumberedCells();

    for (const info of numberedCells) {
      const remainingMines = info.value - info.flaggedNeighbors;
      if (remainingMines <= 0 || info.unknownNeighbors.length === 0) continue;

      const probability = remainingMines / info.unknownNeighbors.length;
      
      for (const neighbor of info.unknownNeighbors) {
        const key = `${neighbor.x},${neighbor.y}`;
        const currentSum = probabilities.get(key) ?? 0;
        const currentCount = counts.get(key) ?? 0;
        
        probabilities.set(key, currentSum + probability);
        counts.set(key, currentCount + 1);
      }
    }

    // 计算平均概率
    const avgProbabilities = new Map<string, number>();
    probabilities.forEach((sum, key) => {
      const count = counts.get(key) ?? 1;
      avgProbabilities.set(key, sum / count);
    });

    return avgProbabilities;
  }

  // 检查是否还有待处理的确定性推理
  private hasDefiniteMoves(): boolean {
    // 检查是否有确定的地雷
    const definiteMineCells = this.findDefiniteMines();
    if (definiteMineCells.length > 0) return true;

    // 检查是否有确定安全的格子
    const definiteSafeCells = this.findDefiniteSafeCells();
    if (definiteSafeCells.length > 0) return true;

    return false;
  }

  // 获取下一步操作
  public getNextMove(): { type: 'flag' | 'reveal' | 'wait', positions: Array<{x: number, y: number}> } {
    let moveFound = false;
    let lastDefiniteMoves = new Set<string>();

    // 持续进行确定性推理，直到无法得出新的确定结论
    do {
      moveFound = false;
      
      // 1. 找出确定是地雷的格子进行标记
      const definiteMineCells = this.findDefiniteMines();
      if (definiteMineCells.length > 0) {
        // 检查是否有新的确定性推理结果
        const currentMoves = new Set(definiteMineCells.map(pos => `${pos.x},${pos.y}`));
        if (!this.areSetsEqual(currentMoves, lastDefiniteMoves)) {
          return {
            type: 'flag',
            positions: definiteMineCells
          };
        }
      }

      // 2. 找出确定安全的格子进行点击
      const definiteSafeCells = this.findDefiniteSafeCells();
      if (definiteSafeCells.length > 0) {
        return {
          type: 'reveal',
          positions: definiteSafeCells
        };
      }

      // 记录当前的确定性推理结果
      lastDefiniteMoves = new Set(definiteMineCells.map(pos => `${pos.x},${pos.y}`));
      
      // 如果还有未处理的确定性推理，继续循环
      if (this.hasDefiniteMoves()) {
        moveFound = true;
        // 等待一下，让之前的操作生效
        return {
          type: 'wait',
          positions: []
        };
      }
    } while (moveFound);

    // 3. 只有在确定性推理完全穷尽后，才使用概率分析
    const probabilities = this.calculateProbabilities();
    if (probabilities.size > 0) {
      let minProb = 1;
      let bestPositions: Array<{x: number, y: number}> = [];

      probabilities.forEach((prob, key) => {
        const [x, y] = key.split(',').map(Number);
        if (prob < minProb) {
          minProb = prob;
          bestPositions = [{x, y}];
        } else if (prob === minProb) {
          bestPositions.push({x, y});
        }
      });

      return {
        type: 'reveal',
        positions: bestPositions
      };
    }

    // 4. 如果没有任何信息，随机选择一个未打开且未标记的格子
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!this.board[y][x].isRevealed && !this.board[y][x].isFlagged) {
          return {
            type: 'reveal',
            positions: [{x, y}]
          };
        }
      }
    }

    return { type: 'reveal', positions: [] };
  }

  private areSetsEqual(a: Set<string>, b: Set<string>): boolean {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  }
}