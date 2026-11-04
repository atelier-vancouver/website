<script setup lang="ts">
import showdown from "showdown";
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useElementSize } from "@vueuse/core";
import AnimatedLogo from "./AnimatedLogo.vue";
import CountDownText from "./CountDownText.vue";
import EditorIcon from "./EditorIcon.vue";
import Lines from "./Lines.vue";
import MerchInkFilter from "./MerchInkFilter.vue";
import Pill from "./Pill.vue";
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

const isPresenting = ref(false);
const isFullscreenUnavailable = ref(false);
const preview = ref<HTMLElement | null>(null);
const { width: previewWidth } = useElementSize(preview);
const previewStyle = computed(() =>
  !isPresenting.value
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

// Slides keep the automatic Vancouver sunrise/sunset theme.
const isDark = useIsNight();
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
        selectStage(-1);
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
  if (isPresenting.value) {
    isPresenting.value = false;
    if (document.fullscreenElement) await document.exitFullscreen();
    return;
  }
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    isPresenting.value = true;
    try {
      await document.documentElement.requestFullscreen();
      isFullscreenUnavailable.value = false;
    } catch {
      // Presentation still works when fullscreen is unavailable.
      isFullscreenUnavailable.value = true;
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
</script>

<template>
  <div
    :class="[
      'session-board',
      'editor-layout',
      { dark: isDark, presenting: isPresenting },
    ]"
  >
    <MerchInkFilter />
    <header v-if="!isPresenting" class="editor-header">
      <div class="editor-brand">
        <a href="/" aria-label="Atelier home">
          <svg
            viewBox="0 0 22 24"
            fill="currentColor"
            aria-hidden="true"
            shape-rendering="crispEdges"
          >
            <path
              d="M3 1h14v1h1v1h1v17h-1v1H3v-1H2V2h1zm1 2v16h13V4h-1V3zM6 5h9v8H6zm2 2v4h5V7zM8 15h1v1h3v-1h1v2H8zM1 22h19v1H1z"
            />
          </svg>
        </a>
        <h1>Session</h1>
      </div>
      <div class="editor-actions">
        <button class="present-button" @click="toggleFullscreen">
          <EditorIcon name="present" />Present
        </button>
      </div>
    </header>
    <button
      v-if="isPresenting && isFullscreenUnavailable"
      class="exit-presentation"
      @click="toggleFullscreen"
    >
      <EditorIcon name="close" />Edit
    </button>
    <main class="editor-workspace">
      <div class="preview-column">
        <div class="preview-window">
          <div v-if="!isPresenting" class="preview-heading">
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
                    presets.find((p) => p.name === selectedPreset)?.stages[0]
                      .name
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
                    presets
                      .find((p) => p.name === selectedPreset)
                      ?.stages.at(-1)?.name
                "
                @click="selectStage(1)"
              >
                <EditorIcon name="right" />
              </button>
            </div>
          </div>
          <div ref="preview" class="board-preview">
            <div
              :style="previewStyle"
              :class="[
                'session-board-content',
                { 'no-cursor': !isCursorVisible && isPresenting },
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
        </div>
        <SessionStages v-if="!isPresenting" />
      </div>
      <SessionEditor v-if="!isPresenting" />
    </main>
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

    .session-board-content {
      color-scheme: dark;
    }

    .session-board-content :deep(a) {
      color: #c9c0f2;
    }

    // Invert QR codes, then screen away their now-black background so the
    // texture shows through.
    :deep(img[src^="data:image/svg+xml,"]) {
      filter: invert(1);
      mix-blend-mode: screen;
    }

    // Match both current and saved merch URLs, and invert the lettering only.
    :deep(img[src*="/merch."]) {
      filter: url(#session-merch-ink);
    }

    .session-board-content .light-container {
      display: none;
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
}
</style>
