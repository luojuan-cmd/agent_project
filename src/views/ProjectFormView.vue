<template>
  <div class="min-h-screen bg-space-bg pb-24 lg:pb-0 lg:pl-60">
    <AppHeader :title="isEdit ? '编辑项目' : '新建项目'" :show-back="true">
      <template #right>
        <button
          @click="handleSubmit"
          :disabled="saving"
          class="text-sm font-medium text-nebula-purple hover:text-nebula-indigo transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ saving ? '保存中' : '保存' }}
        </button>
      </template>
    </AppHeader>

    <main class="px-4 lg:px-6 py-4 max-w-3xl">
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Phase -->
        <div>
          <label class="block text-sm text-star-gray mb-2">项目板块 <span class="text-status-danger">*</span></label>
          <select
            v-model="form.phase"
            class="w-full h-12 px-4 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all appearance-none"
            :class="errors.phase ? 'border-status-danger' : ''"
          >
            <option value="" disabled class="bg-space-card">请选择板块</option>
            <option v-for="[key, label] in phaseOptions" :key="key" :value="key" class="bg-space-card">
              {{ label }}
            </option>
          </select>
          <p v-if="errors.phase" class="text-xs text-status-danger mt-1">{{ errors.phase }}</p>
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm text-star-gray mb-2">项目名称 <span class="text-status-danger">*</span></label>
          <input
            v-model="form.name"
            type="text"
            placeholder="请输入项目名称（2-50字）"
            maxlength="50"
            class="w-full h-12 px-4 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white placeholder-star-dim focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all"
            :class="errors.name ? 'border-status-danger' : ''"
          />
          <p v-if="errors.name" class="text-xs text-status-danger mt-1">{{ errors.name }}</p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm text-star-gray mb-2">项目描述 <span class="text-status-danger">*</span></label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="简要描述项目背景与目标..."
            class="w-full px-4 py-3 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white placeholder-star-dim focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all resize-none"
            :class="errors.description ? 'border-status-danger' : ''"
          />
          <p v-if="errors.description" class="text-xs text-status-danger mt-1">{{ errors.description }}</p>
        </div>

        <!-- Source -->
        <div>
          <label class="block text-sm text-star-gray mb-2">项目来源 <span class="text-status-danger">*</span></label>
          <select
            v-model="form.source"
            class="w-full h-12 px-4 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all appearance-none"
          >
            <option value="" disabled class="bg-space-card">请选择来源</option>
            <option v-for="[key, label] in sourceOptions" :key="key" :value="key" class="bg-space-card">
              {{ label }}
            </option>
          </select>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-star-gray mb-2">提出日期 <span class="text-status-danger">*</span></label>
            <input
              v-model="form.proposeDate"
              type="date"
              class="w-full h-12 px-4 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm text-star-gray mb-2">要求日期 <span class="text-status-danger">*</span></label>
            <input
              v-model="form.deadlineDate"
              type="date"
              class="w-full h-12 px-4 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all"
            />
          </div>
        </div>

        <!-- People -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-star-gray mb-2">业务对接人 <span class="text-status-danger">*</span></label>
            <input
              v-model="form.businessContact"
              type="text"
              placeholder="对接人姓名"
              class="w-full h-12 px-4 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white placeholder-star-dim focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm text-star-gray mb-2">负责人 <span class="text-status-danger">*</span></label>
            <input
              v-model="form.owner"
              type="text"
              placeholder="负责人姓名"
              class="w-full h-12 px-4 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white placeholder-star-dim focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-star-gray mb-2">前端开发人员</label>
            <input
              v-model="form.frontendDev"
              type="text"
              placeholder="前端开发姓名"
              class="w-full h-12 px-4 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white placeholder-star-dim focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm text-star-gray mb-2">后端开发人员</label>
            <input
              v-model="form.backendDev"
              type="text"
              placeholder="后端开发姓名"
              class="w-full h-12 px-4 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white placeholder-star-dim focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all"
            />
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm text-star-gray mb-2">项目状态</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="[key, label] in statusOptions"
              :key="key"
              type="button"
              @click="form.status = key as any"
              class="flex-1 min-w-[80px] py-2.5 rounded-btn text-xs font-medium transition-all"
              :class="form.status === key
                ? 'text-white bg-gradient-to-r from-nebula-purple to-nebula-indigo shadow-lg shadow-nebula-purple/20'
                : 'text-star-dim bg-space-card border border-star-dim/20 hover:text-star-gray'
              "
            >
              {{ label }}
            </button>
          </div>
        </div>

        <!-- Progress -->
        <div>
          <label class="block text-sm text-star-gray mb-2">当前进度: {{ form.progress }}%</label>
          <input
            v-model.number="form.progress"
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

        <!-- Latest Progress -->
        <div>
          <label class="block text-sm text-star-gray mb-2">最新进度简述</label>
          <textarea
            v-model="form.latestProgress"
            rows="3"
            placeholder="描述当前阶段完成情况..."
            class="w-full px-4 py-3 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white placeholder-star-dim focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all resize-none"
          />
        </div>

        <!-- Coordination -->
        <div>
          <label class="block text-sm text-star-gray mb-2">需协调事宜</label>
          <textarea
            v-model="form.coordination"
            rows="3"
            placeholder="需要协调支持的事项..."
            class="w-full px-4 py-3 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white placeholder-star-dim focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all resize-none"
          />
        </div>

        <!-- Attachments -->
        <div>
          <label class="block text-sm text-star-gray mb-2">附件</label>
          <div
            class="border-2 border-dashed border-star-dim/30 rounded-card p-6 text-center hover:border-nebula-purple/40 transition-colors cursor-pointer"
            @click="triggerFileUpload"
          >
            <svg class="w-8 h-8 text-star-dim mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="text-sm text-star-gray">点击上传文件</p>
            <p class="text-xs text-star-dim mt-1">支持 PDF / Word / Excel / 图片，最多5个</p>
          </div>
          <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileChange" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
          <!-- File list -->
          <div v-if="form.attachments.length > 0" class="mt-3 space-y-2">
            <div
              v-for="(file, idx) in form.attachments"
              :key="file.id"
              class="flex items-center gap-3 bg-space-bg rounded-lg p-3"
            >
              <div class="w-8 h-8 rounded-lg bg-nebula-purple/15 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-nebula-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-star-white truncate">{{ file.name }}</p>
                <p class="text-[10px] text-star-dim">{{ formatFileSize(file.size) }}</p>
              </div>
              <button
                type="button"
                @click="removeAttachment(idx)"
                class="p-1 text-star-dim hover:text-status-danger transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="saving"
            class="w-full h-12 rounded-btn text-sm font-semibold text-white bg-gradient-to-r from-nebula-purple to-nebula-indigo hover:opacity-90 transition-all shadow-lg shadow-nebula-purple/20 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ saving ? '保存中...' : (isEdit ? '保存修改' : '创建项目') }}
          </button>
        </div>
      </form>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projects'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import {
  PROJECT_PHASE_LABELS,
  PROJECT_SOURCE_LABELS,
  PROJECT_STATUS_LABELS,
} from '@/types'
import type { ProjectPhase, ProjectSource, ProjectStatus } from '@/types'
import { formatFileSize } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const store = useProjectStore()
const ui = useUIStore()
const auth = useAuthStore()

