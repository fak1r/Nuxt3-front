<template>
  <div class="input">
    <!-- <label for="input-search">Поиск</label> -->
    <SvgIcons icon="search" :color="isIconHovered ? 'var(--primary-btn)' : 'var(--input-border-hover)'" />
    <input
      id="input-search"
      :value="modelValue"
      type="text"
      placeholder="Поиск"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @input="onInput"
    />
    <span
      v-if="isIconXVisible"
      tabindex="0"
      class="input__icon"
      @click="onClear"
      @keydown.enter.prevent="onClear"
      @keydown.space.prevent="onClear"
      @mouseover="setIconHoverState(true)"
      @mouseleave="setIconHoverState(false)"
      @focus="setIconHoverState(true)"
      @blur="setIconHoverState(false)"
    >
      <SvgIcons icon="x" :color="isIconHovered ? 'var(--primary-btn)' : 'var(--input-border-hover)'" />
    </span>
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

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onInputFocus() {
  isInputFocused.value = true
  emit('focus')
}

function onInputBlur() {
  isInputFocused.value = !!props.modelValue
}

function setIconHoverState(isHovered: boolean) {
  isIconHovered.value = isHovered
}

function onClear() {
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

  &:last-child {
    margin-bottom: 0;
  }

  &:hover:not(.input--error) {
    border: 1px solid var(--input-border-hover);
  }

  &:focus-within {
    border: 1px solid black;
  }

  &__icon {
    position: absolute;
    right: 8px;
    top: 50%;
    height: 24px;
    transform: translateY(-50%);
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid var(--input-border-hover);
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

  label {
    display: flex;
    align-items: center;
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-55%);
    font-size: 16px;
    transition: all 0.3s ease;
    pointer-events: none;
    background-color: white;
    transition-timing-function: ease;
    max-height: 10px;
    &.active {
      top: 0;
      left: 8px;
      font-size: 12px;
      padding: 0 2px;
      transform: translateY(-50%);
    }
  }
}
</style>
