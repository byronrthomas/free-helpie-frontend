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
      // the drop-down is always inactive when we load the form, we either
      // don't have any pre-existing data (creating new data or previous was empty)
      // - in which case no pre-baked list items and drop-down is blank (inactive)
      // OR
      // we have some pre-existing data - it all gets rendered as list items, so again
      // drop-down is inactive
      openSlotIsActive: false
    }
  },
  props: {
    'possibleOptions': {
      type: Array,
      required: true
    },
    'value': {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    alreadySelected () {
      return !this.openSlotIsActive
        ? this.value
        : this.value.slice(0, this.value.length - 1)
    },
    newSelection () {
      return this.openSlotIsActive
        ? this.value[this.value.length - 1]
        : ''
    }
    // Possible states of the 'value' bit
  },
  methods: {
    addRow () {
      if (!this.openSlotIsActive) {
        alert('Cannot add another selection if nothing currently selected')
      } else {
        this.openSlotIsActive = false
        this.$emit('input', this.value)
      }
    },
    deleteRow (index) {
      if (this.alreadySelected.length <= index || index < 0) {
        alert('Invalid row to delete')
      } else {
        this.value.splice(index, 1)
        this.$emit('input', this.value)
      }
    },
    newSelectionChanged (newValue) {
      // If open slot was previously empty, we're adding
      // to the array
      if (!this.openSlotIsActive) {
        if (newValue) {
          this.value.push(newValue)
          this.openSlotIsActive = true
        }
      } else {
        // We're changing the existing array values
        const openSlot = this.value.length - 1
        if (newValue) {
          this.value[openSlot] = newValue
        } else {
          this.openSlotIsActive = false
          this.value.splice(openSlot, 1)
        }
      }

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
