<template>
  <section class="interior-visualizer" aria-labelledby="interior-visualizer-title">
    <div class="interior-visualizer__heading">
      <p class="interior-visualizer__eyebrow">Интерьерный визуализатор</p>
      <h2 id="interior-visualizer-title">{{ productName }} в гостиной</h2>
      <p>Текстура покрытия показана в готовом интерьере. Меняйте масштаб рисунка ползунком.</p>
    </div>

    <div class="interior-visualizer__controls" aria-label="Настройки визуализатора">
      <div class="interior-visualizer__control-group">
        <label class="interior-visualizer__control-label" for="interior-pattern-density">Частота рисунка</label>
        <div class="interior-visualizer__range-control">
          <span>Реже</span>
          <input id="interior-pattern-density" v-model.number="density" type="range" min="0.4" max="0.7" step="0.01" :aria-valuetext="`Масштаб ${density.toFixed(2)}`" />
          <span>Чаще</span>
        </div>
      </div>
    </div>

    <div class="interior-visualizer__scene" :class="{ 'interior-visualizer__scene--ready': isReady }" :style="{ backgroundImage: `url(${InteriorMaster})` }">
      <img :src="InteriorForeground" alt="Светлая гостиная для подбора напольного покрытия" class="interior-visualizer__fallback" />
      <canvas ref="canvas" class="interior-visualizer__canvas" aria-hidden="true" />
    </div>

    <p class="interior-visualizer__note">Визуализация помогает оценить оттенок и рисунок. Оттенок на экране может отличаться от образца из-за освещения и настроек дисплея.</p>
  </section>
</template>

<script setup lang="ts">
import InteriorMaster from '~/assets/img/interior-visualizer-master-color-v1.png'
import InteriorFloorLightShadow from '~/assets/img/interior-visualizer-floor-light-shadow-v3.png'
import InteriorForeground from '~/assets/img/interior-visualizer-foreground-color-v2.png'

interface Props {
  productName: string
  textureUrl: string
  forceRotateToAcross?: boolean
}

const props = defineProps<Props>()
const canvas = ref<HTMLCanvasElement | null>(null)
const isReady = ref(false)
const density = ref(0.5)

const floorStartY = 562
const productionStaticPrefix = 'https://zampol.ru/static/'
const localStaticProxyPrefix = '/__zampol-static/'

function resolveTextureSource(src: string) {
  if (!import.meta.dev || !src.startsWith(productionStaticPrefix)) return src

  return `${localStaticProxyPrefix}${src.slice(productionStaticPrefix.length)}`
}

function loadImage(src: string, allowCors = false) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    if (allowCors) image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function shouldRotateTextureAcross(texture: HTMLImageElement) {
  const sampleSize = 72
  const sample = document.createElement('canvas')
  sample.width = sampleSize
  sample.height = sampleSize
  const context = sample.getContext('2d', { willReadFrequently: true })

  if (!context) return false

  try {
    context.drawImage(texture, 0, 0, sampleSize, sampleSize)
    const pixels = context.getImageData(0, 0, sampleSize, sampleSize).data
    let acrossChange = 0
    let depthChange = 0

    for (let y = 1; y < sampleSize; y += 1) {
      for (let x = 1; x < sampleSize; x += 1) {
        const index = (y * sampleSize + x) * 4
        const brightness = pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114
        const leftBrightness = pixels[index - 4] * 0.299 + pixels[index - 3] * 0.587 + pixels[index - 2] * 0.114
        const aboveBrightness = pixels[index - sampleSize * 4] * 0.299 + pixels[index - sampleSize * 4 + 1] * 0.587 + pixels[index - sampleSize * 4 + 2] * 0.114

        acrossChange += Math.abs(brightness - leftBrightness)
        depthChange += Math.abs(brightness - aboveBrightness)
      }
    }

    return acrossChange > depthChange * 1.15
  } catch {
    return false
  }
}

function createTextureTile(texture: HTMLImageElement) {
  const tile = document.createElement('canvas')
  tile.width = 2048
  tile.height = 2048
  const context = tile.getContext('2d')

  if (!context) return tile

  const shouldRotate = props.forceRotateToAcross || shouldRotateTextureAcross(texture)
  const imageWidth = Math.round(340 / density.value)
  const tileWidth = imageWidth
  const tileHeight = Math.max(120, Math.round(imageWidth * (shouldRotate ? texture.naturalWidth / texture.naturalHeight : texture.naturalHeight / texture.naturalWidth)))

  for (let y = 0; y < tile.height; y += tileHeight) {
    for (let x = -tileWidth; x < tile.width + tileWidth; x += tileWidth) {
      const rowOffset = (Math.floor(y / tileHeight) % 2) * Math.round(tileWidth / 2)
      const tileX = x - rowOffset

      if (shouldRotate) {
        context.save()
        context.translate(tileX + tileWidth / 2, y + tileHeight / 2)
        context.rotate(Math.PI / 2)
        context.drawImage(texture, -tileHeight / 2, -tileWidth / 2, tileHeight, tileWidth)
        context.restore()
      } else {
        context.drawImage(texture, tileX, y, tileWidth, tileHeight)
      }
    }
  }

  return tile
}

