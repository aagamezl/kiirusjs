import { Template, ViewEncapsulation, VirtualDom } from './'

export class Component extends HTMLElement {
  static define (component, target, attributes = {}) {
    const tagName = this.getTagName(component)

    // Check if the custom element is not defined yet
    if (window.customElements.get(tagName) === undefined) {
      window.customElements.define(tagName, component)
    }

    if (target !== undefined) {
      const instance = new component(attributes)

      // target.appendChild(instance)
      if (target.childNodes.length > 0) {
        target.replaceChild(instance, target.childNodes[0])
      } else {
        target.appendChild(instance)
      }

      return instance
    }
  }

  static getTagName (component) {
    return component.name.split(/(?=[A-Z])/g).map((value) => {
      return value.charAt(0).toLowerCase() + value.substring(1)
    }).join('-')
  }

  // can be overridden
  static get viewEncapsulation () {
    return ViewEncapsulation.ShadowDom
  }

  constructor(props) {
    super(props)

    if (this.constructor.viewEncapsulation === ViewEncapsulation.ShadowDom) {
      this.attachShadow({mode: 'open'})
    }

    this.props = props || {}
    this.state = {}

    if (this.attributes.length > 0) {
      // Map attributes to props
      for (let attribute of this.attributes) {
        this.props[attribute.name] = attribute.value
      }
    }

    this._currentElement = null
    this._pendingState = null
    this._parentNode = null
  }

  // will be overridden
  connectedCallback () {
    const timer = `update-time-connectedCallback-${this.constructor.name}`
    console.time(timer)

    const vComponent = VirtualDom.createElement(this.constructor)

    if (this.shadowRoot) {
      VirtualDom.mountVComponentToDOM(vComponent, this.shadowRoot, this)
    } else {
      VirtualDom.mountVComponentToDOM(vComponent, this, this)
    }

    console.timeEnd(timer)
  }

  // will be overridden
  disconnectedCallback () {
  }

  //will be overridden
  render () { }

  setState (partialNewState) {
    // I know this looks weired. Why don't pass state to updateComponent()
    // function, I agree.
    // We're just getting a little familiair with putting data on instances.
    // seomthing that React uses heavily :)
    this._pendingState = { ...this.state, ...partialNewState }

    const timer = `update-time-setState-${this.constructor.name}`
    console.time(timer)

    this.updateComponent()

    console.timeEnd(timer)
  }

  shouldComponentUpdate() {
    return true
  }

  updateComponent() {
    const prevState = this.state
    const prevElement = this._currentElement

    if (this._pendingState !== prevState) {
      this.state = this._pendingState
    }

    this._pendingState = null

    const nextElement = Template.parse(this.render(), this)

    this._currentElement = nextElement

    VirtualDom.update(prevElement, nextElement, this._parentNode, this)
  }
}
