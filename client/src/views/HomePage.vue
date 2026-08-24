<script setup lang="ts">
import { onMounted } from "vue";
import BackgroundFx from "@/components/home-page/BackgroundFx.vue";
import LogoBrand from "@/components/home-page/LogoBrand.vue";
import TypeWriter from "@/components/home-page/TypeWriter.vue";
import GitHubRepoLink from "@/components/home-page/GitHubRepoLink.vue";
import SearchBox from "@/components/home-page/SearchBox.vue";
import CtaButtons from "@/components/home-page/CtaButtons.vue";
import ContributorsSection from "@/components/home-page/ContributorsSection.vue";
import { warmSearch } from "@/search/shared";

onMounted(() => {
  // 首页首屏挂载完成后立刻在后台加载搜索索引；不等待用户悬停或输入。
  warmSearch();

  // 首屏渲染完后，空闲时预加载知识页和真题页的 chunk
  // 这两个路由是懒加载，KnowledgePage/ExamPage 都依赖 registry.ts（2.9MB）
  // 不预加载的话，用户首次点击要等 chunk 下载完才会跳转，看起来"点不动"
  const prefetchChunks = () => {
    import("@/views/KnowledgePage.vue").catch(() => {});
    import("@/views/ExamPage.vue").catch(() => {});
  };
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(prefetchChunks, { timeout: 4000 });
  } else {
    setTimeout(prefetchChunks, 2500);
  }
});
</script>

<template>
  <main
    class="home-page relative min-h-screen overflow-hidden px-6 py-14 pb-18 font-sans text-[#0b1f45] md:py-16 lg:py-[56px]"
  >
    <!-- 鼠标跟随背景层（渐变底色 + 光斑 + 网格） -->
    <BackgroundFx />

    <section class="relative z-[1] w-full max-w-[980px] mx-auto text-center">
      <div class="text-sm tracking-[0.28em] text-[#5c6f94] font-bold">
        极简 · 精炼 · 可视化
      </div>

      <LogoBrand />

      <h1 class="mt-[42px] mb-[18px] text-[clamp(63px,7vw,102px)] leading-[1.05] tracking-[-0.045em] font-[850]">
        把<span class="text-[#1B3FA1] font-mono mx-6">408</span>学薄一点
      </h1>

      <TypeWriter />

      <GitHubRepoLink />

      <SearchBox />

      <CtaButtons />
    </section>

    <ContributorsSection />
  </main>
</template>
