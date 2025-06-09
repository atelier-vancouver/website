<script setup lang="ts">
import { useElementSize } from "@vueuse/core";
import { useTemplateRef } from "vue";

const el = useTemplateRef("el");
const size = useElementSize(el);
</script>

<template>
  <div ref="el" className="lines-container">
    <svg
      v-if="size"
      :viewBox="`0 0 ${size.width.value} ${size.height.value}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0"
        y="0"
        :width="size.width.value"
        :height="size.height.value"
        fill="none"
        stroke="#262626"
        stroke-opacity="0.5"
        stroke-width="3"
        :stroke-dasharray="size.width.value / 500"
      />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.lines-container {
  position: absolute;
  inset: 2.5rem;
  z-index: -2;
}
</style>
