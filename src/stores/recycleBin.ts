import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { API_CONFIG, getApiUrl } from '@/config/api'

export const useRecycleBinStore = defineStore('recycleBin', () => {
  const count = ref(0)

  const fetchCount = async () => {
    try {
      let folderCount = 0
      let fileCount = 0

      // 삭제된 폴더 개수 가져오기
      const folderResponse = await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.API_FOLDER_GETDELETEDDATA),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
          },
          timeout: API_CONFIG.TIMEOUT,
        },
      )
      folderCount = folderResponse.data.data?.length || 0

      // 삭제된 파일 개수 가져오기
      const fileResponse = await axios.get(
        getApiUrl(API_CONFIG.ENDPOINTS.API_FILES_GETDELETEDDATA),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
          },
          timeout: API_CONFIG.TIMEOUT,
        },
      )
      fileCount = fileResponse.data.data?.length || 0

      count.value = folderCount + fileCount
    } catch (error) {
      console.error('휴지통 항목 수 가져오기 실패:', error)
      count.value = 0
    }
  }

  return { count, fetchCount }
})
