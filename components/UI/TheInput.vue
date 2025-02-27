<template>
  <div class="input" :class="{ 'input--error': hasError }">
    <label :for="inputId" :class="{ active: isActive }">{{ placeholder }}</label>
    <input
      :id="inputId"
      :value="modelValue"
      :type="customType"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @input="onInput"
    />
    <span
      v-if="isPassword"
      tabindex="0"
      class="input__icon"
      @click="togglePasswordVisibility"
      @keydown.enter.prevent="togglePasswordVisibility"
      @keydown.space.prevent="togglePasswordVisibility"
      @mouseover="setIconHoverState(true)"
      @mouseleave="setIconHoverState(false)"
      @focus="setIconHoverState(true)"
      @blur="setIconHoverState(false)"
    >
      <SvgIcons
        :icon="isPasswordVisible ? 'eye-open' : 'eye-close'"
        :color="isIconHovered ? 'var(--primary-btn)' : 'var(--input-border-hover)'"
      />
    </span>
    <p v-if="error" class="input__error-text">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import SvgIcons from '~/components/Svg/SvgIcons.vue'

const props = defineProps<{
  modelValue: string
  placeholder: string
  type: 'text' | 'email' | 'password'
  name: string
  error?: string
}>()

const emit = defineEmits(['update:modelValue', 'focus'])

const isInputFocused = ref(false)
const isPasswordVisible = ref(false)
const isIconHovered = ref(false)

const isActive = computed(() => !!props.modelValue || isInputFocused.value)
const isPassword = computed(() => props.type === 'password')
const customType = computed(() => (isPasswordVisible.value ? 'text' : props.type))
const inputId = computed(() => `input-${props.name}`)
const hasError = computed(() => !!props.error)

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

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
}

function setIconHoverState(isHovered: boolean) {
  isIconHovered.value = isHovered
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

  &--error {
    border: 1px solid red;
    border-radius: 6px;
  }

  &__error-text {
    color: red;
    font-size: 14px;
    position: absolute;
    bottom: -22px;
    white-space: nowrap;
    left: 0;
    margin: 0;
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
