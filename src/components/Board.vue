<template>
  <div class="game-container">
    <div class="game-info">

      <button @click="handlePlacingMode" :disabled="gameOver || gameWon">
        {{ isPlacingMode ? '完成布置' : '布置地雷' }}
      </button>
      <!-- 剩余雷数显示为按钮 -->
      <button class="status-button" @click="resetGame" :class="{ 'win': gameWon, 'lose': gameOver }">
        <span v-if="gameWon">😄</span>
        <span v-else-if="gameOver">😢</span>
        <span v-else>{{ isPlacingMode ? `已放置地雷: ${currentMineCount}` : `💣 x ${remainingMines}` }}</span>
      </button>
      <button v-if="!isPlacingMode" @click="isAutoPlaying ? stopAutoPlay() : autoPlay()"
        :disabled="gameOver || gameWon">
        {{ isAutoPlaying ? '停止自动挖雷' : '自动挖雷' }}
      </button>

    </div>

    <div class="board" :style="{ gridTemplateColumns: `repeat(${width}, 40px)` }">
      <template v-for="(row, y) in board" :key="y">
        <Cell v-for="(cell, x) in row" :key="`${x}-${y}`" v-model="board[y][x]" :placing-mode="isPlacingMode"
          @reveal="handleCellClick(x, y)" @flag="toggleFlag(x, y)" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import Cell from './Cell.vue';
import { useGame } from '../stores/useGame';

const props = defineProps<{
  width: number;
  height: number;
  mineCount: number;
}>();

const emit = defineEmits<{
  (e: 'gameOver'): void;
  (e: 'gameWon'): void;
  (e: 'stateChange', state: { currentMineCount: number; isPlacingMode: boolean }): void;
}>();

const handleCellClick = (x: number, y: number) => {
  if (isPlacingMode.value) {
    toggleMine(x, y);
  } else {
    revealCell(x, y);
  }
};

const handlePlacingMode = () => {
  if (isPlacingMode.value) {
    const placedMines = finishPlacing();
    if (placedMines === 0) {
      alert('请至少放置一个地雷！');
    }
  } else {
    togglePlacingMode();
  }
};


const {
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
  isPlacingMode,
  togglePlacingMode,
  toggleMine,
  finishPlacing,
  currentMineCount
} = useGame(props.width, props.height, props.mineCount);

// 遮罩显示状态
const showGameOverOverlay = ref(false);
const showWinOverlay = ref(false);
let overlayTimer: number | null = null;

// 监听游戏状态变化
watch(gameOver, (newValue) => {
  if (newValue) {
    showGameOverOverlay.value = true;
    if (overlayTimer) clearTimeout(overlayTimer);
    overlayTimer = window.setTimeout(() => {
      showGameOverOverlay.value = false;
    }, 2000);
  }
});

watch([currentMineCount, isPlacingMode], ([count, placing]) => {
  emit('stateChange', {
    currentMineCount: count,
    isPlacingMode: placing
  });
});

// 组件卸载时停止自动挖雷
onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, #f5f5f7, #eaeaea);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.status-button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #007aff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease;
}

.status-button:hover {
  background: #005bb5;

}

/* 胜利状态样式 */
.status-button.win {
  background: #4cd964;
  color: white;
}

/* 失败状态样式 */
.status-button.lose {
  background: #ff3b30;
  color: white;
}
.game-info button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #007aff;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.game-info button:hover {
  background: #005bb5;
}

.board {
  display: grid;
  gap: 2px;
  background: #d1d1d6;
  border-radius: 12px;
  padding: 10px;
  position: relative;
}

.game-over-overlay,
.game-win-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  animation: fadeIn 0.5s ease-in;
  backdrop-filter: blur(3px);
}

.game-over-overlay {
  background-color: rgba(255, 0, 0, 0.3);
}

.game-win-overlay {
  background-color: rgba(0, 255, 0, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>