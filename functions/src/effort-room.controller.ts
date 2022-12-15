import {IAddUserToRoomRequest} from "./requests/effort-room/add-user-to-room.request";
import * as express from "express";
import {ICreateRoomRequest} from "./requests/effort-room/create-room.request";
import {IEmailSessionToEmailsRequest} from "./requests/effort-room/email-session-to-emails.request";
import {ISetValueForUserInRoomRequest} from "./requests/effort-room/set-value-for-user-in-room.request";
import {IShowAllScoresInRoomRequest} from "./requests/effort-room/show-all-scores-in-room.request";
import {IToggleHideScoresForRoomRequest} from "./requests/effort-room/toggle-hide-scores-for-room.request";
import {IRemoveUserFromRoomRequest} from "./requests/effort-room/remove-user-from-room.request";
import {IGetUsersForRoomRequest} from "./requests/effort-room/get-users-for-room.request";
import {ICreateRoomResponse} from "./responses/effort-room/create-room.response";
import {IGetUsersForRoomResponse} from "./responses/effort-room/get-users-for-room.response";
import {db} from "./connection";
import {firestore} from "firebase-admin";
import {IEffortRoom} from "./models/effort-room/effort-room";
import CollectionReference = firestore.CollectionReference;

export class EffortRoomController {
  public collection: CollectionReference<IEffortRoom>;

  constructor() {
    this.collection = db.collection("effort-room") as CollectionReference<IEffortRoom>;
  }

  public async createRoom(
      request: ICreateRoomRequest,
      response: express.Response<ICreateRoomResponse>
  ) {
    try {
      const docRef = this.collection.doc();

      await docRef.update({
        id: docRef.id,
        createdBy: request.username,
        hideScores: request.hideScores,
        teamMembers: [{
          username: request.username,
          complexityScore: request.scores?.complexity ?? 1,
          workloadScore: request.scores?.workload ?? 1,
          riskScore: request.scores?.risk ?? 1,
          uncertaintyScore: request.scores?.uncertainty ?? 1,
        }],
      });

      console.log("Document written with ID: ", docRef.id);

      response.send({
        roomId: docRef.id,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  public async getUsersForRoom(
      request: IGetUsersForRoomRequest,
      response: express.Response<IGetUsersForRoomResponse>
  ) {
    try {
      const users = await this.collection
          .where("id", "==", request.roomId)
          .get();

      response.send({
        teamMembers: users
            .docs
            .map((r) => r.data().teamMembers)
            .flat(),
      });
    } catch (e) {
      console.error("Error retrieving users: ", e);
    }
  }

  public async addUserToRoom(
      request: IAddUserToRoomRequest,
      response: express.Response<void>
  ) {
    try {
      const firstEffortRoom = await this.getRoom(request.roomId);

      if (firstEffortRoom) {
        const existingUser = firstEffortRoom.teamMembers
            .find((u) => {
              return u.username === request.username;
            }) ?? null;

        if (!existingUser) {
          firstEffortRoom.teamMembers.push({
            username: request.username,
            complexityScore: request.scores.complexity,
            workloadScore: request.scores.workload,
            riskScore: request.scores.risk,
            uncertaintyScore: request.scores.uncertainty,
          });

          await this.collection
              .doc(firstEffortRoom.id)
              .update(firstEffortRoom);
        }
      }

      response.send();
    } catch (e) {
      console.error("Error adding user to room: ", e);
    }
  }

  public async removeUserFromRoom(
      request: IRemoveUserFromRoomRequest,
      response: express.Response<void>
  ) {
    try {
      const firstEffortRoom = await this.getRoom(request.roomId);

      if (firstEffortRoom) {
        const existingUserIndex = firstEffortRoom.teamMembers
            .findIndex((u) => {
              return u.username === request.username;
            }) ?? null;

        if (existingUserIndex > -1) {
          firstEffortRoom.teamMembers.splice(existingUserIndex, 1);

          await this.collection
              .doc(firstEffortRoom.id)
              .update(firstEffortRoom);
        }
      }

      response.send();
    } catch (e) {
      console.error("Error removing user from room: ", e);
    }
  }

  public async setValueForUserInRoom(
      request: ISetValueForUserInRoomRequest,
      response: express.Response<void>
  ) {
    try {
      const firstEffortRoom = await this.getRoom(request.roomId);

      if (firstEffortRoom) {
        const existingUser = firstEffortRoom.teamMembers
            .find((u) => {
              return u.username === request.username;
            }) ?? null;
        const valueProperty = `${request.property}Score`;

        if (existingUser) {
          firstEffortRoom.teamMembers = [
            ...firstEffortRoom.teamMembers.filter((u) => u.username !== existingUser.username),
            {
              ...existingUser,
              [valueProperty]: request.value,
            },
          ];

          await this.collection
              .doc(firstEffortRoom.id)
              .update(firstEffortRoom);
        }
      }

      response.send();
    } catch (e) {
      console.error("Error updating score for user: ", e);
    }
  }

  public async showAllScoresInRoom(
      request: IShowAllScoresInRoomRequest,
      response: express.Response<void>
  ) {
    try {
      const firstEffortRoom = await this.getRoom(request.roomId);

      if (firstEffortRoom) {
        await this.collection
            .doc(firstEffortRoom.id)
            .update({
              ...firstEffortRoom,
              showScoreNow: true,
            });
      }

      response.send();
    } catch (e) {
      console.error("Error updating score for user: ", e);
    }
  }

  public async toggleHideScoresForRoom(
      request: IToggleHideScoresForRoomRequest,
      response: express.Response<void>
  ) {
    try {
      const firstEffortRoom = await this.getRoom(request.roomId);

      if (firstEffortRoom) {
        await this.collection
            .doc(firstEffortRoom.id)
            .update({
              ...firstEffortRoom,
              hideScores: request.hide,
            });
      }

      response.send();
    } catch (e) {
      console.error("Error updating score for user: ", e);
    }
  }

  public emailSessionToEmails(
      request: IEmailSessionToEmailsRequest,
      response: express.Response<void>
  ) {
    // TODO: Chris - Implement later
  }

  private async getRoom(roomId: string): Promise<IEffortRoom | undefined> {
    const roomRaw = await this.collection
        .where("id", "==", roomId)
        .get();
    const rooms: IEffortRoom[] = roomRaw.docs
        .map((d) => d.data());

    if (rooms.length) {
      const firstEffortRoom = rooms.shift();

      if (firstEffortRoom) {
        return firstEffortRoom;
      }
    }

    return undefined;
  }
}
