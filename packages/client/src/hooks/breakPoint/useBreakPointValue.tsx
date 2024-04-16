import { maxWidths } from '@common/shared';
import { useState, useEffect } from 'react';
import BREAKE_POINT from './constant';

const useBreakPointValue = () => {
  const [breakPointValue, setBreakPointValue] = useState('');

  useEffect(() => {
    const updateBreakPoint = () => {
      if (window.innerWidth < maxWidths.mobile) {
        setBreakPointValue(BREAKE_POINT.MOBILE);
      } else if (window.innerWidth < maxWidths.tablet) {
        setBreakPointValue(BREAKE_POINT.TABLET);
      } else {
        setBreakPointValue(BREAKE_POINT.DESKTOP);
      }
    };

    window.addEventListener('resize', updateBreakPoint);

    return () => window.removeEventListener('resize', updateBreakPoint);
  }, []);

  return breakPointValue;
};

export default useBreakPointValue;