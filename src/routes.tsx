import { Navigate, Route, Routes } from "react-router-dom";
import Categories from "./pages/Categories";
import Home from "./pages/Home";

const Rotas = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/restaurante/:id" element={<Categories />} />
        <Route path="/perfil" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Home />} />
    </Routes>
);

export default Rotas;
