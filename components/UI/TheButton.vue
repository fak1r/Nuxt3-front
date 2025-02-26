<template>
  <button
    class="btn"
    type="button"
    :style="buttonStyles"
    @click="handleClick"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
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
const props = defineProps<{
  variant: 'Primary' | 'Secondary'
}>()

const ripples = ref<{ id: number; x: number; y: number }[]>([])
const isHovered = ref(false)

const buttonVariants = {
  Primary: {
    background: 'var(--primary-btn)',
    hover: 'var(--primary-btn-hover)',
    border: '1px solid transparent',
    color: '#fff',
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

const buttonStyles = computed(() => {
  return {
    background: isHovered.value ? buttonVariants[props.variant].hover : buttonVariants[props.variant].background,
    border: buttonVariants[props.variant].border,
    color: buttonVariants[props.variant].color,
  }
})

const rippleColorStyle = computed(() => {
  return buttonVariants[props.variant].ripple
})

function handleClick(event: MouseEvent) {
  const button = event.currentTarget as HTMLButtonElement
  const rect = button.getBoundingClientRect()

  ripples.value = []

  const ripple = {
    id: Date.now(),
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }

  ripples.value.push(ripple)
}

function removeRipple() {
  ripples.value = []
}
</script>

<style scoped lang="scss">
.btn {
  border: none;
  outline: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 20px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
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
