<template>
    <div class="main-container">

        <GnbContainer @upload="openUploadPopup" />

        <div class="main-body">
            <LnbContainer @create="openFolderCreatePopup" />

            <main class="content-area">
                <!-- 헤더 영역 -->
                <div class="content-header">
                    <div class="header-left">
                        <div class="title-row">
                            <h1 class="page-title">전체 파일</h1>
                            <div class="breadcrumb-container">
                                <button v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item"
                                    :class="{ 'active': index === breadcrumbs.length - 1 }"
                                    @click="navigateToFolder(crumb.id)">
                                    {{ crumb.name }}
                                </button>
                            </div>
                        </div>
                        <p class="page-subtitle">{{ fileCount }}개의 파일</p>
                    </div>

                    <div class="header-right">
                        <!-- 선택된 항목 액션 버튼 -->
                        <div v-if="selectedItems.size > 0" class="selection-actions">
                            <span class="selection-count">{{ selectedItems.size }}개 선택됨</span>
                            <button class="action-button download-button" @click="handleBulkDownload" title="다운로드">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>다운로드</span>
                            </button>
                            <button class="action-button delete-button" @click="handleBulkDelete" title="삭제">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                                <span>삭제</span>
                            </button>
                            <button class="action-button move-button" @click="handleBulkMove" title="이동">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>이동</span>
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
                            <option value="date">날짜순</option>
                            <option value="size">크기순</option>
                            <option value="type">유형순</option>
                        </select>
                    </div>
                </div>

                <!-- 파일 그리드 뷰 -->
                <div v-if="viewMode === 'grid'" class="file-grid">
                    <!-- 폴더 -->
                    <div v-for="folder in currentFolder.childFolders" :key="folder.id" class="file-card"
                        :class="{ 'selected': selectedItems.has(folder.id) }" @click="openFile(folder)"
                        @dblclick="openFile(folder)">
                        <div class="file-checkbox-wrapper">
                            <input type="checkbox" :id="`folder-${folder.id}`" :checked="selectedItems.has(folder.id)"
                                @click="toggleSelection(folder.id, $event)" class="file-checkbox" />
                            <label :for="`folder-${folder.id}`" class="checkbox-label" @click.stop></label>
                        </div>

                        <div class="file-thumbnail">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>

                        <div class="file-info">
                            <h3 class="file-name">{{ folder.folderName }}</h3>
                            <p class="file-meta">폴더 • {{ folder.createdAt.split(' ')[0] }}</p>
                        </div>

                        <button class="file-menu-button" @click.stop="openFileMenu(folder, $event)">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="1" stroke="currentColor" stroke-width="2" />
                                <circle cx="12" cy="5" r="1" stroke="currentColor" stroke-width="2" />
                                <circle cx="12" cy="19" r="1" stroke="currentColor" stroke-width="2" />
                            </svg>
                        </button>
                    </div>

                    <!-- 파일 -->
                    <div v-for="file in files" :key="file.id" class="file-card"
                        :class="{ 'selected': selectedItems.has(file.id) }" @click="selectFile(file)"
                        @dblclick="openFile(file)">
                        <div class="file-checkbox-wrapper">
                            <input type="checkbox" :id="`file-${file.id}`" :checked="selectedItems.has(file.id)"
                                @click="toggleSelection(file.id, $event)" class="file-checkbox" />
                            <label :for="`file-${file.id}`" class="checkbox-label" @click.stop></label>
                        </div>

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
                            <h3 class="file-name">{{ file.originalFileName }}</h3>
                            <p class="file-meta">{{ formatFileSize(file.size) }} • {{ file.createdAt.split(' ')[0] }}
                            </p>
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
                        <div class="col-date">수정일</div>
                        <div class="col-actions"></div>
                    </div>

                    <!-- 폴더 목록 -->
                    <div v-for="folder in currentFolder.childFolders" :key="folder.id" class="list-item"
                        :class="{ 'selected': selectedItems.has(folder.id) }" @click="openFile(folder)"
                        @dblclick="openFile(folder)">
                        <div class="col-checkbox">
                            <input type="checkbox" :id="`list-folder-${folder.id}`"
                                :checked="selectedItems.has(folder.id)" @click="toggleSelection(folder.id, $event)"
                                class="list-checkbox" />
                            <label :for="`list-folder-${folder.id}`" class="checkbox-label" @click.stop></label>
                        </div>
                        <div class="col-name">
                            <svg class="file-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                                    stroke="currentColor" stroke-width="2" />
                            </svg>
                            <span>{{ folder.folderName }}</span>
                        </div>
                        <div class="col-size">—</div>
                        <div class="col-date">{{ folder.createdAt.split(' ')[0] }}</div>
                        <div class="col-actions">
                            <button class="list-menu-button" @click.stop="openFileMenu(folder, $event)">
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
                        :class="{ 'selected': selectedItems.has(file.id) }" @click="selectFile(file)"
                        @dblclick="openFile(file)">
                        <div class="col-checkbox">
                            <input type="checkbox" :id="`list-file-${file.id}`" :checked="selectedItems.has(file.id)"
                                @click="toggleSelection(file.id, $event)" class="list-checkbox" />
                            <label :for="`list-file-${file.id}`" class="checkbox-label" @click.stop></label>
                        </div>
                        <div class="col-name">
                            <svg class="file-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                                    stroke="currentColor" stroke-width="2" />
                                <polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2" />
                            </svg>
                            <span>{{ file.originalFileName }}</span>
                        </div>
                        <div class="col-size">{{ formatFileSize(file.size) }}</div>
                        <div class="col-date">{{ file.createdAt.split(' ')[0] }}</div>
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
                <div v-if="files?.length === 0" class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <h2>파일이 없습니다</h2>
                    <p>파일을 업로드하거나 폴더를 생성해보세요</p>
                </div>
            </main>

            <UploadPopup v-if="isUploadPopupVisible" :folder-id="currentFolder.id" @close="closeUploadPopup"
                @upload="handleUpload" />
            <FolderCreatePopup v-if="isFolderCreatePopupVisible" @close="closeFolderCreatePopup"
                @create="createFolder" />
            <ConfirmPopup v-if="isConfirmPopupVisible" @confirm="handleConfirm" @cancel="handleCancel"
                :title="confirmTitle" :type="'success'" :showCancelButton="false" :message="confirmMsg" />
            <FileContextMenu :visible="isContextMenuVisible" :x="contextMenuX" :y="contextMenuY"
                :target-item="contextMenuTarget" @close="closeContextMenu" @download="handleDownload"
                @delete="handleDelete" @share="handleShare" @edit="handleEdit" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import GnbContainer from './GnbContainer.vue'
