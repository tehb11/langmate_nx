import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const readStorage = async (key: string): Promise<string | null> => {
  try {
    const value = storage.getString(key);
    return value || null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

export const writeStorage = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    storage.set(key, value);
  } catch (error) {
    console.error('Error writing to storage:', error);
    throw error;
  }
};

export const deleteStorage = async (key: string): Promise<void> => {
  try {
    storage.delete(key);
  } catch (error) {
    console.error('Error deleting from storage:', error);
    throw error;
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    storage.clearAll();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

export const getAllKeys = (): string[] => {
  try {
    return storage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

export const containsKey = (key: string): boolean => {
  try {
    return storage.contains(key);
  } catch (error) {
    console.error('Error checking key existence:', error);
    return false;
  }
};

// Дополнительные методы для работы с разными типами данных
export const writeBoolean = async (
  key: string,
  value: boolean
): Promise<void> => {
  try {
    storage.set(key, value);
  } catch (error) {
    console.error('Error writing boolean to storage:', error);
    throw error;
  }
};

export const readBoolean = async (key: string): Promise<boolean | null> => {
  try {
    const value = storage.getBoolean(key);
    return value !== undefined ? value : null;
  } catch (error) {
    console.error('Error reading boolean from storage:', error);
    return null;
  }
};

export const writeNumber = async (
  key: string,
  value: number
): Promise<void> => {
  try {
    storage.set(key, value);
  } catch (error) {
    console.error('Error writing number to storage:', error);
    throw error;
  }
};

export const readNumber = async (key: string): Promise<number | null> => {
  try {
    const value = storage.getNumber(key);
    return value !== undefined ? value : null;
  } catch (error) {
    console.error('Error reading number from storage:', error);
    return null;
  }
};

export const writeObject = async (
  key: string,
  value: object
): Promise<void> => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing object to storage:', error);
    throw error;
  }
};

export const readObject = async <T>(key: string): Promise<T | null> => {
  try {
    const value = storage.getString(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Error reading object from storage:', error);
    return null;
  }
};
