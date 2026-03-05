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

export async function upsertUser(
  uid: string,
  data: { name: string | null; email: string | null; photoURL: string | null },
): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    {
      name: data.name,
      email: data.email,
      photoURL: data.photoURL,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getUserPortfolio(userId: string): Promise<Stock[]> {
  const snapshot = await getDocs(collection(db, "users", userId, "portfolio"));
  return snapshot.docs.map((d) => {
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

export async function saveStock(userId: string, stock: Stock): Promise<void> {
  await setDoc(doc(db, "users", userId, "portfolio", stock.ticker), {
    ticker: stock.ticker,
    name: stock.name,
    currentPrice: stock.currentPrice,
    currency: stock.currency,
    exchange: stock.exchange,
    addedAt: serverTimestamp(),
  });
}

export async function deleteStock(
  userId: string,
  ticker: string,
): Promise<void> {
  await deleteDoc(doc(db, "users", userId, "portfolio", ticker));
}
