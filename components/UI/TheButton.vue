<template>
  <button
    type="button"
    :style="buttonStyles"
    class="btn"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <span>
      <slot />
    </span>
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="btn__ripple"
      :style="{ top: ripple.y + 'px', left: ripple.x + 'px', background: rippleColorStyle }"
      @animationend="removeRipple"
    />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'Primary' | 'Secondary'
  size?: 'sm' | 'md' | 'lg'
}

const { variant = 'Primary', size = 'lg' } = defineProps<Props>()

const ripples = ref<{ id: number; x: number; y: number }[]>([])
const isHovered = ref(false)
const isFocused = ref(false)

const buttonVariants = {
  Primary: {
    background: 'var(--primary-btn)',
    hover: 'var(--primary-btn-hover)',
    border: '1px solid transparent',
    color: 'var(--white-color)',
    ripple: 'rgba(255, 255, 255, 0.4)',
  },
  Secondary: {
    background: 'transparent',
    hover: 'rgba(100, 116, 139, 0.15)',
    border: '1px solid var(--primary-btn)',
    color: 'var(--primary-btn)',
    ripple: 'rgba(0, 0, 0, 0.15)',
  },
}
const buttonSizes = {
  sm: '3px 12px',
  md: '6px 16px',
  lg: '9px 20px',
}

const buttonVariant = computed(() => buttonVariants[variant])
const buttonSize = computed(() => buttonSizes[size])

const buttonStyles = computed(() => {
  const isActive = isHovered.value || isFocused.value
  return {
    background: isActive ? buttonVariant.value.hover : buttonVariant.value.background,
    border: buttonVariant.value.border,
    color: buttonVariant.value.color,
    padding: buttonSize.value,
  }
})

const rippleColorStyle = computed(() => {
  return buttonVariant.value.ripple
})

function handleClick(event: MouseEvent | PointerEvent) {
  const button = event.currentTarget as HTMLButtonElement
  const rect = button.getBoundingClientRect()
  ripples.value = []
  let x, y
  const isMouseClick = (event as PointerEvent).pointerType === 'mouse'

  if (isMouseClick) {
    x = event.clientX - rect.left
    y = event.clientY - rect.top
  } else {
    x = rect.width / 2
    y = rect.height / 2
  }
  const ripple = {
    id: Date.now(),
    x,
    y,
  }
  ripples.value.push(ripple)
}

function removeRipple() {
  ripples.value = []
}

function handleFocus() {
  isFocused.value = true
}

function handleBlur() {
  isFocused.value = false
}

function handleMouseOver() {
  isHovered.value = true
}

function handleMouseLeave(event: MouseEvent) {
  const button = event.currentTarget as HTMLButtonElement
  if (isFocused.value) {
    button.blur()
  }
  isHovered.value = false
}
</script>

<style scoped lang="scss">
.btn {
  padding: 9px 20px;
  font-size: 16px;
  border-radius: 6px;
  overflow: hidden;
  transition: background 0.2s ease;
  font-weight: bold;

  &__ripple {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    transform: translate(-50%, -50%);
  }
}

@keyframes ripple-animation {
  to {
    transform: scale(8);
    opacity: 0;
  }
}
</style>
