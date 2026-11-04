<script setup lang="ts">
import { computed, ref } from "vue";
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
        <label v-if="mainContentState === 'qotd'" class="field"
          >Question<textarea
            v-model="qotd"
            placeholder="What’s on your mind?"
            rows="6"
          />
        </label>
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
            <svg
              class="corner-mark"
              viewBox="0 0 17 13"
              aria-hidden="true"
              shape-rendering="crispEdges"
            >
              <path d="M.5.5h16v12H.5z" fill="none" stroke="currentColor" />
              <rect
                :x="index % 2 ? 10 : 3"
                :y="index > 1 ? 8 : 3"
                width="4"
                height="2"
                fill="currentColor"
              /></svg
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
  top: 20px;
  min-width: 0;
  border: 1px solid var(--editor-ink);
  background: var(--editor-surface);
  color: var(--editor-ink);
  box-shadow: 2px 2px 0 var(--editor-ink);
}
.panel-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  margin: 0 5px;
  background: var(--title-stripes) 0 7px / 100% 16px no-repeat;
}
h2 {
  padding: 0 8px;
  background: var(--editor-surface);
  font: inherit;
}
.live-badge {
  display: none;
}
button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.editor-tabs {
  display: flex;
  padding: 10px 12px;
  border-block: 1px solid var(--editor-ink);
}
.editor-tabs button {
  flex: 1;
  padding: 2px 6px;
  background: var(--editor-surface);
  border: 1px solid var(--editor-ink);
  border-radius: 0;
}
.editor-tabs button + button {
  border-left: 0;
}
.editor-tabs button[aria-selected="true"] {
  background: var(--editor-ink);
  color: var(--editor-surface);
}
.panel-body {
  display: grid;
  gap: 20px;
  padding: 18px 16px;
}
.mode-buttons,
.size-buttons,
.timer-buttons {
  display: flex;
  gap: 8px;
}
.mode-buttons button,
.timer-buttons button {
  flex: 1;
}
button {
  padding: 2px 8px;
  border: 1px solid var(--editor-ink);
  border-radius: 4px;
  background: var(--editor-surface);
}
button:active,
button[aria-pressed="true"] {
  background: var(--editor-ink);
  color: var(--editor-surface);
}
.field {
  display: grid;
  gap: 8px;
  line-height: 1;
}
input,
textarea {
  color: var(--editor-ink);
  font: inherit;
  border: 1px solid var(--editor-ink);
  padding: 8px;
  width: 100%;
  border-radius: 0;
  background: var(--editor-surface);
  outline: none;
}
input:focus,
textarea:focus {
  outline: 1px solid var(--editor-ink);
  outline-offset: 1px;
}
textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.15;
}
textarea::placeholder {
  color: var(--editor-muted);
}
.clock-button {
  justify-self: start;
}
.corner-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.corner-buttons button {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  padding: 4px 8px;
}
.corner-mark {
  width: 17px;
  height: 13px;
  flex-shrink: 0;
}
.note-heading,
.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.size-buttons button {
  width: 28px;
  padding: 2px 0;
}
.panel-footer {
  border-top: 1px solid var(--editor-ink);
  padding: 8px 16px;
  line-height: 1;
}
.hint {
  color: var(--editor-ink);
}
.html-source summary {
  cursor: pointer;
}
.html-source textarea {
  margin-top: 8px;
  font: 12px/1.5 monospace;
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
button:focus-visible {
  outline: 1px dotted var(--editor-ink);
  outline-offset: 3px;
}
@media (max-width: 860px) {
  .session-editor {
    position: static;
  }
}
</style>
