import { Component } from './component'

export class KiirusRouter extends Component {
  constructor (props) {
    super(props)

    // console.log('KiirusRouter')

    const items = Array.from(this.querySelectorAll('route-config'))

    console.log(items)
  }

  render () {
    return '<slot />'
  }
}

Component.define(KiirusRouter)
