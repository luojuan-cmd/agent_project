<template>
  <aside class="hidden lg:flex flex-col w-60 h-screen bg-space-card/60 backdrop-blur-xl border-r border-star-dim/15 fixed left-0 top-0 z-40">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 h-16 border-b border-star-dim/10">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-nebula-purple to-nebula-indigo flex items-center justify-center">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <span class="text-sm font-bold bg-gradient-to-r from-nebula-purple to-nebula-indigo bg-clip-text text-transparent">
        星瀚智库
      </span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 py-4 px-3 space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-all"
        :class="isActive(item.path)
          ? 'text-star-white bg-gradient-to-r from-nebula-purple/20 to-transparent border-l-2 border-nebula-purple'
          : 'text-star-gray hover:text-star-white hover:bg-space-border/50'
        "
      >
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        {{ item.label }}
      </router-link>
    </nav>

    <!-- User -->
    <div class="p-4 border-t border-star-dim/10">
      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white"
          :class="avatarGradient"
        >
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-star-white truncate">{{ auth.currentUser?.name }}</p>
          <p class="text-xs text-star-dim">{{ auth.currentUser?.department }}</p>
        </div>
        <button
          @click="handleLogout"
          class="p-2 text-star-dim hover:text-status-danger transition-colors rounded-lg hover:bg-status-danger/10"
          title="退出登录"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { getAvatarColor, getInitials } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUIStore()

const avatarGradient = computed(() => getAvatarColor(auth.currentUser?.name || ''))
const userInitials = computed(() => getInitials(auth.currentUser?.name || ''))

const navItems = [
  {
    path: '/dashboard',
    label: '管理看板',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' }),
    ]),
  },
  {
    path: '/projects',
    label: '项目列表',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }),
    ]),
  },
  {
    path: '/analytics',
    label: '统计分析',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }),
    ]),
  },
  {
    path: '/create',
    label: '新建项目',
    icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4v16m8-8H4' }),
    ]),
  },
]

function isActive(path: string) {
  if (path === '/projects') {
    return route.path === '/projects' || route.path.startsWith('/projects/')
  }
  return route.path === path
}

function handleLogout() {
  ui.showConfirm({
    title: '确认退出',
    message: '退出后将需要重新登录，是否继续？',
    confirmText: '退出',
    onConfirm: () => {
      auth.logout()
      router.push('/')
    },
  })
}
</script>
