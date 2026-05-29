import { Route, Routes, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Admin from "./Admin";
import Home from "./Home";
import Product from "./Product";
import "./index.css";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-container">
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo-wrapper">
          <span style={{ fontSize: '20px' }}>🎱</span>
          <h1 className="sidebar-logo">BILLIARD CLUB</h1>
        </div>
        <nav>
          <Link to="/" >Stollar</Link>
          <Link to="/product">Mahsulot qo'shish</Link>
          <Link to="/admin">Stol qo'shish</Link>
        </nav>
      </div>

      <div className="content">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/product" element={<Product />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;