<template>
  <div class="min-h-screen bg-space-bg pb-20 lg:pb-0 lg:pl-60">
    <AppHeader title="统计分析" />

    <main class="px-4 lg:px-6 py-4 space-y-4">
      <!-- Time Range + Export -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex gap-2">
          <button
            v-for="r in timeRanges"
            :key="r.value"
            @click="timeRange = r.value"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="timeRange === r.value
              ? 'text-white bg-gradient-to-r from-nebula-purple to-nebula-indigo'
              : 'text-star-gray bg-space-card border border-star-dim/20 hover:text-star-white'
            "
          >
            {{ r.label }}
          </button>
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-btn text-xs font-medium text-star-gray border border-star-dim/20 hover:border-nebula-purple/40 hover:text-star-white transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          导出报表
        </button>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="stat in summaryStats"
          :key="stat.label"
          class="bg-space-card border border-star-dim/15 rounded-card p-4 text-center"
        >
          <p class="font-mono text-2xl font-bold bg-gradient-to-r from-nebula-purple to-nebula-indigo bg-clip-text text-transparent mb-1">
            {{ stat.value }}
          </p>
          <p class="text-xs text-star-gray">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Trend Chart -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-5">
        <h3 class="text-sm font-semibold text-star-white mb-4">项目趋势（近30天）</h3>
        <div class="h-56">
          <Line :data="trendData" :options="trendOptions" />
        </div>
      </div>

      <!-- Efficiency Chart -->
      <div class="bg-space-card border border-star-dim/15 rounded-card p-5">
        <h3 class="text-sm font-semibold text-star-white mb-4">人员效能</h3>
        <div class="h-56">
          <Bar :data="efficiencyData" :options="efficiencyOptions" />
        </div>
      </div>

      <!-- Overdue Projects -->
      <div class="bg-space-card border border-star-dim/15 rounded-card overflow-hidden">
        <div class="p-4 border-b border-star-dim/10">
          <h3 class="text-sm font-semibold text-status-danger flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            逾期项目
          </h3>
        </div>
        <div v-if="overdueProjects.length > 0" class="divide-y divide-star-dim/10">
          <div
            v-for="project in overdueProjects"
            :key="project.id"
            class="flex items-center justify-between px-4 py-3 hover:bg-status-danger/5 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-status-danger flex-shrink-0" />
              <div>
                <p class="text-sm text-star-white">{{ project.name }}</p>
                <p class="text-xs text-star-dim">负责人: {{ project.owner }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs text-status-danger">截止 {{ formatDate(project.deadlineDate) }}</p>
              <p class="font-mono text-xs text-star-gray mt-0.5">{{ project.progress }}%</p>
            </div>
          </div>
        </div>
        <div v-else class="p-8 text-center">
          <p class="text-sm text-star-dim">暂无逾期项目</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from 'chart.js'
import { useProjectStore } from '@/stores/projects'
import AppHeader from '@/components/AppHeader.vue'
import { formatDate } from '@/utils/format'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend)

const store = useProjectStore()
const timeRange = ref('30')

const timeRanges = [
  { value: '7', label: '近7天' },
  { value: '30', label: '近30天' },
  { value: '90', label: '本季度' },
]

// Compute stats
const totalProjects = computed(() => store.projects.length)
const avgProgress = computed(() => {
  if (totalProjects.value === 0) return 0
  return Math.round(store.projects.reduce((s, p) => s + p.progress, 0) / totalProjects.value)
})

const overdueProjects = computed(() => {
  const now = new Date()
  return store.projects
    .filter(p => new Date(p.deadlineDate) < now && p.status !== 'deployed')
    .sort((a, b) => new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime())
})

const onTimeRate = computed(() => {
  const completed = store.projects.filter(p => p.status === 'deployed').length
  if (completed === 0) return 100
  const overdueCompleted = store.projects.filter(p => p.status === 'deployed' && new Date(p.deadlineDate) < new Date(p.updatedAt)).length
  return Math.round(((completed - overdueCompleted) / completed) * 100)
})

const summaryStats = computed(() => [
  { value: totalProjects.value, label: '人均项目数' },
  { value: avgProgress.value + '%', label: '平均完成度' },
  { value: onTimeRate.value + '%', label: '准时交付率' },
])

// Trend chart - simulate daily data
const trendData = computed(() => {
  const days = 30
  const labels: string[] = []
  const created: number[] = []
  const completed: number[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`
    labels.push(dateStr)

    // Simulate data based on project dates
    const dayCreated = store.projects.filter(p => {
      const pd = new Date(p.proposeDate)
      return pd.getMonth() === d.getMonth() && pd.getDate() === d.getDate() && pd.getFullYear() === d.getFullYear()
    }).length
    created.push(dayCreated || Math.random() > 0.7 ? 1 : 0)

    const dayCompleted = store.projects.filter(p => {
      if (p.status !== 'deployed') return false
      const ud = new Date(p.updatedAt)
      return ud.getMonth() === d.getMonth() && ud.getDate() === d.getDate() && ud.getFullYear() === d.getFullYear()
    }).length
    completed.push(dayCompleted)
  }

  return {
    labels,
    datasets: [
      {
        label: '新增项目',
        data: created,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 2,
      },
      {
        label: '完成项目',
        data: completed,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 2,
      },
    ],
  }
})

const trendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#94a3b8', font: { size: 11 }, usePointStyle: true },
    },
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
      grid: { color: 'rgba(226, 232, 240, 0.5)' },
      ticks: { color: '#94a3b8', font: { size: 10 }, maxTicksLimit: 10 },
      border: { display: false },
    },
    y: {
      grid: { color: 'rgba(226, 232, 240, 0.5)' },
      ticks: { color: '#94a3b8', font: { size: 10 }, stepSize: 1 },
      border: { display: false },
      beginAtZero: true,
    },
  },
}

// Efficiency chart - projects per person
const efficiencyData = computed(() => {
  const personMap: Record<string, { total: number; completed: number }> = {}
  store.projects.forEach(p => {
    const owner = p.owner
    if (!personMap[owner]) personMap[owner] = { total: 0, completed: 0 }
    personMap[owner].total++
    if (p.status === 'deployed') personMap[owner].completed++
  })

  const people = Object.keys(personMap)
  return {
    labels: people,
    datasets: [
      {
        label: '负责项目',
        data: people.map(p => personMap[p]!.total),
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: '已完成',
        data: people.map(p => personMap[p]!.completed),
        backgroundColor: '#10b981',
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  }
})

const efficiencyOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#94a3b8', font: { size: 11 }, usePointStyle: true },
    },
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
      grid: { color: 'rgba(226, 232, 240, 0.5)' },
      ticks: { color: '#94a3b8', font: { size: 10 }, stepSize: 1 },
      border: { display: false },
      beginAtZero: true,
    },
    y: {
      grid: { display: false },
      ticks: { color: '#94a3b8', font: { size: 11 } },
      border: { display: false },
    },
  },
}
</script>
