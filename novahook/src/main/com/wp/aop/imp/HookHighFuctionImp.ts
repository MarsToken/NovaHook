import { innerWrapMethod } from '../core/HookCore'
import { IHookController } from '../interface/IHookController'
import { HookOptions } from '../interface/HookOptions'

/**
 * 高阶函数hook
 */
export class HookChildMemberImp implements IHookController {
  hookMethod(options: HookOptions): void {
    this.innerHookMethodAction(
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
   * Hook高阶函数
   *
   * @param target - 目标类
   * @param member - 成员名
   * @param exceptionAdvice - 异常捕捉函数
   * @param beforeAdvice - 调用被hook方法之前，执行的钩子函数
   * @param replaceAdvice - 被替代的钩子函数
   * @param afterAdvice - 调用被hook方法之后，执行的钩子函数
   * @param returnAdvice - 调用被hook方法成功返回后，执行的钩子函数
   */
  private innerHookMethodAction(
    target: any,
    member: string,
    exceptionAdvice?: (msg: string) => void,
    beforeAdvice?: (context: any, args: any[]) => any | void,
    replaceAdvice?: (context: any, origin: Function, ...args) => any,
    afterAdvice?: (context: any, args: any[]) => void,
    returnAdvice?: (context: any, result: any, args: any[]) => void,
  ) {
    innerWrapMethod(target, member, exceptionAdvice, (originalMethod) => function (callback) {
      const wrappedCallback = (...args) => {
        let transformArgs = beforeAdvice?.(this, args)
        if (transformArgs == null || transformArgs == undefined) {
          transformArgs = args
        }
        let result
        try {
          if (replaceAdvice == null || replaceAdvice == undefined) {
            result = callback.apply(this, transformArgs)
          } else {
            result = replaceAdvice(this, callback, transformArgs)
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
      }
      originalMethod.call(this, wrappedCallback)
    });
  }
}

