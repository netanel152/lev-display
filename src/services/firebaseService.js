import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query,
  setDoc
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import { db, storage } from "../lib/firebase";

const COLLECTION_NAME = "displayItems";

export const subscribeToItems = (callback) => {
  const q = query(collection(db, COLLECTION_NAME));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(items);
  }, (error) => {
    console.error("Error fetching firebase items:", error);
  });

  return unsubscribe;
};

const uploadImage = async (file) => {
  if (!file) return null;
  const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const addItem = async (item, imageFile) => {
  try {
    let imageUrl = item.donorLogo || "";

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...item,
      donorLogo: imageUrl
    });

    return { id: docRef.id, ...item, donorLogo: imageUrl };
  } catch (error) {
    console.error("Error adding firebase item:", error);
    throw error;
  }
};

export const updateItem = async (id, data, imageFile) => {
  try {
    let imageUrl = data.donorLogo || "";

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const itemRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(itemRef, {
      ...data,
      donorLogo: imageUrl
    });

    return { id, ...data, donorLogo: imageUrl };
  } catch (error) {
    console.error("Error updating firebase item:", error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error("Error deleting firebase item:", error);
    throw error;
  }
};

export const subscribeToSettings = (callback) => {
  const docRef = doc(db, "settings", "general");
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      // Default settings if document doesn't exist
      callback({ slideDuration: 5000 });
    }
  }, (error) => {
    console.error("Error fetching settings:", error);
  });
  return unsubscribe;
};

export const updateSettings = async (newSettings) => {
  try {
    const docRef = doc(db, "settings", "general");
    await setDoc(docRef, newSettings, { merge: true });
    return newSettings;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};