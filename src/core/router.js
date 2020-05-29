// import app from './app'
import { Component } from './component'

// let instance

export const router = {
  addRoute (route) {
    const params = Array.from(route.path.matchAll(/:(\w*)/g)).map(param => param[1])

    route.path = new RegExp(`^${route.path.replace(/\//g, '\\/').replace(/:(\w*)/g, '(\\w*)')}$`)
    route.params = params

    this.config.routes.push(route)
  },

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

  getInstance () {
    if (router.config === undefined) {
      router.init()
    }

    return router
  },

  getRoutes (path) {
    for (const route of this.config.routes) {
      let match = path.match(route.path)

      if (match !== null) {
        match = match.slice(1)

        return {
          component: route.component,
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
    history.replaceState({
      url: document.location.pathname
    }, document.title, document.location.href)

    // Revert to a previously saved state
    window.addEventListener('popstate', (event) => {
      console.log('popstate fired!')

      this.run(event.state.url)
    })
  },

  navigate (url, title = '', data = {}) {
    data.url = url

    history.pushState(data, title, document.location.origin + url)

    this.run(url)
  },

  register (components) {
    if (Array.isArray(components)) {
      this.components.push(...components)
    } else {
      this.components.push(components)
    }
  },

  async run (url) {
    url = url || document.location.pathname

    const { component, params } = this.getRoutes(url)

    if (component !== undefined) {
      // Component.define(
      //   this.components.find(item => item.name === component),
      //   this.routerOutlet,
      //   params
      // )

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
