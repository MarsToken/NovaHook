import { FileIoProxy } from 'proxy'
import fileIo from "@ohos.file.fs";
import { Global } from "proxy";
import Logger from "novahook/src/main/com/wp/aop/utils/Logger";


export function testFile() {
  let path = Global.getInstance().uiAbilityContext.cacheDir + '/test.txt'
  Logger.d(`文件源路径：${path}`)
  let file = FileIoProxy.openSync(path, fileIo.OpenMode.CREATE | fileIo.OpenMode.WRITE_ONLY)
  fileIo.writeSync(file.fd, '写入的测试文本a')
  fileIo.closeSync(file.fd)
  Logger.d(`文件路径重定向至：${file.path}`)
  Logger.d('文本写入成功！')
}

// 模拟以下自定义的openSync不会被hook

// export function testFile(path: string) {
//   FileIoProxy.openSync(path, fileIo.OpenMode.CREATE | fileIo.OpenMode.WRITE_ONLY)
// }

// class fileIo {
//   static openSync(path: string, mode?: number) {
//     let str:string='skdfroms';
//     str.split('from')[1].trim()
//     // Logger.d(`path`)
//   }
// }