function drawFloorLightShadowOverlay(context: CanvasRenderingContext2D, overlay: HTMLImageElement, width: number, height: number) {
  context.drawImage(overlay, 0, 0, width, height)
}

function drawProjectedFloor(context: CanvasRenderingContext2D, texture: HTMLCanvasElement, width: number, height: number) {
  const stripHeight = 3
  const floorHeight = height - floorStartY
  const perspective = 0.56

  for (let y = floorStartY; y < height; y += stripHeight) {
    const depth = (y - floorStartY) / floorHeight
    const nextDepth = Math.min(1, (y + stripHeight - floorStartY) / floorHeight)
    const sourceY = Math.floor(Math.pow(depth, perspective) * texture.height)
    const nextSourceY = Math.ceil(Math.pow(nextDepth, perspective) * texture.height)
    const sourceHeight = Math.max(1, nextSourceY - sourceY)
    context.drawImage(
      texture,
      0,
      sourceY,
      texture.width,
      sourceHeight,
      0,
      y,
      width,
      stripHeight + 1,
    )
  }
}

async function renderScene() {
  isReady.value = false

  try {
    const [foreground, floorLightShadow, texture] = await Promise.all([loadImage(InteriorForeground), loadImage(InteriorFloorLightShadow), loadImage(resolveTextureSource(props.textureUrl))])
    const target = canvas.value
    const context = target?.getContext('2d')

    if (!target || !context) return

    target.width = foreground.naturalWidth
    target.height = foreground.naturalHeight
    context.clearRect(0, 0, target.width, target.height)
    drawProjectedFloor(context, createTextureTile(texture), target.width, target.height)
    drawFloorLightShadowOverlay(context, floorLightShadow, target.width, target.height)
    context.drawImage(foreground, 0, 0, target.width, target.height)
    isReady.value = true
  } catch {
    isReady.value = false
  }
}

onMounted(() => {
  renderScene()
})
watch(() => props.textureUrl, renderScene)
watch(density, renderScene)
</script>

<style scoped lang="scss">
.interior-visualizer {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  border: 1px solid #d6e1eb;
  border-radius: 16px;
  background: #f8fbfd;

  &__heading {
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-width: 720px;

    h2 {
      color: #29445d;
      font-size: 24px;
      font-weight: 600;
    }

    p:last-child,
    .interior-visualizer__note {
      color: #5c748a;
      line-height: 1.5;
    }
  }

  &__eyebrow {
    color: #a37552;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 14px 24px;
    align-items: end;
  }

  &__control-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  &__control-label {
    color: #5c748a;
    font-size: 13px;
    font-weight: 600;
  }

  &__control-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;

    :deep(.btn) {
      min-width: 0;
      font-size: 13px;
    }
  }

  &__range-control {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #5c748a;
    font-size: 12px;

    input {
      width: 168px;
      height: 5px;
      border-radius: 999px;
      appearance: none;
      background: #c8d7e3;
      cursor: pointer;

      &::-webkit-slider-thumb {
        width: 16px;
        height: 16px;
        border: 2px solid #fff;
        border-radius: 50%;
        appearance: none;
        background: var(--primary-btn);
        box-shadow: 0 1px 3px rgba(41, 68, 93, 0.3);
      }

      &::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border: 2px solid #fff;
        border-radius: 50%;
        background: var(--primary-btn);
        box-shadow: 0 1px 3px rgba(41, 68, 93, 0.3);
      }
    }
  }

  &__scene {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    aspect-ratio: 3 / 2;
    background-color: #dfe8e7;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    &--ready .interior-visualizer__fallback {
      opacity: 0;
    }
  }

  &__fallback,
  &__canvas {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__fallback {
    transition: opacity 160ms ease;
  }

  &__canvas {
    z-index: 1;
  }

  &__note {
    color: #6b8296;
    font-size: 12px;
    line-height: 1.45;
  }

  @include phone {
    padding: 14px;

    &__heading h2 {
      font-size: 20px;
    }

    &__controls {
      gap: 12px;
    }

    &__control-actions {
      gap: 6px;
    }

    &__range-control input {
      width: 150px;
    }
  }
}
</style>
