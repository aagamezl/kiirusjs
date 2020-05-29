import { Component } from './component'
// import { Router } from './router'
import { router } from './router'
import { getErrorMessage } from './error-messages'

export class RouteConfig extends Component {
  constructor (props) {
    super(props)

    // console.log('RouteConfig')

    // this.router = Router.getInstance()
    this.router = router.getInstance()

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

    // console.log(this.router.config)
  }

  render () {
    return '<slot />'
  }
}

Component.define(RouteConfig)
