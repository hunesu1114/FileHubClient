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

interface Props {
    folderId?: number
}

const props = withDefaults(defineProps<Props>(), {
    folderId: 0
})

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
        formData.append('folderId', String(props.folderId))

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

<style scoped src="../assets/styles/UploadPopup.css"></style>
