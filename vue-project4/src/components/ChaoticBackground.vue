<!-- ===========================
     src/components/ChaoticBackground.vue
     Ritual style living texture (darker gray)
     =========================== -->
<template>
  <div class="bg-layer">
    <div class="noise-layer" :style="noiseStyle"></div>
    <div class="halo-layer" :style="haloStyle"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 0 = calm, 100 = maximum chaos
  chaosLevel: {
    type: Number,
    required: true,
  },
})

const noiseStyle = computed(() => {
  const intensity = 0.35 + props.chaosLevel / 230 // about 0.35–0.78
  const duration = 32 - props.chaosLevel * 0.18 // slower when calm
  return {
    opacity: intensity,
    animationDuration: `${Math.max(12, duration)}s`,
  }
})

const haloStyle = computed(() => {
  const scale = 1 + props.chaosLevel / 150
  const blur = 40 + props.chaosLevel / 1.8
  return {
    transform: `scale(${scale})`,
    filter: `blur(${blur}px)`,
  }
})
</script>

<style scoped>
.bg-layer {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

/* grainy moving texture */
.noise-layer {
  position: absolute;
  inset: -40px;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-color: #111116;
  mix-blend-mode: soft-light;
  opacity: 0.6;
  animation-name: driftNoise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* central glow, but more gray and subtle */
.halo-layer {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(220, 220, 230, 0.12),
    rgba(5, 5, 9, 0.98)
  );
  opacity: 0.85;
  transition: transform 1.3s ease, filter 1.3s ease;
}

@keyframes driftNoise {
  0% {
    transform: translate3d(0, 0, 0) scale(1.05);
  }
  50% {
    transform: translate3d(-26px, 20px, 0) scale(1.16);
  }
  100% {
    transform: translate3d(18px, -18px, 0) scale(1.1);
  }
}
</style>
