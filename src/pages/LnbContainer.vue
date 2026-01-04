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
                        <a href="/all-files" class="nav-item"
                            :class="{ active: currentPath === '/all-files' }"
                            @click.prevent="navigateTo('/all-files')">
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
                        <div v-for="folder in folderTree" :key="folder.id" class="folder-tree-item"
                            :style="{ paddingLeft: folder.level * 16 + 'px' }">
                            <a :href="folder.path" class="nav-item" :class="{ active: currentPath === folder.path }"
                                @click.prevent="navigateTo(folder.path)">
                                <button class="folder-toggle" @click.stop="toggleFolder(folder.id)"
                                    v-if="folder.children && folder.children.length > 0">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        :class="{ 'is-open': folder.isExpanded }">
                                        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                                <span class="folder-toggle-placeholder" v-else></span>
                                <svg class="nav-icon" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                                <span class="nav-label">{{ folder.name }}</span>
                                <span class="folder-count" v-if="folder.fileCount">{{ folder.fileCount }}</span>
                            </a>

                            <!-- 재귀적으로 자식 폴더 렌더링 -->
                            <div class="folder-tree-children" v-if="folder.isExpanded && folder.children">
                                <div v-for="child in folder.children" :key="child.id" class="folder-tree-item"
                                    :style="{ paddingLeft: child.level * 16 + 'px' }">
                                    <a :href="child.path" class="nav-item"
                                        :class="{ active: currentPath === child.path }"
                                        @click.prevent="navigateTo(child.path)">
                                        <button class="folder-toggle" @click.stop="toggleFolder(child.id)"
                                            v-if="child.children && child.children.length > 0">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                :class="{ 'is-open': child.isExpanded }">
                                                <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2"
                                                    stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </button>
                                        <span class="folder-toggle-placeholder" v-else></span>
                                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                        <span class="nav-label">{{ child.name }}</span>
                                        <span class="folder-count" v-if="child.fileCount">{{ child.fileCount }}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 나머지 빠른 접근 항목들 -->
                <a v-for="item in otherQuickAccessItems" :key="item.id" :href="item.path" class="nav-item"
                    :class="{ active: currentPath === item.path }" @click.prevent="navigateTo(item.path)">
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

interface FolderItem {
    id: number
    name: string
    path: string
    level: number
    fileCount?: number
    children?: FolderItem[]
    isExpanded?: boolean
}

const isCollapsed = ref(false)
const currentPath = ref('/all-files')
const usedStorage = ref('15.2 GB')
const totalStorage = ref('50 GB')
const isAllFilesExpanded = ref(true)

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
const otherQuickAccessItems = ref([
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

// 폴더 트리 구조 (샘플 데이터)
const folderTree = ref<FolderItem[]>([
    {
        id: 101,
        name: '프로젝트',
        path: '/folder/projects',
        level: 1,
        fileCount: 24,
        isExpanded: false,
        children: [
            {
                id: 1011,
                name: 'FileHub',
                path: '/folder/projects/filehub',
                level: 2,
                fileCount: 15,
                isExpanded: false,
                children: [
                    {
                        id: 10111,
                        name: 'Frontend',
                        path: '/folder/projects/filehub/frontend',
                        level: 3,
                        fileCount: 8,
                        isExpanded: false
                    },
                    {
                        id: 10112,
                        name: 'Backend',
                        path: '/folder/projects/filehub/backend',
                        level: 3,
                        fileCount: 7,
                        isExpanded: false
                    }
                ]
            },
            {
                id: 1012,
                name: 'WebApp',
                path: '/folder/projects/webapp',
                level: 2,
                fileCount: 9,
                isExpanded: false
            }
        ]
    },
    {
        id: 102,
        name: '문서',
        path: '/folder/documents',
        level: 1,
        fileCount: 42,
        isExpanded: false,
        children: [
            {
                id: 1021,
                name: '회의록',
                path: '/folder/documents/meetings',
                level: 2,
                fileCount: 18,
                isExpanded: false
            },
            {
                id: 1022,
                name: '제안서',
                path: '/folder/documents/proposals',
                level: 2,
                fileCount: 12,
                isExpanded: false
            },
            {
                id: 1023,
                name: '계약서',
                path: '/folder/documents/contracts',
                level: 2,
                fileCount: 12,
                isExpanded: false
            }
        ]
    },
    {
        id: 103,
        name: '이미지',
        path: '/folder/images',
        level: 1,
        fileCount: 156,
        isExpanded: false,
        children: [
            {
                id: 1031,
                name: '디자인',
                path: '/folder/images/design',
                level: 2,
                fileCount: 89,
                isExpanded: false
            },
            {
                id: 1032,
                name: '사진',
                path: '/folder/images/photos',
                level: 2,
                fileCount: 67,
                isExpanded: false
            }
        ]
    },
    {
        id: 104,
        name: '비디오',
        path: '/folder/videos',
        level: 1,
        fileCount: 28,
        isExpanded: false
    }
])

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
    const toggleRecursive = (folders: FolderItem[]): boolean => {
        for (const folder of folders) {
            if (folder.id === folderId) {
                folder.isExpanded = !folder.isExpanded
                return true
            }
            if (folder.children && toggleRecursive(folder.children)) {
                return true
            }
        }
        return false
    }
    toggleRecursive(folderTree.value)
}

const navigateTo = (path: string) => {
    currentPath.value = path
    console.log('Navigate to:', path)
    // TODO: 라우터 네비게이션
}

onMounted(() => {
    console.log("props.folderId : ", props.folderId);
})
</script>

<style scoped src="../assets/styles/LnbContainer.css"></style>

