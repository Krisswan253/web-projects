<!-- ===========================
     src/components/DisobedienceLog.vue
     =========================== -->
<template>
  <div class="log">
    <div class="log-header">LOG OF DISOBEDIENCE</div>
    <div v-if="!events.length" class="empty">
      [ waiting for misbehaviour… ]
    </div>
    <ul v-else>
      <li v-for="(event, index) in events" :key="index">
        {{ event }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  events: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.log {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: "SF Mono", "Menlo", "Monaco", monospace;
  font-size: 0.8rem;
}

.log-header {
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.8;
  margin-bottom: 0.4rem;
}

.empty {
  opacity: 0.7;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

li {
  padding: 0.18rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
</style>
