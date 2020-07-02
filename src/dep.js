import Watcher from "./watcher";

export default class Dep {


  constructor(context) {
    this.subs = []; //订阅者 watcher 名单
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update();
    })
  }

  /**
   * 订阅者名单是否包含 watcher
   * @param {} dep 
   */
  includes(watcher) {
    return this.subs.includes(watcher);
  }

}