<template>
  <section class="contacts">
    <h1 class="contacts__title">Контакты</h1>

    <address class="contacts__info">
      <p class="contacts__address">Коломна, ул. Октябрьской Революции, 387А</p>
      <p class="contacts__phone">
        <a href="tel:+79268436282" class="link">+7 (910) 414-35-67</a>
      </p>
    </address>

    <div class="contacts__schemes">
      <figure class="contacts__scheme">
        <img :src="ParketImg" alt="Вход на рынок" />
        <figcaption>Вход на рынок</figcaption>
      </figure>
      <figure class="contacts__scheme">
        <img :src="LaminatImg" alt="Магазин" />
        <figcaption>Магазин</figcaption>
      </figure>
    </div>

    <div ref="mapContainer" class="contacts__map" />
  </section>
</template>

<script setup lang="ts">
import ParketImg from '~/assets/img/market-entry.png'
import LaminatImg from '~/assets/img/store-entry.jpeg'

const mapContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (mapContainer.value) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src =
      'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A96cdb8222862e7daa1232c5a4d2a3a3f6aa099b0115c671588855d0d9c295f6b&width=100%25&height=400&lang=ru_RU&scroll=true'

    mapContainer.value.appendChild(script)
  }
})
</script>

<style scoped lang="scss">
.contacts {
  &__title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  &__info {
    font-style: normal;
    margin-bottom: 1.5rem;
  }

  &__map {
    width: 100%;
    height: 400px;
    margin-bottom: 2rem;
  }

  &__schemes {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__scheme {
    flex: 1 1 300px;
    text-align: center;

    img {
      max-width: 100%;
      height: auto;
      border: 1px solid #ccc;
    }

    figcaption {
      margin-top: 0.5rem;
      color: #666;
    }
  }
}
</style>
