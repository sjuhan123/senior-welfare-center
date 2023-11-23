import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Auth from "./pages/Auth";

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/oauth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
