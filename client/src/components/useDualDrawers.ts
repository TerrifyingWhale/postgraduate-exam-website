import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type DualDrawerOptions = {
  leftWidth: number;
  rightWidth: number;
  compactBreakpoint?: number;
};

export function useDualDrawers({
  leftWidth,
  rightWidth,
  compactBreakpoint = 1024,
}: DualDrawerOptions) {
  const compactLayout = ref(false);
  const leftHovered = ref(false);
  const leftPinned = ref(false);
  const leftContextOpen = ref(false);
  const rightHovered = ref(false);
  const rightPinned = ref(false);

  const leftOpen = computed(() =>
    compactLayout.value
      ? leftPinned.value
      : leftPinned.value || leftHovered.value || leftContextOpen.value,
  );
  const rightOpen = computed(() =>
    compactLayout.value
      ? rightPinned.value
      : rightPinned.value || rightHovered.value,
  );
  const columns = computed(() =>
    compactLayout.value
      ? "minmax(0,1fr)"
      : `${leftOpen.value ? leftWidth : 0}px minmax(0,1fr) ${rightOpen.value ? rightWidth : 0}px`,
  );

  function closeCompactDrawers() {
    leftPinned.value = false;
    leftHovered.value = false;
    rightPinned.value = false;
    rightHovered.value = false;
  }

  function updateLayoutMode() {
    compactLayout.value = window.innerWidth < compactBreakpoint;
  }

  onMounted(() => {
    updateLayoutMode();
    window.addEventListener("resize", updateLayoutMode, { passive: true });
  });
  onBeforeUnmount(() => window.removeEventListener("resize", updateLayoutMode));

  return {
    closeCompactDrawers,
    columns,
    compactLayout,
    leftContextOpen,
    leftHovered,
    leftOpen,
    leftPinned,
    rightHovered,
    rightOpen,
    rightPinned,
  };
}
