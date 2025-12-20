<template>
    <div class="main-container">
        <GnbContainer @upload="openUploadPopup" />

        <div class="main-body">
            <LnbContainer />

            <main class="content-area">
                <!-- 헤더 영역 -->
                <div class="content-header">
                    <div class="header-left">
                        <h1 class="page-title">전체 파일</h1>
                        <p class="page-subtitle">{{ fileCount }}개의 파일</p>
                    </div>

                    <div class="header-right">
                        <!-- 보기 옵션 -->
                        <div class="view-options">
                            <button class="view-button" :class="{ active: viewMode === 'grid' }"
                                @click="viewMode = 'grid'" title="그리드 보기">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor"
                                        stroke-width="2" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor"
                                        stroke-width="2" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor"
                                        stroke-width="2" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor"
                                        stroke-width="2" />
                                </svg>
                            </button>
                            <button class="view-button" :class="{ active: viewMode === 'list' }"
                                @click="viewMode = 'list'" title="리스트 보기">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                    <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                    <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                    <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                    <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                    <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" />
                                </svg>
                            </button>
                        </div>

                        <!-- 정렬 -->
                        <select class="sort-select" v-model="sortBy">
                            <option value="name">이름순</option>
                            <option value="date">날짜순</option>
                            <option value="size">크기순</option>
                            <option value="type">유형순</option>
                        </select>
                    </div>
                </div>

                <!-- 파일 그리드 뷰 -->
                <div v-if="viewMode === 'grid'" class="file-grid">
                    <div v-for="file in files" :key="file.id" class="file-card" @click="selectFile(file)"
                        @dblclick="openFile(file)">
                        <div class="file-thumbnail">
                            <svg v-if="file.type === 'folder'" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            <svg v-else-if="file.type === 'image'" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor"
                                    stroke-width="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2" />
                                <polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="2" />
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>

                        <div class="file-info">
                            <h3 class="file-name">{{ file.name }}</h3>
                            <p class="file-meta">{{ file.size }} • {{ file.date }}</p>
                        </div>

                        <button class="file-menu-button" @click.stop="openFileMenu(file)">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="1" stroke="currentColor" stroke-width="2" />
                                <circle cx="12" cy="5" r="1" stroke="currentColor" stroke-width="2" />
                                <circle cx="12" cy="19" r="1" stroke="currentColor" stroke-width="2" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- 파일 리스트 뷰 -->
                <div v-else class="file-list">
                    <div class="list-header">
                        <div class="col-name">이름</div>
                        <div class="col-size">크기</div>
                        <div class="col-date">수정일</div>
                        <div class="col-actions"></div>
                    </div>

                    <div v-for="file in files" :key="file.id" class="list-item" @click="selectFile(file)"
                        @dblclick="openFile(file)">
                        <div class="col-name">
                            <svg class="file-icon" v-if="file.type === 'folder'" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                                    stroke="currentColor" stroke-width="2" />
                            </svg>
                            <svg class="file-icon" v-else viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                                    stroke="currentColor" stroke-width="2" />
                                <polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2" />
                            </svg>
                            <span>{{ file.name }}</span>
                        </div>
                        <div class="col-size">{{ file.size }}</div>
                        <div class="col-date">{{ file.date }}</div>
                        <div class="col-actions">
                            <button class="list-menu-button" @click.stop="openFileMenu(file)">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="1" stroke="currentColor" stroke-width="2" />
                                    <circle cx="19" cy="12" r="1" stroke="currentColor" stroke-width="2" />
                                    <circle cx="5" cy="12" r="1" stroke="currentColor" stroke-width="2" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 빈 상태 -->
                <div v-if="files.length === 0" class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <h2>파일이 없습니다</h2>
                    <p>파일을 업로드하거나 폴더를 생성해보세요</p>
                </div>
            </main>

            <UploadPopup v-if="isUploadPopupVisible" @close="closeUploadPopup" @upload="handleUpload" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GnbContainer from './GnbContainer.vue'
import LnbContainer from './LnbContainer.vue'
import UploadPopup from './UploadPopup.vue'


const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('name')
const isUploadPopupVisible = ref(false)

const files = ref([
    { id: 1, name: '프로젝트 문서', type: 'folder', size: '—', date: '2024-12-15' },
    { id: 2, name: 'design-mockup.fig', type: 'file', size: '2.4 MB', date: '2024-12-18' },
    { id: 3, name: 'presentation.pdf', type: 'file', size: '5.1 MB', date: '2024-12-19' },
    { id: 4, name: 'image-gallery', type: 'folder', size: '—', date: '2024-12-10' },
    { id: 5, name: 'screenshot.png', type: 'image', size: '1.2 MB', date: '2024-12-19' },
    { id: 6, name: 'budget-2024.xlsx', type: 'file', size: '856 KB', date: '2024-12-17' },
    { id: 7, name: 'meeting-notes.docx', type: 'file', size: '124 KB', date: '2024-12-18' },
    { id: 8, name: '백업', type: 'folder', size: '—', date: '2024-12-01' }
])

