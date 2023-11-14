import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import List from "./pages/List";

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/list" element={<List />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
