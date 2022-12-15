import {IEffortRoomScores} from "../../models/effort-room/effort-room-scores";

export interface ICreateRoomRequest {
  username: string;
  hideScores: boolean;
  scores: IEffortRoomScores
}
