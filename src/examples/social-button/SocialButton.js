import { Component } from './../../kiirus/core'

export class SocialButton extends Component {

  constructor (attributes) {
    super(attributes)
  }

  render () {
    let html

    switch (this.state.type) {
      case 'fb':
        html = `<img src="https://cdn3.iconfinder.com/data/icons/picons-social/57/46-facebook-48.png">`
        break

      case 'plus':
        html = `<img src="https://cdn3.iconfinder.com/data/icons/picons-social/57/80-google-plus-48.png">`
        break

      case 'twitter':
        html = `<img src="https://cdn3.iconfinder.com/data/icons/picons-social/57/03-twitter-48.png">`
        break
    }

    return html
  }
}

// Component.define(SocialButton)
