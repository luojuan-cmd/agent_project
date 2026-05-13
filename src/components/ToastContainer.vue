<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
    <TransitionGroup
      enter-active-class="transition-all duration-250"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-for="toast in ui.toasts"
        :key="toast.id"
        class="pointer-events-auto min-w-[280px] max-w-[400px] rounded-btn px-4 py-3 shadow-lg flex items-center gap-3"
        :class="toastClass(toast.type)"
      >
        <span class="text-lg flex-shrink-0">{{ toastIcon(toast.type) }}</span>
        <span class="text-sm font-medium text-white">{{ toast.message }}</span>
        <button
          @click="ui.removeToast(toast.id)"
          class="ml-auto text-white/60 hover:text-white flex-shrink-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

function toastClass(type: string) {
  switch (type) {
    case 'success': return 'bg-gradient-to-r from-emerald-500 to-teal-600'
    case 'error': return 'bg-gradient-to-r from-red-500 to-red-600'
    case 'warning': return 'bg-gradient-to-r from-amber-500 to-orange-600'
    default: return 'bg-gradient-to-r from-indigo-500 to-purple-600'
  }
}

function toastIcon(type: string) {
  switch (type) {
    case 'success': return '✓'
    case 'error': return '✕'
    case 'warning': return '!'
    default: return 'ℹ'
  }
}
</script>
