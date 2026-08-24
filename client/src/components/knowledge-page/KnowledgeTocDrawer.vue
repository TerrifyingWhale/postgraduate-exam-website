<script setup lang="ts">
import DoubleChevronIcon from "@/components/icons/DoubleChevronIcon.vue";
import KnowledgeToc from "./KnowledgeToc.vue";
import type { KnowledgeTocEntry } from "./pageTypes";

defineProps<{
  entries: KnowledgeTocEntry[];
  open: boolean;
  pinned: boolean;
  visible: boolean;
}>();

const emit = defineEmits<{
  hover: [value: boolean];
  pin: [value: boolean];
}>();
</script>

<template>
  <aside
    class="sticky top-0 z-30 h-screen min-w-0 overflow-hidden border-l border-[#d3dce8] bg-[#f6f8fb] transition-[opacity,transform] duration-300 max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:w-[min(270px,84vw)] max-lg:shadow-[-20px_0_70px_rgba(15,23,42,.18)]"
    :class="
      open
        ? 'translate-x-0 opacity-100'
        : 'pointer-events-none opacity-0 max-lg:translate-x-full'
    "
    @mouseenter="emit('hover', true)"
    @mouseleave="emit('hover', false)"
  >
    <KnowledgeToc
      v-if="visible"
      :entries="entries"
      :pinned="pinned"
      class="h-full"
      @toggle-pin="emit('pin', !pinned)"
    />
  </aside>

  <div
    class="fixed inset-y-0 right-0 z-50 w-7 cursor-w-resize"
    aria-label="悬停展开本节目录"
    @mouseenter="emit('hover', true)"
    @click="emit('pin', true)"
  >
    <span
      v-if="!open"
      class="absolute right-0 top-1/2 grid h-20 w-6 -translate-y-1/2 place-items-center border border-r-0 border-[#cbd5e1] bg-white/90 text-[#31559e] shadow-lg backdrop-blur rounded-l-sm"
    >
      <DoubleChevronIcon class="h-4 w-4 rotate-180" />
    </span>
  </div>
</template>
