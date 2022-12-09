// * --------------------------------

export function isDraftable(value: any) {
  if (!value || typeof value !== 'object') return false;
  return true;
}

// * --------------------------------

type Immer = any;
type ImmerScope = any;
type ImmerState = any;

let currentScope: ImmerScope | undefined;

function enterScope(immer: Immer) {
  return (currentScope = createScope(currentScope, immer));
}

function createScope(parent_: any, immer_: any): ImmerScope {
  return {
    drafts_: [],
    parent_,
    immer_,
  }
}

function createProxy(immer: Immer, value: any, parent?: ImmerState) {
  const draft = createProxyProxy(value, parent);

  const scope = parent ? parent.scope_ : getCurrentScope();
  scope.drafts_.push(draft);
  return draft;
}

function createProxyProxy(base: any, parent: ImmerState) {
  const state: ImmerState = {
    scope_: parent ? parent.scope_ : getCurrentScope(),
    modified_: false,
    finalized_: false,
    assigned_: {},
    parent_: parent,
    base_: base,
    copy_: null,
    draft_: null,
    revoke_: null,
    isManual_: false
  }

  let target = state;
  let traps = objectTraps;
  const { revoke, proxy } = Proxy.revocable(target, traps);
  state.draft_ = proxy;
  state.revoke_ = revoke;
  return proxy;
}

// * -------------------------------- proxy handler

// 总是取最新的值，有 copy_ 就不取 base_
// 这样能取到最新修改的值
function latest(state: ImmerState) {
  return state.copy_ || state.base_;
}

// DRAFT_STATE 是一个内置的 Symbol 对象
// 如果 draft 是原始对象，肯定没有 DRAFT_STATE，返回本身的值
// 如果 state 有值，说明 draft 是 proxy，那调用 latest(state)[prop] 取值
// DRAFT_STATE 其实就是在 proxy 的 get 里代理了的，返回它本身，详情见 get 函数第一行
function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop];
}

// 把 `base_` 上的每一个自有属性移动到 `copy_` 上
// 做的浅拷贝，也就是说，在此刻：
// state.copy_ !== state.base_ 
// 但是 state.copy_[someKey] ===  state.base_[someKey]
function prepareCopy(state: {base_: any; copy_: any}) {
  if (!state.copy_) {
    state.copy_ = shallowCopy(state.base_)
  }
}

// * --------------------------------


const get = (state: any, prop: any) => {
  if (prop === DRAFT_STATE) return state;

  const source = latest(state);
  const value = source[prop];

  if (state.finalized_ || !isDraftable(value)) {
    return value;
  }

  // 看看二者是否相等，右边值一定是原始值，相等说明还没有被代理
  if (value === peek(state.base_, prop)) {
    prepareCopy(state);
    return (state.copy_[prop] = createProxy(state.scope_.immer_, value, state));
  }

  return value;
}

const set = (state: any, prop: any, value: any) => {
  // 没有被标记为修改，说明第一次修改
  // 可能需要进行拷贝、标记修改的操作
  if (!state.modified_) {
    const current = peek(latest(state), prop);
    const currentState = current?.[DRAFT_STATE];
    if (currentState && currentState.base_ === value) {
      state.copy_![prop] = value
      state.assigned_[prop] = false
      return true
    }
    prepareCopy(state)
    markChanged(state)
  }

  state.copy_[prop] = value;
  state.assigned_[prop] = true;
  return true;
}

function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_)
    }
  }
}

// * -------------------------------- 

function processResult(result: any, scope: any) {
  const baseDraft = scope.draft_[0];
  const isReplaced = result !== undefined && result !== baseDraft;

  if (isReplaced) {
    if(baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
    }
    if (isDraftable(result)) {
      result = finalize(scope, result);
      if (!scope.parent_) maybeFreeze(scope, )
    }
  } else {
    result = finalize(scope, baseDraft, []);
  }

  revokeScope(scope)
  return result;
}

// state = produce(state, draft => {
//   draft.name = "Michel"
// })

function finalize(rootScope, value) {
  const state = value[DRAFT_STATE]

  // 说明是原始对象，直接遍历它的每一个 child
  if (!state) {
    each(
      value,
      (key, childValue) =>
        // 作用是为每一个属性也调用 finalize
        finalizeProperty(rootScope, state, value, key, childValue),
    )
    return value
  }

  // 没有修改过，直接返回
  if (!state.modified_) {
    return state.base_
  }

   // 是 state 对象格式，并且被修改过了
  if (!state.finalized_) {
    // 先标记为修改完成，这时候再进行 set 就不生效了
    state.finalized_ = true

    // copy_ 的值可能是 proxy 对象，可能是原始对象，可能是原生值
    // 最终要把 copy_ 的值为 proxy 对象的变为原始对象，其他的保持不变。
    const result = state.copy_
    each(
      result,
      (key, childValue) =>
        finalizeProperty(rootScope, state, result, key, childValue, path)
    )
  }
  return state.copy_
}

export function isDraft(value: any): boolean {
  return !!value && !!value[DRAFT_STATE]
}

function finalizeProperty(
  rootScope: ImmerScope,
  parentState: undefined | ImmerState,
  targetObject: any,
  prop: string | number,
  childValue: any,
) {
  // 是不是 Proxy 对象
  if (isDraft(childValue)) {
    // Drafts owned by `scope` are finalized here.
    // 递归的判断内部的逻辑，最终会返回原始对象
    const res = finalize(rootScope, childValue)
    // proxy 对象重写成原始对象
    targetObject[prop] = res
  } else return
}

// * -------------------------------- revoke

export function revokeScope(scope: ImmerScope) {
  leaveScope(scope)
  // 销毁每一个 drafts 里的 proxy 对象
  scope.drafts_.forEach(revokeDraft)
  scope.drafts_ = null
}

export function leaveScope(scope: ImmerScope) {
  if (scope === currentScope) {
    currentScope = scope.parent_
  }
}

function revokeDraft(draft: Drafted) {
  const state: ImmerState = draft[DRAFT_STATE]
  if (
    state.type_ === ProxyType.ProxyObject ||
    state.type_ === ProxyType.ProxyArray
  )
    state.revoke_()
  else state.revoked_ = true
}
