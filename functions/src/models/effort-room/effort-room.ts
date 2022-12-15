import {ITeamMember} from "./team-member";

export interface IEffortRoom {
  id: string;
  createdBy: string;
  hideScores: boolean; // If this is true, the setting below means nothing
  showScoreNow: boolean; // Whether it's time to show the scores or not
  teamMembers: ITeamMember[];
}
