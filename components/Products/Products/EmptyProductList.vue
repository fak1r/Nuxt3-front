<template>
  <section class="empty-product-list" aria-live="polite">
    <div class="empty-product-list__icon" aria-hidden="true">
      <SvgIcons icon="empty-catalog" size="xxl" />
    </div>
    <h2 class="empty-product-list__title">Нет товаров</h2>
    <p class="empty-product-list__text">В этом разделе пока нет подходящих товаров. Посмотрите другие покрытия в каталоге.</p>
    <TheLinkButton to="/catalog">Перейти в каталог</TheLinkButton>
  </section>
</template>

<script setup lang="ts">
import SvgIcons from '~/components/Svg/SvgIcons.vue'
import TheLinkButton from '~/components/UI/TheLinkButton.vue'
</script>

<style scoped lang="scss">
.empty-product-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 560px;
  box-sizing: border-box;
  margin: 28px auto;
  padding: 40px 24px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--white-color);
  text-align: center;
  box-shadow: 0 12px 30px rgba(51, 65, 85, 0.06);

  &__icon {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    margin-bottom: 18px;
    border-radius: 50%;
    background: #edf2f7;
    color: var(--primary-btn);

    :deep(.icon) {
      width: 42px;
      height: 42px;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 3;
    }
  }

  &__title {
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: 700;
  }

  &__text {
    max-width: 380px;
    margin-bottom: 22px;
    line-height: 1.5;

    @include phone {
      font-size: 15px;
    }
  }
}
</style>
