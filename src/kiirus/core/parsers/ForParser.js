const statementRegex = /\s+data-for=\"(\w+)\s+in\s+(.+)\"/gm
const expressionRegex =  /<(\w+)\s+(data-for=\"(\w+)\s+in\s+(.+))\"\s*>([\s\S]*?)<\/\1>/gm

const expressions = {
    for: {
      statement: /\s+data-for=\"(\w+)\s+in\s+(.+)\"/g,
      expression:  /<(\w+)\s+(data-for=\"(\w+)\s+in\s+(.+))\"\s*>([\s\S]*?)<\/\1>/g,
    },
    if: {
      statement: /\s+data-if=\"\s*.+\s*\"/gm,
      expression: /<(\w+)\s+(data-if=\"(.+)\")>[\s\S]*?<\/\1>/gm,
    },
  }

export class ForParser {
  /**
   * Compile a for expression, generating the JavaScript code necessary to
   * produce the HTML according to the data passed to the for expression
   *
   * @param {string} html The template code
   * @param {string} [params = 'data'] The name for the data expression in the
   * compiled JavaScript code. This name must be the same passed as a parameter
   * to the assemble function
   * @returns {string}
   */
  static compile (html, params = 'data') {
    const forStatement = this.parse(html)

    if (forStatement) {
      // Clean the data-for statement from the template HTML
      // html = html.replace(forRegex, '')
      // html = html.replace(forStatement.expression, '')
      // forStatement.template = forStatement.template.replace(forStatement.expression, '')

      // const compiled = '${' + params + '.' + forStatement.collection +
      const compiled = '${' + forStatement.collection +
        '.map((' + forStatement.iterator + ', index) => ' +
        // '`' + html + '`).join(\'\')}'
        '`' + forStatement.template + '`).join(\'\')}'

      html = html.replace(forStatement.template, compiled)
      html = html.replace(expressions.for.statement, '')
    }

    return html
  }

  /**
   * Parse a for expression, generating an object with the different parts of
   * the expression, to serve as input of the compileFor method.
   *
   * @param {string} html
   * @returns {Object|undefined}
   */
  static parse (html) {
    const match = expressions.for.expression.exec(html)
    // const match = html.match(expressions.for.expression)

    if (match) {
      return {
        template: match[0],
        expression: match[2],
        iterator: match[3],
        collection: match[4],
      }
    }

    return undefined
  }
}
