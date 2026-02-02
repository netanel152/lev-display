import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query,
  setDoc,
  getDoc
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { db, storage } from "../lib/firebase";

const COLLECTION_NAME = "displayItems";

export const subscribeToItems = (callback) => {
  console.log(`[FirebaseService] Subscribing to collection: ${COLLECTION_NAME}`);
  const q = query(collection(db, COLLECTION_NAME));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`[FirebaseService] Received ${items.length} items from ${COLLECTION_NAME}`);
    callback(items);
  }, (error) => {
    console.error(`[FirebaseService] Error subscribing to ${COLLECTION_NAME}:`, error);
  });

  return unsubscribe;
};

const uploadImage = async (file) => {
  if (!file) return null;
  console.log(`[FirebaseService] Uploading image: ${file.name} (${file.size} bytes)`);
  try {
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log(`[FirebaseService] Image uploaded successfully. URL: ${url}`);
    return url;
  } catch (error) {
    console.error(`[FirebaseService] Image upload failed:`, error);
    throw error;
  }
};

export const addItem = async (item, imageFile) => {
  console.log(`[FirebaseService] Adding item:`, item.mainName);
  try {
    let imageUrl = item.donorLogo || "";

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...item,
      donorLogo: imageUrl
    });
    
    console.log(`[FirebaseService] Item added successfully. ID: ${docRef.id}`);
    return { id: docRef.id, ...item, donorLogo: imageUrl };
  } catch (error) {
    console.error(`[FirebaseService] Error adding item:`, error);
    throw error;
  }
};

export const updateItem = async (id, data, imageFile) => {
  console.log(`[FirebaseService] Updating item: ${id}`);
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

    console.log(`[FirebaseService] Item updated successfully: ${id}`);
    return { id, ...data, donorLogo: imageUrl };
  } catch (error) {
    console.error(`[FirebaseService] Error updating item ${id}:`, error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  console.log(`[FirebaseService] Deleting item: ${id}`);
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.donorLogo) {
        try {
          console.log(`[FirebaseService] Attempting to delete associated image: ${data.donorLogo}`);
          // Create a reference to the file to delete
          // Note: Ref creation from URL can be tricky, typically better to store storage path or handle via URL ref
          const imageRef = ref(storage, data.donorLogo);
          await deleteObject(imageRef);
          console.log(`[FirebaseService] Associated image deleted.`);
        } catch (storageError) {
          console.warn(`[FirebaseService] Warning: Failed to delete image for item ${id}. It may be an external URL or already deleted. Error:`, storageError);
          // Continue to delete doc even if image delete fails
        }
      }
    } else {
      console.warn(`[FirebaseService] Document ${id} not found before delete.`);
    }

    await deleteDoc(docRef);
    console.log(`[FirebaseService] Item deleted successfully: ${id}`);
    return true;
  } catch (error) {
    console.error(`[FirebaseService] Error deleting item ${id}:`, error);
    throw error;
  }
};

export const subscribeToSettings = (callback) => {
  console.log(`[FirebaseService] Subscribing to settings.`);
  const docRef = doc(db, "settings", "general");
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(`[FirebaseService] Settings updated:`, data);
      callback(data);
    } else {
      console.log(`[FirebaseService] No settings found. Using defaults.`);
      callback({ slideDuration: 5000 });
    }
  }, (error) => {
    console.error(`[FirebaseService] Error fetching settings:`, error);
  });
  return unsubscribe;
};

export const updateSettings = async (newSettings) => {
  console.log(`[FirebaseService] Updating settings:`, newSettings);
  try {
    const docRef = doc(db, "settings", "general");
    await setDoc(docRef, newSettings, { merge: true });
    console.log(`[FirebaseService] Settings saved successfully.`);
    return newSettings;
  } catch (error) {
    console.error(`[FirebaseService] Error updating settings:`, error);
    throw error;
  }
};
