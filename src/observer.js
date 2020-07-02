import Dep from "./dep";

export default class Observer {

  constructor(context) {
    this.context = context;
    this.data = this.context.$data;
    this.walk(this.data);
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      //劫持数据
      this.defineReactive(data, key, data[key])
    });
  }

  defineReactive(data, key, value) {
    let dep = new Dep();
    Object.defineProperty(data, key, {

      enumerable: true,
      configurable: false,
      get() {
        //添加依赖
        if(!dep.includes(Dep.target)) {//已存在的无需再次添加
          Dep.target && dep.addSub(Dep.target);
        }
        return value;
      },
      set(newValue) {
        value = newValue;
        dep.notify();//通知依赖更新
      }

    })
  }



}