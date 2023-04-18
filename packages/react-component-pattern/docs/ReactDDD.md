# React架构 -- 领域驱动设计 && React Hooks 实践

## What is DDD

- 领域驱动，各自只管各自的模块
- 顶层再来进行组装和分配

### How

- 坚持根据特性区命名目录
- 坚持为每个特性区创建一个NgModule
- 能提供限界上下文，将某些功能牢牢地锁在一个地方，开发某个功能时，只需要关心这个模块就够了。

#### 视图的归试图，逻辑的归逻辑

``` js
function SomeComp() {
  /** 所有的逻辑 */
  const someService = useService();
  /** 视图 */
  return <div>{someService.state}</div>
}
```

#### 跨组件数据传递

``` js
function useGlobalService() {
  return { state: "" };
}

const GlobalService = createContext(null);

function SomeComp() {
  return (
    <GlobalService.Provider value={useGlobalService()}></GlobalService.Provider>
  )
}

function useSomeService() {
  /** 所有的逻辑 */
  const globalService = useContext(GlobalService);
  /** 视图 */
  return <div>{globalService.state}</div>
}
```

#### 函数 DDD

``` js
/** 以前类方法 */
class SomeClass {
  name:string,
  password:string,
  constructor(name,password){
    this.name = name
    this.password = password
  }
}

/** 函数式 */
const initValue = { name: "", password: "" };
function useClass() {
  const [state, setState] = useState(initValue);
  return { state, setState };
}
```

- 函数式自带响应式，getter，setter 也自动给出了，同时使用了工厂模式，不需要了解函数内部的逻辑。

## React Hooks 版本架构

### LIFT 原则

- 快速定位 ```Locate```
- 一眼识别 ```Identify```
- 尽量保持扁平结构 ```Flattest```
- 尝试 ```Try``` 遵循 ```DRY (Do Not Repeat Yourself```, 不重复自己)

- 一个文件夹包含该领域内所有逻辑（视图，样式，测试，状态，接口），禁止将逻辑放置于文件夹以外
- 隔离、测试和复用特性更容易
- 只需要对 useXxx 进行测试，测试复杂度，工作量都很小，视图测试交给 e2e

### 利用 SOA 实现跨组件逻辑复用

- 面向服务架构（SOA）是一个组件模型，它将应用程序的不同功能单元（称为服务）进行拆分，并通过这些服务之间定义良好的接口和协议联系起来。
- 利用 ```注入令牌``` + ```服务函数``` + ```注入点```。 实现灵活的SOA

``` js
/**
 * XxxService 为注入令牌 和 文件名
 * useXxxService 为服务函数
 */
const XxxService = useToken(useXxxService);

/** XxxService.Provider 为注入点 */
<XxxService.Provider value={useXxxService()} />
```

- 大写并与文件同名的组件，且其中除了注入服务操作外，return 之前，无任何代码
- use 开头，Service 结尾，并与文件夹同名的可注入服务
- 服务中只存在 基础 hooks，自定义 hooks，第三方 hooks，静态数据，工具函数，工具类

#### why?

- 符合单一数据，单一职责，接口隔离原则
- 层次化注入，可以实现 DDD，将逻辑全部约束于一处，方便团队协作
- 配合组件和功能划分，可以方便处理嵌套结构，防止对象复制被滥用，类似深复制之类的操作应该禁止
- 所有 use 开头的文件，都是服务
  - 其中，useXxxService 是可注入服务，默认将所有组件配套的服务设置为可注入服务，可以方便进行依赖管理

#### 建议的技术栈搭配

- ```create-react-app``` + ```react-router-dom``` + ```antd``` + ```ahooks``` + ```styled-components``` (大多数场景下，强烈推荐！可以上 ProComponent，但是要注意提取功能逻辑，不可将逻辑写于组件)

### Hook 使你在无需修改组件结构的情况下复用状态逻辑

- 因为 state 是不反应业务逻辑的，它也天然不可以对业务逻辑进行组合

``` js
function useSomeTable() {
  // 这个是个表单，抽象的
  const [form] = Form.useForm();
  // 这个是个表单联动的表格
  const { tableProps, loading } = useAntdTable(...)
  return {
    form,
    loading,
    tableProps,
  };
}

<Form form={SomeTable.form}><!-- 里面全部状态无关，不用看了--></Form>
<Table {...tableProps} columns={} rowKey="id"/>
```

