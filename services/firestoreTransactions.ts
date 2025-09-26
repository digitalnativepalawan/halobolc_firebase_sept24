import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AnyTransaction } from "../types";

const TRANSACTIONS_COLLECTION = "transactions";

export const listenTransactions = (callback: (transactions: AnyTransaction[]) => void) => {
  return onSnapshot(collection(db, TRANSACTIONS_COLLECTION), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnyTransaction));
    callback(data);
  });
};

export const getTransactions = async (): Promise<AnyTransaction[]> => {
  const snapshot = await getDocs(collection(db, TRANSACTIONS_COLLECTION));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnyTransaction));
};

export const addTransaction = async (transaction: Omit<AnyTransaction, "id">) => {
  const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), transaction);
  return { id: docRef.id, ...transaction };
};

export const updateTransaction = async (id: string, updates: Partial<AnyTransaction>) => {
  await updateDoc(doc(db, TRANSACTIONS_COLLECTION, id), updates);
};

export const deleteTransaction = async (id: string) => {
  await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, id));
};

export const resetTransactions = async () => {
  const snapshot = await getDocs(collection(db, TRANSACTIONS_COLLECTION));
  const batch = db.batch();
  snapshot.docs.forEach(docRef => batch.delete(docRef.ref));
  await batch.commit();
};
