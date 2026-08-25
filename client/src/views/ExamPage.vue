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
    :style="{ gridTemplateColumns: examPage.drawerColumns.value }"
  >
    <div
      v-if="examPage.compactLayout.value && (examPage.drawerOpen.value || examPage.rightOpen.value)"
      class="fixed inset-0 z-20 bg-black/30 backdrop-blur-[2px]"
      @click="examPage.closeMobileDrawers"
    ></div>

    <ExamFilterDrawer
      :current-filter-text="examPage.currentFilterText.value"
      :filters="examPage.filters.value"
      :has-active-filters="examPage.hasActiveFilters.value"
      :open="examPage.drawerOpen.value"
      :pinned="examPage.drawerPinned.value"
      :selection="examPage.selection"
      @hover="examPage.drawerHovered.value = $event"
      @pin="examPage.drawerPinned.value = $event"
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
      :open="examPage.rightOpen.value"
      :pinned="examPage.rightPinned.value"
      @hover="examPage.rightHovered.value = $event"
      @pin="examPage.rightPinned.value = $event"
      @select="examPage.scrollToExam"
    />
  </div>
</template>
