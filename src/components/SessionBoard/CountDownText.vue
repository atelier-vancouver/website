<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import bingBongJingle from "./jingles/bing-bong.mp3";
import { selectedPresetStage } from "./useSessionBoardParams";

const props = defineProps<{
  hour: number;
  minute: number;
}>();

const time = ref<string>("--:--");
watchEffect(() => {
  if (time.value !== "00:00") {
    return;
  }

  switch (selectedPresetStage.value) {
    case "work session1":
    case "break":
    case "work session2":
      new Audio(bingBongJingle).play();
      break;
  }
});

const targetDate = computed(() => {
  const countdownToDate = new Date();
  countdownToDate.setHours(props.hour);
  countdownToDate.setMinutes(props.minute);
  countdownToDate.setSeconds(0);
  countdownToDate.setMilliseconds(0);

  return countdownToDate;
});

function updateTime() {
  const diff = targetDate.value.getTime() - Date.now();
  const absDiff = Math.abs(diff);

  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

  let timeString = diff < 0 ? "-" : "";
  if (hours > 0) {
    timeString += hours.toString().padStart(2, "0") + ":";
  }
  timeString += minutes.toString().padStart(2, "0") + ":";
  timeString += seconds.toString().padStart(2, "0");
  time.value = timeString;
}

watch(
  () => [props.hour, props.minute],
  () => {
    updateTime();
  }
);

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
