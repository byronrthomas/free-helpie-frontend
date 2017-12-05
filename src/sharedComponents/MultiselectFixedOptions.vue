<template>
  <div>
    <template v-for="(item, index) in alreadySelected">
      <div class="form-control list-item" :key="index">
        {{ item }}
        <button type="button" class="close" aria-label="Close" :key="index" @click="deleteRow(index)">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </template>
    <select 
      :value="newSelection" 
      @input="newSelectionChanged($event.target.value)" 
      class="form-control list-item">
      <option disabled value=""></option>
      <option v-for="possibleOption in possibleOptions" :key="possibleOption">
        {{ possibleOption }}
      </option>
    </select>
    <button class="btn btn-primary" :disabled="!newSelection" @click="addRow">Add another</button>
  </div>
</template>

<script>
// This is a custom form component, rather than being tightly bound to its context
// use it with a prop of possibleOptions to specify what can be a selected and a v-model
// that contains all of the selected options
export default {
  data () {
    return {
      newSelection: '',
      alreadySelected: []}
  },
  props: ['possibleOptions'],
  computed: {
    value: {
      get () {
        return this.newSelection
          ? Array.concat(this.alreadySelected, [this.newSelection])
          : this.alreadySelected
      },
      set (newValue) {
        this.alreadySelected = newValue
        this.newSelection = ''
      }
    }
  },
  methods: {
    addRow () {
      if (!this.newSelection) {
        alert('Cannot add another selection if nothing currently selected')
      } else {
        this.alreadySelected.push(this.newSelection)
        this.newSelection = ''
        this.$emit('input', this.value)
      }
    },
    deleteRow (index) {
      if (this.alreadySelected.length <= index || index < 0) {
        alert('Invalid row to delete')
      } else {
        this.alreadySelected.splice(index, 1)
        this.$emit('input', this.value)
      }
    },
    newSelectionChanged (newValue) {
      this.newSelection = newValue
      this.$emit('input', this.value)
    }
  }
}
</script>

<style>
  .list-item {
    margin-bottom: 10px
  }
</style>
