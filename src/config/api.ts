// API 설정
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  ENDPOINTS: {
    UPLOAD: '/files/upload',
    FILES: '/files',
    GET_OAUTH_PARAM: '/getOAuthParam',
    API_FILES_GETDATA: '/files/getData',
    API_FILES_DOWNLOAD: '/files/download',
    API_FILES_DOWNLOAD_MULTIPLE: '/files/download/multiple',
    API_FILES_DELETE: '/files/delete',
    API_FILES_GETDELETEDDATA: '/files/getDeletedData',
    API_FILES_GETISDUPLICATEDFILENAME: '/files/getDuplicatedFileName',
    API_FILES_RESTORE: '/files/restore',
    API_FOLDER_CREATE: '/folder/create',
    API_FOLDER_GETDATA: '/folder/getData',
    API_FOLDER_GETROOTFOLDERID: '/folder/getRootFolderId',
    API_FOLDERS_GETTREE: '/folder/getTree',
    API_FOLDER_DELETE: '/folder/delete',
    API_FOLDER_GETDELETEDDATA: '/folder/getDeletedData',
  },
  TIMEOUT: 30000, // 30초
} as const

// API 호스트 URL 가져오기
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
