<template>
    <div class="main-container">
        <GnbContainer @upload="openUploadPopup" />

        <div class="main-body">
            <LnbContainer @create="openFolderCreatePopup" :folder-id="0" />

            <main class="content-area">
                <!-- 헤더 영역 -->
                <div class="content-header">
                    <div class="header-left">
                        <div class="title-row">
                            <h1 class="page-title">휴지통</h1>
                        </div>
                        <p class="page-subtitle">{{ fileCount + folders.length }}개의 항목</p>
                    </div>

                    <div class="header-right">
                        <!-- 휴지통 비우기 버튼 -->
                        <button v-if="files?.length > 0 || folders?.length > 0"
                            class="action-button empty-recycle-bin-button" @click="handleEmptyRecycleBin"
                            title="휴지통 비우기">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span>휴지통 비우기</span>
                        </button>

                        <!-- 선택된 항목 액션 버튼 -->
                        <div v-if="selectedItems.size > 0" class="selection-actions">
                            <span class="selection-count">{{ selectedItems.size }}개 선택됨</span>
                            <button class="action-button restore-button" @click="handleBulkRestore" title="복원">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polyline points="23 4 23 10 17 10" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>복원</span>
                            </button>
                            <button class="action-button delete-button" @click="handleBulkPermanentDelete" title="영구삭제">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                                <span>영구삭제</span>
                            </button>
                        </div>

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
                            <option value="deletedDate">삭제일순</option>
                            <option value="size">크기순</option>
                        </select>
                    </div>
                </div>

                <div class="content-with-detail">
                    <!-- 파일 목록 영역 -->
                    <div class="files-area" :class="{ 'with-detail': selectedFile !== null }">
                        <!-- 파일 그리드 뷰 -->
                        <div v-if="viewMode === 'grid'" class="file-grid">
                            <!-- 폴더 -->
                            <div v-for="folder in folders" :key="`folder-${folder.id}`" class="file-card"
                                :class="{ 'selected': selectedItems.has(folder.id) }" @click="selectFolder(folder)">
                                <div class="file-checkbox-wrapper">
                                    <input type="checkbox" :id="`folder-${folder.id}`"
                                        :checked="selectedItems.has(folder.id)"
                                        @click="toggleSelection(folder.id, $event)" class="file-checkbox" />
                                    <label :for="`folder-${folder.id}`" class="checkbox-label" @click.stop></label>
                                </div>

                                <div class="file-thumbnail">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>
                                </div>

                                <div class="file-info">
                                    <h3 class="file-name">{{ folder.folderName }}</h3>
                                    <p class="file-meta">폴더 <br> 삭제: {{ folder.deletedAt ?
                                        folder.deletedAt.split(' ')[0] : '-' }}</p>
                                </div>

                                <button class="file-menu-button" @click.stop="openFolderMenu(folder, $event)">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="1" stroke="currentColor" stroke-width="2" />
                                        <circle cx="12" cy="5" r="1" stroke="currentColor" stroke-width="2" />
                                        <circle cx="12" cy="19" r="1" stroke="currentColor" stroke-width="2" />
                                    </svg>
                                </button>
                            </div>

                            <!-- 파일 -->
                            <div v-for="file in files" :key="file.id" class="file-card"
                                :class="{ 'selected': selectedItems.has(file.id) }" @click="selectFile(file)">
                                <div class="file-checkbox-wrapper">
                                    <input type="checkbox" :id="`file-${file.id}`" :checked="selectedItems.has(file.id)"
                                        @click="toggleSelection(file.id, $event)" class="file-checkbox" />
                                    <label :for="`file-${file.id}`" class="checkbox-label" @click.stop></label>
                                </div>

                                <div class="file-thumbnail">
                                    <svg v-if="file.type === 'image'" viewBox="0 0 24 24" fill="none"
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
                                    <h3 class="file-name">{{ file.originalFileName }}</h3>
                                    <p class="file-meta">{{ formatFileSize(file.size) }} <br> 삭제: {{ file.deletedAt ?
                                        file.deletedAt.split(' ')[0] : '-' }}</p>
                                </div>

                                <button class="file-menu-button" @click.stop="openFileMenu(file, $event)">
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
                                <div class="col-checkbox"></div>
                                <div class="col-name">이름</div>
                                <div class="col-size">크기</div>
                                <div class="col-date">삭제일</div>
                                <div class="col-actions"></div>
                            </div>

                            <!-- 폴더 목록 -->
                            <div v-for="folder in folders" :key="`folder-${folder.id}`" class="list-item"
                                :class="{ 'selected': selectedItems.has(folder.id) }" @click="selectFolder(folder)">
                                <div class="col-checkbox">
                                    <input type="checkbox" :id="`list-folder-${folder.id}`"
                                        :checked="selectedItems.has(folder.id)"
                                        @click="toggleSelection(folder.id, $event)" class="list-checkbox" />
                                    <label :for="`list-folder-${folder.id}`" class="checkbox-label" @click.stop></label>
                                </div>
                                <div class="col-name">
                                    <svg class="file-icon" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                                            stroke="currentColor" stroke-width="2" />
                                    </svg>
                                    <span>{{ folder.folderName }}</span>
                                </div>
                                <div class="col-size">—</div>
                                <div class="col-date">{{ folder.deletedAt ? folder.deletedAt.split(' ')[0] : '-' }}
                                </div>
                                <div class="col-actions">
                                    <button class="list-menu-button" @click.stop="openFolderMenu(folder, $event)">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="1" stroke="currentColor" stroke-width="2" />
                                            <circle cx="19" cy="12" r="1" stroke="currentColor" stroke-width="2" />
                                            <circle cx="5" cy="12" r="1" stroke="currentColor" stroke-width="2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- 파일 목록 -->
                            <div v-for="file in files" :key="file.id" class="list-item"
                                :class="{ 'selected': selectedItems.has(file.id) }" @click="selectFile(file)">
                                <div class="col-checkbox">
                                    <input type="checkbox" :id="`list-file-${file.id}`"
                                        :checked="selectedItems.has(file.id)" @click="toggleSelection(file.id, $event)"
                                        class="list-checkbox" />
                                    <label :for="`list-file-${file.id}`" class="checkbox-label" @click.stop></label>
                                </div>
                                <div class="col-name">
                                    <svg class="file-icon" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                                            stroke="currentColor" stroke-width="2" />
                                        <polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2" />
                                    </svg>
                                    <span>{{ file.originalFileName }}</span>
                                </div>
                                <div class="col-size">{{ formatFileSize(file.size) }}</div>
                                <div class="col-date">{{ file.deletedAt ? file.deletedAt.split(' ')[0] : '-' }}</div>
                                <div class="col-actions">
                                    <button class="list-menu-button" @click.stop="openFileMenu(file, $event)">
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
                        <div v-if="files?.length === 0 && folders?.length === 0" class="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            <h2>휴지통이 비어있습니다</h2>
                            <p>삭제된 파일이 없습니다</p>
                        </div>
                    </div>

                    <!-- 파일 상세정보 패널 -->
                    <FileDetailPanel v-if="selectedFile" :file="selectedFile" @close="closeDetailPanel" />
                </div>
            </main>

            <UploadPopup v-if="isUploadPopupVisible" :folder-id="0" @close="closeUploadPopup" @upload="handleUpload" />
            <FolderCreatePopup v-if="isFolderCreatePopupVisible" @close="closeFolderCreatePopup"
                @create="createFolder" />
            <ConfirmPopup v-if="isConfirmPopupVisible" @confirm="handleConfirm" @cancel="handleCancel"
                :title="confirmTitle" :type="confirmType" :showCancelButton="showCancelButton" :message="confirmMsg" />
            <FileContextMenu :visible="isContextMenuVisible" :x="contextMenuX" :y="contextMenuY"
                :target-item="contextMenuTarget" :is-recycle-bin="true" @close="closeContextMenu"
                @restore="handleRestore" @permanent-delete="handlePermanentDelete" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GnbContainer from './GnbContainer.vue'
