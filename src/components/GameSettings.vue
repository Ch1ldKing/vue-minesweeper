// src/components/GameSettings.vue
<template>
    <div class="settings-panel">
        <div class="settings-form">
            <div class="form-group">
                <label>行数 (6-20):
                    <input type="number" v-model.number="rows" min="6" max="20" @input="validateAndEmit" />
                </label>
            </div>
            <div class="form-group">
                <label>列数 (6-20):
                    <input type="number" v-model.number="cols" min="6" max="20" @input="validateAndEmit" />
                </label>
            </div>
            <div class="form-group">
                <label>雷数 (最大 {{ maxMines }}):
                    <input type="number" v-model.number="mines" :min="1" :max="maxMines" @input="validateAndEmit" />
                </label>
            </div>
        </div>
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
        <button class="start-button" @click="startGame" :disabled="!!errorMessage || !isValid">
            开始游戏
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const rows = ref(10);
const cols = ref(10);
const mines = ref(10);
const errorMessage = ref('');

const maxMines = computed(() => rows.value * cols.value - 1);
const isValid = computed(() => {
    return rows.value >= 6 && rows.value <= 20 &&
        cols.value >= 6 && cols.value <= 20 &&
        mines.value >= 1 && mines.value <= maxMines.value;
});

const validateAndEmit = () => {
    errorMessage.value = '';

    if (rows.value < 6 || rows.value > 20) {
        errorMessage.value = '行数必须在6到20之间';
        return;
    }
    if (cols.value < 6 || cols.value > 20) {
        errorMessage.value = '列数必须在6到20之间';
        return;
    }
    if (mines.value < 1) {
        errorMessage.value = '雷数必须大于0';
        return;
    }
    if (mines.value > maxMines.value) {
        errorMessage.value = `雷数不能超过${maxMines.value}`;
        mines.value = maxMines.value;
        return;
    }
};

const startGame = () => {
    if (isValid.value) {
        emit('start', {
            width: cols.value,
            height: rows.value,
            mineCount: mines.value
        });
    }
};

const emit = defineEmits<{
    (e: 'start', settings: { width: number; height: number; mineCount: number }): void;
}>();
</script>

<style scoped>
.settings-panel {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.settings-form {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 5px;
    color: #666;
}

.form-group input {
    width: 80px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.error-message {
    color: #ff4444;
    margin-bottom: 10px;
    font-size: 14px;
}

.start-button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.start-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.start-button:hover:not(:disabled) {
    background-color: #45a049;
}
</style>