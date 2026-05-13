<template>
  <div class="min-h-screen bg-space-bg flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-br from-space-bg via-space-bg to-nebula-purple/20" />
      <!-- Animated particles -->
      <div class="absolute inset-0">
        <div
          v-for="i in 30"
          :key="i"
          class="absolute rounded-full animate-pulse"
          :style="particleStyle(i)"
        />
      </div>
    </div>

    <!-- Glass Panel -->
    <div
      class="relative z-10 w-full max-w-[420px] rounded-[20px] p-8"
      style="background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(139, 92, 246, 0.12); box-shadow: 0 0 60px rgba(139, 92, 246, 0.1);"
    >
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-nebula-purple to-nebula-indigo flex items-center justify-center mx-auto mb-4 shadow-glow">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold bg-gradient-to-r from-nebula-purple to-nebula-indigo bg-clip-text text-transparent tracking-wider">
          星瀚项目智库
        </h1>
        <p class="text-xs text-star-gray mt-2">数字化项目全生命周期管理平台</p>
      </div>

      <!-- Role Tabs -->
      <div class="flex gap-2 mb-6 p-1 bg-space-bg/80 rounded-btn">
        <button
          v-for="r in roles"
          :key="r.value"
          @click="role = r.value"
          class="flex-1 py-2.5 rounded-btn text-sm font-medium transition-all"
          :class="role === r.value
            ? 'text-star-white bg-gradient-to-r from-nebula-purple to-nebula-indigo shadow-lg shadow-nebula-purple/30'
            : 'text-star-dim hover:text-star-gray'
          "
        >
          {{ r.label }}
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-star-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <input
            v-model="username"
            type="text"
            placeholder="请输入工号或姓名"
            class="w-full h-12 pl-11 pr-4 rounded-btn bg-space-bg/80 border border-star-dim/30 text-star-white placeholder-star-dim text-sm focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] outline-none transition-all"
          />
        </div>

        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-star-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            class="w-full h-12 pl-11 pr-11 rounded-btn bg-space-bg/80 border border-star-dim/30 text-star-white placeholder-star-dim text-sm focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] outline-none transition-all"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-star-dim hover:text-star-gray transition-colors"
          >
            <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.574-2.9m3.1-3.1C8.2 5.55 10.05 5 12 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.023 3.582M9 9l3 3m-3 3l6-6" />
            </svg>
          </button>
        </div>

        <button
          type="submit"
          :disabled="loggingIn"
          class="w-full h-12 rounded-btn text-sm font-semibold text-white bg-gradient-to-r from-nebula-purple to-nebula-indigo hover:opacity-90 transition-all shadow-lg shadow-nebula-purple/20 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <svg v-if="loggingIn" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>{{ loggingIn ? '登录中...' : '登 录' }}</span>
        </button>
      </form>

      <p class="text-center text-xs text-star-dim mt-4">首次登录请使用初始密码：123456</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import type { UserRole } from '@/types'

const router = useRouter()
const auth = useAuthStore()
const ui = useUIStore()

const username = ref('')
const password = ref('')
const role = ref<UserRole>('employee')
const showPassword = ref(false)
const loggingIn = ref(false)

const roles = [
  { value: 'employee' as UserRole, label: '我是员工' },
  { value: 'admin' as UserRole, label: '我是管理员' },
]

function particleStyle(i: number) {
  const size = 2 + (i % 4)
  const left = ((i * 37) % 100)
  const top = ((i * 53) % 100)
  const delay = (i % 5) * 0.5
  const duration = 2 + (i % 3)
  const colors = ['rgba(139, 92, 246, 0.3)', 'rgba(99, 102, 241, 0.25)', 'rgba(139, 92, 246, 0.12)']
  const color = colors[i % colors.length]
  return {
    width: size + 'px',
    height: size + 'px',
    left: left + '%',
    top: top + '%',
    backgroundColor: color,
    animationDelay: delay + 's',
    animationDuration: duration + 's',
  }
}

async function handleLogin() {
  if (!username.value.trim()) {
    ui.addToast({ type: 'warning', message: '请输入工号或姓名' })
    return
  }
  loggingIn.value = true
  await new Promise(r => setTimeout(r, 800))
  const success = auth.login(username.value, password.value, role.value)
  if (success) {
    ui.addToast({ type: 'success', message: '登录成功' })
    router.push(role.value === 'admin' ? '/dashboard' : '/projects')
  }
  loggingIn.value = false
}
</script>
