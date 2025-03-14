import Logger from '../utils/Logger';

/**
 * 执行hook函数
 *
 * @param target - hook目标
 * @param action - 源函数名
 * @param wrapper - 目标函数
 */
export function innerWrapMethod(target, action, exceptionFn, wrapper) {
  if (!target || !action) {
    Logger.e(`wrapMethod()->hook failed invalid params`)
    return
  }
  let origin: Function | undefined;
  let isPrototype = false;

  try {
    // 1.check prototype is defined (special case:router ) & action is defined on target.prototype(obj method)
    if (target.prototype && typeof target.prototype[action] === 'function') {
      origin = target.prototype[action];
      isPrototype = true;
    }
    // 2.action is defined on target itself (static method)
    else if (typeof target[action] === 'function') {
      origin = target[action];
    }

    // 3.check whether origin is found
    if (origin) {
      const destination = isPrototype ? target.prototype : target;

      // 4.get property descriptor
      const descriptor = Object.getOwnPropertyDescriptor(destination, action);
      // 5.try redefine property
      if (descriptor && !descriptor.writable) {
        try {
          Object.defineProperty(target, action, {
            writable: true,
            configurable: true
          });
        } catch (e) {
          Logger.d(`wrapMethod()->redefine property failed  exp:${e}`)
        }
      }

      // 6.check is writable
      if (descriptor && descriptor.writable) {
        destination[action] = wrapper(origin)
      } else {
        if (exceptionFn) {
          exceptionFn?.(`wrapMethod()-> hook failed. Property ${action} is read-only or not writable.`)
        } else {
          throw new Error(`wrapMethod()-> hook failed. Property ${action} is read-only or not writable.`)
        }

      }
    } else {
      if (exceptionFn) {
        exceptionFn?.(`wrapMethod()-> hook failed. originMethod not found for action: ${action}`)
      } else {
        throw new Error(`wrapMethod()-> hook failed. originMethod not found for action: ${action}`)
      }
    }
  } catch (e) {
    if (exceptionFn) {
      exceptionFn?.(`hook failed. exp: ${e.message}`)
    } else {
      throw new Error(`hook failed. exp: ${e}`)
    }
  }
}