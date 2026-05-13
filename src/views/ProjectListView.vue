<template>
  <div class="min-h-screen bg-space-bg pb-20 lg:pb-0 lg:pl-60">
    <AppHeader title="项目列表" :show-filter="true" :show-create="true" />

    <!-- Search Bar -->
    <div class="sticky top-14 z-20 bg-space-bg/95 backdrop-blur-xl border-b border-star-dim/10 px-4 lg:px-6 py-3">
      <div class="relative max-w-xl">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-star-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="store.searchQuery"
          type="text"
          placeholder="搜索项目名称、人员..."
          class="w-full h-10 pl-11 pr-4 rounded-btn bg-space-card border border-star-dim/20 text-sm text-star-white placeholder-star-dim focus:border-nebula-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] outline-none transition-all"
        />
        <button
          v-if="store.searchQuery"
          @click="store.searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-star-dim hover:text-star-gray"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Filter tags -->
      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-3">
        <span
          v-if="store.filterStatus !== 'all'"
          class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-nebula-purple/15 text-nebula-purple"
        >
          {{ statusLabel }}
          <button @click="store.filterStatus = 'all'" class="hover:text-white">×</button>
        </span>
        <span
          v-if="store.filterPhase !== 'all'"
          class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-nebula-indigo/15 text-nebula-indigo"
        >
          {{ phaseLabel }}
          <button @click="store.filterPhase = 'all'" class="hover:text-white">×</button>
        </span>
        <button
          @click="clearFilters"
          class="text-xs text-star-dim hover:text-star-gray underline"
        >
          清除全部
        </button>
      </div>
    </div>

    <!-- Project List -->
    <main class="px-4 lg:px-6 py-4 space-y-3">
      <ProjectCard
        v-for="project in store.filteredProjects"
        :key="project.id"
        :project="project"
      />

      <!-- Empty State -->
      <div v-if="store.filteredProjects.length === 0" class="text-center py-16">
        <div class="w-20 h-20 rounded-2xl bg-space-card border border-star-dim/15 flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-star-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p class="text-star-gray text-sm mb-2">暂无项目</p>
        <p class="text-star-dim text-xs mb-4">创建一个新项目开始管理吧</p>
        <router-link
          to="/create"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn text-sm font-medium text-white bg-gradient-to-r from-nebula-purple to-nebula-indigo"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          创建项目
        </router-link>
      </div>
    </main>

    <BottomNav />
    <FilterPanel />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projects'
import AppHeader from '@/components/AppHeader.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import BottomNav from '@/components/BottomNav.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import { PROJECT_STATUS_LABELS, PROJECT_PHASE_LABELS } from '@/types'

const store = useProjectStore()

const hasActiveFilters = computed(() =>
  store.filterStatus !== 'all' || store.filterPhase !== 'all'
)

const statusLabel = computed(() =>
  store.filterStatus !== 'all' ? PROJECT_STATUS_LABELS[store.filterStatus] : ''
)

const phaseLabel = computed(() =>
  store.filterPhase !== 'all' ? PROJECT_PHASE_LABELS[store.filterPhase] : ''
)

function clearFilters() {
  store.filterStatus = 'all'
  store.filterPhase = 'all'
}
</script>
