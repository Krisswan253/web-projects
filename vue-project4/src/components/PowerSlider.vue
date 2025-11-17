<!-- ===========================
     PowerSlider.vue
     =========================== -->
<template>
  <div class="power-slider">
    <h2>CONTROL VS SURRENDER</h2>

    <p class="label">
      <span>maximum resistance</span>
      <span>obedience: {{ modelValue }}%</span>
      <span>full compliance</span>
    </p>

    <!-- IMPORTANT: v-model emit path -->
    <input
      type="range"
      min="0"
      max="100"
      :value="modelValue"
      @input="updateValue($event.target.value)"
    />

    <p class="explanation">
      Drag toward control to provoke the interface.  
      Drag toward surrender if you want it to cooperate (a little).
    </p>
  </div>
</template>

<script setup>
/*
  This component MUST emit exactly:
      update:modelValue
  or v-model will never update in App.vue.
*/

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(["update:modelValue"])

function updateValue(val) {
  emit("update:modelValue", Number(val))  
}
</script>

<style scoped>
.power-slider h2 {
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
  font-family: "Old Standard TT", serif;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.label {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  opacity: 0.9;
  margin-bottom: 0.4rem;
  font-family: "Old Standard TT", serif;
}

input[type="range"] {
  width: 100%;
  margin-top: 0.3rem;
}

.explanation {
  margin-top: 0.6rem;
  font-size: 0.82rem;
  opacity: 0.9;
  line-height: 1.5;
  font-family: "Old Standard TT", serif;
}
</style>
