<template>
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
        v-if="ui.showFilterPanel"
        class="fixed inset-0 z-[9997] bg-black/60 backdrop-blur-sm lg:hidden"
        @click="ui.showFilterPanel = false"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="ui.showFilterPanel"
        class="fixed bottom-0 left-0 right-0 z-[9998] bg-space-card rounded-t-2xl p-5 lg:hidden max-h-[70vh] overflow-y-auto"
      >
        <div class="w-10 h-1 bg-star-dim/30 rounded-full mx-auto mb-5" />

        <!-- Status -->
        <div class="mb-5">
          <h4 class="text-sm font-semibold text-star-white mb-3">项目状态</h4>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="[key, label] in statusOptions"
              :key="key"
              @click="toggleStatus(key)"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              :class="store.filterStatus === key
                ? 'text-white bg-gradient-to-r from-nebula-purple to-nebula-indigo'
                : 'text-star-gray bg-space-border hover:text-star-white'
              "
            >
              {{ label }}
            </button>
          </div>
        </div>

        <!-- Phase -->
        <div class="mb-5">
          <h4 class="text-sm font-semibold text-star-white mb-3">项目板块</h4>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="[key, label] in phaseOptions"
              :key="key"
              @click="togglePhase(key)"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              :class="store.filterPhase === key
                ? 'text-white bg-gradient-to-r from-nebula-purple to-nebula-indigo'
                : 'text-star-gray bg-space-border hover:text-star-white'
              "
            >
              {{ label }}
            </button>
          </div>
        </div>

        <!-- Sort -->
        <div class="mb-5">
          <h4 class="text-sm font-semibold text-star-white mb-3">排序方式</h4>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in sortOptions"
              :key="opt.value"
              @click="store.sortBy = opt.value"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              :class="store.sortBy === opt.value
                ? 'text-white bg-gradient-to-r from-nebula-purple to-nebula-indigo'
                : 'text-star-gray bg-space-border hover:text-star-white'
              "
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="resetFilters"
            class="flex-1 py-3 rounded-btn text-sm font-medium text-star-gray border border-star-dim/30 hover:border-star-dim/50 transition-colors"
          >
            重置
          </button>
          <button
            @click="ui.showFilterPanel = false"
            class="flex-1 py-3 rounded-btn text-sm font-medium text-white bg-gradient-to-r from-nebula-purple to-nebula-indigo"
          >
            确定
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/projects'
import { useUIStore } from '@/stores/ui'
import { PROJECT_STATUS_LABELS, PROJECT_PHASE_LABELS } from '@/types'

const store = useProjectStore()
const ui = useUIStore()

const statusOptions = Object.entries(PROJECT_STATUS_LABELS) as [string, string][]
const phaseOptions = Object.entries(PROJECT_PHASE_LABELS) as [string, string][]

const sortOptions = [
  { value: 'updated' as const, label: '最近更新' },
  { value: 'progress' as const, label: '进度优先' },
  { value: 'deadline' as const, label: '截止日期' },
]

function toggleStatus(key: string) {
  store.filterStatus = store.filterStatus === key ? 'all' : key as any
}

function togglePhase(key: string) {
  store.filterPhase = store.filterPhase === key ? 'all' : key as any
}

function resetFilters() {
  store.filterStatus = 'all'
  store.filterPhase = 'all'
  store.sortBy = 'updated'
}
</script>
