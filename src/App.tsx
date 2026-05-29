import { Route, Routes, Link } from "react-router-dom";

import { useState } from "react";

import Admin from "./Admin";

import Home from "./Home";

import Product from "./Product";

import "./index.css";



const App = () => {

  const [isOpen, setIsOpen] = useState(false);



  return (

    <div className="app-container">

      <button className="menu-toggle" onClick={() => setIsOpen(true)}>

        ☰

      </button>



      <div className={`sidebar ${isOpen ? "open" : ""}`}>

        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>

        <h1 className="sidebar-logo">BILLIARD</h1>

        <nav>

          <Link to="/" onClick={() => setIsOpen(false)}>🏠 Dashboard</Link>

          <Link to="/product" onClick={() => setIsOpen(false)}>🍔 Bar Product</Link>

          <Link to="/admin" onClick={() => setIsOpen(false)}>⚙️ Admin</Link>

        </nav>

      </div>



      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}



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