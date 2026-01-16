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

                <!-- 전체 파일 (폴더 트리 포함) -->
                <div class="folder-tree">
                    <div class="folder-tree-item" :class="{ 'is-root': true }">
                        <a class="nav-item" :class="{ active: folderTree.id == props.folderId }"
                            @click.prevent="navigateTo(folderTree.id)">
                            <button class="folder-toggle" @click.stop="toggleAllFiles" v-if="!isCollapsed">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    :class="{ 'is-open': isAllFilesExpanded }">
                                    <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </button>
                            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            <span class="nav-label" v-if="!isCollapsed">전체 파일</span>
                        </a>
                    </div>

                    <!-- 하위 폴더 트리 -->
                    <div class="folder-tree-children" v-if="isAllFilesExpanded && !isCollapsed">
                        <FolderTreeItem v-for="folder in folderTree.childFolders" :key="folder.id" :folder="folder"
                            :active-folder-id="props.folderId" @navigate="navigateTo" @toggle="toggleFolder" />
                    </div>
                </div>

                <!-- 나머지 빠른 접근 항목들 -->
                <a v-for="item in otherQuickAccessItems" :key="item.id" :href="item.path" class="nav-item"
                    :class="{ active: currentPath === item.path }" @click.prevent="navigateToMenu(item.path)">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path :d="item.icon" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <span class="nav-label" v-if="!isCollapsed">{{ item.label }}</span>
                    <span class="nav-count" v-if="!isCollapsed && item.count">{{ item.count }}</span>
                </a>
            </div>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { API_CONFIG, getApiUrl } from '@/config/api'
import { useRouter, useRoute } from 'vue-router'
import FolderTreeItem from '@/component/FolderTreeItem.vue'
import { useRecycleBinStore } from '@/stores/recycleBin'

const router = useRouter()
const route = useRoute()
const recycleBinStore = useRecycleBinStore()

interface FolderItem {
    id: number
    folderName: string
    path?: string
    level: number
    fileCount?: number
    childFolders?: FolderItem[]
    isExpanded?: boolean
    hierarchy?: string
    parentFolderId?: number | null
}

const isCollapsed = ref(false)
const usedStorage = ref('15.2 GB')
const totalStorage = ref('50 GB')
const isAllFilesExpanded = ref(true)
const currentPath = ref<string>(route.path.split('?')[0] ?? '')

const storagePercentage = computed(() => {
    const used = parseFloat(usedStorage.value)
    const total = parseFloat(totalStorage.value)
    return (used / total) * 100
})

interface Props {
    folderId?: number
}

const props = withDefaults(defineProps<Props>(), {
    folderId: 0
})

const emit = defineEmits<{
    create: []
}>()

// 전체 파일 외의 빠른 접근 항목들
const otherQuickAccessItems = computed(() => [
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
        path: '/bucket/recycle-bin',
        icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
        count: recycleBinStore.count || null
    }
])

// 폴더 트리 구조 (샘플 데이터)
const folderTree = ref<FolderItem>({
    id: 0,
    folderName: '',
    path: '',
    level: 0,
    fileCount: 0,
    isExpanded: true,
    childFolders: []
})

const getFolderTree = async () => {
    await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.API_FOLDERS_GETTREE),
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`
            }
        }
    ).then(response => {
        folderTree.value = response.data.data
        console.log('폴더 트리 데이터:', folderTree.value)
    })
}

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
}

const createNewFolder = () => {
    emit('create')
}

const toggleAllFiles = () => {
    isAllFilesExpanded.value = !isAllFilesExpanded.value
}

const toggleFolder = (folderId: number) => {
    const toggleRecursive = (folder: FolderItem): boolean => {
        console.log('1 : ', folder.id, ' 2 : ', folderId)
        if (folder.id === folderId) {
            folder.isExpanded = !folder.isExpanded
            return true
        }
        if (folder.childFolders && folder.childFolders.length > 0) {
            for (const child of folder.childFolders) {
                if (toggleRecursive(child)) {
                    return true
                }
            }
        }
        return false
    }
    toggleRecursive(folderTree.value)
}

const navigateTo = (folderId: number) => {
    router.push(`/bucket?folderid=${folderId}`)
}

const navigateToMenu = (path: string) => {
    router.push(path)
}

onMounted(async () => {
    await getFolderTree()
    await recycleBinStore.fetchCount()
})
</script>

<style scoped src="../assets/styles/LnbContainer.css"></style>
