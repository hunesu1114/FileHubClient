<template>
    <Teleport to="body">
        <div v-if="visible" class="context-menu-overlay" @click="close">
            <div class="context-menu" :style="menuStyle" @click.stop>
                <!-- 휴지통 페이지용 메뉴 -->
                <template v-if="isRecycleBin">
                    <button class="menu-item" @click="handleRestore">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="23 4 23 10 17 10" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>복원</span>
                    </button>

                    <button class="menu-item danger" @click="handlePermanentDelete">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>영구삭제</span>
                    </button>
                </template>

                <!-- 일반 파일 페이지용 메뉴 -->
                <template v-else>
                    <button class="menu-item" @click="handleDownload">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>다운로드</span>
                    </button>

                    <button class="menu-item" @click="handleDelete">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>삭제</span>
                    </button>

                    <button class="menu-item" @click="handleShare">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>공유</span>
                    </button>

                    <button class="menu-item" @click="handleEdit">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>수정</span>
                    </button>
                </template>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
    visible: boolean
    x: number
    y: number
    targetItem: any
    isRecycleBin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isRecycleBin: false
})

const emit = defineEmits(['close', 'download', 'delete', 'share', 'edit', 'restore', 'permanent-delete'])

const menuStyle = computed(() => {
    const menuWidth = 200 // min-width와 동일
    const menuHeight = 200 // 대략적인 높이
    const padding = 8 // 화면 가장자리에서의 여백
    
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let x = props.x
    let y = props.y
    
    // 오른쪽 경계 체크 - 메뉴가 화면 밖으로 나가면 왼쪽에 표시
    if (x + menuWidth > viewportWidth - padding) {
        x = x - menuWidth
    }
    
    // 하단 경계 체크 - 메뉴가 화면 아래로 나가면 위로 표시
    if (y + menuHeight > viewportHeight - padding) {
        y = viewportHeight - menuHeight - padding
    }
    
    // 왼쪽 경계 체크 - 너무 왼쪽으로 가지 않도록
    if (x < padding) {
        x = padding
    }
    
    // 상단 경계 체크
    if (y < padding) {
        y = padding
    }
    
    return {
        left: `${x}px`,
        top: `${y}px`
    }
})

const close = () => {
    emit('close')
}

const handleDownload = () => {
    emit('download', props.targetItem)
    close()
}

const handleDelete = () => {
    emit('delete', props.targetItem)
    close()
}

const handleShare = () => {
    emit('share', props.targetItem)
    close()
}

const handleEdit = () => {
    emit('edit', props.targetItem)
    close()
}

const handleRestore = () => {
    emit('restore', props.targetItem)
    close()
}

const handlePermanentDelete = () => {
    emit('permanent-delete', props.targetItem)
    close()
}

// ESC 키로 닫기
watch(() => props.visible, (newVal) => {
    if (newVal) {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close()
                document.removeEventListener('keydown', handleEsc)
            }
        }
        document.addEventListener('keydown', handleEsc)
    }
})
</script>

<style scoped src="../assets/styles/FileContextMenu.css"></style>