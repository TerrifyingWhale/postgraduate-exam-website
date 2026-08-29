<script setup lang="ts">
import ExamFilterDrawer from '@/components/exams-page/ExamFilterDrawer.vue'
import ExamPaperList from '@/components/exams-page/ExamPaperList.vue'
import ExamTocDrawer from '@/components/exams-page/ExamTocDrawer.vue'
import { useExamPage } from '@/components/exams-page/useExamPage'

const examPage = useExamPage()
</script>

<template>
  <div
    class="relative grid min-h-screen overflow-x-clip bg-[#edf1f6] text-[#071225] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
    :style="{ gridTemplateColumns: examPage.drawers.columns.value }"
  >
    <div
      v-if="examPage.drawers.compactLayout.value && (examPage.drawers.leftOpen.value || examPage.drawers.rightOpen.value)"
      class="fixed inset-0 z-20 bg-black/30 backdrop-blur-[2px]"
      @click="examPage.drawers.closeCompactDrawers"
    ></div>

    <ExamFilterDrawer
      :current-filter-text="examPage.currentFilterText.value"
      :filters="examPage.filters.value"
      :has-active-filters="examPage.hasActiveFilters.value"
      :open="examPage.drawers.leftOpen.value"
      :pinned="examPage.drawers.leftPinned.value"
      :selection="examPage.selection"
      @hover="examPage.drawers.leftHovered.value = $event"
      @pin="examPage.drawers.leftPinned.value = $event"
      @reset="examPage.resetFilters"
      @search="examPage.openSearchPage"
      @update="examPage.updateSelection"
    />

    <ExamPaperList
      :error="examPage.error.value"
      :exams="examPage.exams.value"
      :loading="examPage.loading.value"
      :page="examPage.page.value"
      :total-pages="examPage.totalPages.value"
      @page="examPage.changePage"
    />

    <ExamTocDrawer
      :active-exam-id="examPage.activeExamId.value"
      :current-filter-text="examPage.currentFilterText.value"
      :exams="examPage.exams.value"
      :open="examPage.drawers.rightOpen.value"
      :pinned="examPage.drawers.rightPinned.value"
      @hover="examPage.drawers.rightHovered.value = $event"
      @pin="examPage.drawers.rightPinned.value = $event"
      @select="examPage.scrollToExam"
    />
  </div>
</template>
