import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  collection,
  updateDoc,
  getDocs,
  setDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const collectionName = "users";

export const doCreateUserWithEmailAndPassword = async (
  email,
  password,
  name,
  isAdm
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
    isAdm
  );
  const user = userCredential.user;

  addUserDataToFirestore(user.uid, user.email, name, isAdm);
};

export const addUserDataToFirestore = async (uid, email, name, isAdm) => {
  try {
    const user = {
      uid,
      email,
      name,
      isAdm,
      task: [],
      category: [],
    };

    const userDocRef = doc(db, collectionName, user.uid);

    await setDoc(userDocRef, user);
    console.log("Dados do usuário adicionados ao Firestore.");
  } catch (error) {
    console.error(
      "Erro ao adicionar dados do usuário ao Firestore:",
      error.message
    );
    throw error;
  }
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignOut = () => {
  return auth.signOut();
};

export const getUserDoc = async (documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("Documento não encontrado!");
      return null;
    }
  } catch (error) {
    console.error("Erro ao obter documento:", error);
    return null;
  }
};

export const addTask = async (docId, novoObjeto) => {
  try {
    const docRef = doc(db, collectionName, docId);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { task } = docSnap.data();

      const novoArrayTarefas = [...task, novoObjeto];

      await updateDoc(docRef, { task: novoArrayTarefas });

      console.log("Objeto adicionado ao array com sucesso!");
    } else {
      console.log("Documento não encontrado!");
    }
  } catch (error) {
    console.error("Erro ao adicionar objeto ao array:", error);
  }
};

export const addCategory = async (docId, novoObjeto) => {
  try {
    const docRef = doc(db, collectionName, docId);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { category } = docSnap.data();

      const novoArrayTarefas = [...category, novoObjeto];

      await updateDoc(docRef, { category: novoArrayTarefas });

      console.log("Objeto adicionado ao array com sucesso!");
    } else {
      console.log("Documento não encontrado!");
    }
  } catch (error) {
    console.error("Erro ao adicionar objeto ao array:", error);
  }
};

export const updateTask = async (docId, updatedTask) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { task: updatedTask });
      console.log("Documento atualizado com sucesso!");
    } else {
      console.log("Documento não encontrado!");
    }
  } catch (error) {
    console.error("Erro ao atualizar documento:", error);
  }
};

export const updateCategory = async (docId, updatedTask) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { category: updatedTask });
      console.log("Documento atualizado com sucesso!");
    } else {
      console.log("Documento não encontrado!");
    }
  } catch (error) {
    console.error("Erro ao atualizar documento:", error);
  }
};

export const getAllUsers = async () => {
  try {
    const myQuery = query(
      collection(db, collectionName),
      where("isAdm", "==", false)
    );
    const querySnapshot = await getDocs(myQuery);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return documents;
  } catch (error) {
    console.error("Erro ao obter documentos:", error);

    return [];
  }
};
