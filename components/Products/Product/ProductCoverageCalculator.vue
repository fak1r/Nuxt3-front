<template>
  <section class="coverage-calculator" aria-labelledby="coverage-calculator-title">
    <div class="coverage-calculator__heading">
      <h2 id="coverage-calculator-title">Рассчитайте количество покрытия</h2>
      <p>В одной упаковке — {{ formatArea(packageCoverage) }} м²</p>
    </div>

    <div class="coverage-calculator__controls">
      <label>
        <span>Площадь помещения, м²</span>
        <input v-model.number="area" type="number" min="0" step="0.1" inputmode="decimal" />
      </label>
      <label>
        <span>Запас на подрезку</span>
        <select v-model.number="reservePercent">
          <option :value="5">5%</option>
          <option :value="10">10%</option>
          <option :value="15">15%</option>
        </select>
      </label>
    </div>

    <dl v-if="hasArea" class="coverage-calculator__result">
      <div>
        <dt>Нужно с запасом</dt>
        <dd>{{ formatArea(requiredArea) }} м²</dd>
      </div>
      <div>
        <dt>Упаковок</dt>
        <dd>{{ packages }}</dd>
      </div>
      <div>
        <dt>Покрытие в упаковках</dt>
        <dd>{{ formatArea(coverageArea) }} м²</dd>
      </div>
      <div>
        <dt>Ориентировочная сумма</dt>
        <dd>{{ formatPrice(estimatedTotal) }} ₽</dd>
      </div>
    </dl>

    <p class="coverage-calculator__note">Расчёт предварительный: точное количество подтвердит продавец перед покупкой.</p>
  </section>
</template>

<script setup lang="ts">
interface Props {
  packageCoverage: number
  price: number
}

const { packageCoverage, price } = defineProps<Props>()

const area = ref<number | null>(null)
const reservePercent = ref(5)
const { formatPrice } = usePriceFormat()

const safeArea = computed(() => (Number.isFinite(area.value) && (area.value || 0) > 0 ? Number(area.value) : 0))
const hasArea = computed(() => safeArea.value > 0)
const requiredArea = computed(() => Math.ceil(safeArea.value * (1 + reservePercent.value / 100) * 100) / 100)
const packages = computed(() => (hasArea.value ? Math.ceil(requiredArea.value / packageCoverage) : 0))
const coverageArea = computed(() => packages.value * packageCoverage)
const estimatedTotal = computed(() => coverageArea.value * price)

function formatArea(value: number) {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value)
}
</script>

<style scoped lang="scss">
.coverage-calculator {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  border: 1px solid #d6e1eb;
  border-radius: 12px;
  background: #f8fbfd;

  &__heading {
    display: flex;
    flex-direction: column;
    gap: 4px;

    h2 {
      font-size: 17px;
      font-weight: 700;
      color: #29445d;
    }

    p {
      font-size: 13px;
      color: #6b8296;
    }
  }

  &__controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    label {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 0;

      span {
        font-size: 12px;
        color: #5c748a;
      }
    }

    input,
    select {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #b8cbd9;
      border-radius: 7px;
      padding: 9px 10px;
      color: #29445d;
      background: #fff;
      font: inherit;

      &:focus {
        border-color: #527999;
        outline: 2px solid rgba(82, 121, 153, 0.18);
      }
    }
  }

  &__result {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    div {
      padding: 9px 10px;
      border-radius: 8px;
      background: #edf4f9;
    }

    dt {
      font-size: 11px;
      color: #6b8296;
    }

    dd {
      margin: 3px 0 0;
      color: #29445d;
      font-size: 15px;
      font-weight: 700;
    }
  }

  &__note {
    font-size: 12px;
    line-height: 1.4;
    color: #6b8296;
  }

  @media screen and (max-width: 450px) {
    padding: 12px;

    &__controls,
    &__result {
      grid-template-columns: 1fr;
    }
  }
}
</style>
