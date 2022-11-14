export interface IAppSettings {
  weightings: IWeightings;
  effort: IEffort;
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
