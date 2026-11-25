<template>
  <section class="producer-catalog">
    <header class="producer-catalog__header">
      <NuxtLink :to="producerRoute" class="producer-catalog__logo" :aria-label="producer.name">
        <img v-if="producer.logo_url" :src="producer.logo_url" :alt="producer.name" />
        <span v-else>{{ producer.name }}</span>
      </NuxtLink>

      <div class="producer-catalog__details">
        <component :is="headingTag" class="producer-catalog__title">{{ producer.name }}</component>
        <p v-if="producer.country">Производство: {{ producer.country }}</p>
        <NuxtLink :to="producerRoute">Подробнее о производителе</NuxtLink>
      </div>

      <NuxtLink :to="producerRoute" class="producer-catalog__summary">
        {{ producer.product_count }} {{ productsLabel }} в {{ producer.product_lines.length }} {{ collectionsLabel }}
      </NuxtLink>
    </header>

    <h3 class="producer-catalog__collections-title">Коллекции:</h3>
    <ul class="producer-catalog__collections">
      <li v-for="line in producer.product_lines" :key="line.id">
        <NuxtLink :to="`${producerRoute}/${line.slug}`" class="collection-card">
          <img v-if="line.cover_image_url" :src="line.cover_image_url" :alt="line.name" loading="lazy" />
          <span v-else class="collection-card__fallback">{{ line.name }}</span>
          <span class="collection-card__content">
            <strong>{{ line.name }}</strong>
            <small>{{ line.product_count }} {{ designsLabel(line.product_count) }}</small>
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { ProducerCatalogItem } from '~/types/categories.types'

const props = defineProps<{
  categorySlug: string
  producer: ProducerCatalogItem
  headingLevel?: 2 | 3
}>()

const producerRoute = computed(() => `/${props.categorySlug}/${props.producer.slug}`)
const headingTag = computed(() => `h${props.headingLevel ?? 2}`)
const productsLabel = computed(() => pluralize(props.producer.product_count, ['товар', 'товара', 'товаров']))
const collectionsLabel = computed(() => pluralize(props.producer.product_lines.length, ['коллекции', 'коллекций', 'коллекциях']))

function designsLabel(count: number) {
  return pluralize(count, ['дизайн', 'дизайна', 'дизайнов'])
}

function pluralize(count: number, forms: [string, string, string]) {
  const remainder = count % 100
  const lastDigit = count % 10

  if (remainder > 10 && remainder < 20) return forms[2]
  if (lastDigit === 1) return forms[0]
  if (lastDigit > 1 && lastDigit < 5) return forms[1]
  return forms[2]
}
</script>

<style scoped lang="scss">
.producer-catalog {
  & + & {
    margin-top: 48px;
  }

  &__header {
    display: grid;
    grid-template-columns: 212px 1fr auto;
    gap: 20px;
    align-items: start;
  }

  &__logo {
    display: grid;
    place-items: center;
    height: 116px;
    overflow: hidden;
    background: #f5f5f5;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }

  &__title {
    margin-bottom: 6px;
  }

  &__details p {
    margin-bottom: 12px;
  }

  &__summary {
    color: var(--primary-color);
    text-align: right;
    text-decoration: underline;
  }

  &__collections-title {
    margin: 18px 0 14px;
  }

  &__collections {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 4px;
  }

  @include phone {
    &__header {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    &__logo {
      height: 96px;
      padding: 12px;

      img {
        object-fit: contain;
      }
    }

    &__summary {
      text-align: left;
    }
  }
}

.collection-card {
  position: relative;
  display: block;
  min-height: 180px;
  overflow: hidden;
  color: #fff;
  background: #4f5963;

  img,
  &__fallback {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__fallback {
    display: grid;
    place-items: center;
    padding: 16px;
    font-size: 20px;
    text-align: center;
  }

  &::after {
    position: absolute;
    inset: 0;
    content: '';
    background: linear-gradient(transparent 40%, rgb(0 0 0 / 65%));
  }

  &__content {
    position: absolute;
    right: 14px;
    bottom: 12px;
    left: 14px;
    z-index: 1;
    display: grid;
    gap: 4px;
  }
}
</style>