import LnbContainer from './LnbContainer.vue'
import UploadPopup from './UploadPopup.vue'
import ConfirmPopup from '@/component/ConfirmPopup.vue'
import FileContextMenu from '@/component/FileContextMenu.vue'
import FileDetailPanel from '@/component/FileDetailPanel.vue'
import FolderCreatePopup from './FolderCreatePopup.vue'
import axios from 'axios'
import { API_CONFIG, getApiUrl } from '@/config/api'

// 타입 정의
interface FileData {
    id: number
    originalFileName: string
    size: number
    createdAt: string
    deletedAt?: string
    location?: string
    type?: string
}

interface FolderData {
    id: number
    folderName: string
    createdAt: string
    deletedAt?: string
    parentFolderId?: number
    hierarchy?: string
}

const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('name')
const isUploadPopupVisible = ref(false)
const isConfirmPopupVisible = ref(false)
const confirmTitle = ref<string>('')
const confirmMsg = ref<string>('')
const confirmType = ref<string>('success')
const showCancelButton = ref(true)
const files = ref<FileData[]>([])
const folders = ref<FolderData[]>([])
const fileCount = ref(0)

// 체크박스 선택 관련
const selectedItems = ref<Set<number>>(new Set())
const selectedFile = ref<FileData | null>(null)

