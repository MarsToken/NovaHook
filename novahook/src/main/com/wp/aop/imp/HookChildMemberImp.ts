import { IHookController } from '../interface/IHookController';
import { HookOptions } from '../interface/HookOptions';

/**
 * 特定子成员的hook
 */
export class HookChildMemberImpl implements IHookController {
  hookMethod(options: HookOptions): void {
    this.innerHookMethodProperty(
      options.target,
      options.member,
      options.childMember,
      options.exceptionAdvice,
      options.beforeAdvice,
      options.replaceAdvice,
      options.afterAdvice,
      options.returnAdvice
    )
  }

  /**
   * Hook 特定属性的方法
   *
   * @param target - 目标类
   * @param member - 成员名
   * @param childMember - 子成员名
   * @param exceptionAdvice - 异常捕捉函数
   * @param beforeAdvice - 调用被hook方法之前，执行的钩子函数
   * @param replaceAdvice - 被替代的钩子函数
   * @param afterAdvice - 调用被hook方法之后，执行的钩子函数
   * @param returnAdvice - 调用被hook方法成功返回后，执行的钩子函数
   *
   */
  private innerHookMethodProperty(
    target: any,
    member: string,
    childMember: string,
    exceptionAdvice?: (msg: string) => void,
    beforeAdvice?: (context: any, args: any[]) => any | void,
    replaceAdvice?: (context: any, origin: Function, ...args) => any,
    afterAdvice?: (context: any, args: any[]) => void,
    returnAdvice?: (context: any, result: any, args: any[]) => void,
  ) {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(target, member);
    if (propertyDescriptor && propertyDescriptor.get) {
      Object.defineProperty(target, member, {
        get() {
          const originTarget = propertyDescriptor.get.call(this);
          const originMethod = originTarget.prototype[childMember];
          originTarget.prototype[childMember] = function (...args) { // (origin) =>
            let transformArgs = beforeAdvice?.(this, args)
            if (transformArgs == null || transformArgs == undefined) {
              transformArgs = args
            }
            let result
            try {
              if (replaceAdvice == null || replaceAdvice == undefined) {
                result = originMethod.apply(this, transformArgs)
              } else {
                result = replaceAdvice(this, originMethod, transformArgs)
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
          }
          return originTarget
        }
      })
    } else {
      if (exceptionAdvice) {
        exceptionAdvice?.(`hookMethodProperty()->Property ${member} is not a getter on target class`)
      } else {
        throw new Error(`hookMethodProperty()->Property ${member} is not a getter on target class`)
      }
    }
  }
}
