<template>
    <Teleport to="body">
        <div v-if="visible" class="context-menu-overlay" @click="close">
            <div class="context-menu" :style="menuStyle" @click.stop>
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
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'download', 'delete', 'share', 'edit'])

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

<style scoped>
.context-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background: transparent;
}

.context-menu {
    position: fixed;
    min-width: 200px;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    padding: 8px;
    z-index: 10000;
    animation: menuFadeIn 0.15s ease-out;
}

@keyframes menuFadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.menu-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    background: transparent;
    border-radius: 8px;
    text-align: left;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
}

.menu-item svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: var(--text-secondary);
}

.menu-item:hover {
    background: var(--bg-tertiary);
    color: var(--accent-primary);
}

.menu-item:hover svg {
    color: var(--accent-primary);
}

.menu-item:active {
    transform: scale(0.98);
}

/* 다크모드 대응 */
@media (prefers-color-scheme: dark) {
    .context-menu {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
}
</style>
