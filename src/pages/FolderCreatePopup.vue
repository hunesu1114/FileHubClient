<template>
    <div class="popup-overlay" @click.self="closePopup">
        <div class="popup-container">
            <!-- 헤더 -->
            <div class="popup-header">
                <div class="header-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="header-text">
                    <h2>새 폴더 만들기</h2>
                    <p>새로운 폴더의 이름을 입력하세요</p>
                </div>
                <button class="close-button" @click="closePopup">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>

            <!-- 내용 -->
            <div class="popup-content">
                <div class="form-group">
                    <label for="folderName">폴더 이름</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <input id="folderName" v-model="folderName" type="text" placeholder="새 폴더" autofocus
                            @keyup.enter="createFolder" @keyup.esc="closePopup" />
                    </div>
                    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                </div>

                <!-- 경로 표시 -->
                <div class="current-path">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span>현재 위치: {{ currentPath }}</span>
                </div>
            </div>

            <!-- 액션 버튼 -->
            <div class="popup-actions">
                <button class="cancel-button" @click="closePopup">
                    취소
                </button>
                <button class="create-button" @click="createFolder" :disabled="!folderName.trim()">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                        <line x1="9" y1="14" x2="15" y2="14" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                    </svg>
                    <span>폴더 만들기</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
    close: []
    create: [folderName: string]
}>()

const folderName = ref('')
const currentPath = ref('/ 내 드라이브')
const errorMessage = ref('')

const closePopup = () => {
    emit('close')
}

const createFolder = () => {
    if (!folderName.value.trim()) {
        errorMessage.value = '폴더 이름을 입력하세요'
        return
    }

    // 폴더 이름 유효성 검사
    const invalidChars = /[<>:"/\\|?*]/g
    if (invalidChars.test(folderName.value)) {
        errorMessage.value = '폴더 이름에 사용할 수 없는 문자가 포함되어 있습니다'
        return
    }

    emit('create', folderName.value.trim())
    closePopup()
}
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.popup-container {
    width: 100%;
    max-width: 480px;
    background: var(--bg-secondary);
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    border: 2px solid var(--border-color);
    animation: slideUp 0.3s ease;
    overflow: hidden;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* 헤더 */
.popup-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    border-bottom: 2px solid var(--border-color);
    background: var(--bg-tertiary);
}

.header-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-primary);
    border-radius: 12px;
    color: white;
    flex-shrink: 0;
}

.header-icon svg {
    width: 24px;
    height: 24px;
}

.header-text {
    flex: 1;
}

.header-text h2 {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.header-text p {
    font-size: 13px;
    color: var(--text-tertiary);
}

.close-button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border-radius: 8px;
    color: var(--text-tertiary);
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.close-button svg {
    width: 20px;
    height: 20px;
}

.close-button:hover {
    background: var(--bg-primary);
    color: var(--accent-danger);
}

/* 내용 */
.popup-content {
    padding: 24px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 8px;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 14px;
    width: 20px;
    height: 20px;
    color: var(--text-tertiary);
    pointer-events: none;
}

.input-wrapper input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    font-size: 15px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: all 0.2s ease;
}

.input-wrapper input:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 4px rgba(76, 110, 245, 0.1);
}

.error-message {
    margin-top: 8px;
    font-size: 13px;
    color: var(--accent-danger);
    display: flex;
    align-items: center;
    gap: 6px;
}

.current-path {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: var(--bg-tertiary);
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.current-path svg {
    width: 18px;
    height: 18px;
    color: var(--accent-primary);
    flex-shrink: 0;
}

.current-path span {
    font-size: 13px;
    color: var(--text-secondary);
}

/* 액션 버튼 */
.popup-actions {
    display: flex;
    gap: 12px;
    padding: 20px 24px;
    background: var(--bg-tertiary);
    border-top: 2px solid var(--border-color);
}

.cancel-button {
    flex: 1;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    background: transparent;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    transition: all 0.2s ease;
}

.cancel-button:hover {
    background: var(--bg-primary);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
}

.create-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    background: var(--accent-primary);
    border: 2px solid var(--accent-primary);
    border-radius: 8px;
    transition: all 0.2s ease;
}

.create-button svg {
    width: 18px;
    height: 18px;
}

.create-button:hover:not(:disabled) {
    background: #ffffff;
    color: var(--accent-primary);
}

.create-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 480px) {
    .popup-container {
        max-width: 100%;
    }

    .popup-header {
        padding: 20px;
    }

    .header-text h2 {
        font-size: 18px;
    }

    .popup-content {
        padding: 20px;
    }

    .popup-actions {
        flex-direction: column;
        padding: 16px 20px;
    }
}
</style>
