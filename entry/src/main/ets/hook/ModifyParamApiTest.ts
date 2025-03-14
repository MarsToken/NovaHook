import Logger from "@github/novahook/src/main/com/wp/aop/utils/Logger"

export class ModifyParamApiTest {

  static changedParam(param: string) {
    Logger.d(`testParam param is ${param}`)
  }
}