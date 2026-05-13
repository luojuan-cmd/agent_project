import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast } from '@/types'

export const useUIStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const showFilterPanel = ref(false)
  const showConfirmDialog = ref(false)
  const confirmDialogConfig = ref({
    title: '',
    message: '',
    confirmText: '确认',
    cancelText: '取消',
    onConfirm: () => {},
    onCancel: () => {},
  })
  const isMobile = ref(false)

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    toasts.value.push({ ...toast, id, duration: toast.duration || 3000 })
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 3000)
  }

  const removeToast = (id: string) => {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx > -1) toasts.value.splice(idx, 1)
  }

  const showConfirm = (config: Partial<typeof confirmDialogConfig.value>) => {
    confirmDialogConfig.value = { ...confirmDialogConfig.value, ...config }
    showConfirmDialog.value = true
  }

  const hideConfirm = () => {
    showConfirmDialog.value = false
  }

  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
  }

  return {
    toasts,
    showFilterPanel,
    showConfirmDialog,
    confirmDialogConfig,
    isMobile,
    addToast,
    removeToast,
    showConfirm,
    hideConfirm,
    checkMobile,
  }
})
