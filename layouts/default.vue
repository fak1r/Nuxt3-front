<template>
  <div>
    <header>
      <div class="header-container">
        <TheHeader />
      </div>
    </header>
    <div class="main-container">
      <div class="main-container__body">
        <slot />
      </div>
    </div>
    <div class="mobile-nav-container">
      <MobileNav />
    </div>
  </div>
</template>

<script setup>
import TheHeader from '~/components/TheHeader.vue'
import MobileNav from '~/components/MobileNav.vue'
</script>

<style scoped lang="scss">
header {
  height: 64px;
  background-color: rgba(253, 254, 254, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  z-index: 9999;

  .header-container {
    max-width: var(--max-page-width);
    width: 100%;
  }
}

.main-container {
  display: flex;
  align-items: center;
  justify-content: center;

  &__body {
    max-width: var(--max-page-width);
    width: 100%;
  }
}

.footer-container {
  height: 64px;
  position: fixed;
  bottom: 0;
}
</style>
