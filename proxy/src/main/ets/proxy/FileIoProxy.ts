import { fileIo } from "@kit.CoreFileKit"
import { Global } from "./Global";
import { FileProxy } from "./FileProxy";

/**
 * FileIo代理
 */
export class FileIoProxy {
  public static openSync(...args): FileProxy {
    if (args == null || args.length < 1) {
      return
    }
    let path: string = args[0]
    let mode = null
    if (args.length == 2) {
      mode = args[1]
    }
    // let parentPath = path.slice(0, path.lastIndexOf('/'));
    let fileName = path.slice(path.lastIndexOf('/') + 1);
    // 重定向后的路径
    let ROOT_PATH = Global.getInstance().uiAbilityContext.filesDir;
    return fileIo.openSync(`${ROOT_PATH}/${fileName}`, mode)
  }
}