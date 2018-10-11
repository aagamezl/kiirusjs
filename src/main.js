import { Component, Router } from './kiirus/core'
import { CustomTab } from './kiirus/components'

import { SimpleTab, SocialButton, TemplateFor } from './examples'

Component.define(CustomTab)
Component.define(SimpleTab)
// Component.register([
//   CustomTab/* ,
//   SimpleTab, */
// ])

console.log('main.js')

const router = Router.getInstance().addRoutes([
  {
    path: '/social-button/:type/:color',
    component: SocialButton,
  }, {
    path: '/simple-tab',
    component: SimpleTab,
  }, {
    path: '/template-for',
    component: TemplateFor,
  }
]).run()