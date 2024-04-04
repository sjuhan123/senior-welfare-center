export class PersistentStorage {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  set(value: string) {
    window.localStorage.setItem(this.key, JSON.stringify(value));
  }

  get(): string | null {
    const rawValue = window.localStorage.getItem(this.key);
    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as string;
  }

  delete() {
    window.localStorage.removeItem(this.key);
  }
}

const USER_TOKEN = 'userToken';

const userStorage = new PersistentStorage(USER_TOKEN);

export const getUserToken = (): string | null => {
  return userStorage.get();
};

export const setUserToken = (token: string) => {
  userStorage.set(token);
};

export const clearUserToken = () => {
  userStorage.delete();
};
