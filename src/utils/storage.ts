import { documentDirectory, readAsStringAsync, writeAsStringAsync, getInfoAsync } from 'expo-file-system/legacy';
import { StateStorage } from 'zustand/middleware';

const STORAGE_FILE_PATH = `${documentDirectory || ''}antyo_finance_store.json`;

export const expoFileSystemStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const fileInfo = await getInfoAsync(STORAGE_FILE_PATH);
      if (!fileInfo.exists) {
        return null;
      }
      const content = await readAsStringAsync(STORAGE_FILE_PATH);
      const data = JSON.parse(content);
      // return the stringified state for the store key
      return data[name] !== undefined ? JSON.stringify(data[name]) : null;
    } catch (error) {
      console.error('Error reading from expo-file-system storage:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const fileInfo = await getInfoAsync(STORAGE_FILE_PATH);
      let data: Record<string, any> = {};
      if (fileInfo.exists) {
        const content = await readAsStringAsync(STORAGE_FILE_PATH);
        try {
          data = JSON.parse(content);
        } catch {
          data = {};
        }
      }
      data[name] = JSON.parse(value);
      await writeAsStringAsync(STORAGE_FILE_PATH, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to expo-file-system storage:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      const fileInfo = await getInfoAsync(STORAGE_FILE_PATH);
      if (fileInfo.exists) {
        const content = await readAsStringAsync(STORAGE_FILE_PATH);
        let data: Record<string, any> = {};
        try {
          data = JSON.parse(content);
        } catch {
          data = {};
        }
        delete data[name];
        await writeAsStringAsync(STORAGE_FILE_PATH, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error removing from expo-file-system storage:', error);
    }
  },
};
