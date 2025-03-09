<template>
  <svg class="icon" :class="[color, size]"><use v-bind="{ 'xlink:href': `/sprite.svg#${icon}` }" /></svg>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  color?: string
  size?: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.icon {
  vertical-align: middle;
  display: inline-block;
  color: var(--input-border-hover);
  transition: all 0.3s ease;
  flex-shrink: 0;
  fill: currentColor;

  &.SM {
    width: 1.6rem;
    height: 1.6rem;
  }

  &.MD {
    width: 2rem;
    height: 2rem;
  }

  &.XL {
    width: 2.4rem;
    height: 2.4rem;
  }
}
</style>
