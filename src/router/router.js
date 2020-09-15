import { Component } from './../component'

/**
 * A route for the router
 *
 * @typedef {Object} Route
 * @property {string} path - Indicates the path for the route
 * @property {string} component - Indicates the component to render for the route path
 * @property {object} [params] - Indicates the route params
 */

export const Router = {
  /**
   * Add a route to the router
   *
   * @param {Route} route
   * @returns {Router}
   */
  addRoute (route) {
    const params = Array.from(route.path.matchAll(/:(\w*)/g)).map(param => param[1])

    route.path = new RegExp(`^${route.path.replace(/\//g, '\\/').replace(/:(\w*)/g, '(\\w*)')}$`)
    route.params = params

    this.config.routes.push(route)

    return this
  },

  /**
   * Add a set of routes to the router
   *
   * @param {Array<Route>} routes
   * @returns {Router}
   */
  addRoutes (routes) {
    this.config.routes = [
      ...this.config.routes,
      ...routes.map(route => {
        const params = Array.from(route.path.matchAll(/:(\w*)/g)).map(param => param[1])

        route.path = new RegExp(`^${route.path.replace(/\//g, '\\/').replace(/:(\w*)/g, '(\\w*)')}$`)
        route.params = params

        return route
      })
    ]

    return this
  },

  /**
   * Returns a router instance
   *
   * @returns {Router}
   */
  getInstance () {
    if (Router.config === undefined) {
      Router.init()
    }

    return Router
  },

  /**
   * Returns the route that match with the given path
   *
   * @param {string} path
   * @returns {Route}
   */
  getRoute (path) {
    for (const route of this.config.routes) {
      let match = path.match(route.path)

      if (match !== null) {
        match = match.slice(1)

        return {
          component: route.component,
          path,
          params: match.reduce((params, value, index) => {
            params[route.params[index]] = value

            return params
          }, {})
        }
      }
    }

    return {}
  },

  init () {
    this.components = []

    this.config = {
      routes: []
    }

    this.routerOutlet = document.querySelector('router-outlet')

    if (!this.routerOutlet) {
      throw new Error('Missing Router Outlet')
    }

    // Store the initial content so we can revisit it later
    history.replaceState(
      { url: document.location.pathname },
      document.title,
      document.location.href
    )

    // Revert to a previously saved state
    window.addEventListener('popstate', (event) => {
      console.log('popstate fired!')

      this.injectComponent(event.state.url)
    })
  },

  /**
   * Navigate to the given url
   *
   * @param {string} url
   * @param {string} title
   * @param {object} data
   * @returns {void}
   */
  navigate (url, title = '', data = {}) {
    data.url = url

    history.pushState(data, title, document.location.origin + url)

    this.injectComponent(url)

    // const { component, params } = this.getRoute(url)

    // if (component !== undefined) {
    //   const Constructor = window.customElements.get(Component.getTagName({ name: component }))

    //   if (this.routerOutlet !== undefined) {
    //     const instance = new Constructor(params)

    //     if (this.routerOutlet.childNodes.length > 0) {
    //       this.routerOutlet.firstChild.replaceWith(instance)
    //     } else {
    //       this.routerOutlet.appendChild(instance)
    //     }

    //     return instance
    //   }
    // }
  },

  /**
   *
   * @param {string} url
   */
  injectComponent (url) {
    url = url || document.location.pathname

    const { component, params } = this.getRoute(url)

    if (component !== undefined) {
      const Constructor = window.customElements.get(Component.getTagName({ name: component }))

      if (this.routerOutlet !== undefined) {
        const instance = new Constructor(params)

        if (this.routerOutlet.childNodes.length > 0) {
          this.routerOutlet.firstChild.replaceWith(instance)
        } else {
          this.routerOutlet.appendChild(instance)
        }

        return instance
      }
    }
  }
}
