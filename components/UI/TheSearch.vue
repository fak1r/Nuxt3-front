<template>
  <div class="input">
    <SvgIcons icon="search" :color="isIconHovered ? 'var(--primary-btn)' : 'var(--input-border-hover)'" />
    <input
      id="input-search"
      :value="modelValue"
      type="text"
      placeholder="Поиск"
      @focus="focusInput"
      @blur="blurInput"
      @input="updateInput"
    />
    <button v-if="isIconXVisible" class="input__clear" aria-label="Очистить" type="button" @click="clearInput">
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import SvgIcons from '~/components/Svg/SvgIcons.vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'focus'])

const isInputFocused = ref(false)
const isIconHovered = ref(false)

const isIconXVisible = computed(() => !!props.modelValue)

function updateInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function focusInput() {
  isInputFocused.value = true
  emit('focus')
}

function blurInput() {
  isInputFocused.value = !!props.modelValue
}

function clearInput() {
  emit('update:modelValue', '')
}
</script>

<style scoped lang="scss">
.input {
  display: flex;
  align-items: center;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  padding: 8px;
  transition: 0.3s;
  box-shadow: 0 1px 2px 0 rgba(18, 18, 23, 0.05);
  position: relative;
  margin-bottom: 26px;
  background: var(--header-background);

  &:last-child {
    margin-bottom: 0;
  }

  &:focus-within {
    border: 1px solid black;
  }

  &__clear {
    position: absolute;
    right: 8px;
    top: 50%;
    height: 24px;
    transform: translateY(-50%);
    color: var(--primary-btn-hover);

    &:hover,
    &:focus {
      color: black;
    }
  }

  input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    height: fit-content;
  }
}
</style>
