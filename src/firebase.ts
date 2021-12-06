import { initializeApp, getApps } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

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

const auth = getAuth();
auth.useDeviceLanguage();

export const user = auth.currentUser;
export const isAuthorized = () => !!user;

export const login = async (
  email: string,
  password: string
): Promise<string | UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password).catch(
    (e) => e as string
  );
};
export const signup = async (
  email: string,
  password: string
): Promise<string | UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password).catch(
    (e) => e as string
  );
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
