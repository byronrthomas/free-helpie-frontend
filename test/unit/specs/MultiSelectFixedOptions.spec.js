import { shallow } from 'vue-test-utils'
import MultiSelectFixedOptions from '@/sharedComponents/MultiselectFixedOptions.vue'

function createComponentGivenOptions (options) {
  return shallow(MultiSelectFixedOptions, {propsData: {possibleOptions: options}})
}

function validInputEventEmittedOnAction (wrapper, action) {
  const oldLength = wrapper.emitted().input ? wrapper.emitted().input.length : 0
  action()
  expect(wrapper.emitted().input).toBeTruthy()
  expect(wrapper.emitted().input.length).toBe(oldLength + 1)
  expect(wrapper.emitted().input[oldLength]).toEqual([wrapper.vm.value])
}

const NON_EMPTY_ARBITRARY_LIST = ['cheese', 'fruit', 'toffee']

describe('MultiSelectFixedOptions.vue', () => {
  it('should start with nothing selected', () => {
    const wrapper = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
    expect(wrapper.vm.value).toEqual([])
  })

  describe('if an initial value is provided', () => {
    let wrapper
    beforeEach(() => {
      wrapper = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
      wrapper.vm.value = [NON_EMPTY_ARBITRARY_LIST[2], NON_EMPTY_ARBITRARY_LIST[0]]
    })

    it('should be possible to add to it', () => {
      wrapper.vm.newSelectionChanged(NON_EMPTY_ARBITRARY_LIST[1])
      expect(wrapper.vm.value).toEqual([NON_EMPTY_ARBITRARY_LIST[2], NON_EMPTY_ARBITRARY_LIST[0], NON_EMPTY_ARBITRARY_LIST[1]])
    })

    it('should not be possible to add to it without selecting a new value', () => {
      wrapper.vm.addRow()
      expect(wrapper.vm.value).toEqual([NON_EMPTY_ARBITRARY_LIST[2], NON_EMPTY_ARBITRARY_LIST[0]])
    })
  })

  it('should put a non-empty new selection into the value', () => {
    const wrapper = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
    wrapper.vm.newSelectionChanged('cheese')
    expect(wrapper.vm.value).toEqual(['cheese'])
  })

  it('should emit an input event when the new selection changes', () => {
    const wrapper = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
    validInputEventEmittedOnAction(wrapper, () => wrapper.vm.newSelectionChanged('cheese'))
  })

  describe('when the new selection is non-empty and you click on add another', () => {
    let wrapper
    const toAdd = 'cheese'

    beforeEach(() => {
      wrapper = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
      wrapper.vm.newSelectionChanged(toAdd)
    })

    it('should be in the value', () => {
      wrapper.vm.addRow()
      expect(wrapper.vm.value).toEqual([toAdd])
    })

    it('should emit an input change event', () => {
      validInputEventEmittedOnAction(wrapper, () => wrapper.vm.addRow())
    })
  })

  it('should be possible to add multiple different selections', () => {
    const wrapper = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
    wrapper.vm.newSelectionChanged(NON_EMPTY_ARBITRARY_LIST[1])
    wrapper.vm.addRow()
    wrapper.vm.newSelectionChanged(NON_EMPTY_ARBITRARY_LIST[0])
    wrapper.vm.addRow()
    expect(wrapper.vm.value).toEqual([NON_EMPTY_ARBITRARY_LIST[1], NON_EMPTY_ARBITRARY_LIST[0]])
  })

  describe('after adding selections', () => {
    let wrapper
    beforeEach(() => {
      wrapper = createComponentGivenOptions(NON_EMPTY_ARBITRARY_LIST)
      wrapper.vm.newSelectionChanged(NON_EMPTY_ARBITRARY_LIST[1])
      wrapper.vm.addRow()
      wrapper.vm.newSelectionChanged(NON_EMPTY_ARBITRARY_LIST[0])
      wrapper.vm.addRow()
    })

    it('should be possible to remove one', () => {
      wrapper.vm.deleteRow(0)
      expect(wrapper.vm.value).toEqual([NON_EMPTY_ARBITRARY_LIST[0]])
    })

    it('should emit input event on selection removal', () => {
      validInputEventEmittedOnAction(wrapper, () => wrapper.vm.deleteRow(0))
    })
  })
})
