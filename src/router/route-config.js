import { Component } from './../component'
import { Router } from './router'
import { getErrorMessage } from './../error-messages'

export class RouteConfig extends Component {
  constructor (props) {
    super(props)

    this.router = Router.getInstance()

    const path = this.getAttribute('to')
    const component = this.getAttribute('component')

    if (path === '') {
      throw new Error(getErrorMessage('KJ0001'))
    }

    if (component === '') {
      throw new Error(getErrorMessage('KJ0002'))
    }

    this.router.addRoute({
      path,
      component
    })
  }

  render () {
    return '<slot />'
  }
}

Component.define(RouteConfig)
