import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/projects',
      name: 'ProjectList',
      component: () => import('@/views/ProjectListView.vue'),
    },
    {
      path: '/projects/:id',
      name: 'ProjectDetail',
      component: () => import('@/views/ProjectDetailView.vue'),
    },
    {
      path: '/projects/:id/edit',
      name: 'ProjectEdit',
      component: () => import('@/views/ProjectFormView.vue'),
    },
    {
      path: '/create',
      name: 'ProjectCreate',
      component: () => import('@/views/ProjectFormView.vue'),
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: () => import('@/views/AnalyticsView.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isLoggedIn) {
    return '/'
  }
  return true
})

export default router
