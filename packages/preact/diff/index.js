import { Component } from "../component";

export function diff(
  parentDom,
  newVNode,
  oldVNode,
  globalContext,
  isSvg,
  excessDomChildren,
  commitQueue,
  oldDom,
  isHydrating
) {
  let tmp,
    newType = newVNode.type;

  try {
    outer: if (typeof newType == 'function') {
      let c, clearProcessingException;

      let newProps = newVNode.props;
      tmp = newType.contextType;
      // TODO: check provider globalContext
      let provider = tmp && globalContext[tmp._id];
      let componentContext = tmp
              ? provider
                // TODO: check globalContext.props.value
                ? provider.props.value
                : tmp._defaultValue
              : globalContext;

      if (oldVNode._component) {
        c = newVNode._component = oldVNode._component;
        // TODO: check _pendingError
        clearProcessingException = c._processingException = c._pendingError;
      } else {
        // TODO: check newType property
        if ('property' in newType && newType.property.render) {
          newVNode._component = c = new newType(newProps, componentContext)
        } else {
          newVNode._component = c = new Component(newProps, componentContext);
          // TODO: check constructor
          c.constructor = newType;
          c.render = doRender;
        }
        if (provider) provider.sub(c);
      }

      c.props = newProps;
      if (!c.state) c.state = {};
      c.context = componentContext;
      c._globalContext = globalContext;
      // TODO: check _dirty, _renderCallbacks
      isNew = c._dirty = true;
      c._renderCallbacks = [];
    }

    // * --------------- end of typeof newType == 'function'

    if (c._nextState == null) {
      c._nextState = c.state;
    }

    if (newType.getDerivedStateFromProps !== null) {
      if (c._nextState == c.state) {
        c._nextState = assign({}, c._nextState);
      }

      assign(c._nextState, newType.getDerivedStateFromProps(newPros, c._nextState))
    }

    oldProps = c.props;
    oldState = c.state;

    if (isNew) {
      if (newType.getDerivedStateFromProps == null && c.componentWillMount != null) {
        c.componentWillMount();
      }
      if (c.componentDidMount != null) {
        c._renderCallbacks.push(c.componentDidMount);
      }
    } else {
      if (newType.getDerivedStateFromProps == null &&
        newProps !== oldProps &&
        c.componentWillReceiveProps != null) {
        c.componentWillReceiveProps(newProps, componentContext);
      }

      if (c.componentWillUpdate != null) {
        c.componentWillUpdate(newProps, c._nextState, componentContext);
      }

      if (c.componentDidUpdate != null) {
        c._renderCallbacks.push(() => {
          c.componentDidUpdate(oldProps, oldState, snapshot);
        });
      }
    }

    c.context = componentContext;
    c.props = newProps;
    c._vnode = newVNode;
    c._parentDom = parentDom;





  } catch(e) {

  }
}
