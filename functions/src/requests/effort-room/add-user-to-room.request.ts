import {IEffortRoomScores} from "../../models/effort-room/effort-room-scores";

export interface IAddUserToRoomRequest {
  roomId: string;
  username: string;
  scores: IEffortRoomScores
}
