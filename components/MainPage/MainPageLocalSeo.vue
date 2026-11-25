<template>
  <section class="main-page-local-seo" aria-labelledby="local-seo-title">
    <div>
      <p class="main-page-local-seo__eyebrow">Магазин «Зам Пол»</p>
      <h2 id="local-seo-title">Напольные покрытия в Коломне</h2>
    </div>
    <div class="main-page-local-seo__copy">
      <p>
        Подберите ламинат, паркет или линолеум для квартиры, дома и офиса. В каталоге — коллекции, характеристики и цены, которые помогут сравнить варианты до покупки.
      </p>
      <p>
        Магазин работает в Коломне. Возможность доставки за пределы города уточняйте перед оформлением заказа.
      </p>
      <NuxtLink to="/laminat" class="main-page-local-seo__link">Перейти в каталог ламината <span aria-hidden="true">→</span></NuxtLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.main-page-local-seo {
  display: grid;
  grid-template-columns: minmax(240px, 0.7fr) minmax(0, 1.3fr);
  gap: 34px;
  width: 100%;
  margin: 28px 0 16px;
  padding: 30px 34px;
  box-sizing: border-box;
  border-top: 1px solid #d7e3ee;
  border-bottom: 1px solid #d7e3ee;

  h2 {
    color: #29445d;
    font-size: 28px;
    line-height: 1.2;
  }

  &__eyebrow {
    margin-bottom: 8px;
    color: #6b8296;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    p {
      color: #587087;
      font-size: 16px;
      line-height: 1.55;
    }
  }

  &__link {
    margin-top: 2px;
    color: #456987;
    font-weight: 700;

    span {
      margin-left: 4px;
      transition: margin-left 0.2s ease;
    }

    &:hover span {
      margin-left: 8px;
    }
  }

  @include tablet {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @include phone {
    margin-top: 22px;
    padding: 24px 6px;

    h2 {
      font-size: 24px;
    }

    &__copy p {
      font-size: 15px;
    }
  }
}
</style>
