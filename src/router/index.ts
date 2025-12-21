import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/',
      name: 'main',
      component: () => import('@/pages/MainContainer.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/all-files',
      name: 'all-files',
      component: () => import('@/pages/MainContainer.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/recent',
      name: 'recent',
      component: () => import('@/pages/MainContainer.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/pages/MainContainer.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/shared',
      name: 'shared',
      component: () => import('@/pages/MainContainer.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/trash',
      name: 'trash',
      component: () => import('@/pages/MainContainer.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/folder/:id',
      name: 'folder',
      component: () => import('@/pages/MainContainer.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    // 404 페이지
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// 라우터 가드 - 인증 체크
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     // 인증이 필요한 페이지인데 로그인하지 않은 경우
//     next('/login')
//   } else if (to.path === '/login' && isAuthenticated) {
//     // 이미 로그인한 상태에서 로그인 페이지 접근 시
//     next('/')
//   } else {
//     next()
//   }
// })

export default router
