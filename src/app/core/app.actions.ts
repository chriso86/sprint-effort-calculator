import {IEffort, IWeightings} from "./app-settings.interface";

export class UpdateSettings {
  public static readonly type = '[APP] Update Settings';

  constructor(public weightings: IWeightings, public effort: IEffort) {
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

export class ToggleAdvancedSettings {
  public static readonly type = '[APP] Toggle Advanced Settings';

  constructor(public state: 'open' | 'close') {
  }
}

export class CreateRoom {
  public static readonly type = '[APP] Create Room';

  constructor(public username: string, public hideScores: boolean) {
  }
}

export class GetUsersForRoom {
  public static readonly type = '[APP] Get Users for Room';

  constructor(public roomId: string) {
  }
}

export class AddUserToRoom {
  public static readonly type = '[APP] Add User to Room';

  constructor(public roomId: string, public username: string) {
  }
}

export class RemoveUserFromRoom {
  public static readonly type = '[APP] Remove User from Room';

  constructor(public roomId: string, public username: string) {
  }
}

export class SetComplexityForUserInRoom {
  public static readonly type = '[APP] Set Complexity for User in Room';

  constructor(public roomId: string, public username: string, public complexity: number) {
  }
}

export class SetWorkloadForUserInRoom {
  public static readonly type = '[APP] Set Workload for User in Room';

  constructor(public roomId: string, public username: string, public workload: number) {
  }
}

export class SetRiskForUserInRoom {
  public static readonly type = '[APP] Set Risk for User in Room';

  constructor(public roomId: string, public username: string, public risk: number) {
  }
}

export class SetUncertaintyForUserInRoom {
  public static readonly type = '[APP] Set Uncertainty for User in Room';

  constructor(public roomId: string, public username: string, public uncertainty: number) {
  }
}

export class ShowAllScoresInRoom {
  public static readonly type = '[APP] Show all scores in Room';

  constructor(public roomId: string) {
  }
}

export class ToggleHideScoresForRoom {
  public static readonly type = '[APP] Toggle Hide Scores for Room';

  constructor(public roomId: string, public hide: boolean) {
  }
}

export class EmailSessionToEmails {
  public static readonly type = '[APP] Email Session to Email(s)';

  constructor(public roomId: string, public emails: string[]) {
  }
}