这个组件，存粹只有注入和视图，一丁点的逻辑都没有。
组件里没有逻辑，相关的逻辑再 useFunc 中就能随意组合，结构什么都你来定，结构如果优秀，任何逻辑都是 use 个函数的问题，你不会出现需要写第二遍逻辑的情况，
这便是 —— 逻辑视图分离👍

## React SOA

### 基本的服务

``` js
function useSimpleService() {
  const [val1, setVal1] = useState(0);
  const [val2, setVal2] = useState(0);

  useEffect(() => {
    setVal2(val1);
  }, [val1]);

  return {
    val1,
    setVal1,
    val2,
  }
}
```

- 叫它service，是SOA模型下的叫法，意思是： 我们只会在这样的结构中写逻辑，组建中的逻辑全部消失
- 只暴露你需要暴露的状态逻辑（setVal1）
- useRef，同样也可以封装在 Service 中，而且建议如此做，ref 的获取不是视图，是逻辑

### 组合服务

``` js
/** 另一个服务 */
function useAnotherService() {
  const [val, setVal] = useLocalStorage(0);
  return { vale, setVal };
}

/** 与基本服务进行组合 */
function useSimpleService() {
  const [val1, setVal1] = useState(0);
  const [val2, setVal2] = useState(0);
  const { setVal } = userAnotherService();

  useEffect(() => {
    setVal2(val1);
  }, [val1]);

  /** 为基本服务动态添加功能 */
  useEffect(() => {
    setVal(val2);
  }, [val2]);

  return {
    val1,
    setVal1,
    val2,
  }
}
```

- 为什么不直接import？
  - 因为需要框架内的响应式能力，这个叫```控制反转(IOC)```，框架将响应式的控制权转交给了开发者
- 如果有另外一个服务，单单只要```AnotherService```的功能，你只需要调用```useAnotherService```就好了
- ```useEffect```是一种管道模型，如同```rxjs```一般，只是框架帮你按顺序组装而已（你以为为啥非要你按顺序来写hooks），是极限的函数式方案，不存在纯度问题。
- 使用了```useAnotherService```的细节被隐藏，形成了一个树形调用结构，这种结构被称作 “依赖树” 或者 “注入树”

### 注入单例服务

- 当前服务如果需要被多个组件使用，服务会被初始化很多次，如何让它只注入一次？
- 利用 createContext

``` js
<SimpleService.Provider value={useSimpleService()}>
  {props.children}
</SimpleService.Provider>

function SomeComponent(){
  const {val1,setVal1} = useContext(SomeService)
  return <div onClick={()=>{setVal1('fuck')}>val1</div>
}
```

- 但是，单例需要注入到唯一节点，因此，你需要在所有需要用到这个服务的组件的最顶层
- 这样，这个服务的单例就对所有子孙组件敞开了怀抱，同时，所有子孙组件对其的修改都将生效

- 直接在 jsx 的 provider 中```value = {useSomeService ()}```在本组件没有任何其它响应式变量的情况下是可行的，因为不会重新初始化.
- 这个有共同单例 Service 的一系列组件，被称为模块，它们有自己的 “限界上下文”，并且，视图，逻辑，样式都在其中，如果这个模块是按照功能划分的，那么这种 SOA 实现被称为 领域驱动设计 (DDD) ，某些架构强推的所谓’微前端’，目的就是得到这个东西

### 单例服务，解决深层嵌套对象问题

深层嵌套对象怎么处理？useReducer？immutable? 还是直接深复制？

首先明白你要实现什么逻辑，深层嵌套对象之所以难处理，是因为你想在子组件实现**对深层目标的部分变更逻辑**

之前你之所以有这些奇奇怪怪工具甚至深复制的需求，是因为你没有办法将逻辑也拆分给子组件

