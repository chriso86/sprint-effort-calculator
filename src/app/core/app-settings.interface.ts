export interface IAppSettings {
  weightings: {
    complexity: number;
    workload: number;
    risk: number;
    uncertainty: number;
  };
  effort: {
    lowest: number;
    highest: number;
  }
}
