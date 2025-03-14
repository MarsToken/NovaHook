/**
 * hook配置项
 */
export interface HookOptions {
  /**
   * 被hook的目标
   */
  target: any
  /**
   * 被hook的成员：方法|属性名
   */
  member: string
  /**
   * 被hook的子方法|子属性名
   * 优先级第二
   */
  childMember?: string
  /**
   * 是否hook高阶函数
   * 优先级最高
   */
  isHookHighFunction?: boolean
  /**
   * 异常通知
   */
  exceptionAdvice?: (msg: string) => void
  /**
   * 前置通知
   */
  beforeAdvice?: (context: any, ...args) => any | void
  /**
   * 环绕通知
   */
  replaceAdvice?: (context: any, origin: Function, ...args) => any
  /**
   * 后置通知
   */
  afterAdvice?: (context: any, ...args) => void
  /**
   * 返回通知
   */
  returnAdvice?: (context: any, result: any, ...args) => void
}