``` js
function useSomeService() {
  const [value, setValue] = useState({
    username: "",
    password: "",
    info: {
      nickname: "",
      others: [],
    },
  });
  return { value, setValue };
}
/** 注入部分省略... */

/** 分形部分 */
new Array(5).map((_, key) => <SomeCompo index={key} key={key} />);

/** 组件 */
function SomeComponent(props) {
  const { setValue } = useContext(SomeService);
  return (
    <div
      onClick={() => {
        setValue((res) => {
          res.info.others[props.index] = "fuck";
          return res;
        });
      }}
    ></div>
  );
}

/** 如果需要划分模块，通过 getter，setter 传递这个嵌套结构 */
function subInjectedService(props) {
  const { value, setValue } = useContext(useSomeService);
  const info = useMemo(() => value.info.others, [value]);
  const setInfo = useCallback((val) => {
    setValue((res) => {
      res.info.others[props.index] = val;
      return res;
    })
  }, []);

  return {
    info,
    setInfo,
  }
}
```

- 这样的话，这个重新划分的模块内部，想要修改上层的数据，只需要通过 ```info,setInfo``` 即可
- 不用担心纯度和不变性的问题，因为 hooks 都是纯的，没有不纯的情况
- info 和 setInfo 的 getter，setter 封装，叫做 —— 模块间通讯
- why not useReducer? 
  - 只涉及调试，也就是有个 action 名字方便你定位问题，模块划分如果足够细，你根本不需要这个 action 来记录你的变更- 采用 useReducer 与 DDD 原则背离，但是也不会禁止。
  - 不过，全局 useReducer 必须明令禁止，这种方式是个灾难，useReducer 必须是以模块为单位，不能更小，也不能更大
- 在这里，你会发现 props 的功能好像只有’分形’，也就是 map 种将数据的标识传递给子组件，是的 —— 优先使用服务共享状态逻辑

### 可选服务

- 模块服务划分的另一个巨大优势，就是将逻辑变为可选项，这在重型应用中，几乎就是采用 DDD 的关键

``` js
function useServiceByOneLogic() {
  return {
    activated,
    // ...
  };
}
function useServiceByAnotherLogic() {
  return {
    activated,
    // ...
  };
}

function useSomeService() {
  const [...servicList] = [useServiceByOneLogic(), useServiceByAnotherLogic()];
  // 选择激活的服务
  const useService = useMemo(() => {
    for (let service of serviceList) {
      if (service.activated === true) {
        return service;
      }
    }
  }, [serviceList])

  return usedService;
}
```

- 最典型的应用，就是多家云服务厂商的短信验证（验证码，人机校验等），通过可选服务根据用户网络情况进行筛选，用最适合当前用户的那一个
- 还有一个非常有意思的方案，通过服务来做数据 mock，因为服务直接对接视图，你只需要模拟视图数据即可，提供两个服务，一个真实服务，一个 mock 服务，这样是用真实数据还是 mock 数据，都是服务自动判断的，对你来说没有流程差别

### 测试边界清晰，且易于模拟

- 视图你不用测试，因为没有视图逻辑
- 你只需要测试这些 useFunction 就好（空值、边界）

最后
谁再提状态管理我和谁急！
你看看这个应用，哪里有状态管理插手的地方？

## 编程范式

首先，编程范式除了实现方式不同以外，其区别的根源在于 – **关注点不同**

- 函数的关注点在于 —— 变化
- 面向对象的关注点在于 —— 结构

对于函数，因为结构方便于处理变化，即输入输出是天然关注点，所以 —— 管理**状态**和**副作用**很重要

对于面向对象它也有非常严重的问题 —— 初始化，自解耦麻烦，组合麻烦，需要运用到大量的’构建’，’运行’设计模式

想要只通过一个编程范式解决所有问题，就像用手去抓沙子，最后你什么都得不到


### 自底向上

- 函数的组合方式，与开发目标的构建方式，也是相反的
- 它的构建方法叫做 —— 自底向上
- 在极限函数式编程下 —— 我先做出来，再看能干什么，比先确定干什么，再做，更重要！

## 领域模块

函数式可以将其优势通过管道发挥到极致，面向对象一样可以将其优势发挥到极致，这便是领域模块

- 领域，就是一系列相同目的，相同功能的资源的集合
  - 比如，学校，公司，这两个类，如果分别封装了大量的其他类以及相关资源，共同构成一个整体，自行管理，自行测试，甚至自行构建发布，对外提供统一的接口，那这就是领域
- 如果实现了一个类和其相关资源的自行管理，自行测试，这就是 —— DDD
- 如果实现了对其的自行构建发布，这就是 —— 微服务

这种模型给了应用规模化的能力 —— 横向，纵向扩展能力

