<template>
  <div class="input" :class="{ error: hasError }">
    <label :for="inputId" :class="{ active: isActive }">{{ placeholder }}</label>
    <input
      :id="inputId"
      :value="modelValue"
      :type="customType"
      @focus="focusInput"
      @blur="blurInput"
      @input="updateInput"
    />
    <button
      v-if="isPassword"
      class="input__icon"
      :aria-label="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"
      type="button"
      @mouseover="setIconHoverState(true)"
      @mouseleave="setIconHoverState(false)"
      @focus="setIconHoverState(true)"
      @blur="setIconHoverState(false)"
      @click="togglePasswordVisibility"
    >
      <SvgIcons :icon="isPasswordVisible ? 'eye-open' : 'eye-close'" :color="isIconHovered ? 'dark-gray' : 'gray'" />
    </button>
    <p v-if="error" class="input__error-text">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import SvgIcons from '~/components/Svg/SvgIcons.vue'

interface Props {
  modelValue: string
  placeholder: string
  type: 'text' | 'email' | 'password'
  name: string
  error?: string
  isPhone?: boolean
}

const { modelValue, placeholder, type, name, error, isPhone = false } = defineProps<Props>()

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'focus'): void
}

const emit = defineEmits<Emits>()

const isInputFocused = ref(false)
const isPasswordVisible = ref(false)
const isIconHovered = ref(false)

const isActive = computed(() => !!modelValue || isInputFocused.value)
const isPassword = computed(() => type === 'password')
const customType = computed(() => (isPasswordVisible.value ? 'text' : type))
const inputId = computed(() => `input-${name}`)
const hasError = computed(() => !!error)

onMounted(() => {
  if (isPhone) {
    emit('update:modelValue', '+7')
  }
})

function updateInput(event: Event) {
  const target = event.target as HTMLInputElement
  let rawValue = target.value

  if (isPhone && !rawValue.startsWith('+7')) {
    rawValue = '+7'
  }

  if (isPhone) {
    const formatted = formatPhone(rawValue)
    target.value = formatted
    emit('update:modelValue', formatted)
  } else {
    emit('update:modelValue', rawValue)
  }
}

function focusInput() {
  isInputFocused.value = true
  if (error) {
    emit('focus')
  }
}

function blurInput() {
  isInputFocused.value = !!modelValue
}

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
}

function setIconHoverState(isHovered: boolean) {
  isIconHovered.value = isHovered
}

function formatPhone(value: string): string {
  // убираем всё, кроме цифр
  let digits = value.replace(/\D/g, '')

  // удаляем первую 7 или 8, если она случайно введена
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1)
  }

  // только первые 10 цифр после +7
  digits = digits.slice(0, 10)

  let formatted = '+7'

  if (digits.length > 0) formatted += ` (${digits.slice(0, 3)}`
  if (digits.length >= 4) formatted += `) ${digits.slice(3, 6)}`
  if (digits.length >= 7) formatted += `-${digits.slice(6, 8)}`
  if (digits.length >= 9) formatted += `-${digits.slice(8, 10)}`

  return formatted
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

  &:hover {
    border: 1px solid var(--input-border-hover);
  }

  &:focus-within {
    border: 1px solid black;
  }

  &.error {
    border: 1px solid red !important;
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
  }

  input {
    font-size: 16px;
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
