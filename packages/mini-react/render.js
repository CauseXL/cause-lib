export const render = (element, container) => {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    /* 
     * 新增 currentRoot 变量，保存根节点更新前的fiber树
     * 添加alternate属性到每一个fiber，关联老的fiber
     * 老fiber是我们上一次提交阶段提交给DOM的fiber
     */
    alternate: currentRoot,
  };
  // 将根节点设置为下一个将要工作单元
  nextUnitOfWork = wipRoot;
  deletions = [];
}

const createDom = (fiber) => {
  const dom = fiber.type == "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(fiber.type);
  
  updateDom(dom, {}, fiber.props)
  return dom;
}

const isGone = (prev, next) => (key) => !(key in next);
const isNew = (prev, next) => (key) => prev[key] !== next[key];

const isEvent = key => key.startsWith("on")
const isProperty = key => key !== "children" && !isEvent(key);

const updateDom = (dom, prevProps, nextProps) => {
  // 移除老的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => dom[name] = '')
  // 设置新的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => dom[name] = nextProps[name])

  // 移除老的事件监听
  Object.keys(prevProps)
    .filter(isEvent)
    // TODO: check this // XiaoLiang
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name])
    })
  // 添加新的事件处理
  Object.keys(nextProps)
  .filter(isEvent)
  .filter(isNew(prevProps, nextProps))
  .forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, nextProps[name])
  })
}

const commitRoot = () => {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot
  wipRoot = null;
}

// TODO: recheck this  // XiaoLiang
// 处理提交的fiber树
const commitWork = (fiber) => {
  if (!fiber) return;

  let domParentFiber = fiber.parent
  //「处理一下没有DOM的fiber」
  // 一直向上找直到找到有dom的节点
  while (!domParentFiber.dom) {
      domParentFiber = domParentFiber.parent
  }

  const domParent = domParentFiber.dom;
  // 将自己点添加到父节点下
  domParent.appendChild(fiber.dom);

  // 新增
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  }
  // 删除
  else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
    commitDeletion(fiber, domParent)
  }
  // 更新
  else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  }

  // 渲染子节点
  commitWork(fiber.child);
  // 渲染兄弟节点
  commitWork(fiber.sibling);
}

/**
 *「处理一下没有DOM的fiber」
 * 删除情况下，不断的向下找，直到找到有dom的子节点
 */
 function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

// 下一个功能单元
let nextUnitOfWork = null
// 根节点
let wipRoot = null
// 更新前的根节点fiber树
let currentRoot = null
// 设置一个数组来存储需要删除的节点
let deletions = null

// 在浏览器的空闲时段内调⽤的函数队列
export const workLoop = (deadline) => {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadline.timeRemaining() < 1;
  }

  // 没有下一个工作单元，提交当前fiber树
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

/* 
 * Fiber节点 作为数据结构
 * React Fiber 机制的实现，是依赖下面这种数据结构（链表）
 * 每一个节点都是一个fiber。
 * 一个 fiber 包括了 child（第一个子节点）、sibling（兄弟节点）、parent（父节点）属性。
**/

// 处理工作单元，返回下一个单元事件
const performUnitOfWork = (fiber) => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 获取到当前fiber的孩子节点
  const elements = fiber.props.children

  // 协调
  reconcileChildren(fiber, elements)

  // 寻找下一个孩子节点，如果有返回
  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber;

  while (nextFiber) {
    // 如果有兄弟节点，返回兄弟节点
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    // 否则返回父节点
    nextFiber = nextFiber.parent;
  }
}

const reconcileChildren = (wipFiber, elements) => {
  // 索引
  let index = 0;
  // 上一个兄弟节点
  let prevSibling = null;

  // 上一次渲染的fiber
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

  // 遍历孩子节点
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    // 创建fiber
    const newFiber = null

    const sameType = oldFiber && element && element.type === oldFiber.type;

    // 类型相同需要更新
    // 类型相同只更新props
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        // TODO: why parent is wipFiber // XiaoLiang
        parent: wipFiber,
        alternate: oldFiber,
        /** 还加入一个effectTag属性来标识当前执行状态 */
        effectTag: 'UPDATE',
      }
    }

    // 新的存在并且类型和老的不同需要新增
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      }
    }

    // 老的存在并且类型和新的不同需要移除
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // 将第一个孩子节点设置为 fiber 的子节点
    if (index === 0) {
      wipFiber.child = newFiber
    } else if(element) {
      // 第一个之外的子节点设置为第一个子节点的兄弟节点
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++;
  }

}
