import Vue from 'vue'
import MultiSelectFixedOptions from '@/sharedComponents/MultiselectFixedOptions.vue'

function createComponentGivenOptions(options) {
  const Ctor = Vue.extend(MultiSelectFixedOptions)
  return new Ctor({possibleOptions: options}).$mount()
}

function validInputEventEmittedOnAction(vm, action) {
  let emitted = false;
  vm.$on('input', (newValue => {emitted = true; expect(newValue).toEqual(vm.value)}))
  action();
  expect(emitted).toBeTruthy()
}

const NON_EMPTY_ARBITRARY_LIST = ['cheese', 'fruit', 'toffee']

describe('MultiSelectFixedOptions.vue', () => {
  it('should start with nothing selected', () => {
    const vm = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
    expect(vm.value).toEqual([])
  })

  it('should put a non-empty new selection into the value', () => {
    const vm = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
    vm.newSelectionChanged('cheese')
    expect(vm.value).toEqual(['cheese'])
  })

  it('should emit an input event when the new selection changes', () => {
    const vm = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
    validInputEventEmittedOnAction(vm, () => vm.newSelectionChanged('cheese'))
  })

  describe('when the new selection is non-empty',() => {
    let vm;
    const toAdd = 'cheese'

    beforeEach(() => {
      vm = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
      vm.newSelectionChanged(toAdd)
    })
    
    describe('and you click on add another', () => {
      it('should be in the value', () => {
        vm.addRow()
        expect(vm.value).toEqual([toAdd])
      })

      it('should emit an input change event', () => {
        validInputEventEmittedOnAction(vm, () => vm.addRow())
      })
    })
  })

  it('should be possible to add multiple different selections', () => {
    const vm = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
    vm.newSelectionChanged(NON_EMPTY_ARBITRARY_LIST[1])
    vm.addRow()
    vm.newSelectionChanged(NON_EMPTY_ARBITRARY_LIST[0])
    vm.addRow()
    expect(vm.value).toEqual([NON_EMPTY_ARBITRARY_LIST[1], NON_EMPTY_ARBITRARY_LIST[0]])
  })

  describe('after adding selections', () => {
    let vm
    beforeEach(() => {
      vm = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
      vm.newSelectionChanged(NON_EMPTY_ARBITRARY_LIST[1])
      vm.addRow()
      vm.newSelectionChanged(NON_EMPTY_ARBITRARY_LIST[0])
      vm.addRow()
    })

    it('should be possible to remove one', () => {
      vm.deleteRow(0)
      expect(vm.value).toEqual([NON_EMPTY_ARBITRARY_LIST[0]])
    })

    it('should emit input event on selection removal', () => {
      validInputEventEmittedOnAction(vm, () => vm.deleteRow(0))
    })
  })
})
