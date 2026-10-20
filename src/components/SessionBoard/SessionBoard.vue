<script setup lang="ts">
import showdown from "showdown";
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import logoUrl from "@/assets/images/session-board/logo.svg?url";
import { useElementSize } from "@vueuse/core";
import AnimatedLogo from "./AnimatedLogo.vue";
import CountDownText from "./CountDownText.vue";
import EditorIcon from "./EditorIcon.vue";
import Lines from "./Lines.vue";
import MerchInkFilter from "./MerchInkFilter.vue";
import Pill from "./Pill.vue";
import QotdGenerator from "./QotdGenerator.vue";
import SessionEditor from "./SessionEditor.vue";
import SessionStages from "./SessionStages.vue";
import { useIsNight } from "./useIsNight";
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
  isParamsEmpty,
  mainContentState,
  presets,
  qotd,
  reset,
  selectedPreset,
  selectedPresetStage,
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

const props = withDefaults(defineProps<{ newEditor?: boolean }>(), {
  newEditor: false,
});
const isPresenting = ref(false);
const preview = ref<HTMLElement | null>(null);
const { width: previewWidth } = useElementSize(preview);
const previewStyle = computed(() =>
  props.newEditor && !isPresenting.value
    ? {
        width: "1440px",
        height: "900px",
        transform: `scale(${previewWidth.value / 1440})`,
        transformOrigin: "top left",
      }
    : undefined,
);

// set preset to UBC on weekends and Weeknights on weekdays
onMounted(() => {
  if (isParamsEmpty.value) {
    const date = new Date();
    const day = date.getDay();

    if (day === 0 || day === 6) {
      // Sunday or Saturday
      presets.find((p) => p.name === "UBC")?.stages[0].set();
    } else {
      // Weeknights
      presets.find((p) => p.name === "Weeknights")?.stages[0].set();
    }
  }
});

// dark mode between Vancouver sunset and sunrise, unless overridden
const isNight = useIsNight();
const themeOverride = ref<"auto" | "light" | "dark">("auto");
const isDark = computed(() =>
  themeOverride.value === "auto"
    ? isNight.value
    : themeOverride.value === "dark",
);
watchEffect(() => {
  document.documentElement.classList.toggle("session-board-dark", isDark.value);
});
onUnmounted(() => {
  document.documentElement.classList.remove("session-board-dark");
});

// hide the cursor after 5 seconds of inactivity
const isCursorVisible = ref(true);
const CURSOR_TIMEOUT = 5_000;
onMounted(() => {
  let timeout: NodeJS.Timeout | undefined;
  window.addEventListener("pointermove", () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    isCursorVisible.value = true;
    timeout = setTimeout(() => {
      isCursorVisible.value = false;
    }, CURSOR_TIMEOUT);
  });

  if (!props.newEditor)
    window.addEventListener(
      "scroll",
      () => {
        // once scroll almost all the way to the top, blur all inputs
        if (window.scrollY < 100) {
          document.querySelectorAll("input, textarea, button").forEach((el) => {
            if (
              el instanceof HTMLInputElement ||
              el instanceof HTMLTextAreaElement ||
              el instanceof HTMLButtonElement
            ) {
              el.blur();
            }
          });
        }
      },
      { passive: true },
    );
});

// keeps the screen awake
onMounted(() => {
  let screenLock: WakeLockSentinel | undefined;
  let retryInterval: ReturnType<typeof setInterval>;

  retryInterval = setInterval(async () => {
    if (screenLock && !screenLock.released) {
      return;
    }
    if (document.hidden) {
      return;
    }
    try {
      screenLock = await navigator.wakeLock.request("screen");
    } catch (error) {
      console.log(error);
    }
  }, 10_000); // every 10s

  onUnmounted(async () => {
    if (retryInterval) {
      clearInterval(retryInterval);
    }
    await screenLock?.release();
    screenLock = undefined;
  });
});

