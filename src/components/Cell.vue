<template>
  <button class="cell" :class="{
    revealed: modelValue.isRevealed,
    mine: modelValue.isRevealed && modelValue.isMine,
    flagged: modelValue.isFlagged
  }" @click="$emit('reveal')" @contextmenu.prevent="$emit('flag')">
    <template v-if="modelValue.isRevealed && !modelValue.isMine">
      {{ modelValue.neighborMines || '' }}
    </template>
    <template v-else-if="modelValue.isRevealed && modelValue.isMine">
      💣
    </template>
    <template v-else-if="modelValue.isFlagged">
      🚩
    </template>
  </button>
</template>

<script setup lang="ts">
import type { CellState } from '../types';

defineProps<{
  modelValue: CellState;
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
}

.cell.revealed {
  background: #eee;
}

.cell.mine {
  background: #f00;
}

.cell:not(.revealed):hover {
  background: #ddd;
}
</style>
