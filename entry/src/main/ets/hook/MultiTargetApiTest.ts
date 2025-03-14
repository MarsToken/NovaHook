export class MultiTargetApiTest {
  public name: string

  constructor(builder) {
    if (arguments.length <= 0 || builder == undefined) {
      builder = new MultiTargetApiTest.Builder()
    }
    this.name = builder.name
  }

  static get Builder() { // 静态属性访问器
    class Builder {
      public name: string

      constructor() {
        this.name = ''
      }
      // 注意内部包含this对Builder自身的引用，所以，当函数调用时不能直接(),推荐apply
      build(): MultiTargetApiTest {
        return new MultiTargetApiTest(this);
      }

      setName(name): Builder {
        this.name = name
        return this
      }
    }

    return Builder
  }
}