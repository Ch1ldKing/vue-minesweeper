// useGame.ts
import { ref, computed } from 'vue';
import type { CellState } from '../types';
import { generateBoard, handleFirstClick, calculateNeighborMines } from '../utils';
import { MinesweeperSolver } from '../solver';

export const useGame = (width: number, height: number, mineCount: number) => {
  const board = ref<CellState[][]>(generateBoard(width, height, mineCount));
  const gameOver = ref(false);
  const gameWon = ref(false);
  const isFirstClick = ref(true);
  const isAutoPlaying = ref(false);
  const isPlacingMode = ref(false);
  const currentMineCount = ref(mineCount);  

  const remainingMines = computed(() => {
    let flagged = 0;
    board.value.forEach(row => {
      row.forEach(cell => {
        if (cell.isFlagged) flagged++;
      });
    });
    return currentMineCount.value - flagged;
  });

  // 检查游戏是否胜利
  const checkWinCondition = () => {
    let allNonMinesRevealed = true;
    board.value.forEach(row => {
      row.forEach(cell => {
        if (!cell.isMine && !cell.isRevealed) {
          allNonMinesRevealed = false;
        }
      });
    });
    if (allNonMinesRevealed) {
      gameWon.value = true;
      isAutoPlaying.value = false;
    }
  };

  // 揭示单元格
  const revealCell = (x: number, y: number) => {
    if (gameOver.value || gameWon.value || board.value[y][x].isFlagged) {
      return;
    }

    // 处理第一次点击
    if (isFirstClick.value) {
      handleFirstClick(board.value, x, y, width, height);
      isFirstClick.value = false;
    }

    const cell = board.value[y][x];
    if (cell.isMine) {
      cell.isRevealed = true;
      gameOver.value = true;
      isAutoPlaying.value = false;
      return;
    }

    if (!cell.isRevealed) {
      cell.isRevealed = true;
      
      // 如果是空白格，递归展开周围的格子
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

  // 切换旗子
  const toggleFlag = (x: number, y: number) => {
    if (!gameOver.value && !gameWon.value && !board.value[y][x].isRevealed) {
      board.value[y][x].isFlagged = !board.value[y][x].isFlagged;
    }
  };

  // 重置游戏
  const resetGame = () => {
    isAutoPlaying.value = false;
    board.value = generateBoard(width, height, currentMineCount.value);
    gameOver.value = false;
    gameWon.value = false;
    isFirstClick.value = true;
  };

  // 自动玩游戏
  const autoPlay = async () => {
    if (gameOver.value || gameWon.value || isAutoPlaying.value) return;

    isAutoPlaying.value = true;
    const solver = new MinesweeperSolver(board.value, width, height);

    try {
      while (!gameOver.value && !gameWon.value && isAutoPlaying.value) {
        const move = solver.getNextMove();
        if (move.positions.length === 0 && move.type !== 'wait') {
          isAutoPlaying.value = false;
          break;
        }

        // 处理等待状态
        if (move.type === 'wait') {
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        // 根据移动类型执行相应操作
        for (const pos of move.positions) {
          if (!isAutoPlaying.value || gameOver.value || gameWon.value) break;
          
          if (move.type === 'flag') {
            toggleFlag(pos.x, pos.y);
          } else {
            revealCell(pos.x, pos.y);
          }
          
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Auto play error:', error);
    } finally {
      isAutoPlaying.value = false;
    }
  };

  // 停止自动玩游戏
  const stopAutoPlay = () => {
    isAutoPlaying.value = false;
  };

  // 切换布置模式
  const togglePlacingMode = () => {
    if (!gameOver.value && !gameWon.value) {
      isPlacingMode.value = !isPlacingMode.value;
      if (isPlacingMode.value) {
        // 重置游戏板为空，准备布置
        board.value = Array(height).fill(null).map(() =>
          Array(width).fill(null).map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0
          }))
        );
      }
    }
  };


  // 修改 toggleMine 函数，实时更新地雷数
  const toggleMine = (x: number, y: number) => {
    if (!isPlacingMode.value) return;
    
    const cell = board.value[y][x];
    cell.isMine = !cell.isMine;
    
    // 更新地雷数量
    let count = 0;
    board.value.forEach(row => {
      row.forEach(cell => {
        if (cell.isMine) count++;
      });
    });
    currentMineCount.value = count;
    
    // 更新周围格子的地雷数
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= 0 && ny < height && nx >= 0 && nx < width && !board.value[ny][nx].isMine) {
          board.value[ny][nx].neighborMines = calculateNeighborMines(board.value, nx, ny, width, height);
        }
      }
    }
  };


  // 完成布置
  const finishPlacing = () => {
    let placedMines = currentMineCount.value;
    board.value.forEach(row => {
      row.forEach(cell => {
        if (cell.isMine) placedMines++;
      });
    });
    
    if (placedMines > 0) {
      isPlacingMode.value = false;
      isFirstClick.value = false; // 跳过第一次点击保护
    }
    
    return placedMines;
  };
  return {
    board,
    gameOver,
    gameWon,
    remainingMines,
    revealCell,
    toggleFlag,
    resetGame,
    isAutoPlaying,
    autoPlay,
    stopAutoPlay,
    currentMineCount,
    isPlacingMode,
    togglePlacingMode,
    toggleMine,
    finishPlacing
  };
};