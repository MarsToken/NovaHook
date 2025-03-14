import Logger from "@github/novahook/src/main/com/wp/aop/utils/Logger";

/**
 * 普通api
 */
export class NormalApiTest {
  /**
   * 静态函数
   */
  static staticMethod(name: string): string {
    Logger.d(`execute static method ${name}`)
    return name
  }

  /**
   * 非静态函数
   */
  public normalMethod(name: string, age: number): string {
    Logger.d(`execute normal method name is ${name},age is ${age}`)
    return `${name}-${age}`
  }
}