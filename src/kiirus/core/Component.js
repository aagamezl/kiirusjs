import Compiler from './Compiler'
import Template from './Template'
import VirtualDom from './VirtualDom'
// import { Compiler, Template, VirtualDom } from './'

export class Component extends HTMLElement {
  static define (component, target, attributes = {}) {
    const tagName = this.getTagName(component)

    if (window.customElements.get(tagName) === undefined) {
      window.customElements.define(tagName, component)
    }

    if (target !== undefined) {
      let instance = new component(attributes)

      // target.appendChild(instance)
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

  // static register () {
  //   const internalTags = ['router-outlet']

  //   document.querySelectorAll(':not(:defined)').forEach(element => {
  //     const tagName = element.tagName.toLowerCase()
  //     const classReference = this.getClassReference(this.getComponentName(tagName))
      
  //     console.log(classReference)
  //   })
  // }

  static register (components) {
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

    const shadowRoot = this.attachShadow({mode: 'open'})

    // const template = Template.assemble(Template.compile(this.render(), this.state))
    const template = Template.assemble(Template.compile(this.render()))

    // this.virtualDom.updateElement(shadowRoot, Compiler.compile(this.render()))
    this.virtualDom.updateElement(shadowRoot, Compiler.compile(template(this.state)))
  }

  connectedCallback () {
  }

  disconnectedCallback () {
  }

  static getClassReference (className) {
    return eval(className)
    // return new Function(`use strict; return ${className}`)()
  }
}
