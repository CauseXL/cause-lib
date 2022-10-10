const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
const container = document.getElementById('root');

// const element = React.createElement("div", {
//   title: "foo"
// }, "Hello");

// * ---------------- 

const node = document.createElement(element.type);

node['title'] = element.props.title;

const text = document.createTextNode('');
text['nodeValue'] = element.props.children;

node.appendChild(text);
container.appendChild(node);

// * ---------------- 

export const createElement = (type, props, children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === 'object' ? child : createTextElement(child))
    },
  }
}

const createTextElement = (text) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}