import LnbContainer from './LnbContainer.vue'
import UploadPopup from './UploadPopup.vue'
import ConfirmPopup from '@/component/ConfirmPopup.vue'
import FileContextMenu from '@/component/FileContextMenu.vue'
import axios from 'axios'
import { API_CONFIG, getApiUrl } from '@/config/api'
import FolderCreatePopup from './FolderCreatePopup.vue'
import { useRoute, useRouter } from 'vue-router'

// 타입 정의
interface FileData {
    id: number
    originalFileName: string
    size: number
    createdAt: string
    type?: string
}

interface FolderData {
    id: number
    folderName: string
    createdAt: string
    parentFolderId?: number
    hierarchy?: string
}

interface CurrentFolderData {
    id: number
    folderName: string
    parentFolderId: number
    hierarchy: string
    childFolders: FolderData[]
}

const route = useRoute()
const router = useRouter()
const viewMode = ref<'grid' | 'list'>('grid')
const breadcrumbs = ref<Array<{ id: number; name: string }>>([{ id: 0, name: '내 드라이브' }])
const sortBy = ref('name')
const isUploadPopupVisible = ref(false)
const isConfirmPopupVisible = ref()
const confirmTitle = ref<string>('')
const confirmMsg = ref<string>('')
const files = ref<FileData[]>([])

// 체크박스 선택 관련
const selectedItems = ref<Set<number>>(new Set())

// 컨텍스트 메뉴 관련
const isContextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const contextMenuTarget = ref<FileData | FolderData | null>(null)
const currentFolder = ref<CurrentFolderData>({
    id: 0,
    folderName: '',
    parentFolderId: 0,
    hierarchy: '',
    childFolders: []
})

const fileCount = ref(files.value.length)

/**
 * 파일 크기를 KB, MB, GB 단위로 변환합니다.
 * @param sizeInKB - KB 단위의 파일 크기
 * @returns 포맷된 파일 크기 문자열
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
 * 파일/폴더 선택 (단일 선택)
 */