// keyboard shortcuts
function selectStage(offset: number) {
  const preset = presets.find((p) => p.name === selectedPreset.value);
  if (!preset) {
    return;
  }
  const currentIndex = preset.stages.findIndex(
    (s) => s.name === selectedPresetStage.value,
  );
  if (currentIndex < 0) {
    return;
  }
  const stage = preset.stages[currentIndex + offset];
  if (!stage) {
    return;
  }
  stage.set();
}
onMounted(() => {
  function onKeyDown(e: KeyboardEvent) {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      (e.target instanceof HTMLElement && e.target.isContentEditable)
    ) {
      return; // ignore key events in input fields
    }
    switch (e.key) {
      case "F":
      case "f":
        e.preventDefault();
        toggleFullscreen();
        break;
      case "ArrowRight":
        e.preventDefault();
        selectStage(1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (props.newEditor) selectStage(-1);
        else window.history.back();
        break;
    }
  }

  window.addEventListener("keydown", onKeyDown);
  onUnmounted(() => window.removeEventListener("keydown", onKeyDown));
});

const converter = new showdown.Converter();
const topLeftNotesHtml = computed(() =>
  topLeftNotes.value ? converter.makeHtml(topLeftNotes.value) : undefined,
);
const topRightNotesHtml = computed(() =>
  topRightNotes.value ? converter.makeHtml(topRightNotes.value) : undefined,
);
const bottomLeftNotesHtml = computed(() =>
  bottomLeftNotes.value ? converter.makeHtml(bottomLeftNotes.value) : undefined,
);
const bottomRightNotesHtml = computed(() =>
  bottomRightNotes.value
    ? converter.makeHtml(bottomRightNotes.value)
    : undefined,
);

async function toggleFullscreen() {
  if (props.newEditor && isPresenting.value) {
    isPresenting.value = false;
    if (document.fullscreenElement) await document.exitFullscreen();
    return;
  }
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    if (props.newEditor) isPresenting.value = true;
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Presentation still works when fullscreen is unavailable.
    }
  }
}

onMounted(() => {
  const onFullscreenChange = () => {
    if (!document.fullscreenElement) isPresenting.value = false;
  };
  const onEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") isPresenting.value = false;
  };
  document.addEventListener("fullscreenchange", onFullscreenChange);
  window.addEventListener("keydown", onEscape);
  onUnmounted(() => {
    document.removeEventListener("fullscreenchange", onFullscreenChange);
    window.removeEventListener("keydown", onEscape);
  });
});

const countdownToTimeString = computed({
  get() {
    return `${countdownToTime.value.hour.toString()}:${countdownToTime.value.minute.toString().padStart(2, "0")}`;
  },
  set(value: string) {
    const [hour, minute] = value.split(":").map(Number);
    countdownToTime.value = {
      hour: hour,
      minute: minute,
    };
  },
});
</script>

