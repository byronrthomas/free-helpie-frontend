<template>
  <div>
    <template v-for="(item, index) in selectedItems">
      <div class="form-control list-item" :key="index">
        {{ item }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    'selectedItems': {
      type: Array,
      required: true
    }
  }
}
</script>

<style>
  .list-item {
    margin-bottom: 10px
  }
</style>
