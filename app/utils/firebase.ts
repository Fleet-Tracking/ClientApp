import { firebase } from "@nativescript/firebase";
import { PHONE_NUMBER } from "./constants";

let initialized = false

export async function initialize() {
  const url = await firebase.init()
  initialized = true
  return url
}

export async function login() {
  if (initialized) {
    return firebase
      .login({
        type: firebase.LoginType.PHONE,
        phoneOptions: { phoneNumber: PHONE_NUMBER },
      })
  } else {
    throw new Error("Firebase instance not initialized")
  }
}

export function onAuthStateChange(onAuthStateChanged: ((data: firebase.AuthStateData) => void)) {
  firebase.addAuthStateListener({
    onAuthStateChanged
  })
}

export async function setInitialUserData() {
  const user = await firebase.getCurrentUser()
  if (user && user.phoneNumber) {
    firebase.setValue('/users/' + user.uid, {
      phone: user.phoneNumber,
      role: 'DELIVERY'
    })
  }
}
