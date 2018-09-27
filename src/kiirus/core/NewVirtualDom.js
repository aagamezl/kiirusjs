import { parseHtml } from './HtmlParser'

const viewEncapsulation = {
  Emulated: 0,
  None: 1,
  ShadowDom: 2,
}

export default class VirtualDom {
  static get viewEncapsulation () {
    return this.encapsulation || viewEncapsulation.ShadowDom
  }

  static set viewEncapsulation (value) {
    this.encapsulation = value

    return value
  }

  static createElement (tag, config, children) {
    // If the tag is a function. We have a component!
    // we will see later why.
    if (typeof tag === 'function') {
      //of course we could do some checks here if the props are
      //valid or not.
      const vNode = VirtualDom.createVComponent(tag, config)

      return vNode
    }

    //Add children on our props object, just as in React. Where
    //we can acces it using this.props.children

    const vNode = VirtualDom.createVElement(tag, config, children)
    return vNode
  }

  static createVComponent (tag, props) {
    return {
      tag: tag,
      props: props,
      dom: null,
    }
  }

  /**
   * 
   * @param {string} tag 
   * @param {object} config 
   * @param {Objet[]} [children = []] 
   */
  static createVElement (tag, config, children = []) {
    const { className, style, ...props } = config

    return {
      tag: tag,
      style: style,
      props: {
        children: children,
        ...props
      },
      className: className,
      dom: null,
    }
  }

  static extractEventName (name) {
    return name.slice(2).toLowerCase()
  }

  static isEventProp (name) {
    return /^on/.test(name)
  }

  static mount (input, parentDOMNode) {
    if (typeof input === 'string' || typeof input === 'number') {
      //we have a vText
      return VirtualDom.mountVText(input, parentDOMNode)
    } else if (typeof input.tag === 'function') {
      //we have a component
      return VirtualDom.mountVComponent(input, parentDOMNode)
    }
    // for brevity make an else if statement. An
    // else would suffice.
    else if (typeof input.tag === 'string') {
      //we have a vElement
      return VirtualDom.mountVElement(input, parentDOMNode)
    }
  }

  static mountVComponent (vComponent, parentDOMNode) {
    const { tag, props } = vComponent

    const Component = tag
    const instance = new Component(props)

    const nextRenderedElement = parseHtml(instance.render())

    //create a reference of our currenElement
    //on our component instance.
    instance._currentElement = nextRenderedElement

    //create a reference to the passed
    //DOMNode. We might need it.
    instance._parentNode = parentDOMNode

    const dom = VirtualDom.mount(nextRenderedElement, instance.shadowRoot)

    //save the instance for later references.
    vComponent._instance = instance
    vComponent.dom = dom

    if (this.viewEncapsulation === viewEncapsulation.ShadowDom) {
      parentDOMNode.appendChild(instance)
    } else {
      parentDOMNode.appendChild(dom)
    }
  }

  static mountVElement (vElement, parentDOMNode) {
    const { className, tag, props, style } = vElement
    const { children, ...otherProps } = props

    const domNode = document.createElement(tag)

    vElement.dom = domNode

    // if (props.children) {
    if (children) {
      // if (!Array.isArray(props.children)) {
      if (!Array.isArray(children)) {
        // this.mount(props.children, domNode)
        VirtualDom.mount(children, domNode)
      } else {
        // props.children.forEach(child => this.mount(child, domNode))
        children.forEach(child => VirtualDom.mount(child, domNode))
      }
    }

    if (otherProps) {
      for (const [name, value] of Object.entries(otherProps)) {
        if (VirtualDom.isEventProp(name)) {
          domNode.addEventListener(
            VirtualDom.extractEventName(name),
            value
          )
        } else if (typeof value === 'boolean') {
          VirtualDom.setBooleanProp(domNode, name, value)
        } else {
          domNode.setAttribute(name, value)
        }
      }
    }

    if (className !== undefined) {
      domNode.className = className
    }

    if (style !== undefined) {
      Object.keys(style).forEach(sKey => domNode.style[sKey] = style[sKey])
    }

    parentDOMNode.appendChild(domNode)

    return domNode
  }

  static mountVText (vText, parentDOMNode) {
    // Oeeh we received a vText with it's associated parentDOMNode.
    // we can set it's textContent to the vText value.
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    parentDOMNode.textContent = vText
  }

  static setBooleanProp (domNode, name, value) {
    if (value) {
      domNode.setAttribute(name, value)
      domNode[name] = true
    } else {
      domNode[name] = false
    }
  }

  static update (prevElement, nextElement) {
    //Implement the first assumption!
    if (prevElement.tag === nextElement.tag) {
      //Inspect the type. If the `tag` is a string
      //we have a `vElement`. (we should actually
      //made some helper functions for this ;))
      if (typeof prevElement.tag === 'string') {
        VirtualDom.updateVElement(prevElement, nextElement)
      } else if (typeof prevElement.tag === 'function') {
        VirtualDom.updateVComponent(prevElement, nextElement)
      }
    } else {
      //Oh oh two elements of different types. We don't want to
      //look further in the tree! We need to replace it!
    }
  }

  static updateChildren (prevChildren, nextChildren, parentDOMNode) {
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren]
    }

    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren]
    }

    for (let i = 0; i < nextChildren.length; i++) {
      //We're skipping a lot of cases here. Like what if
      //the children array have different lenghts? Then we
      //should replace smartly etc. :)
      const nextChild = nextChildren[i]
      const prevChild = prevChildren[i]

      //Check if the vNode is a vText
      if (typeof nextChild === 'string' && typeof prevChild === 'string') {
        //We're taking a shortcut here. It would cleaner to
        //let the `update` static handle it, but we would to add some extra
        //logic because we don't have a `tag` property.
        this.updateVText(prevChild, nextChild, parentDOMNode)

        continue
      } else {
        this.update(prevChild, nextChild)
      }
    }
  }

  static updateVElement (prevElement, nextElement) {
    const dom = prevElement.dom

    nextElement.dom = dom

    if (nextElement.props.children) {
      VirtualDom.updateChildren(prevElement.props.children, nextElement.props.children, dom)
    }

    if (prevElement.style !== nextElement.style) {
      Object.keys(nextElement.style).forEach((s) => dom.style[s] = nextElement.style[s])
    }
  }

  static updateVComponent (prevComponent, nextComponent) {
    //get the instance. This is Component. It also
    //holds the props and _currentElement;
    const { _instance } = prevComponent
    const { _currentElement } = _instance

    //get the new and old props!
    const prevProps = prevComponent.props
    const nextProps = nextComponent.props

    //Time for the big swap!
    nextComponent.dom = prevComponent.dom
    nextComponent._instance = _instance
    nextComponent._instance.props = nextProps

    if (_instance.shouldComponentUpdate()) {
      const prevRenderedElement = _currentElement
      const nextRenderedElement = _instance.render()

      //finaly save the nextRenderedElement for the next iteration!
      nextComponent._instance._currentElement = nextRenderedElement

      //call update
      this.update(prevRenderedElement, nextRenderedElement, _instance._parentNode)
    }
  }

  static updateVText (prevText, nextText, parentDOM) {
    if (prevText !== nextText) {
      parentDOM.firstChild.nodeValue = nextText
    }
  }
}
