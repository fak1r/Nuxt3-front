<template>
  <div class="qty-input">
    <TheButton class="qty-input__btn" variant="Outlined" @click="decrement">-</TheButton>
    <input v-model.number="localValue" type="number" min="0" max="999" class="qty-input__field" @input="emitChange" />
    <TheButton class="qty-input__btn" variant="Outlined" @click="increment">+</TheButton>
  </div>
</template>

<script setup lang="ts">
import TheButton from '~/components/UI/TheButton.vue'

interface Props {
  modelValue: number
  minOne?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  minOne: false,
})

interface Emits {
  (e: 'update:modelValue', value: number): void
}

const emit = defineEmits<Emits>()

const localValue = ref<number>(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val
  },
)

function emitChange(): void {
  const min = props.minOne ? 1 : 0
  const max = 999

  if (localValue.value < min) {
    localValue.value = min
  }

  if (localValue.value > max) {
    localValue.value = max
  }

  emit('update:modelValue', localValue.value)
}

function increment(): void {
  localValue.value++
  emit('update:modelValue', localValue.value)
}

function decrement(): void {
  const min = props.minOne ? 1 : 0
  if (localValue.value > min) {
    localValue.value--
    emit('update:modelValue', localValue.value)
  }
}
</script>

<style scoped lang="scss">
.qty-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--primary-btn);
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
  max-height: 42px;
  width: 100%;

  &__btn {
    width: 24px;
    font-size: 18px;
    font-weight: bold;
  }

  &__field {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    width: 100%;

    -moz-appearance: textfield;
    appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>