// 컨텍스트 메뉴 관련
const isContextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const contextMenuTarget = ref<FileData | null>(null)

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
 * 체크박스 토글
 */
const toggleSelection = (id: number, event: Event) => {
    event.stopPropagation()
    if (selectedItems.value.has(id)) {
        selectedItems.value.delete(id)
    } else {
        selectedItems.value.add(id)
    }
}

/**
 * 파일 선택 (단일 선택) - 상세정보 패널에 표시
 */
const selectFile = (file: FileData) => {
    selectedFile.value = file
}

/**
 * 폴더 선택 (단일 선택) - 상세정보 패널에 표시
 */
const selectFolder = (folder: FolderData) => {
    selectedFile.value = folder as any
}

/**
 * 상세정보 패널 닫기
 */
const closeDetailPanel = () => {
    selectedFile.value = null
}

/**
 * 컨텍스트 메뉴 열기
 */
const openFileMenu = (file: FileData, event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    contextMenuTarget.value = file
    contextMenuX.value = event.clientX
    contextMenuY.value = event.clientY
    isContextMenuVisible.value = true
}

/**
 * 폴더 컨텍스트 메뉴 열기
 */
const openFolderMenu = (folder: FolderData, event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    contextMenuTarget.value = folder as any
    contextMenuX.value = event.clientX
    contextMenuY.value = event.clientY
    isContextMenuVisible.value = true
}

/**
 * 컨텍스트 메뉴 닫기
 */
const closeContextMenu = () => {
    isContextMenuVisible.value = false
    contextMenuTarget.value = null
}

/**
 * 휴지통 비우기 - API 호출 함수 껍데기
 */
const handleEmptyRecycleBin = () => {
    confirmTitle.value = '휴지통 비우기'
    confirmMsg.value = '휴지통의 모든 파일을 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
    confirmType.value = 'warning'
    showCancelButton.value = true
    isConfirmPopupVisible.value = true

    // TODO: API 호출 구현
    // await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.API_RECYCLE_BIN_EMPTY), {
    //     headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    // })
}

/**
 * 복원 처리 - API 호출 함수 껍데기
 */
const handleRestore = async (item: FileData) => {
    console.log('복원:', item)

    // TODO: API 호출 구현
    // await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.API_RECYCLE_BIN_RESTORE), {
    //     objectIds: [item.id]
    // }, {
    //     headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    // })

    confirmTitle.value = '복원 완료'
    confirmMsg.value = `"${item.originalFileName}"이(가) 복원되었습니다.`
    confirmType.value = 'success'
    showCancelButton.value = false
    isConfirmPopupVisible.value = true

    // 목록 갱신
    await getRecycleBinFiles()
}

/**
 * 영구삭제 처리 - API 호출 함수 껍데기
 */
const handlePermanentDelete = async (item: FileData) => {
    console.log('영구삭제:', item)

    // TODO: API 호출 구현
    // await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.API_RECYCLE_BIN_PERMANENT_DELETE), {
    //     data: { objectIds: [item.id] },
    //     headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    // })

    confirmTitle.value = '영구삭제 완료'
    confirmMsg.value = `"${item.originalFileName}"이(가) 영구적으로 삭제되었습니다.`
    confirmType.value = 'success'
    showCancelButton.value = false
    isConfirmPopupVisible.value = true

    // 목록 갱신
    await getRecycleBinFiles()
}

