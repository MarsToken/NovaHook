/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { hilog } from '@kit.PerformanceAnalysisKit';

const LOGGER_PREFIX: string = 'Hook_Lib'
class Logger {
  private domain: number;
  private prefix: string;
  // format Indicates the log format string.
  private format: string = '%{public}s';

  /**
   * constructor.
   *
   * @param prefix Identifies the log tag.
   * @param domain Indicates the service domain, which is a hexadecimal integer ranging from 0x0 to 0xFFFFF
   * @param args Indicates the log parameters.
   */
  constructor(prefix: string = '', domain: number = 0xFF00) {
    this.prefix = prefix;
    this.domain = domain;
  }

  d(args: string): void {
    hilog.debug(this.domain, this.prefix, this.format, args);
  }

  i(args: string): void {
    hilog.info(this.domain, this.prefix, this.format, args);
  }

  w(args: string): void {
    hilog.warn(this.domain, this.prefix, this.format, args);
  }

  e(args: string): void {
    hilog.error(this.domain, this.prefix, this.format, args);
  }
}

export default new Logger(LOGGER_PREFIX, 0xFF02);