const isEdit = computed(() => route.name === 'ProjectEdit')
const projectId = computed(() => route.params.id as string)

const phaseOptions = Object.entries(PROJECT_PHASE_LABELS) as [ProjectPhase, string][]
const sourceOptions = Object.entries(PROJECT_SOURCE_LABELS) as [ProjectSource, string][]
const statusOptions = Object.entries(PROJECT_STATUS_LABELS) as [ProjectStatus, string][]

const fileInput = ref<HTMLInputElement>()
const saving = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  phase: '' as ProjectPhase | '',
  name: '',
  description: '',
  source: '' as ProjectSource | '',
  proposeDate: new Date().toISOString().split('T')[0],
  deadlineDate: '',
  businessContact: '',
  owner: '',
  frontendDev: '',
  backendDev: '',
  status: 'pending' as ProjectStatus,
  progress: 0,
  latestProgress: '',
  coordination: '',
  attachments: [] as { id: string; name: string; size: number; type: string; url: string; uploadedAt: string }[],
})

onMounted(() => {
  if (isEdit.value && projectId.value) {
    const project = store.getProjectById(projectId.value)
    if (project) {
      form.value = {
        phase: project.phase,
        name: project.name,
        description: project.description,
        source: project.source,
        proposeDate: project.proposeDate,
        deadlineDate: project.deadlineDate,
        businessContact: project.businessContact,
        owner: project.owner,
        frontendDev: project.frontendDev,
        backendDev: project.backendDev,
        status: project.status,
        progress: project.progress,
        latestProgress: project.latestProgress,
        coordination: project.coordination,
        attachments: [...project.attachments],
      }
    }
  }
})

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files) return

  if (form.value.attachments.length + files.length > 5) {
    ui.addToast({ type: 'warning', message: '最多只能上传5个文件' })
    return
  }

  for (const file of files) {
    if (file.size > 50 * 1024 * 1024) {
      ui.addToast({ type: 'warning', message: `${file.name} 超过50MB限制` })
      continue
    }
    form.value.attachments.push({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: '#',
      uploadedAt: new Date().toISOString(),
    })
  }
  target.value = ''
}

