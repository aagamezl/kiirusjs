// import Compiler from './Compiler'
import Compiler from './NewCompiler'
import Template from './Template'
import VirtualDom from './VirtualDom'

export class Component extends HTMLElement {
  static define (component, target, attributes = {}) {
    const tagName = this.getTagName(component)

    if (window.customElements.get(tagName) === undefined) {
      window.customElements.define(tagName, component)
    }

    if (target !== undefined) {
      let instance = new component(attributes)

      target.replaceChild(instance, target.childNodes[0])

      return instance
    }

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

  constructor (attributes) {
    super(attributes)

    this.state = {}

    if (this.attributes.length > 0) {
      // Map attributes to state
      for (let attribute of this.attributes) {
        this.state[attribute.name] = attribute.value
      }
    } else {
      this.state = attributes
    }

    this.virtualDom = new VirtualDom(this)

    // const shadowRoot = this.attachShadow({mode: 'open'})

    // const template = Template.assemble(Template.compile(this.render()))

    // this.virtualDom.updateElement(
    //   shadowRoot,
    //   Compiler.compile(template(this.state))
    // )
  }

  connectedCallback () {
    this.update()
  }

  disconnectedCallback () {
  }

  setState (state) {
    for (let key in state) {
      this.state[key] = state[key]

      // this.setAttribute(key, state[key])
    }

    // this.shadowRoot.innerHTML = this.render()
    this.update()
  }

  update () {
    const timer = `update-time-${this.constructor.name}`
    console.time(timer)

    const shadowRoot = this.attachShadow({mode: 'open'})
    const template = Template.assemble(Template.compile(this.render()))

    this.virtualDom.updateElement(
      shadowRoot,
      Compiler.compile(template(this.state))
    )

    console.timeEnd(timer)
  }

  static getClassReference (className) {
    return eval(className)
    // return new Function(`use strict; return ${className}`)()
  }
}
