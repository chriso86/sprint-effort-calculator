import * as functions from "firebase-functions";
import {EffortRoomController} from "./effort-room.controller";

const effortRoomController = new EffortRoomController();

export const createRoom = functions.https.onRequest((request, response) => {
  return effortRoomController.createRoom(request.body, response);
});

export const getUsersForRoom = functions.https.onRequest((request, response) => {
  return effortRoomController.getUsersForRoom(request.body, response);
});

export const addUserToRoom = functions.https.onRequest((request, response) => {
  return effortRoomController.addUserToRoom(request.body, response);
});

export const removeUserFromRoom = functions.https.onRequest((request, response) => {
  return effortRoomController.removeUserFromRoom(request.body, response);
});

export const setValueForUserInRoom = functions.https.onRequest((request, response) => {
  return effortRoomController.setValueForUserInRoom(request.body, response);
});

export const showAllScoresInRoom = functions.https.onRequest((request, response) => {
  return effortRoomController.showAllScoresInRoom(request.body, response);
});

export const toggleHideScoresForRoom = functions.https.onRequest((request, response) => {
  return effortRoomController.toggleHideScoresForRoom(request.body, response);
});
