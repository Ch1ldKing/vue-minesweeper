<template>
  <div class="game-container">
    <div class="game-info">
      <button @click="resetGame">重新开始</button>
      <button @click="handlePlacingMode" :disabled="gameOver || gameWon">
        {{ isPlacingMode ? '完成布置' : '布置地雷' }}
      </button>
      <button v-if="!isPlacingMode" @click="isAutoPlaying ? stopAutoPlay() : autoPlay()"
        :disabled="gameOver || gameWon">
        {{ isAutoPlaying ? '停止自动挖雷' : '自动挖雷' }}
      </button>
      <span>{{ isPlacingMode ? `已放置地雷: ${currentMineCount}` : `剩余地雷: ${remainingMines}` }}</span>
      <span v-if="gameOver">游戏结束!</span>
      <span v-if="gameWon">胜利!</span>
    </div>

    <div class="board" :style="{ gridTemplateColumns: `repeat(${width}, 40px)` }">
      <template v-for="(row, y) in board" :key="y">
        <Cell v-for="(cell, x) in row" :key="`${x}-${y}`" v-model="board[y][x]" :placing-mode="isPlacingMode"
          @reveal="handleCellClick(x, y)" @flag="toggleFlag(x, y)" />
      </template>
    </div>
    <!-- 游戏结束遮罩 -->
    <div v-if="showGameOverOverlay" class="game-over-overlay">
      <div class="game-over-text">游戏结束!</div>
    </div>

    <!-- 游戏胜利遮罩 -->
    <div v-if="showWinOverlay" class="game-win-overlay">
      <div class="game-win-text">胜利!</div>
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
  gap: 20px;
}

.game-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.board {
  display: grid;
  gap: 1px;
  background: #999;
  padding: 1px;
  position: relative;
  /* 新增 */
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