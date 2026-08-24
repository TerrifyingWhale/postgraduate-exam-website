import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const LEFT_DRAWER_WIDTH = 304;
const RIGHT_DRAWER_WIDTH = 270;

export function useReaderDrawers() {
  const compactLayout = ref(false);
  const leftHovered = ref(false);
  const leftPinned = ref(false);
  const leftQueryActive = ref(false);
  const rightHovered = ref(false);
  const rightPinned = ref(false);

  const leftOpen = computed(() =>
    compactLayout.value
      ? leftPinned.value
      : leftPinned.value || leftHovered.value || leftQueryActive.value,
  );
  const rightOpen = computed(() =>
    compactLayout.value
      ? rightPinned.value
      : rightPinned.value || rightHovered.value,
  );
  const readerColumns = computed(() =>
    compactLayout.value
      ? "minmax(0,1fr)"
      : `${leftOpen.value ? LEFT_DRAWER_WIDTH : 0}px minmax(0,1fr) ${rightOpen.value ? RIGHT_DRAWER_WIDTH : 0}px`,
  );

  function closeMobileDrawers() {
    leftPinned.value = false;
    leftHovered.value = false;
    rightPinned.value = false;
    rightHovered.value = false;
  }

  function updateLayoutMode() {
    compactLayout.value = window.innerWidth < 1024;
  }

  onMounted(() => {
    updateLayoutMode();
    window.addEventListener("resize", updateLayoutMode, { passive: true });
  });
  onBeforeUnmount(() => window.removeEventListener("resize", updateLayoutMode));

  return {
    closeMobileDrawers,
    compactLayout,
    leftHovered,
    leftOpen,
    leftPinned,
    leftQueryActive,
    readerColumns,
    rightHovered,
    rightOpen,
    rightPinned,
  };
}
