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
        {{ modelValue.neighborMines || "" }}
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
  border-radius: 8px;
  background: #f5f5f7;
  border: 1px solid #c7c7cc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cell.revealed {
  background: #e5e5ea;
  border-color: #d1d1d6;
  box-shadow: none;
}

.cell.mine-placing {
  background: rgba(255, 235, 59, 0.8);
  /* 黄色，用于布雷模式 */
}

.cell.mine {
  background: #ff3b30;
  /* 红色，用于显示地雷 */
  color: white;
}

.cell.flagged {
  color: #ff9500;
  /* 橙色，用于显示旗帜 */
}

.cell:not(.revealed):hover {
  background: #e0e0e6;
}

/* 数字颜色 */
.cell[data-number="1"] {
  color: #0000ff;
}

.cell[data-number="2"] {
  color: #008000;
}

.cell[data-number="3"] {
  color: #ff0000;
}

.cell[data-number="4"] {
  color: #000080;
}

.cell[data-number="5"] {
  color: #800000;
}

.cell[data-number="6"] {
  color: #008080;
}

.cell[data-number="7"] {
  color: #000000;
}

.cell[data-number="8"] {
  color: #808080;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 数字揭示动效 */
.cell.revealed:not(.mine) {
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
  }
}
</style>
