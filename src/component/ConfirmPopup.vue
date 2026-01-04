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

<style scoped src="../assets/styles/ConfirmPopup.css"></style>
