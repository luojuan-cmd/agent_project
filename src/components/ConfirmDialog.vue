<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="ui.showConfirmDialog"
        class="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        @click="handleCancel"
      >
        <Transition
          enter-active-class="transition-all duration-250"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="ui.showConfirmDialog"
            class="bg-space-card border border-star-dim/20 rounded-2xl shadow-glow-lg w-full max-w-[400px] p-6"
            @click.stop
          >
            <h3 class="text-lg font-semibold text-star-white mb-2">
              {{ ui.confirmDialogConfig.title }}
            </h3>
            <p class="text-sm text-star-gray leading-relaxed mb-6">
              {{ ui.confirmDialogConfig.message }}
            </p>
            <div class="flex gap-3 justify-end">
              <button
                @click="handleCancel"
                class="px-5 py-2.5 rounded-btn text-sm font-medium text-star-gray hover:text-star-white hover:bg-space-border transition-colors"
              >
                {{ ui.confirmDialogConfig.cancelText }}
              </button>
              <button
                @click="handleConfirm"
                class="px-5 py-2.5 rounded-btn text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/20"
              >
                {{ ui.confirmDialogConfig.confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui'

const ui = useUIStore()

function handleConfirm() {
  ui.confirmDialogConfig.onConfirm()
  ui.hideConfirm()
}

function handleCancel() {
  ui.confirmDialogConfig.onCancel()
  ui.hideConfirm()
}
</script>
