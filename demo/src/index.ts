import './bulma-menu.js'

import { ColorUpdater } from 'bulma-css-vars'

import Picker from 'vanilla-picker'

import { bulmaCssVariablesDefs } from './bulma-generated/bulma-colors'

const pickerContainer: HTMLElement = document.querySelector('#color-picker')
const picker = new Picker({
  parent: pickerContainer,
  popup: 'top',
  onChange: function(color: { rgbaString: string }) {
    const control = this.settings.parent
    const button = control.children[0]
    const colorName = button.getAttribute('data-color')
    const value = color.rgbaString
    control.setAttribute('data-color', value)
    document.documentElement.style.setProperty(`--${colorName}`, value)
    updateThemeColor(colorName, value)
  },
})

pickerContainer.addEventListener('click', function(
  e: Event & {
    target: EventTarget & { nodeName: string; parentNode: HTMLElement }
  }
) {
  if (e.target.nodeName !== 'BUTTON') {
    return
  }
  e.preventDefault()
  const parent = e.target

  picker.movePopup(
    {
      parent: parent.parentNode,
      color: parent.parentNode.getAttribute('data-color'),
    },
    true
  )
})

console.log('colorUpdater')
const colorUpdater = new ColorUpdater(bulmaCssVariablesDefs)

function updateThemeColor(colorName: string, value: string) {
  // const updated = colorUpdater.getUpdatedVars(colorName, value)
  // updated.forEach(({ name, value }) =>
  //   document.documentElement.style.setProperty(name, value)
  // )
  colorUpdater.updateVarsInDocument(colorName, value)
}


