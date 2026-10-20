<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const model = defineModel<string>({ required: true });
const editor = ref<HTMLElement | null>(null);
function sync() {
  if (editor.value && editor.value.innerHTML !== model.value) {
    editor.value.innerHTML = model.value;
  }
}
function format(command: string) {
  editor.value?.focus();
  document.execCommand(command);
  if (editor.value) model.value = editor.value.innerHTML;
}
onMounted(sync);
watch(model, sync);
</script>

<template>
  <div class="rich-editor">
    <div class="formatting" aria-label="Text formatting">
      <button type="button" @mousedown.prevent @click="format('bold')">
        Bold
      </button>
      <button type="button" @mousedown.prevent @click="format('italic')">
        Italic
      </button>
      <button type="button" @mousedown.prevent @click="format('removeFormat')">
        Clear
      </button>
    </div>
    <div
      ref="editor"
      class="editable"
      contenteditable="true"
      role="textbox"
      aria-label="Slide text"
      aria-multiline="true"
      @input="model = ($event.currentTarget as HTMLElement).innerHTML"
    ></div>
  </div>
</template>

<style scoped>
.rich-editor {
  border: 1px solid var(--editor-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--editor-surface);
}
.formatting {
  display: flex;
  gap: 4px;
  padding: 6px;
  border-bottom: 1px solid var(--editor-border);
}
button {
  color: inherit;
  font: inherit;
  font-size: 12px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  padding: 7px 10px;
  cursor: pointer;
}
button:hover {
  background: var(--editor-hover);
}
.editable {
  min-height: 210px;
  max-height: 360px;
  overflow: auto;
  padding: 16px;
  font-size: 15px;
  line-height: 1.6;
  overflow-wrap: anywhere;
  outline: none;
}
.rich-editor:focus-within {
  border-color: var(--editor-ink);
}
.editable :deep(img) {
  max-width: 100%;
  height: auto !important;
  max-height: 200px;
  object-fit: contain;
}
.editable :deep(p) {
  font: inherit;
  color: inherit;
}
button:focus-visible {
  outline: 2px solid var(--editor-ink);
}
</style>
