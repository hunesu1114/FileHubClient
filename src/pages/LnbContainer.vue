<template>
    <aside class="lnb-container" :class="{ collapsed: isCollapsed }">
        <!-- 토글 버튼 -->
        <button class="collapse-button" @click="toggleCollapse">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>

        <!-- 새 폴더 버튼 -->
        <button class="new-folder-button" @click="createNewFolder" v-if="!isCollapsed">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
            <span>새 폴더</span>
        </button>

        <!-- 스토리지 정보 -->
        <div class="storage-info" v-if="!isCollapsed">
            <div class="storage-header">
                <span class="storage-label">저장 공간</span>
                <span class="storage-text">{{ usedStorage }} / {{ totalStorage }}</span>
            </div>
            <div class="storage-bar">
                <div class="storage-progress" :style="{ width: storagePercentage + '%' }"></div>
            </div>
        </div>

        <!-- 네비게이션 메뉴 -->
        <nav class="nav-menu">
            <div class="nav-section">
                <h3 class="section-title" v-if="!isCollapsed">빠른 접근</h3>

                <a v-for="item in quickAccessItems" :key="item.id" :href="item.path" class="nav-item"
                    :class="{ active: currentPath === item.path }" @click.prevent="navigateTo(item.path)">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path :d="item.icon" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <span class="nav-label" v-if="!isCollapsed">{{ item.label }}</span>
                    <span class="nav-count" v-if="!isCollapsed && item.count">{{ item.count }}</span>
                </a>
            </div>

            <div class="nav-section">
                <h3 class="section-title" v-if="!isCollapsed">폴더</h3>

                <a v-for="folder in folders" :key="folder.id" :href="folder.path" class="nav-item"
                    :class="{ active: currentPath === folder.path }" @click.prevent="navigateTo(folder.path)">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span class="nav-label" v-if="!isCollapsed">{{ folder.name }}</span>
                </a>
            </div>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isCollapsed = ref(false)
const currentPath = ref('/all-files')
const usedStorage = ref('15.2 GB')
const totalStorage = ref('50 GB')

const storagePercentage = computed(() => {
    const used = parseFloat(usedStorage.value)
    const total = parseFloat(totalStorage.value)
    return (used / total) * 100
})

const emit = defineEmits<{
    create: []
}>()

const quickAccessItems = ref([
    {
        id: 1,
        label: '전체 파일',
        path: '/all-files',
        icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
        count: null
    },
    {
        id: 2,
        label: '최근 항목',
        path: '/recent',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        count: null
    },
    {
        id: 3,
        label: '즐겨찾기',
        path: '/favorites',
        icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
        count: 12
    },
    {
        id: 4,
        label: '공유됨',
        path: '/shared',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        count: 5
    },
    {
        id: 5,
        label: '휴지통',
        path: '/trash',
        icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
        count: 3
    }
])

const folders = ref([
    // { id: 101, name: '프로젝트', path: '/folder/projects' },
    // { id: 102, name: '문서', path: '/folder/documents' },
    // { id: 103, name: '이미지', path: '/folder/images' },
    // { id: 104, name: '비디오', path: '/folder/videos' }
])

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
}

const createNewFolder = () => {
    emit('create')
}



const navigateTo = (path: string) => {
    currentPath.value = path
    console.log('Navigate to:', path)
    // TODO: 라우터 네비게이션
}
</script>

<style scoped>
.lnb-container {
    width: 280px;
    height: 100%;
    background: var(--bg-secondary);
    border-right: 2px solid var(--border-color);
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
    gap: 20px;
    position: relative;
    transition: width 0.3s ease;
    overflow-y: auto;
    overflow-x: hidden;
}

.lnb-container.collapsed {
    width: 72px;
    padding: 20px 12px;
}

.collapse-button {
    position: absolute;
    top: 20px;
    right: -14px;
    width: 28px;
    height: 28px;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-tertiary);
    z-index: 10;
    transition: all 0.2s ease;
}

.collapse-button svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
}

.lnb-container.collapsed .collapse-button svg {
    transform: rotate(180deg);
}

.collapse-button:hover {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;
}

.new-folder-button {
    width: 100%;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--accent-primary);
    background: transparent;
    border: 2px solid var(--accent-primary);
    border-radius: 8px;
    transition: all 0.2s ease;
}

.new-folder-button svg {
    width: 18px;
    height: 18px;
}

.new-folder-button:hover {
    background: var(--accent-primary);
    color: white;
}

/* 스토리지 정보 */
.storage-info {
    padding: 16px;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 12px;
}

.storage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.storage-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
}

.storage-text {
    font-size: 12px;
    color: var(--text-tertiary);
    font-weight: 500;
}

.storage-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
}

.storage-progress {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
    box-shadow: 0 0 8px rgba(76, 110, 245, 0.4);
}

/* 네비게이션 메뉴 */
.nav-menu {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
}

.nav-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.section-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 8px 12px;
    margin-bottom: 4px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    position: relative;
}

.lnb-container.collapsed .nav-item {
    justify-content: center;
    padding: 12px;
}

.nav-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.nav-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.nav-count {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-tertiary);
    background: var(--bg-tertiary);
    padding: 2px 8px;
    border-radius: 12px;
}

.nav-item:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border-color: var(--accent-primary);
}

.nav-item.active {
    background: linear-gradient(135deg, rgba(76, 110, 245, 0.1) 0%, rgba(92, 124, 250, 0.1) 100%);
    color: var(--accent-primary);
    border-color: var(--accent-primary);
    font-weight: 600;
}

.nav-item.active .nav-icon {
    color: var(--accent-primary);
}

.nav-item.active .nav-count {
    background: var(--accent-primary);
    color: white;
}

/* 스크롤바 커스터마이징 */
.lnb-container::-webkit-scrollbar {
    width: 6px;
}

.lnb-container::-webkit-scrollbar-track {
    background: transparent;
}

.lnb-container::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
}

.lnb-container::-webkit-scrollbar-thumb:hover {
    background: var(--accent-primary);
}

@media (max-width: 768px) {
    .lnb-container {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        z-index: 100;
        box-shadow: var(--shadow-lg);
    }

    .lnb-container.collapsed {
        transform: translateX(-100%);
    }
}
</style>
