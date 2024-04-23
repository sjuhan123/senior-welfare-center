import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

interface DropdownContextProps {
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const DropdownContext = createContext<DropdownContextProps | null>(null);

export const DropdownProvider = ({ children }: PropsWithChildren) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <DropdownContext.Provider
      value={{
        isDropdownOpen,
        toggleDropdown,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

export default DropdownContext;

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('useDropdownContext must be used within DropdownProvider');
  }

  return context;
};
