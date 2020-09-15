/**
* The complete Triforce, or one or more components of the Triforce.
*
* @typedef {Object} Element
* @property {object} tagName - Indicates the element's tag name
* @property {object} attrs - Indicates the element's attributes
* @property {Array<Element>} children - Indicates the element's children
*/

/**
* Options for every element
*
* @typedef {Object} Options
* @property {object} [attrs] - Indicates the element's attributes.
* @property {Array<Element>} [children] - Indicates the element's children
*/

/**
 *
 * @param {string} tagName
 * @param {Options} [options = {}]
 * @returns {Element}
 */
export const createElement = (tagName, { attrs = {}, children = [] } = {}) => {
  return {
    tagName,
    attrs,
    children,
  }
}
