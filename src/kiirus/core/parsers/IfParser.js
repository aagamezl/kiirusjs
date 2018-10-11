import { Helper } from './../'

const statementRegex = /\s+data-if=\"\s*.+\s*\"/gm
const expressionRegex = /<(\w+)\s+(data-if=\"(.+)\")>[\s\S]*?<\/\1>/gm

export class IfParser {
  static compile (html) {
    const statements = this.parse(html)

    statements.forEach(ifStatement => {
      const compiled = '${' + ifStatement.conditional + ' ? `' + 
        ifStatement.template + `\` : ''}`

      html = html.replace(ifStatement.template, compiled)
      html = html.replace(statementRegex, '')
    })
    
    return html
  }

  static parse (html) {
    const matches = Helper.matchAll(expressionRegex, html)

    // <div data-if="this.state.show === true">
    //   <span>This is a conditional message</span>
    // </div>

    return matches.map(match => {
      return {
        template: match[0],
        expression: match[2],
        conditional: match[3],
      }
    })
  }
}
