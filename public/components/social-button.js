import { Component } from '../../src'

export class SocialButton extends Component {
  render () {
    let html

    switch (this.props.type) {
      case 'fb':
        html = '<img src="https://cdn3.iconfinder.com/data/icons/picons-social/57/46-facebook-48.png" alt="Facebook">'
        break

      case 'plus':
        html = '<img src="https://cdn3.iconfinder.com/data/icons/picons-social/57/80-google-plus-48.png" alt="Google Plus">'
        break

      case 'twitter':
        html = '<img src="https://cdn3.iconfinder.com/data/icons/picons-social/57/03-twitter-48.png" alt="Twitter">'
        break
    }

    return html
  }
}

Component.define(SocialButton)
