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

<style scoped src="../assets/styles/FolderCreatePopup.css"></style>