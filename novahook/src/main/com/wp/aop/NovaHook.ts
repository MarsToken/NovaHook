import { HookChildMemberImp } from './imp/HookHighFuctionImp';
import { HookCommonImpl } from './imp/HookCommonImp';
import { HookChildMemberImpl } from './imp/HookChildMemberImp';
import { HookOptions } from './interface/HookOptions';
import { IHookController } from './interface/IHookController';
import Logger from './utils/Logger';

const HIGH_FUNCTION_HOOK: string = 'high_function_hook'
const COMMON_HOOK: string = 'common_hook'
const Multi_TARGET_HOOK: string = 'multi_target_hook'

/**
 * NovaHook的hookXXX函数的配置对象即为切面
 * 由Target的member、childMember执行构成连接点
 * before、replace、after为前置、环绕、后置通知
 *
 */
export class NovaHook {
  static hookMap = new Map<string, IHookController>();

  /**
   * 初始化
   */
  static {
    let highFunctionHookImpl = new HookChildMemberImp()
    this.hookMap.set(HIGH_FUNCTION_HOOK, highFunctionHookImpl)
    let commonHookImpl = new HookCommonImpl()
    this.hookMap.set(COMMON_HOOK, commonHookImpl)
    let propertyHookImpl = new HookChildMemberImpl()
    this.hookMap.set(Multi_TARGET_HOOK, propertyHookImpl)
  }

  /**
   * hook方法
   * @param options
   */
  static hookMethod(options: HookOptions): void {
    const {
      target,
      member,
      childMember,
      isHookHighFunction,
      exceptionAdvice
    } = options
    try {
      if (!target || !member) {
        if (exceptionAdvice) {
          exceptionAdvice?.('Invalid parameters for hookMethod')
        } else {
          throw new Error("Invalid parameters for hookMethod")
        }
        return
      }
      if (isHookHighFunction) {
        this.hookMap.get(HIGH_FUNCTION_HOOK).hookMethod(options)
      } else if (childMember) {
        this.hookMap.get(Multi_TARGET_HOOK).hookMethod(options)
      } else {
        this.hookMap.get(COMMON_HOOK)?.hookMethod(options)
      }
    } catch (e) {
      Logger.e(e.stack)
      if (exceptionAdvice) {
        exceptionAdvice?.(e.message)
      } else {
        throw new Error(e.message)
      }
    }
  }
}