<template>
  <div
    :class="[
      'session-board',
      { dark: isDark, 'new-editor': newEditor, presenting: isPresenting },
    ]"
  >
    <MerchInkFilter />
    <header v-if="newEditor && !isPresenting" class="editor-header">
      <div class="editor-brand">
        <a href="/" aria-label="Atelier home"
          ><img :src="logoUrl" alt="Atelier"
        /></a>
        <span class="brand-divider"></span>
        <h1>Session</h1>
        <span class="edition">new</span>
      </div>
      <div class="editor-actions">
        <div class="theme-buttons" aria-label="Theme">
          <button
            v-for="theme in ['auto', 'light', 'dark'] as const"
            :key="theme"
            :aria-pressed="themeOverride === theme"
            @click="themeOverride = theme"
          >
            {{ theme }}
          </button>
        </div>
        <button class="present-button" @click="toggleFullscreen">
          <EditorIcon name="present" />Present
        </button>
      </div>
    </header>
    <button
      v-if="newEditor && isPresenting"
      class="exit-presentation"
      @click="toggleFullscreen"
    >
      <EditorIcon name="close" />Edit
    </button>
    <main :class="{ 'editor-workspace': newEditor }">
      <div :class="{ 'preview-column': newEditor }">
        <div v-if="newEditor && !isPresenting" class="preview-heading">
          <span
            >Preview
            <span class="preview-stage">{{
              selectedPresetStage?.replace("work session", "focus ")
            }}</span></span
          >
          <div class="slide-navigation">
            <button
              aria-label="Previous slide"
              :disabled="
                !selectedPreset ||
                selectedPresetStage ===
                  presets.find((p) => p.name === selectedPreset)?.stages[0].name
              "
              @click="selectStage(-1)"
            >
              <EditorIcon name="left" />
            </button>
            <button
              aria-label="Next slide"
              :disabled="
                !selectedPreset ||
                selectedPresetStage ===
                  presets.find((p) => p.name === selectedPreset)?.stages.at(-1)
                    ?.name
              "
              @click="selectStage(1)"
            >
              <EditorIcon name="right" />
            </button>
          </div>
        </div>
        <div ref="preview" :class="{ 'board-preview': newEditor }">
          <div
            :style="previewStyle"
            :class="[
              'session-board-content',
              { 'no-cursor': !isCursorVisible && (!newEditor || isPresenting) },
            ]"
          >
            <Lines />

            <Pill position="top-left" :text="topLeftText" />
            <Pill position="top-right" :text="topRightText" />
            <Pill position="bottom-left" :text="bottomLeftText" />
            <Pill position="bottom-right" :text="bottomRightText" />

            <div class="logo-container">
              <div class="logo-wrapper">
                <AnimatedLogo class="logo" />
              </div>
            </div>

            <div class="grain-container">
              <slot name="grain" />
            </div>
            <div class="light-container">
              <slot name="light" />
            </div>

            <div class="main-content">
              <div class="qotd" v-if="mainContentState === 'qotd'">
                <h1>QUESTION OF THE DAY</h1>
                <p>{{ qotd }}</p>
              </div>
              <div class="timer" v-else-if="mainContentState === 'timer'">
                <h1>{{ countdownTitle }}</h1>
                <div class="countdown">
                  <span class="tnum">
                    <CountDownText
                      :hour="countdownToTime.hour"
                      :minute="countdownToTime.minute"
                    />
                  </span>
                </div>
                <div class="countdown-to">
                  at
                  <span class="tnum"
                    >{{ countdownToTime.hour % 12 || 12 }}:{{
                      countdownToTime.minute.toString().padStart(2, "0")
                    }}</span
                  >
                </div>
              </div>
              <div
                class="text"
                v-else-if="mainContentState === 'text'"
                v-html="centerText"
              ></div>
            </div>

            <div class="notes">
              <div
                v-if="topLeftNotesHtml && showTopLeftNotes"
                :class="['top', 'left', `size-${topLeftNotesSize}`]"
                v-html="topLeftNotesHtml"
              />
              <div
                v-if="topRightNotesHtml && showTopRightNotes"
                :class="['top', 'right', `size-${topRightNotesSize}`]"
                v-html="topRightNotesHtml"
              />
              <div
                v-if="bottomLeftNotesHtml && showBottomLeftNotes"
                :class="['bottom', 'left', `size-${bottomLeftNotesSize}`]"
                v-html="bottomLeftNotesHtml"
              />
              <div
                v-if="bottomRightNotesHtml && showBottomRightNotes"
                :class="['bottom', 'right', `size-${bottomRightNotesSize}`]"
                v-html="bottomRightNotesHtml"
              />
            </div>
          </div>
        </div>
        <SessionStages v-if="newEditor && !isPresenting" />
      </div>
      <SessionEditor v-if="newEditor && !isPresenting" />
    </main>
    <div v-if="!newEditor" class="session-board-config gaps">
      <div>
        <button @click="toggleFullscreen">fullscreen</button> (use "f" key to
        toggle fullscreen)
      </div>
      <div>
        theme:
        <select v-model="themeOverride">
          <option value="auto">auto (dark after sunset)</option>
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </div>
      <div>presets: (use → keys to go to the next stage)</div>
      <div
        v-for="preset in presets"
        :key="preset.name"
        :class="['preset', { selected: preset.name === selectedPreset }]"
      >
        {{ preset.name }}:
        <button
          v-for="stage in preset.stages"
          :key="stage.name"
          :class="[
            'stage',
            {
              selected:
                preset.name === selectedPreset &&
                stage.name === selectedPresetStage,
            },
          ]"
          @click="stage.set"
        >
          {{ stage.name }}
        </button>
      </div>
      <div>
        <button @click="reset">reset</button>
      </div>

      <details open>
        <summary>content:</summary>
        <div className="content-config gaps">
          <div>
            mode:
            <label>
              <input
                type="radio"
                :checked="mainContentState === 'qotd'"
                @change="mainContentState = 'qotd'"
              />
              QOTD
            </label>
            <label>
              <input
                type="radio"
                :checked="mainContentState === 'timer'"
                @change="mainContentState = 'timer'"
              />
              timer
            </label>
            <label>
              <input
                type="radio"
                :checked="mainContentState === 'text'"
                @change="mainContentState = 'text'"
              />
              text
            </label>
          </div>

          <details open>
            <summary>QOTD:</summary>
            <div class="gaps">
              <div>
                QOTD:
                <div>
                  <textarea v-model="qotd" />
                </div>
              </div>
              <div>
                QOTD Generator:
                <QotdGenerator v-model:question="qotd" />
              </div>
            </div>
          </details>

          <details>
            <summary>Timer:</summary>
            <div class="gaps">
              <div>
                title:
                <div>
                  <textarea v-model="countdownTitle" />
                </div>
              </div>
              <div>
                countdown to:
                <input type="time" v-model="countdownToTimeString" />
              </div>
            </div>
          </details>

          <details>
            <summary>text:</summary>
            <div>
              text:
              <div>
                <textarea v-model="centerText" />
              </div>
            </div>
          </details>
        </div>
      </details>
      <details open>
        <summary>notes:</summary>
        <div class="notes-config">
          <div>
            top left:
            <div>
              <label>
                <input type="checkbox" v-model="showTopLeftNotes" />
                show
              </label>
            </div>
            <div>markdown:</div>
            <div>
              <textarea v-model="topLeftNotes" />
            </div>
            <div>
              size:
              <input
                type="range"
                min="1"
                max="3"
                v-model.number="topLeftNotesSize"
              />
            </div>
          </div>

          <div>
            top right:
            <div>
              <label>
                <input type="checkbox" v-model="showTopRightNotes" />
                show
              </label>
            </div>
            <div>markdown:</div>
            <div>
              <textarea v-model="topRightNotes" />
            </div>
            <div>
              size:
              <input
                type="range"
                min="1"
                max="3"
                v-model.number="topRightNotesSize"
              />
            </div>
          </div>
        </div>

        <div class="notes-config">
          <div>
            bottom left:
            <div>
              <label>
                <input type="checkbox" v-model="showBottomLeftNotes" />
                show
              </label>
            </div>
            <div>markdown:</div>
            <div>
              <textarea v-model="bottomLeftNotes" />
            </div>
            <div>
              size:
              <input
                type="range"
                min="1"
                max="3"
                v-model.number="bottomLeftNotesSize"
              />
            </div>
          </div>

          <div>
            bottom right:
            <div>
              <label>
                <input type="checkbox" v-model="showBottomRightNotes" />
                show
              </label>
            </div>
            <div>markdown:</div>
            <div>
              <textarea v-model="bottomRightNotes" />
            </div>
            <div>
              size:
              <input
                type="range"
                min="1"
                max="3"
                v-model.number="bottomRightNotesSize"
              />
            </div>
          </div>
        </div>
      </details>

      <details>
        <summary>pills:</summary>
        <div class="pill-config">
          <input class="top left" v-model="topLeftText" />
          <input class="top right" v-model="topRightText" />
          <input class="bottom left" v-model="bottomLeftText" />
          <input class="bottom right" v-model="bottomRightText" />
        </div>
      </details>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./session-editor";

