import { useEffect } from 'react';

const useClickOutside = (
  ref: React.RefObject<HTMLDivElement>,
  onClickOutside: () => void,
) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside();
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClickOutside();
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [onClickOutside, ref]);
};

export default useClickOutside;
