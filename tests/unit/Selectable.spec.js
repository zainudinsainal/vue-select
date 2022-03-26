import { searchSubmit, selectWithProps } from '../helpers'

describe('Selectable prop', () => {
  it('should select selectable option if clicked', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option === 'one',
    })

    Select.vm.$data.open = true
    await Select.vm.$nextTick()

    Select.find('.vs__dropdown-menu li:first-child').trigger('click')

    await Select.vm.$nextTick()
    expect(Select.vm.selectedValue).toEqual(['one'])
  })

  it('should not select not selectable option if clicked', async () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option === 'one',
    })

    Select.vm.$data.open = true
    await Select.vm.$nextTick()

    Select.find('.vs__dropdown-menu li:last-child').trigger('click')
    await Select.vm.$nextTick()

    expect(Select.vm.selectedValue).toEqual([])
  })

  it('should skip non-selectable option on down arrow keyDown', () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option !== 'two',
    })

    Select.vm.typeAheadPointer = 1

    Select.findComponent({ ref: 'search' }).trigger('keydown.down')

    expect(Select.vm.typeAheadPointer).toEqual(2)
  })

  it('should skip non-selectable option on up arrow keyDown', () => {
    const Select = selectWithProps({
      options: ['one', 'two', 'three'],
      selectable: (option) => option !== 'two',
    })

    Select.vm.typeAheadPointer = 2

    Select.findComponent({ ref: 'search' }).trigger('keydown.up')

    expect(Select.vm.typeAheadPointer).toEqual(0)
  })

  it('should not let the user select an unselectable option with return', async () => {
    const Select = selectWithProps({
      options: ['one', 'two'],
      multiple: true,
      selectable: (option) => option !== 'two',
    })

    // this sets the typeAheadPointer to 0
    await searchSubmit(Select, 'one')
    expect(Select.vm.selectedValue).toEqual(['one'])

    await searchSubmit(Select, 'two')
    expect(Select.vm.selectedValue).toEqual(['one'])
  })
})
