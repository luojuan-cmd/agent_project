import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserRole } from '@/types'
import { mockUsers } from '@/data/projects'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  const login = (username: string, password: string, role: UserRole): boolean => {
    const found = mockUsers.find(u => u.name === username)
    if (found) {
      currentUser.value = { ...found, role }
      return true
    }
    // 默认登录
    currentUser.value = {
      id: 'u0',
      name: username || '用户',
      avatar: '',
      role,
      department: '研发部',
    }
    return true
  }

  const logout = () => {
    currentUser.value = null
  }

  return {
    currentUser,
    isLoggedIn,
    isAdmin,
    login,
    logout,
  }
})
