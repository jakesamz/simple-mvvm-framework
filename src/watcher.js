import Dep from "./dep";

var uid = 0;

/**
 * 订阅者 Watcher
 */
export default class Watcher {

  constructor(exp, context, cb, immediate) {
    this.context = context;
    this.exp = exp;
    this.cb = cb;
    this.immediate = immediate;
    this.uid = uid++; //为每个 watcher 设置一个id;
    this.value = this.get();
    immediate && this.update();
  }

  /**
   * 计算指, 并调用属性的 get 方法
   */
  get() {
    Dep.target = this;
    let value = Watcher.computeExp(this.exp, this.context);
    Dep.target = null;
    return value;
  }

  /**
   * 如果有值更新，通知对应的订阅者更新状态
   */
  update() {
    let oldVaule = this.value;
    let newValue = this.get();
    this.value = newValue;
    //console.debug('update value', value)
    this.cb && this.cb.call(this, this.value, oldVaule);
  }

  /**
   * 根据表达式求值
   * @param {*} exp 
   * @param {*} context 
   */
  static computeExp(exp, context) {
    return new Function('with(this){ return ' + exp + '}').call(context);
  }

}