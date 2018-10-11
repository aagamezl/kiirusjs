import { ViewEncapsulation, Template } from '.'

const eventRegex = /(\w+)\(?(.*)\)?/

export class VirtualDom {
  static createElement (tag, config, children) {
    // If the tag is a function. We have a component!
    // we will see later why.
    if (typeof tag === 'function') {
      //of course we could do some checks here if the props are
      //valid or not.
      const vNode = this.createVComponent(tag, config)

      return vNode
    }

    //Add children on our props object, just as in React. Where
    //we can acces it using this.props.children

    const vNode = this.createVElement(tag, config, children)

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
    return name.slice(5).toLowerCase()
  }

  static isEventProp (name) {
    return /^data-click/.test(name)
  }

  static mount (input, parentDOMNode, instance) {
    if (typeof input === 'string' || typeof input === 'number') {
      //we have a vText
      return this.mountVText(input, parentDOMNode)
    } else if (typeof input.tag === 'function') {
      //we have a component
      return this.mountVComponent(input, parentDOMNode)
    }
    // for brevity make an else if statement. An
    // else would suffice.
    else if (typeof input.tag === 'string') {
      //we have a vElement
      return this.mountVElement(input, parentDOMNode, instance)
    }
  }

  static mountVComponent (vComponent, parentDOMNode) {
    const { tag, props } = vComponent

    const Component = tag
    const instance = new Component(props)

    return VirtualDom.mountVComponentToDOM(vComponent, parentDOMNode, instance)
  }

  static mountVComponentToDOM(vComponent, parentDOMNode, instance) {
    const nextRenderedElement = Template.parse(instance.render(), instance)

    //create a reference of our currenElement
    //on our component instance.
    instance._currentElement = nextRenderedElement

    //create a reference to the passed
    //DOMNode. We might need it.
    instance._parentNode = parentDOMNode

    const dom = this.mount(nextRenderedElement, parentDOMNode, instance)

    //save the instance for later references.
    vComponent._instance = instance

    vComponent.dom = dom

    if (instance.constructor.viewEncapsulation === ViewEncapsulation.Emulated) {
      dom.classList.add('component-emulated')
    }

    return instance
  }

  static mountVElement (vElement, parentDOMNode, instance) {
    const { className, tag, props, style } = vElement
    const { children, ...otherProps } = props

    const domNode = document.createElement(tag)

    vElement.dom = domNode

    if (children) {
      if (!Array.isArray(children)) {
        this.mount(children, domNode, instance)
      } else {
        children.forEach(child => this.mount(child, domNode, instance))
      }
    }

    if (otherProps) {
      for (const [name, value] of Object.entries(otherProps)) {
        if (this.isEventProp(name)) {
          const [event, method, parameters] = value.match(eventRegex)

          domNode.addEventListener(
            this.extractEventName(name),
            instance[method].bind(instance)
          )
        } else if (typeof value === 'boolean') {
          this.setBooleanProp(domNode, name, value)
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

  static update (prevElement, nextElement, parentDOMNode, instance) {
    //Implement the first assumption!
    if (prevElement && prevElement.tag === nextElement.tag) {
      //Inspect the type. If the `tag` is a string
      //we have a `vElement`. (we should actually
      //made some helper functions for this ;))
      if (typeof prevElement.tag === 'string') {
        this.updateVElement(prevElement, nextElement, instance)
      } else if (typeof prevElement.tag === 'function') {
        this.updateVComponent(prevElement, nextElement)
      }
    } else {
      this.mountVElement(nextElement, parentDOMNode, instance)
      //Oh oh two elements of different types. We don't want to
      //look further in the tree! We need to replace it!
    }
  }

  static updateChildren (prevChildren, nextChildren, parentDOMNode, instance) {
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
        //let the `update` function handle it, but we would to add some extra
        //logic because we don't have a `tag` property.
        this.updateVText(prevChild, nextChild, parentDOMNode)

        continue
      } else {
        this.update(prevChild, nextChild, parentDOMNode, instance)
      }
    }
  }

  // static updateComponent () {
  //   const prevState = this.state
  //   const prevRenderedElement = this._currentElement

  //   if (this._pendingState !== prevState) {
  //     this.state = this._pendingState
  //   }

  //   this._pendingState = null

  //   const nextRenderedElement = this.render()

  //   this._currentElement = nextRenderedElement

  //   this.mount(nextRenderedElement, this._parentNode)
  // }

  static updateVElement (prevElement, nextElement, instance) {
    const dom = prevElement.dom

    nextElement.dom = dom

    if (nextElement.props.children) {
      this.updateChildren(prevElement.props.children, nextElement.props.children, dom, instance)
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
