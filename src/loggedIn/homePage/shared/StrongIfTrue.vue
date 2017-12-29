<template>
  <strong v-if="condition">{{ text}}</strong>
  <span v-else>{{ text }}</span>
</template>

<script>
export default {
  props: {
    condition: Boolean,
    text: String
  }
}
</script>
