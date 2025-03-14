import NovaHook from 'novahook';
import { NormalApiTest } from "./NormalApiTest";
import Logger from "novahook/src/main/com/wp/aop/utils/Logger";
import { FunctionApiTest } from "./FunctionApiTest";
import { MultiTargetApiTest } from "./MultiTargetApiTest";
import { testFile } from "../plugintest/HookFileApi";
import { ModifyParamApiTest } from "./ModifyParamApiTest";
import { ReadOnlyApiTest, readOnlyApiTest } from "./ReadOnlyApiTest";
import { readOnlyApiTestProxy } from 'proxy';
import { hookReadOnlyApi } from '../plugintest/HookReadOnlyApiTest';

export function hookStaticMethod() {
  Logger.d('=======================hook静态方法=========================')
  // 常规hook静态方法
  NovaHook.hookMethod({
    target: NormalApiTest,
    member: 'staticMethod',
    beforeAdvice: (context: any, args: any[]) => {
      Logger.d(`NormalApiTest staticMethod before, context exist: ${context != null && context != undefined},
      args is ${args.toString()}`)
    },
    replaceAdvice: (context: any, origin: Function, args: any[]) => {
      let result = origin(args[0])
      Logger.d(`NormalApiTest staticMethod replace, context exist: ${context != null &&
        context != undefined},args is ${args.toString()}`)
      return result
    },
    afterAdvice: (context: any, args: any[]) => {
      Logger.d(`NormalApiTest staticMethod after,context exist: ${context != null && context != undefined},
      args is ${args.toString()}`)
    },
    returnAdvice: (context: any, result: any, args: any[]) => {
      Logger.d(`NormalApiTest staticMethod return,context exist: ${context != null && context != undefined},
      args is ${args.toString()},result is ${result}`)
    }
  })
  NormalApiTest.staticMethod('test')
}

export function hookCommonMethod() {
  // 常规hook非静态方法
  Logger.d('===================hook非静态方法=============================')
  NovaHook.hookMethod({
    target: NormalApiTest,
    member: 'normalMethod',
    beforeAdvice: (context: any, ...args) => {
      Logger.d(`NormalApiTest normalMethod before, context exist: ${context != null && context != undefined},
      args is ${args.toString()}`)
    },
    replaceAdvice: (context: any, origin: Function, args: any[]) => {
      let result = origin.apply(this, [...args])
      Logger.d(`NormalApiTest normalMethod replace, context exits: ${context != null &&
        context != undefined},args is ${args.toString()}`)
      return result
    },
    afterAdvice: (context: any, args: any[]) => {
      Logger.d(`NormalApiTest staticMethod after,context exist: ${context != null && context != undefined},
      args is ${args.toString()}`)
    },
    returnAdvice: (context: any, result: any, args: any[]) => {
      Logger.d(`NormalApiTest staticMethod return,context exist: ${context != null && context != undefined},
      args is ${args.toString()},result is ${result}`)
    }
  })
  new NormalApiTest().normalMethod('test', 12)
}

export function hookHighFunction() {
  // hook高阶函数的执行场景
  Logger.d('===================hook高阶函数的执行场景=============================')
  NovaHook.hookMethod({
    target: FunctionApiTest,
    member: 'functionTest',
    isHookHighFunction: true,
    beforeAdvice: (context: any, ...args) => {
      Logger.d(`FunctionApiTest functionTest before, context exist: ${context != null && context != undefined},
      args is ${args.toString()}`)
    },
    replaceAdvice: (context: any, origin: Function, args: any[]) => {
      let result = origin.apply(context, args)
      Logger.d(`FunctionApiTest functionTest replace, args is ${args.toString()}`)
      return result - 1
    },
    afterAdvice: (context: any, args: any[]) => {
      Logger.d(`FunctionApiTest functionTest after,context exist: ${context != null && context != undefined},
      args is ${args.toString()}`)
    },
    returnAdvice: (context: any, result: any, args: any[]) => {
      Logger.d(`FunctionApiTest functionTest return,context exist: ${context != null && context != undefined},
       args is ${args.toString()},result is ${result}`)
    }
  })
  FunctionApiTest.functionTest((value1: number, value2: number) => {
    let result = value1 + value2
    Logger.d(`FunctionApiTest original high function execute,10+20= is ${result}`)
    return result
  })
}

