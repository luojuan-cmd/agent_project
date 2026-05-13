import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project, ProjectStatus, ProjectPhase, ProjectAttachment, ProjectHistory } from '@/types'
import { mockProjects } from '@/data/projects'
import { useAuthStore } from './auth'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([...mockProjects])
  const loading = ref(false)
  const filterStatus = ref<ProjectStatus | 'all'>('all')
  const filterPhase = ref<ProjectPhase | 'all'>('all')
  const searchQuery = ref('')
  const sortBy = ref<'updated' | 'progress' | 'deadline'>('updated')

  const filteredProjects = computed(() => {
    let result = projects.value

    if (filterStatus.value !== 'all') {
      result = result.filter(p => p.status === filterStatus.value)
    }

    if (filterPhase.value !== 'all') {
      result = result.filter(p => p.phase === filterPhase.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.frontendDev.toLowerCase().includes(q) ||
        p.backendDev.toLowerCase().includes(q) ||
        p.businessContact.toLowerCase().includes(q)
      )
    }

    switch (sortBy.value) {
      case 'progress':
        result = [...result].sort((a, b) => b.progress - a.progress)
        break
      case 'deadline':
        result = [...result].sort((a, b) => new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime())
        break
      default:
        result = [...result].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }

    return result
  })

  const stats = computed(() => {
    const total = projects.value.length
    const developing = projects.value.filter(p => p.status === 'developing').length
    const testing = projects.value.filter(p => p.status === 'testing').length
    const deployed = projects.value.filter(p => p.status === 'deployed').length
    const paused = projects.value.filter(p => p.status === 'paused').length
    const pending = projects.value.filter(p => p.status === 'pending').length

    const now = new Date()
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const thisWeekDeadline = projects.value.filter(p => {
      const d = new Date(p.deadlineDate)
      return d >= now && d <= weekEnd && p.status !== 'deployed'
    }).length

    const overdue = projects.value.filter(p => {
      const d = new Date(p.deadlineDate)
      return d < now && p.status !== 'deployed'
    }).length

    const avgProgress = total > 0
      ? Math.round(projects.value.reduce((sum, p) => sum + p.progress, 0) / total)
      : 0

    return { total, developing, testing, deployed, paused, pending, thisWeekDeadline, overdue, avgProgress }
  })

  const statusDistribution = computed(() => {
    return {
      pending: projects.value.filter(p => p.status === 'pending').length,
      developing: projects.value.filter(p => p.status === 'developing').length,
      testing: projects.value.filter(p => p.status === 'testing').length,
      deployed: projects.value.filter(p => p.status === 'deployed').length,
      paused: projects.value.filter(p => p.status === 'paused').length,
    }
  })

  const phaseDistribution = computed(() => {
    const phases: Record<string, number> = {}
    projects.value.forEach(p => {
      phases[p.phase] = (phases[p.phase] || 0) + 1
    })
    return phases
  })

  const getProjectById = (id: string): Project | undefined => {
    return projects.value.find(p => p.id === id)
  }

  const addProject = (data: Omit<Project, 'id' | 'updatedAt' | 'histories' | 'attachments'>) => {
    const auth = useAuthStore()
    const updaterName = auth.currentUser?.name ?? '系统'
    const now = new Date()
    const today = now.toISOString().split('T')[0] ?? '2026-04-29'

    const newProject: Project = {
      ...data,
      id: Date.now().toString(),
      updatedAt: now.toISOString(),
      attachments: [],
      histories: [
        {
          id: `h-${Date.now()}`,
          date: today,
          progress: data.progress,
          description: '项目创建',
          updatedBy: updaterName,
        },
      ],
    }
    projects.value.unshift(newProject)
    return newProject
  }

  const updateProject = (id: string, data: Partial<Project>) => {
    const auth = useAuthStore()
    const updaterName = auth.currentUser?.name ?? '系统'
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx === -1) return false

    const oldProject = projects.value[idx]
    if (!oldProject) return false

    const updated: Project = {
      ...oldProject,
      ...data,
      id: oldProject.id,
      updatedAt: new Date().toISOString(),
      histories: oldProject.histories,
    }

    if (data.progress !== undefined && data.progress !== oldProject.progress) {
      const today = new Date().toISOString().split('T')[0] ?? '2026-04-29'
      updated.histories = [
        ...oldProject.histories,
        {
          id: `h-${Date.now()}`,
          date: today,
          progress: data.progress,
          description: data.latestProgress || `进度更新至 ${data.progress}%`,
          updatedBy: updaterName,
        },
      ]
    }

    projects.value[idx] = updated
    return true
  }

  const updateProgress = (id: string, progress: number, description: string) => {
    return updateProject(id, { progress, latestProgress: description })
  }

  const deleteProject = (id: string) => {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx === -1) return false
    projects.value.splice(idx, 1)
    return true
  }

  const addAttachment = (projectId: string, attachment: ProjectAttachment) => {
    const project = projects.value.find(p => p.id === projectId)
    if (!project) return false
    project.attachments.push(attachment)
    project.updatedAt = new Date().toISOString()
    return true
  }

  const addHistory = (projectId: string, history: ProjectHistory) => {
    const project = projects.value.find(p => p.id === projectId)
    if (!project) return false
    project.histories.push(history)
    project.updatedAt = new Date().toISOString()
    return true
  }

  return {
    projects,
    loading,
    filterStatus,
    filterPhase,
    searchQuery,
    sortBy,
    filteredProjects,
    stats,
    statusDistribution,
    phaseDistribution,
    getProjectById,
    addProject,
    updateProject,
    updateProgress,
    deleteProject,
    addAttachment,
    addHistory,
  }
})
