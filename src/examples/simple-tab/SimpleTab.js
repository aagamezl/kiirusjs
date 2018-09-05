import { Component } from './../../kiirus/core'

export class SimpleTab extends Component {

  constructor (attributes) {
    super(attributes)
  }

  render () {
    return `
      <custom-tab role="tab-list" background>
        <button slot="title">Tab 1</button>
        <button slot="title" selected>Tab 2</button>
        <button slot="title">Tab 3</button>

        <section>Content panel 1</section>
        <section>Content panel 2</section>
        <section>Content panel 3</section>
      </custom-tab>
    `
  }
}
