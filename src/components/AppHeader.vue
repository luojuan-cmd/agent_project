<template>
  <header class="sticky top-0 z-30 bg-space-card/80 backdrop-blur-xl border-b border-star-dim/10">
    <div class="flex items-center justify-between h-14 px-4 lg:px-6">
      <!-- Left -->
      <div class="flex items-center gap-3">
        <button
          v-if="showBack"
          @click="goBack"
          class="p-2 -ml-2 text-star-gray hover:text-star-white transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-base font-semibold text-star-white">{{ title }}</h1>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-2">
        <slot name="right" />
        <button
          v-if="showFilter"
          @click="ui.showFilterPanel = true"
          class="p-2 text-star-gray hover:text-star-white transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
        <router-link
          v-if="showCreate"
          to="/create"
          class="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-btn text-sm font-medium text-white bg-gradient-to-r from-nebula-purple to-nebula-indigo hover:opacity-90 transition-opacity"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新建
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/ui'

const props = defineProps<{
  title: string
  showBack?: boolean
  showFilter?: boolean
  showCreate?: boolean
}>()

const router = useRouter()
const ui = useUIStore()

function goBack() {
  router.back()
}
</script>
