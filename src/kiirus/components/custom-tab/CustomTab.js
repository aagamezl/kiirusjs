import { Component } from './../../core'

// import './SimpleTab.css'

export class CustomTab extends Component {

  constructor (attributes) {
    super(attributes)
  }

  connectedCallback () {
    super.connectedCallback()

    const tabsSlot = this.shadowRoot.querySelector('#tabsSlot')

    const panelsSlot = this.shadowRoot.querySelector('#panelsSlot')

    this.tabs = tabsSlot.assignedNodes({ flatten: true })

    this.panels = panelsSlot
      .assignedNodes({ flatten: true })
      .filter((element) => {
        return element.nodeType === Node.ELEMENT_NODE;
      })

    // Add aria role="tabpanel" to each content panel.
    for (let [index, panel] of this.panels.entries()) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('tabindex', 0);
    }

    this.selectTab(this.findFirstSelectedTab() || 0)
  }

  disconnectedCallback () {
    super.disconnectedCallback()

    const tabsSlot = this.shadowRoot.querySelector('#tabsSlot')

    tabsSlot.removeEventListener('click', this.onTitleClick)

    tabsSlot.removeEventListener('keydown', this.onKeyDown)
  }

  findFirstSelectedTab () {
    let selectedIndex

    for (let [index, tab] of this.tabs.entries()) {
      tab.setAttribute('role', 'tab')

      // Allow users to declaratively select a tab
      // Highlight last tab which has the selected attribute.
      if (tab.hasAttribute('selected')) {
        selectedIndex = index
      }
    }

    return selectedIndex
  }

  onKeyDown(event) {
    event.preventDefault()

    let index

    switch (event.code) {
      case 'ArrowUp':
      case 'ArrowLeft':
        index = this.getAttribute('selected') - 1

        index = index < 0 ? this.tabs.length - 1 : index

        this.tabs[index].click()
        break

      case 'ArrowDown':
      case 'ArrowRight':
        index = this.getAttribute('selected') + 1

        this.tabs[index % this.tabs.length].click()
        break

      default:
        break
    }
  }

  onTitleClick (event) {
    if (event.target.slot === 'title') {
      this.selectTab(this.tabs.indexOf(event.target));

      event.target.focus()
    }
  }

  render () {
    return `
      <div>
        <style>
          :host {
            display: inline-block;
            width: 650px;
            font-family: 'Roboto Slab';
            contain: content;
          }
          :host([background]) {
            background: var(--background-color, #9E9E9E);
            border-radius: 10px;
            padding: 10px;
          }
          :host-context(.darktheme) {
            color: black;
            background: black;
          }
          #panels {
            box-shadow: 0 2px 2px rgba(0, 0, 0, .3);
            background: white;
            border-radius: 3px;
            padding: 16px;
            height: 250px;
            overflow: auto;
          }
          #tabs {
            display: inline-flex;
            -webkit-user-select: none;
            user-select: none;
          }
          #tabs slot {
            display: inline-flex; /* Safari bug. Treats slot as a parent */
          }
          /* Safari does not support #id prefixes on ::slotted
            See https://bugs.webkit.org/show_bug.cgi?id=160538 */
          #tabs ::slotted(*) {
            font: 400 16px/22px 'Roboto';
            padding: 16px 8px;
            margin: 0;
            text-align: center;
            width: 100px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            cursor: pointer;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            background: linear-gradient(#fafafa, #eee);
            border: none; /* if the user users a button */
          }
          #tabs ::slotted([aria-selected="true"]) {
            font-weight: 600;
            background: white;
            box-shadow: none;
          }
          #tabs ::slotted(:focus) {
            z-index: 1; /* make sure focus ring doesn't get buried */
          }
          #panels ::slotted([aria-hidden="true"]) {
            display: none;
          }
        </style>
        <div id="tabs">
          <slot id="tabsSlot" name="title" data-click="onTitleClick" onKeydown="onKeyDown"></slot>
        </div>
        <div id="panels">
          <slot id="panelsSlot"></slot>
        </div>
      </div>
    `
  }

  selectTab (selectedIndex = null) {
    this.setAttribute('selected', selectedIndex);

    for (let index = 0, tab; tab = this.tabs[index]; ++index) {
      const select = index === selectedIndex

      tab.setAttribute('tabindex', select ? 0 : -1);

      tab.setAttribute('aria-selected', select)

      this.panels[index].setAttribute('aria-hidden', !select)
    }
  }
}