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
    <ModalAuth v-if="modalStore.isAuthVisible" />
    <ModalCatalog v-if="modalStore.isCatalogVisible" />
  </div>
</template>

<script setup>
import TheHeader from '~/components/TheHeader.vue'
import MobileNav from '~/components/MobileNav.vue'
import ModalAuth from '~/components/Modals/ModalAuth.vue'
import ModalCatalog from '~/components/Modals/ModalCatalog.vue'
import { useModalStore } from '~/store/modal'

const modalStore = useModalStore()
</script>

<style scoped lang="scss">
header {
  height: var(--header-height);
  background-color: var(--header-background);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  z-index: 900;

  @include phone {
    background-color: var(--border);
  }

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