const selectFile = (file: FileData | FolderData) => {
    console.log('파일 선택:', file)
    // 단일 선택 모드에서는 체크박스를 사용하므로 여기서는 처리하지 않음
}

/**
 * 파일/폴더 열기 (더블클릭)
 */
const openFile = (file: FileData | FolderData) => {
    console.log('파일 열기:', file)
    // 폴더인 경우 해당 폴더로 이동
    if ('folderName' in file) {
        navigateToFolder(file.id)
    } else {
        // TODO: 파일 미리보기 처리
    }
}

/**
 * 컨텍스트 메뉴 열기
 */
const openFileMenu = (file: FileData | FolderData, event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    contextMenuTarget.value = file
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
 * 다운로드 처리
 */
const handleDownload = async (item: FileData | FolderData) => {
    // console.log('다운로드:', item)
    // confirmMsg.value = `"${('originalFileName' in item ? item.originalFileName : item.folderName)}"을(를) 다운로드합니다.`
    // confirmTitle.value = '다운로드'
    // isConfirmPopupVisible.value = true
    await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.API_FILES_DOWNLOAD),
        {
            params: {
                objectId: ('id' in item) ? item.id : null
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            responseType: 'blob',
            timeout: API_CONFIG.TIMEOUT
        }
    ).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', ('originalFileName' in item) ? item.originalFileName : 'download')
        document.body.appendChild(link)
        link.click()
        link.remove()
    }).catch(error => {
        console.error('다운로드 실패:', error)
    })
}

/**
 * 삭제 처리
 */
const handleDelete = (item: FileData | FolderData) => {
    console.log('삭제:', item)
    confirmMsg.value = `"${('originalFileName' in item ? item.originalFileName : item.folderName)}"을(를) 삭제하시겠습니까?`
    confirmTitle.value = '삭제 확인'
    isConfirmPopupVisible.value = true
    // TODO: 실제 삭제 로직 구현
}

/**
 * 공유 처리
 */
const handleShare = (item: FileData | FolderData) => {
    console.log('공유:', item)
    confirmMsg.value = `"${('originalFileName' in item ? item.originalFileName : item.folderName)}"의 공유 링크를 생성합니다.`
    confirmTitle.value = '공유'
    isConfirmPopupVisible.value = true
    // TODO: 실제 공유 로직 구현
}

/**
 * 수정 처리
 */
const handleEdit = (item: FileData | FolderData) => {
    console.log('수정:', item)
    confirmMsg.value = `"${('originalFileName' in item ? item.originalFileName : item.folderName)}"을(를) 수정합니다.`
    confirmTitle.value = '수정'
    isConfirmPopupVisible.value = true
    // TODO: 실제 수정 로직 구현
}

/**
 * 일괄 다운로드 처리
 */
const handleBulkDownload = async () => {
    console.log('일괄 다운로드:', Array.from(selectedItems.value))
    confirmMsg.value = `선택한 ${selectedItems.value.size}개 항목을 다운로드합니다.`
    confirmTitle.value = '일괄 다운로드'
    isConfirmPopupVisible.value = true
    // TODO: 실제 일괄 다운로드 로직 구현
    await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.API_FILES_DOWNLOAD_MULTIPLE),
        {
            params: {
                objectIds: Array.from(selectedItems.value).join(',')
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`, // 필요시 주석 해제
            },
            responseType: 'blob',
            timeout: API_CONFIG.TIMEOUT
        }
    ).then(response => {
        const disposition = response.headers['content-disposition'];
        let filename = 'download.zip';
        if (disposition) {
            // filename*=UTF-8''... 형식 우선 처리
            const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/);
            if (utf8Match) {
                filename = decodeURIComponent(utf8Match[1]);
            }
        }
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
    }).catch(error => {
        console.error('일괄 다운로드 실패:', error)
    })
}

/**
 * 일괄 삭제 처리
 */
const handleBulkDelete = () => {
    console.log('일괄 삭제:', Array.from(selectedItems.value))
    confirmMsg.value = `선택한 ${selectedItems.value.size}개 항목을 삭제하시겠습니까?`
    confirmTitle.value = '일괄 삭제 확인'
    isConfirmPopupVisible.value = true
    // TODO: 실제 일괄 삭제 로직 구현
}

/**
 * 일괄 이동 처리
 */
const handleBulkMove = () => {
    console.log('일괄 이동:', Array.from(selectedItems.value))
    confirmMsg.value = `선택한 ${selectedItems.value.size}개 항목을 이동합니다.`
    confirmTitle.value = '일괄 이동'
    isConfirmPopupVisible.value = true
    // TODO: 실제 일괄 이동 로직 구현 (폴더 선택 팝업 필요)
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
    // TODO: 업로드된 파일 처리 및 파일 목록 갱신
    confirmMsg.value = `${uploadedFiles.length}개의 파일이 업로드되었습니다.`
    confirmTitle.value = '업로드 성공'
    isConfirmPopupVisible.value = true
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
    // TODO: 새 폴더 생성 처리 및 폴더 목록 갱신
    axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.API_FOLDER_CREATE),
        {
            folderName: folderName,
            parentFolderId: Number(currentFolder.value.id) || 0
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`, // 필요시 주석 해제
            },
            timeout: API_CONFIG.TIMEOUT
        }
    ).then(async (response) => {
        console.log('폴더 생성 응답:', response.data)

        // 폴더 목록 갱신
        await getFolderData(currentFolder.value.id)

        confirmMsg.value = `폴더 "${folderName}"이(가) 생성되었습니다.`
        confirmTitle.value = '폴더 생성 성공'
        isConfirmPopupVisible.value = true
    }).catch(error => {
        console.error('폴더 생성 실패:', error)
        confirmMsg.value = `폴더 생성에 실패했습니다: ${error.message}`
        confirmTitle.value = '폴더 생성 실패'
        isConfirmPopupVisible.value = true
    })
    closeFolderCreatePopup()
}

