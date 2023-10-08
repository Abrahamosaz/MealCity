import { Outlet } from "react-router-dom";
import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import ScrollToTop from "../../utils/ScrollToTop";
import "./Home.css";

const Home = () => {
  return (
    <div className="meal_home">
      <NavBar />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Home;
