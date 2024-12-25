<template>
  <div class="app">
    <h1 class="title">Vue Minesweeper</h1>

    <div class="content-wrapper">

      <div class="game-area">
        <Board :key="gameKey" :width="settings.width" :height="settings.height" :mine-count="settings.mineCount"
          @game-over="handleGameOver" @game-won="handleGameWon" />
      </div>

      <div class="control-panel">
        <div class="game-info">
          <p>当前难度：{{ settings.width }}×{{ settings.height }}</p>
          <p>地雷数量：{{ settings.mineCount }}</p>
        </div>
        <div class="controls">
          <button class="control-button" @click="showSettings = true">
            自定义游戏
          </button>
          <button class="control-button" @click="resetGame">
            重新开始
          </button>
        </div>
      </div>
    </div>


    <div v-if="showSettings" class="modal-overlay" @click.self="showSettings = false">
      <div class="modal-content">
        <GameSettings :initial-settings="settings" @save="updateSettings" @cancel="showSettings = false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Board from './components/Board.vue';
import GameSettings from './components/GameSettings.vue';

interface GameSettings {
  width: number;
  height: number;
  mineCount: number;
}

const showSettings = ref(false);
const gameKey = ref(0);
const settings = ref<GameSettings>({
  width: 10,
  height: 10,
  mineCount: 10
});

const updateSettings = (newSettings: GameSettings) => {
  settings.value = newSettings;
  showSettings.value = false;
  gameKey.value++; // 强制重新创建游戏板
};

const resetGame = () => {
  gameKey.value++; // 重置游戏
};

const handleGameOver = () => {
  // 可以添加游戏结束的处理逻辑
};

const handleGameWon = () => {
  // 可以添加游戏胜利的处理逻辑
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

.control-panel {
  flex: 0 1 300px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 250px;
}

.game-info {
  margin-bottom: 20px;
}

.game-info p {
  margin: 10px 0;
  color: #4a5568;
  font-size: 1.1rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.control-button:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .control-panel {
    width: 100%;
    max-width: 400px;
  }

  .controls {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .control-button {
    flex: 1 1 auto;
    min-width: 150px;
  }
}

/* 大屏幕布局 */
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

  .control-panel {
    flex: 0 0 300px;
    align-self: flex-start;
    position: sticky;
    top: 20px;
  }
}
</style>