export function hookMultiTarget() {
  // hook多target场景
  Logger.d('===================hook多target场景=============================')
  NovaHook.hookMethod({
    target: MultiTargetApiTest,
    member: 'Builder',
    childMember: 'build',
    beforeAdvice: (context: any, ...args) => {
      Logger.d(`MultiTargetApiTest Builder.build before, context exist: ${context != null && context != undefined},
      args exist: ${args != null && args != undefined}`)
      const builderContext = context as InstanceType<typeof MultiTargetApiTest.Builder>
      builderContext.setName('1111')
    },
    replaceAdvice: (context: any, origin: Function, args: any[]) => {
      const builderContext = context as InstanceType<typeof MultiTargetApiTest.Builder>
      Logger.d(`MultiTargetApiTest Builder.build replace, before name is ${builderContext.name}`)
      Logger.d(`MultiTargetApiTest Builder.build replace, args exist: ${args != null && args != undefined}}`)
      let result = origin.apply(context, args) as InstanceType<typeof MultiTargetApiTest>
      result.name = '22222'
      return result
    },
    afterAdvice: (context: any, args: any[]) => {
      Logger.d(`MultiTargetApiTest Builder.build after,context exist: ${context != null && context != undefined},
       args exist: ${args != null && args != undefined}`)
    },
    returnAdvice: (context: any, result: any, args: any[]) => {
      const multiTargetApiTest = result as InstanceType<typeof MultiTargetApiTest> // MultiTargetApiTest.Builder
      Logger.d(`MultiTargetApiTest Builder.build return,context exist: ${context != null && context != undefined},
       args exist: ${args != null && args != undefined},result's name is ${multiTargetApiTest.name}`)
    }
  })
  let multiTargetApiTest1 = new MultiTargetApiTest
    .Builder()
    .setName('testBuilder1')
    .build()
  Logger.d(`multiTargetApiTest name is ${multiTargetApiTest1.name}`)
  let multiTargetApiTest2 = new MultiTargetApiTest
    .Builder()
    .setName('testBuilder2')
    .build()
  Logger.d(`multiTargetApiTest name is ${multiTargetApiTest2.name}`)
}

export function hookThrowException() {
  // hook read-only的target的场景，异常通知
  Logger.d('===================hook read-only的target的场景，异常通知=============================')
  readOnlyApiTest.init()
  NovaHook.hookMethod({
    target: ReadOnlyApiTest,
    member: 'readOnlyTest2',
    exceptionAdvice: (msg) => {
      Logger.e(`抛异常了！${msg}`)
    },
    beforeAdvice: (context: any, args: any[]) => {
      Logger.d(`ReadOnlyApiTestProxy readOnlyTest2 before, context exist: ${context != null && context != undefined},
      args is ${args.toString()}`)
    },
    replaceAdvice: (context: any, origin: Function, args: any[]) => {
      let result = origin(args[0])
      Logger.d(`ReadOnlyApiTestProxy readOnlyTest2 replace, args is ${args.toString()}`)
      return result
    },
    afterAdvice: (context: any, args: any[]) => {
      Logger.d(`ReadOnlyApiTestProxy readOnlyTest2 return,context exist: ${context != null && context != undefined},
      args is ${args.toString()}`)
    },
    returnAdvice: (context: any, result: any, args: any[]) => {
      Logger.d(`ReadOnlyApiTestProxy readOnlyTest2 return,context exist: ${context != null && context != undefined},
      args is ${args.toString()},result is ${result}`)
    }
  })
  readOnlyApiTest.readOnlyTest2("test")
}

export function hookReadOnlyMethod() {
  Logger.d('===================hook read-only的target的场景，代码插装=============================')
  readOnlyApiTest.init()
  hookReadOnlyApi()
}

export function hookReturnValueNotExport() {
  Logger.d('===================返回值类型为源码级非export修饰的类或命名空间场景，代码插装=============================')
  testFile()
}

export function hookModifyRealParam() {
  Logger.d('===================仅修改实际参数场景=============================')
  NovaHook.hookMethod({
    target: ModifyParamApiTest,
    member: 'changedParam',
    exceptionAdvice: (msg) => {
      Logger.e(`抛异常了！${msg}`)
    },
    beforeAdvice: (context: any, args: any[]) => {
      Logger.d(`ModifyParamApiTest readOnlyTest before, context exist: ${context != null && context != undefined},
      args is ${args.toString()}`)
      return ['已被修改：hook-test']
    }
  })
  ModifyParamApiTest.changedParam('test')

}
