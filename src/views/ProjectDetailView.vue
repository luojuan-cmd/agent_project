<template>
  <div v-if="project" class="min-h-screen bg-space-bg pb-24 lg:pb-0 lg:pl-60">
    <AppHeader :title="'项目详情'" :show-back="true">
      <template #right>
        <router-link
          :to="`/projects/${project.id}/edit`"
          class="p-2 text-star-gray hover:text-nebula-purple transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </router-link>
        <button
          @click="confirmDelete"
          class="p-2 text-star-gray hover:text-status-danger transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </template>
    </AppHeader>

    <main class="px-4 lg:px-6 py-4 space-y-4">
      <!-- Overview Card -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-4">
        <div class="flex items-start justify-between mb-3">
          <h2 class="text-xl font-bold text-star-white leading-snug flex-1 mr-3">{{ project.name }}</h2>
          <span
            class="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold tracking-wider"
            :style="{ backgroundColor: statusColor + '20', color: statusColor }"
          >
            {{ statusLabel }}
          </span>
        </div>

        <!-- Progress -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-star-gray">项目进度</span>
            <span class="font-mono text-lg font-bold bg-gradient-to-r from-nebula-purple to-nebula-indigo bg-clip-text text-transparent">
              {{ project.progress }}%
            </span>
          </div>
          <div class="h-2 bg-space-border rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-800"
              :style="{ width: project.progress + '%', background: 'linear-gradient(90deg, #8b5cf6, #6366f1)' }"
            />
          </div>
        </div>

        <!-- Timeline -->
        <div class="flex items-center gap-3 text-xs">
          <div class="flex items-center gap-1.5">
            <div class="w-2 h-2 rounded-full bg-nebula-purple" />
            <span class="text-star-gray">提出 {{ formatDate(project.proposeDate) }}</span>
          </div>
          <div class="flex-1 h-px bg-gradient-to-r from-nebula-purple/30 to-nebula-indigo/30" />
          <div class="flex items-center gap-1.5">
            <div class="w-2 h-2 rounded-full bg-nebula-indigo" />
            <span class="text-star-gray">截止 {{ formatDate(project.deadlineDate) }}</span>
          </div>
        </div>
      </div>

      <!-- People Card -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-4">
        <h3 class="text-sm font-semibold text-star-white mb-3">项目成员</h3>
        <div class="space-y-3">
          <div v-for="person in peopleList" :key="person.role" class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              :class="person.gradient"
            >
              {{ getInitials(person.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-star-white">{{ person.name }}</p>
              <p class="text-xs text-star-dim">{{ person.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Description Card -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-4">
        <h3 class="text-sm font-semibold text-star-white mb-2">项目描述</h3>
        <p class="text-sm text-star-gray leading-relaxed">{{ project.description }}</p>
      </div>

      <!-- Source & Phase -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-star-dim mb-1">项目来源</p>
            <p class="text-sm font-medium text-star-white">{{ sourceLabel }}</p>
          </div>
          <div>
            <p class="text-xs text-star-dim mb-1">所属板块</p>
            <p class="text-sm font-medium text-star-white">{{ phaseLabel }}</p>
          </div>
        </div>
      </div>

      <!-- Latest Progress -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold text-star-white">最新进度</h3>
          <span class="text-xs text-star-dim">{{ relativeTime(project.updatedAt) }}</span>
        </div>
        <div class="flex items-baseline gap-2 mb-2">
          <span class="font-mono text-4xl font-bold bg-gradient-to-r from-nebula-purple to-nebula-indigo bg-clip-text text-transparent">
            {{ project.progress }}
          </span>
          <span class="text-lg text-star-gray">%</span>
        </div>
        <p class="text-sm text-star-gray leading-relaxed">{{ project.latestProgress }}</p>
      </div>

      <!-- Coordination -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-4">
        <h3 class="text-sm font-semibold text-star-white mb-2">协调事项</h3>
        <div v-if="project.coordination">
          <div class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-status-warning mt-2 flex-shrink-0" />
            <p class="text-sm text-star-gray leading-relaxed">{{ project.coordination }}</p>
          </div>
        </div>
        <div v-else class="text-center py-4">
          <p class="text-sm text-star-dim">暂无待协调事项</p>
        </div>
      </div>

      <!-- Attachments -->
      <div v-if="project.attachments.length > 0" class="bg-space-card border border-star-dim/15 rounded-card p-4">
        <h3 class="text-sm font-semibold text-star-white mb-3">附件</h3>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <div
            v-for="att in project.attachments"
            :key="att.id"
            class="flex-shrink-0 w-40 bg-space-bg rounded-lg border border-star-dim/15 p-3"
          >
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-lg bg-nebula-purple/15 flex items-center justify-center">
                <svg class="w-4 h-4 text-nebula-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-star-white truncate">{{ att.name }}</p>
                <p class="text-[10px] text-star-dim">{{ formatFileSize(att.size) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress History -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-4">
        <h3 class="text-sm font-semibold text-star-white mb-4">进度历史</h3>
        <div class="relative pl-6">
          <div class="absolute left-[7px] top-2 bottom-2 w-px bg-space-border" />
          <div
            v-for="(history, idx) in sortedHistories"
            :key="history.id"
            class="relative mb-4 last:mb-0"
          >
            <div
              class="absolute -left-[19px] top-1 w-3 h-3 rounded-full border-2"
              :class="idx === 0 ? 'bg-nebula-purple border-nebula-purple shadow-glow-sm' : 'bg-space-card border-star-dim'"
            />
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs text-star-dim">{{ formatDate(history.date) }}</span>
              <span class="font-mono text-xs text-nebula-purple">{{ history.progress }}%</span>
            </div>
            <p class="text-sm text-star-gray">{{ history.description }}</p>
            <p class="text-xs text-star-dim mt-0.5">{{ history.updatedBy }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- FAB for progress update -->
    <button
      @click="showProgressModal = true"
      class="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-30 w-14 h-14 rounded-full bg-gradient-to-r from-nebula-purple to-nebula-indigo text-white shadow-lg shadow-nebula-purple/30 flex items-center justify-center hover:scale-105 transition-transform"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </button>

    <BottomNav />

    <!-- Progress Update Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showProgressModal"
          class="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-4"
          @click="showProgressModal = false"
        >
          <div
            class="bg-space-card border border-star-dim/20 rounded-t-2xl lg:rounded-2xl w-full lg:max-w-lg p-6"
            @click.stop
          >
            <h3 class="text-lg font-semibold text-star-white mb-4">更新进度</h3>

            <div class="mb-4">
              <label class="block text-sm text-star-gray mb-2">当前进度: {{ newProgress }}%</label>
              <input
                v-model.number="newProgress"
                type="range"
                min="0"
                max="100"
                step="5"
                class="w-full h-2 bg-space-border rounded-full appearance-none cursor-pointer accent-nebula-purple"
              />
              <div class="flex justify-between text-xs text-star-dim mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-sm text-star-gray mb-2">进度描述</label>
              <textarea
                v-model="progressDescription"
                rows="3"
                placeholder="描述当前阶段完成情况..."
                class="w-full px-4 py-3 rounded-btn bg-space-bg border border-star-dim/20 text-sm text-star-white placeholder-star-dim focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all resize-none"
              />
            </div>

            <div class="flex gap-3">
              <button
                @click="showProgressModal = false"
                class="flex-1 py-3 rounded-btn text-sm font-medium text-star-gray border border-star-dim/30"
              >
                取消
              </button>
              <button
                @click="submitProgress"
                :disabled="submitting"
                class="flex-1 py-3 rounded-btn text-sm font-medium text-white bg-gradient-to-r from-nebula-purple to-nebula-indigo disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ submitting ? '保存中...' : '保存' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projects'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, PROJECT_SOURCE_LABELS, PROJECT_PHASE_LABELS } from '@/types'
import { formatDate, formatFileSize, relativeTime, getAvatarColor, getInitials } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const store = useProjectStore()
const ui = useUIStore()
const auth = useAuthStore()

const showProgressModal = ref(false)
const newProgress = ref(0)
const progressDescription = ref('')
const submitting = ref(false)

const project = computed(() => store.getProjectById(route.params.id as string))

const statusLabel = computed(() => project.value ? PROJECT_STATUS_LABELS[project.value.status] : '')
const statusColor = computed(() => project.value ? PROJECT_STATUS_COLORS[project.value.status] : '')
const sourceLabel = computed(() => project.value ? PROJECT_SOURCE_LABELS[project.value.source] : '')
const phaseLabel = computed(() => project.value ? PROJECT_PHASE_LABELS[project.value.phase] : '')

const peopleList = computed(() => {
  if (!project.value) return []
  return [
    { name: project.value.businessContact, role: '业务对接人', gradient: getAvatarColor(project.value.businessContact) },
    { name: project.value.owner, role: '负责人', gradient: getAvatarColor(project.value.owner) },
    { name: project.value.frontendDev, role: '前端开发', gradient: getAvatarColor(project.value.frontendDev) },
    { name: project.value.backendDev, role: '后端开发', gradient: getAvatarColor(project.value.backendDev) },
  ]
})

const sortedHistories = computed(() => {
  if (!project.value) return []
  return [...project.value.histories].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

function confirmDelete() {
  ui.showConfirm({
    title: '确认删除',
    message: `确定要删除项目「${project.value?.name}」吗？此操作不可撤销。`,
    confirmText: '删除',
    onConfirm: () => {
      if (project.value) {
        store.deleteProject(project.value.id)
        ui.addToast({ type: 'success', message: '项目已删除' })
        router.push('/projects')
      }
    },
  })
}

async function submitProgress() {
  if (!project.value || !progressDescription.value.trim()) {
    ui.addToast({ type: 'warning', message: '请输入进度描述' })
    return
  }
  submitting.value = true
  await new Promise(r => setTimeout(r, 600))
  store.updateProgress(project.value.id, newProgress.value, progressDescription.value)
  ui.addToast({ type: 'success', message: '进度更新成功' })
  showProgressModal.value = false
  progressDescription.value = ''
  submitting.value = false
}
</script>
