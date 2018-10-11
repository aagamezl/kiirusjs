import { ForParser, IfParser, TemplateParser } from './'

const placeholderRegex = /({.+})/gm

export class Template {
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
    let html = ForParser.compile(this.fixPlaceholders(template))

    html = IfParser.compile(html)

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

  static parse (template, component) {
    const templateAssembled = Template.assemble(
      Template.compile(template)
      ).bind(component)

    return TemplateParser.parse(templateAssembled())
  }
}