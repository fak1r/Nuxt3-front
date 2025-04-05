<template>
  <div class="site">
    <header class="header" :class="{ 'header--hidden': isHeaderHidden }">
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
import throttle from 'lodash/throttle'
import TheHeader from '~/components/TheHeader.vue'
import MobileNav from '~/components/MobileNav.vue'
import ModalAuth from '~/components/Modals/ModalAuth.vue'
import ModalCatalog from '~/components/Modals/ModalCatalog.vue'
import { useModalStore } from '~/store/modal'
import { useCategoriesStore } from '@/store/categories'

const modalStore = useModalStore()
const categoriesStore = useCategoriesStore()
const { isMobile } = useIsMobile()

const isHeaderHidden = ref(false)
let lastScrollY = 0

function onScroll() {
  if (!isMobile.value) return

  const currentY = window.scrollY

  if (currentY > lastScrollY && currentY > 100) {
    isHeaderHidden.value = true
  } else {
    isHeaderHidden.value = false
  }

  lastScrollY = currentY
}

const handleScroll = throttle(onScroll, 200)

onMounted(async () => {
  await categoriesStore.init()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.site {
  margin-top: var(--header-height);
  margin-bottom: var(--mobile-menu-height);
}
.header {
  height: var(--header-height);
  background-color: var(--header-background);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--main-padding);
  box-sizing: border-box;
  z-index: 900;
  position: fixed;
  width: 100%;
  top: 0;
  transition: transform 0.3s ease-in-out;

  &--hidden {
    transform: translateY(-100%);
  }

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
  padding: var(--main-padding);

  &__body {
    max-width: var(--max-page-width);
    width: 100%;
  }
}

.footer-container {
  height: 64px;
  position: fixed;
  bottom: 0;
  padding: var(--main-padding);
}
</style>
