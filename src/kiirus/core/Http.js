/**
 * This class help to make asyncronous requests to a remote server
 * 
 * @class Http
 */
export class Http {
  /**
   * Make a GET request to a URL
   * 
   * @static
   * @param {string} url
   * @param {object} options
   * @returns {Promise}
   * 
   * @memberOf Http
   */
  static get (url, options) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()

      for (let option in options) {
        request[option] = options[option]
      }

      request.addEventListener('error', (event) => {
        reject({
          status: this.status,
          statusText: request.statusText
        })
      })

      request.addEventListener('load', (event) => {
        if (request.status >= 200 && request.status < 300) {
          resolve(request.response)
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      })

      request.open('GET', url)

      request.send()
    })
  }
}
