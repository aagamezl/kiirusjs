const statementRegex = /\s+data-if=\"\s*.+\s*\"/gmi
const expressionRegex = /<(\w+)\s+(data-if=\"(.+)\")>[\s\S]*?<\/\1>/gmi

export class IfParser {
  static compile (html) {
    const ifStatement = this.parse(html)

    if (ifStatement) {
      const compiled = '${' + ifStatement.conditional + ' ? `' + 
        ifStatement.template + `\` : ''}`

      html = html.replace(ifStatement.template, compiled)
      html = html.replace(statementRegex, '')
    }
    
    return html
  }

  static parse (html) {
    const match = expressionRegex.exec(html)

    // <div data-if="this.state.show === true">
    //   <span>This is a conditional message</span>
    // </div>

    if (match) {
      return {
        template: match[0],
        expression: match[2],
        conditional: match[3],
      }
    }

    return undefined
  }
}
