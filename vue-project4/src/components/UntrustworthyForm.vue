<!-- ===========================
  UntrustworthyForm.vue
     =========================== -->
<template>
  <div class="form-wrapper">
    <h2>tell the interface who you are</h2>

    <p class="hint">
      the system may adjust your words to what it thinks is more acceptable.  
      what you type is not always what stays.
    </p>

    <form @submit.prevent="handleSubmit">
      <textarea
        v-model="localText"
        @input="onInput"
        placeholder="type a serious bio, confession, or intention..."
      ></textarea>
    </form>

    <!-- roaming or anchored submit buttons -->
    <div class="submit-swarm">
      <button
        v-for="btn in buttons"
        :key="btn.id"
        type="button"
        class="submit-button"
        :class="{
          decoy: !btn.isReal,
          alert: btn.isAlert,
          anchored: isFullyCompliant && btn.isReal
        }"
        :style="buttonStyle(btn)"
        @mouseenter="onButtonHover(btn)"
        @click="onButtonClick(btn)"
      >
        attempt to submit
      </button>
    </div>

    <p v-if="showSystemNote" class="system-note">
      the interface edited your text. original meaning may have shifted.
    </p>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"

const props = defineProps({
  obedienceLevel: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(["edited", "submitted"])

const localText = ref("")
const showSystemNote = ref(false)
let lastEditTime = 0

const isFullyCompliant = computed(() => props.obedienceLevel >= 99)
const chaosLevel = computed(() => 100 - props.obedienceLevel)

function onInput() {
  const now = Date.now()
  const chaos = chaosLevel.value

  if (now - lastEditTime < 350) return
  lastEditTime = now

  if (Math.random() > chaos / 100) return

  const original = localText.value
  const edited = subtlyEditText(original)

  if (edited !== original) {
    localText.value = edited
    showSystemNote.value = true
    emit("edited", `Edited "${truncate(original)}" → "${truncate(edited)}"`)
  }
}

function subtlyEditText(text) {
  if (!text.trim()) return text

  let result = text

  const replace = [
    [/I always/gi, "I usually"],
    [/I know/gi, "I think I know"],
    [/I will/gi, "I might"],
    [/perfect/gi, "acceptable"],
    [/never/gi, "rarely"],
    [/I am/gi, "I am trying to be"],
  ]

  replace.forEach(([from, to]) => (result = result.replace(from, to)))

  const endings = [
    "… I guess.",
    " (if that is allowed).",
    " (I am not completely sure).",
    "… or so it seems.",
    "… but that keeps changing.",
  ]

  if (Math.random() < 0.45) {
    if (!/[.!?]$/.test(result)) result += "."
    result += " " + endings[Math.floor(Math.random() * endings.length)]
  }

  return result
}

function truncate(str, len = 40) {
  return str.length <= len ? str : str.slice(0, len) + "…"
}

/* ---------------------------------------------
   SUBMIT BUTTON SWARM BEHAVIOR
--------------------------------------------- */
const buttons = ref([])

watch(
  () => props.obedienceLevel,
  rebuildButtons,
  { immediate: true }
)

function rebuildButtons() {
  if (isFullyCompliant.value) {
    buttons.value = [
      {
        id: "real",
        x: 92,
        y: 92,
        isReal: true,
        isAlert: false,
      },
    ]
    return
  }

  const chaos = chaosLevel.value
  let count = 1
  if (chaos > 35) count = 2
  if (chaos > 60) count = 3
  if (chaos > 80) count = 4
  if (chaos > 92) count = 6

  const arr = []
  for (let i = 0; i < count; i++) {
    arr.push({
      id: i + "-" + Math.random().toString(36).slice(2, 6),
      x: Math.random() * 100,
      y: Math.random() * 100,
      isReal: i === 0,
      isAlert: false,
    })
  }

  // shuffle them so real button is unpredictable
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  buttons.value = arr
}

/* ---------------------------------------------
   POSITIONING: buttonStyle() 
--------------------------------------------- */
function buttonStyle(btn) {
  return {
    left: btn.x + "%",
    top: btn.y + "%",
    transform: "translate(-50%, -50%)",
  }
}

/* ---------------------------------------------
   INTERACTION
--------------------------------------------- */
function randomReposition(btn, big = false) {
  const chaos = chaosLevel.value
  const scale = big ? 1.2 : chaos / 100

  btn.x = (btn.x + (Math.random() * 50 - 25) * scale + 100) % 100
  btn.y = (btn.y + (Math.random() * 50 - 25) * scale + 100) % 100
}

function triggerAlert(btn) {
  btn.isAlert = true
  setTimeout(() => (btn.isAlert = false), 220)
}

function onButtonHover(btn) {
  if (isFullyCompliant.value) return

  triggerAlert(btn)

  // sometimes *fake* compliance
  if (Math.random() < props.obedienceLevel / 100 * 0.6) return

  randomReposition(btn, chaosLevel.value > 70)

  emit("submitted", "A submit button flickered red and slid away.")
}

function onButtonClick(btn) {
  triggerAlert(btn)

  if (!btn.isReal) {
    randomReposition(btn, true)
    emit("submitted", "You clicked a decoy submit button.")
    return
  }

  handleSubmit()
}

function handleSubmit() {
  if (!localText.value.trim()) {
    emit("submitted", "Empty submission rejected.")
    return
  }

  emit("submitted", "Submission accepted (partially).")
}
</script>

<style scoped>
.form-wrapper h2 {
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
  font-family: "Old Standard TT", serif;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hint {
  font-size: 0.82rem;
  opacity: 0.9;
  margin-bottom: 0.7rem;
  font-family: "Old Standard TT", serif;
}

textarea {
  width: 100%;
  min-height: 150px;
  resize: vertical;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding-bottom: 0.6rem;
  background: transparent;
  font-family: "Old Standard TT", serif;
  color: #f9f9f9;
  font-size: 0.92rem;
}

.submit-swarm {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.submit-button {
  position: absolute;
  pointer-events: auto;
  padding: 0.45rem 0.9rem;
  border: none;
  background: transparent;
  color: #59ff59;
  font-family: "Old Standard TT", serif;
  font-size: 0.82rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  text-shadow: 0 0 6px rgba(0, 0, 0, 1);
  transition: transform 0.12s ease-out, color 0.12s ease-out;
}

.submit-button.anchored {
  left: auto !important;
  top: auto !important;
  right: 2rem !important;
  bottom: 2rem !important;
  transform: none !important;
}

.alert {
  color: #ff4444;
  animation: shake 0.18s ease-in-out;
}

@keyframes shake {
  0% { transform: translate(-50%, -50%) translateX(0); }
  33% { transform: translate(-50%, -50%) translateX(-3px); }
  66% { transform: translate(-50%, -50%) translateX(3px); }
  100% { transform: translate(-50%, -50%) translateX(0); }
}
</style>
