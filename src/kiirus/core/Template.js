// const forRegex = /\s+data-for=\"(\w+)\s+in\s+(\w+)\"/gm
// const forRegex = /<(\w+)\s+(data-for=\"(\w+)\s+in\s+(.+))\"\s*>([\s\S]*?)<\/\1>/gm
const expressions = {
  forStatement: /\s+data-for=\"(\w+)\s+in\s+(.+)\"/gm,
  forExpression:  /<(\w+)\s+(data-for=\"(\w+)\s+in\s+(.+))\"\s*>([\s\S]*?)<\/\1>/gm
}
const placeholderRegex = /({.+})/gm

export default class Template {
  /**
   * Generate a function representing the template literal for the complete
   * cpmpiled template code
   *
   * @param {string} literal Template code
   * @param {string} [params = 'data'] Param name for the generated template
   * function
   * @returns {Function}
   */
  static assemble (literal, params = 'data') {
    return new Function(params, 'return `' + literal + '`;')
  }

  /**
   * Compile a template, expanding all the engine expressions
   *
   * @param {string} template
   * @returns {string}
   */
  static compile (template) {
    let html = this.compileFor(this.fixPlaceholders(template))

    return html
  }

  /**
   * Fix the expression placeholders, adding the $ character to complete the
   * template literal
   *
   * @param {string} html
   * @returns {string}
   */
  static fixPlaceholders (html) {
    return html.replace(placeholderRegex, '$$$1')
  }

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
  static compileFor (html, params = 'data') {
    const forStatement = this.parseFor(html)

    if (forStatement) {
      // Clean the data-for statement from the template HTML
      // html = html.replace(forRegex, '')
      // html = html.replace(forStatement.expression, '')
      // forStatement.template = forStatement.template.replace(forStatement.expression, '')

      const compiled = '${' + params + '.' + forStatement.collection +
        '.map((' + forStatement.iterator + ', index) => ' +
        // '`' + html + '`).join(\'\')}'
        '`' + forStatement.template + '`).join(\'\')}'

      html = html.replace(forStatement.template, compiled)
      html = html.replace(expressions.forStatement, '')
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
  static parseFor (html) {
    // const match = forRegex.exec(html)
    const match = expressions.forExpression.exec(html)

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