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
        router.push('/bucket');
    }
});
</script>

<style scoped>
.login-page {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%);
    padding: 20px;
}

.login-container {
    width: 100%;
    max-width: 420px;
}

.login-card {
    background: var(--bg-secondary);
    border-radius: 16px;
    padding: 48px 40px;
    box-shadow: var(--shadow-lg);
    border: 2px solid var(--border-color);
    transition: all 0.3s ease;
}

.login-card:hover {
    border-color: var(--accent-primary);
    box-shadow: 0 12px 28px rgba(76, 110, 245, 0.15);
}

/* 로고 영역 */
.logo-section {
    text-align: center;
    margin-bottom: 40px;
}

.logo-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    color: var(--accent-primary);
    animation: float 3s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.logo-icon svg {
    width: 100%;
    height: 100%;
}

.logo-text {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.logo-subtitle {
    font-size: 14px;
    color: var(--text-tertiary);
    font-weight: 500;
}

/* 폼 스타일 */
.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: all 0.2s ease;
}

.form-group input:focus {
    border-color: var(--accent-primary);
    background: var(--bg-secondary);
    box-shadow: 0 0 0 4px rgba(76, 110, 245, 0.1);
}

.form-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -8px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-secondary);
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--accent-primary);
}

.forgot-password {
    font-size: 14px;
    color: var(--accent-primary);
    font-weight: 500;
}

.forgot-password:hover {
    text-decoration: underline;
}

.login-button {
    width: 100%;
    padding: 14px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff !important;
    background: #4c6ef5;
    border: 2px solid #4c6ef5;
    border-radius: 8px;
    margin-top: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.login-button:hover {
    background: #364fc7;
    color: #ffffff !important;
    border-color: #364fc7;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 110, 245, 0.3);
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 24px 0;
    color: var(--text-tertiary);
    font-size: 14px;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--border-color);
}

.divider span {
    padding: 0 16px;
}

.signup-button {
    width: 100%;
    padding: 14px;
    font-size: 16px;
    font-weight: 600;
    color: var(--accent-primary);
    background: transparent;
    border: 2px solid var(--accent-primary);
    border-radius: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.signup-button:hover {
    background: rgba(76, 110, 245, 0.1);
    color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 110, 245, 0.2);
}

.kakao-button {
    width: 100%;
    padding: 14px;
    font-size: 16px;
    font-weight: 600;
    color: #3c1e1e;
    background: #FEE500;
    border: 2px solid #FEE500;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.kakao-button:hover {
    background: #fdd835;
    border-color: #fdd835;
    color: #3c1e1e;
}

@media (max-width: 480px) {
    .login-card {
        padding: 32px 24px;
    }
}
</style>
