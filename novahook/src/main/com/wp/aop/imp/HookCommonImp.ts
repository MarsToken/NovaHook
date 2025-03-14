import { innerWrapMethod } from '../core/HookCore'
import { IHookController } from '../interface/IHookController'
import { HookOptions } from '../interface/HookOptions'

/**
 * 通用hook
 */
export class HookCommonImpl implements IHookController {
  hookMethod(options: HookOptions): void {
    this.innerHookMethod(
      options.target,
      options.member,
      options.exceptionAdvice,
      options.beforeAdvice,
      options.replaceAdvice,
      options.afterAdvice,
      options.returnAdvice
    )
  }

  /**
   * 通用hook
   *
   * @param target - 目标类
   * @param member - 成员名
   * @param exceptionAdvice - 异常捕捉函数
   * @param beforeAdvice - 调用被hook方法之前，执行的钩子函数
   * @param replaceAdvice - 被替代的钩子函数
   * @param afterAdvice - 调用被hook方法之后，执行的钩子函数
   * @param returnAdvice - 调用被hook方法成功返回后，执行的钩子函数
   *
   */
  private innerHookMethod(
    target: any,
    member: string,
    exceptionAdvice?: (msg: string) => void,
    beforeAdvice?: (context: any, args: any[]) => any | void,
    replaceAdvice?: (context: any, origin: Function, ...args) => any,
    afterAdvice?: (context: any, args: any[]) => void,
    returnAdvice?: (context: any, result: any, args: any[]) => void,
  ): void {
    innerWrapMethod(target, member, exceptionAdvice, (origin) => function (...args) {
      let transformArgs = beforeAdvice?.(this, args)
      if (transformArgs == null || transformArgs == undefined) {
        transformArgs = args
      }
      let result
      try {
        if (replaceAdvice == null || replaceAdvice == undefined) {
          result = origin.apply(this, transformArgs)
        } else {
          result = replaceAdvice(this, origin, transformArgs)
        }
      } catch (e) {
        if (exceptionAdvice) {
          exceptionAdvice?.(`method executed failed. exp: ${e.message}`)
        } else {
          throw new Error(`method executed failed. exp: ${e.message}`)
        }
      } finally {
        afterAdvice?.(this, args)
      }
      if (result != null && result != undefined) {
        returnAdvice?.(this, result, args)
      }
      return result
    });
  }
}


