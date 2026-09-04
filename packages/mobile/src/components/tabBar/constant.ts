import { ROUTE_PATH } from '../../constant/route';

export const PAGE_LIST = [
  {
    ko: '복지관',
    en: 'WelfareList',
    path: ROUTE_PATH.WELFARE_LIST,
  },
  {
    ko: '관심목록',
    en: 'wishWelfareList',
    path: ROUTE_PATH.WISH_WELFARE_LIST,
  },
  {
    ko: '계정',
    en: 'myAccount',
    path: ROUTE_PATH.MY_ACCOUNT,
  },
] as const;
