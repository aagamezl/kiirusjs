const forRegex = /\s+data-for=\"(\w+)\s+in\s+(\w+)\"/gm
const placeholderRegex = /({.+})/gm

export default class Template {
  // constructor (html, data) {
  //   this.data = data
  //   this.html = html
  // }

  static assemble (literal, params = 'data') {
    return new Function(params, 'return `' + literal + '`;')
  }

  static compile (template, data) {
    let html = this.compileFor(this.fixPlaceholders(template))

    return html
  }

  static fixPlaceholders (html) {
    return html.replace(placeholderRegex, '$$$1')
  }

  static compileFor (html) {
    const forStatement = this.parseFor(html)

    if (forStatement) {
      // Clean the data-for statement from the template HTML
      html = html.replace(forRegex, '')
  
      html = '${data.' + forStatement.collection + '.map((' + forStatement.iterator + ', index) => ' +
        '`' + html + '`).join(\'\')}'
    }

    return html
  }

  static parseFor (html) {
    const match = forRegex.exec(html)

    if (match) {
      return {
        iterator: match[1],
        collection: match[2],
      }
    }

    return undefined
  }
}