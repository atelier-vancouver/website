<script setup lang="ts">
import { computed, ref } from "vue";

const qotdQuestionModel = defineModel<string>("question", { required: true });
const qotdLocationModel = defineModel<string>("location", { required: true });

const state = ref<"loading" | "error" | "ready">("ready");
const questions = ref<string[]>([]);

async function loadQuestions() {
  state.value = "loading";
  try {
    const requestUrl = new URL("/api/qotd", window.location.origin);
    requestUrl.searchParams.set("location", qotdLocationModel.value);
    requestUrl.searchParams.set(
      "date",
      new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(new Date())
    );
    const response = await fetch(requestUrl.toString());
    if (!response.ok) {
      console.error("Error fetching questions:", response.statusText);
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const newQuestions = data.questions;
    if (!Array.isArray(newQuestions)) {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response format");
    }
    questions.value = newQuestions;
    state.value = "ready";
  } catch (error) {
    console.error("Error fetching questions:", error);
    state.value = "error";
  }
}

const questionGroups = computed(() => {
  return Object.entries(
    Object.groupBy(questions.value, (_, index) => {
      switch (Math.floor(index / 5)) {
        case 0:
          return "from the question bank";
        case 1:
          return "similar";
        case 2:
          return "location based";
        default:
          return "too many";
      }
    })
  );
});
</script>

<template>
  <div class="gaps">
    <div>
      location:
      <input type="text" v-model="qotdLocationModel" />
    </div>
    <div>
      <button :disabled="state === 'loading'" @click="loadQuestions">
        generate
      </button>
      <span v-if="state === 'loading'">Loading...</span>
      <span v-else-if="state === 'error'">Error fetching questions</span>
    </div>
    <div>
      <section
        className="qotd-category"
        v-for="([category, questions], index) in questionGroups"
        :key="index"
      >
        <h4>{{ category }}:</h4>
        <div
          class="qotd-question"
          v-for="(question, index) in questions"
          :key="index"
        >
          <button @click="qotdQuestionModel = question">use this one</button
          >&nbsp;<span>{{ question }}</span>
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
</style>