这就是 —— 自顶向下

### 自顶向下

- 我要做什么应用？
- 这个应用有哪些功能？
- 我该怎么组织我的资源和代码？
- 该怎么和其他职能合作？
- 工期需要多久？

现实告诉你，单用任何一种都不行
开发过程中，不止有自底向上封装的工具，还有自顶向下设计的结构

再丰富细致的功能划分，没有底层一个个工具函数，也完成不了任何工作
这个世界的确处在变化之中，世界的本质就是变化，就是函数，但是软件是交给人用，交给人开发的
是人，就有组织，有公司，进而有职能划分，大家只会通过观念系统进行交流 —— 你所说的每一个词汇，都是观念，都是类！

### React 提倡函数式

- 这是面向对象风格的写法（注意，只是风格，不是指只有这个是面向对象）

``` js
class OOStyle {
  name: string;
  password: string;
  constructor() {}
  get nameStr() {}
  changePassword() {}
}
function OOStyleFactory() {
  return new OOStyle(/* ... */);
}
```

- 这个是函数风格的写法（注意，这只是风格，这同时也是面向对象）

``` js
function funcStyle(name, password) {
  return {
    name,
    password,
    getName() {},
    changePassword() {},
  };
}
```

这两种风格的逻辑是一样的，唯一的区别，只在于**可读性**
函数风格牺牲了可读性，得到了灵活性这一点
编程其实是个权衡过程，对于我来说，我愿意
- 在处理复杂结构时使用**面向对象**风格
- 在处理复杂逻辑时，使用**函数**风格

我们来看看上面的那个函数风格的类像不像什么东西？

``` js
function useThisClass() {
  const [val1, setVal1] = useState(0);
  const [val2, setVal2] = useState(0);
  useEffect(() => {}, []);
  const otherObject = useOtherClass();
  return { val1, setVal1, val2, setVal2, otherObject };
}
```

Hooks: 恭喜各位，用得开心！

> 用领域驱动解决高层级问题，用函数式解决低层级问题，才是最佳开发范式


## React DDD 下的一些常见问题 FAQ

### React DDD 性能会有问题么?

不会，React DDD 的方案性能比 class 风格组件 + 类 redux 分层要强得多，而且你可以精细化控制组件的调度和响应式，下限比 redux 上限还要高，上限几乎可以摸到框架极限

### Redux 之类的工具还有意义么？

没有意义了，它只是解决框架没有 IOC 情况下，保持和框架相同的单向数据流，保持用户态代码的脱耦而已，由于状态分散不易测试，提供一个切面给你调试而已

这种方案相当于强制在前端封层，相当不合理，同时 typescript 支持还很差

在框架有 IOC 的情况下，用户代码的状态逻辑实际上形成了一个和组件结构统一的树，称之为逻辑树或者注入树，依赖树，很自然地与组件相统一，很自然地保证单向数据流和一致性

所以，Redux 之类的工具最好不要用，妄图在应用顶层一个服务解决问题的方法，都很傻


### 管道流难度会不会很高？

是的，作为极限函数式开发，在给你提供更好的类型支持，容易调试测试的支持后，首当其冲的，就是纯粹函数式的爆炸难度

正常模式下，你是需要先化简范畴运算式再写代码的

但是，React hooks 有非常活跃的社区，你不需要自己实现封装很多逻辑，这部分可以直接求助于社区实现, 需要你实现的管道功能很少

React 的管道复用第三方，大多都是直接面向业务的，比如ahooks ，要直接很多

所以在，真正需要你写的管道逻辑并不多，这一点值得庆幸

管道风格也是未来趋势，可以说管道和领域，分别是函数式和面向对象推演到极致的结果，两者都是最佳范式，两者都得学习

你只需要学思想方法，而且这样的思想方法，放诸四海皆可，任何编程平台，除了特别纯粹的那种：无类型 lisp 和无 lambdajava，基本上这些概念都是想通且能够交流的

管道也是存在于编程的方方面面，elasticSearch，mongo aggregation，node stream，graphQL，等等等等…

### 参考：
- https://www.zhihu.com/column/plightfield
- https://mp.weixin.qq.com/s/rICtjdO0usOp5_Zh7ncDuQ
- https://mcxiaoke.gitbooks.io/rxdocs/content/Intro.html
