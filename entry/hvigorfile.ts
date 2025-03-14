import { hapTasks } from '@ohos/hvigor-ohos-plugin';
import { getNode, HvigorNode, HvigorPlugin } from '@ohos/hvigor';

/**
 * 插件改源码方案
 */
const TAG = "NovaHook-Plugin"
const node = getNode(__filename)
const fs = require('fs')
const path = require('path')

let filesAndRules = {};

function novaHookPlugin(): HvigorPlugin {
  return {
    pluginId: 'novaHook',
    apply: (node: HvigorNode) => {
      node.registerTask({
        name: 'novaHookTask',
        run: (taskContext) => {
          filesAndRules = novaHook(node)
        },
        postDependencies: ['default@CompileArkTS']
      })

      node.registerTask({
        name: 'resetNovaHookTask',
        run: () => {
          resetNovaHook(filesAndRules.allFiles, filesAndRules.replaceRules)
        },
        dependencies: ['default@CompileArkTS'],
        postDependencies: ['assembleHap']
      });
    }
  };
}

function novaHook(node: HvigorNode) {
  console.log(TAG,"------------start novaHook -----------------")

  if (!node?.nodeDir?.filePath) {
    return
  }

  const rootDir = node.nodeDir.filePath;
  const configFilePath = path.join(rootDir, 'HookPluginConfig.txt')
  const { filesToProcess, keepFiles, replaceRules } = readConfigFile(configFilePath, rootDir)

  let allFiles: string[] = []
  if (filesToProcess.length > 0) {
    allFiles = filesToProcess.flatMap(fileOrDir => {
      if (fs.statSync(fileOrDir).isDirectory()) {
        return getAllFiles(fileOrDir, keepFiles)
      } else {
        return shouldKeep(fileOrDir, keepFiles) ? [] : [fileOrDir]
      }
    });
  } else {
    allFiles = getAllFiles(rootDir, keepFiles);
  }

  allFiles =
    allFiles.filter(filePath => /\.(ts|js|ets)$/.test(filePath))

  allFiles.forEach(filePath => processFile(filePath, replaceRules, false))
  console.log(TAG,"------------end novaHook -----------------")
  return { allFiles, replaceRules };
}

function resetNovaHook(allFiles, replaceRules) {
  console.log(TAG, '============start resetNovaHook =================')
  if (!allFiles || !replaceRules) {
    console.error(TAG, 'ERROR: Missing required parameters for resetNovaHook.')
    return;
  }
  allFiles.forEach(filePath => processFile(filePath, replaceRules, true));
  console.log(TAG, '============end resetNovaHook =================')
}

function resolvePath(filePath, rootDir) {
  let absPath = path.isAbsolute(filePath) ? filePath : path.resolve(rootDir, `.${path.sep}${filePath}`)
  return absPath
}

function readConfigFile(configFilePath, rootDir) {
  const filesToProcess: string[] = []
  const keepFiles: string[] = []
  const replaceRules: {
    pattern: string,
    patternImports: string[],
    replacement: string,
    replacementImports: string[]
  }[] = [];

  const lines = fs.readFileSync(configFilePath, 'utf-8').split('\n')
  const replaceRegex = /^-replace\s+([^\s]+)\s+\[(import.+from.+)\]\s+([^\s]+)\s*(?:\[(.*)\])?/

  lines.map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'))
    .forEach(line => {
      if (line.startsWith('-hook ')) {
        filesToProcess.push(resolvePath(line.substring(6).trim(), rootDir))
      } else if (line.startsWith('-keep ')) {
        keepFiles.push(resolvePath(line.substring(6).trim(), rootDir))
      } else if (replaceRegex.test(line)) {
        const matchArray = replaceRegex.exec(line)
        if (matchArray) {
          for (let i = 0; i < matchArray.length; i++) {
            console.debug(`match${i}: ${matchArray[i]}`)
          }
          const pattern = matchArray[1];
          // 由于源码里;不是强制条件，可以忽略，这里统一按不包含;来处理
          const patternImports =
            matchArray[2] ?
            matchArray[2].split('import ').filter(Boolean).map(s => 'import ' + s.trim().replace(/;?\s*$/, '')) :
              []
          const replacement = matchArray[3]
          const replacementImports =
            matchArray[4] ?
            matchArray[4].split('import ').filter(Boolean).map(s => 'import ' + s.trim().replace(/;?\s*$/, '')) :
              []
          replaceRules.push({
            pattern: escapeRegExp(pattern),
            patternImports,
            replacement,
            replacementImports
          });
        }
      }
    });

  return { filesToProcess, keepFiles, replaceRules };
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')
}

function unescapeRegExp(string) {
  return string.replace(/\\([.*+\-?^${}()|[\]\\])/g, '$1')
}

function getAllFiles(dir, keepFiles, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.error(TAG, `ERROR: Directory does not exist: ${dir}`)
    return fileList
  }

  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      if (!shouldKeep(filePath, keepFiles)) {
        getAllFiles(filePath, keepFiles, fileList)
      }
    } else {
      if (!shouldKeep(filePath, keepFiles)) {
        fileList.push(filePath)
      }
    }
  });
  return fileList
}

function shouldKeep(filePath, keepFiles) {
  return keepFiles.some(keepFile => filePath.startsWith(keepFile))
}

function processFile(filePath, replaceRules, isReverse) {
  let contentLines = fs.readFileSync(filePath, 'utf-8').split('\n')
  let modified = false
  if (isReverse) {
    replaceRules.forEach(({ replacementImports }) => {
      replacementImports.forEach(importStatement => {
        contentLines = contentLines.filter(line => line.trim() !== importStatement.trim())
      })
    })
  }

  replaceRules.forEach(({ pattern, patternImports, replacement, replacementImports }) => {
    const searchPattern = isReverse ? escapeRegExp(replacement) : pattern
    const replaceValue = isReverse ? unescapeRegExp(pattern) : replacement
    const regex = new RegExp(searchPattern, 'g')
    let count = 0
    patternImports.forEach(importElement => {
      contentLines.forEach((line, index) => {
        let pkgName = importElement.split('from')[1].trim()
        const regex = /^(import.+from.+)/
        // if (line.includes('readOnlyApiTest')) {
        //   console.debug(`line is ${line}`)
        //   console.debug(`match:${regex.test(line)}`)
        //   console.debug(`pkgName is ${pkgName},includes:${line.includes(pkgName)}`)
        // }
        if (regex.test(line)) {
          if (line.includes(pkgName)) {
            count++
          }
        }
      })
    });
    if (count < patternImports.length) {
      return;
    }
    console.debug(`process file is ${filePath}`)
    contentLines.forEach((line, index) => {
      if (line.match(regex)) {
        contentLines[index] = line.replace(regex, replaceValue)
        modified = true;
      }
    })

    if (!isReverse && modified) {
      replacementImports.forEach(statement => {
        if (!contentLines.includes(statement)) {
          contentLines.unshift(statement)
        }
      });
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, contentLines.join('\n'), 'utf-8')
    console.warn(TAG, isReverse ? `File reset: ${filePath}` : `File modified: ${filePath}`)
  }
}

export default {
  /*
   * Built-in plugin of Hvigor. It cannot be modified.
   */
  system: hapTasks,
  plugins: [novaHookPlugin()]
}

