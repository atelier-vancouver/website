<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const time = ref<string>("00:00 PM");

function updateTime() {
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const dateTimeString = `${dateFormatter.format(new Date())} ${timeFormatter.format(
    new Date()
  )}`;

  time.value = dateTimeString;
}

onMounted(() => {
  updateTime();

  const intervalId = setInterval(updateTime, 1000);

  onUnmounted(() => {
    clearInterval(intervalId);
  });
});
</script>

<template>
  {{ time }}
</template>
