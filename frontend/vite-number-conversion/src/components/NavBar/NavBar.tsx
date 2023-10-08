import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar: React.FC = () => {
  return (
    <div className="meal_nav_bar">
      <div className="meal_nav_content">
        <div className="meal_nav_left">
          Meal<span style={{ color: "blue" }}>City</span>
        </div>
        <div className="meal_nav_middle">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/shops">Shops</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
        <div className="meal_nav_right">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">SignUp</NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
