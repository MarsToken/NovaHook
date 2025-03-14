import Logger from "@github/novahook/src/main/com/wp/aop/utils/Logger";

export class FunctionApiTest {
  static functionTest(func: (value1: number, value2: number) => number): number {
    Logger.d(`func 函数执行前`)
    let result = func(10, 20)
    Logger.d(`func 函数执行后`)
    return result * 10;
  }
}