<template>
    <Teleport to="body">
        <div v-if="isVisible" class="confirm-overlay" @click.self="handleCancel">
            <div class="confirm-container">
                <!-- 아이콘 -->
                <div class="confirm-icon" :class="iconType">
                    <!-- Warning -->
                    <svg v-if="type === 'warning'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                        <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                    </svg>

                    <!-- Danger -->
                    <svg v-else-if="type === 'danger'" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                    </svg>

                    <!-- Info -->
                    <svg v-else-if="type === 'info'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                        <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                        <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                    </svg>

                    <!-- Success -->
                    <svg v-else-if="type === 'success'" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                        <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <!-- Default Question -->
                    <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                        <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                    </svg>
                </div>

                <!-- 내용 -->
                <div class="confirm-content">
                    <h3 class="confirm-title">{{ title }}</h3>
                    <p class="confirm-message">{{ message }}</p>
                </div>

                <!-- 버튼 -->
                <div class="confirm-actions">
                    <button v-if="showCancelButton" class="cancel-button" @click="handleCancel">
                        {{ cancelText }}
                    </button>
                    <button class="confirm-button" :class="buttonType" @click="handleConfirm">
                        {{ confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
    title?: string
    message: string
    type?: 'info' | 'success' | 'warning' | 'danger' | 'question'
    confirmText?: string
    cancelText?: string
    showCancelButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    title: '확인',
    type: 'question',
    confirmText: '확인',
    cancelText: '취소',
    showCancelButton: true
})

const emit = defineEmits<{
    confirm: []
    cancel: []
}>()

const isVisible = ref(true)

const iconType = computed(() => {
    return `icon-${props.type}`
})

const buttonType = computed(() => {
    return `button-${props.type}`
})

const handleConfirm = () => {
    isVisible.value = false
    emit('confirm')
}

const handleCancel = () => {
    isVisible.value = false
    emit('cancel')
}
</script>

<style scoped>
.confirm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 9999;
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

.confirm-container {
    width: 100%;
    max-width: 420px;
    background: var(--bg-secondary);
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    border: 2px solid var(--border-color);
    animation: slideUp 0.3s ease;
    text-align: center;
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

/* 아이콘 */
.confirm-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    animation: scaleIn 0.4s ease;
}

@keyframes scaleIn {
    from {
        transform: scale(0);
    }

    to {
        transform: scale(1);
    }
}

.confirm-icon svg {
    width: 48px;
    height: 48px;
}

.icon-info {
    background: rgba(76, 110, 245, 0.15);
    color: var(--accent-primary);
}

.icon-success {
    background: rgba(81, 207, 102, 0.15);
    color: var(--accent-success);
}

.icon-warning {
    background: rgba(255, 212, 59, 0.15);
    color: var(--accent-warning);
}

.icon-danger {
    background: rgba(255, 107, 107, 0.15);
    color: var(--accent-danger);
}

.icon-question {
    background: rgba(76, 110, 245, 0.15);
    color: var(--accent-primary);
}

/* 내용 */
.confirm-content {
    margin-bottom: 32px;
}

.confirm-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 12px;
}

.confirm-message {
    font-size: 15px;
    color: var(--text-secondary);
    line-height: 1.6;
}

/* 버튼 */
.confirm-actions {
    display: flex;
    gap: 12px;
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
    background: var(--bg-tertiary);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
}

.confirm-button {
    flex: 1;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    border: 2px solid transparent;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.button-info,
.button-question {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
}

.button-info:hover,
.button-question:hover {
    background: #ffffff;
    color: var(--accent-primary);
    border-color: var(--accent-primary);
}

.button-success {
    background: var(--accent-success);
    border-color: var(--accent-success);
}

.button-success:hover {
    background: #ffffff;
    color: var(--accent-success);
    border-color: var(--accent-success);
}

.button-warning {
    background: var(--accent-warning);
    border-color: var(--accent-warning);
    color: #3c1e1e;
}

.button-warning:hover {
    background: #ffffff;
    color: var(--accent-warning);
    border-color: var(--accent-warning);
}

.button-danger {
    background: var(--accent-danger);
    border-color: var(--accent-danger);
}

.button-danger:hover {
    background: #ffffff;
    color: var(--accent-danger);
    border-color: var(--accent-danger);
}

@media (max-width: 480px) {
    .confirm-container {
        padding: 24px;
    }

    .confirm-icon {
        width: 64px;
        height: 64px;
        margin-bottom: 20px;
    }

    .confirm-icon svg {
        width: 36px;
        height: 36px;
    }

    .confirm-title {
        font-size: 20px;
    }

    .confirm-message {
        font-size: 14px;
    }

    .confirm-actions {
        flex-direction: column-reverse;
    }
}
</style>
