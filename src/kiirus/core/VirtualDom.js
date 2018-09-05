export default class VirtualDom {
  constructor (component/* nodes */) {
    // this.nodes = nodes
    this.component = component
  }

  addEventListeners ($target, props) {
    Object.keys(props).forEach(name => {
      if (this.isEventProp(name)) {
        $target.addEventListener(
          this.extractEventName(name),
          this.component[props[name]].bind(this.component)
        )
      }
    })
  }

  changed (newNode, oldNode) {
    return typeof newNode !== typeof oldNode ||
      typeof newNode === 'string' && newNode !== oldNode ||
      newNode.type !== oldNode.type ||
      newNode.props && newNode.props.forceUpdate
  }

  createElement (node) {
    if (typeof node === 'string') {
      return document.createTextNode(node)
    }

    const $el = document.createElement(node.type)

    this.setProps($el, node.props)
    this.addEventListeners($el, node.props)

    node.children
      .map(this.createElement.bind(this))
      .forEach($el.appendChild.bind($el))

    return $el
  }

  extractEventName (name) {
    return name.slice(2).toLowerCase()
  }

  isCustomProp (name) {
    return this.isEventProp(name) || name === 'forceUpdate'
  }

  isEventProp (name) {
    return /^on/.test(name)
  }

  removeBooleanProp ($target, name) {
    $target.removeAttribute(name)
    $target[name] = false
  }

  removeProp ($target, name, value) {
    if (isCustomProp(name)) {
      return
    } else if (name === 'className') {
      $target.removeAttribute('class')
    } else if (typeof value === 'boolean') {
      removeBooleanProp($target, name)
    } else {
      $target.removeAttribute(name)
    }
  }

  setBooleanProp ($target, name, value) {
    if (value) {
      $target.setAttribute(name, value)
      $target[name] = true
    } else {
      $target[name] = false
    }
  }

  setProp ($target, name, value) {
    if (this.isCustomProp(name)) {
      return
    } else if (name === 'className') {
      $target.setAttribute('class', value)
    } else if (typeof value === 'boolean') {
      this.setBooleanProp($target, name, value)
    } else {
      $target.setAttribute(name, value)
    }
  }

  setProps ($target, props) {
    Object.keys(props).forEach(name => {
      this.setProp($target, name, props[name])
    })
  }

  updateElement ($parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
      $parent.appendChild(
        this.createElement(newNode)
      )
    } else if (!newNode) {
      $parent.removeChild(
        $parent.childNodes[index]
      )
    } else if (this.changed(newNode, oldNode)) {
      $parent.replaceChild(
        this.createElement(newNode),
        $parent.childNodes[index]
      )
    } else if (newNode.type) {
      this.updateProps(
        $parent.childNodes[index],
        newNode.props,
        oldNode.props
      )

      const newLength = newNode.children.length
      const oldLength = oldNode.children.length

      for (let i = 0; i < newLength || i < oldLength; i++) {
        this.updateElement(
          $parent.childNodes[index],
          newNode.children[i],
          oldNode.children[i],
          i
        )
      }
    }
  }

  updateProp ($target, name, newVal, oldVal) {
    if (!newVal) {
      removeProp($target, name, oldVal)
    } else if (!oldVal || newVal !== oldVal) {
      setProp($target, name, newVal)
    }
  }

  updateProps ($target, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps)
    Object.keys(props).forEach(name => {
      updateProp($target, name, newProps[name], oldProps[name])
    })
  }
}
