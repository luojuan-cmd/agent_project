<template>
  <div class="min-h-screen bg-space-bg pb-20 lg:pb-0 lg:pl-60">
    <AppHeader title="我的" />

    <main class="px-4 lg:px-6 py-4 space-y-4">
      <!-- User Card -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-6 text-center">
        <div
          class="w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-glow"
          :class="avatarGradient"
        >
          {{ userInitials }}
        </div>
        <h2 class="text-xl font-bold text-star-white mb-1">{{ auth.currentUser?.name }}</h2>
        <p class="text-sm text-star-gray mb-1">{{ auth.currentUser?.department }}</p>
        <span
          class="inline-block px-3 py-1 rounded-full text-xs font-medium"
          :class="auth.isAdmin
            ? 'bg-nebula-purple/15 text-nebula-purple'
            : 'bg-nebula-indigo/15 text-nebula-indigo'
          "
        >
          {{ auth.isAdmin ? '管理员' : '员工' }}
        </span>
      </div>

      <!-- My Stats -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-space-card border border-star-dim/15 rounded-card p-4 text-center">
          <p class="font-mono text-xl font-bold text-star-white mb-1">{{ myProjects.length }}</p>
          <p class="text-xs text-star-gray">我的项目</p>
        </div>
        <div class="bg-space-card border border-star-dim/15 rounded-card p-4 text-center">
          <p class="font-mono text-xl font-bold text-nebula-purple mb-1">{{ myInProgress.length }}</p>
          <p class="text-xs text-star-gray">进行中</p>
        </div>
        <div class="bg-space-card border border-star-dim/15 rounded-card p-4 text-center">
          <p class="font-mono text-xl font-bold text-status-success mb-1">{{ myCompleted.length }}</p>
          <p class="text-xs text-star-gray">已完成</p>
        </div>
      </div>

      <!-- My Projects -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-4">
        <h3 class="text-sm font-semibold text-star-white mb-3">我的项目</h3>
        <div class="space-y-3">
          <div
            v-for="project in myProjects.slice(0, 5)"
            :key="project.id"
            class="flex items-center gap-3 p-3 bg-space-bg rounded-lg cursor-pointer hover:bg-space-border/30 transition-colors"
            @click="router.push(`/projects/${project.id}`)"
          >
            <div
              class="w-1 h-10 rounded-full flex-shrink-0"
              :style="{ backgroundColor: statusColors[project.status] }"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-star-white truncate">{{ project.name }}</p>
              <div class="flex items-center gap-2 mt-1">
                <div class="w-16 h-1 bg-space-border rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :style="{ width: project.progress + '%', background: 'linear-gradient(90deg, #8b5cf6, #6366f1)' }"
                  />
                </div>
                <span class="font-mono text-[10px] text-star-gray">{{ project.progress }}%</span>
              </div>
            </div>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0"
              :style="{ backgroundColor: statusColors[project.status] + '20', color: statusColors[project.status] }"
            >
              {{ statusLabels[project.status] }}
            </span>
          </div>
        </div>
        <div v-if="myProjects.length === 0" class="text-center py-6">
          <p class="text-sm text-star-dim">暂无项目</p>
        </div>
      </div>

      <!-- Settings -->
      <div class="bg-space-card border border-star-dim/15 rounded-card divide-y divide-star-dim/10">
        <button
          class="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-space-bg/50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-nebula-purple/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-nebula-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span class="text-sm text-star-white">通知设置</span>
          </div>
          <svg class="w-4 h-4 text-star-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          class="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-space-bg/50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-nebula-indigo/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-nebula-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span class="text-sm text-star-white">修改密码</span>
          </div>
          <svg class="w-4 h-4 text-star-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          @click="handleLogout"
          class="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-status-danger/5 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-status-danger/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-status-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span class="text-sm text-status-danger">退出登录</span>
          </div>
        </button>
      </div>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/projects'
import { useUIStore } from '@/stores/ui'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '@/types'
import { getAvatarColor, getInitials } from '@/utils/format'

const router = useRouter()
const auth = useAuthStore()
const store = useProjectStore()
const ui = useUIStore()

const statusLabels = PROJECT_STATUS_LABELS
const statusColors = PROJECT_STATUS_COLORS

const avatarGradient = computed(() => getAvatarColor(auth.currentUser?.name || ''))
const userInitials = computed(() => getInitials(auth.currentUser?.name || ''))

const myProjects = computed(() => {
  const name = auth.currentUser?.name || ''
  return store.projects.filter(p =>
    p.owner === name ||
    p.frontendDev === name ||
    p.backendDev === name ||
    p.businessContact === name
  )
})

const myInProgress = computed(() =>
  myProjects.value.filter(p => p.status === 'developing' || p.status === 'testing')
)

const myCompleted = computed(() =>
  myProjects.value.filter(p => p.status === 'deployed')
)

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
