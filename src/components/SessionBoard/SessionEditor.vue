<script setup lang="ts">
import { computed, ref } from "vue";
import QotdGenerator from "./QotdGenerator.vue";
import RichTextEditor from "./RichTextEditor.vue";
import {
  bottomLeftNotes,
  bottomLeftNotesSize,
  bottomLeftText,
  bottomRightNotes,
  bottomRightNotesSize,
  bottomRightText,
  centerText,
  countdownTitle,
  countdownToTime,
  mainContentState,
  qotd,
  showBottomLeftNotes,
  showBottomRightNotes,
  showTopLeftNotes,
  showTopRightNotes,
  topLeftNotes,
  topLeftNotesSize,
  topLeftText,
  topRightNotes,
  topRightNotesSize,
  topRightText,
} from "./useSessionBoardParams";

const tab = ref("Content");
const tabs = ["Content", "Notes", "Labels"];
function navigateTabs(event: KeyboardEvent) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
  const current = tabs.indexOf(tab.value);
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
          tabs.length;
  tab.value = tabs[next];
  (event.currentTarget as HTMLElement)
    .querySelectorAll<HTMLButtonElement>("button")
    [next]?.focus();
}
const cornerIndex = ref(0);
const corners = [
  {
    name: "Top left",
    notes: topLeftNotes,
    size: topLeftNotesSize,
    visible: showTopLeftNotes,
    label: topLeftText,
  },
  {
    name: "Top right",
    notes: topRightNotes,
    size: topRightNotesSize,
    visible: showTopRightNotes,
    label: topRightText,
  },
  {
    name: "Bottom left",
    notes: bottomLeftNotes,
    size: bottomLeftNotesSize,
    visible: showBottomLeftNotes,
    label: bottomLeftText,
  },
  {
    name: "Bottom right",
    notes: bottomRightNotes,
    size: bottomRightNotesSize,
    visible: showBottomRightNotes,
    label: bottomRightText,
  },
];
const corner = computed(() => corners[cornerIndex.value]);
const note = computed({
  get: () => corner.value.notes.value,
  set: (v) => (corner.value.notes.value = v),
});
const size = computed({
  get: () => corner.value.size.value,
  set: (v) => (corner.value.size.value = v),
});
const visible = computed({
  get: () => corner.value.visible.value,
  set: (v) => (corner.value.visible.value = v),
});
const label = computed({
  get: () => corner.value.label.value,
  set: (v) => (corner.value.label.value = v),
});
const modes = [
  { value: "qotd", label: "Question" },
  { value: "timer", label: "Timer" },
  { value: "text", label: "Text" },
] as const;
const deadline = computed({
  get: () =>
    `${String(countdownToTime.value.hour).padStart(2, "0")}:${String(countdownToTime.value.minute).padStart(2, "0")}`,
  set: (value: string) => {
    if (!value) return;
    const [hour, minute] = value.split(":").map(Number);
    countdownToTime.value = { hour, minute };
  },
});
function startTimer(minutes: number) {
  const end = new Date(Date.now() + minutes * 60_000);
  countdownToTime.value = { hour: end.getHours(), minute: end.getMinutes() };
}
</script>

