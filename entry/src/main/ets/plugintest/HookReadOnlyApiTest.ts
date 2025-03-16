import { readOnlyApiTest } from "../hook/ReadOnlyApiTest"

export function hookReadOnlyApi(){
  readOnlyApiTest.readOnlyTest("test")
}