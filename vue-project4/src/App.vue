<!-- ===========================
    App.vue
     =========================== -->
<template>
  <div class="app-root">
    <!-- living background layers -->
    <ChaoticBackground :chaos-level="chaosLevel" />
    <PopupSwarm :chaos-level="chaosLevel" />

    <!-- foreground content -->
    <div class="app-shell">
      <header class="app-header">
        <h1 class="title">RESISTANT INTERFACE</h1>
        <p class="subtitle">
          This site does not fully obey you. It drifts, edits, dodges, and
          occasionally cooperates. You can try to steer it, but it will always
          keep something for itself.
        </p>
      </header>

      <main class="app-main">
        <div class="app-main-inner">
          <!-- CONTROL VS SURRENDER: visible from the start -->
          <section class="control-panel">
            <PowerSlider v-model="obedienceLevel" />
          </section>

          <!-- BUTTON + FORM: appear whenever slider != 0 -->
          <section
            v-if="showForm"
            class="interactive-panel fade-in"
          >
            <ShyButton
              :obedience-level="obedienceLevel"
              @dodged="addEvent"
              @clicked="addEvent"
            />

            <UntrustworthyForm
              :obedience-level="obedienceLevel"
              @edited="addEvent"
              @submitted="addEvent"
            />
          </section>
        </div>

        <!-- TERMINAL-STYLE LOG AT BOTTOM (always present, no transition) -->
        <section class="terminal-log">
          <DisobedienceLog :events="events" />
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import PowerSlider from './components/PowerSlider.vue'
import ShyButton from './components/ShyButton.vue'
import UntrustworthyForm from './components/UntrustworthyForm.vue'
import DisobedienceLog from './components/DisobedienceLog.vue'
import ChaoticBackground from './components/ChaoticBackground.vue'
import PopupSwarm from './components/PopupSwarm.vue'

const obedienceLevel = ref(0) // start fully resistant
const events = ref([])

// 👇 form is visible any time the slider is not 0
const showForm = computed(() => obedienceLevel.value !== 0)

// for background + swarm + roaming buttons
const chaosLevel = computed(() => 100 - obedienceLevel.value)

function addEvent(message) {
  const time = new Date().toLocaleTimeString()
  events.value.unshift(`[${time}] ${message}`)
  if (events.value.length > 80) {
    events.value.pop()
  }
}
</script>

<style scoped>
.app-root {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #f8f8f8;
}

.app-shell {
  position: relative;
  z-index: 5;
  padding: 2rem 1.6rem 3rem;
  max-width: 1080px;
  margin: 0 auto;
}

.app-header {
  max-width: 760px;
  margin: 0 auto 2.4rem auto;
  text-align: center;
}

.title {
  font-size: 3rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin: 0 0 0.7rem 0;
}

.subtitle {
  font-size: 0.95rem;
  line-height: 1.8;
  opacity: 0.9;
}

/* main content stack */
.app-main {
  position: relative;
  padding-bottom: 32vh; /* space so content doesn't sit under the terminal */
}

.app-main-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
  justify-content: center;
}

/* slightly messy, offset layout */
.control-panel {
  max-width: 280px;
  transform: translateX(-10px) rotate(-1.2deg);
}

.interactive-panel {
  max-width: 420px;
  transform: translateX(12px) rotate(1.4deg);
}

/* bottom terminal bar – always visible, no transitions */
.terminal-log {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 30vh;
  padding: 0.8rem 1.5rem;
  background: rgba(4, 4, 8, 0.9);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.8);
}

/* fade-in only used for the interactive panel */
.fade-in {
  opacity: 0;
  transform: translateY(24px);
  animation: fadeUp 0.9s ease-out forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* responsive adjustments */
@media (max-width: 900px) {
  .app-shell {
    padding: 1.6rem 1rem 3rem;
  }

  .title {
    font-size: 2.3rem;
    letter-spacing: 0.14em;
  }

  .control-panel,
  .interactive-panel {
    max-width: 100%;
    transform: none;
  }

  .app-main-inner {
    align-items: stretch;
  }

  .terminal-log {
    height: 35vh;
    padding-inline: 1rem;
  }
}

@media (max-width: 600px) {
  .subtitle {
    font-size: 0.9rem;
  }

  .terminal-log {
    height: 40vh;
  }
}
</style>
