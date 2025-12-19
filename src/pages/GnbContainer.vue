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
    console.log('파일 업로드')
    // TODO: 파일 업로드 다이얼로그 열기
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

<style scoped>
.gnb-container {
    width: 100%;
    height: 64px;
    background: var(--bg-secondary);
    border-bottom: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    gap: 24px;
    transition: all 0.3s ease;
}

.gnb-left {
    display: flex;
    align-items: center;
    gap: 32px;
    flex: 1;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
}

.logo svg {
    width: 32px;
    height: 32px;
    color: var(--accent-primary);
}

.logo-text {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.search-bar {
    flex: 1;
    max-width: 500px;
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 16px;
    width: 20px;
    height: 20px;
    color: var(--text-tertiary);
    pointer-events: none;
}

.search-bar input {
    width: 100%;
    padding: 10px 16px 10px 48px;
    font-size: 14px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: all 0.2s ease;
}

.search-bar input:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 4px rgba(76, 110, 245, 0.1);
}

.gnb-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.upload-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(76, 110, 245, 0.3);
}

.upload-button svg {
    width: 20px;
    height: 20px;
}

.upload-button:hover {
    box-shadow: 0 4px 12px rgba(76, 110, 245, 0.4);
}

.icon-button {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border-radius: 8px;
    color: var(--text-secondary);
    transition: all 0.2s ease;
}

.icon-button svg {
    width: 20px;
    height: 20px;
}

.icon-button:hover {
    background: var(--bg-tertiary);
    color: var(--accent-primary);
}

.badge {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: white;
    background: var(--accent-danger);
    border-radius: 9px;
    border: 2px solid var(--bg-secondary);
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 12px 6px 6px;
    border-radius: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

.user-profile:hover {
    background: var(--bg-tertiary);
    border-color: var(--accent-primary);
}

.avatar {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
    color: white;
    font-weight: 700;
    font-size: 14px;
    border-radius: 50%;
}

.user-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.chevron {
    width: 16px;
    height: 16px;
    color: var(--text-tertiary);
    transition: transform 0.2s ease;
}

.user-profile:hover .chevron {
    transform: translateY(2px);
}

@media (max-width: 768px) {
    .gnb-container {
        padding: 0 16px;
    }

    .search-bar {
        max-width: 300px;
    }

    .user-name {
        display: none;
    }

    .logo-text {
        display: none;
    }
}
</style>
