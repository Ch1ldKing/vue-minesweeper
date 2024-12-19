<template>
  <div class="game-container">
    <div class="game-info">
      <button @click="resetGame">New Game</button>
      <span>Mines: {{ remainingMines }}</span>
      <span v-if="gameOver">Game Over!</span>
      <span v-if="gameWon">You Won!</span>
    </div>
    <div class="board" :style="{ gridTemplateColumns: `repeat(${width}, 40px)` }">
      <template v-for="(row, y) in board" :key="y">
        <Cell
          v-for="(cell, x) in row"
          :key="`${x}-${y}`"
          v-model="board[y][x]"
          @reveal="revealCell(x, y)"
          @flag="toggleFlag(x, y)"
        />
      </template>
    </div>
  </div>
</template>


<script setup lang="ts">
import  Cell  from './Cell.vue';
import {useGame}  from '../stores/useGame';

const width = 10;
const height = 10;
const mineCount = 10;

const {
  board,
  gameOver,
  gameWon,
  remainingMines,
  revealCell,
  toggleFlag,
  resetGame
} = useGame(width, height, mineCount);
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