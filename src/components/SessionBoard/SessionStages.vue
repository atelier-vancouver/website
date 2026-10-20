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
      <h2>Slides</h2>
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
  margin-top: 28px;
}
.stages-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
h2 {
  font-family: Hahmlet, serif;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.06em;
}
.preset-buttons {
  display: flex;
  padding: 3px;
  border: 1px solid var(--editor-border);
  border-radius: 8px;
}
button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.preset-buttons button {
  background: transparent;
  border: 0;
  border-radius: 5px;
  padding: 7px 12px;
  font-size: 12px;
}
.preset-buttons button[aria-pressed="true"] {
  background: var(--editor-ink);
  color: var(--editor-paper);
}
.stage-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.stage-list button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 12px;
  border: 1px solid var(--editor-border);
  border-radius: 7px;
  background: var(--editor-surface);
  text-align: left;
  font-size: 13px;
  transition:
    background 120ms,
    transform 120ms;
}
.stage-list button:hover {
  background: var(--editor-hover);
  transform: translateY(-1px);
}
.stage-list button[aria-current="step"] {
  border-color: var(--editor-ink);
  background: var(--editor-accent);
  box-shadow: 2px 2px 0 var(--editor-ink);
}
.stage-number {
  font:
    10px "IBM Plex Mono",
    monospace;
  color: var(--editor-muted);
}
.current-dot {
  height: 5px;
  width: 5px;
  background: currentColor;
  border-radius: 50%;
  margin-left: auto;
  flex-shrink: 0;
}
button:focus-visible {
  outline: 2px solid var(--editor-ink);
  outline-offset: 3px;
}
@media (max-width: 1150px) {
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
