import { HookOptions } from './HookOptions'

/**
 * hook抽象接口
 */
export interface IHookController {
  /**
   * hook方法
   * @param { HookOptions } options - hook配置项.
   */
  hookMethod(options: HookOptions)
}