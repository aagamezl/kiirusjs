import KiirusRouter from './kiirus-router'

const app = {
  components: [],
  register: (components) => {
    if (Array.isArray(components)) {
      app.components.push(...components)
    } else {
      app.components.push(components)
    }
  }
}

export default app

// const start = () => {
//   const router = document.querySelector('kiirus-router')

//   if (router) {
//     console.log('define router')
//   }
// }

// export default start
