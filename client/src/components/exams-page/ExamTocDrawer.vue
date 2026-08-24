<script setup lang="ts">
import type { Exam } from "@/types";
import DoubleChevronIcon from "@/components/icons/DoubleChevronIcon.vue";

defineProps<{
  activeExamId: string;
  currentFilterText: string;
  exams: Exam[];
  open: boolean;
  pinned: boolean;
}>();

const emit = defineEmits<{
  hover: [hovered: boolean];
  pin: [pinned: boolean];
  select: [examId: string];
}>();
</script>

<template>
  <aside
    class="sticky top-0 z-30 h-screen min-w-0 overflow-hidden border-l border-[#d3dce8] bg-[#f7f9fc] transition-[opacity,transform] duration-300 max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:w-[min(270px,84vw)] max-lg:shadow-[-20px_0_70px_rgba(15,23,42,.18)]"
    :class="
      open
        ? 'translate-x-0 opacity-100'
        : 'pointer-events-none opacity-0 max-lg:translate-x-full'
    "
    @mouseenter="emit('hover', true)"
    @mouseleave="emit('hover', false)"
  >
    <header
      class="flex items-center justify-between border-b border-[#dce3ec] px-5 py-6"
    >
      <div>
        <p
          class="mb-1.5 mt-0 text-[10px] font-semibold tracking-[.08em] text-slate-400"
        >
          当前筛选
        </p>
        <h2
          class="m-0 max-w-[160px] text-[15px] font-semibold leading-6 tracking-[-.02em]"
        >
          {{ currentFilterText }}
        </h2>
      </div>
      <button
        type="button"
        class="grid h-9 w-9 place-items-center border transition"
        :class="
          pinned
            ? 'border-[#12327f] bg-[#12327f] text-white'
            : 'border-[#cbd5e1] bg-white text-slate-500 hover:border-[#12327f] hover:text-[#12327f]'
        "
        :aria-label="pinned ? '取消固定题目目录' : '固定题目目录'"
        @click="emit('pin', !pinned)"
      >
        <svg
          class="h-4 w-4 transition-transform"
          :class="pinned ? '-rotate-45' : ''"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path
            d="M12 17v5M7 3h10M8 3l1 7-3 4h12l-3-4 1-7"
            stroke-linecap="square"
            stroke-linejoin="miter"
          />
        </svg>
      </button>
    </header>
    <ol
      class="m-0 h-[calc(100vh-86px)] list-none space-y-1 overflow-y-auto px-3 py-4"
    >
      <li v-for="exam in exams" :key="exam.id">
        <button
          type="button"
          class="flex w-full items-baseline justify-between gap-3 border-l-2 px-3 py-3 text-left transition hover:bg-white"
          :class="
            activeExamId === exam.id
              ? 'border-[#12327f] bg-white text-[#12327f]'
              : 'border-transparent text-slate-500 hover:text-[#071225]'
          "
          @click="emit('select', exam.id)"
        >
          <span class="font-mono text-[11px] font-semibold tracking-[.04em]">{{
            exam.year
          }}</span>
          <span class="text-[13px] font-semibold">第 {{ exam.number }} 题</span>
        </button>
      </li>
    </ol>
  </aside>

  <div
    class="fixed inset-y-0 right-0 z-50 w-7 cursor-w-resize"
    aria-label="悬停展开题目目录"
    @mouseenter="emit('hover', true)"
    @click="emit('pin', true)"
  >
    <span
      v-if="!open"
      class="absolute right-0 top-1/2 grid h-20 w-6 -translate-y-1/2 place-items-center border border-r-0 border-[#cbd5e1] bg-white/95 text-[#31559e] shadow-lg rounded-l-sm"
    >
      <DoubleChevronIcon class="h-4 w-4 rotate-180" />
    </span>
  </div>
</template>
