<script setup lang="ts">
import { computed, ref } from "vue";
import EditorIcon from "./EditorIcon.vue";

defineProps<{ compact?: boolean }>();

const qotdQuestionModel = defineModel<string>("question", { required: true });

const state = ref<"loading" | "error" | "ready">("ready");

interface QotdResponse {
  questionBank: string[];
  similar: string[];
}

const questions = ref<QotdResponse | null>(null);

async function loadQuestions() {
  state.value = "loading";
  try {
    const requestUrl = new URL("/api/qotd", window.location.origin);
    requestUrl.searchParams.set(
      "date",
      new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
        new Date(),
      ),
    );
    const response = await fetch(requestUrl.toString());
    if (!response.ok) {
      console.error("Error fetching questions:", response.statusText);
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (!data.questionBank || !data.similar) {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response format");
    }
    questions.value = data as QotdResponse;
    state.value = "ready";
  } catch (error) {
    console.error("Error fetching questions:", error);
    state.value = "error";
  }
}

const questionGroups = computed(() => {
  if (!questions.value) return [];
  return [
    ["from the question bank", questions.value.questionBank] as const,
    ["similar", questions.value.similar] as const,
  ];
});
</script>

<template>
  <div :class="['gaps', { compact }]">
    <div>
      <button :disabled="state === 'loading'" @click="loadQuestions">
        <EditorIcon v-if="compact" name="sparkle" />
        {{
          compact
            ? state === "loading"
              ? "Finding questions…"
              : "Find a question"
            : "generate"
        }}
      </button>
      <span v-if="state === 'loading' && !compact">Loading...</span>
      <span v-else-if="state === 'error'" role="status"
        >Couldn’t load questions. Try again.</span
      >
    </div>
    <div>
      <section
        class="qotd-category"
        v-for="([category, questions], index) in questionGroups"
        :key="index"
      >
        <h4>{{ category }}:</h4>
        <div
          class="qotd-question"
          v-for="(question, index) in questions"
          :key="index"
        >
          <button
            v-if="compact"
            class="question-option"
            @click="qotdQuestionModel = question"
          >
            {{ question }}
          </button>
          <template v-else
            ><button @click="qotdQuestionModel = question">use this one</button
            >&nbsp;<span>{{ question }}</span></template
          >
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.qotd-category {
  margin: 1rem 0;
}

.qotd-question {
  margin: 0.3rem 0;
}

.compact {
  display: grid;
  gap: 12px;
  font-size: 12px;
  line-height: 1.5;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    font: inherit;
    color: inherit;
    border: 1px solid var(--editor-border);
    border-radius: 6px;
    padding: 11px 12px;
    background: var(--editor-accent);
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }
  button:focus-visible {
    outline: 2px solid var(--editor-ink);
    outline-offset: 3px;
  }
  .qotd-category {
    margin: 8px 0;
  }
  h4 {
    font:
      10px "IBM Plex Mono",
      monospace;
    color: var(--editor-muted);
    margin-bottom: 8px;
  }
  .question-option {
    background: var(--editor-input);
    text-align: left;
    justify-content: start;
  }
  [role="status"] {
    display: block;
    margin-top: 10px;
  }
}
</style>