/**
 * 특정 폴더로 이동합니다.
 */
const navigateToFolder = (folderId: number) => {
    router.push({ query: { folderid: folderId } })
}

/**
 * hierarchy 문자열을 파싱하여 breadcrumb 데이터를 생성합니다.
 */
const updateBreadcrumbs = () => {
    const hierarchy = currentFolder.value.hierarchy
    if (!hierarchy) {
        breadcrumbs.value = [{ id: 0, name: '내 드라이브' }]
        return
    }

    // hierarchy는 "내 드라이브>폴더1>폴더2" 형식
    const parts = hierarchy.split('>')
    breadcrumbs.value = parts.map((name, index) => {
        // 첫 번째는 루트 폴더 (id: 0)
        if (index === 0) {
            return { id: 0, name: '내 드라이브' }
        }
        // TODO: 각 폴더의 실제 ID를 가져오려면 추가 정보가 필요
        // 현재는 마지막 폴더만 정확한 ID를 알 수 있음
        if (index === parts.length - 1) {
            return { id: currentFolder.value.id, name }
        }
        // 중간 폴더들은 parentFolderId를 역추적해야 하므로 일단 현재 폴더 ID 사용
        return { id: currentFolder.value.id, name }
    })
}

/**
 * 현재 폴더의 하위 파일을 가져옵니다.
 */
const getObjectsData = async (folderId: number) => {
    console.log('jwt token : ', localStorage.getItem('jwt'))
    try {
        await axios.get(
            getApiUrl(API_CONFIG.ENDPOINTS.API_FILES_GETDATA),
            {
                params: {
                    folderId: folderId
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`, // 필요시 주석 해제
                },
                timeout: API_CONFIG.TIMEOUT
            }
        ).then(res => {
            files.value = res.data.data
            fileCount.value = files.value?.length || 0
        })
    } catch (error) {
        console.error('파일 데이터 가져오기 실패:', error)
    }
}

/**
 * 현재 폴더 정보와, 하위 폴더 목록을 가져옵니다.
 */
const getFolderData = async (folderId: number) => {
    try {
        await axios.get(
            getApiUrl(API_CONFIG.ENDPOINTS.API_FOLDER_GETDATA),
            {
                params: {
                    folderId: folderId
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`, // 필요시 주석 해제
                },
                timeout: API_CONFIG.TIMEOUT
            }
        ).then(response => {
            currentFolder.value = response.data.data
            console.log('폴더 데이터:', currentFolder.value)
            console.log('폴더 데이터(원장):', response.data.data)
            updateBreadcrumbs()
        })
    } catch (error) {
        console.error('폴더 데이터 가져오기 실패:', error)
    }
}