const fileCount = ref(files.value.length)

const selectFile = (file: any) => {
    console.log('파일 선택:', file)
    // TODO: 파일 선택 처리
}

const openFile = (file: any) => {
    console.log('파일 열기:', file)
    // TODO: 파일 열기 처리
}

const openFileMenu = (file: any) => {
    console.log('파일 메뉴:', file)
    // TODO: 컨텍스트 메뉴 표시
}

const openUploadPopup = () => {
    isUploadPopupVisible.value = true
}

const closeUploadPopup = () => {
    isUploadPopupVisible.value = false
}

const handleUpload = (uploadedFiles: File[]) => {
    console.log('업로드된 파일:', uploadedFiles)
    // TODO: 업로드된 파일 처리 및 파일 목록 갱신
    closeUploadPopup()
}
</script>

<style scoped>
.main-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.main-body {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    overflow: hidden;
}

/* 헤더 */
.content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 32px;
    background: var(--bg-secondary);
    border-bottom: 2px solid var(--border-color);
    gap: 24px;
}

.header-left {
    flex: 1;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.page-subtitle {
    font-size: 14px;
    color: var(--text-tertiary);
}

.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.view-options {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: var(--bg-primary);
    border-radius: 8px;
    border: 2px solid var(--border-color);
}

.view-button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border-radius: 6px;
    color: var(--text-tertiary);
    transition: all 0.2s ease;
}

.view-button svg {
    width: 20px;
    height: 20px;
}

.view-button:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

.view-button.active {
    background: var(--accent-primary);
    color: white;
}

.sort-select {
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.sort-select:hover {
    border-color: var(--accent-primary);
}

/* 그리드 뷰 */
.file-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 32px;
    overflow-y: auto;
    align-content: start;
}

.file-card {
    position: relative;
    padding: 20px;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.file-card:hover {
    border-color: var(--accent-primary);
    box-shadow: 0 4px 12px rgba(76, 110, 245, 0.15);
    transform: translateY(-2px);
}

.file-thumbnail {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    border-radius: 8px;
    margin-bottom: 16px;
    color: var(--accent-primary);
}

.file-thumbnail svg {
    width: 48px;
    height: 48px;
}

.file-info {
    text-align: center;
}

.file-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.file-meta {
    font-size: 12px;
    color: var(--text-tertiary);
}

.file-menu-button {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    border-radius: 6px;
    color: var(--text-tertiary);
    opacity: 0;
    transition: all 0.2s ease;
}

.file-card:hover .file-menu-button {
    opacity: 1;
}

.file-menu-button svg {
    width: 16px;
    height: 16px;
}

.file-menu-button:hover {
    background: var(--accent-primary);
    color: white;
}

/* 리스트 뷰 */
.file-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.list-header {
    display: grid;
    grid-template-columns: 1fr 120px 140px 60px;
    gap: 16px;
    padding: 16px 32px;
    background: var(--bg-secondary);
    border-bottom: 2px solid var(--border-color);
    font-size: 12px;
    font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.list-item {
    display: grid;
    grid-template-columns: 1fr 120px 140px 60px;
    gap: 16px;
    padding: 16px 32px;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.2s ease;
}

.list-item:hover {
    background: var(--bg-secondary);
}

.col-name {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
}

.file-icon {
    width: 20px;
    height: 20px;
    color: var(--accent-primary);
    flex-shrink: 0;
}

.col-size,
.col-date {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--text-secondary);
}

.col-actions {
    display: flex;
    align-items: center;
    justify-content: center;
}

.list-menu-button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border-radius: 6px;
    color: var(--text-tertiary);
    transition: all 0.2s ease;
}

.list-menu-button svg {
    width: 16px;
    height: 16px;
}

.list-menu-button:hover {
    background: var(--bg-tertiary);
    color: var(--accent-primary);
}

/* 빈 상태 */
.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

.empty-state svg {
    width: 120px;
    height: 120px;
    color: var(--text-tertiary);
    opacity: 0.5;
    margin-bottom: 24px;
}

.empty-state h2 {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
}

.empty-state p {
    font-size: 14px;
    color: var(--text-tertiary);
}

@media (max-width: 768px) {
    .content-header {
        padding: 16px 20px;
        flex-direction: column;
        align-items: flex-start;
    }

    .header-right {
        width: 100%;
        justify-content: space-between;
    }

    .file-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 16px;
        padding: 20px;
    }

    .list-header,
    .list-item {
        grid-template-columns: 1fr 80px 60px;
        padding: 12px 20px;
    }

    .col-date {
        display: none;
    }
}
</style>
