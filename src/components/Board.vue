<template>
  <div class="game-container">
    <div class="game-info">
      <button @click="resetGame">重新开始</button>
      <button @click="isAutoPlaying ? stopAutoPlay() : autoPlay()" :disabled="gameOver || gameWon">
        {{ isAutoPlaying ? '停止自动挖雷' : '自动挖雷' }}
      </button>
      <span>剩余地雷: {{ remainingMines }}</span>
      <span v-if="gameOver">游戏结束!</span>
      <span v-if="gameWon">胜利!</span>
    </div>
    <div class="board" :style="{ gridTemplateColumns: `repeat(${width}, 40px)` }">
      <template v-for="(row, y) in board" :key="y">
        <Cell v-for="(cell, x) in row" :key="`${x}-${y}`" v-model="board[y][x]" @reveal="revealCell(x, y)"
          @flag="toggleFlag(x, y)" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
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
}>();

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
  stopAutoPlay
} = useGame(props.width, props.height, props.mineCount);

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
}
</style>