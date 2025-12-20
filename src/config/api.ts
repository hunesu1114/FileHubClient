// API 설정
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    ENDPOINTS: {
        UPLOAD: '/files/upload',
        FILES: '/files',
        FOLDERS: '/folders',
    },
    TIMEOUT: 30000, // 30초
} as const

// API 호스트 URL 가져오기
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`
}
