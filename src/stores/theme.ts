import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  // 로컬 스토리지에서 테마 설정 불러오기
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // 시스템 테마 감지
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // 테마 변경 감지 및 저장
  watch(
    isDark,
    (newValue) => {
      localStorage.setItem('theme', newValue ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light')
    },
    { immediate: true },
  )

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
})
