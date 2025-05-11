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
    <ul v-if="isSearchResVisible" class="input__suggestions">
      <li v-for="item in searchResults" :key="item.id" class="input__suggestion">
        <NuxtLink :to="item.self" @click="selectSuggestion">
          {{ item.full_name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { ProductSearchItem } from '~/types/products.types'
import SvgIcons from '~/components/Svg/SvgIcons.vue'

interface Props {
  modelValue: string
  searchResults?: ProductSearchItem[]
}

const { modelValue, searchResults } = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'focus'])

const { isSearchResOpen } = useProductSearch()

const isSearchResVisible = computed(() => isInputFocused.value && searchResults?.length && isSearchResOpen.value)

const isInputFocused = ref(false)
const isIconHovered = ref(false)

const isIconXVisible = computed(() => !!modelValue)

function updateInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function focusInput() {
  isInputFocused.value = true
  emit('focus')
}

function blurInput() {
  isInputFocused.value = !!modelValue
}

function clearInput() {
  emit('update:modelValue', '')
}

function selectSuggestion() {
  isInputFocused.value = false
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
  background: var(--header-background);
  width: 100%;

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

  &__suggestions {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    max-height: 420px;
    overflow-y: auto;
    background: white;
    border: 1px solid var(--input-border-hover);
    border-radius: 6px;
    z-index: 1000;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  }

  &__suggestion {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: var(--border);
    }

    a {
      display: block;
      width: 100%;
      color: inherit;
      text-decoration: none;
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
