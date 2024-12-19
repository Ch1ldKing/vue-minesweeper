<template>
    <div class="settings-panel">
        <h2>自定义游戏设置</h2>
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
        <div class="button-group">
            <button class="save-button" @click="saveSettings" :disabled="!!errorMessage || !isValid">
                确定
            </button>
            <button class="cancel-button" @click="cancelSettings">
                取消
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
    initialSettings: {
        width: number;
        height: number;
        mineCount: number;
    };
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

const emit = defineEmits<{
    (e: 'save', settings: { width: number; height: number; mineCount: number }): void;
    (e: 'cancel'): void;
}>();

const saveSettings = () => {
    if (isValid.value) {
        emit('save', {
            width: cols.value,
            height: rows.value,
            mineCount: mines.value
        });
    }
};

const cancelSettings = () => {
    emit('cancel');
};
</script>

<style scoped>
.settings-panel {
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

.button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.save-button,
.cancel-button {
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.save-button {
    background-color: #4CAF50;
    color: white;
}

.save-button:hover:not(:disabled) {
    background-color: #45a049;
}

.save-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.cancel-button {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    color: #666;
}

.cancel-button:hover {
    background-color: #e8e8e8;
}
</style>