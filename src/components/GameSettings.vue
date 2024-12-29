<template>
    <div class="settings-panel">
        <h2>游戏设置</h2>
        <div class="settings-form">
            <div class="form-group">
                <label>行数 (6-20):</label>
                <input type="number" v-model.number="rows" min="6" max="20" @input="validateAndUpdate" />
            </div>
            <div class="form-group">
                <label>列数 (6-20):</label>
                <input type="number" v-model.number="cols" min="6" max="20" @input="validateAndUpdate" />
            </div>
            <div class="form-group">
                <label>雷数 (最大 {{ maxMines }}):</label>
                <input type="number" v-model.number="mines" :min="1" :max="maxMines" @input="validateAndUpdate" />
            </div>
        </div>
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

        <!-- 游戏控制按钮 -->
        <div class="game-controls">
            <button class="control-button" @click="handleChangeSetting"
                :disabled="!!errorMessage || !isValid || isPlacingMode">
                应用设置
            </button>
        </div>


    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
    initialSettings: {
        width: number;
        height: number;
        mineCount: number;
    };
    gameOver: boolean;
    gameWon: boolean;
    isPlacingMode: boolean;
    isAutoPlaying: boolean;
    currentMineCount: number;
}>();

const emit = defineEmits<{
    (e: 'update', settings: { width: number; height: number; mineCount: number }): void;
    (e: 'reset'): void;
    (e: 'toggle-placing-mode'): void;
    (e: 'toggle-auto-play'): void;
}>();

const rows = ref(props.initialSettings.height);
const cols = ref(props.initialSettings.width);
const mines = ref(props.initialSettings.mineCount);
const errorMessage = ref('');

const maxMines = computed(() => rows.value * cols.value - 1);
const isValid = computed(() => {
    return rows.value >= 6 && rows.value <= 20 &&
        cols.value >= 6 && cols.value <= 20 &&
        mines.value >= 1 && mines.value <= maxMines.value;
});

// 监听 props 的变化并更新本地状态
watch(() => props.initialSettings, (newSettings) => {
    rows.value = newSettings.height;
    cols.value = newSettings.width;
    mines.value = newSettings.mineCount;
}, { immediate: true });

const validateAndUpdate = () => {
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

const handleChangeSetting = () => {
    if (isValid.value) {
        emit('update', {
            width: cols.value,
            height: rows.value,
            mineCount: mines.value
        });
    }
};

const resetSettings = () => {
    rows.value = props.initialSettings.height;
    cols.value = props.initialSettings.width;
    mines.value = props.initialSettings.mineCount;
    errorMessage.value = '';
};
</script>

<style scoped>
.settings-panel {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-width: 300px;
}

h2 {
    margin-bottom: 20px;
    color: #333;
    text-align: center;
}

.settings-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.form-group label {
    flex: 1;
    color: #666;
}

.form-group input {
    width: 80px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
}

.error-message {
    color: #ff4444;
    margin-bottom: 15px;
    font-size: 14px;
    text-align: center;
}

.game-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
}

.control-button {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    background: #007aff;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
}

.control-button:hover:not(:disabled) {
    background: #005bb5;
    transform: translateY(-1px);
}

.control-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
}

.game-status {
    margin-top: 20px;
    padding: 10px;
    background: #fff;
    border-radius: 8px;
    text-align: center;
}

.game-status p {
    margin: 0;
    color: #333;
    font-weight: bold;
}

.status-won {
    color: #4cd964;
}

.status-lost {
    color: #ff3b30;
}

.status-placing {
    color: #007aff;
}

.status-playing {
    color: #5856d6;
}

@media (max-width: 768px) {
    .settings-panel {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
    }
}
</style>
