export interface IAppSettings {
  weightings: IWeightings;
  effort: IEffort;
  isAdvancedSettingsOpen: boolean;
  fibonacciSequence: number[];
  room?: IRoom;
}

export interface IRoom {
  roomId: string;
  createdAt: Date;
  members: ITeamMember[];
}

export interface ITeamMember {
  username: string;
  complexity: number;
  workload: number;
  risk: number;
  uncertainty: number;
}

export interface IWeightings {
  complexity: number;
  workload: number;
  risk: number;
  uncertainty: number;
}

export interface  IEffort {
  lowest: number;
  highest: number;
}
