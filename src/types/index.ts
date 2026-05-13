export type ProjectStatus = 'pending' | 'developing' | 'testing' | 'deployed' | 'paused'
export type ProjectPhase = 'internal' | 'custom' | 'iteration' | 'research' | 'ops'
export type ProjectSource = 'business' | 'tech' | 'feedback' | 'competitor' | 'regulation'
export type UserRole = 'employee' | 'admin'

export interface ProjectHistory {
  id: string
  date: string
  progress: number
  description: string
  updatedBy: string
}

export interface ProjectAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
}

export interface Project {
  id: string
  phase: ProjectPhase
  name: string
  description: string
  source: ProjectSource
  proposeDate: string
  deadlineDate: string
  businessContact: string
  owner: string
  frontendDev: string
  backendDev: string
  status: ProjectStatus
  progress: number
  latestProgress: string
  coordination: string
  attachments: ProjectAttachment[]
  updatedAt: string
  histories: ProjectHistory[]
}

export interface User {
  id: string
  name: string
  avatar: string
  role: UserRole
  department: string
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  pending: '待启动',
  developing: '开发中',
  testing: '测试中',
  deployed: '已上线',
  paused: '已暂停',
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  pending: '#94a3b8',
  developing: '#8b5cf6',
  testing: '#f59e0b',
  deployed: '#10b981',
  paused: '#ef4444',
}

export const PROJECT_PHASE_LABELS: Record<ProjectPhase, string> = {
  internal: '内部研发',
  custom: '客户定制',
  iteration: '产品迭代',
  research: '技术预研',
  ops: '运维支持',
}

export const PROJECT_SOURCE_LABELS: Record<ProjectSource, string> = {
  business: '业务需求',
  tech: '技术规划',
  feedback: '客户反馈',
  competitor: '竞品分析',
  regulation: '法规要求',
}
