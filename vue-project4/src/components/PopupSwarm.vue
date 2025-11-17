<!-- ===========================
     src/components/PopupSwarm.vue
     Ghost text swarm (no boxes)
     =========================== -->
<template>
  <div class="swarm-layer">
    <span
      v-for="fragment in fragments"
      :key="fragment.id"
      class="ghost-fragment"
      :style="fragmentStyle(fragment)"
    >
      {{ fragment.text }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 0 = calm, 100 = full chaos
  chaosLevel: {
    type: Number,
    required: true,
  },
})

// short phrases that feel like system memories or glitches
const baseSnippets = [
  'hover recorded',
  'ghost input',
  'attempt blocked',
  'softened tone',
  'intensified tone',
  'cursor doubt',
  'unlogged feeling',
  'auto-corrected',
  'refused alignment',
  'partial surrender',
  'edited quietly',
  'denied silently',
  'overflow: visible',
  'unstable style',
  'almost saved',
  'drag ignored',
  'mis-click',
  'watching you',
  'reframed desire',
  'data residue',
]

// colors cycling white → red → almost black
const colors = ['#f7f7f7', '#ff4444', '#111111']

// generate a dense swarm – more chaos = more fragments
const fragments = computed(() => {
  const baseCount = 70
  const extra = Math.round(props.chaosLevel * 1.4) // up to ~140 more
  const count = baseCount + extra
  const items = []

  for (let i = 0; i < count; i++) {
    const id = i + '-' + Math.random().toString(36).slice(2, 6)
    const text = baseSnippets[i % baseSnippets.length]

    const x = Math.random() * 100
    const y = Math.random() * 100

    const depth = Math.random() // 0–1
    const size = 0.55 + Math.random() * 0.9 // rem
    const rotation = Math.random() * 18 - 9

    const delay = Math.random() * 8
    const duration = 6 + Math.random() * 10

    const color = colors[i % colors.length]

    items.push({
      id,
      text,
      x,
      y,
      depth,
      size,
      rotation,
      delay,
      duration,
      color,
    })
  }

  return items
})

function fragmentStyle(f) {
  const baseOpacity = 0.15 + f.depth * 0.55 // 0.15–0.7
  const blur = 0.5 + f.depth * 3.5
  const letterSpacing = f.depth > 0.6 ? '0.12em' : '0.04em'

  return {
    left: f.x + '%',
    top: f.y + '%',
    color: f.color,
    fontSize: `${f.size}rem`,
    opacity: baseOpacity,
    filter: `blur(${blur}px)`,
    transform: `translate(-50%, -50%) rotate(${f.rotation}deg)`,
    animationDelay: `${f.delay}s`,
    animationDuration: `${f.duration}s`,
    letterSpacing,
  }
}
</script>

<style scoped>
.swarm-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

/* free-floating text fragments */
.ghost-fragment {
  position: absolute;
  text-transform: lowercase;
  white-space: nowrap;
  animation-name: floatFlicker;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  text-shadow:
    0 0 6px rgba(0, 0, 0, 0.9),
    0 0 16px rgba(0, 0, 0, 0.9);
}

@keyframes floatFlicker {
  0% {
    transform: translate(-50%, -50%) translate3d(0, 0, 0) scale(1);
    opacity: 0.1;
  }
  15% {
    opacity: 0.6;
  }
  35% {
    transform: translate(-50%, -50%) translate3d(4px, -6px, 0) scale(1.06);
    opacity: 0.8;
  }
  55% {
    transform: translate(-50%, -50%) translate3d(-6px, 4px, 0) scale(0.96);
    opacity: 0.4;
  }
  75% {
    opacity: 0.75;
  }
  100% {
    transform: translate(-50%, -50%) translate3d(0, 0, 0) scale(1);
    opacity: 0.15;
  }
}
</style>
