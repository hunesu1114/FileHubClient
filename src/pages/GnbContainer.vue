<template>
    <header class="gnb-container">
        <div class="gnb-left">
            <div class="logo">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="logo-text">FileHub</span>
            </div>

            <!-- 검색 바 -->
            <div class="search-bar">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                <input v-model="searchQuery" type="text" placeholder="파일 검색..." @keyup.enter="handleSearch" />
            </div>
        </div>

        <div class="gnb-right">
            <!-- 업로드 버튼 -->
            <button class="upload-button" @click="handleUpload">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>업로드</span>
            </button>

            <!-- 테마 토글 버튼 -->
            <button class="icon-button" @click="toggleTheme" :title="isDark ? '라이트 모드' : '다크 모드'">
                <svg v-if="!isDark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" />
                    <path
                        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
            </button>

            <!-- 알림 버튼 -->
            <button class="icon-button" @click="toggleNotifications">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
            </button>

            <!-- 사용자 프로필 -->
            <div class="user-profile" @click="toggleUserMenu">
                <div class="avatar">
                    <span>{{ userInitial }}</span>
                </div>
                <span class="user-name">{{ userName }}</span>
                <svg class="chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const emit = defineEmits<{
    upload: []
}>()

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const searchQuery = ref('')
const notificationCount = ref(3)
const userName = ref('홍길동')
const userInitial = computed(() => userName.value.charAt(0))

const toggleTheme = () => {
    themeStore.toggleTheme()
}

const handleSearch = () => {
    console.log('검색:', searchQuery.value)
    // TODO: 검색 기능 구현
}

const handleUpload = () => {
    emit('upload')
}

const toggleNotifications = () => {
    console.log('알림 토글')
    // TODO: 알림 패널 열기
}

const toggleUserMenu = () => {
    console.log('사용자 메뉴 토글')
    // TODO: 사용자 메뉴 열기
}
</script>

<style scoped src="../assets/styles/GnbContainer.css"></style>

