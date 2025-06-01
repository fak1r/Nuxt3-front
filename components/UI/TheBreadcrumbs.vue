<template>
  <nav class="breadcrumbs" aria-label="Хлебные крошки" itemscope itemtype="https://schema.org/BreadcrumbList">
    <ul class="breadcrumbs__list">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="breadcrumbs__item"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <span v-if="index > 0" class="breadcrumbs__separator">
          <SvgIcons icon="arrow-forward" />
        </span>

        <NuxtLink
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.to"
          class="link"
          itemprop="item"
          :title="crumb.label"
        >
          <span itemprop="name">{{ crumb.label }}</span>
        </NuxtLink>

        <span v-else itemprop="name">
          {{ crumb.label }}
        </span>

        <meta itemprop="position" :content="String(index + 1)" />
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '~/types/products.types'
import SvgIcons from '~/components/Svg/SvgIcons.vue'

interface Props {
  breadcrumbs: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.breadcrumbs {
  padding: 10px 0;

  &__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  &__item {
    display: flex;
    align-items: center;
  }

  &__separator {
    margin: 0 8px;
    color: #888;

    @include phone {
      margin: 0 4px;
    }
  }
}
</style>
