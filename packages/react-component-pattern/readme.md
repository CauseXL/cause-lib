# TodoMVC one more

我写了一个更详细的项目：https://todomvc-once-more.vercel.app/

去看看这个↑

---

# TodoList Demo

通过写一个 todolist 的 demo，看看可以怎么写 React 组件，代码仅做展示用途

- server：虽然是 todolist 但是做了一个简单的服务器，用来类比实际项目中和后端通讯的需求，每次 CRUD 操作都模拟了一个几百毫秒的延迟。

客户端

- app1：只包含 curd 逻辑
- app2：抄了 [TodoMVC](https://todomvc.com/examples/react/#/) 的样式
- app3：做了一些简单的重构和代码拆分，用 Context 做数据层
- app3-mobx：改用 mobx 做数据层
- app3-redux：改用 redux 做数据层
- app3-rxjs：改用 rxjs 做数据层

## 文章

- [React 组件通用开发模式](./react-comp-pattern.md)
- [React架构 -- 领域驱动设计 && React Hooks 实践](./docs/ReactDDD.md)

## 启动

启动所有 projects

```sh
yarn start
```
