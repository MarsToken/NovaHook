import { readOnlyApiTestProxy } from 'proxy'
import { readOnlyApiTest } from "../hook/ReadOnlyApiTest"

export function hookReadOnlyApi(){
  readOnlyApiTestProxy.readWriteTest("test")
}