<template>
  <aside class="session-editor" aria-label="Edit slide">
    <div class="panel-heading">
      <h2>Edit slide</h2>
      <span class="live-badge"><span></span>live</span>
    </div>
    <div
      class="editor-tabs"
      role="tablist"
      aria-label="Edit section"
      @keydown="navigateTabs"
    >
      <button
        v-for="name in tabs"
        :id="`tab-${name}`"
        :key="name"
        role="tab"
        :aria-selected="tab === name"
        :tabindex="tab === name ? 0 : -1"
        :aria-controls="`panel-${name}`"
        @click="tab = name"
      >
        {{ name }}
      </button>
    </div>
    <div
      :id="`panel-${tab}`"
      class="panel-body"
      role="tabpanel"
      :aria-labelledby="`tab-${tab}`"
    >
      <template v-if="tab === 'Content'">
        <div class="mode-buttons" aria-label="Content type">
          <button
            v-for="mode in modes"
            :key="mode.value"
            :aria-pressed="mainContentState === mode.value"
            @click="mainContentState = mode.value"
          >
            {{ mode.label }}
          </button>
        </div>
        <template v-if="mainContentState === 'qotd'">
          <label class="field"
            >Question<textarea
              v-model="qotd"
              placeholder="What’s on your mind?"
              rows="6"
            />
          </label>
          <QotdGenerator v-model:question="qotd" compact />
        </template>
        <template v-else-if="mainContentState === 'timer'">
          <label class="field">Title<input v-model="countdownTitle" /></label>
          <label class="field"
            >Ends at<input v-model="deadline" type="time"
          /></label>
          <div class="field">
            <span>Start a timer</span>
            <div class="timer-buttons">
              <button
                v-for="minutes in [10, 25, 50]"
                :key="minutes"
                @click="startTimer(minutes)"
              >
                {{ minutes }} min
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <RichTextEditor v-model="centerText" />
          <details class="html-source">
            <summary>HTML</summary>
            <textarea
              v-model="centerText"
              aria-label="Slide HTML"
              rows="8"
              spellcheck="false"
            />
          </details>
        </template>
      </template>
      <template v-else>
        <div class="corner-buttons" aria-label="Corner">
          <button
            v-for="(item, index) in corners"
            :key="item.name"
            :aria-pressed="cornerIndex === index"
            @click="cornerIndex = index"
          >
            <span
              :class="['corner-mark', `corner-${index}`]"
              aria-hidden="true"
            ></span
            >{{ item.name }}
          </button>
        </div>
        <template v-if="tab === 'Notes'">
          <div class="note-heading">
            <span>{{ corner.name }}</span
            ><button
              class="visibility-toggle"
              :aria-pressed="visible"
              @click="visible = !visible"
            >
              {{ visible ? "Visible" : "Hidden" }}
            </button>
          </div>
          <label class="field"
            ><span class="sr-only">{{ corner.name }} note</span
            ><textarea
              v-model="note"
              :aria-label="`${corner.name} note`"
              rows="8"
              placeholder="Add a note…"
            />
          </label>
          <div class="field-row">
            <span class="hint">Markdown</span>
            <div class="size-buttons" aria-label="Note size">
              <button
                v-for="(name, index) in ['S', 'M', 'L']"
                :key="name"
                :aria-pressed="size === index + 1"
                @click="size = index + 1"
              >
                {{ name }}
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <label class="field"
            >{{ corner.name }}<input v-model="label" placeholder="Add a label…"
          /></label>
          <button
            class="clock-button"
            :aria-pressed="label === ':time:'"
            @click="label = label === ':time:' ? '' : ':time:'"
          >
            Use clock
          </button>
        </template>
      </template>
    </div>
    <div class="panel-footer"><span>Changes save to this URL</span></div>
  </aside>
</template>

