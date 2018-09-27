// import Compiler from './Compiler'
import Compiler from './NewCompiler'
import VirtualDom from './NewVirtualDom'
import { parseHtml } from './HtmlParser'
import Template from './Template'

export class Component extends HTMLElement {
  static define (component, target, attributes = {}) {
    const tagName = this.getTagName(component)

    // Check if the custom element is not defined yet
    if (window.customElements.get(tagName) === undefined) {
      window.customElements.define(tagName, component)
    }

    // if (target !== undefined) {
    //   let instance = new component(attributes)

    //   target.replaceChild(instance, target.childNodes[0])

    //   return instance
    // }

    VirtualDom.mount(VirtualDom.createElement(component), target)

    return document.querySelector(tagName)
  }

  static getComponentName (tagName) {
    return tagName[0].toUpperCase() +
      tagName.replace(/(\-\w)/g, (match) => match[1].toUpperCase()).slice(1)
  }

  static getTagName (component) {
    return component.name.split(/(?=[A-Z])/g).map((value) => {
      return value.charAt(0).toLowerCase() + value.substring(1)
    }).join('-')
  }

  /**
   *
   * @param {Array} components
   */
  static register (components = []) {
    components.forEach(component => {
      this.define(component)
    })
  }

  constructor (props) {
    super(props)

    this.props = props || {}
    this.state = {}

    this._currentElement = null
    this._pendingState = null
    this._parentNode = null

    this.attachShadow({mode: 'open'})

    // this.updateComponent()
  }

  // will be overridden
  connectedCallback () {
  }

  // will be overridden
  disconnectedCallback () {
  }

  // will be overridden
  render() { }

  setState(partialNewState) {
    // I know this looks weired. Why don't pass state to updateComponent()
    // function, I agree.
    // We're just getting a little familiair with putting data on instances.
    // seomthing that React uses heavily :)
    this._pendingState = { ...this.state, ...partialNewState }

    this.updateComponent()
  }

  setTemplate () {
    if (this.template === undefined) {
      this.template = Template.assemble(Template.compile(this.render()))

      this.template.bind(this)
    }
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

    const nextElement = parseHtml(this.render())

    this._currentElement = nextElement

    VirtualDom.update(prevElement, nextElement, this._parentNode)
  }
}
