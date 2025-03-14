import { GroupListBean } from '../bean/GroupListBean';
import { ListView } from '../component/CommonComponent';
import {
  hookCommonMethod,
  hookHighFunction,
  hookModifyRealParam,
  hookMultiTarget,
  hookReadOnlyMethod,
  hookReturnValueNotExport,
  hookStaticMethod,
  hookThrowException
} from '../hook/Hook';

const HOOK_STATIC_FUNCTION: string = 'Hook静态函数'
const HOOK_COMMON_FUNCTION: string = 'Hook非静态函数'
const HOOK_HIGH_FUNCTION: string = 'Hook高阶函数'
const HOOK_MULTI_TARGET: string = 'Hook多Target'
const HOOK_THROW_EXCEPTION: string = 'Hook ReadOnly 抛异常'
const HOOK_READ_ONLY_METHOD: string = 'Hook ReadOnly 成功'
const HOOK_RETURN_NOT_EXPORT: string = 'Hook 返回值非export'
const HOOK_MODIFY_PARAM: string = 'Hook仅修改实际参数'

@Entry
@Component
struct HomePage {
  @State data: GroupListBean[] = [
    {
      header: "普通Hook",
      cases: [
        HOOK_STATIC_FUNCTION,
        HOOK_COMMON_FUNCTION,
        HOOK_HIGH_FUNCTION,
        HOOK_MULTI_TARGET,
        HOOK_THROW_EXCEPTION,
        HOOK_MODIFY_PARAM,
      ]
    },
    {
      header: "插件Hook",
      cases: [
        HOOK_READ_ONLY_METHOD,
        HOOK_RETURN_NOT_EXPORT,
      ]
    }
  ]

  build() {
    Column() {
      ListView({
        data: this.data,
        itemClick: this.processClick,
      })
    }
  }

  private processClick(text: string) {
    switch (text) {
      case HOOK_STATIC_FUNCTION:
        hookStaticMethod()
        break;
      case HOOK_COMMON_FUNCTION:
        hookCommonMethod()
        break;
      case HOOK_HIGH_FUNCTION:
        hookHighFunction()
        break;
      case HOOK_MULTI_TARGET:
        hookMultiTarget()
        break;
      case HOOK_THROW_EXCEPTION:
        hookThrowException()
        break;
      case HOOK_READ_ONLY_METHOD:
        hookReadOnlyMethod()
        break
      case HOOK_RETURN_NOT_EXPORT:
        hookReturnValueNotExport()
        break
      case HOOK_MODIFY_PARAM:
        hookModifyRealParam()
        break
      default:
        break;
    }
  }
}