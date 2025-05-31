<template>
  <section class="sort" aria-label="Сортировка товаров">
    <p class="sort__label">Сортировать:</p>
    <TheButton size="sm" variant="Secondary" @click="toggleOrder">
      ⇅ по цене <span v-if="label"> {{ label }} </span>
    </TheButton>
  </section>
</template>

<script setup lang="ts">
import TheButton from '~/components/UI/TheButton.vue'

interface Props {
  initialOrder?: 'asc' | 'desc'
}

const props = defineProps<Props>()

interface Emits {
  (e: 'update:sort', sort: { sort_by: 'price'; order: 'asc' | 'desc' }): void
}

const emit = defineEmits<Emits>()

const order = ref<'asc' | 'desc' | null>(props.initialOrder ?? null)

const label = computed(() => {
  if (order.value === 'asc') return '↑'
  if (order.value === 'desc') return '↓'
  return ''
})

function toggleOrder() {
  if (order.value === 'asc') {
    order.value = 'desc'
  } else {
    order.value = 'asc'
  }

  emit('update:sort', {
    sort_by: 'price',
    order: order.value,
  })
}
</script>

<style scoped lang="scss">
.sort {
  display: flex;
  align-items: center;
  gap: 8px;

  &__label {
    font-weight: bold;
  }
}
</style>
