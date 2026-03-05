import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import app from "./firebase";
import type { AuthUser } from "@/components/auth/AuthProvider";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(auth, googleProvider);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(
  callback: (user: AuthUser | null) => void,
): () => void {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    callback({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    });
  });
}
