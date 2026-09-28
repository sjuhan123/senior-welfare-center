import { getDefaultStore } from 'jotai';
import { isUserTokenValidAtom } from '../store/auth';
import { resetUserInfoAtom } from '../store/user';
import { clearUserToken, clearRefreshToken } from '../utills/persistentStorage';
import { navigationRef } from '../refs/navigationRef';

/**
 * getDefaultStore()는 App.tsx에 별도 jotai <Provider>를 씌우지 않았을 때만 컴포넌트들이 쓰는 것과
 * 같은 store를 가리킨다. 나중에 <Provider>를 추가하게 되면 이 함수가 다른 store에 쓰게 되니 그때 같이 확인할 것.
 */
export async function forceLogout() {
  await clearUserToken();
  await clearRefreshToken();

  const store = getDefaultStore();
  store.set(isUserTokenValidAtom, false);
  store.set(resetUserInfoAtom);

  if (navigationRef.isReady()) {
    navigationRef.reset({ index: 0, routes: [{ name: 'Auth' }] });
  }
}
