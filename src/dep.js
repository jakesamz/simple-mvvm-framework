import Watcher from "./watcher";

export default class Dep {

  constructor(context) {
    this.subs = [];
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update();
    })
  }

}