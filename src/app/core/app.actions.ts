import {IAppSettings} from "./app-settings.interface";

export class UpdateSettings {
  public static readonly type = '[APP] Update Settings';

  constructor(public settings: IAppSettings) {
  }
}
