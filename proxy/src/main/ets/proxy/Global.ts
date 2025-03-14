import { common } from "@kit.AbilityKit";

export class Global {
  // 私有静态属性，用于存储类的唯一实例
  private static instance: Global | null = null;
  public uiAbilityContext: common.UIAbilityContext | null = null;

  // 私有构造函数，防止外部通过 `new` 关键字创建实例
  private constructor() {

  }

  /**
   * 公共静态方法，用于获取类的唯一实例
   * 如果实例不存在，则创建它；否则返回已存在的实例
   *
   */
  public static getInstance(): Global {
    if (Global.instance === null) {
      Global.instance = new Global();
    }
    return Global.instance;
  }

  /**
   * 设置UIAbilityContext单例
   * @param context
   */
  public setUIAbilityContext(context: common.UIAbilityContext): void {
    this.uiAbilityContext = context;
  }
}

