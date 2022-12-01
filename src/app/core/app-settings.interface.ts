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
  members: string[];
  workItems: IWorkItem[];
}

export interface IWorkItem {
  description: string;
  notes: string[];
  teamRatings: ITeamMemberEntry[];
}

export interface ITeamMemberEntry {
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