<style scoped>
.session-editor {
  align-self: start;
  position: sticky;
  top: 24px;
  min-width: 0;
  border: 1px solid var(--editor-border);
  border-radius: 12px;
  background: var(--editor-surface);
  overflow: hidden;
}
.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 23px 22px 20px;
}
h2 {
  font-family: Hahmlet, serif;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.06em;
}
.live-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font:
    10px "IBM Plex Mono",
    monospace;
  color: var(--editor-muted);
}
.live-badge span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #6b8759;
}
button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.editor-tabs {
  display: flex;
  gap: 23px;
  padding: 0 22px;
  border-bottom: 1px solid var(--editor-border);
}
.editor-tabs button {
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  padding: 0 0 14px;
  font-size: 13px;
  color: var(--editor-muted);
}
.editor-tabs button[aria-selected="true"] {
  color: var(--editor-ink);
  border-color: currentColor;
}
.panel-body {
  display: grid;
  gap: 22px;
  padding: 22px;
}
.mode-buttons,
.size-buttons,
.timer-buttons {
  display: flex;
  gap: 5px;
}
.mode-buttons {
  border: 1px solid var(--editor-border);
  border-radius: 7px;
  padding: 3px;
}
.mode-buttons button {
  flex: 1;
  border: 0;
  background: transparent;
  padding: 9px 5px;
  border-radius: 4px;
  font-size: 12px;
}
.mode-buttons button[aria-pressed="true"] {
  background: var(--editor-ink);
  color: var(--editor-paper);
}
.field {
  display: grid;
  gap: 10px;
  font-size: 12px;
  line-height: 1.4;
}
input,
textarea {
  color: inherit;
  font: inherit;
  font-size: 14px;
  border: 1px solid var(--editor-border);
  padding: 12px;
  width: 100%;
  border-radius: 6px;
  background: var(--editor-input);
  outline: none;
}
input:focus,
textarea:focus {
  border-color: var(--editor-ink);
  box-shadow: 0 0 0 1px var(--editor-ink);
}
textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}
.timer-buttons button,
.clock-button {
  border: 1px solid var(--editor-border);
  border-radius: 6px;
  background: transparent;
  padding: 10px 12px;
  font-size: 12px;
}
.timer-buttons button {
  flex: 1;
}
.clock-button {
  justify-self: start;
}
.corner-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}
.corner-buttons button {
  display: flex;
  align-items: center;
  gap: 9px;
  text-align: left;
  padding: 12px 9px;
  font-size: 11px;
  border: 1px solid var(--editor-border);
  border-radius: 6px;
  background: transparent;
}
.corner-buttons button[aria-pressed="true"] {
  background: var(--editor-accent);
  border-color: var(--editor-ink);
}
.corner-mark {
  display: block;
  position: relative;
  width: 17px;
  height: 13px;
  border: 1px solid var(--editor-muted);
  border-radius: 2px;
  flex-shrink: 0;
}
.corner-mark::after {
  content: "";
  position: absolute;
  width: 5px;
  height: 3px;
  background: currentColor;
}
.corner-0::after {
  top: 2px;
  left: 2px;
}
.corner-1::after {
  top: 2px;
  right: 2px;
}
.corner-2::after {
  bottom: 2px;
  left: 2px;
}
.corner-3::after {
  bottom: 2px;
  right: 2px;
}
.note-heading,
.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
.visibility-toggle {
  font-size: 11px;
  background: var(--editor-hover);
  border: 1px solid var(--editor-border);
  padding: 6px 9px;
  border-radius: 20px;
}
.visibility-toggle[aria-pressed="true"] {
  background: var(--editor-accent);
}
.hint {
  font:
    10px "IBM Plex Mono",
    monospace;
  color: var(--editor-muted);
}
.size-buttons button {
  background: transparent;
  border: 1px solid var(--editor-border);
  border-radius: 4px;
  width: 30px;
  height: 28px;
  font-size: 11px;
}
.size-buttons button[aria-pressed="true"],
.clock-button[aria-pressed="true"] {
  background: var(--editor-ink);
  color: var(--editor-paper);
}
.panel-footer {
  border-top: 1px solid var(--editor-border);
  padding: 15px 22px;
  font:
    10px "IBM Plex Mono",
    monospace;
  color: var(--editor-muted);
  line-height: 1.5;
}
.html-source summary {
  cursor: pointer;
  font:
    10px "IBM Plex Mono",
    monospace;
  color: var(--editor-muted);
}
.html-source textarea {
  margin-top: 12px;
  font:
    11px/1.6 "IBM Plex Mono",
    monospace;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
button:hover {
  filter: brightness(0.95);
}
button:focus-visible {
  outline: 2px solid var(--editor-ink);
  outline-offset: 3px;
}
@media (max-width: 860px) {
  .session-editor {
    position: static;
  }
}
</style>
