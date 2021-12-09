import { initializeApp, getApps } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
export { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { createContext, useContext } from "react";
import { SSEvent } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyBRlmRJ9rG6TbV2TxOpGSwMjErTLjct0Ak",
  authDomain: "super-secret-santa-245ae.firebaseapp.com",
  projectId: "super-secret-santa-245ae",
  storageBucket: "super-secret-santa-245ae.appspot.com",
  messagingSenderId: "208392692182",
  appId: "1:208392692182:web:d110de3f3ceb0b4b458477",
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps();
}

const db = getFirestore();

export const getEvents = async (): Promise<SSEvent[]> => {
  if (!user) return [];
  const q = query(
    collection(db, "events"),
    where("people", "array-contains", user.displayName)
  );
  const qSnapshot = await getDocs(q);
  if (qSnapshot.size === 0) return [];
  return qSnapshot.docs.map((event) => ({
    id: event.id,
    title: event.data().title,
    people: event.data().people,
    drawDate: event.data().drawDate,
  }));
};

const auth = getAuth();
auth.useDeviceLanguage();

export const user = auth.currentUser;
export const isAuthorized = user !== null;

type ContextProps = {
  userCred?: User | null;
  setUserCred: (userCred: User | null) => void;
  loadingAuthState?: boolean;
};
export const AuthContext = createContext<Partial<ContextProps>>({
  userCred: user,
});

export const login = async (
  email: string,
  password: string,
  authContext: Partial<ContextProps>
): Promise<string | UserCredential> => {
  const result = await signInWithEmailAndPassword(auth, email, password)
    .then((userCred) => {
      authContext.setUserCred?.(userCred.user);
      return userCred;
    })
    .catch((e) => {
      authContext.setUserCred?.(null);
      return e as string;
    });
  return result;
};
export const signup = async (
  email: string,
  password: string,
  displayName: string,
  authContext: Partial<ContextProps>
): Promise<string | UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCred) => {
      const setNameRes = await updateProfile(userCred.user, { displayName })
        .then((_) => undefined)
        .catch((e) => e as string);
      if (setNameRes) return setNameRes;
      authContext.setUserCred?.(userCred.user);
      return userCred;
    })
    .catch((e) => {
      authContext.setUserCred?.(null);
      return e as string;
    });
};

//TODO: add phone auth (requires detaching expo)
// interface Response {
//   success: boolean;
//   msg?: string;
//   confirmationResult?: ConfirmationResult
// }
// export const signIn = async (
//   phoneNumber: string,
//   verifierCallback?: (r: any) => void
// ): Response => {
//   const appVerifier = new RecaptchaVerifier(
//     "sign-in-button",
//     {
//       size: "invisible",
//       callback: (response: any) => verifierCallback?.(response),
//     },
//     auth
//   );

//   let response: Response;
//   response = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//     .then((confirmationResult) => {
//       response = {
//         success: true,
//         confirmationResult,
//       };
//       return response
//     })
//     .catch((e) => {
//       response = {
//         success: false,
//         msg: `ERR SMS not sent. Details: ${e}`,
//       };
//       return response
//     });
// };
