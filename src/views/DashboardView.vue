<template>
  <div class="min-h-screen bg-space-bg pb-20 lg:pb-0 lg:pl-60">
    <AppHeader title="管理看板" />

    <main class="px-4 lg:px-6 py-4 space-y-4">
      <!-- Stats Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="stat in statsCards"
          :key="stat.label"
          class="bg-space-card border border-star-dim/15 rounded-card p-4 hover:border-nebula-purple/25 hover:shadow-card transition-all"
        >
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-1 h-8 rounded-full"
              :style="{ background: stat.gradient }"
            />
            <span class="text-xs text-star-gray">{{ stat.label }}</span>
          </div>
          <p class="font-mono text-2xl lg:text-[28px] font-bold text-star-white">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Status Distribution -->
        <div class="bg-space-card border border-star-dim/15 rounded-card p-5">
          <h3 class="text-sm font-semibold text-star-white mb-4">项目状态分布</h3>
          <div class="flex items-center gap-6">
            <div class="w-32 h-32 lg:w-40 lg:h-40 flex-shrink-0">
              <Doughnut :data="doughnutData" :options="doughnutOptions" />
            </div>
            <div class="flex-1 space-y-2.5">
              <div
                v-for="item in statusLegend"
                :key="item.key"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: item.color }" />
                  <span class="text-xs text-star-gray">{{ item.label }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-sm font-semibold text-star-white">{{ item.value }}</span>
                  <span class="text-xs text-star-dim">{{ item.percent }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Phase Distribution -->
        <div class="bg-space-card border border-star-dim/15 rounded-card p-5">
          <h3 class="text-sm font-semibold text-star-white mb-4">板块项目分布</h3>
          <div class="h-40">
            <Bar :data="barData" :options="barOptions" />
          </div>
        </div>
      </div>

      <!-- Project Table -->
      <div class="bg-space-card border border-star-dim/15 rounded-card overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-star-dim/10">
          <h3 class="text-sm font-semibold text-star-white">项目明细</h3>
          <router-link to="/projects" class="text-xs text-nebula-purple hover:text-nebula-indigo transition-colors">
            查看全部
          </router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left" style="background: rgba(139, 92, 246, 0.06);">
                <th class="px-4 py-3 text-xs font-medium text-star-gray">项目名称</th>
                <th class="px-4 py-3 text-xs font-medium text-star-gray">负责人</th>
                <th class="px-4 py-3 text-xs font-medium text-star-gray">板块</th>
                <th class="px-4 py-3 text-xs font-medium text-star-gray">进度</th>
                <th class="px-4 py-3 text-xs font-medium text-star-gray">截止日期</th>
                <th class="px-4 py-3 text-xs font-medium text-star-gray">状态</th>
                <th class="px-4 py-3 text-xs font-medium text-star-gray">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(project, idx) in recentProjects"
                :key="project.id"
                class="transition-colors hover:bg-nebula-purple/5"
                :class="idx % 2 === 1 ? 'bg-space-bg/50' : ''"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-1 h-6 rounded-full"
                      :style="{ backgroundColor: statusColors[project.status] }"
                    />
                    <span class="text-sm text-star-white truncate max-w-[150px]">{{ project.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-star-gray">{{ project.owner }}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-0.5 rounded text-[11px] font-medium"
                    style="background-color: rgba(139, 92, 246, 0.12); color: #8b5cf6;"
                  >
                    {{ phaseLabels[project.phase] }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1.5 bg-space-border rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full"
                        :style="{ width: project.progress + '%', background: 'linear-gradient(90deg, #8b5cf6, #6366f1)' }"
                      />
                    </div>
                    <span class="font-mono text-xs text-star-gray">{{ project.progress }}%</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-star-gray">{{ formatDate(project.deadlineDate) }}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    :style="{ backgroundColor: statusColors[project.status] + '20', color: statusColors[project.status] }"
                  >
                    {{ statusLabels[project.status] }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1">
                    <button
                      @click="viewProject(project.id)"
                      class="p-1.5 text-star-dim hover:text-star-gray transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <router-link
                      :to="`/projects/${project.id}/edit`"
                      class="p-1.5 text-star-dim hover:text-nebula-indigo transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </router-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Activity Timeline -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-5">
        <h3 class="text-sm font-semibold text-star-white mb-4">近期动态</h3>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start gap-3"
          >
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              :class="activity.avatarGradient"
            >
              {{ getInitials(activity.user) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-star-white">
                <span class="font-medium">{{ activity.user }}</span>
                <span class="text-star-gray"> {{ activity.action }}</span>
              </p>
              <p class="text-xs text-star-dim mt-0.5">{{ relativeTime(activity.time) }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Doughnut, Bar } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { useProjectStore } from '@/stores/projects'
import AppHeader from '@/components/AppHeader.vue'
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  PROJECT_PHASE_LABELS,
} from '@/types'
import { formatDate, relativeTime, getAvatarColor, getInitials } from '@/utils/format'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const router = useRouter()
const store = useProjectStore()

const statusLabels = PROJECT_STATUS_LABELS
const statusColors = PROJECT_STATUS_COLORS
const phaseLabels = PROJECT_PHASE_LABELS

const stats = computed(() => store.stats)

const statsCards = computed(() => [
  { label: '全部项目', value: stats.value.total, gradient: 'linear-gradient(180deg, #8b5cf6, #6366f1)' },
  { label: '进行中', value: stats.value.developing, gradient: 'linear-gradient(180deg, #8b5cf6, #a78bfa)' },
  { label: '本周截止', value: stats.value.thisWeekDeadline, gradient: 'linear-gradient(180deg, #f59e0b, #d97706)' },
  { label: '已完成(本月)', value: stats.value.deployed, gradient: 'linear-gradient(180deg, #10b981, #059669)' },
])

const dist = computed(() => store.statusDistribution)
const total = computed(() => stats.value.total || 1)

const statusLegend = computed(() => [
  { key: 'pending', label: '待启动', value: dist.value.pending, color: '#94a3b8', percent: Math.round((dist.value.pending / total.value) * 100) },
  { key: 'developing', label: '开发中', value: dist.value.developing, color: '#8b5cf6', percent: Math.round((dist.value.developing / total.value) * 100) },
  { key: 'testing', label: '测试中', value: dist.value.testing, color: '#f59e0b', percent: Math.round((dist.value.testing / total.value) * 100) },
  { key: 'deployed', label: '已上线', value: dist.value.deployed, color: '#10b981', percent: Math.round((dist.value.deployed / total.value) * 100) },
  { key: 'paused', label: '已暂停', value: dist.value.paused, color: '#ef4444', percent: Math.round((dist.value.paused / total.value) * 100) },
])

const doughnutData = computed(() => ({
  labels: statusLegend.value.map(s => s.label),
  datasets: [{
    data: statusLegend.value.map(s => s.value),
    backgroundColor: statusLegend.value.map(s => s.color),
    borderWidth: 0,
    hoverOffset: 4,
  }],
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: true,
  cutout: '65%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#ffffff',
      titleColor: '#0f172a',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(148, 163, 184, 0.4)',
      borderWidth: 1,
    },
  },
}

const phaseDist = computed(() => store.phaseDistribution)

const barData = computed(() => ({
  labels: Object.keys(phaseDist.value).map(k => phaseLabels[k as keyof typeof phaseLabels] || k),
  datasets: [{
    label: '项目数',
    data: Object.values(phaseDist.value),
    backgroundColor: (ctx: any) => {
      const canvas = ctx.chart.ctx
      const gradient = canvas.createLinearGradient(0, 0, 200, 0)
      gradient.addColorStop(0, '#8b5cf6')
      gradient.addColorStop(1, '#6366f1')
      return gradient
    },
    borderRadius: 4,
    barThickness: 20,
  }],
}))

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#ffffff',
      titleColor: '#0f172a',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(148, 163, 184, 0.4)',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(226, 232, 240, 0.6)' },
      ticks: { color: '#94a3b8', font: { size: 11 } },
      border: { display: false },
    },
    y: {
      grid: { display: false },
      ticks: { color: '#94a3b8', font: { size: 12 } },
      border: { display: false },
    },
  },
}

const recentProjects = computed(() => store.filteredProjects.slice(0, 6))

function viewProject(id: string) {
  router.push(`/projects/${id}`)
}

// Generate recent activities from project histories
const recentActivities = computed(() => {
  const activities: any[] = []
  store.projects.forEach(p => {
    p.histories.slice(-2).forEach(h => {
      activities.push({
        id: h.id,
        user: h.updatedBy,
        action: `更新了「${p.name}」进度至 ${h.progress}%`,
        time: h.date + 'T12:00:00',
        avatarGradient: getAvatarColor(h.updatedBy),
      })
    })
  })
  return activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6)
})
</script>
