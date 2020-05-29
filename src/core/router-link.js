import { Component } from './component'
// import { Router } from './router'
import { router } from './router'

export class RouterLink extends Component {
  constructor (attributes) {
    super(attributes)

    // this.router = Router.getInstance()
    this.router = router.getInstance()

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
    this.router.navigate(this.props.path, document.title)

    return event.preventDefault()
  }

  render () {
    return `<a href="${this.props.path}"><slot></slot></a>`
  }
}

Component.define(RouterLink)
