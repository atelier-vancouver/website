<script setup lang="ts">
import TimeText from "./TimeText.vue";

const props = defineProps<{
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  text?: string;
}>();
</script>

<template>
  <div :class="['pill', ...props.position.split('-')]" v-if="props.text">
    <span class="tnum" v-if="props.text === ':time:'">
      <TimeText />
    </span>
    <span v-else>{{ props.text }}</span>
  </div>
</template>

<style lang="scss" scoped>
.pill {
  position: absolute;

  z-index: -1;

  font-weight: 600;

  font-size: 1.2rem;
  text-box: trim-both cap alphabetic;

  text-align: center;
  text-transform: uppercase;
  letter-spacing: -0.07em;
  padding: 0.25em 0.5em;
  border-radius: 9999px;
  border: 0.15em solid currentColor;
  color: #1c1c1c;

  width: fit-content;

  &::after {
    content: "";

    position: absolute;
    inset: -1rem;
    z-index: -1;
    background: radial-gradient(#f6f2ee 60%, transparent);
    mix-blend-mode: overlay;
  }

  &.left {
    left: 1.25rem;
  }
  &.right {
    right: 1.25rem;
  }
  &.top {
    top: 2.5rem;
    transform: translateY(-50%);
  }
  &.bottom {
    bottom: 2.5rem;
    transform: translateY(50%);
  }

  .tnum {
    font-feature-settings: "tnum";
  }
}
</style>
