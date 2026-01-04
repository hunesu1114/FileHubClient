<template>
    <div>
        <div class="folder-tree-item" :style="{ paddingLeft: (folder.level - 1) * 16 + 'px' }">
            <div class="nav-item" :class="{ active: activeFolderId === folder.id }">
                <button class="folder-toggle" @click.stop="toggleExpand"
                    v-if="folder.childFolders && folder.childFolders.length > 0">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        :class="{ 'is-open': isExpanded }">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
                <span class="folder-toggle-placeholder" v-else></span>
                <a :href="`/bucket?folderid=${folder.id}`" class="folder-link"
                    @click.prevent="$emit('navigate', folder.id)">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span class="nav-label">{{ folder.folderName }}</span>
                    <span class="folder-count" v-if="folder.fileCount">{{ folder.fileCount }}</span>
                </a>
            </div>
        </div>

        <!-- 재귀적으로 자식 폴더 렌더링 -->
        <div class="folder-tree-children" v-if="isExpanded && folder.childFolders && folder.childFolders.length > 0">
            <FolderTreeItem v-for="child in folder.childFolders" :key="child.id" :folder="child"
                :active-folder-id="activeFolderId" @navigate="$emit('navigate', $event)"
                @toggle="$emit('toggle', $event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface FolderItem {
    id: number
    folderName: string
    path?: string
    level: number
    fileCount?: number
    childFolders?: FolderItem[]
    isExpanded?: boolean
    hierarchy?: string
}

const props = defineProps<{
    folder: FolderItem
    activeFolderId: number
}>()

const emit = defineEmits<{
    navigate: [folderId: number]
    toggle: [folderId: number]
}>()

const isExpanded = ref(props.folder.isExpanded ?? false)

// folder.isExpanded가 변경되면 isExpanded도 업데이트
watch(() => props.folder.isExpanded, (newVal) => {
    isExpanded.value = newVal ?? false
})

const toggleExpand = () => {
    emit('toggle', props.folder.id)
}

console.log('folder:', props.folder)
</script>

<style scoped src="../assets/styles/LnbContainer.css"></style>
