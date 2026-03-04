import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import app from "./firebase";
import type { Stock } from "@/types";

const db = getFirestore(app);

export interface FirestoreUser {
  name: string;
  email: string;
  photoURL: string;
}

export async function upsertUser(
  uid: string,
  data: FirestoreUser,
): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    { ...data, createdAt: serverTimestamp() },
    { merge: true },
  );
}

export async function getUserPortfolio(uid: string): Promise<Stock[]> {
  const snap = await getDocs(collection(db, "users", uid, "portfolio"));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ticker: data.ticker as string,
      name: data.name as string,
      currentPrice: data.currentPrice as number,
      currency: data.currency as string,
      exchange: data.exchange as string,
    };
  });
}

export async function saveStock(uid: string, stock: Stock): Promise<void> {
  await setDoc(doc(db, "users", uid, "portfolio", stock.ticker), {
    ...stock,
    addedAt: serverTimestamp(),
  });
}

export async function deleteStock(uid: string, ticker: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "portfolio", ticker));
}
