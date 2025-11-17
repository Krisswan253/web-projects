<!-- ===========================
     src/components/ShyButton.vue
     =========================== -->
<template>
  <div class="shy-wrapper">
    <div
      class="shy-button"
      :class="{ vibrating: isVibrating }"
      :style="buttonStyle"
      @mouseenter="onHover"
      @click="onClick"
    >
      try to click me
    </div>
    <p class="hint">
      the button does not fully trust your intentions. it may dodge, tremble, or
      briefly accept you.
    </p>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue'

const props = defineProps({
  obedienceLevel: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['dodged', 'clicked'])

const x = ref(0)
const y = ref(0)
const isVibrating = ref(false)
let vibrationTimer = null

const jumpStrength = computed(() => {
  const chaos = 100 - props.obedienceLevel
  return 14 + chaos * 0.7
})

const buttonStyle = computed(() => ({
  transform: `translate(${x.value}px, ${y.value}px)`,
}))

function startVibration() {
  if (vibrationTimer) return
  isVibrating.value = true
  vibrationTimer = setInterval(() => {
    x.value += (Math.random() - 0.5) * 2
    y.value += (Math.random() - 0.5) * 2
  }, 60)
}

function stopVibration() {
  if (!vibrationTimer) return
  clearInterval(vibrationTimer)
  vibrationTimer = null
  isVibrating.value = false
}

function onHover() {
  const allowChance = props.obedienceLevel / 100
  if (Math.random() < allowChance * 0.7) {
    startVibration()
    return
  }

  const angle = Math.random() * Math.PI * 2
  x.value += Math.cos(angle) * jumpStrength.value
  y.value += Math.sin(angle) * jumpStrength.value

  emit('dodged', 'ShyButton dodged your cursor.')
  startVibration()
}

function onClick() {
  emit('clicked', 'ShyButton reluctantly let you click.')
  stopVibration()
}

watch(
  () => props.obedienceLevel,
  () => {
    x.value *= 0.6
    y.value *= 0.6
    if (props.obedienceLevel > 70) {
      stopVibration()
    }
  }
)

onMounted(() => {
  startVibration()
})

onBeforeUnmount(() => {
  stopVibration()
})
</script>

<style scoped>
.shy-wrapper {
  position: relative;
  margin-bottom: 0.6rem;
}

.shy-button {
  display: inline-block;
  cursor: pointer;
  user-select: none;
  font-size: 0.9rem;
  text-transform: lowercase;
  letter-spacing: 0.16em;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.7);
}

.shy-button.vibrating {
  animation: pulse 0.6s infinite alternate;
}

.shy-button:hover {
  text-decoration: underline;
}

.hint {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  opacity: 0.85;
}

@keyframes pulse {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(1px, -1px) scale(1.03);
  }
}
</style>
