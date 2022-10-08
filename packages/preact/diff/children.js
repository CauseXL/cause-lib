import { EMPTY_ARR } from "../constants";
import { createVNode, Fragment } from "../create-element";

export function diffChildren(
	parentDom,
	renderResult,
	newParentVNode,
	oldParentVNode,
	globalContext,
	isSvg,
	excessDomChildren,
	commitQueue,
	oldDom,
	isHydrating
) {
  let i, j, oldVNode, childVNode, newDom, firstChildDom, refs;

  let oldChildren = oldParentVNode?._children || EMPTY_ARR;
  let oldChildrenLength = oldChildren.length;

  newParentVNode._children = [];

  for (i = 0; i < renderResult.length; i++) {
    childVNode = renderResult[i];

    if (childVNode == null || typeof childVNode === 'boolean') {
      childVNode = newParentVNode._children[i] = null;
    }
    // If this newVNode is being reused (e.g. <div>{reuse}{reuse}</div>) in the same diff,
		// or we are rendering a component (e.g. setState) copy the oldVNodes so it can have
		// it's own DOM & etc. pointers 
    else if (
      typeof childVNode == 'string' ||
      typeof childVNode == 'number' ||
      typeof childVNode == 'bigint'
    ) {
      childVNode = newParentVNode._children[i] = createVNode(
        null,
        childVNode,
        null,
        null,
        childVNode,
      );
    } else if (Array.isArray(childVNode)) {
      childVNode = newParentVNode._children[i] = createVNode(
        Fragment,
        {children: childVNode},
        null,
        null,
        null,
      );
    } else if (childVNode._depth > 0) {
      // VNode is already in use, clone it. This can happen in the following
			// scenario:
			//   const reuse = <div />
			//   <div>{reuse}<span />{reuse}</div>
			childVNode = newParentVNode._children[i] = createVNode(
				childVNode.type,
				childVNode.props,
				childVNode.key,
				childVNode.ref ? childVNode.ref : null,
				childVNode._original
			);
    } else {
      childVNode = newParentVNode._children[i] = childVNode;
    }

    // Terser removes the `continue` here and wraps the loop body
		// in a `if (childVNode) { ... } condition
		if (childVNode == null) {
			continue;
		}

    childVNode._parent = newParentVNode;
    childVNode._depth = newParentVNode._depth + 1;

    // Check if we find a corresponding element in oldChildren.
		// If found, delete the array item by setting to `undefined`.
		// We use `undefined`, as `null` is reserved for empty placeholders
		// (holes).
		oldVNode = oldChildren[i];

    if (oldVNode == null ||
      (oldVNode && childVNode.key == oldVNode.key && childVNode.type === oldVNode.type)) {
        oldChildren[i] = undefined;
    } else {
      // TODO: 这啥？ // XiaoLiang
      for (j = 0; j < oldChildrenLength; j++) {
        oldVNode = oldChildren[j];
        // If childVNode is unkeyed, we only match similarly unkeyed nodes, otherwise we match by key.
				// We always match by type (in either case).
				if (
					oldVNode &&
					childVNode.key == oldVNode.key &&
					childVNode.type === oldVNode.type
				) {
					oldChildren[j] = undefined;
					break;
				}
				oldVNode = null;
      }
    }

    oldVNode = oldVNode || EMPTY_OBJ;

    diff();

    newDom = childVNode._dom;

    







  }


}