// Start of a tag or comment
const tagOrCommentStartRE = /<\/?(?:[A-Za-z]+\w*)|<!--/

// Whitespace character
const whitespaceCharRE = /[\s\n]/

// All whitespace
const whitespaceRE = /[\s\n]/g

// HTML Escapes
const escapeRE = /(?:(?:&(?:amp|gt|lt|nbsp|quot))|"|\\|\n)/g

const escapeMap = {
  '&amp;': '&',
  '&gt;': '>',
  '&lt;': '<',
  '&nbsp;': ' ',
  '&quot;': '\\"',
  '\\': '\\\\',
  '"': '\\"',
  '\n': '\\n'
}

// Void and SVG Elements
const VOID_ELEMENTS = [
  'area',
  'base',
  'br',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]

const SVG_ELEMENTS = [
  'animate',
  'circle',
  'clippath',
  'cursor',
  'defs',
  'desc',
  'ellipse',
  'filter',
  'font-face',
  'foreignObject',
  'g',
  'glyph',
  'image',
  'line',
  'marker',
  'mask',
  'missing-glyph',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'rect',
  'svg',
  'switch',
  'symbol',
  'text',
  'textpath',
  'tspan',
  'use',
  'view'
]

export default class Compiler {
  static compile (template) {
    return this.parse(this.lexer(template))
  }

  static lexer (template) {
    const length = template.length
    let tokens = []
    let current = 0

    while (current < length) {
      let char = template[current]
      if (char === '<') {
        current++
        if (template.substring(current, current + 3) === "!--") {
          // Comment
          current += 3
          const endOfComment = template.indexOf("-->", current)
          if (endOfComment === -1) {
            current = length
          } else {
            current = endOfComment + 3
          }
        } else {
          // Tag
          const tagToken = {
            type: "Tag",
            value: ''
          }

          let tagType = ''
          const attributes = {}

          let closeStart = false
          let closeEnd = false

          char = template[current]

          // Exit starting closing slash
          if (char === '/') {
            char = template[++current]
            closeStart = true
          }

          // Get tag name
          while ((current < length) && ((char !== '>') && (char !== '/') && (whitespaceCharRE.test(char) === false))) {
            tagType += char
            char = template[++current]
          }

          // Iterate to end of tag
          while ((current < length) && ((char !== '>') && (char !== '/' || template[current + 1] !== '>'))) {
            if (whitespaceCharRE.test(char) === true) {
              // Skip whitespace
              char = template[++current]
            } else {
              // Find attribute name
              let attrName = ''
              let attrValue = ''
              while ((current < length) && ((char !== '=') && (whitespaceCharRE.test(char) === false) && ((char !== '>') && (char !== '/' || template[current + 1] !== '>')))) {
                attrName += char
                char = template[++current]
              }

              // Find attribute value
              if (char === '=') {
                char = template[++current]

                let quoteType = ' '
                if (char === '"' || char === '\'' || char === ' ' || char === '\n') {
                  quoteType = char
                  char = template[++current]
                }

                // Iterate to end of quote type, or end of tag
                while ((current < length) && ((char !== '>') && (char !== '/' || template[current + 1] !== '>'))) {
                  if (char === quoteType) {
                    char = template[++current]
                    break
                  } else {
                    attrValue += char
                    char = template[++current]
                  }
                }
              }

              attrName = attrName.split(':')
              // attributes.push({
              //   name: attrName[0],
              //   value: attrValue,
              //   argument: attrName[1],
              //   data: {}
              // })
              attributes[attrName[0]] = attrValue
            }
          }

          if (char === '/') {
            current += 2
            closeEnd = true
          } else {
            current++
          }

          tagToken.value = tagType
          tagToken.attributes = attributes
          tagToken.closeStart = closeStart
          tagToken.closeEnd = closeEnd
          tokens.push(tagToken)
        }
      } else {
        // Text
        const textTail = template.substring(current)
        const endOfText = textTail.search(tagOrCommentStartRE)
        let text

        if (endOfText === -1) {
          text = textTail
          current = length
        } else {
          text = textTail.substring(0, endOfText)
          current += endOfText
        }

        if (this.trimWhitespace(text).length !== 0) {
          tokens.push({
            type: 'Text',
            value: text/* .replace(escapeRE, function(match) {
              return escapeMap[match]
            }) */
          })
        }
      }
    }

    return tokens
  }

  static parse (tokens) {
    const root = {
      type: 'ROOT',
      props: {},
      children: []
    }
    const elements = [root]
    let lastIndex = 0

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.type === 'Text') {
        // Push text to currently pending element
        elements[lastIndex].children.push(token.value)
      } else if (token.type === 'Tag') {
        // Tag found
        if (token.closeStart === true) {
          // Closing tag found, close current element
          elements.pop()
          lastIndex--
        } else {
          // Opening tag found, create element
          const type = token.value
          const lastChildren = elements[lastIndex].children
          const index = lastChildren.length

          const node = {
            type: type,
            props: token.attributes,
            children: []
          }

          lastChildren[index] = node

          // Add to stack if element is a non void element
          if (token.closeEnd === false && VOID_ELEMENTS.indexOf(type) === -1) {
            elements.push(node)
            lastIndex++
          }
        }
      }
    }

    return root.children[0]
  }

  static trimWhitespace (value) {
    return value.replace(whitespaceRE, '');
  }
}
