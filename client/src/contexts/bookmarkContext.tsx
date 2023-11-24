import { createContext, useContext, useState } from "react";
import { WelfareData } from "../types/welfare";

interface BookmarkListContextProps {
  bookmarkList: WelfareData[];
  updateBookmarkList: (bookmarkList: WelfareData[]) => void;
}

interface BookmarkListProps {
  children: React.ReactNode;
}

const bookmarkListContext = createContext<BookmarkListContextProps | null>(
  null
);

const BookmarkListProvider = ({ children }: BookmarkListProps) => {
  const [bookmarkList, setBookmarkList] = useState<WelfareData[]>([]);

  const updateBookmarkList = (bookmarkList: WelfareData[]) => {
    setBookmarkList(bookmarkList);
  };

  return (
    <bookmarkListContext.Provider value={{ bookmarkList, updateBookmarkList }}>
      {children}
    </bookmarkListContext.Provider>
  );
};

const useBookmarkListContext = () => {
  const context = useContext(bookmarkListContext);

  if (!context) {
    throw new Error(
      "userBookmarkListContext should be used within userContextProvider"
    );
  }

  return context;
};

export { BookmarkListProvider, useBookmarkListContext };
