<template>
    <div class="upload-popup-overlay" @click.self="closePopup">
        <div class="upload-popup">
            <!-- 헤더 -->
            <div class="popup-header">
                <h2 class="popup-title">파일 업로드</h2>
                <button class="close-button" @click="closePopup">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                    </svg>
                </button>
            </div>

            <!-- 업로드 영역 -->
            <div class="popup-content">
                <!-- 드래그 앤 드롭 영역 -->
                <div class="upload-zone" :class="{ 'drag-over': isDragging }" @dragover.prevent="handleDragOver"
                    @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop" @click="triggerFileInput">
                    <div class="upload-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" />
                        </svg>
                    </div>
                    <p class="upload-text">파일을 여기에 드래그하거나 클릭하세요</p>
                    <p class="upload-subtext">최대 {{ maxFileSize }}MB까지 업로드 가능</p>
                    <input ref="fileInput" type="file" class="file-input" multiple @change="handleFileSelect" />
                </div>

                <!-- 업로드할 파일 목록 -->
                <div v-if="selectedFiles.length > 0" class="file-list">
                    <div class="file-list-header">
                        <h3>선택된 파일 ({{ selectedFiles.length }})</h3>
                        <button class="clear-button" @click="clearFiles">모두 제거</button>
                    </div>

                    <div class="file-items">
                        <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
                            <div class="file-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>

                            <div class="file-item-info">
                                <p class="file-item-name">{{ file.name }}</p>
                                <p class="file-item-size">{{ formatFileSize(file.size) }}</p>
                            </div>

                            <div class="file-item-status">
                                <!-- 업로드 전 -->
                                <span v-if="file.status === 'pending'" class="status-badge pending">대기중</span>

                                <!-- 업로드 중 -->
                                <div v-else-if="file.status === 'uploading'" class="upload-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" :style="{ width: file.progress + '%' }"></div>
                                    </div>
                                    <span class="progress-text">{{ file.progress }}%</span>
                                </div>

                                <!-- 업로드 완료 -->
                                <span v-else-if="file.status === 'completed'" class="status-badge success">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    완료
                                </span>

                                <!-- 업로드 실패 -->
                                <span v-else-if="file.status === 'error'" class="status-badge error">실패</span>
                            </div>

                            <button class="remove-button" @click="removeFile(index)"
                                :disabled="file.status === 'uploading'">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 푸터 -->
            <div class="popup-footer">
                <button class="cancel-button" @click="closePopup">취소</button>
                <button class="upload-button" @click="startUpload"
                    :disabled="selectedFiles.length === 0 || isUploading">
                    {{ isUploading ? '업로드 중...' : '업로드 시작' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { getApiUrl, API_CONFIG } from '@/config/api'

interface UploadFile {
    name: string
    size: number
    file: File
    status: 'pending' | 'uploading' | 'completed' | 'error'
    progress: number
}

const emit = defineEmits<{
    close: []
    upload: [files: File[]]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<UploadFile[]>([])
const isDragging = ref(false)
const isUploading = ref(false)
const maxFileSize = 100 // MB

const closePopup = () => {
    emit('close')
}

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files) {
        addFiles(Array.from(target.files))
    }
}

const handleDragOver = (event: DragEvent) => {
    isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
    isDragging.value = false
}

const handleDrop = (event: DragEvent) => {
    isDragging.value = false
    const files = event.dataTransfer?.files
    if (files) {
        addFiles(Array.from(files))
    }
}

const addFiles = (files: File[]) => {
    const maxSize = maxFileSize * 1024 * 1024 // Convert to bytes

    files.forEach(file => {
        if (file.size > maxSize) {
            alert(`${file.name}은(는) ${maxFileSize}MB를 초과합니다.`)
            return
        }

        // 중복 체크
        const isDuplicate = selectedFiles.value.some(f => f.name === file.name && f.size === file.size)
        if (isDuplicate) {
            alert(`${file.name}은(는) 이미 추가되었습니다.`)
            return
        }

        selectedFiles.value.push({
            name: file.name,
            size: file.size,
            file: file,
            status: 'pending',
            progress: 0
        })
    })
}

const removeFile = (index: number) => {
    selectedFiles.value.splice(index, 1)
}

const clearFiles = () => {
    selectedFiles.value = []
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const startUpload = async () => {
    if (selectedFiles.value.length === 0 || isUploading.value) return

    isUploading.value = true

    // 각 파일 업로드
    for (const file of selectedFiles.value) {
        if (file.status !== 'pending') continue

        file.status = 'uploading'

        try {
            // 실제 API 호출 (개발 중에는 simulateUpload 사용 가능)
            await uploadFile(file)
            // await simulateUpload(file) // 시뮬레이션 사용 시
        } catch (error) {
            console.error('업로드 실패:', error)
            file.status = 'error'
        }
    }

    isUploading.value = false

    // 모든 파일 업로드 완료 후 이벤트 발생
    const uploadedFiles = selectedFiles.value
        .filter(f => f.status === 'completed')
        .map(f => f.file)

    if (uploadedFiles.length > 0) {
        emit('upload', uploadedFiles)
    }
}

// 실제 파일 업로드 API 호출 (axios 사용)
const uploadFile = async (file: UploadFile): Promise<void> => {
    try {
        const formData = new FormData()
        formData.append('file', file.file)

        const uploadUrl = getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD)

        // 인증 토큰이 있다면 추가 (필요시)
        // const token = localStorage.getItem('authToken')

        await axios.post(uploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('jwt')}`, // 필요시 주석 해제
            },
            timeout: API_CONFIG.TIMEOUT,
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    file.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
                }
            },
        })

        file.status = 'completed'
        file.progress = 100
    } catch (error) {
        file.status = 'error'
        console.error('업로드 오류:', error)
        throw error
    }
}

// 개발 환경에서 시뮬레이션 사용 (필요시)
const simulateUpload = async (file: UploadFile): Promise<void> => {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            file.progress += 10

            if (file.progress >= 100) {
                clearInterval(interval)
                file.status = 'completed'
                file.progress = 100
                resolve()
            }
        }, 200)
    })
}
</script>

<style scoped>
.upload-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.upload-popup {
    background: var(--bg-secondary);
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-lg);
}

/* 헤더 */
.popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 28px;
    border-bottom: 1px solid var(--border-color);
}

.popup-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.close-button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.2s ease;
}

.close-button:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

.close-button svg {
    width: 20px;
    height: 20px;
}

/* 콘텐츠 */
.popup-content {
    flex: 1;
    overflow-y: auto;
    padding: 28px;
}

/* 업로드 영역 */
.upload-zone {
    border: 2px dashed var(--border-color);
    border-radius: 12px;
    padding: 48px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--bg-tertiary);
}

.upload-zone:hover {
    border-color: var(--accent-primary);
    background: var(--bg-primary);
}

.upload-zone.drag-over {
    border-color: var(--accent-primary);
    background: var(--bg-primary);
    transform: scale(1.02);
}

.upload-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    color: var(--accent-primary);
}

.upload-icon svg {
    width: 100%;
    height: 100%;
}

.upload-text {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 8px;
}

.upload-subtext {
    font-size: 14px;
    color: var(--text-secondary);
}

.file-input {
    display: none;
}

/* 파일 목록 */
.file-list {
    margin-top: 24px;
}

.file-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.file-list-header h3 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.clear-button {
    padding: 6px 12px;
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.clear-button:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

/* 파일 아이템 */
.file-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.file-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--bg-tertiary);
    border-radius: 8px;
    transition: all 0.2s ease;
}

.file-item:hover {
    background: var(--bg-primary);
}

.file-item-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    border-radius: 8px;
    color: var(--accent-primary);
    flex-shrink: 0;
}

.file-item-icon svg {
    width: 24px;
    height: 24px;
}

.file-item-info {
    flex: 1;
    min-width: 0;
}

.file-item-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-item-size {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
}

/* 상태 */
.file-item-status {
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
}

.status-badge svg {
    width: 14px;
    height: 14px;
}

.status-badge.pending {
    background: var(--bg-secondary);
    color: var(--text-secondary);
}

.status-badge.success {
    background: rgba(81, 207, 102, 0.1);
    color: var(--accent-success);
}

.status-badge.error {
    background: rgba(255, 107, 107, 0.1);
    color: var(--accent-danger);
}

/* 업로드 진행 */
.upload-progress {
    display: flex;
    align-items: center;
    gap: 8px;
}

.progress-bar {
    width: 80px;
    height: 6px;
    background: var(--bg-secondary);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--accent-primary);
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
    min-width: 35px;
}

/* 삭제 버튼 */
.remove-button {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: var(--text-tertiary);
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.remove-button:hover:not(:disabled) {
    background: var(--bg-secondary);
    color: var(--accent-danger);
}

.remove-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.remove-button svg {
    width: 16px;
    height: 16px;
}

/* 푸터 */
.popup-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 28px;
    border-top: 1px solid var(--border-color);
}

.cancel-button,
.upload-button {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-button {
    background: none;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
}

.cancel-button:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

.upload-button {
    background: var(--accent-primary);
    border: none;
    color: white;
}

.upload-button:hover:not(:disabled) {
    background: var(--accent-secondary);
}

.upload-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
