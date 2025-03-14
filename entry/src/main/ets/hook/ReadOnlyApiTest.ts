import Logger from 'novahook/src/main/com/wp/aop/utils/Logger'

export class ReadOnlyApiTest {
  /**
   * 只读,测试代码插装hook
   */
  readOnlyTest(name: string) {
    Logger.d(`read only method,name is ${name}`)
  }

  readOnlyTest2(name: string) {
    Logger.d(`read only method,name is ${name}`)
  }

  init() {
    Object.defineProperty(Object.getPrototypeOf(this), 'readOnlyTest', {
      writable: false,
      configurable: false,
      value: this.readOnlyTest
    })
    Object.defineProperty(Object.getPrototypeOf(this), 'readOnlyTest2', {
      writable: false,
      configurable: false,
      value: this.readOnlyTest2
    });
  }
}

export let readOnlyApiTest = new ReadOnlyApiTest()