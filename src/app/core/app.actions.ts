import {IAppSettings, IEffort, IWeightings} from "./app-settings.interface";

export class UpdateSettings {
  public static readonly type = '[APP] Update Settings';

  constructor(public settings: IAppSettings) {
  }
}

export class UpdateWeightings {
  public static readonly type = '[APP] Update Weightings';

  constructor(public weightings: IWeightings) {
  }
}

export class UpdateEffort {
  public static readonly type = '[APP] Update Effort';

  constructor(public effort: IEffort) {
  }
}
