<script setup lang="ts">
import { computed } from "vue";
import {
  presets,
  selectedPreset,
  selectedPresetStage,
} from "./useSessionBoardParams";

const currentPreset = computed(
  () => presets.find((p) => p.name === selectedPreset.value) ?? presets[0],
);
const labels: Record<string, string> = {
  welcome: "Welcome",
  intro: "Intros",
  "work session1": "Focus 01",
  break: "Break",
  "work session2": "Focus 02",
  demos: "Demos",
  donations: "Donate",
  merch: "Merch",
  "luma cover": "Luma",
  "group photo logo": "Photo",
  "see you": "Goodbye",
};
</script>

<template>
  <section class="session-stages" aria-label="Slides">
    <div class="stages-heading">
      <h2><span>Slides</span></h2>
      <div class="preset-buttons" aria-label="Session preset">
        <button
          v-for="preset in presets"
          :key="preset.name"
          :aria-pressed="selectedPreset === preset.name"
          @click="preset.stages[0].set()"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>
    <ol class="stage-list">
      <li v-for="(stage, index) in currentPreset.stages" :key="stage.name">
        <button
          :aria-current="
            selectedPresetStage === stage.name ? 'step' : undefined
          "
          @click="stage.set()"
        >
          <span class="stage-number">{{
            String(index + 1).padStart(2, "0")
          }}</span>
          <span>{{ labels[stage.name] ?? stage.name }}</span>
          <span
            v-if="selectedPresetStage === stage.name"
            class="current-dot"
            aria-hidden="true"
          ></span>
        </button>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.session-stages {
  margin-top: 24px;
  border: 1px solid var(--editor-ink);
  background: var(--editor-surface);
  color: var(--editor-ink);
  box-shadow: 2px 2px 0 var(--editor-ink);
}
.stages-heading {
  border-bottom: 1px solid var(--editor-ink);
}
h2 {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 30px;
  margin: 0 5px;
  font: inherit;
  background: var(--title-stripes) 0 7px / 100% 16px no-repeat;
}
h2 span {
  background: var(--editor-surface);
  padding: 0 8px;
}
.preset-buttons {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid var(--editor-ink);
}
button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.preset-buttons button {
  background: var(--editor-surface);
  border: 1px solid var(--editor-ink);
  border-radius: 4px;
  padding: 2px 12px;
}
.preset-buttons button[aria-pressed="true"],
.preset-buttons button:active {
  background: var(--editor-ink);
  color: var(--editor-surface);
}
.stage-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  list-style: none;
  padding: 8px;
  margin: 0;
}
.stage-list button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 4px 8px;
  border: 0;
  border-radius: 0;
  background: var(--editor-surface);
  text-align: left;
}
.stage-list button:hover {
  outline: 1px dotted var(--editor-ink);
  outline-offset: -2px;
}
.stage-list button[aria-current="step"] {
  background: var(--editor-ink);
  color: var(--editor-surface);
}
.stage-number {
  font: inherit;
}
.current-dot {
  height: 4px;
  width: 4px;
  background: currentColor;
  margin-left: auto;
  flex-shrink: 0;
}
button:focus-visible {
  outline: 1px dotted var(--editor-ink);
  outline-offset: 2px;
}
@media (max-width: 1100px) {
  .stage-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 480px) {
  .stage-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
