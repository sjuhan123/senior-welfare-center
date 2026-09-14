import AsyncStorage from '@react-native-async-storage/async-storage';

export class PersistentStorage {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  async set(value: string) {
    await AsyncStorage.setItem(this.key, JSON.stringify(value));
  }

  async get(): Promise<string | null> {
    const rawValue = await AsyncStorage.getItem(this.key);
    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as string;
  }

  async delete() {
    await AsyncStorage.removeItem(this.key);
  }
}

const USER_TOKEN = 'userToken';
const REFRESH_TOKEN = 'refreshToken';

const userTokenStorage = new PersistentStorage(USER_TOKEN);
const refreshTokenStorage = new PersistentStorage(REFRESH_TOKEN);

export const getUserToken = (): Promise<string | null> => {
  return userTokenStorage.get();
};

export const setUserToken = async (token: string) => {
  return await userTokenStorage.set(token);
};

export const clearUserToken = () => {
  return userTokenStorage.delete();
};

export const getRefreshToken = (): Promise<string | null> => {
  return refreshTokenStorage.get();
};

export const setRefreshToken = (token: string) => {
  return refreshTokenStorage.set(token);
};

export const clearRefreshToken = () => {
  return refreshTokenStorage.delete();
};
