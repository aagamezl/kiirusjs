import { Helper } from './../'

const statementRegex = /\s+data-for=\"(.+)\s+in\s+(.+)\"/gm
const expressionRegex =  /<(\w+)\s+(data-for=\"(.+)\s+in\s+(.+))\"\s*>([\s\S]*?)<\/\1>/gm

export class ForParser {
  /**
   * Compile a for expression, generating the JavaScript code necessary to
   * produce the HTML according to the data passed to the for expression
   *
   * @param {string} html The template code
   * @returns {string}
   */
  static compile (html) {
    const statements = this.parse(html)

    statements.forEach(forStatement => {
      const compiled = '${' + forStatement.collection +
        '.map((' + forStatement.iterator + ', index) => ' +
        '`' + forStatement.template + '`).join(\'\')}'

      html = html.replace(forStatement.template, compiled)
      html = html.replace(statementRegex, '')
    })

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
    const matches = Helper.matchAll(expressionRegex, html)

    return matches.map(match => {
      return {
        template: match[0],
        expression: match[2],
        iterator: match[3],
        collection: match[4],
      }
    })
  }
}
