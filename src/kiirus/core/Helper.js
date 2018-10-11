export class Helper {
  /**
   * Perform a global regular expression match. Searches subject for all
   * matches to the regular expression given in pattern and return them.
   *
   * @static
   * @param {object} regex
   * @param {*} value
   * @returns {array}
   *
   * @memberOf Helper
   */
  static matchAll (regex, value) {
    let match = undefined
    const matches = []

    while ((match = regex.exec(value)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (match.index === regex.lastIndex) {
        regex.lastIndex++
      }

      // The result can be accessed through the `m`-variable.
      matches.push(match)
    }

    return matches
  }
}