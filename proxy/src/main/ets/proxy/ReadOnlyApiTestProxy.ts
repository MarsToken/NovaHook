import { hilog } from "@kit.PerformanceAnalysisKit";

export class ReadOnlyApiTestProxy {

  /**
   * 读写proxy，代理只读为读写
   */
  readWriteTest(name: string) {
    hilog.debug(0, 'Hook_Lib', `read and write method,name is ${name}`)
  }
}

export let readOnlyApiTestProxy = new ReadOnlyApiTestProxy()