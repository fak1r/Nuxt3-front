<template>
  <section class="contacts">
    <header class="contacts__hero">
      <p class="contacts__eyebrow">Магазин «Зам Пол» в Коломне</p>
      <h1>Контакты и самовывоз</h1>
      <p class="contacts__lead">Приезжайте посмотреть декоры вживую и выбрать покрытие для дома, квартиры или офиса.</p>
    </header>

    <div class="contacts__grid">
      <address class="contacts__card contacts__card--main">
        <p class="contacts__card-label">Адрес магазина</p>
        <p class="contacts__address">Коломна, ул. Октябрьской Революции, 387А</p>
        <p class="contacts__hint">Коломенский строительный рынок, павильон напольных покрытий.</p>
        <div class="contacts__actions">
          <TheButton size="lg" @click="callStore">Позвонить в магазин</TheButton>
          <TheButton variant="Secondary" size="lg" @click="openRoute">Построить маршрут</TheButton>
        </div>
      </address>

      <div class="contacts__card contacts__card--phone">
        <p class="contacts__card-label">Телефон</p>
        <a href="tel:+79104143567" class="contacts__phone">+7 (910) 414-35-67</a>
        <p class="contacts__hint">Подскажем по наличию, декорам и расчёту нужного количества покрытия.</p>
      </div>
    </div>

    <section class="contacts__visit" aria-labelledby="visit-title">
      <div class="contacts__section-heading">
        <p class="contacts__eyebrow">Как нас найти</p>
        <h2 id="visit-title">Самовывоз на Коломенском строительном рынке</h2>
        <p>Сначала ориентируйтесь на вход на рынок, затем — на вывеску магазина «Ламинат · Линолеум».</p>
      </div>

      <div class="contacts__schemes">
        <figure class="contacts__scheme">
          <img :src="ParketImg" alt="Вход на Коломенский строительный рынок" />
          <figcaption>
            <strong>1. Вход на рынок</strong>
            <span>Ориентир — главные ворота строительного рынка.</span>
          </figcaption>
        </figure>
        <figure class="contacts__scheme">
          <img :src="LaminatImg" alt="Вход в магазин Зам Пол" />
          <figcaption>
            <strong>2. Магазин «Зам Пол»</strong>
            <span>Вход отмечен вывеской с напольными покрытиями.</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="contacts__map-section" aria-labelledby="map-title">
      <div class="contacts__section-heading">
        <p class="contacts__eyebrow">Карта</p>
        <h2 id="map-title">Маршрут до магазина</h2>
      </div>
      <div ref="mapContainer" class="contacts__map" />
    </section>
  </section>
</template>

<script setup lang="ts">
import TheButton from '~/components/UI/TheButton.vue'
import ParketImg from '~/assets/img/market-entry.png'
import LaminatImg from '~/assets/img/store-entry.jpeg'

const mapContainer = ref<HTMLElement | null>(null)
const address = 'Коломна, ул. Октябрьской Революции, 387А'

useHead({
  title: 'Контакты и самовывоз | Зам Пол',
  meta: [
    {
      name: 'description',
      content: 'Контакты магазина «Зам Пол» в Коломне: адрес, телефон, самовывоз, схема входа и маршрут до магазина напольных покрытий.',
    },
    {
      property: 'og:title',
      content: 'Контакты и самовывоз | Зам Пол',
    },
    {
      property: 'og:description',
      content: 'Адрес, телефон, схема входа и маршрут до магазина «Зам Пол» в Коломне.',
    },
  ],
})

onMounted(() => {
  if (!mapContainer.value) return

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src =
    'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A96cdb8222862e7daa1232c5a4d2a3a3f6aa099b0115c671588855d0d9c295f6b&width=100%25&height=400&lang=ru_RU&scroll=true'

  mapContainer.value.appendChild(script)
})

function callStore() {
  window.location.href = 'tel:+79104143567'
}

function openRoute() {
  window.open(`https://yandex.ru/maps/?text=${encodeURIComponent(address)}`, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped lang="scss">
.contacts {
  display: grid;
  gap: 48px;
  padding-bottom: 40px;

  &__hero,
  &__section-heading {
    display: grid;
    gap: 8px;
    max-width: 760px;
  }

  &__hero h1 {
    color: #29445d;
    font-size: clamp(32px, 4vw, 48px);
    line-height: 1.05;
  }

  &__eyebrow,
  &__card-label {
    color: #a37552;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__lead,
  &__section-heading > p:last-child {
    color: #5c748a;
    font-size: 18px;
    line-height: 1.5;
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
    gap: 16px;
  }

  &__card {
    display: grid;
    align-content: start;
    gap: 14px;
    padding: 28px;
    border: 1px solid #d6e1eb;
    border-radius: 16px;
    background: #f8fbfd;
    font-style: normal;
  }

  &__card--main {
    background: linear-gradient(135deg, #f8fbfd 0%, #f3ece6 100%);
  }

  &__address {
    color: #29445d;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.3;
  }

  &__phone {
    color: #29445d;
    font-size: 26px;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      color: #a37552;
    }
  }

  &__hint {
    color: #5c748a;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 4px;
  }

  &__visit,
  &__map-section {
    display: grid;
    gap: 20px;
  }

  &__schemes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  &__scheme {
    overflow: hidden;
    border: 1px solid #d6e1eb;
    border-radius: 14px;
    background: #fff;

    img {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }

    figcaption {
      display: grid;
      gap: 6px;
      padding: 16px;
      color: #5c748a;
    }

    strong {
      color: #29445d;
      font-size: 18px;
    }
  }

  &__map {
    width: 100%;
    height: 400px;
    overflow: hidden;
    border: 1px solid #d6e1eb;
    border-radius: 14px;
    background: #f8fbfd;
  }

  @include phone {
    gap: 36px;
    padding-bottom: 88px;

    &__lead,
    &__section-heading > p:last-child {
      font-size: 16px;
    }

    &__grid,
    &__schemes {
      grid-template-columns: 1fr;
    }

    &__card {
      padding: 20px;
    }

    &__address {
      font-size: 21px;
    }

    &__phone {
      font-size: 23px;
    }

    &__actions {
      display: grid;

      :deep(.btn) {
        width: 100%;
      }
    }

    &__map {
      height: 320px;
    }
  }
}
</style>