// folderid 쿼리 파라미터 변경 감지
watch(() => route.query.folderid, async (newFolderId) => {
    const folderId = Number(newFolderId) || 0
    selectedItems.value.clear() // 선택 항목 초기화
    await getFolderData(folderId)
    await getObjectsData(folderId)
})

onMounted(async () => {
    const folderId = Number(route.query.folderid) || 0
    await getFolderData(folderId)
    await getObjectsData(folderId)
})

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

.title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
}

.breadcrumb-container {
    display: flex;
    align-items: center;
    gap: 4px;
}

.breadcrumb-item {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    background: transparent;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
}

.breadcrumb-item:not(:last-child)::after {
    content: '>';
    position: absolute;
    right: -6px;
    color: var(--text-tertiary);
    font-weight: 400;
}

.breadcrumb-item:hover:not(.active) {
    background: var(--bg-tertiary);
    color: var(--accent-primary);
}

.breadcrumb-item.active {
    color: var(--text-primary);
    font-weight: 600;
    cursor: default;
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

/* 선택된 항목 액션 버튼 */
.selection-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(76, 110, 245, 0.1);
    border-radius: 8px;
    border: 2px solid var(--accent-primary);
}

.selection-count {
    font-size: 13px;
    font-weight: 600;
    color: var(--accent-primary);
    padding: 0 8px;
    white-space: nowrap;
}

.action-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.action-button svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.action-button:hover {
    border-color: var(--accent-primary);
    background: var(--bg-secondary);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(76, 110, 245, 0.15);
}

.action-button:active {
    transform: translateY(0);
}

.download-button:hover {
    border-color: #4CAF50;
    color: #4CAF50;
}

.download-button:hover svg {
    color: #4CAF50;
}

.delete-button:hover {
    border-color: #f44336;
    color: #f44336;
}

.delete-button:hover svg {
    color: #f44336;
}

.move-button:hover {
    border-color: #FF9800;
    color: #FF9800;
}

.move-button:hover svg {
    color: #FF9800;
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

.file-card.selected {
    border-color: var(--accent-primary);
    background: rgba(76, 110, 245, 0.08);
}

/* 체크박스 래퍼 */
.file-checkbox-wrapper {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 10;
}

.file-checkbox {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.checkbox-label {
    display: block;
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
}

.checkbox-label::after {
    content: '';
    position: absolute;
    display: none;
    left: 5px;
    top: 2px;
    width: 5px;
    height: 9px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.file-checkbox:checked+.checkbox-label {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
}

.file-checkbox:checked+.checkbox-label::after {
    display: block;
}

.file-card:hover .checkbox-label,
.file-card.selected .checkbox-label {
    opacity: 1;
}

.checkbox-label:hover {
    border-color: var(--accent-primary);
    transform: scale(1.1);
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
    grid-template-columns: 40px 1fr 120px 140px 60px;
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
    grid-template-columns: 40px 1fr 120px 140px 60px;
    gap: 16px;
    padding: 16px 32px;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.2s ease;
}

.list-item:hover {
    background: var(--bg-secondary);
}

.list-item.selected {
    background: rgba(76, 110, 245, 0.08);
    border-left: 3px solid var(--accent-primary);
    padding-left: 29px;
}

.col-checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
}

.list-checkbox {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.list-checkbox+.checkbox-label {
    display: block;
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
}

.list-checkbox+.checkbox-label::after {
    content: '';
    position: absolute;
    display: none;
    left: 4px;
    top: 1px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.list-checkbox:checked+.checkbox-label {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
}

.list-checkbox:checked+.checkbox-label::after {
    display: block;
}

.list-item:hover .checkbox-label,
.list-item.selected .checkbox-label {
    opacity: 1;
}

.list-checkbox+.checkbox-label:hover {
    border-color: var(--accent-primary);
    transform: scale(1.1);
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
        flex-wrap: wrap;
    }

    .selection-actions {
        width: 100%;
        margin-bottom: 8px;
        justify-content: space-between;
    }

    .action-button span {
        display: none;
    }

    .action-button {
        padding: 8px;
    }

    .selection-count {
        padding: 0 4px;
        font-size: 12px;
    }

    .file-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 16px;
        padding: 20px;
    }

    .list-header,
    .list-item {
        grid-template-columns: 40px 1fr 80px 60px;
        padding: 12px 20px;
    }

    .list-item.selected {
        padding-left: 17px;
    }

    .col-date {
        display: none;
    }
}
</style>
