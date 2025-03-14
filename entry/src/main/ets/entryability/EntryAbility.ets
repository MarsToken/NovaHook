import Logger from 'novahook/src/main/com/wp/aop/utils/Logger';
import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { window } from '@kit.ArkUI';
import { Global } from 'proxy';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    Global.getInstance().setUIAbilityContext(this.context)
  }


  onWindowStageCreate(windowStage: window.WindowStage): void {

    windowStage.loadContent('pages/HomePage', (err) => {
      if (err.code) {
        Logger.e(`Failed to load the content. Cause:${JSON.stringify(err)}`)
        return;
      }
    });

  }
}
