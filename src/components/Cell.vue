<template>
  <button class="cell" :class="{
    revealed: modelValue.isRevealed,
    mine: modelValue.isRevealed && modelValue.isMine,
    flagged: modelValue.isFlagged,
    'mine-placing': placingMode && modelValue.isMine,
    'mine-reveal': modelValue.isRevealed && modelValue.isMine
  }" :data-number="modelValue.isRevealed && !modelValue.isMine ? modelValue.neighborMines : undefined"
    @click="$emit('reveal')" @contextmenu.prevent="$emit('flag')">
    <transition name="fade">
      <template v-if="modelValue.isRevealed && !modelValue.isMine">
        {{ modelValue.neighborMines || '' }}
      </template>
      <template v-else-if="(modelValue.isRevealed && modelValue.isMine) || (placingMode && modelValue.isMine)">
        💣
      </template>
      <template v-else-if="modelValue.isFlagged">
        🚩
      </template>
    </transition>
  </button>
</template>

<script setup lang="ts">
import type { CellState } from '../types';

defineProps<{
  modelValue: CellState;
  placingMode?: boolean;
}>();

defineEmits<{
  (e: 'reveal'): void;
  (e: 'flag'): void;
}>();

</script>

<style scoped>
.cell {
  width: 40px;
  height: 40px;
  border: 1px solid #999;
  background: #ccc;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  overflow: hidden;
}

.cell.revealed {
  background: #eee;
  transition: background-color 0.3s ease;
}

.cell.mine-placing {
  background: #ffeb3b;
  opacity: 0.8;
}

.cell.mine {
  background: #f00;
}

.cell:not(.revealed):hover {
  background: #ddd;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 数字显示动画 */
.cell.revealed:not(.mine) {
  color: transparent;
  animation: numberReveal 0.3s ease forwards;
}

@keyframes numberReveal {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
    opacity: 1;
    color: inherit !important;
  }
}

.cell[data-number="1"] {
  color: #0000FF !important;
  /* 蓝色 */
}

.cell[data-number="2"] {
  color: #008000 !important;
  /* 绿色 */
}

.cell[data-number="3"] {
  color: #FF0000 !important;
  /* 红色 */
}

.cell[data-number="4"] {
  color: #000080 !important;
  /* 深蓝色 */
}

.cell[data-number="5"] {
  color: #800000 !important;
  /* 深红色 */
}

.cell[data-number="6"] {
  color: #008080 !important;
  /* 青色 */
}

.cell[data-number="7"] {
  color: #000000 !important;
  /* 黑色 */
}

.cell[data-number="8"] {
  color: #808080 !important;
  /* 灰色 */
}


</style>
