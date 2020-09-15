import { createElement, mount, render, HTMLParser } from './virtual-dom'

export class Component extends HTMLElement {
  constructor (props) {
    super(props)

    console.log('component: %o', this.localName)

    this.props = props || {}

    if (this.attributes.length > 0) {
      // Map attributes to props
      for (const attribute of this.attributes) {
        this.props[attribute.name] = attribute.value
      }
    }

    this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    const previous = []
    let ast = undefined
    let current = undefined

    HTMLParser(this.render(), {
      start: (tag, props, unary) => {
        const attrs = props.reduce((attrs, props) => {
          attrs[props.name] = props.value

          return attrs
        }, [])

        const newElement = createElement(tag, { attrs })

        if (unary === false) {
          if (ast === undefined) {
            current = newElement

            ast = current
          } else {
            current.children.push(newElement)

            previous.push(current)
            current = newElement
          }
        } else {
          if (!current) {
            current = newElement

            ast = current
          } else {
            current.children.push(newElement)
          }
        }
      },
      end: (tag) => {
        current = previous.pop()
      },
      chars: (text) => {
        if (text.trim()) {
          current.props.children.push(text)
        }
      },
      comment: (text) => {
      }
    })

    // this.shadowRoot.innerHTML = this.render()
    mount(render(ast), this.shadowRoot)
  }

  // will be overridden
  disconnectedCallback () {
  }

  static define (Component, target, attributes = {}) {
    const tagName = this.getTagName(Component)

    // Check if the custom element is not defined yet
    if (window.customElements.get(tagName) === undefined) {
      window.customElements.define(tagName, Component)
    }

    if (target !== undefined) {
      const instance = new Component(attributes)

      // target.appendChild(instance)
      if (target.childNodes.length > 0) {
        // target.replaceChild(instance, target.childNodes[0])
        target.firstChild.replaceWith(instance)
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

  // will be overridden
  render () { }
}
