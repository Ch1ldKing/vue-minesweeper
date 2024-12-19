// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// 创建并挂载根实例
createApp(App).mount('#app')

// App.vue
<template>
  <div class="app">
    <h1>Vue Minesweeper</h1>
    <GameSettings v-if="!gameStarted" @start="startGame" />
    <Board v-else :key="gameKey" :width="settings.width" :height="settings.height" :mine-count="settings.mineCount"
      @game-over="endGame" @game-won="endGame" />
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

const gameStarted = ref(false);
const gameKey = ref(0);
const settings = ref<GameSettings>({
  width: 10,
  height: 10,
  mineCount: 10
});

const startGame = (newSettings: GameSettings) => {
  settings.value = newSettings;
  gameStarted.value = true;
};

const endGame = () => {
  // 延迟一下以便玩家看到游戏结果
  setTimeout(() => {
    gameStarted.value = false;
  }, 2000);
};
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f5f5f5;
}
</style>