<template>
  <div class="input-wrap">
    <label :for="inputId" :class="{ active: isActive }">{{ placeholder }}</label>
    <input
      :id="inputId"
      :value="modelValue"
      :type="customType"
      class="input"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
    />
    <span v-if="isPassword" class="input__icon" @click="togglePasswordVisibility">
      <SvgIcons v-if="isPasswordVisible" icon="eye-open" />
      <SvgIcons v-else icon="eye-close" />
    </span>
  </div>
</template>

<script setup lang="ts">
import SvgIcons from '~/components/Svg/SvgIcons.vue'

const props = defineProps<{
  modelValue: string
  placeholder: string
  type: 'text' | 'email' | 'password'
  name: string
}>()

const emit = defineEmits(['update:modelValue'])

const isFocused = ref(false)
const isPasswordVisible = ref(false)

const isActive = computed(() => props.modelValue.length > 0 || isFocused.value)
const isPassword = computed(() => props.type === 'password')
const customType = computed(() => (isPasswordVisible.value ? 'text' : props.type))
const inputId = computed(() => `input-${props.name}`)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onFocus() {
  isFocused.value = true
}

function onBlur() {
  isFocused.value = props.modelValue.length > 0
}

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<style scoped lang="scss">
.input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  padding: 8px;
  transition: 0.3s;
  box-shadow: 0 1px 2px 0 rgba(18, 18, 23, 0.05);
  position: relative;

  &:hover {
    border: 1px solid var(--input-border-hover);
  }

  &:focus-within {
    border: 1px solid black;
  }

  .input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    height: fit-content;

    &__icon {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
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