/**
 * 일괄 복원 처리 - API 호출 함수 껍데기
 */
const handleBulkRestore = async () => {
    console.log('일괄 복원:', Array.from(selectedItems.value))

    // TODO: API 호출 구현
    // await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.API_RECYCLE_BIN_RESTORE), {
    //     objectIds: Array.from(selectedItems.value)
    // }, {
    //     headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    // })

    confirmTitle.value = '복원 완료'
    confirmMsg.value = `선택한 ${selectedItems.value.size}개 항목이 복원되었습니다.`
    confirmType.value = 'success'
    showCancelButton.value = false
    isConfirmPopupVisible.value = true

    selectedItems.value.clear()
    // 목록 갱신
    await getRecycleBinFiles()
}

/**
 * 일괄 영구삭제 처리 - API 호출 함수 껍데기
 */
const handleBulkPermanentDelete = async () => {
    confirmTitle.value = '영구삭제 확인'
    confirmMsg.value = `선택한 ${selectedItems.value.size}개 항목을 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
    confirmType.value = 'warning'
    showCancelButton.value = true
    isConfirmPopupVisible.value = true

    // TODO: API 호출 구현 (확인 후 실행)
    // await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.API_RECYCLE_BIN_PERMANENT_DELETE), {
    //     data: { objectIds: Array.from(selectedItems.value) },
    //     headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    // })
}

const handleConfirm = () => {
    console.log('확인됨')
    isConfirmPopupVisible.value = false
}

const handleCancel = () => {
    console.log('취소됨')
    isConfirmPopupVisible.value = false
}

const openUploadPopup = () => {
    isUploadPopupVisible.value = true
}

const closeUploadPopup = () => {
    isUploadPopupVisible.value = false
}

const handleUpload = (uploadedFiles: File[]) => {
    console.log('업로드된 파일:', uploadedFiles)
    closeUploadPopup()
}

const isFolderCreatePopupVisible = ref(false)

const openFolderCreatePopup = () => {
    isFolderCreatePopupVisible.value = true
}

const closeFolderCreatePopup = () => {
    isFolderCreatePopupVisible.value = false
}

const createFolder = (folderName: string) => {
    console.log('새 폴더 생성:', folderName)
    closeFolderCreatePopup()
}

/**
 * 휴지통 파일 목록 가져오기
 */
const getRecycleBinFiles = async () => {
    try {
        // 삭제된 폴더 가져오기
        await axios.get(
            getApiUrl(API_CONFIG.ENDPOINTS.API_FOLDER_GETDELETEDDATA),
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
                timeout: API_CONFIG.TIMEOUT
            }
        ).then(res => {
            folders.value = res.data.data || []
        })

        // 삭제된 파일 가져오기
        await axios.get(
            getApiUrl(API_CONFIG.ENDPOINTS.API_FILES_GETDELETEDDATA),
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
                timeout: API_CONFIG.TIMEOUT
            }
        ).then(res => {
            files.value = res.data.data || []
            fileCount.value = files.value?.length || 0
        })
    } catch (error) {
        console.error('휴지통 파일 목록 가져오기 실패:', error)
        files.value = []
        folders.value = []
        fileCount.value = 0
    }
}

onMounted(async () => {
    await getRecycleBinFiles()
})

</script>

<style scoped src="../assets/styles/MainContainer.css"></style>
<style scoped>
/* 휴지통 페이지 추가 스타일 */
.empty-recycle-bin-button {
    background: #ef4444;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;
}

.empty-recycle-bin-button:hover {
    background: #dc2626;
}

.empty-recycle-bin-button svg {
    width: 18px;
    height: 18px;
}

.restore-button {
    background: #10b981;
    color: white;
}

.restore-button:hover {
    background: #059669;
}

.restore-button svg {
    width: 18px;
    height: 18px;
}

/* 파일 목록과 상세정보를 함께 표시하는 레이아웃 */
.content-with-detail {
    display: flex;
    gap: 20px;
    height: 100%;
}

.files-area {
    flex: 1;
    min-width: 0;
}

.files-area.with-detail {
    flex: 0 0 calc(100% - 320px);
}
</style>
