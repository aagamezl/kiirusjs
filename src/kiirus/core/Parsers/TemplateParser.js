import { htmlParser } from './HtmlParser'
import { VirtualDom } from '../VirtualDom'

export class TemplateParser {
  static parse (template) {
    const previous = []
    let ast = undefined
    let current = undefined

    htmlParser(template, {
      start: (tag, props, unary) => {
        const newElement = VirtualDom.createVElement(tag, this.getProps(props))

        if (unary === false) {
          if (ast === undefined) {
            current = newElement

            ast = current
          } else {
            current.props.children.push(newElement)

            previous.push(current)
            current = newElement
          }
        } else {
          if (!current) {
            current = newElement

            ast = current
          } else {
            current.props.children.push(newElement)
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

    return ast
  }

  static getProps (props) {
    return props.reduce((accumulator, current) => {
      switch (current.name) {
        case 'class':
          current.name = 'className'
          break
        case 'style':
          current.value = this.getStyle(current.value)
          break
      }

      accumulator[current.name] = current.value

      return accumulator
    }, {})
  }

  static getStyle (style) {
    // remove the last semicolon
    return style.replace(/;*$/g, '').split(';').reduce((accumulator, current) => {
      const [key, value] = current.split(':')

      accumulator[key.trim()] = value.trim()

      return accumulator
    }, {})
  }
}
