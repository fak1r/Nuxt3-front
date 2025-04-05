<template>
  <dialog class="overlay overlay--mt" @click.self="closeModal">
    <div class="catalog">
      <aside class="catalog__side--left">
        <div
          v-for="category in categories"
          :key="category.id"
          class="catalog__item"
          :class="{ 'catalog__item--active': selectedCategoryId === category.id }"
          @click="goToCategory(category.id)"
          @mouseover="setCategory(category.id)"
        >
          {{ category.name }}
        </div>
      </aside>

      <section class="catalog__side--right">
        <div
          v-for="producer in currentProducers"
          :key="producer.id"
          class="catalog__item"
          :class="{ 'catalog__item--active': producer.id === selectedProducerId }"
          @click="goToProducer(producer.id)"
          @mouseover="setProducer(producer.id)"
        >
          {{ producer.name }}
        </div>
      </section>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useModalStore } from '~/store/modal'
import { useCategoriesStore } from '@/store/categories'

const categoriesStore = useCategoriesStore()
const modalStore = useModalStore()

const categories = categoriesStore.categories
const producers = categoriesStore.producers

type Category = keyof typeof categories

const selectedCategoryId = ref<Category>(Object.keys(categories)[0] as Category)
const selectedProducerId = ref(0)

const currentProducers = computed(() => {
  return producers.filter((p) => p.category_id === selectedCategoryId.value).map(({ name, id }) => ({ name, id }))
})

function setCategory(id: number) {
  selectedCategoryId.value = id
}

function setProducer(id: number) {
  selectedProducerId.value = id
}

function goToCategory(id: number) {
  navigateTo(`/catalog/${id}`)
}

function goToProducer(id: number) {
  navigateTo(`/producers/${id}`)
}

function closeModal() {
  modalStore.close()
}
</script>

<style scoped lang="scss">
.overlay {
  &--mt {
    margin-top: var(--header-height);
  }
}
.catalog {
  position: fixed;
  left: 50%;
  top: var(--header-height);
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  overflow: hidden;
  box-shadow:
    0 2px 2px 0 #445c821f,
    -1px 4px 10px 0 #445c821a,
    0 -2px 10px 0 #445c820d;
  z-index: 1001;
  width: 100%;
  max-width: var(--max-page-width);
  height: 80%;
  background-color: var(--general-background-color);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  &__item {
    font-size: 18px;
    cursor: pointer;

    &--active {
      background-color: var(--border);
    }
  }

  &__side {
    display: flex;
    flex-direction: column;

    &--left {
      width: 30%;
      padding: 12px 4px 12px 12px;
      border-right: 1px solid var(--input-border);
    }

    &--right {
      width: 70%;
      padding: 12px 4px 12px 24px;
    }
  }

  &__close {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 20px;
    color: var(--primary-btn-hover);

    &:hover,
    &:focus {
      color: black;
    }
  }
}
</style>