:global(html) {
  scrollbar-width: none;
}

:global(body) {
  background-color: #f6f2ee;
}

:global(html.session-board-dark body) {
  background-color: #141210;
}

.session-board {
  --session-bg: #f6f2ee;
  --session-text: #000;
  --session-ink: #1c1c1c;
  --session-muted: #919191;
  --session-line: #262626;
  --session-glow: #fff;
  --session-logo-filter: none;
  --session-grain-opacity: 1;

  color: var(--session-text);

  &.dark {
    --session-bg: #141210;
    --session-text: #f6f2ee;
    --session-ink: #ece7e2;
    --session-muted: #8a837d;
    --session-line: #d9d3cd;
    --session-glow: #000;
    --session-logo-filter: invert(1);
    --session-grain-opacity: 0.35;

    color-scheme: dark;

    :deep(a) {
      color: #c9c0f2;
    }

    // QR codes need a light background to scan
    :deep(img[src^="data:image/svg+xml,"]) {
      background: white;
      padding: 0.5rem;
      border-radius: 0.25rem;
    }

    // Match both current and saved merch URLs, and invert the lettering only.
    :deep(img[src*="/merch."]) {
      filter: url(#session-merch-ink);
    }

    .session-board-content .light-container {
      display: none;
    }

    .session-board-config {
      background-color: #1c1a18;
      color: var(--session-text);
    }
  }

  .tnum {
    font-feature-settings: "tnum";
  }

  .session-board-content {
    position: relative;
    height: 100vh;

    &.no-cursor {
      cursor: none;
    }

    :deep(h1) {
      margin: 0;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--session-muted);
      font-weight: 500;
    }

    .main-content .text,
    :deep(p),
    :deep(ol) {
      margin: 0;
      font-size: 2.5rem;
      color: var(--session-text);
      letter-spacing: -0.02em;
      font-weight: 400;
    }

    .main-content {
      height: 100%;
      text-align: center;
      align-content: center;

      h1 {
        margin-bottom: 3rem;
      }

      .qotd {
        p {
          white-space: pre-wrap;
        }
      }

      & > div:not(.text) {
        margin-top: -5rem;
      }

      .countdown {
        font-size: 7rem;
        font-weight: 600;
        color: rgb(from currentColor r g b / 0.7);
      }

      .countdown-to {
        margin-top: 1rem;
        font-size: 1.5rem;
        font-weight: 600;
        color: rgb(from currentColor r g b / 0.6);
      }
    }

    .notes {
      .size-1 {
        :deep(p),
        :deep(ol) {
          font-size: 1.7rem;
          font-weight: 500;
          color: rgb(from currentColor r g b / 0.8);
        }
      }
      .size-2 {
        :deep(p),
        :deep(ol) {
          font-size: 2rem;
        }
      }

      .top,
      .bottom,
      .left,
      .right {
        position: absolute;
        text-box: trim-both cap alphabetic;
      }

      .top {
        top: 5rem;
      }

      .bottom {
        bottom: 4rem;
      }

      .left {
        left: 4rem;
      }

      .right {
        right: 4rem;
      }
    }

    .grain-container,
    .light-container {
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;

      :deep(img) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .light-container {
      mix-blend-mode: exclusion;
      opacity: 0.9;

      :deep(img) {
        object-position: left top;
      }
    }

    .grain-container {
      mix-blend-mode: soft-light;
      opacity: var(--session-grain-opacity);

      :deep(img) {
        object-position: center;
        mix-blend-mode: soft-light;
      }
    }

    .lines-container {
      position: absolute;
      inset: 2.5rem;
      z-index: -2;
    }

    .pill {
      position: absolute;

      z-index: -1;

      font-weight: 600;
      // use inter fixed width numbers

      font-size: 1.2rem;
      text-box: trim-both cap alphabetic;

      text-align: center;
      text-transform: uppercase;
      letter-spacing: -0.07em;
      padding: 0.25em 0.5em;
      border-radius: 9999px;
      border: 0.15em solid currentColor;
      color: var(--session-ink);

      width: fit-content;

      &::after {
        content: "";

        position: absolute;
        inset: -1rem;
        z-index: -1;
        background: radial-gradient(var(--session-bg) 60%, transparent);
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
    }

    .logo-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      .logo-wrapper {
        position: relative;
        width: fit-content;
        margin: 0 auto;

        .logo {
          display: block;

          height: 5rem;
        }

        &::after {
          content: "";

          position: absolute;
          inset: -1rem;
          z-index: -1;
          background: radial-gradient(var(--session-bg) 60%, transparent);
        }
      }
    }
  }

  .gaps {
    display: grid;
    gap: 1rem;
  }

  .session-board-config {
    background-color: white;
    padding: 1rem;

    .preset {
      &.selected {
        border: 1px solid #000;
        padding: 4px;
      }

      button {
        &.selected {
          outline: 1px solid #000;
          outline-offset: 2px;
        }

        margin: 4px;
      }
    }

    textarea {
      width: 500px;
      height: 200px;
    }

    details details {
      margin-left: 1rem;
    }

    .notes-config {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      margin-top: 1rem;
    }

    .pill-config {
      position: relative;
      border: 1px solid #000;
      width: 400px;
      height: 200px;

      & > input {
        position: absolute;

        &.top {
          top: 0;
        }
        &.bottom {
          bottom: 0;
        }
        &.left {
          left: 0;
        }
        &.right {
          right: 0;
        }
      }
    }
  }
}
</style>
