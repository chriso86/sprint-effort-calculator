import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {credential} from "firebase-admin";
import {resolve} from "path";

const isEmulated = process.env.FUNCTIONS_EMULATOR === "true";

console.log(isEmulated, "IS EMULATED");

if (isEmulated) {
  initializeApp({
    credential: credential.cert(resolve("../private/service-account.json")),
  });
} else {
  initializeApp();
}

export const db = getFirestore();
