import { Component, Router } from './'

export class RouterLink extends Component {
  constructor (attributes) {
    super(attributes)

    this.router = Router.getInstance()

    this.handleClick = this.handleClick.bind(this)
  }

  connectedCallback () {
    super.connectedCallback()

    this.shadowRoot.querySelector('a').addEventListener('click', this.handleClick, true)
  }

  disconnectedCallback () {
    super.disconnectedCallback()

    this.shadowRoot.querySelector('a').removeEventListener('click', this.handleClick)
  }

  handleClick (event) {
    console.log(event)

    // this.router.navigate(this.state.to/* , event.target.textContent */)
    // this.router.navigate(this.state.to, this.textContent)
    this.router.navigate(this.state.path, document.title)

    return event.preventDefault()
  }

  render () {
    return `<a href="${this.state.path}"><slot></slot></a>`
  }
}

Component.define(RouterLink)
