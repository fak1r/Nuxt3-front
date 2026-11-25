<template>
  <section class="main-page-categories" aria-labelledby="categories-title">
    <header class="main-page-categories__heading">
      <p>Ламинат для вашего интерьера</p>
      <h2 id="categories-title">Коллекции и бренды ламината</h2>
    </header>

    <ul class="main-page-categories__list">
      <li v-for="category in categories" :key="category.to">
        <NuxtLink :to="category.to" class="main-page-categories__card">
          <img :src="category.image" :alt="category.name" loading="lazy" decoding="async" />
          <span>{{ category.name }}</span>
          <small>{{ category.description }}</small>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import LaminatImg from '~/assets/img/laminat.png'

const categories = [
  {
    name: 'Classen',
    description: 'Коллекции немецкого бренда',
    to: '/laminat/classen',
    image: 'https://zampol.ru/static/uploads/catalog/collections/classen/visiogrande/cover.webp',
  },
  {
    name: 'Pergo',
    description: 'Коллекции шведского бренда',
    to: '/laminat/pergo',
    image: 'https://zampol.ru/static/uploads/catalog/collections/pergo/uppsala-pro/cover.webp',
  },
  { name: 'Все коллекции', description: 'Каталог ламината и цены', to: '/laminat', image: LaminatImg },
]
</script>

<style scoped lang="scss">
.main-page-categories {
  width: 100%;
  margin: 32px 0 18px;

  &__heading {
    margin-bottom: 16px;
    text-align: center;

    p {
      margin-bottom: 5px;
      color: #6b8296;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h2 {
      color: #29445d;
      font-size: 28px;
      font-weight: 700;
    }
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  &__card {
    position: relative;
    display: flex;
    min-height: 214px;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
    padding: 20px;
    border-radius: 12px;
    color: #fff;
    background: #426783;
    box-shadow: 0 10px 20px rgba(50, 78, 108, 0.12);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &::after {
      position: absolute;
      inset: 0;
      content: '';
      background: linear-gradient(180deg, rgba(15, 38, 57, 0.03) 28%, rgba(15, 38, 57, 0.78) 100%);
    }

    &:hover {
      box-shadow: 0 16px 28px rgba(50, 78, 108, 0.2);
      transform: translateY(-3px);
    }

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    span,
    small {
      position: relative;
      z-index: 1;
    }

    span {
      font-size: 24px;
      font-weight: 700;
    }

    small {
      margin-top: 4px;
      color: rgba(255, 255, 255, 0.88);
      font-size: 14px;
    }
  }

  @include phone {
    margin-top: 24px;

    &__heading h2 {
      font-size: 24px;
    }

    &__list {
      gap: 8px;
    }

    &__card {
      min-height: 145px;
      padding: 12px;

      span {
        font-size: 18px;
      }

      small {
        display: none;
      }
    }
  }

  @media screen and (max-width: 420px) {
    &__list {
      grid-template-columns: 1fr;
    }

    &__card {
      min-height: 132px;
    }
  }
}
</style>
