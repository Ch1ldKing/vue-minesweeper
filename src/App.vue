# App.vue
<template>
  <div class="app">
    <h1 class="title">Vue Minesweeper</h1>

    <div class="content-wrapper">
      <div class="game-area">
        <Board :key="gameKey" :width="settings.width" :height="settings.height" :mine-count="settings.mineCount"
          :board="board" :game-over="gameState.gameOver" :game-won="gameState.gameWon"
          :is-placing-mode="gameState.isPlacingMode" :current-mine-count="gameState.currentMineCount"
          :remaining-mines="remainingMines" @reveal="revealCell" @flag="toggleFlag" @reset="resetGame" />
      </div>

      <div class="settings-area">
        <GameSettings :initial-settings="settings" :game-over="gameState.gameOver" :game-won="gameState.gameWon"
          :is-placing-mode="gameState.isPlacingMode" :is-auto-playing="gameState.isAutoPlaying"
          :current-mine-count="gameState.currentMineCount" @update="updateSettings" @reset="resetGame"
          @toggle-placing-mode="handleTogglePlacingMode" @toggle-auto-play="handleToggleAutoPlay" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Board from './components/Board.vue';
import GameSettings from './components/GameSettings.vue';
import {useGame} from './stores/useGame';

interface GameSettings {
  width: number;
  height: number;
  mineCount: number;
}

const gameKey = ref(0);
const settings = ref<GameSettings>({
  width: 10,
  height: 10,
  mineCount: 10
});

const gameState = ref({
  currentMineCount: 10,
  isPlacingMode: false,
  isAutoPlaying: false,
  gameOver: false,
  gameWon: false
});

// 初始化游戏逻辑
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
  currentMineCount,
  isPlacingMode,
  togglePlacingMode,
  toggleMine,
  finishPlacing
} = useGame(settings.value.width, settings.value.height, settings.value.mineCount);

// 监听游戏状态变化
watch(gameOver, (value) => {
  gameState.value.gameOver = value;
  if (value) {
    gameState.value.isAutoPlaying = false;
  }
});

watch(gameWon, (value) => {
  gameState.value.gameWon = value;
  if (value) {
    gameState.value.isAutoPlaying = false;
  }
});

watch([currentMineCount, isPlacingMode], ([count, placing]) => {
  gameState.value.currentMineCount = count;
  gameState.value.isPlacingMode = placing;
});

watch(isAutoPlaying, (value) => {
  gameState.value.isAutoPlaying = value;
});

const updateSettings = (newSettings: GameSettings) => {
  settings.value = newSettings;
  gameKey.value++; // 强制重新创建游戏板
};

const handleTogglePlacingMode = () => {
  if (gameState.value.isPlacingMode) {
    const placedMines = finishPlacing();
    if (placedMines === 0) {
      alert('请至少放置一个地雷！');
      return;
    }
  } else {
    togglePlacingMode();
  }
};

const handleToggleAutoPlay = () => {
  if (gameState.value.isAutoPlaying) {
    stopAutoPlay();
  } else {
    autoPlay();
  }
};
</script>


<style scoped>
.app {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2rem;
}

.content-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
  align-items: flex-start;
}

.game-area {
  flex: 0 1 auto;
  min-width: 300px;
}

.settings-area {
  flex: 0 1 300px;
  min-width: 250px;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .settings-area {
    width: 100%;
    max-width: 400px;
  }
}

@media (min-width: 1024px) {
  .content-wrapper {
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
  }

  .game-area {
    flex: 0 1 auto;
    margin-right: 40px;
  }

  .settings-area {
    flex: 0 0 300px;
    position: sticky;
    top: 20px;
  }
}
</style>