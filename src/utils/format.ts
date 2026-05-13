import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'yyyy-MM-dd')
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'yyyy-MM-dd HH:mm')
  } catch {
    return dateStr
  }
}

export function relativeTime(dateStr: string): string {
  if (!dateStr) return '-'
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: zhCN })
  } catch {
    return dateStr
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function getAvatarColor(name: string): string {
  const safeName = name || '?';
  const colors = [
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
    'from-pink-500 to-rose-500',
    'from-violet-500 to-purple-500',
  ]
  let hash = 0
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colors.length
  return colors[index] ?? 'from-purple-500 to-indigo-500'
}

export function getInitials(name: string): string {
  if (!name) return '?'
  return name.slice(0, 1).toUpperCase()
}
