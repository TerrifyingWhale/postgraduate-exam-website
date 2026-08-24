<script setup lang="ts">
import KnowledgeLibraryDrawer from '@/components/knowledge-page/KnowledgeLibraryDrawer.vue'
import KnowledgeReaderContent from '@/components/knowledge-page/KnowledgeReaderContent.vue'
import KnowledgeTocDrawer from '@/components/knowledge-page/KnowledgeTocDrawer.vue'
import { useKnowledgeReader } from '@/components/knowledge-page/useKnowledgeReader'
import { useReaderDrawers } from '@/components/knowledge-page/useReaderDrawers'

const reader = useKnowledgeReader()
const drawers = useReaderDrawers()
</script>

<template>
  <div
    class="relative grid min-h-screen overflow-x-clip bg-[#e9eef5] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
    :style="{ gridTemplateColumns: drawers.readerColumns.value }"
  >
    <div
      v-if="drawers.compactLayout.value && (drawers.leftOpen.value || drawers.rightOpen.value)"
      class="fixed inset-0 z-20 bg-black/30 backdrop-blur-[2px]"
      @click="drawers.closeMobileDrawers"
    ></div>

    <KnowledgeLibraryDrawer
      :active-section-id="reader.activeSectionId.value"
      :book="reader.book.value"
      :book-id="reader.bookId.value"
      :books="reader.books"
      :open="drawers.leftOpen.value"
      :pinned="drawers.leftPinned.value"
      @hover="drawers.leftHovered.value = $event"
      @pin="drawers.leftPinned.value = $event"
      @query-active="drawers.leftQueryActive.value = $event"
      @select-book="reader.selectBook"
      @select-section="reader.selectSection"
    />

    <KnowledgeReaderContent
      :article-entries="reader.articleEntries.value"
      :error="reader.error.value"
      :loading="reader.loading.value"
      :section="reader.section.value"
      :section-exam="reader.sectionExam.value"
    />

    <KnowledgeTocDrawer
      :entries="reader.tocEntries.value"
      :open="drawers.rightOpen.value"
      :pinned="drawers.rightPinned.value"
      :visible="Boolean(reader.section.value)"
      @hover="drawers.rightHovered.value = $event"
      @pin="drawers.rightPinned.value = $event"
    />
  </div>
</template>
