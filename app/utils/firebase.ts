import { firebase } from "@nativescript/firebase";

export function initialize() {
  return firebase.init()
}
