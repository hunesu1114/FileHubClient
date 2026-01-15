<template>
    <aside class="file-detail-panel">
        <div class="panel-header">
            <h2 class="panel-title">파일 상세정보</h2>
            <button class="close-button" @click="$emit('close')" title="닫기">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" />
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" />
                </svg>
            </button>
        </div>

        <div class="panel-content">
            <!-- 파일 미리보기 -->
            <div class="file-preview">
                <svg v-if="file.type === 'image'" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2" />
                    <polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="2" />
                </svg>
                <svg v-else-if="file.type === 'pdf'" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <!-- 파일 이름 -->
            <div class="file-name-section">
                <h3 class="file-name">{{ file.originalFileName }}</h3>
            </div>

            <!-- 파일 속성 -->
            <div class="file-properties">
                <div class="property-item">
                    <span class="property-label">위치</span>
                    <span class="property-value">{{ file.location || '알 수 없음' }}</span>
                </div>

                <div class="property-item">
                    <span class="property-label">만든 날짜</span>
                    <span class="property-value">{{ formatDate(file.createdAt) }}</span>
                </div>

                <div class="property-item">
                    <span class="property-label">크기</span>
                    <span class="property-value">{{ formatFileSize(file.size) }}</span>
                </div>

                <div class="property-item" v-if="file.deletedAt">
                    <span class="property-label">삭제한 날짜</span>
                    <span class="property-value">{{ formatDate(file.deletedAt) }}</span>
                </div>

                <div class="property-item" v-if="file.modifiedAt">
                    <span class="property-label">수정한 날짜</span>
                    <span class="property-value">{{ formatDate(file.modifiedAt) }}</span>
                </div>

                <div class="property-item" v-if="file.type">
                    <span class="property-label">유형</span>
                    <span class="property-value">{{ file.type.toUpperCase() }}</span>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
interface FileData {
    id: number
    originalFileName: string
    size: number
    createdAt: string
    deletedAt?: string
    modifiedAt?: string
    location?: string
    type?: string
}

interface Props {
    file: FileData
}

defineProps<Props>()
defineEmits<{
    close: []
}>()

/**
 * 파일 크기를 KB, MB, GB 단위로 변환합니다.
 */
const formatFileSize = (sizeInKB: number): string => {
    if (!sizeInKB || sizeInKB === 0) return '0 KB'

    const kb = sizeInKB
    const mb = kb / 1024
    const gb = mb / 1024

    if (gb >= 1) {
        return `${gb.toFixed(2)} GB`
    } else if (mb >= 1) {
        return `${mb.toFixed(2)} MB`
    } else {
        return `${kb.toFixed(2)} KB`
    }
}

/**
 * 날짜를 포맷합니다.
 */
const formatDate = (dateString: string): string => {
    if (!dateString) return '-'
    
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}`
}
</script>

<style scoped>
.file-detail-panel {
    width: 300px;
    background: white;
    border-left: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
}

.panel-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    transition: all 0.2s;
}

.close-button:hover {
    background: #f3f4f6;
    color: #1f2937;
}

.close-button svg {
    width: 20px;
    height: 20px;
}

.panel-content {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
}

.file-preview {
    width: 100%;
    height: 160px;
    background: #f9fafb;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.file-preview svg {
    width: 64px;
    height: 64px;
    color: #9ca3af;
}

.file-name-section {
    margin-bottom: 24px;
}

.file-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
    word-break: break-word;
}

.file-properties {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.property-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.property-label {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.property-value {
    font-size: 14px;
    color: #1f2937;
    word-break: break-word;
}

/* 다크모드 지원 (선택사항) */
@media (prefers-color-scheme: dark) {
    .file-detail-panel {
        background: #1f2937;
        border-left-color: #374151;
    }

    .panel-header {
        border-bottom-color: #374151;
    }

    .panel-title,
    .file-name,
    .property-value {
        color: #f9fafb;
    }

    .close-button {
        color: #9ca3af;
    }

    .close-button:hover {
        background: #374151;
        color: #f9fafb;
    }

    .file-preview {
        background: #374151;
    }

    .property-label {
        color: #9ca3af;
    }
}
</style>
