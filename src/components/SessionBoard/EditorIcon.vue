<script setup lang="ts">
defineProps<{ name: string }>();
const paths: Record<string, string> = {
  left: "m14 6-6 6 6 6",
  right: "m10 6 6 6-6 6",
  present: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8h8v8H8z",
  close: "m6 6 12 12M6 18 18 6",
  sparkle: "m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z",
};
</script>

<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name]" />
  </svg>
</template>
