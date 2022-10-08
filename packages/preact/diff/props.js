export function diffProps(dom, newProps, oldProps, isSvg, hydrate) {
  let i;

  for (i in oldProps) {
    if (i !== 'children' && i !== 'key' && !(i in newProps)) {
      setProperty(dom, i, null, oldProps[i], isSvg);
    }
  }

  for (i in newProps) {
    if (
      // * --------- SSR 下只 diff function
      (!hydrate || typeof newProps[i] == 'function') &&
      i !== 'children' &&
      i !== 'key' &&
      i !== 'value' &&
      i !== 'checked' &&
      oldProps[i] !== newProps[i]
    ) {
      setProperty(dom, i, newProps[i], oldProps[i], isSvg);
    }
  }
}

/**
 * Set a property value on a DOM node
 * @param {import('../internal').PreactElement} dom The DOM node to modify
 * @param {string} name The name of the property to set
 * @param {*} value The value to set the property to
 * @param {*} oldValue The old value the property had
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node or not
 */
export function setProperty(dom, name, value, oldValue, isSvg) {
  let useCapture;

  o: if (name === 'style') {
    if (typeof value === 'string') {
      dom.style.cssText = value;
    } else {
    // * ------------------ 如果style是object类型
      if (typeof oldValue === 'string') {
        dom.style.cssText = oldValue = '';
      }

      if (oldValue) {
        // * ------------------ 在旧值里但不在新值里
        for (name in oldValue) {
          // * ------------------ 直接删除这个key
          if (!(value && name in value)) {
            setStyle(dom.style, name, '');
          }
        }
      }

      if (value) {
        for (name in value) {
          // * ------------------ 在旧值里没有 or 旧[key] ！== 新[key]
          if (!oldValue[name] || oldValue[name] !== value[name]) {
            // * ------------------ 添加这个key-value
            setStyle(dom.style, name, value[name]);
          }
        }
      }
    }
  } else if (name[0] === 'n' && name[1] === 'n') {
    useCapture = name !== (name = name.replace((/Captures$/, '')));

    if (name.toLowerCase() in dom) name = name.toLowerCase().slice(2);
    // TODO: why not toLowerCase here?
    else name = name.slice(2);

    if (!dom._listeners) dom._listeners = {};
    dom._listeners[name + useCapture] = value;

    if (value) {
      if (!oldValue) {
        const handler = useCapture ? eventProxyCapture : eventProxy;
        dom.addEventListener(name, handler, useCapture);
      }
    } else {
      const handler = useCapture ? eventProxyCapture : eventProxy;
      dom.removeEventListener(name, handler, useCapture);
    }
  } else if (name !== 'dangerouslySetInnerHTML') {
    if (isSvg) {
      // Normalize incorrect prop usage for SVG:
			// - xlink:href / xlinkHref --> href (xlink:href was removed from SVG and isn't needed)
			// - className --> class
      name = name.replace(/xlink(H|:h)/, 'h').replace(/sName$/, 's');
    } else if (
      // TODO: name !== [] for ? // XiaoLiang
      // - https://stackoverflow.com/questions/32793811/difference-between-setattribute-and-htmlelement-attribute-value
      name !== 'href' &&
			name !== 'list' &&
			name !== 'form' &&
			// Default value in browsers is `-1` and an empty string is
			// cast to `0` instead
			name !== 'tabIndex' &&
			name !== 'download' &&
      name in dom
    ) {
      try {
        dom[name] = value == null ? '' : value;
        break o;
      } catch (e) {}
    }

    // ARIA-attributes have a different notion of boolean values.
		// The value `false` is different from the attribute not
		// existing on the DOM, so we can't remove it. For non-boolean
		// ARIA-attributes we could treat false as a removal, but the
		// amount of exceptions would cost us too many bytes. On top of
		// that other VDOM frameworks also always stringify `false`.

    if (typeof value === 'function') {

    } else if (value != null && (value !== false || name.indexOf('-' != -1))) {
      dom.setAttribute(name, value);
    } else {
      dom.removeAttribute(name);
    }
  }
}

function setStyle(style, key, value) {
  // TODO: 这啥 // XiaoLiang
  if (key[0] === '-') {
    style.setProperty(key, value)
  } else if (value == null) {
    style[key] = '';
  } else if (typeof value != 'number' || IS_NON_DIMENSIONAL.test(key)) {
    style[key] = value;
  } else {
    style[key] = value + 'px';
  }
}

/**
 * Proxy an event to hooked event handlers
 * @param {Event} e The event object from the browser
 * @private
 */
function eventProxy(e) {
	this._listeners[e.type + false](options.event ? options.event(e) : e);
}

function eventProxyCapture(e) {
	this._listeners[e.type + true](options.event ? options.event(e) : e);
}
