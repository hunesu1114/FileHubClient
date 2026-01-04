<template>
    <div class="login-page">
        <div class="login-container">
            <div class="login-card">
                <!-- 로고 영역 -->
                <div class="logo-section">
                    <div class="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <h1 class="logo-text">FileHub</h1>
                    <p class="logo-subtitle">클라우드 스토리지</p>
                </div>

                <!-- 로그인 폼 -->
                <form class="login-form">
                    <div class="form-group">
                        <label for="email">이메일</label>
                        <input id="email" v-model="email" type="email" placeholder="이메일을 입력하세요" required />
                    </div>

                    <div class="form-group">
                        <label for="password">비밀번호</label>
                        <input id="password" v-model="password" type="password" placeholder="비밀번호를 입력하세요" required />
                    </div>

                    <div class="form-options">
                        <label class="checkbox-label">
                            <input type="checkbox" v-model="rememberMe" />
                            <span>로그인 상태 유지</span>
                        </label>
                        <a href="#" class="forgot-password">비밀번호 찾기</a>
                    </div>

                    <button type="button" class="login-button">
                        로그인
                    </button>

                    <div class="divider">
                        <span>또는</span>
                    </div>

                    <button type="button" class="signup-button" @click="goToSignup">
                        회원가입
                    </button>
                    <button type="button" class="kakao-button" @click="kakaoLogin">
                        Kakao 로그인
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { getApiUrl, API_CONFIG } from '@/config/api'

const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const kakaoLogin = async () => {
    console.log(API_CONFIG.ENDPOINTS.GET_OAUTH_PARAM)
    try {
        const { data } = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.GET_OAUTH_PARAM))
        const restapikey = data.restapikey
        const redirectUri = data.redirectUri
        location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${restapikey}&redirect_uri=${redirectUri}`
    } catch (error) {
        console.error('OAuth 파라미터 조회 실패:', error)
    }
}

const goToSignup = () => {
    console.log('회원가입 페이지로 이동')
    // TODO: 회원가입 페이지로 라우팅
}

onMounted(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
        localStorage.setItem('jwt', token);
        // TOOD : root 폴더로 이동
        await axios(getApiUrl(API_CONFIG.ENDPOINTS.API_FOLDER_GETROOTFOLDERID), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            {
                const rootFolderId = response.data.data;
                router.push({
                    path: '/bucket',
                    query: {
                        folderid: rootFolderId
                    }
                })
            }
        });
    }
})
</script>
<style scoped src="../assets/styles/LoginPage.css"></style>
