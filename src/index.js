import Observer from './observer';
import Compiler from './compiler';

class Vue {


  constructor(options = {}) {
    
    //得到$el
    this.$el = document.querySelector(options.el);

    this.$data = options.data();
    this.$methods = options.methods;
    
    //代理数据
    this.proxyData(this.$data);

    //代理方法
    this.proxyMethods(this.$methods)

    //劫持数据
    new Observer(this);

    //解析模板
    new Compiler(this);

  }

  proxyData(data) {
    data = data || {};
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newValue) {
          data[key] = newValue;
        }
      })
    })
  }

  proxyMethods(methods) {
    methods = methods || {};
    Object.keys(methods).forEach(fn => {
      this[fn] = methods[fn].bind(this);
    })
  }

}

window.Vue = Vue;