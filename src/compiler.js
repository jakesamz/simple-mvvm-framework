import Watcher from "./watcher";

export default class Compiler {
  constructor(context) {

    //读取模板，并存储下来
    this.context = context;

    this.$el = this.context.$el;

    //把原生dom转换为文档片段
    this.fragment = this.domToFragments(this.$el);

    console.log(this.fragment);

    //解析表达式，计算值，并添加响应的订阅者 watcher
    this.compileFragment(this.fragment);
 
    //把文档片段添加回根节点
    this.$el.appendChild(this.fragment);

  }

  /**
   * 把原生dom转换为文档片段
   * @param {*} dom 
   */
  domToFragments(dom) {
    let newFragment = document.createDocumentFragment();
    if(dom.childNodes) {
      dom.childNodes.forEach(node => {
        if(!this.exclude(node)) {
          console.log(node)
          newFragment.appendChild(node);
        }
      })
    }
    return newFragment;
  }

  /**
   * 排除回车节点（在转换为文档片段时排除）
   * @param {*} node 
   */
  exclude(node) {
    let regExp = /^[\t\n\r]+/;
    return node.nodeType === 8 || (node.nodeType === 3 && regExp.test(node.textContent))
  }

  /**
   * 编译文档片段
   * @param {*} fragment 
   */
  compileFragment(fragment) {
    if (!fragment) {
      return;
    }

    let children = fragment.childNodes;

    for (let node of children) {
      //console.log(node.nodeType)
      if (node.nodeType === 1) {
        this.compileElementNode(node);
      } else if (node.nodeType === 3) {
        this.compileTextNode(node);
      }
    }
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


  /**
   * 编译元素节点
   * @param {} node 
   */
  compileElementNode(node) {
    //递归编译子节点
    this.compileFragment(node);
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