<template>
  <div
    class="bg-space-card border border-star-dim/15 rounded-card p-4 cursor-pointer transition-all duration-200 hover:border-nebula-purple/30 hover:shadow-glow hover:-translate-y-0.5"
    @click="goToDetail"
  >
    <!-- Title + Status -->
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-base font-semibold text-star-white leading-snug flex-1 mr-3 line-clamp-1">
        {{ project.name }}
      </h3>
      <span
        class="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider"
        :style="{ backgroundColor: statusColor + '20', color: statusColor }"
      >
        {{ statusLabel }}
      </span>
    </div>

    <!-- Progress bar -->
    <div class="flex items-center gap-3 mb-3">
      <div class="flex-1 h-1.5 bg-space-border rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-800"
          :style="{ width: project.progress + '%', background: 'linear-gradient(90deg, #8b5cf6, #6366f1)' }"
        />
      </div>
      <span class="font-mono text-xs text-nebula-purple tabular-nums">{{ project.progress }}%</span>
    </div>

    <!-- Dates -->
    <div class="flex items-center gap-4 mb-3 text-xs text-star-gray">
      <span>提出 {{ formatDate(project.proposeDate) }}</span>
      <span>截止 {{ formatDate(project.deadlineDate) }}</span>
    </div>

    <!-- Owner + Phase -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center text-[10px] font-bold text-white"
          :class="avatarGradient"
        >
          {{ getInitials(project.owner) }}
        </div>
        <span class="text-xs text-star-gray">{{ project.owner }}</span>
      </div>
      <span
        class="px-2 py-0.5 rounded text-[11px] font-medium"
        style="background-color: rgba(139, 92, 246, 0.12); color: #8b5cf6;"
      >
        {{ phaseLabel }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Project } from '@/types'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, PROJECT_PHASE_LABELS } from '@/types'
import { formatDate, getAvatarColor, getInitials } from '@/utils/format'

const props = defineProps<{
  project: Project
}>()

const router = useRouter()

const statusLabel = computed(() => PROJECT_STATUS_LABELS[props.project.status])
const statusColor = computed(() => PROJECT_STATUS_COLORS[props.project.status])
const phaseLabel = computed(() => PROJECT_PHASE_LABELS[props.project.phase])
const avatarGradient = computed(() => getAvatarColor(props.project.owner))

function goToDetail() {
  router.push(`/projects/${props.project.id}`)
}
</script>
