<template>
  <section class="main-page-promo" aria-labelledby="promo-title">
    <div class="main-page-promo__glow main-page-promo__glow--top" aria-hidden="true" />
    <div class="main-page-promo__glow main-page-promo__glow--bottom" aria-hidden="true" />

    <div class="main-page-promo__content">
      <p class="main-page-promo__eyebrow">Подарок для посетителей сайта</p>
      <h2 id="promo-title" class="main-page-promo__title">Получите скидку 3% на всю продукцию</h2>
      <p class="main-page-promo__description">
        Заберите промокод онлайн и назовите его продавцу в магазине «Зам Пол» при покупке.
      </p>
    </div>

    <div class="main-page-promo__action">
      <TheButton v-if="!isRevealed" class="main-page-promo__reveal" size="lg" @click="revealPromo">
        Получить скидку 3%
        <span class="main-page-promo__reveal-icon" aria-hidden="true">→</span>
      </TheButton>

      <div v-else class="main-page-promo__coupon" aria-live="polite">
        <p class="main-page-promo__success">Поздравляем, ваша скидка готова</p>
        <div class="main-page-promo__code-row">
          <div>
            <span class="main-page-promo__code-label">Промокод</span>
            <strong class="main-page-promo__code">{{ promoCode }}</strong>
          </div>
          <TheButton class="main-page-promo__copy" variant="Secondary" size="sm" @click="copyPromoCode">
            {{ copyLabel }}
          </TheButton>
        </div>
        <p class="main-page-promo__hint">Скажите код в магазине перед оформлением покупки.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TheButton from '~/components/UI/TheButton.vue'

const promoCode = 'ZAMPOL3'
const isRevealed = ref(false)
const copyLabel = ref('Скопировать')

function revealPromo() {
  isRevealed.value = true
}

async function copyPromoCode() {
  if (!import.meta.client || !navigator.clipboard) {
    copyLabel.value = 'Назовите код продавцу'
    return
  }

  try {
    await navigator.clipboard.writeText(promoCode)
    copyLabel.value = 'Скопировано'
  } catch {
    copyLabel.value = 'Назовите код продавцу'
  }
}
</script>

<style scoped lang="scss">
.main-page-promo {
  --primary-btn: #a37552;
  --primary-btn-hover: #875d3e;
  --primary-btn-ripple: rgba(255, 255, 255, 0.35);

  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  gap: 32px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  margin: 28px 0 12px;
  padding: 36px 42px;
  border: 1px solid #d7baa1;
  border-radius: 16px;
  color: #5a4030;
  background:
    linear-gradient(118deg, rgba(255, 251, 247, 0.98), rgba(233, 214, 196, 0.98)),
    #fff8f2;
  box-shadow: 0 14px 28px rgba(105, 70, 48, 0.1);

  &__content,
  &__action {
    position: relative;
    z-index: 1;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  &__eyebrow {
    margin-bottom: 10px;
    color: #a37552;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  &__title {
    max-width: 620px;
    color: inherit;
    font-size: clamp(28px, 3.2vw, 42px);
    font-weight: 750;
    line-height: 1.08;
  }

  &__description {
    max-width: 560px;
    margin-top: 14px;
    color: #725848;
    font-size: 17px;
    line-height: 1.5;
  }

  &__action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  &__reveal,
  &__coupon {
    width: min(100%, 350px);
  }

  &__reveal {
    box-shadow: 0 10px 20px rgba(126, 83, 53, 0.2);
    font-size: 17px;

    :deep(> span:first-child) {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    :deep(.main-page-promo__reveal-icon) {
      font-size: 22px;
      line-height: 1;
    }
  }

  &__coupon {
    padding: 18px 20px;
    border: 1px dashed #caa88d;
    border-radius: 12px;
    background: rgba(255, 252, 248, 0.72);
  }

  &__success {
    color: #956440;
    font-size: 14px;
    font-weight: 700;
  }

  &__code-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 8px;
  }

  &__code-label {
    display: block;
    color: #806452;
    font-size: 12px;
  }

  &__code {
    display: block;
    margin-top: 2px;
    color: #5a4030;
    font-size: 27px;
    letter-spacing: 0.08em;
  }

  &__copy {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  &__hint {
    margin-top: 12px;
    color: #806452;
    font-size: 12px;
    line-height: 1.45;
  }

  &__glow {
    position: absolute;
    z-index: 0;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(2px);

    &--top {
      top: -120px;
      right: 22%;
      width: 270px;
      height: 270px;
      background: rgba(163, 117, 82, 0.18);
    }

    &--bottom {
      right: -92px;
      bottom: -132px;
      width: 330px;
      height: 330px;
      border: 1px solid rgba(163, 117, 82, 0.2);
    }
  }

  @include tablet {
    grid-template-columns: 1fr;
    gap: 22px;

    &__action {
      justify-content: flex-start;
    }
  }

  @include phone {
    margin-top: 20px;
    padding: 26px 20px;
    border-radius: 12px;

    &__description {
      font-size: 15px;
    }

    &__reveal,
    &__coupon {
      width: 100%;
    }
  }

  @include narrow_phone {
    &__code-row {
      align-items: flex-start;
      flex-direction: column;
    }
  }
}
</style>
