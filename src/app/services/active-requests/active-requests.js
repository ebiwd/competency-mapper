class ActiveRequestsService {
  static instance;

  constructor() {
    if (ActiveRequestsService.instance) {
      return ActiveRequestsService.instance;
    }

    ActiveRequestsService.instance = this;

    this.counter = 0;
    this.callbacks = [];
  }

  addEventListener(fn) {
    return this.callbacks.push(fn);
  }

  removeEventListener(index) {
    return delete this.callbacks[index - 1];
  }

  startRequest() {
    if (this.counter === 0) {
      this.callbacks.forEach(fn => fn && fn(true));
    }
    ++this.counter;
  }

  finishRequest() {
    if (this.counter === 1) {
      this.callbacks.forEach(fn => fn && fn(false));
    }

    if (this.counter > 0) {
      --this.counter;
    }
  }
}

export default ActiveRequestsService;
