<template>
  <div class="app">
    <h1>Vue Minesweeper</h1>

    <!-- 主要内容区域：响应式布局 -->
    <div class="content-wrapper">
      <!-- 游戏区域 -->
      <div class="game-area">
        <Board :key="gameKey" :width="settings.width" :height="settings.height" :mine-count="settings.mineCount"
          @game-over="handleGameOver" @game-won="handleGameWon" />
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="controls">
          <button class="control-button" @click="showSettings = true">
            自定义游戏
          </button>
          <button class="control-button" @click="resetGame">
            重新开始
          </button>
        </div>
        <div class="game-info">
          <p>当前难度：{{ settings.width }}×{{ settings.height }}</p>
          <p>地雷数量：{{ settings.mineCount }}</p>
        </div>
      </div>
    </div>

    <!-- 设置模态框 -->
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.content-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
}

.game-area {
  flex: 0 1 auto;
}

.control-panel {
  flex: 0 1 300px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  min-width: 200px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.control-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.control-button:hover {
  background: #45a049;
}

.game-info {
  color: #666;
  font-size: 14px;
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
  padding: 20px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .control-panel {
    width: 100%;
  }

  .controls {
    flex-direction: row;
    justify-content: center;
  }
}
</style>