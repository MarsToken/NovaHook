import { AsyncCallback } from "@kit.BasicServicesKit";

/**
 * File代理
 */
export interface FileProxy {
  /**
   * @type { number }
   * @readonly
   * @syscap SystemCapability.FileManagement.File.FileIO
   * @since 9
   */
  /**
   * @type { number }
   * @readonly
   * @syscap SystemCapability.FileManagement.File.FileIO
   * @crossplatform
   * @since 10
   */
  /**
   * @type { number }
   * @readonly
   * @syscap SystemCapability.FileManagement.File.FileIO
   * @crossplatform
   * @atomicservice
   * @since 11
   */
  readonly fd: number;

  /**
   * File path
   *
   * @type { string }
   * @readonly
   * @throws { BusinessError } 13900005 - I/O error
   * @throws { BusinessError } 13900042 - Unknown error
   * @throws { BusinessError } 14300002 - Invalid uri
   * @syscap SystemCapability.FileManagement.File.FileIO
   * @since 10
   */
  readonly path: string;

  /**
   * File name
   *
   * @type { string }
   * @readonly
   * @throws { BusinessError } 13900005 - I/O error
   * @throws { BusinessError } 13900042 - Unknown error
   * @syscap SystemCapability.FileManagement.File.FileIO
   * @since 10
   */
  readonly name: string;

  /**
   * Get parent path of file.
   *
   * @returns { string } Return the parent path of file.
   * @throws { BusinessError } 13900005 - I/O error
   * @throws { BusinessError } 13900042 - Unknown error
   * @throws { BusinessError } 14300002 - Invalid uri
   * @syscap SystemCapability.FileManagement.File.FileIO
   * @since 11
   */
  getParent(): string;

  /**
   * Lock file with blocking method.
   *
   * @param { boolean } exclusive - whether lock is exclusive.
   * @returns { Promise<void> } The promise returned by the function.
   * @throws { BusinessError } 13900004 - Interrupted system call
   * @throws { BusinessError } 13900008 - Bad file descriptor
   * @throws { BusinessError } 13900020 - Invalid argument
   * @throws { BusinessError } 13900034 - Operation would block
   * @throws { BusinessError } 13900042 - Unknown error
   * @throws { BusinessError } 13900043 - No record locks available
   * @syscap SystemCapability.FileManagement.File.FileIO
   * @since 9
   */
  lock(exclusive?: boolean): Promise<void>;

  /**
   * Lock file with blocking method.
   *
   * @param { AsyncCallback<void> } callback - Return the callback function.
   * @throws { BusinessError } 13900004 - Interrupted system call
   * @throws { BusinessError } 13900008 - Bad file descriptor
   * @throws { BusinessError } 13900020 - Invalid argument
   * @throws { BusinessError } 13900034 - Operation would block
   * @throws { BusinessError } 13900042 - Unknown error
   * @throws { BusinessError } 13900043 - No record locks available
   * @syscap SystemCapability.FileManagement.File.FileIO
   * @since 9
   */
  lock(callback: AsyncCallback<void>): void;

  /**
   * Lock file with blocking method.
   *
   * @param { boolean } exclusive - whether lock is exclusive.
   * @param { AsyncCallback<void> } callback - Return the callback function.
   * @throws { BusinessError } 13900004 - Interrupted system call
   * @throws { BusinessError } 13900008 - Bad file descriptor
   * @throws { BusinessError } 13900020 - Invalid argument
   * @throws { BusinessError } 13900034 - Operation would block
   * @throws { BusinessError } 13900042 - Unknown error
   * @throws { BusinessError } 13900043 - No record locks available
   * @syscap SystemCapability.FileManagement.File.FileIO
   * @since 9
   */
  lock(exclusive: boolean, callback: AsyncCallback<void>): void;

  /**
   * Try to lock file with returning results immediately.
   *
   * @param { boolean } exclusive - whether lock is exclusive.
   * @throws { BusinessError } 13900004 - Interrupted system call
   * @throws { BusinessError } 13900008 - Bad file descriptor
   * @throws { BusinessError } 13900020 - Invalid argument
   * @throws { BusinessError } 13900034 - Operation would block
   * @throws { BusinessError } 13900042 - Unknown error
   * @throws { BusinessError } 13900043 - No record locks available
   * @syscap SystemCapability.FileManagement.File.FileIO
   * @since 9
   */
  tryLock(exclusive?: boolean): void;

  /**
   * Unlock file.
   *
   * @throws { BusinessError } 13900004 - Interrupted system call
   * @throws { BusinessError } 13900008 - Bad file descriptor
   * @throws { BusinessError } 13900020 - Invalid argument
   * @throws { BusinessError } 13900034 - Operation would block
   * @throws { BusinessError } 13900042 - Unknown error
   * @throws { BusinessError } 13900043 - No record locks available
   * @syscap SystemCapability.FileManagement.File.FileIO
   * @since 9
   */
  unlock(): void;
}