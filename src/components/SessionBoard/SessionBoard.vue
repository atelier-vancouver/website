<script setup lang="ts">
import logo from "@/assets/images/session-board/logo.svg?url";
import showdown from "showdown";
import { computed, onMounted, onUnmounted, ref } from "vue";
import CountDownText from "./CountDownText.vue";
import Lines from "./Lines.vue";
import Pill from "./Pill.vue";
import QotdGenerator from "./QotdGenerator.vue";
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
  presets,
  qotd,
  qotdLocation,
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
  let screenLock: Promise<WakeLockSentinel> | undefined;
  try {
    screenLock = navigator.wakeLock.request("screen");
  } catch (error) {
    console.log(error);
  }

  onUnmounted(() => {
    screenLock?.then((l) => l.release());
  });
});

// keyboard shortcuts
function selectStage(offset: number) {
  const preset = presets.find((p) => p.name === selectedPreset.value);
  if (!preset) {
    return;
  }
  const currentIndex = preset.stages.findIndex(
    (s) => s.name === selectedPresetStage.value
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
      e.target instanceof HTMLTextAreaElement
    ) {
      return; // ignore key events in input fields
    }
    switch (e.key) {
      case "f":
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        selectStage(1);
        break;
    }
  }

  window.addEventListener("keydown", onKeyDown);
  onUnmounted(() => window.removeEventListener("keydown", onKeyDown));
});

const converter = new showdown.Converter();
const topLeftNotesHtml = computed(() =>
  topLeftNotes.value ? converter.makeHtml(topLeftNotes.value) : undefined
);
const topRightNotesHtml = computed(() =>
  topRightNotes.value ? converter.makeHtml(topRightNotes.value) : undefined
);
const bottomLeftNotesHtml = computed(() =>
  bottomLeftNotes.value ? converter.makeHtml(bottomLeftNotes.value) : undefined
);
const bottomRightNotesHtml = computed(() =>
  bottomRightNotes.value
    ? converter.makeHtml(bottomRightNotes.value)
    : undefined
);

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

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
  <div className="session-board">
    <div :class="['session-board-content', { 'no-cursor': !isCursorVisible }]">
      <Lines />

      <Pill position="top-left" :text="topLeftText" />
      <Pill position="top-right" :text="topRightText" />
      <Pill position="bottom-left" :text="bottomLeftText" />
      <Pill position="bottom-right" :text="bottomRightText" />

      <div class="logo-container">
        <div class="logo-wrapper">
          <img class="logo" :src="logo" alt="Atelier" />
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
        <div class="text" v-else-if="mainContentState === 'text'">
          <p>{{ centerText }}</p>
        </div>
      </div>

      <div class="notes">
        <div
          v-if="topLeftNotesHtml"
          :class="['top', 'left', `size-${topLeftNotesSize}`]"
          v-html="topLeftNotesHtml"
        />
        <div
          v-if="topRightNotesHtml"
          :class="['top', 'right', `size-${topRightNotesSize}`]"
          v-html="topRightNotesHtml"
        />
        <div
          v-if="bottomLeftNotesHtml"
          :class="['bottom', 'left', `size-${bottomLeftNotesSize}`]"
          v-html="bottomLeftNotesHtml"
        />
        <div
          v-if="bottomRightNotesHtml"
          :class="['bottom', 'right', `size-${bottomRightNotesSize}`]"
          v-html="bottomRightNotesHtml"
        />
      </div>
    </div>
    <div class="session-board-config gaps">
      <div>
        <button @click="toggleFullscreen">fullscreen</button> (use "f" key to
        toggle fullscreen)
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

      <details>
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

          <details>
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
                <QotdGenerator
                  v-model:question="qotd"
                  v-model:location="qotdLocation"
                />
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
      <details>
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
:global(html) {
  scrollbar-width: none;
}

:global(body) {
  background-color: #f6f2ee;
}

.session-board {
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
      color: #919191;
      font-weight: 500;
    }

    :deep(p),
    :deep(ol) {
      margin: 0;
      font-size: 2.5rem;
      color: #000;
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

      .qotd,
      .text {
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
          background: radial-gradient(#f6f2ee 60%, transparent);
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
