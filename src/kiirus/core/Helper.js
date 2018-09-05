export class Helper {
  static matchAll (value, regex) {
    let match
    const result = []

    while ((match = regex.exec(value)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (match.index === regex.lastIndex) {
        regex.lastIndex++
      }

      // The result can be accessed through the `m`-variable.
      result.push(match[1])
    }

    return result
  }
}