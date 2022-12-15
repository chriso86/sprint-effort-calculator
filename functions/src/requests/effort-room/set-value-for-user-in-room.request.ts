export interface ISetValueForUserInRoomRequest {
  roomId: string;
  username: string;
  property: "complexity" | "workload" | "risk" | "uncertainty";
  value: number;
}