function removeAttachment(idx: number) {
  form.value.attachments.splice(idx, 1)
}

function validate(): boolean {
  errors.value = {}
  if (!form.value.phase) errors.value.phase = '请选择项目板块'
  if (!form.value.name.trim() || form.value.name.length < 2) errors.value.name = '项目名称至少2个字'
  if (!form.value.description.trim()) errors.value.description = '请输入项目描述'
  if (!form.value.proposeDate) errors.value.proposeDate = '请选择提出日期'
  if (!form.value.deadlineDate) errors.value.deadlineDate = '请选择要求日期'
  if (!form.value.businessContact.trim()) errors.value.businessContact = '请输入业务对接人'
  if (!form.value.owner.trim()) errors.value.owner = '请输入负责人'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) {
    ui.addToast({ type: 'warning', message: '请完善必填项' })
    return
  }

  saving.value = true
  await new Promise(r => setTimeout(r, 800))

  const proposeDate = form.value.proposeDate || new Date().toISOString().split('T')[0] || '2026-04-29'
  const deadlineDate = form.value.deadlineDate || proposeDate

  const data = {
    phase: form.value.phase as ProjectPhase,
    name: form.value.name.trim(),
    description: form.value.description.trim(),
    source: form.value.source as ProjectSource,
    proposeDate: proposeDate,
    deadlineDate: deadlineDate,
    businessContact: form.value.businessContact.trim(),
    owner: form.value.owner.trim(),
    frontendDev: form.value.frontendDev.trim(),
    backendDev: form.value.backendDev.trim(),
    status: form.value.status,
    progress: form.value.progress,
    latestProgress: form.value.latestProgress.trim(),
    coordination: form.value.coordination.trim(),
  }

  if (isEdit.value) {
    store.updateProject(projectId.value, data)
    ui.addToast({ type: 'success', message: '项目更新成功' })
    router.push(`/projects/${projectId.value}`)
  } else {
    const newProject = store.addProject(data)
    ui.addToast({ type: 'success', message: '项目创建成功' })
    router.push(`/projects/${newProject.id}`)
  }

  saving.value = false
}
</script>
