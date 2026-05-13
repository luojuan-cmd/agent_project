<template>
  <div class="min-h-screen bg-space-bg">
    <AppSidebar />
    <router-view />
    <ToastContainer />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import AppSidebar from '@/components/AppSidebar.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const ui = useUIStore()

onMounted(() => {
  ui.checkMobile()
  window.addEventListener('resize', () => ui.checkMobile())
})
</script>
