<template>
  <div class="qty-input">
    <button class="qty-input__btn" @click="decrement">−</button>
    <input v-model.number="localValue" type="number" min="0" max="999" class="qty-input__field" @input="emitChange" />
    <button class="qty-input__btn" @click="increment">+</button>
  </div>
</template>

<script setup lang="ts">
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
  if (localValue.value < min) {
    localValue.value = min
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
  border: 1px solid var(--border);
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
  padding: 9px 12px;
  width: 100%;
  max-height: 41px;

  &__btn {
    width: 24px;
    font-size: 18px;
    font-weight: bold;

    &:hover {
      background-color: var(--hover);
    }
  }

  &__field {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    width: 50px;
  }
}
</style>
