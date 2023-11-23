export class PersistentStorage {
  public key;

  constructor(key: string) {
    this.key = key;
  }

  set(value: unknown) {
    window.localStorage.setItem(this.key, JSON.stringify(value));
  }

  get() {
    const rawValue = window.localStorage.getItem(this.key);
    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue);
  }

  delete() {
    window.localStorage.removeItem(this.key);
  }
}

const USER_TOKEN = "userToken";

export const getUserToken = () => {
  const userStorage = new PersistentStorage(USER_TOKEN);
  return userStorage.get();
};

export const setUserToken = (token: string) => {
  const userStorage = new PersistentStorage(USER_TOKEN);
  userStorage.set(token);
};

export const clearUserToken = () => {
  const userStorage = new PersistentStorage(USER_TOKEN);
  userStorage.delete();
};
