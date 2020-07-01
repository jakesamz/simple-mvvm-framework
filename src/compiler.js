import Watcher from "./watcher";

export default class Compiler {
  constructor(context) {

    //读取模板，并存储下来
    this.context = context;

    //解析表达式，求值并添加响应的订阅者 watcher
    this.compileNodes(this.context.$el);

  }

  compileNodes(dom) {
    if (!dom) {
      return;
    }
    let children = this.excludeNodes(dom);

    //console.log(children);

    for (let node of children) {
      //console.log(node.nodeType)
      if (node.nodeType === 1) {
        this.compileElementNode(node);
      } else if (node.nodeType === 3) {
        this.compileTextNode(node);
      }
    }
  }

  excludeNodes(nodes) {
    return [...nodes.childNodes].filter(node => !this.exclude(node));
  }

  exclude(node) {
    let regExp = /^[\t\n\r]+/;
    return node.nodeType === 8 || (node.nodeType === 3 && regExp.test(node.textContent))
  }

  /**
   * 编译文本标签：
   * 1. 解析表达式
   * 2. 运行表达式求值并替换表达式
   * 3. 增加一个订阅者作为监听依赖监听值的改变
   * @param {} node 
   */
  compileTextNode(node) {
    const exp = this.parseExp(node.textContent);

    let watcher = new Watcher(exp, this.context, function(newValue) {
      node.textContent = newValue;
    }, true)
  }

  /**
   * 解析表达式 比如 {{msg}} 转换为 (msg)
   * @param {*} exp 
   */
  parseExp(exp) {
    // let regExp = /\{\{(.+?)\}\}/g;
    // const pieces = text.split(regExp);
    // const matches = text.match(regExp);
    return exp.replace('{{', '(').replace('}}', ')');//先用简单的方法实现表达式转换
  }


  //指令标签
  compileElementNode(node) {
    this.compileNodes(node);
    //console.log('compile element node', node.textContent);
    const attrs = node.getAttributeNames();
    //console.log(attrs)
    for(let attr of attrs) {
      if(attr.indexOf('v-text') !== -1) {
        //console.log(node.getAttribute(attrs));
        new Watcher(node.getAttribute(attrs), this.context, (newValue) => {
          node.textContent = newValue;
        }, true);
      }else if(attr.indexOf('v-model') !== -1){
        new Watcher(node.getAttribute(attrs), this.context, (newValue) => {
          node.value = newValue;
        }, true);
        node.addEventListener('input', (event) => {
          this.context[node.getAttribute(attrs)] = event.target.value;
        })
      }
      
    }

  }



}