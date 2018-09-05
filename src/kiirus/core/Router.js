import { Component, Helper } from './'

let instance = undefined

export class Router {
  /**
   *
   * @param {object} config
   */
  static getInstance() {
    if (instance === undefined) {
      instance = new Router()
    }

    return instance
  }

  constructor() {
    // this.config = Object.assign(this.config || {}, config)
    this.config = {
      routes: []
    }

    this.routerOutlet = document.querySelector('router-outlet')

    if (!this.routerOutlet) {
      throw new Error('Missing Router Outlet')
    }

    // history.replaceState(undefined, undefined, document.location.href)

    // Store the initial content so we can revisit it later
    history.replaceState({
      url: document.location.pathname
    }, document.title, document.location.href);

    // Revert to a previously saved state
    window.addEventListener('popstate', (event) => {
      console.log('popstate fired!')

      this.run(event.state.url)
    })

    // this.run(document.location.pathname)
  }

  /**
   *
   * @param {array} routes
   */
  addRoutes(routes) {
    // '/blog/12'.match(new RegExp('^/blog/:id/show$'.replace(/\//g, '\\/').replace(/:(\w*)/g, '(\\w*)')))
    // ^\/users\/([^\s]+)\/show$
    this.config.routes = [
      ...this.config.routes,
      ...routes.map(route => {
        const params = Helper.matchAll(route.path, /:(\w*)/g)

        route.path = new RegExp(`^${route.path.replace(/\//g, '\\/').replace(/:(\w*)/g, '(\\w*)')}$`)
        route.params = params

        return route
      })
    ]

    return this
  }

  navigate (url, title = '', data = {}) {
    data.url = url

    history.pushState(data, title, document.location.origin + url)

    this.run(url)

    /* const { component, params } = this.verifyRoute(url)

    if (component !== undefined) {
      // const component = new this.config.routes[index].component
      // const routerOutlet = document.querySelector('router-outlet')

      Component.define(component, this.routerOutlet, params)
    } */
  }

  run (url) {
    url = url || document.location.pathname

    const { component, params } = this.verifyRoute(url)

    if (component !== undefined) {
      // const component = new this.config.routes[index].component
      // const routerOutlet = document.querySelector('router-outlet')

      Component.define(component, this.routerOutlet, params)
    }
  }

  verifyRoute (path) {
    for (const route of this.config.routes) {
      let match = path.match(route.path)

      if (match !== null) {
        match = match.slice(1)

        return {
          component: route.component,
          params: match.reduce((obj, value, index) => {
            obj[route.params[index]] = value

            return obj
          }, {}),
        }
      }
    }

    return {}
  }

  // verifyRoute (path) {
  //   return this.config.routes.reduce((oldPath, newPath) => {
  //     // const match = path.match(newPath.path).slice(1)
  //     let match = path.match(newPath.path)

  //     if (match !== null) {
  //       match = match.slice(1)

  //       return {
  //         component: newPath.component,
  //         params: match.reduce((obj, value, index) => {
  //           obj[newPath.params[index]] = value

  //           return obj
  //         }, {}),
  //       }
  //     }

  //     return {}
  //   }, undefined)
  // }
}
