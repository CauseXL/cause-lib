// 打印vnode, 控制台输出下面内容，可见标签上的属性转换成了props
// { 
//   "props": { "msg": "hello msg" }, 
//   "_children": null,
//   "_parent": null,
//   "_depth": 0, "_dom": null,
//   "_lastDomChild": null,
//   "_component": null
// }

class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
          title: 'Hello'
      }
  }

  changeTitle() {
      this.setState({title: 'changed'});
  }

  render() {
      return (
          <div>
              <button onClick={this.changeTitle.bind(this)}>改变页面标题</button>
              <h1>{this.state.title}</h1>
          </div>
      );
  }
}

var vnode = {
  type: 'Home',
  key: undefined,
  props: {
      children: {
          button: {
              _children: {
                  type: 'text',
                  props: {
                      text: '改变页面标题',
                      onclick: changeTitle
                  },
              },
              state: {},
              _nextState: {}
          },
          h1: {
              props: {},
              state: {title: 'Hello'},
              _nextState: {title: 'changed'}
          }
      }
  },
  state: {
      title: 'Hello'
  },
  _nextState: {
      title: 'changed'
  },
  _component: {
      base: 'div',
      state: {},
      _nextState: {}
  }
}
