import * as mockService from "./mockService";
import * as firebaseService from "./firebaseService";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

export const subscribeToItems = useMock ? mockService.subscribeToItems : firebaseService.subscribeToItems;
export const addItem = useMock ? mockService.addItem : firebaseService.addItem;
export const updateItem = useMock ? mockService.updateItem : firebaseService.updateItem;
export const deleteItem = useMock ? mockService.deleteItem : firebaseService.deleteItem;

console.log(`[DataService] Using ${useMock ? "MOCK" : "FIREBASE"} service.`);
